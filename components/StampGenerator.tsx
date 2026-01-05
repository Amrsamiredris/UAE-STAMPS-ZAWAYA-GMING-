import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';
import { StampDisplay } from './StampDisplay';
import { generateStampImage } from '../services/geminiService';
import { GeneratedStamp } from '../types';

interface StampGeneratorProps {
  onGenerate: (stamp: GeneratedStamp) => void;
}

export const StampGenerator: React.FC<StampGeneratorProps> = ({ onGenerate }) => {
  const [inputTheme, setInputTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStamp, setCurrentStamp] = useState<GeneratedStamp | null>(null);

  const handleGenerate = async () => {
    if (!inputTheme.trim()) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateStampImage(inputTheme);
      
      const newStamp: GeneratedStamp = {
        id: crypto.randomUUID(),
        imageUrl,
        theme: inputTheme,
        timestamp: Date.now()
      };

      setCurrentStamp(newStamp);
      onGenerate(newStamp);
    } catch (err) {
      setError("Could not generate stamp. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStampEdited = (newStamp: GeneratedStamp) => {
    setCurrentStamp(newStamp);
    onGenerate(newStamp);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Input Section */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative w-full">
            <input
              type="text"
              value={inputTheme}
              onChange={(e) => setInputTheme(e.target.value)}
              placeholder="What do you want to see on your stamp?"
              className="w-full text-center text-lg px-6 py-4 rounded-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3B82B6] outline-none transition-all placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
        </div>
        
        <Button 
          onClick={handleGenerate} 
          isLoading={isGenerating}
          disabled={!inputTheme.trim()}
          className="w-full md:w-auto min-w-[200px] rounded-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Stamp'}
        </Button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Result Display */}
      {(currentStamp || isGenerating) && (
        <div className="mt-8 flex flex-col items-center animate-fade-in-up">
           {isGenerating && !currentStamp ? (
             <div className="h-64 flex items-center justify-center text-gray-300">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                    <div className="h-2 w-32 bg-gray-100 rounded"></div>
                </div>
             </div>
           ) : currentStamp ? (
             <StampDisplay stamp={currentStamp} onEdited={handleStampEdited} />
           ) : null}
        </div>
      )}
    </div>
  );
};
