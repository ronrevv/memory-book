import React from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, ImageBlock } from '../../app/editor/types';
import { Plus, Trash2, Maximize2, Edit3 } from 'lucide-react';

interface PageCanvasProps {
  page: Page;
  onUpdatePage: (updatedPage: Page) => void;
  onEditImage: (index: number) => void;
  onUpdateCaption: (index: number, caption: string) => void;
}

interface DropZoneProps {
  index: number;
  content: ImageBlock | null;
  onDrop: (photo: { id: string; url: string }) => void;
  onRemove: () => void;
  onEdit: () => void;
  onUpdateCaption: (caption: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ index, content, onDrop, onRemove, onEdit, onUpdateCaption }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'PHOTO',
    drop: (item: { id: string; url: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop as any}
      className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
        isActive ? 'ring-4 ring-indigo-500 ring-inset scale-[0.98]' : 'ring-0'
      } ${!content ? 'bg-gray-100/50 border-2 border-dashed border-gray-200' : 'bg-gray-200'}`}
    >
      {content ? (
        <>
          <img src={content.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
             <div className="flex gap-3">
               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit(); }}
                 className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all scale-90 group-hover:scale-100"
               >
                 <Edit3 size={18} />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onRemove(); }}
                 className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all scale-90 group-hover:scale-100"
               >
                 <Trash2 size={18} />
               </button>
             </div>
             <div className="w-[80%] px-2">
                <input 
                  type="text"
                  placeholder="Slot caption..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg py-1 px-3 text-[10px] text-white outline-none focus:bg-white/20 focus:border-white/40 transition-all text-center"
                  value={content.caption || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdateCaption(e.target.value);
                  }}
                />
             </div>
          </div>
          {content.caption && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 pointer-events-none">
              <p className="text-xs text-center font-medium text-gray-800">{content.caption}</p>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
           <Plus size={32} className={`${isActive ? 'text-indigo-400' : ''} transition-colors`} />
           <span className="text-[10px] font-bold uppercase mt-2 tracking-widest">Drop Image</span>
        </div>
      )}
    </div>
  );
};

const PageCanvas: React.FC<PageCanvasProps> = ({ page, onUpdatePage, onEditImage, onUpdateCaption }) => {
  const handleDrop = (index: number, photo: { id: string; url: string }) => {
    const newImages = [...page.images];
    newImages[index] = {
      id: Math.random().toString(36).substr(2, 9),
      src: photo.url,
      caption: '',
    };
    onUpdatePage({ ...page, images: newImages });
  };

  const handleRemove = (index: number) => {
    const newImages = [...page.images];
    newImages[index] = null;
    onUpdatePage({ ...page, images: newImages });
  };

  const renderLayout = () => {
    switch (page.layout) {
      case 'layout_hero':
        return (
          <div className="w-full h-full p-8 md:p-12">
            <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
          </div>
        );
      case 'layout_two':
        return (
          <div className="w-full h-full p-8 md:p-12 grid grid-cols-2 gap-6">
            <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
          </div>
        );
      case 'layout_three':
        return (
          <div className="w-full h-full p-8 md:p-12 grid grid-cols-2 grid-rows-2 gap-4">
            <div className="row-span-2">
              <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
            <DropZone index={2} content={page.images[2]} onDrop={(p) => handleDrop(2, p)} onRemove={() => handleRemove(2)} onEdit={() => onEditImage(2)} onUpdateCaption={(c) => onUpdateCaption(2, c)} />
          </div>
        );
      case 'layout_four':
        return (
          <div className="w-full h-full p-8 md:p-12 grid grid-cols-2 grid-rows-2 gap-4">
             {Array.from({ length: 4 }).map((_: any, i: number) => (
                <DropZone key={i} index={i} content={page.images[i]} onDrop={(p) => handleDrop(i, p)} onRemove={() => handleRemove(i)} onEdit={() => onEditImage(i)} onUpdateCaption={(c) => onUpdateCaption(i, c)} />
             ))}
          </div>
        );
      case 'layout_caption':
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col gap-6">
            <div className="flex-1">
              <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <div className="h-24 bg-white/50 rounded-2xl border border-gray-100 p-4">
              <textarea 
                className="w-full h-full bg-transparent outline-none text-sm text-center resize-none placeholder:text-gray-300" 
                placeholder="Add a heartwarming caption..."
                value={page.images[0]?.caption || ''}
                onChange={(e) => onUpdateCaption(0, e.target.value)}
              />
            </div>
          </div>
        );
      case 'layout_tilted':
        return (
          <div className="w-full h-full p-12 flex items-center justify-center">
            <div className="w-full h-full rotate-[-3deg] transition-transform hover:rotate-0 duration-500">
               <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
          </div>
        );
      case 'layout_collage':
        return (
          <div className="w-full h-full p-8 relative">
            <div className="absolute top-8 left-8 w-[60%] h-[60%] z-0 rotate-[-5deg] shadow-xl">
               <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <div className="absolute bottom-12 right-12 w-[55%] h-[55%] z-10 rotate-[5deg] shadow-2xl">
               <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative group">
      {/* Premium shadows */}
      <div className="absolute -inset-6 bg-white/40 blur-3xl rounded-[3rem] -z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
      
      <div
        id="scrapbook-page-content"
        className="w-[500px] aspect-[4/5] bg-white rounded-r-3xl rounded-l-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative"
      >
        {/* Spine shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.08] via-black/[0.03] to-transparent z-10" />
        <div className="absolute left-3 top-0 bottom-0 w-[0.5px] bg-white/20 z-10" />
        
        {/* Background texture simulator */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
        
        {renderLayout()}
      </div>
    </div>
  );
};

export default PageCanvas;
