import React, { useState } from 'react';
import { LNCT_ENERGY_TIMESERIES_24H } from '../data/lnctCampusData';
import { 
  Zap, 
  Sun, 
  Fuel, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  BarChart3, 
  Gauge, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface EnergyAnalyticsViewProps {
  solarMultiplier: number;
  gridAvailable: boolean;
  dgActive: boolean;
}

export const EnergyAnalyticsView: React.FC<EnergyAnalyticsViewProps> = ({
  solarMultiplier,
  gridAvailable,
  dgActive
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('12:30');

  // Compute live adjusted values based on scenario inputs
  const energyData = LNCT_ENERGY_TIMESERIES_24H.map(entry => {
    let solar = Number((entry.solarGenerationKw * solarMultiplier).toFixed(1));
    let grid = gridAvailable ? entry.gridImportKw : 0;
    let dg = dgActive ? Number((entry.totalDemandKw - solar).toFixed(1)) : 0;
    if (dg < 0) dg = 0;
    if (!gridAvailable && !dgActive) {
      grid = 0;
    }
    const total = Number((grid + solar + dg).toFixed(1));
    return {
      ...entry,
      solarGenerationKw: solar,
      gridImportKw: grid,
      dieselGensetKw: dg,
      totalDemandKw: total,
      co2SavedKg: Number((solar * 0.82).toFixed(1))
    };
  });

  const activeReading = energyData.find(e => e.timeSlot === selectedTimeSlot) || energyData[7];

  const totalDailyKwh = energyData.reduce((acc, curr) => acc + curr.totalDemandKw * 1.5, 0);
  const totalSolarKwh = energyData.reduce((acc, curr) => acc + curr.solarGenerationKw * 1.5, 0);
  const solarPenetrationPct = Math.round((totalSolarKwh / totalDailyKwh) * 100);
  const totalCarbonAvoidedKg = Math.round(totalSolarKwh * 0.82);
  const estimatedCostInr = Math.round(energyData.reduce((acc, curr) => acc + curr.costInr, 0));

  // Max peak for SVG chart scaling
  const maxKw = Math.max(...energyData.map(d => d.totalDemandKw), 800);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Campus Real-Time Demand</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {activeReading.totalDemandKw} kW
            </span>
            <span className="text-xs text-slate-400">@ {activeReading.timeSlot}</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
            PF: {activeReading.powerFactor} · {activeReading.gridFrequencyHz} Hz
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>550kWp Solar Generation</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
              {activeReading.solarGenerationKw} kW
            </span>
            <span className="text-xs text-slate-400">({Math.round((activeReading.solarGenerationKw / activeReading.totalDemandKw)*100 || 0)}%)</span>
          </div>
          <span className="text-[11px] text-amber-400 font-mono mt-1 block">
            Irradiance: {activeReading.solarIrradianceWm2} W/m²
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Daily Carbon Offset</span>
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {totalCarbonAvoidedKg} kg
            </span>
            <span className="text-xs text-slate-400">CO2e</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            {solarPenetrationPct}% Solar Self-Sufficiency
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Estimated Daily Energy Cost</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              ₹{estimatedCostInr.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400">MPEB HT-2</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Tariff Rate: ₹8.50 / kWh
          </span>
        </div>
      </div>

      {/* Main Stacked Diurnal Power Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>LNCT Central Microgrid</span>
              <span aria-hidden="true">·</span>
              <span>11kV Substation + Rooftop Solar Arrays + Cummins 500kVA DG</span>
            </div>
            <h3 className="text-base font-semibold text-white mt-0.5">
              24-Hour Campus Diurnal Power Profile (Solar vs Grid vs DG)
            </h3>
          </div>

          {/* Interactive Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-400 rounded-sm" />
              <span className="text-slate-300">Rooftop Solar PV</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-cyan-500 rounded-sm" />
              <span className="text-slate-300">11kV Grid Import</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-500 rounded-sm" />
              <span className="text-slate-300">Standby DG Genset</span>
            </span>
          </div>
        </div>

        {/* SVG Area / Stacked Bar Chart */}
        <div className="relative w-full h-64 bg-slate-950/70 border border-slate-800 rounded-lg p-3">
          <svg viewBox="0 0 760 220" className="w-full h-full">
            <defs>
              <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0, 200, 400, 600, 800].map(kw => {
              const y = 190 - (kw / maxKw) * 170;
              return (
                <g key={kw}>
                  <line x1="45" y1={y} x2="745" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="35" y={y + 4} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">
                    {kw} kW
                  </text>
                </g>
              );
            })}

            {/* Stacked bars for each time slot */}
            {energyData.map((d, i) => {
              const x = 55 + i * (680 / energyData.length);
              const barWidth = 32;
              const isSelected = d.timeSlot === selectedTimeSlot;

              // Heights
              const solarH = (d.solarGenerationKw / maxKw) * 170;
              const gridH = (d.gridImportKw / maxKw) * 170;
              const dgH = (d.dieselGensetKw / maxKw) * 170;

              const dgY = 190 - dgH;
              const gridY = dgY - gridH;
              const solarY = gridY - solarH;

              return (
                <g
                  key={d.timeSlot}
                  className="cursor-pointer group"
                  onClick={() => setSelectedTimeSlot(d.timeSlot)}
                >
                  {/* DG Genset layer (bottom if active) */}
                  {dgH > 0 && (
                    <rect
                      x={x}
                      y={dgY}
                      width={barWidth}
                      height={dgH}
                      fill="#f43f5e"
                      rx="2"
                    />
                  )}

                  {/* Grid Import layer */}
                  {gridH > 0 && (
                    <rect
                      x={x}
                      y={gridY}
                      width={barWidth}
                      height={gridH}
                      fill="url(#gridGrad)"
                      rx="2"
                    />
                  )}

                  {/* Solar Generation layer (top) */}
                  {solarH > 0 && (
                    <rect
                      x={x}
                      y={solarY}
                      width={barWidth}
                      height={solarH}
                      fill="url(#solarGrad)"
                      rx="2"
                    />
                  )}

                  {/* Selection highlight outline */}
                  {isSelected && (
                    <rect
                      x={x - 2}
                      y={solarY - 4}
                      width={barWidth + 4}
                      height={solarH + gridH + dgH + 4}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      rx="4"
                    />
                  )}

                  {/* X-axis time label */}
                  <text
                    x={x + barWidth / 2}
                    y="208"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#64748b'}
                    fontSize="9.5"
                    fontFamily="JetBrains Mono"
                    fontWeight={isSelected ? '600' : '400'}
                  >
                    {d.timeSlot}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Slot Summary Details */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Selected Interval:</span>
            <strong className="text-white ml-1.5">{activeReading.timeSlot} IST</strong>
          </div>
          <div>
            <span className="text-slate-400">Total Demand:</span>
            <strong className="text-white ml-1.5">{activeReading.totalDemandKw} kW</strong>
          </div>
          <div>
            <span className="text-slate-400">Solar Generation:</span>
            <strong className="text-amber-400 ml-1.5">{activeReading.solarGenerationKw} kW</strong>
          </div>
          <div>
            <span className="text-slate-400">Grid Import:</span>
            <strong className="text-cyan-400 ml-1.5">{activeReading.gridImportKw} kW</strong>
          </div>
          <div>
            <span className="text-slate-400">CO2 Emissions Avoided:</span>
            <strong className="text-emerald-400 ml-1.5">{activeReading.co2SavedKg} kg</strong>
          </div>
        </div>
      </div>

      {/* Deep Microgrid Engineering Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Specific Energy Consumption */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Specific Energy Index (SEC)</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {(activeReading.totalDemandKw / 75.5).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">kWh / m² per day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluated across 75,500 m² built-up academic area of LNCT Bhopal campus. ECBC (Energy Conservation Building Code) compliant limit: &le; 0.015 kWh/m².
          </p>
        </div>

        {/* AI Load Shifting & Pre-Cooling Recommendation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>AI Peak Demand Shaving (Feedback Loop)</span>
          </div>
          <div className="text-xs text-slate-200 mb-2">
            <strong>Optimal Pre-Cooling Window:</strong> 10:15 AM - 11:30 AM
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utilizes surplus solar curve from Block A & Auditorium arrays to pre-cool Kalchuri Auditorium by 2.2°C, shaving 48 kVA off the 02:00 PM peak MPEB demand penalty tier.
          </p>
        </div>

        {/* APFC Capacitor Bank & Power Factor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>APFC Capacitor Health & Harmonics</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-purple-300 font-mono tabular-nums">0.94 PF</span>
            <span className="text-xs text-emerald-400">Lagging (Bonus Tier)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatic Power Factor Controller at Central Substation maintains PF &gt; 0.92, qualifying LNCT College for MPEB power factor incentive rebates on HT monthly billing.
          </p>
        </div>
      </div>
    </div>
  );
};
