import React, { useState } from 'react';
import { Elephant, RiskLevel, SafetyZone } from '../types';
import { 
  Crosshair, 
  BatteryCharging, 
  Satellite, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  ShieldAlert, 
  MapPin, 
  Activity, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface ElephantListProps {
  elephants: Elephant[];
  selectedElephantId: string | null;
  onSelectElephant: (id: string) => void;
  onOpenDossier: (elephant: Elephant) => void;
  onOpenDispatch: (elephant: Elephant) => void;
  activeRiskFilter: string | null;
  onFilterRisk: (risk: string | null) => void;
  searchQuery: string;
}

type SortOption = 'risk-desc' | 'distance-asc' | 'speed-desc' | 'name-asc' | 'battery-asc';

export const ElephantList: React.FC<ElephantListProps> = ({
  elephants,
  selectedElephantId,
  onSelectElephant,
  onOpenDossier,
  onOpenDispatch,
  activeRiskFilter,
  onFilterRisk,
  searchQuery,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('risk-desc');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Filter pipeline
  let filtered = elephants.filter(e => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q);
      const matchCollar = e.collarId.toLowerCase().includes(q);
      const matchZone = e.zone.toLowerCase().includes(q);
      const matchVillage = e.nearestSettlement.toLowerCase().includes(q);
      if (!matchName && !matchCollar && !matchZone && !matchVillage) return false;
    }

    // Risk filter
    if (activeRiskFilter) {
      if (e.riskLevel !== activeRiskFilter) return false;
    }

    // Zone filter
    if (zoneFilter !== 'all') {
      if (e.zone !== zoneFilter) return false;
    }

    return true;
  });

  // Sort pipeline
  filtered.sort((a, b) => {
    if (sortBy === 'risk-desc') {
      return b.riskScore - a.riskScore;
    } else if (sortBy === 'distance-asc') {
      return a.distanceToHumanBoundaryMeters - b.distanceToHumanBoundaryMeters;
    } else if (sortBy === 'speed-desc') {
      return b.movement.speedKmh - a.movement.speedKmh;
    } else if (sortBy === 'battery-asc') {
      return a.collar.batteryPct - b.collar.batteryPct;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-red-950 text-red-300 border border-red-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            CRITICAL ({score})
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
            HIGH ({score})
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-yellow-950 text-yellow-300 border border-yellow-800">
            MODERATE ({score})
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
            SAFE ({score})
          </span>
        );
    }
  };

  const getZoneBadge = (zone: SafetyZone) => {
    switch (zone) {
      case 'Settlement Perimeter':
        return <span className="text-[11px] font-semibold text-red-400">🚨 Settlement Perimeter</span>;
      case 'Agricultural Fringe':
        return <span className="text-[11px] font-semibold text-orange-400">⚠️ Agricultural Fringe</span>;
      case 'Buffer Corridor':
        return <span className="text-[11px] font-semibold text-amber-400">🛡️ Buffer Corridor</span>;
      case 'Railway Crossing Zone':
        return <span className="text-[11px] font-semibold text-purple-400">⚡ Railway Crossing</span>;
      case 'Core Reserve':
        return <span className="text-[11px] font-semibold text-emerald-400">🌲 Core Sanctuary</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
      {/* Controls & Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Monitored Elephants
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {filtered.length} of {elephants.length}
            </span>
          </h2>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-slate-400 hidden sm:inline">Sort:</span>
          <select
            id="sort-elephants-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
          >
            <option value="risk-desc">Highest Conflict Risk</option>
            <option value="distance-asc">Closest to Settlement</option>
            <option value="speed-desc">Fastest Movement Speed</option>
            <option value="battery-asc">Lowest Battery First</option>
            <option value="name-asc">Alphabetical (Name)</option>
          </select>
        </div>
      </div>

      {/* Zone Quick Pills */}
      <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto text-xs border-b border-slate-800/60 no-scrollbar">
        <button
          onClick={() => { setZoneFilter('all'); onFilterRisk(null); }}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
            zoneFilter === 'all' && !activeRiskFilter
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          All ({elephants.length})
        </button>
        <button
          onClick={() => onFilterRisk(activeRiskFilter === 'Critical' ? null : 'Critical')}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeRiskFilter === 'Critical'
              ? 'bg-red-600 text-white font-semibold'
              : 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-900/60'
          }`}
        >
          Critical ({elephants.filter(e => e.riskLevel === 'Critical').length})
        </button>
        <button
          onClick={() => onFilterRisk(activeRiskFilter === 'High' ? null : 'High')}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
            activeRiskFilter === 'High'
              ? 'bg-amber-600 text-white font-semibold'
              : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-900/60'
          }`}
        >
          High Fringe ({elephants.filter(e => e.riskLevel === 'High').length})
        </button>
        <button
          onClick={() => setZoneFilter(zoneFilter === 'Core Reserve' ? 'all' : 'Core Reserve')}
          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
            zoneFilter === 'Core Reserve'
              ? 'bg-emerald-700 text-white font-semibold'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Core Sanctuary ({elephants.filter(e => e.zone === 'Core Reserve').length})
        </button>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5 max-h-[600px]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No collared elephants match the selected filter or search query.
          </div>
        ) : (
          filtered.map(elephant => {
            const isSelected = elephant.id === selectedElephantId;
            const isCritical = elephant.riskLevel === 'Critical';

            return (
              <div
                key={elephant.id}
                id={`elephant-card-${elephant.id}`}
                onClick={() => onSelectElephant(elephant.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : isCritical
                    ? 'bg-slate-900/90 border-red-900/70 hover:border-red-600'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Top Row: Name, Collar Tag, Risk Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
                      elephant.riskLevel === 'Critical' ? 'bg-red-900 text-red-100 ring-1 ring-red-500' :
                      elephant.riskLevel === 'High' ? 'bg-amber-900 text-amber-100 ring-1 ring-amber-500' :
                      'bg-emerald-900 text-emerald-100 ring-1 ring-emerald-600'
                    }`}>
                      🐘
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm tracking-tight">{elephant.name}</span>
                        <span className="text-[11px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {elephant.collarId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {elephant.herdType} {elephant.herdSize > 1 ? `(${elephant.herdSize} in group)` : ''} &bull; {elephant.gender}, {elephant.ageYears}y
                      </div>
                    </div>
                  </div>

                  <div>
                    {getRiskBadge(elephant.riskLevel, elephant.riskScore)}
                  </div>
                </div>

                {/* Risk Score Linear Gauge */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-2.5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      elephant.riskLevel === 'Critical' ? 'bg-red-500' :
                      elephant.riskLevel === 'High' ? 'bg-amber-500' :
                      elephant.riskLevel === 'Moderate' ? 'bg-yellow-400' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(8, elephant.riskScore)}%` }}
                  />
                </div>

                {/* Zone & Distance to Settlement */}
                <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 mb-2.5 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Safety Zone:</span>
                    {getZoneBadge(elephant.zone)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Village Boundary:</span>
                    <span className={`font-mono font-semibold ${
                      elephant.distanceToHumanBoundaryMeters < 500 
                        ? 'text-red-400 font-bold' 
                        : elephant.distanceToHumanBoundaryMeters < 1500 
                        ? 'text-amber-400' 
                        : 'text-slate-300'
                    }`}>
                      {elephant.distanceToHumanBoundaryMeters}m from {elephant.nearestSettlement}
                    </span>
                  </div>
                </div>

                {/* Telemetry & Movement Stats */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-3 bg-slate-800/30 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">Movement Vector:</span>
                    <span className="font-semibold text-slate-200">
                      {elephant.movement.speedKmh.toFixed(1)} km/h &bull; {elephant.movement.headingDirection.split('(')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Collar Health:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <BatteryCharging className={`w-3 h-3 ${elephant.collar.batteryPct < 30 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                      {elephant.collar.batteryPct}% &bull; {elephant.collar.satelliteCount} Sats
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
                  <button
                    id={`btn-focus-map-${elephant.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElephant(elephant.id);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center justify-center gap-1.5"
                    title="Center map on this elephant"
                  >
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Focus Map</span>
                  </button>

                  <button
                    id={`btn-open-dossier-${elephant.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDossier(elephant);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>

                  {(elephant.riskLevel === 'Critical' || elephant.riskLevel === 'High') && (
                    <button
                      id={`btn-quick-dispatch-${elephant.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDispatch(elephant);
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors flex items-center justify-center gap-1"
                      title="Dispatch Rapid Response Team"
                    >
                      <span>RRT</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
