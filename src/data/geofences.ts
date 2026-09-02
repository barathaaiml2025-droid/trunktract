import { GeofenceZone } from '../types';

export const GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'zone-core-01',
    name: 'Moyar Deep Sanctuary Core',
    zoneType: 'Core Reserve',
    color: '#059669', // emerald-600
    fillColor: '#10b981',
    fillOpacity: 0.15,
    description: 'Pristine dense deciduous jungle, zero human encroachment, primary habitat.',
    coordinates: [
      [11.660, 76.540],
      [11.720, 76.570],
      [11.740, 76.650],
      [11.690, 76.680],
      [11.640, 76.640],
      [11.630, 76.580],
      [11.660, 76.540]
    ]
  },
  {
    id: 'zone-buffer-02',
    name: 'Eastern Wildlife Eco-Corridor',
    zoneType: 'Buffer Corridor',
    color: '#d97706', // amber-600
    fillColor: '#f59e0b',
    fillOpacity: 0.12,
    dashArray: '5, 5',
    description: 'Seasonal migration path connecting protected reserves. Controlled patrol zone.',
    coordinates: [
      [11.690, 76.680],
      [11.740, 76.650],
      [11.760, 76.720],
      [11.710, 76.760],
      [11.650, 76.720],
      [11.640, 76.640],
      [11.690, 76.680]
    ]
  },
  {
    id: 'zone-agri-03',
    name: 'Gudalur Plantations & Crop Fringe',
    zoneType: 'Agricultural Fringe',
    color: '#ea580c', // orange-600
    fillColor: '#f97316',
    fillOpacity: 0.18,
    dashArray: '4, 4',
    description: 'Paddy, banana, and coffee plantations with seasonal crop raiding attraction.',
    coordinates: [
      [11.600, 76.520],
      [11.640, 76.550],
      [11.630, 76.600],
      [11.590, 76.580],
      [11.580, 76.530],
      [11.600, 76.520]
    ]
  },
  {
    id: 'zone-settlement-04',
    name: 'Masinagudi-Thorapalli Village Perimeter',
    zoneType: 'Settlement Perimeter',
    color: '#dc2626', // red-600
    fillColor: '#ef4444',
    fillOpacity: 0.22,
    dashArray: '3, 6',
    description: 'High human density habitation zone. Strict geofence perimeter for automated alerts.',
    coordinates: [
      [11.570, 76.620],
      [11.610, 76.630],
      [11.615, 76.690],
      [11.580, 76.700],
      [11.560, 76.660],
      [11.570, 76.620]
    ]
  },
  {
    id: 'zone-rail-05',
    name: 'Highway-67 & Rail Crossing Pass',
    zoneType: 'Railway Crossing Zone',
    color: '#7c3aed', // violet-600
    fillColor: '#8b5cf6',
    fillOpacity: 0.25,
    dashArray: '2, 4',
    description: 'Critical intersection point with speed sensors and automatic train speed alert links.',
    coordinates: [
      [11.640, 76.715],
      [11.670, 76.725],
      [11.665, 76.755],
      [11.635, 76.745],
      [11.640, 76.715]
    ]
  }
];
