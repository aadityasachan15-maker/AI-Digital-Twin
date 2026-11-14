import React, { useState } from 'react';
import { CampusAsset } from '../types/campus';
import { LNCT_CAMPUS_ASSETS } from '../data/lnctCampusData';
import { 
  Activity, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap, 
  Cpu, 
  Gauge, 
  Radio, 
  Play, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface AssetMonitoringViewProps {
  faultAssetId?: string;
}

export const AssetMonitoringView: React.FC<AssetMonitoringViewProps> = ({ faultAssetId }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(faultAssetId || 'AST-PUMP-HYD01');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [workOrderNotice, setWorkOrderNotice] = useState<string | null>(null);

  const assets = LNCT_CAMPUS_ASSETS.map(asset => {
    if (faultAssetId && asset.id === faultAssetId) {
      return {
        ...asset,
        vibrationRms: 3.92,
        healthIndex: 42,
        failureRisk: 'critical' as const,
        predictedRulDays: 3,
        telemetryStatus: 'alert' as const
      };
    }
    return asset;
  });

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.makeModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const activeAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleRunDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResult(`FFT Spectrum Analysis Complete: Kurtosis = 4.82, 1X Shaft harmonic = 29.8 Hz, BPFO (Outer Race Defect) peak detected at 142.6 Hz. Confidence = 94.2%.`);
    }, 1200);
  };

  const handleIssueWorkOrder = () => {
    const woNum = `WO-LNCT-${Math.floor(Math.random() * 8999 + 1000)}`;
    setWorkOrderNotice(`Work Order #${woNum} queued for ${activeAsset.name} (Predicted RUL: ${activeAsset.predictedRulDays} days).`);
    setTimeout(() => setWorkOrderNotice(null), 5000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Monitored Heavy Assets</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{assets.length}</span>
            <span className="text-xs text-slate-400">LNCT Infrastructure</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">100% IoT Telemetry Live</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Mean Asset Health Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {(assets.reduce((acc, a) => acc + a.healthIndex, 0) / assets.length).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">Condition Rating</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-1 block">Predictive Maintenance Mode</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Assets Requiring Attention</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
              {assets.filter(a => a.failureRisk === 'moderate' || a.failureRisk === 'elevated' || a.failureRisk === 'critical').length}
            </span>
            <span className="text-xs text-slate-400">Vibration / Temp</span>
          </div>
          <span className="text-[11px] text-amber-400 font-mono mt-1 block">Pump 1 & Substation T-01</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">IoT Sampling Cadence</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">1.0 kHz</span>
            <span className="text-xs text-slate-400">Vibration Burst</span>
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-1 block">Edge FFT Spectral Inference</span>
        </div>
      </div>

      {/* Main Grid: Asset List & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Asset Table / List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Campus Asset Health Matrix</h3>
              <span className="text-xs text-slate-400">Real-time vibration, bearing thermography, and RUL forecasting</span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {['all', 'hvac', 'electrical', 'hydraulics', 'solar', 'computing'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors whitespace-nowrap ${
                    categoryFilter === cat ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by asset name, location, make, or node ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Asset List */}
          <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredAssets.map(asset => {
              const isSelected = asset.id === activeAsset.id;
              const isAlert = asset.failureRisk === 'critical' || asset.failureRisk === 'elevated';
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-cyan-400">{asset.id}</span>
                      <span className="text-xs font-semibold text-slate-200">{asset.name}</span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                      asset.failureRisk === 'low'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : asset.failureRisk === 'moderate'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800/60 animate-pulse'
                    }`}>
                      {asset.failureRisk.toUpperCase()} RISK
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-2 truncate">
                    {asset.location} · {asset.makeModel}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Health Index</span>
                      <span className="font-mono font-semibold text-slate-200 tabular-nums">{asset.healthIndex}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vibration RMS</span>
                      <span className={`font-mono font-semibold tabular-nums ${
                        asset.vibrationRms > asset.vibrationThreshold ? 'text-rose-400' : 'text-slate-200'
                      }`}>
                        {asset.vibrationRms.toFixed(2)} mm/s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bearing Temp</span>
                      <span className="font-mono font-semibold text-slate-200 tabular-nums">{asset.bearingTempC.toFixed(1)}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Predicted RUL</span>
                      <span className={`font-mono font-semibold tabular-nums ${
                        asset.predictedRulDays < 30 ? 'text-rose-400' : 'text-cyan-400'
                      }`}>
                        {asset.predictedRulDays} Days
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Deep Telemetry & FFT Vibration Spectral Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">{activeAsset.id} Telemetry Inspector</span>
                <h3 className="text-base font-semibold text-white mt-0.5">{activeAsset.name}</h3>
              </div>
              <button
                onClick={handleRunDiagnostic}
                disabled={isDiagnosticRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-semibold"
              >
                {isDiagnosticRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run FFT Pulse</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Alert Result if run */}
            {diagnosticResult && (
              <div className="p-3 bg-cyan-950/60 border border-cyan-800 rounded-lg text-xs text-cyan-200 mb-4 font-mono leading-relaxed">
                {diagnosticResult}
              </div>
            )}

            {/* Synthetic Vibration FFT Spectrum Chart */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span className="font-semibold">Vibration Frequency Spectrum (FFT)</span>
                <span className="font-mono text-cyan-400 text-[11px]">0 Hz to 500 Hz</span>
              </div>
              <div className="h-32 bg-slate-950 rounded-lg border border-slate-800 p-2 flex items-end justify-between gap-1 relative overflow-hidden">
                {/* Horizontal ISO Alert Threshold line */}
                <div 
                  className="absolute left-0 right-0 border-b border-dashed border-rose-500/70 z-10" 
                  style={{ bottom: '70%' }}
                >
                  <span className="text-[9px] font-mono text-rose-400 absolute right-2 -top-3.5">
                    ISO 10816 Limit: {activeAsset.vibrationThreshold} mm/s
                  </span>
                </div>

                {/* Spectral bars simulation */}
                {[12, 18, 45, 82, 34, 15, 22, 68, 92, 40, 24, 18, 55, 30, 16, 12, 8, 26, 14, 10].map((val, idx) => {
                  const isPeak = idx === 8 || idx === 3;
                  const barHeight = Math.min(95, Math.round(val * (activeAsset.vibrationRms / 2.0)));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isPeak && activeAsset.vibrationRms > activeAsset.vibrationThreshold
                            ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                            : 'bg-cyan-500/80 hover:bg-cyan-400'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span>0 Hz (1X RPM)</span>
                <span>150 Hz (Bearing BPFO)</span>
                <span>300 Hz (Gearmesh)</span>
                <span>500 Hz</span>
              </div>
            </div>

            {/* Asset Specifications Breakdown */}
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Make & Model</span>
                <span className="text-slate-200 font-medium">{activeAsset.makeModel}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Rated Capacity</span>
                <span className="text-slate-200 font-mono">{activeAsset.ratedCapacity}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Current Draw & THD</span>
                <span className="text-slate-200 font-mono">{activeAsset.currentDrawAmps} A · {activeAsset.harmonicThdPct}% THD</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Associated IoT Node</span>
                <span className="text-cyan-400 font-mono text-[11px]">{activeAsset.iotSensorNode}</span>
              </div>
            </div>

            {/* Recent Maintenance Log */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Physical Maintenance & Calibration History
              </span>
              <div className="flex flex-col gap-1.5">
                {activeAsset.maintenanceHistory.map((m, idx) => (
                  <div key={idx} className="p-2 bg-slate-950/80 rounded border border-slate-800/80 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 mb-0.5">
                      <span className="font-mono">{m.date}</span>
                      <span className="text-slate-300">{m.technician}</span>
                    </div>
                    <div className="text-slate-200">{m.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button at bottom */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            {workOrderNotice && (
              <div className="mb-3 p-2.5 bg-emerald-950/70 border border-emerald-800 rounded-lg text-[11px] font-mono text-emerald-300">
                {workOrderNotice}
              </div>
            )}
            <button
              onClick={handleIssueWorkOrder}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Issue Predictive Maintenance Work Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
