import React, { useState } from 'react';
import { 
  Image, 
  Settings, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Download, 
  Upload, 
  Gauge,
  FlameKindling
} from 'lucide-react';

interface ImageOptimizerProps {
  isEyeCare: boolean;
}

export const ImageOptimizerComponent: React.FC<ImageOptimizerProps> = ({ isEyeCare }) => {
  // Compression parameters
  const [quality, setQuality] = useState<'high' | 'medium' | 'ultra'>('medium');
  const [selectedMap, setSelectedMap] = useState<'tectonic' | 'history' | 'volcano'>('tectonic');
  
  // Simulated processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [wasOptimized, setWasOptimized] = useState<boolean>(true);

  // Hardcoded map values to render realistically
  const MAP_DATA = {
    tectonic: {
      name: 'Peta Lempeng Tektonik Sunda-Banda.png',
      origSize: 4250, // in KB (4.25 MB)
      origDim: '3840 x 2160 (4K)',
      optimizedSizes: { high: 412, medium: 185, ultra: 74 }, // WebP sizes in KB
      description: 'Peta geologi detail wilayah subduksi Jawa-Sumatera.',
      imgSrc: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
    },
    history: {
      name: 'Timeline_Kerajaan_Hindu_Buddha_Nusantara.jpg',
      origSize: 2840, // in KB
      origDim: '2560 x 1440 (2K)',
      optimizedSizes: { high: 280, medium: 124, ultra: 48 },
      description: 'Infografis lini masa persebaran peninggalan Mataram Kuno.',
      imgSrc: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    },
    volcano: {
      name: 'Diagram_Cincin_Api_Pasifik_Ring_Of_Fire.png',
      origSize: 5890, // in KB
      origDim: '4096 x 3072',
      optimizedSizes: { high: 520, medium: 215, ultra: 89 },
      description: 'Grafis sabuk aktif kegempaan lempeng kovergen Pasifik.',
      imgSrc: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600',
    }
  };

  const currentMap = MAP_DATA[selectedMap];
  const currentOptimizedSize = currentMap.optimizedSizes[quality];
  const directSaving = (((currentMap.origSize - currentOptimizedSize) / currentMap.origSize) * 100).toFixed(1);

  // Simulated optimization trigger
  const runOptimization = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWasOptimized(true);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* Configuration & Controls column */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Upload & Select Panel */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-inherit pb-3.5 mb-4 flex items-center gap-1.5">
            <Upload className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
            Optimizer Input Asset
          </h3>

          <div className="space-y-4">
            
            {/* Direct Drag/Drop simulated zone */}
            <div className="p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl bg-slate-50 transition-colors text-center cursor-pointer group">
              <Image className="h-8 w-8 text-slate-400 group-hover:text-emerald-500 mx-auto transition-colors mb-2" />
              <p className="text-xs font-bold text-slate-700">Unggah Gambar Sendiri</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Lepas berkas peta/bagan atau kilk untuk pilih dari komputer (JPG, PNG, TIFF)
              </p>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-extrabold uppercase tracking-widest relative">
              <span className="bg-white px-2 relative z-10">ATAU PILIH CONTOH MEDIA AJAR</span>
            </div>

            {/* Select pre-made maps preset */}
            <div className="space-y-2">
              {[
                { id: 'tectonic', label: 'Peta Sesar Tektonik Jawa' },
                { id: 'history', label: 'Timeline Kerajaan Hindu-Buddha' },
                { id: 'volcano', label: 'Diagram Ring of Fire Pasifik' }
              ].map((map) => (
                <button
                  key={map.id}
                  onClick={() => {
                    setSelectedMap(map.id as any);
                    setWasOptimized(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all duration-300 flex items-center justify-between ${
                    selectedMap === map.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{map.label}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Compression Strategy config */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-inherit pb-3.5 mb-4 flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-slate-500" />
            Parameter Kompresi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                Format Akhir Tujuan
              </label>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>WebP Teroptimasi</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                  Paling Direkomendasikan
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                Tingkat Penghematan Ruang
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'high', label: 'Balanced', desc: 'Q: 80% (Standar)' },
                  { id: 'medium', label: 'Extra Savings', desc: 'Resized 1080p' },
                  { id: 'ultra', label: 'Ultralight', desc: 'Max Hibrid' }
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setQuality(q.id as any);
                    }}
                    className={`p-2 rounded-xl text-center transition-all border duration-300 ${
                      quality === q.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-extrabold">{q.label}</p>
                    <p className={`text-[8px] mt-0.5 ${quality === q.id ? 'text-slate-200' : 'text-slate-400'}`}>{q.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={runOptimization}
              disabled={isProcessing}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Cpu className="h-4 w-4 shrink-0" />
              {isProcessing ? 'Mengoptimasi & Reduksi Piksel...' : 'Jalankan Kompresi WebP'}
            </button>

          </div>
        </div>

      </div>

      {/* Comparison results & Download Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Comparison Showcase Panel */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 outline-none ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-inherit">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Visual Perbandingan Output</h3>
              <p className="text-[10px] text-slate-400 leading-tight">Mangkas ukuran file tanpa merusak detail gambar ajar</p>
            </div>
            {wasOptimized && (
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
                Menghemat {directSaving}% Ruas Bandwidth
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Original display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-500 uppercase tracking-widest">Awal Asli Asset</span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded leading-none">
                  {(currentMap.origSize / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-150 shadow-inner">
                <img 
                  src={currentMap.imgSrc} 
                  alt="Original" 
                  className="w-full h-full object-cover grayscale" 
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-extrabold">
                  Dimensi: {currentMap.origDim}
                </div>
              </div>
            </div>

            {/* Optimized display with feedback */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  🎯 Teroptimasi (WebP)
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded leading-none">
                  {currentOptimizedSize} KB
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-200 shadow-inner ring-4 ring-emerald-50/20">
                <img 
                  src={currentMap.imgSrc} 
                  alt="Optimized" 
                  className="w-full h-full object-cover transition-all duration-300" 
                />
                <div className="absolute top-2 left-2 bg-emerald-800/85 text-white text-[9px] px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  Dimensi: 1920x1080 (Scaled)
                </div>
              </div>
            </div>

          </div>

          {/* Performance Impact analysis indicator */}
          {wasOptimized && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Performa Kecepatan Muat</p>
                <div className="flex items-baseline gap-1 mt-1 font-extrabold">
                  <span className="text-emerald-600">3.2s</span>
                  <span className="text-[#b25e29] text-[10px] mx-1">menjadi</span>
                  <span className="text-emerald-700 text-sm">0.15s</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">Menghemat kuota murid saat belajar online.</p>
              </div>

              <div className="text-left border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Efisiensi Penyimpanan</p>
                <p className="text-emerald-700 font-extrabold text-sm mt-1">{directSaving}% Penghematan</p>
                <p className="text-[9px] text-slate-400 mt-1">Mengurangi beban memori hosting internal.</p>
              </div>

              <div className="text-left border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metode Kompresi</p>
                <div className="flex items-center gap-1 text-slate-700 font-bold text-[11px] mt-1">
                  <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Chroma Subsampling Enkripsi</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">Menjaga akurasi garis peta geografi tetap tajam.</p>
              </div>

            </div>
          )}

          {/* Download Action row */}
          <div className="mt-5 pt-4 border-t border-inherit flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-none">
            <div>
              <p className="font-extrabold text-slate-700">{currentMap.name}</p>
              <p className="text-slate-400 text-[10px] mt-1">{currentMap.description}</p>
            </div>
            
            <button
              onClick={() => {
                alert(`Mengunduh berkas teroptimasi: ${currentMap.name.replace(/\.[^/.]+$/, "")}_optimized.webp (${currentOptimizedSize} KB)`);
              }}
              className="px-4.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Download className="h-4 w-4" /> Unduh Gambar WebP (Lolos Kompresi)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
