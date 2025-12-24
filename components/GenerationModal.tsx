import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { generateImage } from '../services/geminiService';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (data: { base64: string, prompt: string, mimeType: string }) => void;
}

const GenerationModal: React.FC<GenerationModalProps> = ({ isOpen, onClose, onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { base64, mimeType } = await generateImage(prompt);
      onImageGenerated({ base64, prompt, mimeType });
      setPrompt('');
      onClose();
    } catch (err) {
      setError("Failed to generate image. Please check API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            Generate with Gemini
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars, neon lights, cyberpunk style..."
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-none"
              disabled={isGenerating}
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className={`
                px-6 py-2.5 rounded-xl font-medium text-white shadow-lg 
                flex items-center gap-2 transition-all
                ${isGenerating || !prompt.trim() 
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30 hover:shadow-purple-900/50 transform hover:-translate-y-0.5'}
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerationModal;