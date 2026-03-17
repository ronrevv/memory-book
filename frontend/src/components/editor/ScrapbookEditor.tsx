import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PhotoLibrary from './PhotoLibrary';
import PageCanvas from './PageCanvas';
import SettingsPanel from './SettingsPanel';
import TopBar from './TopBar';
import ThumbnailStrip from './ThumbnailStrip';
import ImageEditor from './ImageEditor';
import PreviewMode from './PreviewMode';
import { exportToJSON, exportToPDF } from '../../utils/exportUtils';
import { Scrapbook, Page, LayoutType, ImageBlock } from '../../app/editor/types';

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
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [isExporting, setIsExporting] = useState(false);

  const currentPage = scrapbook.pages[currentPageIndex];

  const updatePageLayout = (layout: LayoutType) => {
    const newPages = [...scrapbook.pages];
    let slotCount = 1;
    if (layout === 'layout_two' || layout === 'layout_collage') slotCount = 2;
    if (layout === 'layout_three') slotCount = 3;
    if (layout === 'layout_four') slotCount = 4;
    if (layout === 'layout_tilted' || layout === 'layout_caption') slotCount = 1;

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

  if (isPreviewMode) {
    return (
      <PreviewMode 
        scrapbook={scrapbook} 
        onClose={() => setIsPreviewMode(false)} 
      />
    );
  }

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
    </DndProvider>
  );
};

export default ScrapbookEditor;
