"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

const scrapbookTypes = [
  { id: "travel", icon: "✈️", title: "Travel", desc: "Adventures & destinations", color: "from-blue-400 to-cyan-400", primary: "#60a5fa", secondary: "#22d3ee" },
  { id: "wedding", icon: "💒", title: "Wedding", desc: "Your perfect day", color: "from-pink-400 to-rose-400", primary: "#f472b6", secondary: "#fb7185" },
  { id: "birthday", icon: "🎂", title: "Birthday", desc: "Celebrations", color: "from-amber-400 to-orange-400", primary: "#fbbf24", secondary: "#fb923c" },
  { id: "couple", icon: "💕", title: "Couple", desc: "Love stories", color: "from-red-400 to-pink-400", primary: "#f87171", secondary: "#f472b6" },
  { id: "baby", icon: "👶", title: "Baby", desc: "Precious firsts", color: "from-purple-400 to-violet-400", primary: "#a78bfa", secondary: "#8b5cf6" },
  { id: "friends", icon: "👫", title: "Friends", desc: "Bonds & fun", color: "from-emerald-400 to-teal-400", primary: "#34d399", secondary: "#2dd4bf" },
];

const demoPhotos = [
  { id: 1, url: "📸", name: "photo_001.jpg" },
  { id: 2, url: "🌅", name: "sunset_paris.jpg" },
  { id: 3, url: "🏔️", name: "mountains_trip.jpg" },
  { id: 4, url: "🌊", name: "beach_day.jpg" },
  { id: 5, url: "🎉", name: "party_night.jpg" },
  { id: 6, url: "🌸", name: "spring_garden.jpg" },
  { id: 7, url: "🏰", name: "castle_tour.jpg" },
  { id: 8, url: "🎭", name: "theatre_show.jpg" },
];

const importApps = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "from-purple-500 to-pink-500" },
  { id: "google-photos", name: "Google Photos", icon: "🌈", color: "from-blue-400 via-red-400 via-yellow-400 to-green-400" },
  { id: "dropbox", name: "Dropbox", icon: "📦", color: "from-blue-600 to-blue-400" },
  { id: "icloud", name: "iCloud", icon: "☁️", color: "from-blue-100 to-white text-blue-600" },
];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<typeof demoPhotos>([]);
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [customTheme, setCustomTheme] = useState({ primary: "#ec4899", secondary: "#8b5cf6" });
  const [showCustomTheme, setShowCustomTheme] = useState(false);

  const handleUpload = () => {
    setUploadedPhotos([...uploadedPhotos, ...demoPhotos]);
  };

  const handleImportApp = (appName: string) => {
    // Simulated import
    setTimeout(() => {
      setUploadedPhotos([...uploadedPhotos, ...demoPhotos.slice(0, 4)]);
    }, 1000);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      window.location.href = "/editor";
    }, 2000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploadedPhotos([...uploadedPhotos, ...demoPhotos]);
  }, [uploadedPhotos]);

  return (
    <main className="min-h-screen bg-gray-50/30">
      <Navbar />
      <div className="pt-24 pb-16 section-padding">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-3">
            {["Photos", "Theme", "Ready"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload & Import */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl font-bold mb-2">Gather your photos</h1>
              <p className="text-gray-500 mb-8">Select images from your device or import from your favorite apps.</p>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all h-64 flex flex-col items-center justify-center ${
                      dragOver ? "border-pink-400 bg-pink-50" : "border-gray-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="text-5xl mb-4">🖼️</div>
                    <h3 className="text-lg font-semibold mb-2">Drag & drop files</h3>
                    <button onClick={handleUpload} className="btn-primary !px-6 !py-2 !text-sm">
                      Browse Device
                    </button>
                  </div>

                  {uploadedPhotos.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{uploadedPhotos.length} photos selected</h3>
                        <button onClick={() => setUploadedPhotos([])} className="text-sm text-red-500 font-medium">Clear All</button>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                        {uploadedPhotos.map((photo, i) => (
                          <div key={i} className="aspect-square rounded-xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm relative group overflow-hidden">
                            {photo.url}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="text-white text-xs font-bold">×</button>
                            </div>
                          </div>
                        ))}
                        <button onClick={handleUpload} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-pink-400 hover:text-pink-400 transition-all">
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Import Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Import from Apps</h3>
                  <div className="grid gap-3">
                    {importApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleImportApp(app.name)}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-pink-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl shadow-sm`}>
                            {app.icon}
                          </div>
                          <span className="font-medium text-sm text-gray-700">{app.name}</span>
                        </div>
                        <span className="text-gray-300 group-hover:text-pink-400 transition-colors">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  disabled={uploadedPhotos.length === 0}
                  onClick={() => setStep(2)}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  Next: Choose Theme <span className="opacity-50">→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Choose Theme & Customization */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl font-bold mb-2">Pick your style</h1>
              <p className="text-gray-500 mb-8">Choose a predefined theme or create your own custom look.</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {scrapbookTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setShowCustomTheme(false);
                    }}
                    className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden flex flex-col items-center text-center ${
                      selectedType === type.id && !showCustomTheme ? "border-pink-400 bg-white shadow-xl scale-[1.02]" : "border-transparent bg-white shadow-sm hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                      {type.icon}
                    </div>
                    <h3 className="font-bold text-gray-900">{type.title}</h3>
                    
                    {/* Color Preview */}
                    <div className="flex gap-1.5 mt-3">
                      <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: type.primary }} />
                      <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: type.secondary }} />
                    </div>
                  </button>
                ))}

                {/* Custom Theme Option */}
                <button
                  onClick={() => {
                    setShowCustomTheme(true);
                    setSelectedType("custom");
                  }}
                  className={`p-6 rounded-3xl border-2 text-left transition-all bg-white flex flex-col items-center text-center ${
                    showCustomTheme ? "border-purple-400 shadow-xl scale-[1.02]" : "border-dashed border-gray-300 shadow-sm hover:border-gray-400"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl mb-4">
                    🎨
                  </div>
                  <h3 className="font-bold">Custom Theme</h3>
                  <div className="flex gap-1.5 mt-3">
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: customTheme.primary }} />
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: customTheme.secondary }} />
                  </div>
                </button>
              </div>

              {/* Custom Theme Builder UI */}
              <AnimatePresence>
                {showCustomTheme && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-8"
                  >
                    <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow- premium grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs">1</span>
                          Select Custom Colors
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Primary Color</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={customTheme.primary} 
                                onChange={(e) => setCustomTheme({...customTheme, primary: e.target.value})}
                                className="w-8 h-8 rounded-lg cursor-pointer border-none"
                              />
                              <span className="text-xs font-mono text-gray-400 capitalize">{customTheme.primary}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Accent Color</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={customTheme.secondary} 
                                onChange={(e) => setCustomTheme({...customTheme, secondary: e.target.value})}
                                className="w-8 h-8 rounded-lg cursor-pointer border-none"
                              />
                              <span className="text-xs font-mono text-gray-400 capitalize">{customTheme.secondary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs">2</span>
                          Live Preview
                        </h4>
                        <div className="flex-1 rounded-2xl p-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${customTheme.primary}20, ${customTheme.secondary}20)` }}>
                           <div className="w-32 h-40 rounded-xl shadow-lg bg-white flex flex-col p-2">
                              <div className="w-full h-2/3 rounded-lg" style={{ backgroundColor: customTheme.primary + '20' }}>
                                <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                              </div>
                              <div className="mt-2 h-2 w-3/4 rounded bg-gray-100" />
                              <div className="mt-1 h-2 w-1/2 rounded bg-gray-50" />
                              <div className="mt-auto h-4 w-full rounded-lg" style={{ backgroundColor: customTheme.primary }} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-12">
                <label className="block text-sm font-bold text-gray-700 mb-3">Scrapbook Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Summer in Europe 2026"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-base shadow-sm"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary !rounded-2xl flex items-center gap-2">
                  <span className="opacity-50">←</span> Back
                </button>
                <button
                  disabled={!selectedType || !title}
                  onClick={() => setStep(3)}
                  className="btn-primary !rounded-2xl flex items-center gap-2 disabled:opacity-50"
                >
                  Confirm & Preview <span className="opacity-50">→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Final Handoff */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto text-center"
            >
              {!generating ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-pink-500 rounded-3xl rotate-6 opacity-20" />
                    <div className="absolute inset-0 bg-purple-500 rounded-3xl -rotate-6 opacity-20" />
                    <div className="relative z-10 w-full h-full bg-white rounded-3xl shadow-premium flex items-center justify-center text-5xl">
                      📚
                    </div>
                  </div>
                  
                  <h1 className="text-4xl font-bold mb-4">You&apos;re all set!</h1>
                  <p className="text-gray-500 text-lg mb-10">
                    We&apos;ve prepared your <span className="text-gray-900 font-semibold">{title}</span> scrapbook. 
                    Now, let&apos;s head into the editor to finalize your layout.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                      <span className="text-2xl mb-1">🖼️</span>
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">{uploadedPhotos.length} Photos</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                      <span className="text-2xl mb-1">🎨</span>
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        {showCustomTheme ? "Custom Theme" : "Preset Theme"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button onClick={handleGenerate} className="btn-primary !py-4 text-lg font-bold shadow-xl flex items-center justify-center gap-3">
                      <span>✨ Start Designing</span>
                      <span className="opacity-50">→</span>
                    </button>
                    <button onClick={() => setStep(2)} className="text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors">
                      Wait, let me change the theme
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-20 flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 mb-8 rounded-full border-4 border-pink-100 border-t-pink-500"
                  />
                  <h2 className="text-2xl font-bold mb-3">Initializing Project...</h2>
                  <p className="text-gray-500">Preparing your high-resolution editor</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
