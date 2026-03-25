'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Download, ArrowLeft, Sparkles, Zap, Smartphone, Share2 } from 'lucide-react';
import Link from 'next/link';

type BoothStep = 'idle' | 'countdown' | 'capturing' | 'review' | 'styling';

export default function PhotoBoothPage() {
  const [step, setStep] = useState<BoothStep>('idle');
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [activeFilter, setActiveFilter] = useState('none');
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Camera
  useEffect(() => {
    if (step === 'idle' || step === 'countdown' || step === 'capturing') {
      startCamera();
    }
    return () => stopCamera();
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          aspectRatio: 3/4,
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhotoAtStep = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Flash & Shake effect
    setFlash(true);
    setShake(true);
    setTimeout(() => {
        setFlash(false);
        setShake(false);
    }, 150);

    // Draw frame to canvas
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    // Mirror the image for authentic booth feel
    context.translate(canvasRef.current.width, 0);
    context.scale(-1, 1);
    context.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setPhotos(prev => [...prev, dataUrl]);
  };

  const startBoothSequence = () => {
    setPhotos([]);
    setStep('countdown');
    runCountdown(3);
  };

  const handleCapture = async () => {
    setStep('capturing');
    // We already took the first photo at the end of countdown in some logic, 
    // but the clean way is to do it here in a loop.
    for (let i = 0; i < 4; i++) {
        await takePhotoAtStep();
        if (i < 3) await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setStep('styling');
  };

  const runCountdown = (count: number) => {
    setCountdown(count);
    if (count > 0) {
      setTimeout(() => runCountdown(count - 1), 1000);
    } else {
      handleCapture();
    }
  };

  const downloadStrip = () => {
    if (photos.length < 4 || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const gap = 20;
    const footerHeight = 120;
    const imgWidth = 800;
    const imgHeight = 600; // 4:3 aspect ratio

    const totalWidth = imgWidth + (padding * 2);
    const totalHeight = (imgHeight * 4) + (gap * 3) + (padding * 2) + footerHeight;

    canvasRef.current.width = totalWidth;
    canvasRef.current.height = totalHeight;

    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw photos
    photos.forEach((src, i) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, padding, padding + (i * (imgHeight + gap)), imgWidth, imgHeight);
            
            // If last image, add footer and download
            if (i === 3) {
                // Footer text
                ctx.fillStyle = 'black';
                ctx.font = 'italic 48px serif';
                ctx.textAlign = 'center';
                ctx.fillText('Moments', totalWidth / 2, totalHeight - 60);
                
                ctx.fillStyle = '#999';
                ctx.font = 'bold 16px monospace';
                ctx.fillText(`MARCH 2026 // BOOTH #42`, totalWidth / 2, totalHeight - 30);

                // Download
                const link = document.createElement('a');
                link.download = `photobooth-strip-${Date.now()}.png`;
                link.href = canvasRef.current!.toDataURL('image/png');
                link.click();
            }
        };
        img.src = src;
    });
  };

  const [exploding, setExploding] = useState(false);

  const handleAddToScrapbook = () => {
    if (photos.length < 4 || !canvasRef.current) return;
    
    // Trigger "Exploding" animation
    setExploding(true);
    
    // For simplicity, we'll save the strip to localStorage and redirect
    localStorage.setItem('pending_booth_strip', JSON.stringify(photos));
    
    // Wait for the animation to feel "satisfying" before redirecting
    setTimeout(() => {
        window.location.href = '/editor?import=booth&autoLayout=true';
    }, 1500);
  };

  const ConfettiBurst = () => {
    const particles = Array.from({ length: 40 });
    return (
      <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ 
              x: (Math.random() - 0.5) * 800, 
              y: (Math.random() - 0.5) * 800, 
              rotate: Math.random() * 720,
              scale: 0,
              opacity: 0 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-4 h-4 rounded-sm"
            style={{ 
              backgroundColor: ['#f472b6', '#c084fc', '#818cf8', '#fbbf24', '#34d399'][i % 5],
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
        <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-20 h-20 bg-white rounded-full blur-3xl shadow-[0_0_100px_white]"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500 overflow-x-hidden font-sans flex flex-col">
      {exploding && <ConfettiBurst />}
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/editor" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 transition-all active:scale-95">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-tight">Back to Book</span>
        </Link>
        
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">BOOTH_v1.0.42_LIVE</span>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center py-4 overflow-y-auto w-full">
        
        {/* Left Side: Camera / Preview */}
        <motion.div 
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="flex-1 w-full max-w-[480px] flex flex-col items-center"
        >
          <div className="relative aspect-[3/4] w-full bg-neutral-900 rounded-[2.5rem] overflow-hidden border-[6px] border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] group">
            
            {/* Camera Feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover scale-x-[-1] transition-all duration-700 ${step === 'styling' ? 'grayscale opacity-20' : ''}`}
            />

            {/* Flash Overlay & Bloom */}
            <AnimatePresence>
                {flash && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="absolute inset-0 bg-white z-[100]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.4, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-fuchsia-400 blur-3xl z-[90]"
                        />
                    </>
                )}
            </AnimatePresence>

            {/* UI Overlays */}
            <div className="absolute inset-0 pointer-events-none border-[20px] border-black/10 mix-blend-overlay" />
            
            <AnimatePresence>
              {step === 'countdown' && (
                <motion.div 
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  key={countdown}
                  className="absolute inset-0 flex items-center justify-center z-50"
                >
                  <span className="text-[180px] font-black italic text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shutter Button (Idle or Capturing) */}
            {(step === 'idle' || step === 'capturing') && (
              <div className="absolute inset-0 flex items-center justify-center group pointer-events-none">
                 <div className="relative pointer-events-auto">
                    {/* Progress Ring */}
                    <svg className="absolute -inset-4 w-[130%] h-[130%] -rotate-90">
                        <circle 
                            cx="60" cy="60" r="54" 
                            className="stroke-white/10 fill-none" 
                            strokeWidth="4" 
                        />
                        <motion.circle 
                            cx="60" cy="60" r="54" 
                            className="stroke-fuchsia-500 fill-none" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: photos.length / 4 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </svg>

                    <button 
                        onClick={step === 'idle' ? startBoothSequence : undefined}
                        disabled={step === 'capturing'}
                        className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-2xl ${
                            step === 'idle' ? 'group-hover:scale-110 hover:bg-white hover:text-black cursor-pointer' : 'cursor-wait'
                        }`}
                    >
                        {step === 'capturing' ? (
                            <span className="text-xs font-black italic">{photos.length}/4</span>
                        ) : (
                            <Camera size={32} />
                        )}
                    </button>
                 </div>
                 {step === 'idle' && (
                    <div className="absolute bottom-10 text-center uppercase tracking-widest text-[10px] font-black flex flex-col gap-2">
                        <span className="opacity-40 animate-bounce">Ready when you are</span>
                        <span className="text-white/80">Press to start the vibes</span>
                    </div>
                 )}
              </div>
            )}
            
            {/* Viewfinder UI */}
            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-mono tracking-tighter text-fuchsia-400">REC 00:00:12:44</span>
                </div>
                <Zap size={16} className="text-yellow-400 opacity-60" />
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="flex gap-1.5">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${photos.length >= i ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-white/20'}`} />
                    ))}
                </div>
                <div className="flex gap-4">
                    <Smartphone size={14} className="opacity-40" />
                    <Sparkles size={14} className="opacity-40" />
                </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Photo Strip Preview */}
        <motion.div 
            animate={exploding ? { scale: 0, opacity: 0, rotate: 15, y: 100 } : { scale: 1, opacity: 1, rotate: 2 }}
            transition={{ duration: 1, ease: "backIn" }}
            className="w-[320px] flex flex-col gap-8"
        >
            <div className="bg-white p-4 pb-8 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] rounded-sm transform transition-all hover:rotate-0 hover:scale-[1.02]">
                <div className="flex flex-col gap-2">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="aspect-[4/3] bg-neutral-100 overflow-hidden relative group">
                            {photos[index] ? (
                                <motion.img 
                                    layoutId={`photo-${index}`}
                                    initial={{ opacity: 0, scale: 1.2 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={photos[index]} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-neutral-200">
                                    <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">Shot {index + 1}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-1 border-t-2 border-dashed border-neutral-100 pt-4">
                    <h3 className="text-xl font-serif text-black tracking-tight leading-none italic">Moments</h3>
                    <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-[0.2em]">March 2026 // Booth #42</p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                <button 
                  onClick={downloadStrip}
                  disabled={photos.length < 4}
                  className="w-full bg-fuchsia-600 border border-fuchsia-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-fuchsia-500 disabled:opacity-30 disabled:grayscale active:scale-95 shadow-[0_10px_30px_rgba(192,38,211,0.2)]"
                >
                    <Download size={20} />
                    Download Strip
                </button>
                <button 
                  onClick={handleAddToScrapbook}
                  disabled={photos.length < 4}
                  className="w-full bg-white/10 border border-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-white/20 disabled:opacity-30 disabled:grayscale active:scale-95 shadow-xl"
                >
                    <Share2 size={20} />
                    Add to Scrapbook
                </button>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={() => {
                        setPhotos([]);
                        setStep('idle');
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white"
                   >
                     <RefreshCw size={18} />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Retake</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white">
                     <Share2 size={18} />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Post</span>
                   </button>
                </div>
            </div>
        </motion.div>
      </main>

      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
