import React from 'react';
import { ForestAlert, Elephant } from '../types';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Zap, 
  BellRing,
  ShieldAlert
} from 'lucide-react';

interface AlertsPanelProps {
  alerts: ForestAlert[];
  elephants: Elephant[];
  isOpen: boolean;
  onClose: () => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenDispatch: (elephant: Elephant) => void;
  onSelectElephant: (elephantId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  elephants,
  isOpen,
  onClose,
  onAcknowledgeAlert,
  onOpenDispatch,
  onSelectElephant,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-400">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Active Incident Alerts & Geofence Breaches
              </h3>
              <p className="text-xs text-slate-400">
                Forest Department Conflict Mitigation Stream
              </p>
            </div>
          </div>

          <button
            id="close-alerts-panel-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active alerts. All tracked elephants are in safe zones.
            </div>
          ) : (
            alerts.map(alert => {
              const matchedElephant = elephants.find(e => e.id === alert.elephantId);
              const isCritical = alert.severity === 'Critical';

              return (
                <div
                  key={alert.id}
                  id={`alert-card-${alert.id}`}
                  className={`p-4 rounded-xl border transition-all ${
                    !alert.acknowledged
                      ? isCritical 
                        ? 'bg-red-950/40 border-red-700 shadow-md ring-1 ring-red-600/60'
                        : 'bg-amber-950/40 border-amber-700'
                      : 'bg-slate-950/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        isCritical ? 'bg-red-900 text-red-200 border border-red-600' : 'bg-amber-900 text-amber-200 border border-amber-600'
                      }`}>
                        {alert.severity} PRIORITY
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    {alert.acknowledged ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Acknowledged
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-red-400 animate-pulse">
                        Unacknowledged
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {alert.description}
                  </p>

                  {alert.actionTaken && (
                    <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 mb-3">
                      <strong className="text-emerald-400">Action Record:</strong> {alert.actionTaken}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectElephant(alert.elephantId);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Locate on Map</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!alert.acknowledged && (
                        <button
                          id={`ack-alert-btn-${alert.id}`}
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {matchedElephant && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDispatch(matchedElephant);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Dispatch Patrol</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
