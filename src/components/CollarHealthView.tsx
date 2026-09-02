import React from 'react';
import { Elephant } from '../types';
import { 
  Satellite, 
  BatteryCharging, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  Cpu, 
  Wrench,
  Zap
} from 'lucide-react';

interface CollarHealthViewProps {
  elephants: Elephant[];
  onOpenDossier: (elephant: Elephant) => void;
}

export const CollarHealthView: React.FC<CollarHealthViewProps> = ({
  elephants,
  onOpenDossier,
}) => {
  const totalCollars = elephants.length;
  const optimalCollars = elephants.filter(e => e.collar.status === 'Optimal').length;
  const lowBatteryCollars = elephants.filter(e => e.collar.batteryPct < 30).length;
  const weakSignalCollars = elephants.filter(e => e.collar.signalDbm < -90).length;

  const iridiumCount = elephants.filter(e => e.collar.transmissionMode === 'Iridium Satellite').length;
  const loraCount = elephants.filter(e => e.collar.transmissionMode === 'LoRaWAN Long-Range').length;
  const gsmCount = elephants.filter(e => e.collar.transmissionMode === 'GSM 4G Fallback').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              GPS Collar Telemetry & Device Health Monitor
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time hardware status, battery voltages, satellite constellation telemetry, and network uplink health.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Constellation Status:</span>
            <span className="text-emerald-400 font-bold">100% Online</span>
          </div>
        </div>
      </div>

      {/* Hardware Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Online Devices</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalCollars} / {totalCollars}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {optimalCollars} in optimal operational condition
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Low Battery Alert</span>
            <BatteryCharging className={`w-4 h-4 ${lowBatteryCollars > 0 ? 'text-red-400' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${lowBatteryCollars > 0 ? 'text-red-400' : 'text-white'}`}>
            {lowBatteryCollars}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lowBatteryCollars > 0 ? 'Chinnathambi (24%) requires solar/recharge' : 'All batteries > 30%'}
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Weak Signal Warnings</span>
            <AlertTriangle className={`w-4 h-4 ${weakSignalCollars > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${weakSignalCollars > 0 ? 'text-amber-400' : 'text-white'}`}>
            {weakSignalCollars}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ganesh (deep ravine pass) &bull; -98 dBm
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Transmission Distribution</span>
            <Satellite className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xs text-slate-300 font-mono mt-1 space-y-1">
            <div>Iridium Sat: <span className="font-bold text-sky-400">{iridiumCount}</span></div>
            <div>LoRaWAN: <span className="font-bold text-emerald-400">{loraCount}</span></div>
            <div>GSM 4G: <span className="font-bold text-amber-400">{gsmCount}</span></div>
          </div>
        </div>
      </div>

      {/* Collar Detailed Telemetry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Collar Diagnostics by Elephant
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Auto-polling interval: 180s
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Elephant & Collar ID</th>
                <th className="py-3 px-4">Battery Health</th>
                <th className="py-3 px-4">Voltage</th>
                <th className="py-3 px-4">Signal RSSI</th>
                <th className="py-3 px-4">Sats Locked</th>
                <th className="py-3 px-4">Transmission Mode</th>
                <th className="py-3 px-4">Collar Temp</th>
                <th className="py-3 px-4">Last Ping</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {elephants.map(elephant => {
                const c = elephant.collar;
                const isLowBattery = c.batteryPct < 30;
                const isWeakSignal = c.signalDbm < -90;

                return (
                  <tr key={elephant.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{elephant.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{elephant.collarId} &bull; {c.collarSerial}</div>
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.batteryPct < 30 ? 'bg-red-500' :
                              c.batteryPct < 60 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${c.batteryPct}%` }}
                          />
                        </div>
                        <span className={`font-mono font-bold ${
                          c.batteryPct < 30 ? 'text-red-400' : 'text-slate-200'
                        }`}>
                          {c.batteryPct}%
                        </span>
                      </div>
                      {c.solarCharging && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          ☀️ Solar Charging
                        </span>
                      )}
                    </td>

                    {/* Voltage */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {c.batteryVoltage}V
                    </td>

                    {/* Signal RSSI */}
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isWeakSignal ? 'bg-red-950 text-red-400 border border-red-800' : 'text-slate-300'
                      }`}>
                        {c.signalDbm} dBm
                      </span>
                    </td>

                    {/* Satellite Locks */}
                    <td className="py-3 px-4 font-mono text-sky-400 font-semibold">
                      {c.satelliteCount} GPS
                    </td>

                    {/* Mode */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                        {c.transmissionMode}
                      </span>
                    </td>

                    {/* Temperature */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {c.temperatureC}°C
                    </td>

                    {/* Last Ping */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {c.lastPingTime}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenDossier(elephant)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
