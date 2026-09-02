import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Bell, 
  ShieldAlert, 
  RefreshCw, 
  Satellite, 
  Search, 
  Clock, 
  Compass,
  AlertTriangle
} from 'lucide-react';
import { ForestAlert } from '../types';

interface HeaderProps {
  alerts: ForestAlert[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAlerts: () => void;
  activeTab: 'map' | 'risk' | 'collars';
  onTabChange: (tab: 'map' | 'risk' | 'collars') => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  searchQuery,
  onSearchChange,
  onOpenAlerts,
  activeTab,
  onTabChange,
  isSimulating,
  onToggleSimulation,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Branding & Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-500/40">
            <Radio className="w-5 h-5 animate-pulse text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                ElephantTrack
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                  GPS LIVE
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Wildlife Monitoring & Human-Elephant Conflict Early Warning System
            </p>
          </div>
        </div>

        {/* Global Operational Status & Clock */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs">
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>Iridium & LoRa Uplink:</span>
            <span className="font-semibold text-emerald-400">Online</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{timeStr || '20:14:02 IST'}</span>
          </div>

          {/* Live Sim Toggle */}
          <button
            id="simulation-toggle-btn"
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isSimulating 
                ? 'bg-emerald-900/60 border-emerald-600 text-emerald-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle simulated GPS real-time movement updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSimulating ? 'Live Telemetry' : 'Paused'}</span>
          </button>

          {/* Incident Alert Trigger Button */}
          <button
            id="alerts-panel-btn"
            onClick={onOpenAlerts}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
              unacknowledgedAlerts.length > 0
                ? 'bg-red-950/80 border-red-700 text-red-200 hover:bg-red-900'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bell className={`w-4 h-4 ${unacknowledgedAlerts.length > 0 ? 'text-red-400 animate-bounce' : 'text-slate-400'}`} />
            <span>Alerts</span>
            {unacknowledgedAlerts.length > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Navigation & Quick Search Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Functional View Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-stretch sm:self-auto">
            <button
              id="nav-tab-map"
              onClick={() => onTabChange('map')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Live Map & Elephants</span>
            </button>
            <button
              id="nav-tab-risk"
              onClick={() => onTabChange('risk')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'risk'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Risk Assessment Matrix</span>
            </button>
            <button
              id="nav-tab-collars"
              onClick={() => onTabChange('collars')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'collars'
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Collar Telemetry Health</span>
            </button>
          </div>

          {/* Fast Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="header-elephant-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search elephant name, collar ID..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
