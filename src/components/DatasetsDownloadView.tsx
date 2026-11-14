import React, { useMemo, useState } from 'react';
import {
  LNCT_CAMPUS_BLOCKS,
  LNCT_CAMPUS_ASSETS,
  LNCT_STUDENT_DENSITY_ZONES,
  LNCT_ENERGY_TIMESERIES_24H,
  LNCT_SAMPLE_IOT_TELEMETRY,
  LNCT_SPATIAL_BLUEPRINT_DATA,
  LNCT_DISTANCE_MATRIX,
  generate30DayTimetableDataset,
  convertToCSV,
  downloadFile
} from '../data/lnctCampusData';
import {
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Search,
  Database,
  Sparkles
} from 'lucide-react';

type DatasetType =
  | 'timetable30d'
  | 'spatial'
  | 'distances'
  | 'telemetry'
  | 'assets'
  | 'energy'
  | 'density';

export const DatasetsDownloadView: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<DatasetType>('timetable30d');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customTelemetryRows, setCustomTelemetryRows] = useState(LNCT_SAMPLE_IOT_TELEMETRY);
  const [timetableDays, setTimetableDays] = useState<number>(30);

  const timetableData = useMemo(
    () => generate30DayTimetableDataset(timetableDays),
    [timetableDays]
  );

  const handleGenerateExtendedTelemetry = (count: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newRows = [...LNCT_SAMPLE_IOT_TELEMETRY];
      const blocks = LNCT_CAMPUS_BLOCKS;
      const baseTime = new Date('2026-11-14T08:00:00Z').getTime();

      for (let i = 0; i < count; i++) {
        const blk = blocks[i % blocks.length];
        const timeOffset = i * 5 * 60 * 1000;
        const ts = new Date(baseTime + timeOffset).toISOString();
        const randTemp = Number((22 + Math.random() * 8).toFixed(1));
        const randCo2 = Math.round(450 + Math.random() * 450);
        const randPower = Number((blk.powerDrawKw * (0.8 + Math.random() * 0.4)).toFixed(1));
        const randVib = Number((0.15 + Math.random() * 2.5).toFixed(2));
        const randOcc = Math.round(blk.maxCapacity * (0.2 + Math.random() * 0.65));

        newRows.push({
          timestamp: ts,
          nodeId: `NODE-${blk.code}-${(i % 12) + 1}`,
          blockId: blk.id,
          blockName: blk.name,
          zone: blk.keyLabsOrRooms[i % blk.keyLabsOrRooms.length] || 'General Wing',
          floor: (i % blk.floors) + 1,
          tempCelsius: randTemp,
          humidityRh: Number((42 + Math.random() * 22).toFixed(1)),
          co2Ppm: randCo2,
          acousticDb: Number((38 + Math.random() * 40).toFixed(1)),
          ambientLux: Math.round(200 + Math.random() * 700),
          activePowerKw: randPower,
          powerFactor: Number((0.90 + Math.random() * 0.08).toFixed(2)),
          pirCount: Math.round(randOcc * 0.15),
          wifiProbeCount: Math.round(randOcc * 1.1),
          vibrationRms: randVib,
          batteryPct: Math.round(85 + Math.random() * 15),
          rssiDbm: Math.round(-45 - Math.random() * 30)
        });
      }
      setCustomTelemetryRows(newRows);
      setIsGenerating(false);
      setCurrentPage(1);
    }, 300);
  };

  let currentData: Record<string, unknown>[] = [];
  let datasetTitle = '';
  let datasetDescription = '';
  let filenamePrefix = '';

  if (activeDataset === 'timetable30d') {
    currentData = timetableData as unknown as Record<string, unknown>[];
    datasetTitle = `LNCT ${timetableDays}-Day Timetable & Wastage Anomaly Dataset (${timetableData.length.toLocaleString('en-IN')} rows)`;
    datasetDescription = 'Hourly room-level dataset across CS Block, ECE, Library & Auditorium with 9 AM-5 PM schedule occupancy and night-time AC/Light wastage anomalies.';
    filenamePrefix = 'lnct_30day_iot_dataset';
  } else if (activeDataset === 'spatial') {
    currentData = LNCT_SPATIAL_BLUEPRINT_DATA as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Bhopal Building Spatial & GPS Blueprint';
    datasetDescription = 'Exact GPS Latitude/Longitude, built-up m² area, floors, seating capacities, and distances from Main Gate and Central Library.';
    filenamePrefix = 'lnct_buildings_spatial';
  } else if (activeDataset === 'distances') {
    currentData = LNCT_DISTANCE_MATRIX as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Inter-Building Distance & Walking Time Matrix';
    datasetDescription = 'Pairwise Haversine straight-line and campus walkway distances (meters) plus walking duration between every LNCT campus block.';
    filenamePrefix = 'lnct_distance_matrix';
  } else if (activeDataset === 'telemetry') {
    currentData = customTelemetryRows as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT High-Frequency IoT Perception Telemetry';
    datasetDescription = 'Multi-sensor records (Temperature, Humidity, CO2, Acoustic dB, Active kW, Power Factor, PIR, WiFi Hash, Vibration RMS).';
    filenamePrefix = 'lnct_bhopal_iot_telemetry';
  } else if (activeDataset === 'assets') {
    currentData = LNCT_CAMPUS_ASSETS as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Campus Critical Asset Inventory & Health';
    datasetDescription = 'Equipment specifications, baseline vibration, bearing temp, Remaining Useful Life (RUL), and predictive failure risks.';
    filenamePrefix = 'lnct_bhopal_asset_inventory';
  } else if (activeDataset === 'energy') {
    currentData = LNCT_ENERGY_TIMESERIES_24H as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Microgrid Energy & 550kWp Solar Profile';
    datasetDescription = 'Diurnal energy balance, grid import vs solar generation vs DG genset, solar irradiance, power factor, and carbon offsets.';
    filenamePrefix = 'lnct_bhopal_energy_microgrid';
  } else if (activeDataset === 'density') {
    currentData = LNCT_STUDENT_DENSITY_ZONES as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Privacy-Preserving Student Density & Flow';
    datasetDescription = 'Ceiling ToF passages, hashed WiFi client counts, crowd saturation levels, and ST-GCN AI predicted density horizons.';
    filenamePrefix = 'lnct_bhopal_student_density';
  }

  const filteredData = currentData.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

  const handleDownloadCSV = () => {
    const csvContent = convertToCSV(currentData);
    downloadFile(`${filenamePrefix}.csv`, csvContent, 'text/csv;charset=utf-8;');
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(currentData, null, 2);
    downloadFile(`${filenamePrefix}.json`, jsonContent, 'application/json');
  };

  const handleCopyJSON = () => {
    const jsonContent = JSON.stringify(currentData.slice(0, 20), null, 2);
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner with Dataset Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>LNCT Bhopal Open Project Datasets</span>
              <span aria-hidden="true">·</span>
              <span>Spatial GPS + Distance Matrix + 30-Day Timetable IoT Data</span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight mt-0.5">
              Downloadable Campus Datasets Center (CSV & JSON)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Sample Copied!' : 'Copy Sample JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Dataset Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {[
            { id: 'timetable30d', label: '01. 30-Day Timetable & Wastage', count: `${timetableData.length} rows` },
            { id: 'spatial', label: '02. Campus GPS & Blueprint', count: `${LNCT_SPATIAL_BLUEPRINT_DATA.length} blocks` },
            { id: 'distances', label: '03. Distance Matrix', count: `${LNCT_DISTANCE_MATRIX.length} routes` },
            { id: 'telemetry', label: '04. High-Freq IoT Telemetry', count: `${customTelemetryRows.length} rows` },
            { id: 'assets', label: '05. Critical Assets', count: `${LNCT_CAMPUS_ASSETS.length} assets` },
            { id: 'energy', label: '06. 550kWp Solar Balance', count: `${LNCT_ENERGY_TIMESERIES_24H.length} slots` },
            { id: 'density', label: '07. Student Density', count: `${LNCT_STUDENT_DENSITY_ZONES.length} zones` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveDataset(tab.id as DatasetType); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeDataset === tab.id ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Dataset Metadata Box */}
        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-white block font-medium">{datasetTitle}</strong>
            <span className="text-slate-400 leading-normal">{datasetDescription}</span>
          </div>

          {activeDataset === 'timetable30d' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Simulation Horizon:</span>
              {[7, 15, 30].map(d => (
                <button
                  key={d}
                  onClick={() => { setTimetableDays(d); setCurrentPage(1); }}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    timetableDays === d
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          )}

          {activeDataset === 'telemetry' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Batch Generator:</span>
              <button
                onClick={() => handleGenerateExtendedTelemetry(100)}
                disabled={isGenerating}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>+100 Rows</span>
              </button>
              <button
                onClick={() => handleGenerateExtendedTelemetry(500)}
                disabled={isGenerating}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>+500 Rows</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Table with Search & Pagination */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search in dataset records..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-slate-200">{paginatedData.length}</strong> of <strong className="text-slate-200">{filteredData.length.toLocaleString('en-IN')}</strong> records
          </div>
        </div>

        <div className="w-full overflow-x-auto border border-slate-800 rounded-lg max-h-[460px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-300 sticky top-0 z-10 font-semibold border-b border-slate-800">
              <tr>
                {columns.map(col => (
                  <th key={col} className="py-2.5 px-3 whitespace-nowrap uppercase tracking-wider font-mono text-[11px] text-slate-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  {columns.map(col => {
                    const val = row[col];
                    const isNumeric = typeof val === 'number';
                    const isWastageHit = col === 'Wastage_Flag' && val === 1;
                    return (
                      <td
                        key={col}
                        className={`py-2 px-3 whitespace-nowrap ${isNumeric ? 'text-right tabular-nums' : ''} ${
                          isWastageHit ? 'text-rose-400 font-bold' : ''
                        }`}
                      >
                        {typeof val === 'object' && val !== null
                          ? 'Object/Array'
                          : isWastageHit
                          ? '1 (WASTAGE)'
                          : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <span className="text-slate-400">
            Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Schema & Python Pandas Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <h4 className="text-sm font-semibold text-white mb-2">External Benchmark Datasets (Kaggle / UCI)</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            In addition to the LNCT Bhopal datasets above, you can benchmark your AI models against these standard open datasets:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>ASHRAE Great Energy Predictor III (Kaggle):</strong> Building chiller & meter hourly energy benchmark.</li>
            <li><strong>UCI Occupancy Detection Dataset:</strong> Ground-truth room occupancy vs Light, CO2, Temp & Humidity.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <h4 className="text-sm font-semibold text-white mb-2">Load Directly in Python / Pandas</h4>
          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`import pandas as pd

df = pd.read_csv('${filenamePrefix}.csv')
print(df.head())
# Detect empty-room AC wastage automatically:
if 'Wastage_Flag' in df.columns:
    print("Wastage events:", df['Wastage_Flag'].sum())`}
          </pre>
        </div>
      </div>
    </div>
  );
};
