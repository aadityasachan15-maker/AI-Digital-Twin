import React, { useState } from 'react';
import { CampusBlock, CampusBlockId } from '../types/campus';
import {
  LNCT_DISTANCE_MATRIX,
  getInterBuildingDistance
} from '../data/lnctCampusData';
import { Campus3DViewport, MapLayerMode } from './Campus3DViewport';
import {
  Zap,
  Users,
  Activity,
  Radio,
  MapPin,
  Navigation,
  Power,
  Lightbulb,
  ExternalLink,
  Box,
  Globe
} from 'lucide-react';

interface CampusMapTwinProps {
  blocks: CampusBlock[];
  selectedBlockId: CampusBlockId;
  onSelectBlock: (id: CampusBlockId) => void;
  onToggleRelay: (blockId: CampusBlockId, relay: 'acOn' | 'lightsOn' | 'autoControl', value: boolean) => Promise<void>;
  densityMultiplier: number;
  solarMultiplier: number;
  ambientTempC: number;
}

export const CampusMapTwin: React.FC<CampusMapTwinProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onToggleRelay,
  densityMultiplier,
  solarMultiplier,
  ambientTempC
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'satellite-matrix'>('3d');
  const [activeLayer, setActiveLayer] = useState<MapLayerMode>('density');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [routeFromId, setRouteFromId] = useState<CampusBlockId>('main-gate-transport');
  const [routeToId, setRouteToId] = useState<CampusBlockId>('central-library');
  const [actuationMessage, setActuationMessage] = useState<string | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];
  const computedRoute = getInterBuildingDistance(routeFromId, routeToId);

  const getDynamicOccupancy = (block: CampusBlock) => {
    return Math.min(block.maxCapacity, Math.round(block.currentOccupancy * densityMultiplier));
  };

  const getDynamicPower = (block: CampusBlock) => {
    if (block.id === 'substation-utility') {
      const solarGen = Math.round(445 * solarMultiplier);
      return { draw: block.powerDrawKw, solar: solarGen };
    }
    const relayFactor = (block.relays.acOn ? 0.7 : 0.15) + (block.relays.lightsOn ? 0.3 : 0.05);
    const occFactor = ((getDynamicOccupancy(block) / block.maxCapacity) * 0.25 + 0.75) * relayFactor;
    return { draw: Number((block.powerDrawKw * occFactor).toFixed(1)), solar: 0 };
  };

  const handleRelayClick = async (relay: 'acOn' | 'lightsOn' | 'autoControl', nextVal: boolean) => {
    await onToggleRelay(selectedBlock.id, relay, nextVal);
    setActuationMessage(
      `API Dispatched -> ${selectedBlock.code} ${relay === 'acOn' ? 'HVAC Relay' : relay === 'lightsOn' ? 'Lighting Relay' : 'AI Auto-Cutoff'} set to ${nextVal ? 'ON' : 'OFF'}`
    );
    setTimeout(() => setActuationMessage(null), 3500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main 3D / Geospatial Viewport Column */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col shadow-2xl">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">LNCT Bhopal Campus Matrix</span>
              <span aria-hidden="true">·</span>
              <span>Kalchuri Nagar, Raisen Road</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-400 tabular-nums">
                {selectedBlock.gps.lat.toFixed(5)}° N, {selectedBlock.gps.lng.toFixed(5)}° E
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight mt-0.5">
              Interactive 3D Smart Campus Digital Twin (Three.js + Real GPS)
            </h2>
          </div>

          {/* Primary View Mode Switch: 3D Twin vs Satellite Matrix */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/90 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === '3d' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D WebGL Twin</span>
            </button>
            <button
              onClick={() => setViewMode('satellite-matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'satellite-matrix' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GPS & Distance Matrix</span>
            </button>
          </div>
        </div>

        {/* Layer Switcher & Shortest-Path Distance Tool */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80 text-xs">
          {/* Layer Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveLayer('density')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeLayer === 'density' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Occupancy</span>
            </button>
            <button
              onClick={() => setActiveLayer('energy')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeLayer === 'energy' ? 'bg-amber-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Energy & Relays</span>
            </button>
            <button
              onClick={() => setActiveLayer('assets')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeLayer === 'assets' ? 'bg-rose-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Asset Health</span>
            </button>
            <button
              onClick={() => setActiveLayer('mesh')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeLayer === 'mesh' ? 'bg-purple-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>IoT Nodes</span>
            </button>
          </div>

          {/* 3D Route Distance Calculator */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Route:</span>
            </span>
            <select
              value={routeFromId}
              onChange={e => setRouteFromId(e.target.value as CampusBlockId)}
              aria-label="Route origin building"
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.code} ({b.name.split(' - ')[0]})</option>
              ))}
            </select>
            <span className="text-slate-500">to</span>
            <select
              value={routeToId}
              onChange={e => setRouteToId(e.target.value as CampusBlockId)}
              aria-label="Route destination building"
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.code} ({b.name.split(' - ')[0]})</option>
              ))}
            </select>
            <span className="font-mono text-cyan-300 tabular-nums px-2 py-1 bg-slate-950 rounded border border-slate-800">
              {computedRoute.walkingPathMeters} m ({computedRoute.walkingTimeMin} min)
            </span>
            {viewMode === '3d' && (
              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  showWireframe ? 'bg-slate-800 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {showWireframe ? 'Solid BIM' : 'Wireframe'}
              </button>
            )}
          </div>
        </div>

        {/* Render Active Map Mode */}
        {viewMode === '3d' ? (
          <Campus3DViewport
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            activeLayer={activeLayer}
            densityMultiplier={densityMultiplier}
            solarMultiplier={solarMultiplier}
            showWireframe={showWireframe}
            routeFromId={routeFromId}
            routeToId={routeToId}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {/* Real Satellite Coordinate Blueprint Header */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  LNCT Bhopal Satellite Footprint & Haversine Distance Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Computed from Google Earth / OpenStreetMap GPS coordinates at Kalchuri Nagar, Raisen Road, Bhopal (23.2515° N, 77.5245° E).
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/@${selectedBlock.gps.lat},${selectedBlock.gps.lng},18z/data=!3m1!1e3`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Selected Block in Google Maps Satellite</span>
              </a>
            </div>

            {/* Building GPS & Dimensions Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-[240px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Code & Building</th>
                    <th className="py-2 px-3 text-right">Latitude</th>
                    <th className="py-2 px-3 text-right">Longitude</th>
                    <th className="py-2 px-3 text-right">Area (m²)</th>
                    <th className="py-2 px-3 text-right">Floors</th>
                    <th className="py-2 px-3 text-right">Dist. from Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {blocks.map(b => {
                    const distGate = getInterBuildingDistance('main-gate-transport', b.id);
                    const isSel = b.id === selectedBlockId;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => onSelectBlock(b.id)}
                        className={`cursor-pointer transition-colors ${
                          isSel ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-3 font-sans font-medium">
                          <span className="font-mono text-cyan-400 mr-2">{b.code}</span>
                          {b.name}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums">{b.gps.lat.toFixed(5)}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{b.gps.lng.toFixed(5)}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{b.areaSqm.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 text-right tabular-nums">{b.floors}</td>
                        <td className="py-2 px-3 text-right tabular-nums text-emerald-400">{distGate.walkingPathMeters} m</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pairwise Inter-Building Distance Matrix */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Inter-Building Walking Distance Matrix ({LNCT_DISTANCE_MATRIX.length} Campus Routes)
              </h4>
              <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-[210px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Origin Building</th>
                      <th className="py-2 px-3">Destination Building</th>
                      <th className="py-2 px-3 text-right">Straight-Line (m)</th>
                      <th className="py-2 px-3 text-right">Walkway Path (m)</th>
                      <th className="py-2 px-3 text-right">Walk Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {LNCT_DISTANCE_MATRIX.map((edge, idx) => (
                      <tr
                        key={idx}
                        onClick={() => {
                          setRouteFromId(edge.fromId);
                          setRouteToId(edge.toId);
                        }}
                        className="hover:bg-slate-800/50 cursor-pointer text-slate-300"
                      >
                        <td className="py-1.5 px-3 font-sans">{edge.fromName}</td>
                        <td className="py-1.5 px-3 font-sans">{edge.toName}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-slate-400">{edge.straightLineMeters} m</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-cyan-400 font-semibold">{edge.walkingPathMeters} m</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-emerald-400">{edge.walkingTimeMin} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quick Select Block Bar below Viewport */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Ambient Temp: <strong className="text-slate-200 font-mono tabular-nums">{ambientTempC.toFixed(1)}°C</strong></span>
            <span aria-hidden="true">·</span>
            <span>Solar Insolation: <strong className="text-amber-300 font-mono tabular-nums">{Math.round(840 * solarMultiplier)} W/m²</strong></span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {blocks.slice(0, 6).map(b => (
              <button
                key={b.id}
                onClick={() => onSelectBlock(b.id)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  b.id === selectedBlockId
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Block Inspection & Closed-Loop Relay Sidebar */}
      <div className="w-full lg:w-88 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400">{selectedBlock.code} · {selectedBlock.category.toUpperCase()}</span>
              <h3 className="text-base font-semibold text-white mt-0.5">{selectedBlock.name}</h3>
              {selectedBlock.hindiName && (
                <span className="text-xs text-slate-400 font-sans">{selectedBlock.hindiName}</span>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${
              selectedBlock.healthStatus === 'nominal'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {selectedBlock.healthStatus.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {selectedBlock.description}
          </p>

          {/* Key Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Live Occupancy</span>
              <span className="text-base font-semibold text-white font-mono tabular-nums">
                {getDynamicOccupancy(selectedBlock)}
              </span>
              <span className="text-slate-400 text-[10px] block">
                of {selectedBlock.maxCapacity} ({Math.round((getDynamicOccupancy(selectedBlock) / selectedBlock.maxCapacity) * 100)}%)
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Active Demand</span>
              <span className="text-base font-semibold text-amber-400 font-mono tabular-nums">
                {getDynamicPower(selectedBlock).draw} kW
              </span>
              <span className="text-slate-400 text-[10px] block">
                {(getDynamicPower(selectedBlock).draw / (selectedBlock.areaSqm / 1000)).toFixed(1)} W/m²
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Air Temperature</span>
              <span className="text-base font-semibold text-cyan-300 font-mono tabular-nums">
                {selectedBlock.temperatureC}°C
              </span>
              <span className="text-slate-400 text-[10px] block">GPS: {selectedBlock.gps.lat.toFixed(4)}°N</span>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Indoor CO2</span>
              <span className={`text-base font-semibold font-mono tabular-nums ${
                selectedBlock.co2Ppm > 700 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {selectedBlock.co2Ppm} ppm
              </span>
              <span className="text-slate-400 text-[10px] block">{selectedBlock.floors} Floors · {selectedBlock.areaSqm} m²</span>
            </div>
          </div>

          {/* Key Labs & Facilities */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Monitored Labs & Rooms
            </span>
            <div className="flex flex-col gap-1.5">
              {selectedBlock.keyLabsOrRooms.map((room, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-950/50 rounded border border-slate-800/60">
                  <span className="text-slate-200">{room}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Node #{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real Closed-Loop Hardware-Ready Relay Controls */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Closed-Loop Relay Control
            </span>
            <span className="text-[10px] font-mono text-emerald-400">API Ready</span>
          </div>

          {actuationMessage && (
            <div className="mb-2.5 p-2 bg-cyan-950/70 border border-cyan-700/60 rounded text-[11px] font-mono text-cyan-200">
              {actuationMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handleRelayClick('acOn', !selectedBlock.relays.acOn)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                selectedBlock.relays.acOn
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>AC: {selectedBlock.relays.acOn ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => handleRelayClick('lightsOn', !selectedBlock.relays.lightsOn)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                selectedBlock.relays.lightsOn
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Lights: {selectedBlock.relays.lightsOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <button
            onClick={() => handleRelayClick('autoControl', !selectedBlock.relays.autoControl)}
            className={`w-full py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
              selectedBlock.relays.autoControl
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <span>AI Auto-Cutoff on Empty Room</span>
            <span className="font-mono font-semibold">{selectedBlock.relays.autoControl ? 'ENABLED' : 'MANUAL'}</span>
          </button>

          <div className="text-[10px] text-slate-400 text-center font-mono mt-2 flex items-center justify-center gap-1.5">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>ESP32 Poll: /api/v1/actuate/commands/{selectedBlock.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
