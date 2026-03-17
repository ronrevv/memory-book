"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const pages = [
  { id: 1, front: "🌅", frontCaption: "Golden hour in Paris", back: "📸", backCaption: "The beginning of our journey" },
  { id: 2, front: "🏔️", frontCaption: "Mountains at sunrise", back: "🌊", backCaption: "Ocean breeze afternoon" },
  { id: 3, front: "🌸", frontCaption: "Cherry blossoms in spring", back: "🎭", backCaption: "Night at the theatre" },
  { id: 4, front: "🎉", frontCaption: "The celebration", back: "🏰", backCaption: "Castle on the hill" },
  { id: 5, front: "🌈", frontCaption: "After the rain", back: "✨", backCaption: "Magical evening" },
];

export default function PreviewPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const goNext = () => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goPrev = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />
      <div className="pt-20 pb-16 section-padding min-h-screen flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">3D Scrapbook Preview</h1>
          <p className="text-gray-400">Flip through your scrapbook before ordering</p>
        </motion.div>

        {/* Book Container */}
        <div className="relative w-full max-w-2xl">
          <div className="page-flip">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: isFlipping ? -90 : 0, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
                className="relative"
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
              >
                {/* Page Spread */}
                <div className="flex rounded-2xl overflow-hidden shadow-2xl">
                  {/* Left Page */}
                  <div className="flex-1 aspect-[3/4] bg-white p-6 sm:p-10 flex flex-col items-center justify-center border-r border-gray-100">
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-7xl sm:text-8xl mb-4 shadow-inner">
                      {pages[currentPage].front}
                    </div>
                    <p className="text-center text-sm sm:text-base font-serif italic text-gray-600 mt-2">
                      {pages[currentPage].frontCaption}
                    </p>
                    <p className="text-xs text-gray-300 mt-4">{currentPage * 2 + 1}</p>
                  </div>

                  {/* Right Page */}
                  <div className="flex-1 aspect-[3/4] bg-white p-6 sm:p-10 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center text-7xl sm:text-8xl mb-4 shadow-inner">
                      {pages[currentPage].back}
                    </div>
                    <p className="text-center text-sm sm:text-base font-serif italic text-gray-600 mt-2">
                      {pages[currentPage].backCaption}
                    </p>
                    <p className="text-xs text-gray-300 mt-4">{currentPage * 2 + 2}</p>
                  </div>
                </div>

                {/* Book spine shadow */}
                <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-300/30 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={goNext}
            disabled={currentPage === pages.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-30"
          >
            →
          </button>
        </div>

        {/* Page Dots */}
        <div className="flex items-center gap-2 mt-8">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => !isFlipping && setCurrentPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentPage ? "bg-pink-500 scale-125" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Link href="/editor" className="btn-secondary !bg-white/10 !text-white !border-white/20">
            ← Back to Editor
          </Link>
          <Link href="/checkout" className="btn-primary">
            Order This Scrapbook →
          </Link>
        </div>
      </div>
    </main>
  );
}
