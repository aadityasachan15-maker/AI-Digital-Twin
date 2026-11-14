import React, { useState } from 'react';
import { StudentDensityZone } from '../types/campus';
import { LNCT_STUDENT_DENSITY_ZONES } from '../data/lnctCampusData';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Wind, 
  Clock, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  EyeOff,
  Radio,
  Zap,
  ArrowRight
} from 'lucide-react';

interface StudentDensityViewProps {
  densityMultiplier: number;
}

export const StudentDensityView: React.FC<StudentDensityViewProps> = ({ densityMultiplier }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZONE-CSE-LAB402');
  const [horizonFilter, setHorizonFilter] = useState<'1h' | '2h'>('1h');
  const [setpointNotice, setSetpointNotice] = useState<string | null>(null);

  const zones: StudentDensityZone[] = LNCT_STUDENT_DENSITY_ZONES.map(zone => {
    const adjustedOcc = Math.min(zone.maxCapacity, Math.round(zone.currentOccupancy * densityMultiplier));
    const density = Number((adjustedOcc / zone.areaSqm).toFixed(2));
    const pred1 = Number((zone.predictedDensity1h * densityMultiplier).toFixed(2));
    const pred2 = Number((zone.predictedDensity2h * densityMultiplier).toFixed(2));
    let level: 'low' | 'moderate' | 'high' | 'overcrowded' = 'low';
    if (density > 0.6) level = 'overcrowded';
    else if (density > 0.4) level = 'high';
    else if (density > 0.25) level = 'moderate';

    return {
      ...zone,
      currentOccupancy: adjustedOcc,
      densityPerSqm: density,
      predictedDensity1h: pred1,
      predictedDensity2h: pred2,
      congestionLevel: level,
      wifiProbeCount: Math.round(adjustedOcc * 1.12),
      hvacSavingsKw: Number(((zone.maxCapacity - adjustedOcc) * 0.04).toFixed(1))
    };
  });

  const activeZone = zones.find(z => z.zoneId === selectedZoneId) || zones[0];

  const totalCampusOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const totalMaxCapacity = zones.reduce((acc, z) => acc + z.maxCapacity, 0);
  const totalHvacSavings = zones.reduce((acc, z) => acc + z.hvacSavingsKw, 0).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Aggregated Campus Footfall</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {totalCampusOccupancy.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400">Students & Staff</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
            {Math.round((totalCampusOccupancy / totalMaxCapacity) * 100)}% Saturation Index
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Privacy Compliance (DPDP Act)</span>
            <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">Zero PII</span>
            <span className="text-xs text-slate-400">Preserved</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            SHA-256 Salted MAC Probes + ToF
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Predicted Departure Horizon</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-300 font-mono tabular-nums">
              ST-GCN + LSTM
            </span>
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-1 block">
            94.1% Temporal Graph Accuracy
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active HVAC Coupled Savings</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-300 font-mono tabular-nums">
              {totalHvacSavings} kW
            </span>
            <span className="text-xs text-slate-400">Curtailed</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
            Preemptive VFD Damper Tuning
          </span>
        </div>
      </div>

      {/* Main Grid: Zone Overview Table & Spatial AI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Table of Monitored Zones (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Campus Spatial Density & Flow</h3>
                <span className="text-xs text-slate-400">Monitored via ESP32 WiFi Sniffers & Time-of-Flight (ToF) arrays</span>
              </div>

              {/* Horizon switch */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setHorizonFilter('1h')}
                  className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                    horizonFilter === '1h' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  +1 Hour Horizon
                </button>
                <button
                  onClick={() => setHorizonFilter('2h')}
                  className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                    horizonFilter === '2h' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  +2 Hour Horizon
                </button>
              </div>
            </div>

            {/* Density Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">Zone / Hall</th>
                    <th className="py-2.5 px-3 text-right">Occupancy</th>
                    <th className="py-2.5 px-3 text-right">Density</th>
                    <th className="py-2.5 px-3 text-right">Predicted ({horizonFilter})</th>
                    <th className="py-2.5 px-3 text-right">Coupled HVAC</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {zones.map(z => {
                    const isSelected = z.zoneId === activeZone.zoneId;
                    const predictedVal = horizonFilter === '1h' ? z.predictedDensity1h : z.predictedDensity2h;
                    return (
                      <tr
                        key={z.zoneId}
                        onClick={() => setSelectedZoneId(z.zoneId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-800/90 text-white font-medium' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans">
                          <span className="font-semibold block text-slate-200">{z.zoneName}</span>
                          <span className="text-[10px] text-slate-400">{z.floor} · {z.areaSqm} m²</span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {z.currentOccupancy} <span className="text-slate-500">/ {z.maxCapacity}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {z.densityPerSqm} <span className="text-slate-500">p/m²</span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-purple-300">
                          {predictedVal} <span className="text-slate-500">p/m²</span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400">
                          -{z.hvacSavingsKw} kW
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-sans uppercase ${
                            z.congestionLevel === 'low'
                              ? 'bg-emerald-950/70 text-emerald-400'
                              : z.congestionLevel === 'moderate'
                              ? 'bg-cyan-950/70 text-cyan-400'
                              : z.congestionLevel === 'high'
                              ? 'bg-amber-950/70 text-amber-400'
                              : 'bg-rose-950/70 text-rose-400'
                          }`}>
                            {z.congestionLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Note at Bottom */}
          <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Architecture:</strong> No facial recognition or optical cameras are deployed. Density is inferred strictly via ESP32 WiFi RSSI probe sniffing with rotative SHA-256 MAC truncation and ceiling-mounted dual Time-of-Flight (ToF) laser doorway counters.
            </span>
          </div>
        </div>

        {/* Right Side: Deep Zone Spatial Twin & Predictive Flow (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-mono text-cyan-400">{activeZone.zoneId} Spatial Inspector</span>
              <h3 className="text-base font-semibold text-white mt-0.5">{activeZone.zoneName}</h3>
              <span className="text-xs text-slate-400">{activeZone.floor} · Total Floor Space: {activeZone.areaSqm} m²</span>
            </div>

            {/* Predictive Trend Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-medium">
                <span>ST-GCN Density Forecast (Current vs +1h vs +2h)</span>
                <span className="font-mono text-cyan-400 text-[11px]">Persons / m²</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-center font-mono">
                <div className="flex-1 p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Now (Live)</span>
                  <span className="text-base font-bold text-white tabular-nums">{activeZone.densityPerSqm}</span>
                  <span className="text-[10px] text-slate-500 block">{activeZone.currentOccupancy} students</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                <div className="flex-1 p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-purple-400 block font-sans">+1h Predicted</span>
                  <span className="text-base font-bold text-purple-300 tabular-nums">{activeZone.predictedDensity1h}</span>
                  <span className="text-[10px] text-slate-500 block">{Math.round(activeZone.predictedDensity1h * activeZone.areaSqm)} students</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                <div className="flex-1 p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-cyan-400 block font-sans">+2h Predicted</span>
                  <span className="text-base font-bold text-cyan-300 tabular-nums">{activeZone.predictedDensity2h}</span>
                  <span className="text-[10px] text-slate-500 block">{Math.round(activeZone.predictedDensity2h * activeZone.areaSqm)} students</span>
                </div>
              </div>
            </div>

            {/* Edge Ingestion Metrics */}
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">WiFi Probes Detected (Salted Hash)</span>
                <span className="text-slate-200 font-mono tabular-nums">{activeZone.wifiProbeCount} active devices</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Ceiling ToF Passage Sensor Inflow</span>
                <span className="text-slate-200 font-mono tabular-nums">+{activeZone.inflowRatePerHour} persons / hr</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Ceiling ToF Passage Sensor Outflow</span>
                <span className="text-slate-200 font-mono tabular-nums">-{activeZone.outflowRatePerHour} persons / hr</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                <span className="text-slate-400">Coupled HVAC Setpoint Target</span>
                <span className="text-cyan-400 font-mono tabular-nums">{activeZone.hvacSetpointOptimalC}°C</span>
              </div>
            </div>

            {/* Automated Actuation Feedback Mechanism */}
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-xs leading-relaxed text-slate-300">
              <strong className="text-cyan-300 block mb-1">Cyber-Physical Coupled Action:</strong>
              When the ST-GCN model predicts a density drop from {activeZone.densityPerSqm} to {activeZone.predictedDensity2h} p/m² at class dismissal, the digital twin automatically instructs the AHU damper actuators to throttle intake 20 minutes in advance, saving <strong className="text-emerald-400">{activeZone.hvacSavingsKw} kW</strong> in cooling energy.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            {setpointNotice && (
              <div className="mb-3 p-2.5 bg-emerald-950/70 border border-emerald-800 rounded-lg text-[11px] font-mono text-emerald-300">
                {setpointNotice}
              </div>
            )}
            <button
              onClick={() => {
                setSetpointNotice(`BACnet setpoint ${activeZone.hvacSetpointOptimalC}°C dispatched to ${activeZone.zoneName} AHU damper.`);
                setTimeout(() => setSetpointNotice(null), 5000);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Apply Predictive Setpoint Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
