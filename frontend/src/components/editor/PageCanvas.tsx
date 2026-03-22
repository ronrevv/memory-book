import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, ImageBlock, Sticker } from '../../app/editor/types';
import { Plus, Trash2, Maximize2, Edit3, X } from 'lucide-react';

interface PageCanvasProps {
  page: Page;
  onUpdatePage: (updatedPage: Page) => void;
  onEditImage: (index: number) => void;
  onUpdateCaption: (index: number, caption: string) => void;
  onAddSticker?: (sticker: Omit<Sticker, 'id'>) => void;
  onUpdateSticker?: (id: string, updates: Partial<Sticker>) => void;
  onRemoveSticker?: (id: string) => void;
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
  const [{ isOver, canDrop, isDragging }, drop] = useDrop(() => ({
    accept: 'PHOTO',
    canDrop: (item) => true,
    drop: (item: { id: string; url: string }) => {
      console.log('Drop successful on slot', index, item);
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      isDragging: !!monitor.getItem(),
    }),
  }), [onDrop, index]);

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop as any}
      className={`w-full h-full relative group rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl ${
        isActive ? 'ring-4 ring-indigo-500 ring-offset-4 scale-[1.02] z-30 bg-indigo-50/80 shadow-indigo-200/50' : 
        (isDragging && !content) ? 'ring-2 ring-indigo-300 ring-dashed border-none bg-indigo-50/30' : 'ring-0'
      } ${!content ? 'bg-gradient-to-br from-gray-50/50 to-gray-100/50 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:scale-[1.01] transition-all cursor-pointer' : 'bg-gray-200'}`}
    >
      <div className={`absolute inset-0 bg-indigo-500/5 animate-pulse transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
      {content ? (
        <>
          <img src={content.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
             <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit(); }}
                 className="w-10 h-10 bg-white/20 hover:bg-white text-white hover:text-indigo-600 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
               >
                 <Edit3 size={18} />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onRemove(); }}
                 className="w-10 h-10 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
               >
                 <Trash2 size={18} />
               </button>
             </div>
             <div className="w-[85%] px-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                <input 
                  type="text"
                  placeholder="Type a caption..."
                  className="w-full bg-white/10 hover:bg-white/20 focus:bg-white border border-white/20 focus:border-white rounded-xl py-2 px-4 text-xs text-white focus:text-gray-900 outline-none transition-all text-center placeholder:text-white/60"
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

const StickerElement: React.FC<{ sticker: Sticker; onUpdate: (updates: Partial<Sticker>) => void; onRemove: () => void }> = ({ sticker, onUpdate, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MOVE_STICKER',
    item: { id: sticker.id, type: 'MOVE_STICKER' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [sticker.id]);

  return (
    <motion.div
      ref={drag as any}
      style={{
        position: 'absolute',
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
        width: 80,
        height: 80,
        zIndex: 50,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: sticker.scale }}
      className="group cursor-move"
    >
      <img src={sticker.src} className="w-full h-full object-contain drop-shadow-lg" alt="" />
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg hover:bg-red-600 scale-0 group-hover:scale-100 transition-transform"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

const PageCanvas: React.FC<PageCanvasProps> = ({ 
  page, 
  onUpdatePage, 
  onEditImage, 
  onUpdateCaption,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker
}) => {
  const [{ isOverSticker }, drop] = useDrop(() => ({
    accept: ['STICKER', 'MOVE_STICKER'],
    drop: (item: any, monitor: any) => {
      const offset = monitor.getClientOffset();
      const element = document.getElementById('scrapbook-page-content');
      if (!offset || !element) return;

      const rect = element.getBoundingClientRect();
      const x = ((offset.x - rect.left) / rect.width) * 100;
      const y = ((offset.y - rect.top) / rect.height) * 100;

      if (item.type === 'STICKER') {
        onAddSticker?.({
          src: item.src,
          x,
          y,
          rotation: Math.random() * 20 - 10,
          scale: 1,
        });
      } else if (item.type === 'MOVE_STICKER') {
        onUpdateSticker?.(item.id, { x, y });
      }
    },
    collect: (monitor) => ({
      isOverSticker: !!monitor.isOver(),
    }),
  }), [onAddSticker, onUpdateSticker]);
  const handleDrop = (index: number, photo: { id: string; url: string }) => {
    // ... logic moved or updated if needed but keeping it consistent with images
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
      case 'layout_five':
        return (
          <div className="w-full h-full p-8 md:p-10 grid grid-cols-4 grid-rows-2 gap-4">
            <div className="col-span-2 row-span-2">
              <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <div className="col-span-2">
              <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
            </div>
            <DropZone index={2} content={page.images[2]} onDrop={(p) => handleDrop(2, p)} onRemove={() => handleRemove(2)} onEdit={() => onEditImage(2)} onUpdateCaption={(c) => onUpdateCaption(2, c)} />
            <DropZone index={3} content={page.images[3]} onDrop={(p) => handleDrop(3, p)} onRemove={() => handleRemove(3)} onEdit={() => onEditImage(3)} onUpdateCaption={(c) => onUpdateCaption(3, c)} />
          </div>
        );
      case 'layout_six':
        return (
          <div className="w-full h-full p-8 grid grid-cols-2 grid-rows-3 gap-3">
             {Array.from({ length: 6 }).map((_: any, i: number) => (
                <DropZone key={i} index={i} content={page.images[i]} onDrop={(p) => handleDrop(i, p)} onRemove={() => handleRemove(i)} onEdit={() => onEditImage(i)} onUpdateCaption={(c) => onUpdateCaption(i, c)} />
             ))}
          </div>
        );
      case 'layout_magazine':
        return (
          <div className="w-full h-full p-8 grid grid-cols-3 gap-6">
            <div className="col-span-2">
               <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <div className="flex flex-col gap-6">
               <div className="flex-1">
                 <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
               </div>
               <div className="flex-1">
                 <DropZone index={2} content={page.images[2]} onDrop={(p) => handleDrop(2, p)} onRemove={() => handleRemove(2)} onEdit={() => onEditImage(2)} onUpdateCaption={(c) => onUpdateCaption(2, c)} />
               </div>
            </div>
          </div>
        );
      case 'layout_collage':
        return (
          <div className="w-full h-full p-8 relative">
            <div className="absolute top-8 left-8 w-[65%] h-[65%] z-0 rotate-[-4deg] shadow-2xl">
               <DropZone index={0} content={page.images[0]} onDrop={(p) => handleDrop(0, p)} onRemove={() => handleRemove(0)} onEdit={() => onEditImage(0)} onUpdateCaption={(c) => onUpdateCaption(0, c)} />
            </div>
            <div className="absolute bottom-10 right-10 w-[60%] h-[60%] z-10 rotate-[4deg] shadow-2xl overflow-visible">
               <div className="w-full h-full border-4 border-white shadow-xl rounded-2xl">
                 <DropZone index={1} content={page.images[1]} onDrop={(p) => handleDrop(1, p)} onRemove={() => handleRemove(1)} onEdit={() => onEditImage(1)} onUpdateCaption={(c) => onUpdateCaption(1, c)} />
               </div>
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
        ref={drop as any}
        className={`w-[500px] aspect-[4/5] bg-white rounded-r-3xl rounded-l-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative transition-colors duration-500 ${
          page.backgroundTexture === 'paper' ? 'bg-[#fdfcf9]' :
          page.backgroundTexture === 'linen' ? 'bg-[#f4f4f4]' :
          page.backgroundTexture === 'wood' ? 'bg-[#e5d5c5]' :
          page.backgroundTexture === 'floral' ? 'bg-[#fffafa]' : 'bg-white'
        }`}
      >
        {/* Spine shadow - MUST be pointer-events-none to avoid blocking DnD */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.08] via-black/[0.03] to-transparent z-10 pointer-events-none" />
        <div className="absolute left-3 top-0 bottom-0 w-[0.5px] bg-white/20 z-10 pointer-events-none" />
        
        {/* Background texture simulator */}
        <div className={`absolute inset-0 pointer-events-none mix-blend-multiply z-0 opacity-40 transition-opacity duration-700 ${page.backgroundTexture ? 'opacity-100' : 'opacity-0'}`}>
          {page.backgroundTexture === 'paper' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />}
          {page.backgroundTexture === 'linen' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]" />}
          {page.backgroundTexture === 'wood' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-60" />}
          {page.backgroundTexture === 'floral' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/double-bubble.png')] opacity-30" />}
          
          {/* Default subtle grain */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10" />
        </div>
        
        {/* Stickers Layer */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          {page.stickers?.map((sticker) => (
            <div key={sticker.id} className="pointer-events-auto">
              <StickerElement 
                sticker={sticker} 
                onUpdate={(updates) => onUpdateSticker?.(sticker.id, updates)}
                onRemove={() => onRemoveSticker?.(sticker.id)}
              />
            </div>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={page.layout}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative z-20"
          >
            {renderLayout()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageCanvas;
