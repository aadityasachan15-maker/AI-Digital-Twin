import React from 'react';
import { LNCT_DIGITAL_TWIN_SCENARIOS } from '../data/lnctCampusData';
import { DigitalTwinScenario } from '../types/campus';
import { 
  X, 
  Sliders, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Activity,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScenarioId: string;
  onSelectScenario: (scenario: DigitalTwinScenario) => void;
  customDensityMultiplier: number;
  onDensityChange: (val: number) => void;
  customSolarMultiplier: number;
  onSolarChange: (val: number) => void;
  ambientTempC: number;
  onAmbientTempChange: (val: number) => void;
  gridAvailable: boolean;
  onToggleGrid: (val: boolean) => void;
  dgActive: boolean;
  onToggleDg: (val: boolean) => void;
  onResetToBaseline: () => void;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  selectedScenarioId,
  onSelectScenario,
  customDensityMultiplier,
  onDensityChange,
  customSolarMultiplier,
  onSolarChange,
  ambientTempC,
  onAmbientTempChange,
  gridAvailable,
  onToggleGrid,
  dgActive,
  onToggleDg,
  onResetToBaseline
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <Sliders className="w-3.5 h-3.5" />
              <span>LNCT Cyber-Physical Simulation Engine</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              "What-If" Digital Twin Stress-Testing Scenarios
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Preset Scenarios List */}
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
              1. Select Pre-Configured Campus Event Scenarios
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LNCT_DIGITAL_TWIN_SCENARIOS.map(sc => {
                const isSelected = sc.id === selectedScenarioId;
                return (
                  <div
                    key={sc.id}
                    onClick={() => onSelectScenario(sc)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs">{sc.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        sc.id === 'nominal-weekday'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : sc.id === 'bhopal-heatwave-43c'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {sc.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                      {sc.description}
                    </p>

                    <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1.5 rounded border border-slate-800/80 text-[10px]">
                      {sc.impactMetrics.map((m, idx) => (
                        <div key={idx}>
                          <span className="text-slate-400 block truncate">{m.label}</span>
                          <span className="font-mono font-semibold text-cyan-300 truncate block">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Fine-Tuning Sliders */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Live Telemetry Injector & Parametric Controls
              </span>
              <button
                onClick={onResetToBaseline}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Nominal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Density Slider */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Student Footfall Density Factor</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{(customDensityMultiplier * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={customDensityMultiplier}
                  onChange={e => onDensityChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Simulates vacations (30%) up to Srishti Fest crowd (300%)
                </span>
              </div>

              {/* Solar Factor Slider */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Solar PV Generation Factor</span>
                  <span className="font-mono text-amber-400 tabular-nums">{(customSolarMultiplier * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.2"
                  step="0.1"
                  value={customSolarMultiplier}
                  onChange={e => onSolarChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Simulates cloudy monsoon days (20%) up to peak summer noon (120%)
                </span>
              </div>

              {/* Ambient Temp Slider */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Bhopal Raisen Road Ambient Temp</span>
                  <span className="font-mono text-rose-400 tabular-nums">{ambientTempC.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="16.0"
                  max="46.0"
                  step="0.5"
                  value={ambientTempC}
                  onChange={e => onAmbientTempChange(parseFloat(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Winter morning (18°C) to extreme May heatwave (44°C)
                </span>
              </div>

              {/* Grid / DG Toggles */}
              <div className="flex flex-col justify-center gap-2">
                <span className="text-slate-300">Utility Grid & Standby DG Power</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleGrid(!gridAvailable)}
                    className={`flex-1 py-1.5 px-2.5 rounded font-mono text-[11px] border transition-colors ${
                      gridAvailable
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800 line-through'
                    }`}
                  >
                    11kV Grid: {gridAvailable ? 'CONNECTED' : 'TRIPPED'}
                  </button>
                  <button
                    onClick={() => onToggleDg(!dgActive)}
                    className={`flex-1 py-1.5 px-2.5 rounded font-mono text-[11px] border transition-colors ${
                      dgActive
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    500kVA DG: {dgActive ? 'RUNNING' : 'STANDBY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            All parameters propagate to the 2.5D Digital Twin, Asset Matrix & Energy Balance in real time.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Apply Scenario to Twin
          </button>
        </div>
      </div>
    </div>
  );
};
