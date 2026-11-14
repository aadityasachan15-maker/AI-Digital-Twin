import React from 'react';
import { Sliders } from 'lucide-react';

export type MainSectionTab = 'map' | 'energy-assets' | 'density' | 'datasets' | 'hardware-guide';

interface HeaderProps {
  activeTab: MainSectionTab;
  onSelectTab: (tab: MainSectionTab) => void;
  onOpenScenarioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenScenarioModal
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectTab('map')}
        className="text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left"
      >
        LNCT Bhopal AI Digital Twin
      </button>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('map')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'map' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          3D Campus
        </button>
        <button
          onClick={() => onSelectTab('energy-assets')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'energy-assets' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Energy & Assets
        </button>
        <button
          onClick={() => onSelectTab('density')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'density' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Student Density
        </button>
        <button
          onClick={() => onSelectTab('datasets')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'datasets' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Datasets
        </button>
        <button
          onClick={() => onSelectTab('hardware-guide')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'hardware-guide' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          FastAPI & ESP32
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenScenarioModal}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Stress Scenarios</span>
        </button>
      </div>
    </header>
  );
};
