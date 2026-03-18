import React from 'react';
import { useDrag } from 'react-dnd';
import { Image, Search, Plus, UploadCloud } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
}

interface PhotoLibraryProps {
  photos: Photo[];
  onUpload: (photo: Photo) => void;
}

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
  
  const filteredPhotos = photos.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    // If we had categories or tags, we'd search those too
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-50 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
          <Image size={16} className="text-indigo-600" />
          Photos
        </h2>
        
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search photos..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
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
          className="w-full aspect-[3/1] rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/10 flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-1 group"
        >
          <UploadCloud size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Upload Photos</span>
        </button>

        <div className="grid grid-cols-2 gap-3 pb-8">
          {filteredPhotos.map((photo: Photo) => (
            <DraggablePhoto key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PhotoLibrary;
