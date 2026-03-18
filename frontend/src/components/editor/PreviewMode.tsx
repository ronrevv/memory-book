import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Download, FileText } from 'lucide-react';
import { Scrapbook, Page } from '../../app/editor/types';
import PageCanvas from './PageCanvas';
import { exportToPDF } from '../../utils/exportUtils';

interface PreviewModeProps {
  scrapbook: Scrapbook;
  onClose: () => void;
  onExportPDF: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ scrapbook, onClose, onExportPDF }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < scrapbook.pages.length) {
      setDirection(newDirection);
      setCurrentIndex(currentIndex + newDirection);
    }
  };

  const currentPage = scrapbook.pages[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#0f1012] z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* Controls Overlay */}
      <div className="absolute top-8 left-0 right-0 px-12 flex items-center justify-between z-[110]">
        <div className="flex flex-col">
          <h2 className="text-white text-xl font-bold tracking-tight">{scrapbook.title}</h2>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Viewing Mode • {currentIndex + 1} of {scrapbook.pages.length}</span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={onExportPDF}
             className="px-4 h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2 backdrop-blur-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
           >
             <FileText size={18} />
             <span className="text-sm font-bold">Export PDF</span>
           </button>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all active:scale-95"
           >
             <X size={20} />
           </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="relative w-full max-w-4xl flex items-center justify-center perspective-[2000px] p-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.2 }
            }}
            className="w-[500px] aspect-[4/5] bg-white rounded-r-[3rem] rounded-l-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative origin-left"
          >
            {/* Page Content Rendering - Unified with Editor Canvas */}
            <div className="w-full h-full relative pointer-events-none scale-90">
               <PageCanvas 
                 page={currentPage}
                 onUpdatePage={() => {}} // No-op in preview
                 onEditImage={() => {}} // No-op in preview
                 onUpdateCaption={() => {}} // No-op in preview
               />
            </div>
            
            {/* Spine Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-10" />
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 z-10" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button 
          disabled={currentIndex === 0}
          onClick={() => paginate(-1)}
          className="absolute left-0 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all disabled:opacity-10 disabled:scale-90"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          disabled={currentIndex === scrapbook.pages.length - 1}
          onClick={() => paginate(1)}
          className="absolute right-0 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all disabled:opacity-10 disabled:scale-90"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {scrapbook.pages.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewMode;
