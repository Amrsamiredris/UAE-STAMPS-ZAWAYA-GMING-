import React, { useState } from 'react';
import { Header } from './components/Header';
import { StampGenerator } from './components/StampGenerator';
import { StampGallery } from './components/StampGallery';
import { GeneratedStamp } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedStamp[]>([]);

  const handleNewStamp = (stamp: GeneratedStamp) => {
    setHistory((prev) => [stamp, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-2xl px-6 py-12 flex flex-col gap-12">
        <Header />
        
        <main className="w-full flex flex-col gap-12">
          <StampGenerator onGenerate={handleNewStamp} />

          {history.length > 0 && (
            <section className="animate-fade-in-up pt-12 border-t border-gray-100">
              <h3 className="text-center text-gray-400 text-sm uppercase tracking-widest mb-8">My Collection</h3>
              <StampGallery stamps={history} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;