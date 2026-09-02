export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type SafetyZone = 
  | 'Core Reserve' 
  | 'Buffer Corridor' 
  | 'Agricultural Fringe' 
  | 'Settlement Perimeter' 
  | 'Railway Crossing Zone';

export type ActivityState = 
  | 'Active Foraging' 
  | 'Fast Marching' 
  | 'Resting' 
  | 'Waterhole Visit' 
  | 'Boundary Loitering';

export type CollarStatus = 'Optimal' | 'Low Battery' | 'Weak Signal' | 'Maintenance Required';

export interface CollarTelemetry {
  batteryPct: number;
  batteryVoltage: number;
  signalDbm: number;
  satelliteCount: number;
  transmissionMode: 'Iridium Satellite' | 'LoRaWAN Long-Range' | 'GSM 4G Fallback';
  status: CollarStatus;
  temperatureC: number;
  lastPingTime: string;
  solarCharging: boolean;
  firmwareVersion: string;
  collarSerial: string;
}

export interface RiskFactorBreakdown {
  proximityScore: number;       // 0 - 35 pts (distance to village)
  velocityScore: number;        // 0 - 25 pts (speed towards boundary)
  timeOfDayScore: number;       // 0 - 20 pts (night/dusk higher risk)
  herdProfileScore: number;     // 0 - 10 pts (bull vs herd)
  conflictHistoryScore: number; // 0 - 10 pts (prior crop raid history)
  summaryText: string;
}

export interface ElephantMovement {
  speedKmh: number;
  headingDeg: number;
  headingDirection: string;
  lastMovedMeters: number;
  activityState: ActivityState;
}

export interface Elephant {
  id: string;
  name: string;
  collarId: string;
  tagColor: string;
  herdType: 'Solitary Bull' | 'Matriarchal Herd' | 'Bachelor Group' | 'Mother & Calf';
  herdSize: number;
  gender: 'Male' | 'Female';
  ageYears: number;
  physicalDescription: string;
  location: {
    lat: number;
    lng: number;
    zoneName: string;
    elevationMeters: number;
  };
  movement: ElephantMovement;
  zone: SafetyZone;
  distanceToHumanBoundaryMeters: number;
  nearestSettlement: string;
  collar: CollarTelemetry;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactorBreakdown;
  lastAction?: {
    timestamp: string;
    actionType: string;
    officer: string;
    notes: string;
  };
}

export interface ForestAlert {
  id: string;
  elephantId: string;
  elephantName: string;
  collarId: string;
  severity: RiskLevel;
  title: string;
  description: string;
  timestamp: string;
  distanceMeters: number;
  settlementName: string;
  acknowledged: boolean;
  actionTaken?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  zoneType: SafetyZone;
  color: string;
  fillColor: string;
  fillOpacity: number;
  dashArray?: string;
  coordinates: [number, number][];
  description: string;
}

export interface FieldOfficerAction {
  elephantId: string;
  actionType: 'RRT_DISPATCH' | 'ACOUSTIC_SIREN' | 'COMMUNITY_SMS' | 'BEAT_PATROL' | 'LOG_NOTE';
  officerName: string;
  notes: string;
  timestamp: string;
}
