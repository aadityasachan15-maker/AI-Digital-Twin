import React, { useState } from 'react';
import {
  LNCT_RGPV_TIMETABLE_DATA,
  LNCT_RGPV_PAPER_PREDICTIONS,
  convertToCSV,
  downloadFile
} from '../data/lnctCampusData';
import {
  BookOpen,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  Zap,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const RGPVAcademicPredictorView: React.FC = () => {
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [selectedPredictionId, setSelectedPredictionId] = useState<string>(LNCT_RGPV_PAPER_PREDICTIONS[0].id);

  const filteredTimetable = LNCT_RGPV_TIMETABLE_DATA.filter(item => {
    if (eventFilter === 'all') return true;
    return item.eventType === eventFilter;
  });

  const activePrediction =
    LNCT_RGPV_PAPER_PREDICTIONS.find(p => p.id === selectedPredictionId) ||
    LNCT_RGPV_PAPER_PREDICTIONS[0];

  const handleDownloadTimetableCSV = () => {
    const csv = convertToCSV(LNCT_RGPV_TIMETABLE_DATA as unknown as Record<string, unknown>[]);
    downloadFile('lnct_rgpv_timetable_exams.csv', csv, 'text/csv;charset=utf-8;');
  };

  const handleDownloadPredictionsCSV = () => {
    const csv = convertToCSV(LNCT_RGPV_PAPER_PREDICTIONS as unknown as Record<string, unknown>[]);
    downloadFile('lnct_rgpv_paper_predictions.csv', csv, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <GraduationCap className="w-4 h-4" />
            <span>RGPV Bhopal Scheme · LNCT Group Raisen Road Campus</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-0.5">
            RGPV Timetable, Practicals, Mid-Sems & Syllabus Paper Predictor
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Couples RGPV university theory classes, practical exams, Mid-Sem I & II, and Final Exam schedules directly with LNCT building power/occupancy forecasts—while comparing previous year vs 2026 syllabi to predict high-probability exam paper questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTimetableCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download RGPV Timetable CSV</span>
          </button>
          <button
            onClick={handleDownloadPredictionsCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download Paper Predictions CSV</span>
          </button>
        </div>
      </div>

      {/* Section 1: RGPV Syllabus Comparison & Question Paper Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Branch & Subject Selector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1. Select Branch & RGPV Subject</span>
            </h3>
            <span className="text-xs text-slate-400">
              Includes exclusive LNCT&S CSE-Cyber Security, CV Raman AIDS/AIML & LNCTE CSE-DS
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
            {LNCT_RGPV_PAPER_PREDICTIONS.map(pred => {
              const isSelected = pred.id === activePrediction.id;
              return (
                <button
                  key={pred.id}
                  onClick={() => setSelectedPredictionId(pred.id)}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      {pred.subjectCode} · {pred.branch}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {pred.predictedProbabilityPct}% Match
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">{pred.subjectName}</div>
                  <div className="text-[11px] text-slate-400">{pred.buildingExclusiveNote}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Syllabus Diff & Predicted Exam Questions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">
                  {activePrediction.subjectCode} · {activePrediction.semester}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activePrediction.subjectName}
                </h3>
                <span className="text-xs text-slate-400">{activePrediction.rgpvPaperFormat}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Predicted Focus Weight</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">
                  {activePrediction.predictedMarksOutOf70} / 70 Marks
                </span>
              </div>
            </div>

            {/* Previous Year vs 2026 Syllabus Comparison Card */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Previous Year vs Current RGPV Syllabus Comparison ({activePrediction.unitNumber})</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800">
                  {activePrediction.prevYearSyllabusStatus}
                </span>
              </div>
              <div className="text-xs text-slate-200 font-medium mb-1">{activePrediction.unitTitle}</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                {activePrediction.syllabusComparisonNotes}
              </p>
              <div className="text-[11px] font-mono text-cyan-300">
                Historical Frequency: {activePrediction.pastAppearances}
              </div>
            </div>

            {/* Predicted Exam Paper Questions */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                High-Probability RGPV Exam Questions (Predicted for Current Paper)
              </h4>
              <div className="flex flex-col gap-2.5">
                {activePrediction.predictedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-semibold text-cyan-400">{q.part}</span>
                      <span className="font-mono text-emerald-400 text-[11px]">
                        AI Confidence: {q.confidencePct}%
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-xs text-slate-300">
            <strong className="text-cyan-300">Campus Twin Link:</strong> During this RGPV exam & practical slot in{' '}
            <strong>{activePrediction.buildingExclusiveNote}</strong>, the Digital Twin pre-cools exam floors 30 minutes prior to shift start and tracks lab workstation kW surges.
          </div>
        </div>
      </div>

      {/* Section 2: RGPV Timetable, Practicals, Mid-Sems & Final Exams Schedule Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>2. LNCT Campus RGPV Timetable, Practicals & Exam Load Mapping</span>
            </h3>
            <span className="text-xs text-slate-400">
              Exact building & floor sections (`G1-G10`, `F1-1..F5-10`) driving campus occupancy & power predictions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            {['all', 'Theory Class', 'RGPV Practical', 'Mid-Sem I', 'Mid-Sem II', 'RGPV Final Exam'].map(ev => (
              <button
                key={ev}
                onClick={() => setEventFilter(ev)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  eventFilter === ev
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ev === 'all' ? 'All Events' : ev}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Branch & Year</th>
                <th className="py-2.5 px-3">Building & Floor Sections</th>
                <th className="py-2.5 px-3">RGPV Subject</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Schedule / Slot</th>
                <th className="py-2.5 px-3 text-right">Student Load</th>
                <th className="py-2.5 px-3 text-right">Predicted kW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTimetable.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-semibold text-white block">{row.branch}</span>
                    <span className="text-[10px] text-slate-400">{row.yearSem}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-cyan-300 font-medium block">{row.buildingName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{row.floorSections}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-mono text-cyan-400 mr-1.5">{row.subjectCode}</span>
                    <span>{row.subjectName}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      row.eventType === 'RGPV Final Exam'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : row.eventType === 'RGPV Practical'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : row.eventType.startsWith('Mid-Sem')
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {row.eventType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    <span className="block text-slate-200">{row.dayOrDate}</span>
                    <span className="text-slate-400">{row.timeSlot}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-white font-semibold">
                    {row.expectedStudentLoad}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-amber-400 font-semibold">
                    {row.predictedPowerKw} kW
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
