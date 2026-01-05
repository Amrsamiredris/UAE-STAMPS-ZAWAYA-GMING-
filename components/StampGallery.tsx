import React from 'react';
import { GeneratedStamp } from '../types';

interface StampGalleryProps {
  stamps: GeneratedStamp[];
}

export const StampGallery: React.FC<StampGalleryProps> = ({ stamps }) => {
  if (stamps.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stamps.map((stamp) => (
        <div 
          key={stamp.id} 
          className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200 transition-all"
          onClick={() => {
              const link = document.createElement('a');
              link.href = stamp.imageUrl;
              link.download = `stamp-${stamp.id}.png`;
              link.click();
          }}
        >
          <img 
            src={stamp.imageUrl} 
            alt={stamp.theme} 
            className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100">
             <span className="text-white text-xs font-medium">Download</span>
          </div>
        </div>
      ))}
    </div>
  );
};