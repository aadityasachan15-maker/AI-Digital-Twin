import React, { useMemo, useState } from 'react';
import {
  LNCT_CAMPUS_BLOCKS,
  LNCT_CAMPUS_ASSETS,
  LNCT_STUDENT_DENSITY_ZONES,
  LNCT_ENERGY_TIMESERIES_24H,
  LNCT_SAMPLE_IOT_TELEMETRY,
  LNCT_SPATIAL_BLUEPRINT_DATA,
  LNCT_DISTANCE_MATRIX,
  LNCT_ALL_ROOM_SECTIONS,
  LNCT_RGPV_TIMETABLE_DATA,
  LNCT_RGPV_PAPER_PREDICTIONS,
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
  | 'rooms'
  | 'rgpv-tt'
  | 'rgpv-pred'
  | 'spatial'
  | 'distances'
  | 'telemetry'
  | 'assets'
  | 'energy'
  | 'density';

export const DatasetsDownloadView: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<DatasetType>('rooms');
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
          nodeId: `NODE-${blk.code}-F${(i % blk.floors) + 1}-${(i % 10) + 1}`,
          blockId: blk.id,
          blockName: blk.name,
          zone: blk.keyLabsOrRooms[i % blk.keyLabsOrRooms.length] || 'General Section',
          floor: `F${(i % blk.floors)}`,
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

  if (activeDataset === 'rooms') {
    currentData = LNCT_ALL_ROOM_SECTIONS as unknown as Record<string, unknown>[];
    datasetTitle = `LNCT All Blocks, 6 Floors (G to F5 + Chhatt) & 10 Sections/Floor (${LNCT_ALL_ROOM_SECTIONS.length} Rooms)`;
    datasetDescription = 'Complete room/section inventory (G1..G10 to F5-1..F5-10) mapping CV Raman Central Library + 2nd/3rd Yr AIDS/AIML, LNCT&S Exclusive CSE-Cyber Security, LNCTE CSE-DS, LNCT Main, IT Charles Babbage, Refftronix Drone Lab & LNCP.';
    filenamePrefix = 'lnct_all_floor_sections_480plus';
  } else if (activeDataset === 'timetable30d') {
    currentData = timetableData as unknown as Record<string, unknown>[];
    datasetTitle = `LNCT ${timetableDays}-Day Timetable & Wastage Anomaly Dataset (${timetableData.length.toLocaleString('en-IN')} rows)`;
    datasetDescription = 'Hourly room-level dataset across LNCT Main, CV Raman, LNCT&S, LNCTE, Charles Babbage IT, Drone Lab & LNCP with college-hour occupancy and AC wastage flags.';
    filenamePrefix = 'lnct_30day_iot_dataset';
  } else if (activeDataset === 'rgpv-tt') {
    currentData = LNCT_RGPV_TIMETABLE_DATA as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT RGPV Timetable, Practicals, Mid-Sems & Final Exams Load';
    datasetDescription = 'Maps RGPV theory classes, practicals, Mid-Sem I/II, and final exams across exact LNCT blocks, floors, and branches.';
    filenamePrefix = 'lnct_rgpv_timetable_exams';
  } else if (activeDataset === 'rgpv-pred') {
    currentData = LNCT_RGPV_PAPER_PREDICTIONS as unknown as Record<string, unknown>[];
    datasetTitle = 'RGPV Syllabus Comparison & Exam Paper Predictions';
    datasetDescription = 'Compares previous year vs current RGPV syllabus changes across CSE, AIML, AIDS, Cyber Security, DS, EC, EEE, Mechanical & Pharmacy with predicted 70-mark exam questions.';
    filenamePrefix = 'lnct_rgpv_paper_predictions';
  } else if (activeDataset === 'spatial') {
    currentData = LNCT_SPATIAL_BLUEPRINT_DATA as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Raisen Road Building Spatial & GPS Blueprint';
    datasetDescription = 'Exact GPS Latitude/Longitude, 6-floor + Chhatt structure, branch distribution, and distances from Main Gate & Sir CV Raman Central Library.';
    filenamePrefix = 'lnct_buildings_spatial';
  } else if (activeDataset === 'distances') {
    currentData = LNCT_DISTANCE_MATRIX as unknown as Record<string, unknown>[];
    datasetTitle = 'LNCT Inter-Building Distance & Walking Time Matrix';
    datasetDescription = 'Pairwise Haversine straight-line and campus walkway distances (meters) plus walking duration between all 12 LNCT Raisen Road blocks.';
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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>LNCT Bhopal Raisen Road Datasets</span>
              <span aria-hidden="true">·</span>
              <span>480+ Floor Sections + RGPV Exams + GPS Distances + 30-Day IoT</span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight mt-0.5">
              Downloadable Campus & RGPV Datasets Center (CSV & JSON)
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

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {[
            { id: 'rooms', label: '01. Floor & Section Rooms', count: `${LNCT_ALL_ROOM_SECTIONS.length}` },
            { id: 'timetable30d', label: '02. 30-Day IoT & Wastage', count: `${timetableData.length}` },
            { id: 'rgpv-tt', label: '03. RGPV Timetable & Exams', count: `${LNCT_RGPV_TIMETABLE_DATA.length}` },
            { id: 'rgpv-pred', label: '04. RGPV Paper Predictor', count: `${LNCT_RGPV_PAPER_PREDICTIONS.length}` },
            { id: 'spatial', label: '05. Campus GPS Blueprint', count: `${LNCT_SPATIAL_BLUEPRINT_DATA.length}` },
            { id: 'distances', label: '06. Distance Matrix', count: `${LNCT_DISTANCE_MATRIX.length}` },
            { id: 'telemetry', label: '07. High-Freq Telemetry', count: `${customTelemetryRows.length}` },
            { id: 'assets', label: '08. Assets', count: `${LNCT_CAMPUS_ASSETS.length}` },
            { id: 'energy', label: '09. Solar Profile', count: `${LNCT_ENERGY_TIMESERIES_24H.length}` },
            { id: 'density', label: '10. Student Density', count: `${LNCT_STUDENT_DENSITY_ZONES.length}` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveDataset(tab.id as DatasetType); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeDataset === tab.id ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-white block font-medium">{datasetTitle}</strong>
            <span className="text-slate-400 leading-normal">{datasetDescription}</span>
          </div>

          {activeDataset === 'timetable30d' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Horizon:</span>
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

      {/* Table Viewport */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Filter records (e.g. Cyber Security, CV Raman, F3-2)..."
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
                          ? JSON.stringify(val).slice(0, 60) + '...'
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
    </div>
  );
};
