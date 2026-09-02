import React, { useState } from 'react';
import { Elephant, RiskLevel } from '../types';
import { calculateRisk } from '../utils/riskCalculator';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

interface RiskAssessmentViewProps {
  elephants: Elephant[];
  onSelectElephant: (id: string) => void;
  onOpenDossier: (elephant: Elephant) => void;
}

export const RiskAssessmentView: React.FC<RiskAssessmentViewProps> = ({
  elephants,
  onSelectElephant,
  onOpenDossier,
}) => {
  const [simulatedHour, setSimulatedHour] = useState<number>(20); // 20:00 (Night patrol default)

  // Recalculate with simulated hour
  const evaluatedElephants = elephants.map(e => {
    const isMovingTowards = e.movement.headingDeg > 90 && e.movement.headingDeg < 270;
    const calc = calculateRisk({
      distanceMeters: e.distanceToHumanBoundaryMeters,
      speedKmh: e.movement.speedKmh,
      isMovingTowardsSettlement: isMovingTowards,
      herdType: e.herdType,
      hasConflictHistory: e.riskFactors.conflictHistoryScore > 2,
      hourOfDay: simulatedHour,
    });
    return {
      ...e,
      simRiskScore: calc.score,
      simRiskLevel: calc.level,
      simFactors: calc.factors
    };
  }).sort((a, b) => b.simRiskScore - a.simRiskScore);

  return (
    <div className="space-y-6">
      {/* Top Banner & Time Simulation Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Human-Elephant Conflict (HEC) Risk Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time scoring algorithm assessing likelihood of agricultural crop-raiding, village perimeter breaches, and railway collisions.
            </p>
          </div>

          {/* Time of Day Simulation Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300 font-medium">Test Time of Day:</span>
              <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {String(simulatedHour).padStart(2, '0')}:00 {simulatedHour >= 18 || simulatedHour < 6 ? '(Night/Dusk Risk)' : '(Daytime)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={simulatedHour}
              onChange={(e) => setSimulatedHour(Number(e.target.value))}
              className="w-32 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Risk Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Elephant Fleet Ranked by Conflict Risk Score
          </h3>
          <span className="text-[11px] text-slate-400">
            Updated live with movement vectors & proximity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Rank & Elephant</th>
                <th className="py-3 px-4">Zone & Village Distance</th>
                <th className="py-3 px-4">Velocity & Heading</th>
                <th className="py-3 px-4 text-center">Proximity (+35)</th>
                <th className="py-3 px-4 text-center">Velocity (+25)</th>
                <th className="py-3 px-4 text-center">Time (+20)</th>
                <th className="py-3 px-4 text-center">Herd/Hist (+20)</th>
                <th className="py-3 px-4 text-right">Total Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {evaluatedElephants.map((elephant, idx) => {
                const isCritical = elephant.simRiskLevel === 'Critical';
                const isHigh = elephant.simRiskLevel === 'High';

                return (
                  <tr 
                    key={elephant.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      isCritical ? 'bg-red-950/20' : isHigh ? 'bg-amber-950/15' : ''
                    }`}
                  >
                    {/* Rank & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{elephant.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{elephant.collarId} &bull; {elephant.herdType}</span>
                        </div>
                      </div>
                    </td>

                    {/* Zone & Distance */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{elephant.zone}</div>
                      <div className={`text-[11px] font-mono ${
                        elephant.distanceToHumanBoundaryMeters < 500 ? 'text-red-400 font-bold' : 'text-slate-400'
                      }`}>
                        {elephant.distanceToHumanBoundaryMeters}m from {elephant.nearestSettlement}
                      </div>
                    </td>

                    {/* Speed & Heading */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200 font-semibold">{elephant.movement.speedKmh.toFixed(1)} km/h</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {elephant.movement.headingDirection.split('(')[0]}
                      </div>
                    </td>

                    {/* Proximity Score */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        +{elephant.simFactors.proximityScore}
                      </span>
                    </td>

                    {/* Velocity Score */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        +{elephant.simFactors.velocityScore}
                      </span>
                    </td>

                    {/* Time Score */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        +{elephant.simFactors.timeOfDayScore}
                      </span>
                    </td>

                    {/* Herd & History Score */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        +{elephant.simFactors.herdProfileScore + elephant.simFactors.conflictHistoryScore}
                      </span>
                    </td>

                    {/* Total Score & Badge */}
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        elephant.simRiskLevel === 'Critical' ? 'bg-red-950 text-red-300 border border-red-700' :
                        elephant.simRiskLevel === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                        elephant.simRiskLevel === 'Moderate' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {elephant.simRiskScore} / 100
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        id={`btn-matrix-dossier-${elephant.id}`}
                        onClick={() => onOpenDossier(elephant)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Full Risk Breakdown"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forest Officer Standard Operating Procedures (SOP) Protocol Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Critical SOP */}
        <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-red-300 font-bold mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            CRITICAL RISK (Score 75 - 100)
          </div>
          <p className="text-red-200/90 leading-relaxed">
            Elephant is within 350m of agricultural land or human settlement moving actively forward.
          </p>
          <div className="mt-3 pt-2 border-t border-red-800/80 text-[11px] text-red-300 font-medium">
            <strong>Mandatory Action:</strong> Dispatch Rapid Response Team (RRT) immediately. Activate acoustic bio-fence siren. Send automated SMS broadcast to village wardens.
          </div>
        </div>

        {/* Tier 2: High SOP */}
        <div className="bg-amber-950/40 border border-amber-800 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            HIGH FRINGE (Score 55 - 74)
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            Elephant is in agricultural fringe zone (350m - 1000m) or loitering near highway/rail line.
          </p>
          <div className="mt-3 pt-2 border-t border-amber-800/80 text-[11px] text-amber-300 font-medium">
            <strong>Mandatory Action:</strong> Alert Beat Forest Officers. Place acoustic sirens on standby. Notify railway division controller for speed restrictions.
          </div>
        </div>

        {/* Tier 3: Moderate SOP */}
        <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-yellow-300 font-bold mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            MODERATE BUFFER (Score 30 - 54)
          </div>
          <p className="text-yellow-200/90 leading-relaxed">
            Elephant is transiting through eco-corridors or buffer forests between 1000m - 2500m.
          </p>
          <div className="mt-3 pt-2 border-t border-yellow-800/80 text-[11px] text-yellow-300 font-medium">
            <strong>Mandatory Action:</strong> Monitor ping intervals every 15 minutes. Check solar charging rate. No active deterrence required.
          </div>
        </div>

        {/* Tier 4: Low SOP */}
        <div className="bg-emerald-950/30 border border-emerald-800 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            SAFE CORE (Score 0 - 29)
          </div>
          <p className="text-emerald-200/90 leading-relaxed">
            Deep sanctuary interior (&gt; 2500m away). Natural foraging, herd movement, and zero conflict threat.
          </p>
          <div className="mt-3 pt-2 border-t border-emerald-800/80 text-[11px] text-emerald-300 font-medium">
            <strong>Mandatory Action:</strong> Routine wildlife census logging. Verify collar battery longevity.
          </div>
        </div>
      </div>
    </div>
  );
};
