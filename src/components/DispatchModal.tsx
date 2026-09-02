import React, { useState } from 'react';
import { Elephant, FieldOfficerAction } from '../types';
import { 
  X, 
  Zap, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Radio, 
  Lightbulb,
  Bell
} from 'lucide-react';

interface DispatchModalProps {
  elephant: Elephant | null;
  onClose: () => void;
  onConfirmDispatch: (elephantId: string, action: FieldOfficerAction) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  elephant,
  onClose,
  onConfirmDispatch,
}) => {
  if (!elephant) return null;

  const [selectedUnit, setSelectedUnit] = useState('RRT Unit 1 - Masinagudi Outpost');
  const [officerName, setOfficerName] = useState('Range Officer M. Sundaram');
  const [notes, setNotes] = useState(`Direct intercept at ${elephant.nearestSettlement} fringe border. Deploy thermal spotters and bio-acoustic deterrent to steer back into core reserve.`);
  const [useSearchlights, setUseSearchlights] = useState(true);
  const [useAcoustics, setUseAcoustics] = useState(true);
  const [useDrone, setUseDrone] = useState(true);
  const [useChilliSmoke, setUseChilliSmoke] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action: FieldOfficerAction = {
      elephantId: elephant.id,
      actionType: 'RRT_DISPATCH',
      officerName: officerName.trim() || 'Command Officer',
      notes: `${selectedUnit} dispatched. Gear: ${[
        useSearchlights ? 'High-Intensity Spotters' : null,
        useAcoustics ? 'Acoustic Bio-Siren' : null,
        useDrone ? 'Thermal Drone' : null,
        useChilliSmoke ? 'Chilli Smoke' : null
      ].filter(Boolean).join(', ')}. Strategy: ${notes}`,
      timestamp: 'Just now'
    };

    onConfirmDispatch(elephant.id, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-700 flex items-center justify-center text-red-400 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Dispatch Rapid Response Team (RRT)
              </h3>
              <p className="text-xs text-slate-400">
                Target: {elephant.name} ({elephant.collarId}) &bull; {elephant.riskScore}/100 Risk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Elephant Target Summary Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Intercept Coordinates:</span>
              <span className="font-mono text-slate-200">{elephant.location.lat.toFixed(4)}°N, {elephant.location.lng.toFixed(4)}°E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Distance to Settlement:</span>
              <span className="font-mono font-bold text-red-400">{elephant.distanceToHumanBoundaryMeters}m from {elephant.nearestSettlement}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Velocity & Trajectory:</span>
              <span className="font-mono text-amber-300">{elephant.movement.speedKmh.toFixed(1)} km/h {elephant.movement.headingDirection.split('(')[0]}</span>
            </div>
          </div>

          {/* Patrol Unit Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Assign Field Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="RRT Unit 1 - Masinagudi Outpost">RRT Unit 1 - Masinagudi Outpost (5 min ETA)</option>
              <option value="RRT Unit 2 - Theppakadu Range HQ">RRT Unit 2 - Theppakadu Range HQ (12 min ETA)</option>
              <option value="Gudalur Border Flying Squad">Gudalur Border Flying Squad (18 min ETA)</option>
              <option value="Thorapalli Village Beat Rangers">Thorapalli Village Beat Rangers (8 min ETA)</option>
            </select>
          </div>

          {/* Authorized Officer */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Authorizing Officer Name & Designation
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              placeholder="e.g., Range Officer M. Sundaram"
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Deterrence Gear Checklist */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Deterrence & Surveillance Equipment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={useSearchlights}
                  onChange={(e) => setUseSearchlights(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span className="text-slate-300">High-Power Searchlights</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={useAcoustics}
                  onChange={(e) => setUseAcoustics(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span className="text-slate-300">Bio-Acoustic Siren</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={useDrone}
                  onChange={(e) => setUseDrone(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span className="text-slate-300">Thermal Aerial Drone</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={useChilliSmoke}
                  onChange={(e) => setUseChilliSmoke(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span className="text-slate-300">Chilli Smoke Deterrent</span>
              </label>
            </div>
          </div>

          {/* Operational Strategy Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Field Tactics & Strategy Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950"
            >
              <Zap className="w-4 h-4" />
              <span>Confirm & Dispatch Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
