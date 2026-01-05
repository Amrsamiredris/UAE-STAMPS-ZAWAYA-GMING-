import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center gap-4 text-center">
      {/* 
        Ideally, you would place your logo file as 'logo.png' in your public folder.
        We are using a text fallback that mimics the logo's colors if the image doesn't load.
      */}
      <div className="w-full max-w-md mx-auto">
         <img 
            src="/logo.png" 
            alt="Stamps For Tomorrow" 
            className="w-full h-auto object-contain max-h-32 mx-auto"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                document.getElementById('logo-fallback')!.style.display = 'flex';
            }}
         />
         <div id="logo-fallback" className="hidden flex-col items-center justify-center">
            {/* Fallback styling matching the logo colors provided */}
            <div className="flex flex-wrap justify-center gap-2 text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                <span className="text-[#548C6B]">Stamps</span>
                <span className="text-[#3B82B6]">For</span>
                <span className="text-[#A77BB5]">Tomorrow</span>
            </div>
         </div>
      </div>
    </header>
  );
};