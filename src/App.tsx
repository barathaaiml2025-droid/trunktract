import React, { useState, useEffect, useCallback } from 'react';
import { Elephant, ForestAlert, FieldOfficerAction } from './types';
import { INITIAL_ELEPHANTS, INITIAL_ALERTS } from './data/mockElephants';
import { calculateRisk } from './utils/riskCalculator';
import { Header } from './components/Header';
import { MetricOverview } from './components/MetricOverview';
import { MapView } from './components/MapView';
import { ElephantList } from './components/ElephantList';
import { ElephantDetailModal } from './components/ElephantDetailModal';
import { RiskAssessmentView } from './components/RiskAssessmentView';
import { CollarHealthView } from './components/CollarHealthView';
import { AlertsPanel } from './components/AlertsPanel';
import { DispatchModal } from './components/DispatchModal';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [elephants, setElephants] = useState<Elephant[]>(INITIAL_ELEPHANTS);
  const [alerts, setAlerts] = useState<ForestAlert[]>(INITIAL_ALERTS);
  const [selectedElephantId, setSelectedElephantId] = useState<string | null>('el-01'); // Start focused on Raja (Critical)
  const [activeTab, setActiveTab] = useState<'map' | 'risk' | 'collars'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRiskFilter, setActiveRiskFilter] = useState<string | null>(null);

  // Modals
  const [dossierElephant, setDossierElephant] = useState<Elephant | null>(null);
  const [dispatchElephant, setDispatchElephant] = useState<Elephant | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4000);
  };

  // Simulated GPS Telemetry Ping Updates
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setElephants(prevElephants => {
        return prevElephants.map(elephant => {
          // Slight realistic GPS drift based on speed and heading
          const speedFactor = elephant.movement.speedKmh / 50000;
          const headingRad = (elephant.movement.headingDeg * Math.PI) / 180;
          const deltaLat = Math.cos(headingRad) * speedFactor;
          const deltaLng = Math.sin(headingRad) * speedFactor;

          const newLat = elephant.location.lat + (Math.random() - 0.48) * 0.0003 + deltaLat;
          const newLng = elephant.location.lng + (Math.random() - 0.48) * 0.0003 + deltaLng;

          // Slight speed fluctuation (+/- 0.2 km/h)
          const newSpeed = Math.max(0.1, Number((elephant.movement.speedKmh + (Math.random() - 0.5) * 0.3).toFixed(1)));
          
          // Re-evaluate risk dynamically
          const isMovingTowards = elephant.movement.headingDeg > 90 && elephant.movement.headingDeg < 270;
          const riskResult = calculateRisk({
            distanceMeters: elephant.distanceToHumanBoundaryMeters,
            speedKmh: newSpeed,
            isMovingTowardsSettlement: isMovingTowards,
            herdType: elephant.herdType,
            hasConflictHistory: elephant.riskFactors.conflictHistoryScore > 2,
            hourOfDay: 20
          });

          return {
            ...elephant,
            location: {
              ...elephant.location,
              lat: newLat,
              lng: newLng
            },
            movement: {
              ...elephant.movement,
              speedKmh: newSpeed,
            },
            riskScore: riskResult.score,
            riskLevel: riskResult.level,
            riskFactors: riskResult.factors
          };
        });
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handlers
  const handleSelectElephant = useCallback((id: string) => {
    setSelectedElephantId(id);
    if (activeTab !== 'map') {
      setActiveTab('map');
    }
  }, [activeTab]);

  const handleOpenDossier = useCallback((elephant: Elephant) => {
    setDossierElephant(elephant);
  }, []);

  const handleOpenDispatch = useCallback((elephant: Elephant) => {
    setDispatchElephant(elephant);
  }, []);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    showGlobalToast('Incident alert acknowledged by forest monitoring official.');
  }, []);

  const handleConfirmDispatch = useCallback((elephantId: string, action: FieldOfficerAction) => {
    // Update elephant last action
    setElephants(prev => prev.map(e => {
      if (e.id === elephantId) {
        return {
          ...e,
          lastAction: {
            timestamp: action.timestamp,
            actionType: 'RRT Patrol Dispatched',
            officer: action.officerName,
            notes: action.notes
          }
        };
      }
      return e;
    }));

    // Update or add alert record
    setAlerts(prev => {
      const existing = prev.find(a => a.elephantId === elephantId);
      if (existing) {
        return prev.map(a => a.id === existing.id ? { ...a, acknowledged: true, actionTaken: action.notes } : a);
      }
      return prev;
    });

    showGlobalToast(`🚨 Rapid Response Team deployed for ${elephants.find(e => e.id === elephantId)?.name || 'Elephant'}!`);
  }, [elephants]);

  const handleExecuteAction = useCallback((elephantId: string, action: FieldOfficerAction) => {
    setElephants(prev => prev.map(e => {
      if (e.id === elephantId) {
        return {
          ...e,
          lastAction: {
            timestamp: action.timestamp,
            actionType: action.actionType,
            officer: action.officerName,
            notes: action.notes
          }
        };
      }
      return e;
    }));
  }, []);

  const selectedElephant = elephants.find(e => e.id === selectedElephantId) || elephants[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        alerts={alerts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Global Notification Toast */}
      {globalToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        {/* Top Metric Bar */}
        <MetricOverview
          elephants={elephants}
          alerts={alerts}
          onFilterRisk={setActiveRiskFilter}
          activeRiskFilter={activeRiskFilter}
        />

        {/* Tab 1: Live Interactive GIS Map & Monitored Elephants */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* GIS Map Column */}
            <div className="lg:col-span-8 flex flex-col">
              <MapView
                elephants={elephants}
                selectedElephantId={selectedElephantId}
                onSelectElephant={handleSelectElephant}
                onOpenDispatch={handleOpenDispatch}
              />
            </div>

            {/* Collared Elephants List Column */}
            <div className="lg:col-span-4 flex flex-col">
              <ElephantList
                elephants={elephants}
                selectedElephantId={selectedElephantId}
                onSelectElephant={handleSelectElephant}
                onOpenDossier={handleOpenDossier}
                onOpenDispatch={handleOpenDispatch}
                activeRiskFilter={activeRiskFilter}
                onFilterRisk={setActiveRiskFilter}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Full Conflict Risk Matrix */}
        {activeTab === 'risk' && (
          <RiskAssessmentView
            elephants={elephants}
            onSelectElephant={handleSelectElephant}
            onOpenDossier={handleOpenDossier}
          />
        )}

        {/* Tab 3: Collar Telemetry & Hardware Health */}
        {activeTab === 'collars' && (
          <CollarHealthView
            elephants={elephants}
            onOpenDossier={handleOpenDossier}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ElephantTrack &bull; Forest Department Wildlife Telemetry Operations</span>
          <span className="font-mono text-[11px] text-slate-400">
            Nilgiri Biosphere Division &bull; Real-time GPS/LoRa/Iridium Grid
          </span>
        </div>
      </footer>

      {/* Dossier Modal */}
      {dossierElephant && (
        <ElephantDetailModal
          elephant={dossierElephant}
          onClose={() => setDossierElephant(null)}
          onOpenDispatch={handleOpenDispatch}
          onExecuteAction={handleExecuteAction}
        />
      )}

      {/* Field Dispatch Modal */}
      {dispatchElephant && (
        <DispatchModal
          elephant={dispatchElephant}
          onClose={() => setDispatchElephant(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {/* Incident Alerts Drawer / Panel */}
      <AlertsPanel
        alerts={alerts}
        elephants={elephants}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onOpenDispatch={handleOpenDispatch}
        onSelectElephant={handleSelectElephant}
      />
    </div>
  );
}
