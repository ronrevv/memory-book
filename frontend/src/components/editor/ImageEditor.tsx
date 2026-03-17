import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCw, Sun, Contrast, SlidersHorizontal, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
import { ImageBlock } from '../../app/editor/types';

interface ImageEditorProps {
  image: ImageBlock;
  onSave: (updatedImage: ImageBlock) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(image.rotation || 0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);
  
  const [brightness, setBrightness] = useState(image.brightness || 100);
  const [contrast, setContrast] = useState(image.contrast || 100);
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'filters'>('crop');

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = () => {
    onSave({
      ...image,
      rotation,
      brightness,
      contrast,
      crop: croppedAreaPixels,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-white/20">
        {/* Left Side: Preview/Cropper */}
        <div className="flex-1 bg-neutral-100 relative overflow-hidden group">
          <div className="absolute inset-0">
            <Cropper
              image={image.src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 5}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{
                containerStyle: {
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                }
              }}
            />
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-white/90 backdrop-blur rounded-full shadow-2xl transition-transform group-hover:scale-110">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Zoom</span>
              <input 
                type="range" 
                min={1} 
                max={3} 
                step={0.1} 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-indigo-600"
              />
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <button 
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <RotateCw size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-80 border-l border-gray-100 flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Image</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enhance Your Memory</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex p-4 gap-1">
              {[
                { id: 'crop', icon: <ImageIcon size={16} />, label: 'Crop' },
                { id: 'adjust', icon: <SlidersHorizontal size={16} />, label: 'Adjust' },
                { id: 'filters', icon: <Sparkles size={16} />, label: 'Filters' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 space-y-8">
              {activeTab === 'adjust' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Sun size={16} />
                        <span className="text-xs font-bold uppercase tracking-wide">Brightness</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={200} 
                      value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Contrast size={16} />
                        <span className="text-xs font-bold uppercase tracking-wide">Contrast</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{contrast}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={200} 
                      value={contrast} 
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'filters' && (
                <div className="grid grid-cols-2 gap-4">
                  {['None', 'Sepia', 'Grayscale', 'Vintage', 'Modern', 'Vivid'].map((filter) => (
                    <button 
                      key={filter}
                      className="flex flex-col gap-2 group transition-all"
                    >
                      <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-md transition-all">
                        <img src={image.src} alt="" className={`w-full h-full object-cover ${
                          filter === 'Sepia' ? 'sepia' : 
                          filter === 'Grayscale' ? 'grayscale' : 
                          filter === 'Vintage' ? 'sepia saturate-[0.8] contrast-[1.2]' :
                          filter === 'Vivid' ? 'saturate-[1.5]' : ''
                        }`} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase text-center">{filter}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-gray-50">
            <button 
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Check size={20} />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
