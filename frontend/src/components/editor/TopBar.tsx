import React from 'react';
import { Play, Download, Save, Share2 } from 'lucide-react';

interface TopBarProps {
  title: string;
  onPreview: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onPreview, onExportJSON, onExportPDF }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-none">{title}</h1>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">Scrapbook Editor</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
        >
          <Play size={16} />
          Preview
        </button>
        <button 
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
        >
          <Save size={16} />
          Save
        </button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button 
          onClick={onExportPDF}
          className="btn-primary flex items-center gap-2 !px-5 !py-2 !text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg transition-all"
        >
          <Download size={16} />
          PDF
        </button>
        <button 
          onClick={onExportJSON}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          JSON
        </button>
      </div>
    </header>
  );
};

export default TopBar;
