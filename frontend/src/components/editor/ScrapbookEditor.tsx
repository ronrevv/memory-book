import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PhotoLibrary from './PhotoLibrary';
import PageCanvas from './PageCanvas';
import SettingsPanel from './SettingsPanel';
import TopBar from './TopBar';
import ThumbnailStrip from './ThumbnailStrip';
import ImageEditor from './ImageEditor';
import PreviewMode from './PreviewMode';
import { exportToJSON, exportToPDF } from '../../utils/exportUtils';
import { Scrapbook, Page, LayoutType, ImageBlock, Sticker } from '../../app/editor/types';

interface Photo {
  id: string;
  url: string;
}

const SAMPLE_PHOTOS: Photo[] = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1532270660266-d472288924b2?auto=format&fit=crop&w=400&q=80' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80' },
  { id: 'p5', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
  { id: 'p6', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
];

const INITIAL_PAGES: Page[] = [
  { id: '1', layout: 'layout_hero', images: [null] },
];

const ScrapbookEditor: React.FC = () => {
  const [scrapbook, setScrapbook] = useState<Scrapbook>({
    title: 'My Memories',
    theme: 'modern',
    pages: INITIAL_PAGES,
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editingImage, setEditingImage] = useState<{ pageIndex: number; imageIndex: number } | null>(null);

  // Check for Photo Booth imports
  useEffect(() => {
    const pendingStrip = localStorage.getItem('pending_booth_strip');
    const urlParams = new URLSearchParams(window.location.search);
    const shouldAutoLayout = urlParams.get('autoLayout') === 'true';

    if (pendingStrip) {
      try {
        const stripPhotos = JSON.parse(pendingStrip) as string[];
        const newPhotoObjects = stripPhotos.map(url => ({
          id: `booth-${Math.random().toString(36).substr(2, 5)}`,
          url
        }));

        // Add to library
        setPhotos(prev => [...newPhotoObjects, ...prev]);

        if (shouldAutoLayout) {
          setScrapbook(prev => {
            const newIndex = prev.pages.length;
            const newPage: Page = {
              id: Math.random().toString(36).substr(2, 9),
              layout: 'layout_four',
              images: newPhotoObjects.map(p => ({
                id: Math.random().toString(36).substr(2, 9),
                src: p.url,
                caption: 'Booth Session ✨'
              }))
            };
            setCurrentPageIndex(newIndex);
            return {
              ...prev,
              pages: [...prev.pages, newPage]
            };
          });
        }

        localStorage.removeItem('pending_booth_strip');
        // Clean up URL
        window.history.replaceState({}, '', '/editor');
      } catch (err) {
        console.error('Failed to import booth strip:', err);
      }
    }
  }, []);
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [isExporting, setIsExporting] = useState(false);

  const currentPage = scrapbook.pages[currentPageIndex];

  const updatePageLayout = (layout: LayoutType) => {
    const newPages = [...scrapbook.pages];
    const layoutSlots: Record<LayoutType, number> = {
      'layout_hero': 1,
      'layout_two': 2,
      'layout_three': 3,
      'layout_four': 4,
      'layout_five': 5,
      'layout_six': 6,
      'layout_magazine': 3,
      'layout_caption': 1,
      'layout_tilted': 1,
      'layout_collage': 2
    };
    const slotCount = layoutSlots[layout] || 1;

    // Pad image array if it's shorter than the new layout requires
    const currentImages = [...newPages[currentPageIndex].images];
    while (currentImages.length < slotCount) {
      currentImages.push(null);
    }

    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      layout,
      images: currentImages,
    };
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const addPage = () => {
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      layout: 'layout_hero',
      images: [null],
    };
    setScrapbook({ ...scrapbook, pages: [...scrapbook.pages, newPage] });
    setCurrentPageIndex(scrapbook.pages.length);
  };

  const deletePage = (index: number) => {
    if (scrapbook.pages.length <= 1) return;
    const newPages = scrapbook.pages.filter((_: Page, i: number) => i !== index);
    setScrapbook({ ...scrapbook, pages: newPages });
    setCurrentPageIndex(Math.max(0, index - 1));
  };

  const duplicatePage = (index: number) => {
    const pageToDuplicate = scrapbook.pages[index];
    const newPage = { ...pageToDuplicate, id: Math.random().toString(36).substr(2, 9) };
    const newPages = [...scrapbook.pages];
    newPages.splice(index + 1, 0, newPage);
    setScrapbook({ ...scrapbook, pages: newPages });
    setCurrentPageIndex(index + 1);
  };

  const handleImageSave = (updatedImage: ImageBlock) => {
    if (!editingImage) return;
    const { pageIndex, imageIndex } = editingImage;
    const newPages = [...scrapbook.pages];
    const newImages = [...newPages[pageIndex].images];
    newImages[imageIndex] = updatedImage;
    newPages[pageIndex] = { ...newPages[pageIndex], images: newImages };
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const reorderPages = (startIndex: number, endIndex: number) => {
    const newPages = [...scrapbook.pages];
    const [removed] = newPages.splice(startIndex, 1);
    newPages.splice(endIndex, 0, removed);
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const addSticker = (sticker: Omit<Sticker, 'id'>) => {
    const newPages = [...scrapbook.pages];
    const page = newPages[currentPageIndex];
    const newSticker: Sticker = {
      ...sticker,
      id: Math.random().toString(36).substr(2, 9),
    };
    page.stickers = [...(page.stickers || []), newSticker];
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const updateSticker = (stickerId: string, updates: Partial<Sticker>) => {
    const newPages = [...scrapbook.pages];
    const page = newPages[currentPageIndex];
    if (!page.stickers) return;
    page.stickers = page.stickers.map(s => s.id === stickerId ? { ...s, ...updates } : s);
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const removeSticker = (stickerId: string) => {
    const newPages = [...scrapbook.pages];
    const page = newPages[currentPageIndex];
    if (!page.stickers) return;
    page.stickers = page.stickers.filter(s => s.id !== stickerId);
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  const updateBackground = (texture: Page['backgroundTexture'], color?: string) => {
    const newPages = [...scrapbook.pages];
    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      backgroundTexture: texture,
      backgroundColor: color || newPages[currentPageIndex].backgroundColor,
    };
    setScrapbook({ ...scrapbook, pages: newPages });
  };

  // Removed early return to keep canvas mounted for background tasks (like export)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-[#f3f4f6]">
        <TopBar 
          title={scrapbook.title} 
          onPreview={() => setIsPreviewMode(true)}
          onExportJSON={() => exportToJSON(scrapbook)}
          onExportPDF={async () => {
             setIsExporting(true);
             const originalIndex = currentPageIndex;
             try {
                await exportToPDF(scrapbook, async (index) => {
                   setCurrentPageIndex(index);
                });
             } finally {
                setCurrentPageIndex(originalIndex);
                setIsExporting(false);
             }
          }}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <PhotoLibrary 
            photos={photos} 
            onUpload={(newPhoto: Photo) => setPhotos(prev => [newPhoto, ...prev])} 
          />
          
          <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto relative text-center">
            <PageCanvas 
              page={currentPage} 
              onUpdatePage={(updatedPage: Page) => {
                const newPages = [...scrapbook.pages];
                newPages[currentPageIndex] = updatedPage;
                setScrapbook({ ...scrapbook, pages: newPages });
              }}
              onEditImage={(imageIndex: number) => setEditingImage({ pageIndex: currentPageIndex, imageIndex })}
              onUpdateCaption={(imageIndex: number, caption: string) => {
                const newPages = [...scrapbook.pages];
                const page = newPages[currentPageIndex];
                const image = page.images[imageIndex];
                if (image) {
                  page.images[imageIndex] = { ...image, caption };
                  setScrapbook({ ...scrapbook, pages: newPages });
                }
              }}
              onAddSticker={addSticker}
              onUpdateSticker={updateSticker}
              onRemoveSticker={removeSticker}
            />
            
            <ThumbnailStrip 
              pages={scrapbook.pages}
              currentIndex={currentPageIndex}
              onSelect={setCurrentPageIndex}
              onAdd={addPage}
              onDelete={deletePage}
              onDuplicate={duplicatePage}
              onReorder={reorderPages}
            />
          </main>
          
          <SettingsPanel 
            currentLayout={currentPage.layout}
            onLayoutChange={updatePageLayout}
            currentBackground={currentPage.backgroundTexture || 'none'}
            onBackgroundChange={updateBackground}
          />
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white text-center">
           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
           <h2 className="text-2xl font-bold mb-2">Generating PDF...</h2>
           <p className="text-white/60 text-sm">Capturing your beautiful memories, please wait.</p>
        </div>
      )}

      {editingImage && scrapbook.pages[editingImage.pageIndex].images[editingImage.imageIndex] && (
        <ImageEditor 
          image={scrapbook.pages[editingImage.pageIndex].images[editingImage.imageIndex]!}
          onSave={handleImageSave}
          onClose={() => setEditingImage(null)}
        />
      )}

      {/* Preview Mode Overlay */}
      <AnimatePresence>
        {isPreviewMode && (
          <PreviewMode 
            scrapbook={scrapbook} 
            onClose={() => setIsPreviewMode(false)} 
            onExportPDF={async () => {
              // Trigger the same export logic but without needing to switch the editor UI 
              // (or we can switch it in the background)
              setIsExporting(true);
              try {
                await exportToPDF(scrapbook, async (index) => {
                  // If we want to sync the preview index during export, we could pass another callback
                  // but sticking to editor state sync for now
                  setCurrentPageIndex(index);
                });
              } finally {
                setIsExporting(false);
              }
            }}
          />
        )}
      </AnimatePresence>
    </DndProvider>
  );
};

export default ScrapbookEditor;
