import { useRef } from 'react';
import {
  Package, Search, ExternalLink, Camera, RefreshCw, Loader2,
  ArrowLeftRight, TrendingUp, Sparkles,
} from 'lucide-react';
import type { Product } from '../types';

type ProductFilter = 'all' | 'skincare' | 'integrators' | 'tools';

interface Props {
  isDarkMode: boolean;
  isPremium: boolean;
  products: Product[];
  filter: ProductFilter;
  setFilter: (f: ProductFilter) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  beforePhoto: string | null;
  afterPhoto: string | null;
  isAnalyzing: boolean;
  analysisResult: { symmetry: number; hydration: number; lines: number; glowUp: number } | null;
  sliderPosition: number;
  sliderRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  handleSliderMove: (clientX: number) => void;
  beforePhotoRef: React.RefObject<HTMLInputElement | null>;
  afterPhotoRef: React.RefObject<HTMLInputElement | null>;
  onBeforeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAfterUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  analyzePhotos: () => void;
}

export default function ProductsView({
  isDarkMode, isPremium, products, filter, setFilter, searchQuery, setSearchQuery,
  beforePhoto, afterPhoto, isAnalyzing, analysisResult, sliderPosition,
  sliderRef, isDragging, setIsDragging, handleSliderMove,
  beforePhotoRef, afterPhotoRef, onBeforeUpload, onAfterUpload, analyzePhotos,
}: Props) {
  const cardClass = isDarkMode ? 'bg-night-800 border-night-700' : 'bg-white border-night-100';
  const filters: { id: ProductFilter; label: string }[] = [
    { id: 'all', label: 'Tutti' }, { id: 'skincare', label: 'Skincare' },
    { id: 'integrators', label: 'Integratori' }, { id: 'tools', label: 'Tool' },
  ];

  return (
    <div className="px-5 pt-6 pb-6 space-y-5">
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Prodotti</h1>
        <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>La tua routine consigliata</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`} />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cerca prodotti..."
          className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${cardClass} ${isDarkMode ? 'text-white placeholder-night-500' : 'text-night-900 placeholder-night-300'} focus:outline-none focus:ring-2 focus:ring-sage-500`} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.id ? 'bg-sage-500 text-white' : isDarkMode ? 'bg-night-800 text-night-400' : 'bg-white text-night-500 border border-night-200'
            }`}>{f.label}</button>
        ))}
      </div>

      {/* Products list */}
      <div className="space-y-3">
        {products.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`}>Nessun prodotto trovato</p>
        ) : products.map(p => (
          <div key={p.id} className={`p-4 rounded-2xl border ${cardClass} flex items-center gap-4`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
              <Package className={`w-6 h-6 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-night-900'} truncate`}>{p.name}</p>
              <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{p.brand}</p>
              {p.daysRemaining !== undefined && (
                <div className="mt-1.5">
                  <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-100'} overflow-hidden`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-sage-500 to-emerald-500" style={{ width: `${((p.totalDays! - p.daysRemaining) / p.totalDays!) * 100}%` }} />
                  </div>
                  <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{p.daysRemaining} giorni rimasti</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{p.price.toFixed(2)}€</p>
              <a href={p.amazonUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sage-600 hover:underline mt-1">
                <ExternalLink className="w-3 h-3" /> Acquista
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Progress diary */}
      <div className={`p-5 rounded-2xl border ${cardClass}`}>
        <div className="flex items-center gap-2 mb-4">
          <Camera className={`w-5 h-5 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} />
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Diario Progressi</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <PhotoSlot label="Prima" photo={beforePhoto} isDarkMode={isDarkMode}
            inputRef={beforePhotoRef} onChange={onBeforeUpload} />
          <PhotoSlot label="Dopo" photo={afterPhoto} isDarkMode={isDarkMode}
            inputRef={afterPhotoRef} onChange={onAfterUpload} />
        </div>
        {beforePhoto && afterPhoto && !analysisResult && (
          <>
            {/* Comparison slider */}
            <div ref={sliderRef}
              className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 cursor-ew-resize select-none"
              onMouseDown={(e) => { setIsDragging(true); handleSliderMove(e.clientX); }}
              onMouseMove={(e) => isDragging && handleSliderMove(e.clientX)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => { setIsDragging(true); handleSliderMove(e.touches[0].clientX); }}
              onTouchMove={(e) => isDragging && handleSliderMove(e.touches[0].clientX)}
              onTouchEnd={() => setIsDragging(false)}>
              <img src={afterPhoto} alt="After" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                <img src={beforePhoto} alt="Before" className="absolute inset-0 h-full object-cover" style={{ width: `${sliderRef.current?.clientWidth || 100}%` }} />
              </div>
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${sliderPosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-night-700" />
                </div>
              </div>
            </div>
            <button onClick={analyzePhotos} disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]">
              {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analisi AI...</> : <><Sparkles className="w-5 h-5" /> Analizza Progressi</>}
            </button>
          </>
        )}
        {analysisResult && (
          <div className="animate-fade-in space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Simmetria" value={`${analysisResult.symmetry}%`} isDarkMode={isDarkMode} />
              <Metric label="Idratazione" value={`${analysisResult.hydration}%`} isDarkMode={isDarkMode} />
              <Metric label="Riduzione Linee" value={`${analysisResult.lines}%`} isDarkMode={isDarkMode} />
              <Metric label="Glow Up Score" value={`${analysisResult.glowUp}`} isDarkMode={isDarkMode} highlight />
            </div>
            <button onClick={analyzePhotos}
              className={`w-full py-3 rounded-2xl font-medium flex items-center justify-center gap-2 ${isDarkMode ? 'bg-night-700 text-white' : 'bg-night-100 text-night-700'}`}>
              <RefreshCw className="w-4 h-4" /> Ripeti analisi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoSlot({ label, photo, isDarkMode, inputRef, onChange }: {
  label: string; photo: string | null; isDarkMode: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div onClick={() => inputRef.current?.click()}
      className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
        photo ? 'border-sage-500' : isDarkMode ? 'border-night-600 bg-night-700' : 'border-night-200 bg-night-50'
      }`}>
      {photo ? (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img src={photo} alt={label} className="w-full h-full object-cover" />
          <span className="absolute bottom-2 left-2 text-white text-xs font-medium">{label}</span>
        </div>
      ) : (
        <>
          <Camera className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-night-500' : 'text-night-300'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-600'}`}>{label}</span>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}

function Metric({ label, value, isDarkMode, highlight }: {
  label: string; value: string; isDarkMode: boolean; highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded-2xl ${highlight ? 'bg-gradient-to-br from-sage-500 to-emerald-600' : (isDarkMode ? 'bg-night-700' : 'bg-sage-50')}`}>
      <p className={`text-xs ${highlight ? 'text-white/80' : (isDarkMode ? 'text-night-400' : 'text-night-500')}`}>{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-white' : (isDarkMode ? 'text-white' : 'text-night-900')}`}>{value}</p>
    </div>
  );
}
