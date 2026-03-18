import React from 'react';
import { LayoutType } from '../../app/editor/types';
import { Layout, Grid, Columns, Square, AlignLeft, Type, Palette } from 'lucide-react';

interface SettingsPanelProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const layouts: { id: LayoutType; label: string; icon: React.ReactNode }[] = [
  { id: 'layout_hero', label: 'Full Hero', icon: <Square size={20} /> },
  { id: 'layout_two', label: 'Split Two', icon: <Columns size={20} /> },
  { id: 'layout_three', label: 'Triple Grid', icon: <Grid size={20} /> },
  { id: 'layout_four', label: 'Quad Collage', icon: <Grid size={20} className="rotate-45" /> },
  { id: 'layout_five', label: 'Mosaic Five', icon: <Grid size={20} className="scale-x-110" /> },
  { id: 'layout_six', label: 'Sixth Grid', icon: <Grid size={20} className="scale-y-110" /> },
  { id: 'layout_magazine', label: 'Magazine', icon: <Columns size={20} /> },
  { id: 'layout_caption', label: 'Photo & Caption', icon: <AlignLeft size={20} /> },
  { id: 'layout_tilted', label: 'Trendy Tilted', icon: <Square size={20} className="rotate-[-10deg]" /> },
  { id: 'layout_collage', label: 'Artistic Collage', icon: <Columns size={20} className="rotate-3" /> },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentLayout, onLayoutChange }) => {
  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
          <Layout size={16} className="text-indigo-600" />
          Page Settings
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Layout Templates</h3>
          <div className="grid grid-cols-1 gap-3">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => onLayoutChange(l.id)}
                className={`flex items-center gap-3 w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  currentLayout === l.id 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100/80 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  currentLayout === l.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 shadow-sm'
                }`}>
                  {l.icon}
                </div>
                <span className={`text-sm font-bold ${currentLayout === l.id ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-8 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Text Styling</h3>
          <div className="space-y-4">
             <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold text-gray-600">Font Family</label>
               <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                 <option>Inter (Sans-serif)</option>
                 <option>Playfair Display (Serif)</option>
                 <option>Montserrat (Modern)</option>
               </select>
             </div>
             
             <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold text-gray-600">Text Color</label>
               <div className="flex gap-2">
                 {['#000000', '#4F46E5', '#EF4444', '#10B981', '#F59E0B'].map(color => (
                   <button 
                     key={color}
                     className="w-8 h-8 rounded-full border border-gray-100 shadow-sm"
                     style={{ backgroundColor: color }}
                   />
                 ))}
               </div>
             </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default SettingsPanel;
