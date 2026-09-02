import React from 'react';
import { Elephant, ForestAlert } from '../types';
import { Shield, ShieldAlert, AlertTriangle, Radio, BatteryCharging, TreePine } from 'lucide-react';

interface MetricOverviewProps {
  elephants: Elephant[];
  alerts: ForestAlert[];
  onFilterZone?: (zone: string | null) => void;
  onFilterRisk?: (risk: string | null) => void;
  activeRiskFilter?: string | null;
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({
  elephants,
  alerts,
  onFilterRisk,
  activeRiskFilter,
}) => {
  const total = elephants.length;
  const critical = elephants.filter(e => e.riskLevel === 'Critical').length;
  const high = elephants.filter(e => e.riskLevel === 'High').length;
  const buffer = elephants.filter(e => e.zone === 'Buffer Corridor').length;
  const core = elephants.filter(e => e.zone === 'Core Reserve').length;
  
  // Calculate average collar battery
  const avgBattery = total > 0 
    ? Math.round(elephants.reduce((acc, e) => acc + e.collar.batteryPct, 0) / total) 
    : 0;
  
  const collarsOptimal = elephants.filter(e => e.collar.status === 'Optimal').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* 1. Total Fleet */}
      <button
        id="metric-total-elephants"
        onClick={() => onFilterRisk && onFilterRisk(null)}
        className={`p-3 rounded-xl border text-left transition-all ${
          !activeRiskFilter
            ? 'bg-slate-900 border-slate-700 ring-2 ring-emerald-500/40'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium tracking-wide uppercase">Monitored Elephants</span>
          <Radio className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white font-mono">{total}</span>
          <span className="text-[11px] text-slate-400">collared</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-400 font-medium">
          100% active pings
        </div>
      </button>

      {/* 2. Critical Threat Alert */}
      <button
        id="metric-critical-threat"
        onClick={() => onFilterRisk && onFilterRisk(activeRiskFilter === 'Critical' ? null : 'Critical')}
        className={`p-3 rounded-xl border text-left transition-all ${
          activeRiskFilter === 'Critical'
            ? 'bg-red-950/80 border-red-500 ring-2 ring-red-500'
            : 'bg-red-950/30 border-red-900/60 hover:border-red-700'
        }`}
      >
        <div className="flex items-center justify-between text-red-300 mb-1">
          <span className="text-[11px] font-semibold tracking-wide uppercase">Critical Breach</span>
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-red-400 font-mono">{critical}</span>
          <span className="text-[11px] text-red-300/80">&lt; 300m to village</span>
        </div>
        <div className="mt-1 text-[11px] text-red-300 font-medium">
          Patrol response ready
        </div>
      </button>

      {/* 3. High Risk / Fringe Alert */}
      <button
        id="metric-high-threat"
        onClick={() => onFilterRisk && onFilterRisk(activeRiskFilter === 'High' ? null : 'High')}
        className={`p-3 rounded-xl border text-left transition-all ${
          activeRiskFilter === 'High'
            ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500'
            : 'bg-amber-950/30 border-amber-900/60 hover:border-amber-700'
        }`}
      >
        <div className="flex items-center justify-between text-amber-300 mb-1">
          <span className="text-[11px] font-semibold tracking-wide uppercase">High Fringe Risk</span>
          <ShieldAlert className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-amber-400 font-mono">{high}</span>
          <span className="text-[11px] text-amber-300/80">near perimeter</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-300 font-medium">
          Early siren standby
        </div>
      </button>

      {/* 4. Buffer Corridor */}
      <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 text-left">
        <div className="flex items-center justify-between text-amber-200/80 mb-1">
          <span className="text-[11px] font-medium tracking-wide uppercase">Buffer Corridor</span>
          <Shield className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-100 font-mono">{buffer}</span>
          <span className="text-[11px] text-slate-400">migrating</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Controlled transit
        </div>
      </div>

      {/* 5. Core Sanctuary Safe */}
      <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 text-left">
        <div className="flex items-center justify-between text-emerald-300 mb-1">
          <span className="text-[11px] font-medium tracking-wide uppercase">Core Sanctuary</span>
          <TreePine className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-400 font-mono">{core}</span>
          <span className="text-[11px] text-slate-400">safe interior</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-400/90">
          Zero conflict risk
        </div>
      </div>

      {/* 6. Collar Battery & Hardware */}
      <div className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 text-left">
        <div className="flex items-center justify-between text-sky-300 mb-1">
          <span className="text-[11px] font-medium tracking-wide uppercase">Collar Battery</span>
          <BatteryCharging className="w-4 h-4 text-sky-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-sky-300 font-mono">{avgBattery}%</span>
          <span className="text-[11px] text-slate-400">avg health</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {collarsOptimal}/{total} optimal status
        </div>
      </div>
    </div>
  );
};
