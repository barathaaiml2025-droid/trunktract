import { RiskFactorBreakdown, RiskLevel, SafetyZone } from '../types';

export function calculateRisk(params: {
  distanceMeters: number;
  speedKmh: number;
  isMovingTowardsSettlement: boolean;
  herdType: 'Solitary Bull' | 'Matriarchal Herd' | 'Bachelor Group' | 'Mother & Calf';
  hasConflictHistory: boolean;
  hourOfDay?: number;
}): {
  score: number;
  level: RiskLevel;
  zone: SafetyZone;
  factors: RiskFactorBreakdown;
} {
  const currentHour = params.hourOfDay !== undefined ? params.hourOfDay : new Date().getHours();

  // 1. Proximity to human settlement (0 - 35)
  let proximityScore = 2;
  if (params.distanceMeters < 300) {
    proximityScore = 35;
  } else if (params.distanceMeters < 750) {
    proximityScore = 28;
  } else if (params.distanceMeters < 1500) {
    proximityScore = 20;
  } else if (params.distanceMeters < 2500) {
    proximityScore = 12;
  } else {
    proximityScore = 3;
  }

  // 2. Velocity and Vector (0 - 25)
  let velocityScore = 2;
  if (params.isMovingTowardsSettlement) {
    if (params.speedKmh >= 3.0) {
      velocityScore = 25;
    } else if (params.speedKmh >= 1.5) {
      velocityScore = 18;
    } else {
      velocityScore = 10;
    }
  } else {
    // Moving away or resting
    if (params.speedKmh < 1.0) {
      velocityScore = 2;
    } else {
      velocityScore = 4;
    }
  }

  // 3. Time of Day (0 - 20) - Dusk/Night peak crop raiding window (18:00 - 05:00)
  let timeOfDayScore = 4;
  if (currentHour >= 19 || currentHour < 5) {
    timeOfDayScore = 20; // High nocturnal risk
  } else if ((currentHour >= 17 && currentHour < 19) || (currentHour >= 5 && currentHour < 7)) {
    timeOfDayScore = 12; // Twilight transition
  } else {
    timeOfDayScore = 4; // Daytime foraging
  }

  // 4. Herd Demographic Profile (0 - 10)
  let herdProfileScore = 4;
  if (params.herdType === 'Solitary Bull') {
    herdProfileScore = 10;
  } else if (params.herdType === 'Bachelor Group') {
    herdProfileScore = 8;
  } else if (params.herdType === 'Mother & Calf') {
    herdProfileScore = 7;
  } else {
    herdProfileScore = 3;
  }

  // 5. Historical Conflict Record (0 - 10)
  const conflictHistoryScore = params.hasConflictHistory ? 10 : 2;

  const totalScore = Math.min(100, proximityScore + velocityScore + timeOfDayScore + herdProfileScore + conflictHistoryScore);

  let level: RiskLevel = 'Low';
  if (totalScore >= 75) {
    level = 'Critical';
  } else if (totalScore >= 55) {
    level = 'High';
  } else if (totalScore >= 30) {
    level = 'Moderate';
  } else {
    level = 'Low';
  }

  // Determine Zone based on distance
  let zone: SafetyZone = 'Core Reserve';
  if (params.distanceMeters < 350) {
    zone = 'Settlement Perimeter';
  } else if (params.distanceMeters < 1000) {
    zone = 'Agricultural Fringe';
  } else if (params.distanceMeters < 2500) {
    zone = 'Buffer Corridor';
  } else {
    zone = 'Core Reserve';
  }

  let summaryText = 'Safe in core sanctuary; minimal conflict likelihood.';
  if (level === 'Critical') {
    summaryText = `URGENT: ${params.distanceMeters}m from village boundary with active trajectory. Rapid patrol recommended.`;
  } else if (level === 'High') {
    summaryText = `ELEVATED: Within ${params.distanceMeters}m of agricultural perimeter. Early warning monitoring active.`;
  } else if (level === 'Moderate') {
    summaryText = `MONITORING: Moving in buffer zone. Stable trajectory but caution advised for night hours.`;
  }

  return {
    score: totalScore,
    level,
    zone,
    factors: {
      proximityScore,
      velocityScore,
      timeOfDayScore,
      herdProfileScore,
      conflictHistoryScore,
      summaryText
    }
  };
}
