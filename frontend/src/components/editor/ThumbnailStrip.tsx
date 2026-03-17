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
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-5 bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 max-w-[90vw] overflow-visible">
      <Reorder.Group 
        axis="x" 
        values={pages} 
        onReorder={(newPages) => {
          // Find the change and call onReorder
          // For simplicity with Framer Motion, we can just pass the whole new array if we change the prop
          // But to keep current structure, we'll calculate indices
          const movedItem = pages.find((p, i) => p.id !== newPages[i].id);
          if (movedItem) {
            const startIndex = pages.indexOf(movedItem);
            const endIndex = newPages.indexOf(movedItem);
            onReorder(startIndex, endIndex);
          }
        }}
        className="flex items-center gap-5"
      >
        {pages.map((page, index) => (
          <Reorder.Item 
            key={page.id} 
            value={page}
            dragListener={true}
            className="relative group shrink-0"
          >
            <button
              onClick={() => onSelect(index)}
              className={`w-20 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 ${
                currentIndex === index 
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10 scale-110 z-10' 
                  : 'border-white bg-white opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full bg-gray-50 flex items-center justify-center relative">
                {page.images.some(img => img !== null) ? (
                  <img src={page.images.find(img => img !== null)?.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-md border-2 border-dashed border-gray-200" />
                )}
                <div className="absolute top-2 left-2 w-5 h-5 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-[8px] font-black text-white">
                  {index + 1}
                </div>
              </div>
            </button>
            
            {/* Context Actions */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate(index); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                title="Duplicate"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Reorder.Item>
        ))}

        <button
          onClick={onAdd}
          className="w-20 aspect-[4/5] rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/10 flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-2 group shrink-0 shadow-sm active:scale-95"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
        </button>
      </Reorder.Group>
    </div>
  );
};

export default ThumbnailStrip;
