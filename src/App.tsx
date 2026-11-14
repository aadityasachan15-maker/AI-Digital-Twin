import React, { useCallback, useEffect, useState } from 'react';
import { Header, MainSectionTab } from './components/Header';
import { CampusMapTwin } from './components/CampusMapTwin';
import { AssetMonitoringView } from './components/AssetMonitoringView';
import { EnergyAnalyticsView } from './components/EnergyAnalyticsView';
import { StudentDensityView } from './components/StudentDensityView';
import { DatasetsDownloadView } from './components/DatasetsDownloadView';
import { EngineeringWorkflowGuide } from './components/EngineeringWorkflowGuide';
import { HardwareBridgeView } from './components/HardwareBridgeView';
import { RGPVAcademicPredictorView } from './components/RGPVAcademicPredictorView';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import {
  CampusBlock,
  CampusBlockId,
  DigitalTwinScenario,
  LiveTelemetryPacket
} from './types/campus';
import {
  LNCT_CAMPUS_BLOCKS,
  LNCT_DIGITAL_TWIN_SCENARIOS
} from './data/lnctCampusData';
import {
  Building2,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainSectionTab>('map');
  const [telemetrySubTab, setTelemetrySubTab] = useState<'energy' | 'assets' | 'density'>('energy');
  const [hardwareSubTab, setHardwareSubTab] = useState<'simulator' | 'blueprint'>('simulator');

  const [blocks, setBlocks] = useState<CampusBlock[]>(LNCT_CAMPUS_BLOCKS);
  const [packets, setPackets] = useState<LiveTelemetryPacket[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<CampusBlockId>('cv-raman-block');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);

  // Simulation Scenario States
  const [activeScenario, setActiveScenario] = useState<DigitalTwinScenario>(LNCT_DIGITAL_TWIN_SCENARIOS[0]);
  const [densityMultiplier, setDensityMultiplier] = useState<number>(1.0);
  const [solarMultiplier, setSolarMultiplier] = useState<number>(1.0);
  const [ambientTempC, setAmbientTempC] = useState<number>(31.0);
  const [gridAvailable, setGridAvailable] = useState<boolean>(true);
  const [dgActive, setDgActive] = useState<boolean>(false);
  const [faultAssetId, setFaultAssetId] = useState<string | undefined>(undefined);

  const fetchTwinState = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/twin/state');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.blocks)) setBlocks(data.blocks);
      if (Array.isArray(data.recent_packets)) setPackets(data.recent_packets);
    } catch {
      // Retain local fallback data if offline
    }
  }, []);

  useEffect(() => {
    fetchTwinState();
  }, [fetchTwinState]);

  const handleToggleRelay = async (
    blockId: CampusBlockId,
    relay: 'acOn' | 'lightsOn' | 'autoControl',
    value: boolean
  ) => {
    // Optimistically update UI immediately
    setBlocks(prev =>
      prev.map(b =>
        b.id === blockId ? { ...b, relays: { ...b.relays, [relay]: value } } : b
      )
    );

    try {
      await fetch('/api/v1/actuate/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_id: blockId,
          ac_on: relay === 'acOn' ? value : undefined,
          lights_on: relay === 'lightsOn' ? value : undefined,
          auto_control: relay === 'autoControl' ? value : undefined
        })
      });
      await fetchTwinState();
    } catch {
      // Safe fallback handled by optimistic update
    }
  };

  const handleSelectScenario = (sc: DigitalTwinScenario) => {
    setActiveScenario(sc);
    setDensityMultiplier(sc.simulationAdjustments.densityMultiplier);
    setSolarMultiplier(sc.simulationAdjustments.solarMultiplier);
    setAmbientTempC(sc.simulationAdjustments.ambientTempC);
    setGridAvailable(sc.simulationAdjustments.gridAvailable);
    setDgActive(sc.simulationAdjustments.dgActive);
    setFaultAssetId(sc.simulationAdjustments.assetFaultId);
  };

  const handleResetToBaseline = () => {
    handleSelectScenario(LNCT_DIGITAL_TWIN_SCENARIOS[0]);
  };

  const totalOccupancy = Math.round(7200 * densityMultiplier);
  const solarGenKw = Math.round(520 * solarMultiplier);
  const totalDemandKw = Math.round(905 * (densityMultiplier * 0.2 + 0.8));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
      />

      {/* Campus Context & Live Telemetry Strip */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>LNCT College, Bhopal</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Kalchuri Nagar, Raisen Road, Bhopal (MP)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-400">Active Students:</span>
              <strong className="text-cyan-400 tabular-nums">{totalOccupancy.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Campus Demand:</span>
              <strong className="text-amber-400 tabular-nums">{totalDemandKw} kW</strong>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-slate-400">Solar PV:</span>
              <strong className="text-emerald-400 tabular-nums">{solarGenKw} kW</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsScenarioModalOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              >
                <span>{activeScenario.badge}</span>
                <ChevronRight className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-800 text-xs">
          {[
            { id: 'map', label: '3D Campus' },
            { id: 'rgpv', label: 'RGPV & Exams' },
            { id: 'telemetry', label: 'Energy & Density' },
            { id: 'datasets', label: 'Datasets' },
            { id: 'hardware-guide', label: 'FastAPI & ESP32' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as MainSectionTab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                activeTab === t.id ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* View Component Router */}
        {activeTab === 'map' && (
          <CampusMapTwin
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onToggleRelay={handleToggleRelay}
            densityMultiplier={densityMultiplier}
            solarMultiplier={solarMultiplier}
            ambientTempC={ambientTempC}
          />
        )}

        {activeTab === 'rgpv' && (
          <RGPVAcademicPredictorView />
        )}

        {activeTab === 'telemetry' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Campus Energy, Asset Health & Student Density</h2>
                <span className="text-xs text-slate-400">550kWp rooftop solar microgrid, ISO 10816 vibration analytics, and ST-GCN crowd forecasting across 12 blocks</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setTelemetrySubTab('energy')}
                  className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    telemetrySubTab === 'energy' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Energy & Solar
                </button>
                <button
                  onClick={() => setTelemetrySubTab('assets')}
                  className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    telemetrySubTab === 'assets' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Asset Health
                </button>
                <button
                  onClick={() => setTelemetrySubTab('density')}
                  className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    telemetrySubTab === 'density' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Student Density
                </button>
              </div>
            </div>

            {telemetrySubTab === 'energy' ? (
              <EnergyAnalyticsView
                solarMultiplier={solarMultiplier}
                gridAvailable={gridAvailable}
                dgActive={dgActive}
              />
            ) : telemetrySubTab === 'assets' ? (
              <AssetMonitoringView faultAssetId={faultAssetId} />
            ) : (
              <StudentDensityView densityMultiplier={densityMultiplier} />
            )}
          </div>
        )}

        {activeTab === 'datasets' && (
          <DatasetsDownloadView />
        )}

        {activeTab === 'hardware-guide' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Software Stack, FastAPI & Hardware-Ready ESP32 Bridge</h2>
                <span className="text-xs text-slate-400">Simulate live ESP32/Arduino packets now or download the complete Python FastAPI + AI bundle</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setHardwareSubTab('simulator')}
                  className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    hardwareSubTab === 'simulator' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Sensor Simulator & FastAPI Bundle
                </button>
                <button
                  onClick={() => setHardwareSubTab('blueprint')}
                  className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    hardwareSubTab === 'blueprint' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Step-by-Step Workflow & Architecture
                </button>
              </div>
            </div>

            {hardwareSubTab === 'simulator' ? (
              <HardwareBridgeView
                blocks={blocks}
                packets={packets}
                onRefreshState={fetchTwinState}
              />
            ) : (
              <EngineeringWorkflowGuide />
            )}
          </div>
        )}
      </main>

      {/* Scenario Stress-Tester Modal */}
      <ScenarioSimulatorModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        selectedScenarioId={activeScenario.id}
        onSelectScenario={handleSelectScenario}
        customDensityMultiplier={densityMultiplier}
        onDensityChange={setDensityMultiplier}
        customSolarMultiplier={solarMultiplier}
        onSolarChange={setSolarMultiplier}
        ambientTempC={ambientTempC}
        onAmbientTempChange={setAmbientTempC}
        gridAvailable={gridAvailable}
        onToggleGrid={setGridAvailable}
        dgActive={dgActive}
        onToggleDg={setDgActive}
        onResetToBaseline={handleResetToBaseline}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span>© 2026 LNCT Group of Colleges, Bhopal</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>AI Digital Twin Smart Campus Initiative</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Kalchuri Nagar, Raisen Road, Bhopal 462022</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('datasets')}
              className="hover:text-slate-200 transition-colors"
            >
              CSV/JSON Datasets
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => { setActiveTab('hardware-guide'); setHardwareSubTab('simulator'); }}
              className="hover:text-slate-200 transition-colors"
            >
              FastAPI & ESP32 Code
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsScenarioModalOpen(true)}
              className="hover:text-cyan-400 transition-colors font-mono"
            >
              {activeScenario.title}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
