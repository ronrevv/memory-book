import React from 'react';
import { useDrag } from 'react-dnd';
import { Image, Search, Plus, UploadCloud, Sticker as StickerIcon, Sparkles } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
}

interface PhotoLibraryProps {
  photos: Photo[];
  onUpload: (photo: Photo) => void;
}

const STICKER_ASSETS = [
  { id: 's1', url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=200&q=80', label: 'Vintage Flower' },
  { id: 's2', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=200&q=80', label: 'Washi Tape' },
  { id: 's3', url: 'https://images.unsplash.com/photo-1523450001312-daa4e2e12446?auto=format&fit=crop&w=200&q=80', label: 'Polaroid Frame' },
  { id: 's4', url: 'https://images.unsplash.com/photo-1583225214464-9296029427aa?auto=format&fit=crop&w=200&q=80', label: 'Dried Leaf' },
  { id: 's5', url: 'https://images.unsplash.com/photo-1506792006437-256b665541e2?auto=format&fit=crop&w=200&q=80', label: 'Classic Seal' },
  { id: 's6', url: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=200&q=80', label: 'Heart Charm' },
];

const DraggableSticker: React.FC<{ sticker: typeof STICKER_ASSETS[0] }> = ({ sticker }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'STICKER',
    item: { src: sticker.url, type: 'STICKER' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [sticker]);

  return (
    <div
      ref={drag as any}
      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all hover:scale-105 hover:shadow-lg ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100 border-white hover:border-indigo-400'
      }`}
    >
      <img src={sticker.url} alt={sticker.label} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
    </div>
  );
};

const DraggablePhoto: React.FC<{ photo: Photo }> = ({ photo }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PHOTO',
    item: () => {
      console.log('Drag started for photo:', photo.id);
      return { id: photo.id, url: photo.url };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [photo]);

  return (
    <div
      ref={drag as any}
      className={`aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? 'opacity-40 scale-95 grayscale' : 'opacity-100 hover:border-indigo-400'
      }`}
    >
      <img src={photo.url} alt="User upload" className="w-full h-full object-cover" />
    </div>
  );
};

const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ photos, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'photos' | 'stickers'>('photos');
  
  const filteredPhotos = photos.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    searchTerm === ''
  );

  const filteredStickers = STICKER_ASSETS.filter(s =>
    s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm === ''
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      onUpload({
        id: Math.random().toString(36).substr(2, 9),
        url,
      });
    });
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-50 flex flex-col gap-5">
        <div className="flex bg-gray-50 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('photos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'photos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Image size={14} />
            Photos
          </button>
          <button 
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'stickers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <StickerIcon size={14} />
            Stickers
          </button>
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'photos' ? "Search photos..." : "Search stickers..."}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'photos' ? (
          <div className="flex flex-col gap-5">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50/10 flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-2 group active:scale-95 shadow-sm"
            >
              <UploadCloud size={24} className="group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-tight">Upload Photos</span>
                <span className="text-[8px] opacity-60">or drag them here</span>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-3 pb-8">
              {filteredPhotos.map((photo: Photo) => (
                <DraggablePhoto key={photo.id} photo={photo} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
              <Sparkles size={16} className="text-indigo-500" />
              <p className="text-[10px] font-medium text-indigo-700 leading-tight">
                Drag stickers onto the page to decorate your story!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {filteredStickers.map((sticker) => (
                <DraggableSticker key={sticker.id} sticker={sticker} />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PhotoLibrary;
