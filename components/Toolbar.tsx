import React, { useRef } from 'react';
import { PlusIcon, SparklesIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface ToolbarProps {
  onUpload: (files: FileList) => void;
  onOpenGenerate: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onUpload, onOpenGenerate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <nav className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          LuminaView
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*" 
          multiple 
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-colors border border-gray-700"
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={onOpenGenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-900/30"
        >
          <SparklesIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>
    </nav>
  );
};

export default Toolbar;