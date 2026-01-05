import React, { useState, useEffect } from 'react';
import { Printer, QrCode, HardDrive, Link as LinkIcon, FileJson, Type, Wand2, Send } from 'lucide-react';
import QRCode from 'qrcode';
import { GeneratedStamp } from '../types';
import { editStampImage } from '../services/geminiService';

interface StampDisplayProps {
  stamp: GeneratedStamp;
  onEdited?: (newStamp: GeneratedStamp) => void;
}

type QrMode = 'theme' | 'metadata' | 'link';

export const StampDisplay: React.FC<StampDisplayProps> = ({ stamp, onEdited }) => {
  const [showQr, setShowQr] = useState(false);
  const [qrMode, setQrMode] = useState<QrMode>('theme');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let content = '';
    
    switch (qrMode) {
      case 'theme':
        content = `Stamp Theme: ${stamp.theme} - Created with Stamps For Tomorrow`;
        break;
      case 'metadata':
        content = JSON.stringify({
          id: stamp.id,
          theme: stamp.theme,
          created: new Date(stamp.timestamp).toISOString(),
          app: "Stamps For Tomorrow",
          version: "1.0"
        });
        break;
      case 'link':
        content = `https://stampsfortomorrow.app/view/${stamp.id}`;
        break;
    }

    QRCode.toDataURL(content, { width: 256, margin: 1, color: { dark: '#1a1a1a', light: '#ffffff' } }, (err, url) => {
        if (!err) setQrDataUrl(url);
    });
  }, [stamp, qrMode]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = stamp.imageUrl;
    link.download = `stamp-${stamp.theme.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || isEditing) return;

    setIsEditing(true);
    try {
      const editedImageUrl = await editStampImage(stamp.imageUrl, editPrompt);
      const newStamp: GeneratedStamp = {
        id: crypto.randomUUID(),
        imageUrl: editedImageUrl,
        theme: `${stamp.theme} (${editPrompt})`,
        timestamp: Date.now()
      };
      
      if (onEdited) {
        onEdited(newStamp);
      }
      setEditPrompt('');
    } catch (error) {
      console.error("Failed to edit stamp:", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Printable Stamp Area */}
      <div className="printable-area p-8 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center relative">
        {isEditing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in">
             <div className="p-4 bg-white rounded-full shadow-lg">
               <Wand2 className="text-[#3B82B6] animate-pulse" size={48} />
             </div>
             <p className="mt-4 text-[#3B82B6] font-semibold">Applying changes...</p>
          </div>
        )}
        <img 
            src={stamp.imageUrl} 
            alt={`Stamp: ${stamp.theme}`}
            className="w-full max-w-[300px] h-auto object-contain shadow-md print:shadow-none print:max-w-[400px] print:mb-8" 
        />
        
        {/* Content only visible when printing */}
        <div className="hidden print:flex flex-col items-center text-center gap-2">
            <h1 className="text-4xl font-serif text-gray-900">{stamp.theme}</h1>
            <div className="w-16 h-1 bg-gray-200 my-2"></div>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Stamps For Tomorrow</p>
            <p className="text-xs text-gray-400 mt-1">Generated on {new Date(stamp.timestamp).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Edit Section */}
      <div className="w-full max-w-sm no-print flex flex-col gap-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Edit this stamp</label>
        <div className="relative group">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="e.g. 'Add a retro filter' or 'Make it sunset'"
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3B82B6] rounded-2xl outline-none transition-all text-sm placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            disabled={isEditing}
          />
          <button 
            onClick={handleEdit}
            disabled={!editPrompt.trim() || isEditing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#3B82B6] text-white rounded-xl hover:bg-[#2c6590] disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap justify-center gap-4 no-print">
        <button 
            onClick={handleDownload}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group min-w-[100px]"
        >
            <div className="p-3 rounded-full bg-blue-50 text-[#3B82B6] group-hover:bg-[#3B82B6] group-hover:text-white transition-colors">
                <HardDrive size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">Save to Drive</span>
        </button>

        <button 
            onClick={() => setShowQr(!showQr)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group min-w-[100px] ${showQr ? 'bg-gray-100' : ''}`}
        >
            <div className="p-3 rounded-full bg-purple-50 text-[#A77BB5] group-hover:bg-[#A77BB5] group-hover:text-white transition-colors">
                <QrCode size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">QR Code</span>
        </button>

        <button 
            onClick={handlePrint}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group min-w-[100px]"
        >
            <div className="p-3 rounded-full bg-green-50 text-[#548C6B] group-hover:bg-[#548C6B] group-hover:text-white transition-colors">
                <Printer size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">Print</span>
        </button>
      </div>

      {/* QR Code Reveal */}
      {showQr && qrDataUrl && (
        <div className="animate-fade-in p-6 bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col items-center gap-4 no-print w-full max-w-sm">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full">
              <button 
                onClick={() => setQrMode('theme')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${qrMode === 'theme' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Type size={14} /> Theme
              </button>
              <button 
                onClick={() => setQrMode('metadata')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${qrMode === 'metadata' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FileJson size={14} /> Metadata
              </button>
              <button 
                onClick={() => setQrMode('link')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${qrMode === 'link' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LinkIcon size={14} /> Link
              </button>
            </div>

            <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl">
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
            </div>
            
            <p className="text-xs text-center text-gray-400 max-w-[250px]">
              {qrMode === 'theme' && "Scans as plain text description."}
              {qrMode === 'metadata' && "Contains JSON data with timestamp and ID."}
              {qrMode === 'link' && "Direct link to view this stamp (simulated)."}
            </p>
        </div>
      )}
    </div>
  );
};
