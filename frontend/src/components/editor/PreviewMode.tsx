import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Download, FileText } from 'lucide-react';
import { Scrapbook, Page } from '../../app/editor/types';
import { exportToPDF } from '../../utils/exportUtils';

interface PreviewModeProps {
  scrapbook: Scrapbook;
  onClose: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ scrapbook, onClose }) => {
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
             onClick={() => exportToPDF(scrapbook)}
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
            {/* Page Content Rendering */}
            <div className="w-full h-full relative">
               {(() => {
                 switch (currentPage.layout) {
                   case 'layout_hero':
                     return (
                       <div className="w-full h-full p-12">
                         {currentPage.images[0] && <img src={currentPage.images[0].src} className="w-full h-full object-cover rounded-2xl shadow-xl" />}
                       </div>
                     );
                   case 'layout_two':
                     return (
                       <div className="w-full h-full p-12 grid grid-cols-2 gap-6">
                         {currentPage.images.map((img, i) => img && <img key={i} src={img.src} className="w-full h-full object-cover rounded-2xl shadow-lg" />)}
                       </div>
                     );
                   case 'layout_three':
                     return (
                        <div className="w-full h-full p-12 grid grid-cols-2 grid-rows-2 gap-4">
                          <div className="row-span-2">
                             {currentPage.images[0] && <img src={currentPage.images[0].src} className="w-full h-full object-cover rounded-2xl shadow-lg" />}
                          </div>
                          {currentPage.images[1] && <img src={currentPage.images[1].src} className="w-full h-full object-cover rounded-2xl shadow-lg" />}
                          {currentPage.images[2] && <img src={currentPage.images[2].src} className="w-full h-full object-cover rounded-2xl shadow-lg" />}
                        </div>
                     );
                   case 'layout_four':
                     return (
                       <div className="w-full h-full p-12 grid grid-cols-2 grid-rows-2 gap-4">
                         {currentPage.images.map((img, i) => img && <img key={i} src={img.src} className="w-full h-full object-cover rounded-2xl shadow-lg" />)}
                       </div>
                     );
                   case 'layout_caption':
                     return (
                       <div className="w-full h-full p-12 flex flex-col gap-6">
                         <div className="flex-1">
                           {currentPage.images[0] && <img src={currentPage.images[0].src} className="w-full h-full object-cover rounded-2xl shadow-lg" />}
                         </div>
                         <p className="text-center font-serif italic text-gray-700 text-xl leading-relaxed">
                            "{currentPage.images[0]?.caption || 'Your story here...'}"
                         </p>
                       </div>
                     );
                   case 'layout_tilted':
                     return (
                        <div className="w-full h-full p-16 flex items-center justify-center">
                           {currentPage.images[0] && <img src={currentPage.images[0].src} className="w-full h-full object-cover rounded-2xl shadow-2xl rotate-[-3deg]" />}
                        </div>
                     );
                   case 'layout_collage':
                     return (
                        <div className="w-full h-full p-12 relative">
                           {currentPage.images[0] && <img src={currentPage.images[0].src} className="absolute top-12 left-12 w-[65%] h-[60%] object-cover rounded-2xl shadow-xl rotate-[-5deg]" />}
                           {currentPage.images[1] && <img src={currentPage.images[1].src} className="absolute bottom-16 right-12 w-[60%] h-[55%] object-cover rounded-2xl shadow-2xl rotate-[5deg] border-8 border-white" />}
                        </div>
                     );
                   default:
                     return null;
                 }
               })()}
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
