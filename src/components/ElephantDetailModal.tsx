import React, { useState } from 'react';
import { Elephant, FieldOfficerAction } from '../types';
import { 
  X, 
  MapPin, 
  Activity, 
  BatteryCharging, 
  Satellite, 
  ShieldAlert, 
  Radio, 
  Zap, 
  Clock, 
  Compass, 
  AlertTriangle, 
  Volume2, 
  Send, 
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Thermometer,
  ShieldCheck
} from 'lucide-react';

interface ElephantDetailModalProps {
  elephant: Elephant | null;
  onClose: () => void;
  onOpenDispatch: (elephant: Elephant) => void;
  onExecuteAction: (elephantId: string, action: FieldOfficerAction) => void;
}

export const ElephantDetailModal: React.FC<ElephantDetailModalProps> = ({
  elephant,
  onClose,
  onOpenDispatch,
  onExecuteAction,
}) => {
  if (!elephant) return null;

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'risk-engine' | 'collar-diag' | 'actions'>('overview');
  const [officerNote, setOfficerNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTriggerSiren = () => {
    onExecuteAction(elephant.id, {
      elephantId: elephant.id,
      actionType: 'ACOUSTIC_SIREN',
      officerName: 'Command Dispatch Officer',
      notes: `Acoustic bio-acoustic deterrent triggered near ${elephant.nearestSettlement} buffer station.`,
      timestamp: 'Just now'
    });
    showToast(`🔊 Acoustic Siren activated near ${elephant.nearestSettlement}!`);
  };

  const handleBroadcastSMS = () => {
    onExecuteAction(elephant.id, {
      elephantId: elephant.id,
      actionType: 'COMMUNITY_SMS',
      officerName: 'Command Dispatch Officer',
      notes: `Automated SMS warning transmitted to 42 registered village wardens in ${elephant.nearestSettlement}.`,
      timestamp: 'Just now'
    });
    showToast(`📱 SMS Early Warning Broadcast sent to ${elephant.nearestSettlement} village wardens!`);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim()) return;
    onExecuteAction(elephant.id, {
      elephantId: elephant.id,
      actionType: 'LOG_NOTE',
      officerName: 'Forest Ranger',
      notes: officerNote.trim(),
      timestamp: 'Just now'
    });
    setOfficerNote('');
    showToast(`📝 Field observation note logged in official registry.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shadow-md ${
              elephant.riskLevel === 'Critical' ? 'bg-red-900 text-red-100 ring-2 ring-red-500' :
              elephant.riskLevel === 'High' ? 'bg-amber-900 text-amber-100 ring-2 ring-amber-500' :
              'bg-emerald-900 text-emerald-100 ring-1 ring-emerald-600'
            }`}>
              🐘
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {elephant.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {elephant.collarId}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                  elephant.riskLevel === 'Critical' ? 'bg-red-950 text-red-300 border border-red-700' :
                  elephant.riskLevel === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  elephant.riskLevel === 'Moderate' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {elephant.riskLevel.toUpperCase()} RISK ({elephant.riskScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {elephant.physicalDescription} &bull; {elephant.gender}, {elephant.ageYears} yrs &bull; {elephant.herdType}
              </p>
            </div>
          </div>

          <button
            id="close-dossier-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div className="bg-emerald-950 border-b border-emerald-700 text-emerald-200 px-6 py-2 text-xs font-semibold flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Sub-tabs bar */}
        <div className="bg-slate-950/60 px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Telemetry & Location Overview
          </button>
          <button
            onClick={() => setActiveSubTab('risk-engine')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'risk-engine'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk Calculation Factors</span>
          </button>
          <button
            onClick={() => setActiveSubTab('collar-diag')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'collar-diag'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>Collar Hardware Health</span>
          </button>
          <button
            onClick={() => setActiveSubTab('actions')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'actions'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Field Ranger Actions</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Location & Zone Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Location Box */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    GPS Coordinates & Zone
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Current Safety Zone:</span>
                      <span className="font-semibold text-emerald-300">{elephant.zone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Reserve Sector:</span>
                      <span className="text-slate-200">{elephant.location.zoneName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900 font-mono">
                      <span className="text-slate-400">Latitude / Longitude:</span>
                      <span className="text-slate-200">{elephant.location.lat.toFixed(5)}°N, {elephant.location.lng.toFixed(5)}°E</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Terrain Elevation:</span>
                      <span className="text-slate-200">{elephant.location.elevationMeters}m above MSL</span>
                    </div>
                  </div>
                </div>

                {/* Settlement Proximity Warning Box */}
                <div className={`p-4 rounded-xl border ${
                  elephant.distanceToHumanBoundaryMeters < 500
                    ? 'bg-red-950/40 border-red-800 text-red-200'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}>
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className={`w-4 h-4 ${elephant.distanceToHumanBoundaryMeters < 500 ? 'text-red-400' : 'text-amber-400'}`} />
                    Settlement Perimeter Proximity
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-900/60">
                      <span className="text-slate-400">Nearest Habitation:</span>
                      <span className="font-semibold text-white">{elephant.nearestSettlement}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900/60">
                      <span className="text-slate-400">Distance to Boundary:</span>
                      <span className={`font-mono text-sm font-bold ${
                        elephant.distanceToHumanBoundaryMeters < 500 ? 'text-red-400' : 'text-slate-200'
                      }`}>
                        {elephant.distanceToHumanBoundaryMeters} meters
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Buffer Penetration Status:</span>
                      <span className="font-medium">
                        {elephant.distanceToHumanBoundaryMeters < 350 ? '⚠️ Active Settlement Breach Risk' :
                         elephant.distanceToHumanBoundaryMeters < 1000 ? 'Caution: Fringe Zone' :
                         'Safe Distance within Reserve'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movement & Activity Vector */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Activity className="w-4 h-4 text-sky-400" />
                  Live Movement Dynamics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Velocity</span>
                    <span className="text-lg font-bold font-mono text-white mt-1 block">
                      {elephant.movement.speedKmh.toFixed(1)} km/h
                    </span>
                    <span className="text-[10px] text-slate-400">GSD Doppler Speed</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Heading Bearing</span>
                    <span className="text-lg font-bold font-mono text-white mt-1 block flex items-center gap-1">
                      {elephant.movement.headingDeg}°
                      <span className="text-xs text-sky-400">Compass</span>
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{elephant.movement.headingDirection.split('(')[0]}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Activity State</span>
                    <span className="text-sm font-bold text-emerald-400 mt-1 block">
                      {elephant.movement.activityState}
                    </span>
                    <span className="text-[10px] text-slate-400">3-Axis Collar Sensor</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Last 60m Shift</span>
                    <span className="text-lg font-bold font-mono text-white mt-1 block">
                      {elephant.movement.lastMovedMeters} m
                    </span>
                    <span className="text-[10px] text-slate-400">Position Delta</span>
                  </div>
                </div>
              </div>

              {/* Quick Field Operations Trigger Bar */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-400" />
                    Conflict Early Mitigation Protocol
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized actions for Range Officers & Field Rangers.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleTriggerSiren}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Bio-Siren</span>
                  </button>
                  <button
                    onClick={handleBroadcastSMS}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Wardens SMS</span>
                  </button>
                  <button
                    onClick={() => onOpenDispatch(elephant)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Dispatch RRT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RISK CALCULATION ENGINE BREAKDOWN */}
          {activeSubTab === 'risk-engine' && (
            <div className="space-y-6">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Dynamic Human-Elephant Conflict (HEC) Risk Score
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Calculated from real-time telemetry, geographic buffer rules, movement velocity, and nocturnal behavior modeling.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {elephant.riskScore}
                    </span>
                    <span className="text-xs text-slate-400 block">/ 100 maximum risk</span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      elephant.riskLevel === 'Critical' ? 'bg-red-500' :
                      elephant.riskLevel === 'High' ? 'bg-amber-500' :
                      elephant.riskLevel === 'Moderate' ? 'bg-yellow-400' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(10, elephant.riskScore)}%` }}
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <strong className="text-white">Assessment:</strong> {elephant.riskFactors.summaryText}
                </div>
              </div>

              {/* Breakdown Factor Table */}
              <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Formula Component Breakdown (0 - 100 Total)
                </div>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {/* Factor 1: Proximity */}
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">1. Settlement Proximity Factor</span>
                      <span className="text-slate-400 text-[11px]">
                        {elephant.distanceToHumanBoundaryMeters}m from {elephant.nearestSettlement}. Exponential penalty as boundary approaches.
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-amber-400 text-sm">+{elephant.riskFactors.proximityScore}</span>
                      <span className="text-slate-500 text-[11px]"> / 35 max</span>
                    </div>
                  </div>

                  {/* Factor 2: Velocity */}
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">2. Movement Velocity & Direction Vector</span>
                      <span className="text-slate-400 text-[11px]">
                        Moving at {elephant.movement.speedKmh.toFixed(1)} km/h {elephant.movement.headingDirection.split('(')[0]}. Fast movements toward farms elevate score.
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-amber-400 text-sm">+{elephant.riskFactors.velocityScore}</span>
                      <span className="text-slate-500 text-[11px]"> / 25 max</span>
                    </div>
                  </div>

                  {/* Factor 3: Time of Day */}
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">3. Nocturnal / Time-of-Day Risk Factor</span>
                      <span className="text-slate-400 text-[11px]">
                        Peak crop raiding and rail accident window is dusk-to-dawn (18:00 - 05:30).
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-amber-400 text-sm">+{elephant.riskFactors.timeOfDayScore}</span>
                      <span className="text-slate-500 text-[11px]"> / 20 max</span>
                    </div>
                  </div>

                  {/* Factor 4: Herd Demographic */}
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">4. Herd Composition & Demographic Profile</span>
                      <span className="text-slate-400 text-[11px]">
                        {elephant.herdType} (High solitary bull crop-raiding frequency vs family clan grazing).
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-amber-400 text-sm">+{elephant.riskFactors.herdProfileScore}</span>
                      <span className="text-slate-500 text-[11px]"> / 10 max</span>
                    </div>
                  </div>

                  {/* Factor 5: Historical Conflict */}
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">5. Historical Conflict Record</span>
                      <span className="text-slate-400 text-[11px]">
                        Prior farm entry or highway crossing incidents on record in reserve database.
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-amber-400 text-sm">+{elephant.riskFactors.conflictHistoryScore}</span>
                      <span className="text-slate-500 text-[11px]"> / 10 max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLLAR HARDWARE HEALTH */}
          {activeSubTab === 'collar-diag' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Battery & Voltage */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Battery Level</span>
                    <BatteryCharging className={`w-4 h-4 ${elephant.collar.batteryPct < 30 ? 'text-red-400' : 'text-emerald-400'}`} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mb-1">
                    {elephant.collar.batteryPct}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Voltage: <span className="text-slate-200 font-mono">{elephant.collar.batteryVoltage}V</span> (Li-SOCl2 / Solar)
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-400 font-medium">
                    {elephant.collar.solarCharging ? '☀️ Solar Harvester Active' : 'Battery Drainage Normal'}
                  </div>
                </div>

                {/* Satellite & Signal */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Constellation Lock</span>
                    <Satellite className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mb-1">
                    {elephant.collar.satelliteCount} <span className="text-xs font-normal text-slate-400">Sats</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Signal RSSI: <span className="text-slate-200 font-mono">{elephant.collar.signalDbm} dBm</span>
                  </div>
                  <div className="mt-2 text-[10px] text-sky-400 font-medium">
                    {elephant.collar.transmissionMode}
                  </div>
                </div>

                {/* Ambient Temp & Status */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Device Diagnostics</span>
                    <Thermometer className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mb-1">
                    {elephant.collar.temperatureC}°C
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Last Ping: <span className="text-slate-200">{elephant.collar.lastPingTime}</span>
                  </div>
                  <div className={`mt-2 text-[10px] font-semibold ${
                    elephant.collar.status === 'Optimal' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    Status: {elephant.collar.status}
                  </div>
                </div>
              </div>

              {/* Hardware Spec Box */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Collar Hardware Specification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                  <div>Collar Serial Number: <span className="text-slate-200 font-mono">{elephant.collar.collarSerial}</span></div>
                  <div>Firmware Version: <span className="text-slate-200 font-mono">{elephant.collar.firmwareVersion}</span></div>
                  <div>Drop-off Release Mechanism: <span className="text-emerald-400">Armed (Automatic 3-Year Timer)</span></div>
                  <div>Transmission Frequency: <span className="text-slate-200">1616–1626.5 MHz (Iridium Short Burst Data)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIELD RANGER ACTIONS & LOGS */}
          {activeSubTab === 'actions' && (
            <div className="space-y-6">
              {/* Prior logged action */}
              {elephant.lastAction && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Most Recent Intervention Log
                  </span>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold text-white">{elephant.lastAction.actionType}</span>
                      <span className="text-slate-400">{elephant.lastAction.timestamp}</span>
                    </div>
                    <div className="text-slate-400">Logged by: <span className="text-slate-200">{elephant.lastAction.officer}</span></div>
                    <div className="text-slate-300 mt-1 italic">"{elephant.lastAction.notes}"</div>
                  </div>
                </div>
              )}

              {/* Write New Field Note */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                  Log Field Ranger Observation
                </span>
                <form onSubmit={handleSaveNote} className="space-y-3">
                  <textarea
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    rows={3}
                    placeholder="Enter observation notes (e.g., Elephant observed near water catchment, no visible distress, herd calm, electric fence intact)..."
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!officerNote.trim()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Observation to Database</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Authorized Official Session &bull; Elephant ID: <span className="font-mono text-slate-300">{elephant.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
