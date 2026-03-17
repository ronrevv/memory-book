import React, { useState } from 'react';
import { Page } from '../../app/editor/types';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

interface ThumbnailStripProps {
  pages: Page[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ 
  pages, 
  currentIndex, 
  onSelect, 
  onAdd, 
  onDelete, 
  onDuplicate, 
  onReorder 
}) => {
  // Using a local state for reordering to keep it smooth before syncing back
  // but since we are using Reorder from framer-motion, we need to be careful.
  // For simplicity, we'll use a standard list if we want to avoid complex state sync for now.
  
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl z-20 max-w-[90vw] overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3">
        {pages.map((page, index) => (
          <div key={page.id} className="relative group shrink-0">
            <button
              onClick={() => onSelect(index)}
              className={`w-16 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                currentIndex === index 
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10 scale-110' 
                  : 'border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full bg-gray-50 flex items-center justify-center relative">
                {page.images[0] ? (
                  <img src={page.images[0].src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-4 h-4 rounded-sm border border-gray-200" />
                )}
                <span className="absolute bottom-1 right-1 text-[8px] font-black text-gray-300 pointer-events-none">
                  {index + 1}
                </span>
              </div>
            </button>
            
            {/* Context Actions */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 p-1 bg-white rounded-lg shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate(index); }}
                className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-md transition-colors"
                title="Duplicate"
              >
                <Copy size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={onAdd}
          className="w-16 aspect-[4/5] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-1 group shrink-0"
        >
          <Plus size={20} className="group-hover:scale-125 transition-transform" />
          <span className="text-[8px] font-bold uppercase">Add</span>
        </button>
      </div>
    </div>
  );
};

export default ThumbnailStrip;
