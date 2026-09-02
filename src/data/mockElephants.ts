import { Elephant, ForestAlert } from '../types';
import { calculateRisk } from '../utils/riskCalculator';

const rawElephants = [
  {
    id: 'el-01',
    name: 'Raja',
    collarId: 'GPS-IR-904',
    tagColor: '#ef4444', // Red
    herdType: 'Solitary Bull' as const,
    herdSize: 1,
    gender: 'Male' as const,
    ageYears: 42,
    physicalDescription: 'Massive solitary bull with prominent left tusker curved upward, notched ear edge.',
    location: {
      lat: 11.595,
      lng: 76.645,
      zoneName: 'Masinagudi-Thorapalli Village Perimeter',
      elevationMeters: 890
    },
    movement: {
      speedKmh: 3.1,
      headingDeg: 155,
      headingDirection: 'SSE (Directly toward Masinagudi farms)',
      lastMovedMeters: 450,
      activityState: 'Fast Marching' as const
    },
    distanceToHumanBoundaryMeters: 280,
    nearestSettlement: 'Masinagudi East Hamlet',
    collar: {
      batteryPct: 78,
      batteryVoltage: 3.84,
      signalDbm: -72,
      satelliteCount: 16,
      transmissionMode: 'Iridium Satellite' as const,
      status: 'Optimal' as const,
      temperatureC: 28.4,
      lastPingTime: '2 mins ago',
      solarCharging: true,
      firmwareVersion: 'v4.2.8-IR',
      collarSerial: 'VECT-904-IN-2024'
    },
    hasConflictHistory: true,
    lastAction: {
      timestamp: '18 mins ago',
      actionType: 'RRT Patrol Alert Dispatched',
      officer: 'Range Officer M. Sundaram',
      notes: 'RRT Unit 2 stationed at Thorapalli junction with floodlights and search beacons.'
    }
  },
  {
    id: 'el-02',
    name: 'Maya',
    collarId: 'GPS-LR-412',
    tagColor: '#f59e0b', // Amber
    herdType: 'Matriarchal Herd' as const,
    herdSize: 8,
    gender: 'Female' as const,
    ageYears: 36,
    physicalDescription: 'Experienced matriarch, calm disposition, leading a family group with 2 juveniles.',
    location: {
      lat: 11.698,
      lng: 76.715,
      zoneName: 'Eastern Wildlife Eco-Corridor',
      elevationMeters: 960
    },
    movement: {
      speedKmh: 1.4,
      headingDeg: 55,
      headingDirection: 'ENE (Towards river crossing in buffer)',
      lastMovedMeters: 180,
      activityState: 'Active Foraging' as const
    },
    distanceToHumanBoundaryMeters: 1850,
    nearestSettlement: 'Chamarajanagar Border Outpost',
    collar: {
      batteryPct: 92,
      batteryVoltage: 4.12,
      signalDbm: -68,
      satelliteCount: 18,
      transmissionMode: 'LoRaWAN Long-Range' as const,
      status: 'Optimal' as const,
      temperatureC: 26.1,
      lastPingTime: '5 mins ago',
      solarCharging: true,
      firmwareVersion: 'v4.3.0-LR',
      collarSerial: 'LORA-412-TN-2023'
    },
    hasConflictHistory: false
  },
  {
    id: 'el-03',
    name: 'Balarama',
    collarId: 'GPS-IR-781',
    tagColor: '#ea580c', // Orange
    herdType: 'Solitary Bull' as const,
    herdSize: 1,
    gender: 'Male' as const,
    ageYears: 35,
    physicalDescription: 'Prime tuskless male (Makna), muscular build, known for stealthy border grazing.',
    location: {
      lat: 11.622,
      lng: 76.565,
      zoneName: 'Gudalur Plantations & Crop Fringe',
      elevationMeters: 1040
    },
    movement: {
      speedKmh: 2.7,
      headingDeg: 195,
      headingDirection: 'SSW (Approaching coffee estate fence)',
      lastMovedMeters: 380,
      activityState: 'Boundary Loitering' as const
    },
    distanceToHumanBoundaryMeters: 620,
    nearestSettlement: 'Upper Gudalur Plantation Sector',
    collar: {
      batteryPct: 64,
      batteryVoltage: 3.75,
      signalDbm: -84,
      satelliteCount: 12,
      transmissionMode: 'Iridium Satellite' as const,
      status: 'Optimal' as const,
      temperatureC: 27.8,
      lastPingTime: '4 mins ago',
      solarCharging: false,
      firmwareVersion: 'v4.2.6-IR',
      collarSerial: 'VECT-781-KA-2024'
    },
    hasConflictHistory: true,
    lastAction: {
      timestamp: '45 mins ago',
      actionType: 'Acoustic Siren Standby',
      officer: 'Forest Guard K. Ramesh',
      notes: 'Acoustic bio-acoustic deterrent speaker at Tower 4 activated in standby mode.'
    }
  },
  {
    id: 'el-04',
    name: 'Tara',
    collarId: 'GPS-LR-205',
    tagColor: '#10b981', // Emerald
    herdType: 'Mother & Calf' as const,
    herdSize: 2,
    gender: 'Female' as const,
    ageYears: 24,
    physicalDescription: 'Gentle cow elephant accompanied by a 4-month-old healthy female calf.',
    location: {
      lat: 11.685,
      lng: 76.595,
      zoneName: 'Moyar Deep Sanctuary Core',
      elevationMeters: 810
    },
    movement: {
      speedKmh: 0.4,
      headingDeg: 280,
      headingDirection: 'W (Resting near Moyar river bend)',
      lastMovedMeters: 30,
      activityState: 'Waterhole Visit' as const
    },
    distanceToHumanBoundaryMeters: 4200,
    nearestSettlement: 'Theppakadu Camp (Sanctuary HQ)',
    collar: {
      batteryPct: 88,
      batteryVoltage: 4.02,
      signalDbm: -65,
      satelliteCount: 19,
      transmissionMode: 'LoRaWAN Long-Range' as const,
      status: 'Optimal' as const,
      temperatureC: 25.5,
      lastPingTime: '1 min ago',
      solarCharging: true,
      firmwareVersion: 'v4.3.0-LR',
      collarSerial: 'LORA-205-TN-2024'
    },
    hasConflictHistory: false
  },
  {
    id: 'el-05',
    name: 'Ganesh',
    collarId: 'GPS-IR-633',
    tagColor: '#dc2626', // Red
    herdType: 'Bachelor Group' as const,
    herdSize: 3,
    gender: 'Male' as const,
    ageYears: 21,
    physicalDescription: 'Sub-adult bull leading 2 younger bachelors, agile and exploratory.',
    location: {
      lat: 11.652,
      lng: 76.732,
      zoneName: 'Highway-67 & Rail Crossing Pass',
      elevationMeters: 920
    },
    movement: {
      speedKmh: 2.9,
      headingDeg: 120,
      headingDirection: 'ESE (Perpendicular to railway alignment)',
      lastMovedMeters: 320,
      activityState: 'Fast Marching' as const
    },
    distanceToHumanBoundaryMeters: 450,
    nearestSettlement: 'Rail Track KM-124 / Chamarajanagar Pass',
    collar: {
      batteryPct: 51,
      batteryVoltage: 3.68,
      signalDbm: -98,
      satelliteCount: 9,
      transmissionMode: 'Iridium Satellite' as const,
      status: 'Weak Signal' as const,
      temperatureC: 30.2,
      lastPingTime: '8 mins ago',
      solarCharging: false,
      firmwareVersion: 'v4.1.9-IR',
      collarSerial: 'VECT-633-KA-2023'
    },
    hasConflictHistory: true,
    lastAction: {
      timestamp: '12 mins ago',
      actionType: 'Railway Caution Advisory',
      officer: 'Division Controller S. Joseph',
      notes: 'Railway control room alerted. Caution order issued to train #16525 speed cap 25 km/h.'
    }
  },
  {
    id: 'el-06',
    name: 'Devi',
    collarId: 'GPS-LR-119',
    tagColor: '#10b981', // Emerald
    herdType: 'Matriarchal Herd' as const,
    herdSize: 6,
    gender: 'Female' as const,
    ageYears: 48,
    physicalDescription: 'Senior matriarch with wide ear spread, deeply wrinkled forehead, quiet pathfinder.',
    location: {
      lat: 11.670,
      lng: 76.635,
      zoneName: 'Moyar Deep Sanctuary Core',
      elevationMeters: 840
    },
    movement: {
      speedKmh: 1.1,
      headingDeg: 310,
      headingDirection: 'NW (Deep into teak forest interior)',
      lastMovedMeters: 140,
      activityState: 'Active Foraging' as const
    },
    distanceToHumanBoundaryMeters: 3900,
    nearestSettlement: 'Bokkapuram Hamlet (North Buffer)',
    collar: {
      batteryPct: 96,
      batteryVoltage: 4.18,
      signalDbm: -62,
      satelliteCount: 21,
      transmissionMode: 'LoRaWAN Long-Range' as const,
      status: 'Optimal' as const,
      temperatureC: 24.9,
      lastPingTime: '3 mins ago',
      solarCharging: true,
      firmwareVersion: 'v4.3.0-LR',
      collarSerial: 'LORA-119-TN-2024'
    },
    hasConflictHistory: false
  },
  {
    id: 'el-07',
    name: 'Chinnathambi',
    collarId: 'GPS-IR-552',
    tagColor: '#ea580c', // Orange
    herdType: 'Solitary Bull' as const,
    herdSize: 1,
    gender: 'Male' as const,
    ageYears: 29,
    physicalDescription: 'Tall handsome tusker with long straight ivory, habituated to agricultural perimeter foraging.',
    location: {
      lat: 11.585,
      lng: 76.675,
      zoneName: 'Masinagudi-Thorapalli Village Perimeter',
      elevationMeters: 905
    },
    movement: {
      speedKmh: 1.8,
      headingDeg: 210,
      headingDirection: 'SSW (Pacing agricultural trench edge)',
      lastMovedMeters: 210,
      activityState: 'Boundary Loitering' as const
    },
    distanceToHumanBoundaryMeters: 390,
    nearestSettlement: 'Thorapalli West Settlement',
    collar: {
      batteryPct: 24,
      batteryVoltage: 3.42,
      signalDbm: -88,
      satelliteCount: 11,
      transmissionMode: 'GSM 4G Fallback' as const,
      status: 'Low Battery' as const,
      temperatureC: 29.1,
      lastPingTime: '11 mins ago',
      solarCharging: false,
      firmwareVersion: 'v3.9.4-HY',
      collarSerial: 'HYBR-552-TN-2022'
    },
    hasConflictHistory: true,
    lastAction: {
      timestamp: '32 mins ago',
      actionType: 'Field Inspection Logged',
      officer: 'Forester V. Balan',
      notes: 'Collar battery under 25%. Scheduled for drone telemetry ping and field check tomorrow.'
    }
  },
  {
    id: 'el-08',
    name: 'Kaveri',
    collarId: 'GPS-LR-388',
    tagColor: '#10b981', // Emerald
    herdType: 'Matriarchal Herd' as const,
    herdSize: 11,
    gender: 'Female' as const,
    ageYears: 52,
    physicalDescription: 'Large clan matriarch with distinct depigmentation around trunk base, highly protective.',
    location: {
      lat: 11.720,
      lng: 76.620,
      zoneName: 'Moyar Deep Sanctuary Core',
      elevationMeters: 780
    },
    movement: {
      speedKmh: 1.3,
      headingDeg: 275,
      headingDirection: 'W (Following bamboo valley stream)',
      lastMovedMeters: 170,
      activityState: 'Active Foraging' as const
    },
    distanceToHumanBoundaryMeters: 5100,
    nearestSettlement: 'Gundlupet Agricultural Range',
    collar: {
      batteryPct: 84,
      batteryVoltage: 3.98,
      signalDbm: -70,
      satelliteCount: 17,
      transmissionMode: 'LoRaWAN Long-Range' as const,
      status: 'Optimal' as const,
      temperatureC: 25.1,
      lastPingTime: '6 mins ago',
      solarCharging: true,
      firmwareVersion: 'v4.3.0-LR',
      collarSerial: 'LORA-388-KA-2024'
    },
    hasConflictHistory: false
  }
];

export const INITIAL_ELEPHANTS: Elephant[] = rawElephants.map((raw) => {
  const isMovingTowards = raw.movement.headingDeg > 90 && raw.movement.headingDeg < 270;
  const riskResult = calculateRisk({
    distanceMeters: raw.distanceToHumanBoundaryMeters,
    speedKmh: raw.movement.speedKmh,
    isMovingTowardsSettlement: isMovingTowards,
    herdType: raw.herdType,
    hasConflictHistory: raw.hasConflictHistory,
    hourOfDay: 20 // Simulated 20:00 (8:00 PM) dusk/night patrol peak
  });

  return {
    ...raw,
    zone: riskResult.zone,
    riskScore: riskResult.score,
    riskLevel: riskResult.level,
    riskFactors: riskResult.factors
  };
});

export const INITIAL_ALERTS: ForestAlert[] = [
  {
    id: 'alt-01',
    elephantId: 'el-01',
    elephantName: 'Raja',
    collarId: 'GPS-IR-904',
    severity: 'Critical',
    title: 'Perimeter Breach Warning (280m from Masinagudi)',
    description: 'Solitary bull Raja is moving SSE at 3.1 km/h towards agricultural crop boundary. High conflict probability.',
    timestamp: 'Just now',
    distanceMeters: 280,
    settlementName: 'Masinagudi East Hamlet',
    acknowledged: false
  },
  {
    id: 'alt-02',
    elephantId: 'el-05',
    elephantName: 'Ganesh',
    collarId: 'GPS-IR-633',
    severity: 'High',
    title: 'Railway Line Proximity Alert (KM-124)',
    description: 'Bachelor group approaching Highway-67 and railway pass at 2.9 km/h. Distance to track is 450m.',
    timestamp: '12 mins ago',
    distanceMeters: 450,
    settlementName: 'Rail Track KM-124',
    acknowledged: true,
    actionTaken: 'Railway speed caution advisory issued to control room.'
  },
  {
    id: 'alt-03',
    elephantId: 'el-07',
    elephantName: 'Chinnathambi',
    collarId: 'GPS-IR-552',
    severity: 'High',
    title: 'Crop Fringe Loitering & Low Battery (24%)',
    description: 'Bull pacing fence line 390m from Thorapalli. Collar battery dropped to 24% (GSM fallback).',
    timestamp: '32 mins ago',
    distanceMeters: 390,
    settlementName: 'Thorapalli West Settlement',
    acknowledged: true,
    actionTaken: 'Drone telemetry inspection scheduled.'
  }
];
