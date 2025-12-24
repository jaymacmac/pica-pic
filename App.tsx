import React, { useState, useCallback, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import GalleryGrid from './components/GalleryGrid';
import ImageViewer from './components/ImageViewer';
import GenerationModal from './components/GenerationModal';
import { ImageItem } from './types';
import { v4 as uuidv4 } from 'uuid';

// Sample data to start with
const SAMPLE_IMAGES: ImageItem[] = [
  {
    id: 'sample-1',
    url: 'https://picsum.photos/id/10/800/800',
    thumbnailUrl: 'https://picsum.photos/id/10/400/400',
    title: 'Misty Forests',
    createdAt: Date.now(),
    source: 'sample'
  },
  {
    id: 'sample-2',
    url: 'https://picsum.photos/id/16/800/600',
    thumbnailUrl: 'https://picsum.photos/id/16/400/300',
    title: 'Coastal View',
    createdAt: Date.now(),
    source: 'sample'
  },
  {
    id: 'sample-3',
    url: 'https://picsum.photos/id/28/800/1000',
    thumbnailUrl: 'https://picsum.photos/id/28/400/500',
    title: 'Mountain Retreat',
    createdAt: Date.now(),
    source: 'sample'
  },
    {
    id: 'sample-4',
    url: 'https://picsum.photos/id/54/800/800',
    thumbnailUrl: 'https://picsum.photos/id/54/400/400',
    title: 'Abstract Peaks',
    createdAt: Date.now(),
    source: 'sample'
  }
];

const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>(SAMPLE_IMAGES);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);

  // File Upload Handler
  const handleUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Strip prefix for API storage if needed, but for display we need full
        const base64Data = base64.split(',')[1];
        
        const newImage: ImageItem = {
          id: uuidv4(),
          url: base64, // Display directly
          thumbnailUrl: base64,
          title: file.name.split('.')[0],
          createdAt: Date.now(),
          source: 'upload',
          base64Data: base64Data
        };
        setImages(prev => [newImage, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // AI Generation Handler
  const handleImageGenerated = useCallback((data: { base64: string, prompt: string, mimeType: string }) => {
    const fullDataUrl = `data:${data.mimeType};base64,${data.base64}`;
    const newImage: ImageItem = {
      id: uuidv4(),
      url: fullDataUrl,
      thumbnailUrl: fullDataUrl,
      title: data.prompt.slice(0, 30) + (data.prompt.length > 30 ? '...' : ''),
      description: `Generated from prompt: "${data.prompt}"`,
      createdAt: Date.now(),
      source: 'generated',
      base64Data: data.base64
    };
    setImages(prev => [newImage, ...prev]);
  }, []);

  // Navigation Logic
  const getSelectedIndex = () => images.findIndex(img => img.id === selectedImageId);
  const selectedIndex = getSelectedIndex();
  const selectedImage = selectedIndex !== -1 ? images[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedImageId(images[selectedIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedImageId(images[selectedIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Toolbar 
        onUpload={handleUpload}
        onOpenGenerate={() => setIsGenerationOpen(true)}
      />

      <main className="flex-1 container mx-auto max-w-7xl">
        <GalleryGrid 
          images={images} 
          onImageClick={(img) => setSelectedImageId(img.id)}
        />
      </main>

      {/* Lightbox / Viewer */}
      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImageId(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedIndex < images.length - 1}
          hasPrev={selectedIndex > 0}
        />
      )}

      {/* Generation Modal */}
      <GenerationModal 
        isOpen={isGenerationOpen}
        onClose={() => setIsGenerationOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
    </div>
  );
};

export default App;