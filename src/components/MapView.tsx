import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Elephant, GeofenceZone, RiskLevel } from '../types';
import { GEOFENCE_ZONES } from '../data/geofences';
import { 
  Layers, 
  Compass, 
  Maximize2, 
  ShieldAlert, 
  Zap, 
  Crosshair, 
  AlertTriangle, 
  MapPin, 
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface MapViewProps {
  elephants: Elephant[];
  selectedElephantId: string | null;
  onSelectElephant: (id: string) => void;
  onOpenDispatch: (elephant: Elephant) => void;
}

type TileLayerType = 'satellite' | 'topo' | 'osm';

export const MapView: React.FC<MapViewProps> = ({
  elephants,
  selectedElephantId,
  onSelectElephant,
  onOpenDispatch,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polygonsRef = useRef<L.Polygon[]>([]);
  
  const [activeTile, setActiveTile] = useState<TileLayerType>('satellite');
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeZoneLegend, setActiveZoneLegend] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center around the reserve (Lat: 11.66, Lng: 76.64)
    const map = L.map(mapContainerRef.current, {
      center: [11.66, 76.64],
      zoom: 12,
      zoomControl: false,
    });

    // Add zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    let attribution = '';
    let maxZoom = 18;

    if (activeTile === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (activeTile === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
      maxZoom = 17;
    } else {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    const layer = L.tileLayer(url, {
      attribution,
      maxZoom,
    }).addTo(map);

    tileLayerRef.current = layer;
  }, [activeTile]);

  // Render Geofence Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean existing polygons
    polygonsRef.current.forEach(p => map.removeLayer(p));
    polygonsRef.current = [];

    if (!showGeofences) return;

    GEOFENCE_ZONES.forEach((zone: GeofenceZone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
        weight: 2,
        dashArray: zone.dashArray || undefined,
      }).addTo(map);

      polygon.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 2px 4px;">
          <strong style="color: ${zone.color};">${zone.name}</strong><br/>
          <span style="color: #475569;">Zone: ${zone.zoneType}</span>
        </div>
      `, {
        sticky: true,
        direction: 'top',
        className: 'geofence-tooltip'
      });

      polygonsRef.current.push(polygon);
    });
  }, [showGeofences]);

  // Render or Update Elephant Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers that no longer exist
    const currentIds = new Set(elephants.map(e => e.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    elephants.forEach(elephant => {
      const isSelected = elephant.id === selectedElephantId;
      const isCritical = elephant.riskLevel === 'Critical';
      const isHigh = elephant.riskLevel === 'High';

      // Determine ring and pulse color
      let ringBorder = 'border-emerald-500 bg-emerald-950/90 text-emerald-300';
      let pulseRing = '';
      if (elephant.riskLevel === 'Critical') {
        ringBorder = 'border-red-500 bg-red-950 text-red-200 ring-2 ring-red-400';
        pulseRing = '<span class="absolute -inset-2 rounded-full animate-ping bg-red-500/40 pointer-events-none"></span>';
      } else if (elephant.riskLevel === 'High') {
        ringBorder = 'border-amber-500 bg-amber-950 text-amber-200 ring-1 ring-amber-400';
        pulseRing = '<span class="absolute -inset-1.5 rounded-full animate-pulse bg-amber-500/30 pointer-events-none"></span>';
      } else if (elephant.riskLevel === 'Moderate') {
        ringBorder = 'border-yellow-500 bg-yellow-950 text-yellow-200';
      }

      // Marker icon HTML
      const htmlContent = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
          ${pulseRing}
          <div class="relative w-10 h-10 rounded-full border-2 ${ringBorder} flex flex-col items-center justify-center shadow-lg transition-transform ${isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'}">
            <!-- Heading arrow -->
            <div style="transform: rotate(${elephant.movement.headingDeg}deg);" class="absolute -top-2 w-3 h-3 text-white flex items-center justify-center drop-shadow-md">
              ▲
            </div>
            <!-- Elephant Icon Glyph -->
            <span class="text-sm font-bold leading-none">🐘</span>
            <!-- Speed badge -->
            <span class="text-[9px] font-mono font-bold leading-none text-white">${elephant.movement.speedKmh.toFixed(1)}k</span>
          </div>
          ${showLabels ? `
            <div class="absolute -bottom-4 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-semibold border border-slate-700 shadow pointer-events-none">
              ${elephant.name} (${elephant.collarId.split('-')[2] || elephant.collarId})
            </div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: htmlContent,
        className: 'elephant-marker-div',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 220px; color: #0f172a; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <div>
              <strong style="font-size: 14px; color: #0f172a;">${elephant.name}</strong>
              <span style="font-size: 11px; color: #64748b; margin-left: 4px;">(${elephant.collarId})</span>
            </div>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${
              elephant.riskLevel === 'Critical' ? '#fee2e2; color: #b91c1c;' :
              elephant.riskLevel === 'High' ? '#ffedd5; color: #c2410c;' :
              elephant.riskLevel === 'Moderate' ? '#fef9c3; color: #a16207;' :
              '#dcfce7; color: #15803d;'
            }">${elephant.riskLevel.toUpperCase()} RISK (${elephant.riskScore}/100)</span>
          </div>

          <div style="font-size: 11px; line-height: 1.5; color: #334155;">
            <div><strong>Zone:</strong> ${elephant.zone}</div>
            <div><strong>Settlement Proximity:</strong> <span style="color: ${elephant.distanceToHumanBoundaryMeters < 500 ? '#dc2626; font-weight: bold;' : '#334155;'}">${elephant.distanceToHumanBoundaryMeters}m from ${elephant.nearestSettlement}</span></div>
            <div><strong>Movement:</strong> ${elephant.movement.speedKmh} km/h &bull; ${elephant.movement.headingDirection}</div>
            <div><strong>Collar:</strong> ${elephant.collar.batteryPct}% Battery &bull; ${elephant.collar.satelliteCount} Satellites</div>
          </div>

          <div style="margin-top: 8px; display: flex; gap: 6px;">
            <button id="popup-btn-dossier-${elephant.id}" style="flex: 1; background: #059669; color: white; border: none; padding: 5px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Open Dossier
            </button>
            <button id="popup-btn-dispatch-${elephant.id}" style="background: #dc2626; color: white; border: none; padding: 5px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Dispatch RRT
            </button>
          </div>
        </div>
      `;

      let marker = markersRef.current.get(elephant.id);
      if (marker) {
        marker.setLatLng([elephant.location.lat, elephant.location.lng]);
        marker.setIcon(customIcon);
        marker.getPopup()?.setContent(popupHtml);
      } else {
        marker = L.marker([elephant.location.lat, elephant.location.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup(popupHtml, { maxWidth: 280 });
        marker.on('click', () => {
          onSelectElephant(elephant.id);
        });

        // Add popup open event listener to bind inner buttons
        marker.on('popupopen', () => {
          const dossierBtn = document.getElementById(`popup-btn-dossier-${elephant.id}`);
          if (dossierBtn) {
            dossierBtn.onclick = (e) => {
              e.stopPropagation();
              onSelectElephant(elephant.id);
            };
          }
          const dispatchBtn = document.getElementById(`popup-btn-dispatch-${elephant.id}`);
          if (dispatchBtn) {
            dispatchBtn.onclick = (e) => {
              e.stopPropagation();
              onOpenDispatch(elephant);
            };
          }
        });

        markersRef.current.set(elephant.id, marker);
      }
    });
  }, [elephants, selectedElephantId, showLabels, onSelectElephant, onOpenDispatch]);

  // Center on selected elephant
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedElephantId) return;

    const target = elephants.find(e => e.id === selectedElephantId);
    if (target) {
      map.flyTo([target.location.lat, target.location.lng], 14, {
        duration: 1.2,
      });
      // Open popup for selected marker
      const marker = markersRef.current.get(target.id);
      if (marker && !marker.isPopupOpen()) {
        setTimeout(() => {
          marker.openPopup();
        }, 600);
      }
    }
  }, [selectedElephantId, elephants]);

  // Reset view to full reserve
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([11.66, 76.64], 12, { duration: 1.0 });
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Real Leaflet Map Container */}
      <div 
        id="elephant-map-container"
        ref={mapContainerRef} 
        className="w-full h-full z-0"
      />

      {/* Top Left: Map Controls & Tile Chooser */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Base Tile Chooser */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1 text-xs">
          <button
            id="tile-btn-satellite"
            onClick={() => setActiveTile('satellite')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTile === 'satellite'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>
          <button
            id="tile-btn-topo"
            onClick={() => setActiveTile('topo')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTile === 'topo'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Terrain Topo
          </button>
          <button
            id="tile-btn-osm"
            onClick={() => setActiveTile('osm')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTile === 'osm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            OpenStreetMap
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-2 text-xs text-slate-300">
          <button
            id="toggle-geofence-btn"
            onClick={() => setShowGeofences(!showGeofences)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-colors ${
              showGeofences 
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Geofence Zone Polygons"
          >
            {showGeofences ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Zones</span>
          </button>

          <button
            id="toggle-labels-btn"
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-colors ${
              showLabels 
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Elephant Name Tags"
          >
            <span>Labels</span>
          </button>

          <button
            id="btn-reset-view"
            onClick={handleResetView}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Fit reserve view"
          >
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Top Center: Active Emergency Ticker if critical breach exists */}
      {elephants.some(e => e.riskLevel === 'Critical') && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 bg-red-950/90 backdrop-blur-md border border-red-600/80 text-red-200 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>CRITICAL PERIMETER BREACH DETECTED: Bull Raja 280m from Masinagudi</span>
        </div>
      )}

      {/* Bottom Right: Interactive Geofence Legend */}
      <div className="absolute bottom-3 right-3 z-10">
        {activeZoneLegend ? (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl max-w-xs text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Geofence Classification
              </span>
              <button
                onClick={() => setActiveZoneLegend(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500"></span>
                <span className="text-slate-300">Core Sanctuary (Zero Conflict)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500"></span>
                <span className="text-slate-300">Buffer Corridor (Controlled)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500"></span>
                <span className="text-slate-300">Agricultural Fringe (Crop Alert)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></span>
                <span className="text-slate-300">Settlement Perimeter (Immediate Threat)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-violet-500/30 border border-violet-500"></span>
                <span className="text-slate-300">Highway & Railway Pass</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setActiveZoneLegend(true)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Show Legend</span>
          </button>
        )}
      </div>

      {/* Bottom Left: Coordinates & Compass Info */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 shadow flex items-center gap-3">
        <div className="flex items-center gap-1 text-slate-300">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nilgiri-Bandipur Corridor (11.66°N, 76.64°E)</span>
        </div>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden sm:inline text-emerald-400">8 Collars Transmitting</span>
      </div>
    </div>
  );
};
