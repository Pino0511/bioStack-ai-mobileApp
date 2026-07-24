import { useRef } from 'react';
import {
  Sun, Moon, CheckCircle2, Clock, Zap, TrendingUp, Flame,
  Scan, Upload, Shield, Sparkles, Brain, Target, User, Package,
} from 'lucide-react';
import type { Activity, FacialReport, LevelInfo } from '../types';

type RoutineTab = 'morning' | 'evening';

interface Props {
  isDarkMode: boolean;
  isPremium: boolean;
  todayDate: string;
  activeTab: RoutineTab;
  setActiveTab: (t: RoutineTab) => void;
  currentActivities: Activity[];
  completedCount: number;
  toggleActivity: (id: string, isMorning: boolean) => void;
  xpPoints: number;
  levelInfo: LevelInfo;
  streak: number;
  frontImage: string | null;
  profileImage: string | null;
  isScanning: boolean;
  scanProgress: number;
  facialReport: FacialReport | null;
  showBiometricOverlay: boolean;
  frontImageRef: React.RefObject<HTMLInputElement | null>;
  profileImageRef: React.RefObject<HTMLInputElement | null>;
  onFrontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startScan: () => void;
}

export default function HomeView({
  isDarkMode, isPremium, todayDate, activeTab, setActiveTab,
  currentActivities, completedCount, toggleActivity, xpPoints,
  levelInfo, streak, frontImage, profileImage, isScanning,
  scanProgress, facialReport, showBiometricOverlay,
  frontImageRef, profileImageRef, onFrontUpload, onProfileUpload, startScan,
}: Props) {
  const cardClass = isDarkMode ? 'bg-night-800 border-night-700' : 'bg-white border-night-100';
  const progressPct = (completedCount / currentActivities.length) * 100;

  return (
    <div className="px-5 pt-6 pb-6 space-y-5">
      {/* Date + progress hero */}
      <div>
        <p className={`text-sm capitalize ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{todayDate}</p>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'} mt-0.5`}>La tua routine</h1>
      </div>

      <div className={`rounded-3xl p-5 bg-gradient-to-br ${activeTab === 'morning' ? 'from-amber-400 to-orange-500' : 'from-indigo-500 to-purple-600'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {activeTab === 'morning' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            <span className="text-white font-bold">Routine {activeTab === 'morning' ? 'Mattina' : 'Sera'}</span>
          </div>
          <span className="text-white/90 text-sm font-medium">{completedCount}/{currentActivities.length}</span>
        </div>
        <div className="h-2 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="text-white/90 text-xs mt-2">
          {progressPct === 100 ? 'Completata! +XP guadagnati' : `${currentActivities.length - completedCount} attività rimaste`}
        </p>
      </div>

      {/* Tab switcher */}
      <div className={`flex p-1 rounded-2xl ${isDarkMode ? 'bg-night-800' : 'bg-night-100'}`}>
        {(['morning', 'evening'] as RoutineTab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab ? (isDarkMode ? 'bg-night-600 text-white' : 'bg-white text-night-900 shadow-sm') : (isDarkMode ? 'text-night-400' : 'text-night-500')
            }`}>
            {tab === 'morning' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {tab === 'morning' ? 'Mattina' : 'Sera'}
          </button>
        ))}
      </div>

      {/* Activities */}
      <div className="space-y-2.5">
        {currentActivities.map((act) => (
          <button key={act.id} onClick={() => toggleActivity(act.id, activeTab === 'morning')}
            className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition-all text-left ${cardClass} ${
              act.completed ? 'ring-2 ring-sage-500' : ''
            } active:scale-[0.99]`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              act.completed ? 'bg-sage-500' : isDarkMode ? 'bg-night-700' : 'bg-night-100'
            }`}>
              {act.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${act.completed ? 'text-sage-500' : (isDarkMode ? 'text-white' : 'text-night-900')}`}>{act.name}</p>
              {act.duration && (
                <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
                  <Clock className="w-3 h-3" /> {act.duration}
                </p>
              )}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDarkMode ? 'bg-sage-900/40 text-sage-400' : 'bg-sage-50 text-sage-600'}`}>
              +{act.xp} XP
            </span>
          </button>
        ))}
      </div>

      {/* Gamification stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl text-center ${cardClass}`}>
          <Zap className="w-5 h-5 text-sage-500 mx-auto mb-1" />
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{xpPoints}</p>
          <p className={`text-[10px] ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>XP Totali</p>
        </div>
        <div className={`p-4 rounded-2xl text-center ${cardClass}`}>
          <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{streak}</p>
          <p className={`text-[10px] ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Streak (gg)</p>
        </div>
        <div className={`p-4 rounded-2xl text-center ${cardClass}`}>
          <TrendingUp className="w-5 h-5 text-sage-500 mx-auto mb-1" />
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{levelInfo.level}</p>
          <p className={`text-[10px] ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Livello</p>
        </div>
      </div>

      {/* Level progress */}
      <div className={`p-4 rounded-2xl ${cardClass}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{levelInfo.name}</span>
          <span className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{levelInfo.nextXp} XP al prossimo</span>
        </div>
        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-100'} overflow-hidden`}>
          <div className="h-full rounded-full bg-gradient-to-r from-sage-500 to-emerald-500 transition-all duration-500" style={{ width: `${Math.min(levelInfo.progress, 100)}%` }} />
        </div>
      </div>

      {/* Biometric scan */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Scan className={`w-5 h-5 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} />
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Scansione Biometrica</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <PhotoUpload label="Frontale" image={frontImage} isDarkMode={isDarkMode}
            inputRef={frontImageRef} onChange={onFrontUpload} icon="front" />
          <PhotoUpload label="Profilo" image={profileImage} isDarkMode={isDarkMode}
            inputRef={profileImageRef} onChange={onProfileUpload} icon="profile" />
        </div>
        <button onClick={startScan} disabled={!frontImage || !profileImage || isScanning}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            frontImage && profileImage && !isScanning
              ? 'bg-gradient-to-r from-sage-500 to-emerald-500 text-white hover:shadow-lg active:scale-[0.98]'
              : isDarkMode ? 'bg-night-700 text-night-500' : 'bg-night-100 text-night-400'
          } disabled:cursor-not-allowed`}>
          {isScanning ? <><Brain className="w-5 h-5 animate-pulse" /> Analisi...</> : <><Scan className="w-5 h-5" /> Avvia Scansione</>}
        </button>
        <div className={`flex items-center justify-center gap-2 mt-2 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`}>
          <Shield className="w-4 h-4" />
          <span className="text-xs">Elaborazione privata</span>
        </div>
      </div>

      {/* Scanning overlay */}
      {showBiometricOverlay && frontImage && (
        <div className={`p-4 rounded-2xl ${cardClass}`}>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
            <img src={frontImage} alt="Scan" className="w-full h-full object-cover" />
            <div className="absolute inset-0 biometric-grid" />
            <div className="scan-line" />
            {[{ t: '30%', l: '45%' }, { t: '40%', l: '35%' }, { t: '40%', l: '55%' }, { t: '60%', l: '40%' }, { t: '60%', l: '50%' }, { t: '75%', l: '45%' }].map((p, i) => (
              <div key={i} className="facial-point" style={{ top: p.t, left: p.l }} />
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: 'Forma Viso', p: 0.25 }, { label: 'Simmetria', p: 0.5 },
              { label: 'Mascella', p: 0.75 }, { label: 'Raccomandazioni', p: 1.0 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${scanProgress >= s.p ? 'bg-sage-500' : isDarkMode ? 'bg-night-700' : 'bg-night-100'}`}>
                  {scanProgress >= s.p && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${scanProgress >= s.p ? (isDarkMode ? 'text-white' : 'text-night-900') : (isDarkMode ? 'text-night-500' : 'text-night-400')}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facial report */}
      {facialReport && !showBiometricOverlay && (
        <div className={`p-4 rounded-2xl ${cardClass} animate-fade-in`}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-sage-500" />
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Analisi Completata</h3>
            {!isPremium && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Anteprima</span>}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Forma Viso</p>
              <p className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.faceShape}</p>
            </div>
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Simmetria</p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.symmetry}%</p>
            </div>
          </div>
          {isPremium ? (
            <div className="space-y-3">
              <ReportSection title="Capelli" value={facialReport.hairRecommendation} reason={facialReport.hairReason} isDarkMode={isDarkMode} icon={<User className="w-4 h-4" />} />
              <ReportSection title="Barba" value={facialReport.beardRecommendation} reason={facialReport.beardReason} isDarkMode={isDarkMode} icon={<Target className="w-4 h-4" />} />
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-night-400' : 'text-night-500'} mb-1`}>Occhiali consigliati</p>
                <div className="flex gap-2 mb-2">
                  {facialReport.eyewearStyles.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-night-600 text-night-200' : 'bg-white text-night-700'}`}>{s}</span>
                  ))}
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{facialReport.eyewearRecommendation}</p>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-night-700' : 'bg-amber-50'}`}>
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Sblocca il report completo</p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Capelli, barba e occhiali personalizzati</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PhotoUpload({ label, image, isDarkMode, inputRef, onChange, icon }: {
  label: string; image: string | null; isDarkMode: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: 'front' | 'profile';
}) {
  return (
    <div onClick={() => inputRef.current?.click()}
      className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
        image ? 'border-sage-500' : isDarkMode ? 'border-night-600 bg-night-800' : 'border-night-200 bg-white'
      }`}>
      {image ? (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium">{label}</span>
          </div>
        </div>
      ) : (
        <>
          <Upload className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-night-500' : 'text-night-300'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-night-400' : 'text-night-600'}`}>{label}</span>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}

function ReportSection({ title, value, reason, isDarkMode, icon }: {
  title: string; value: string; reason: string; isDarkMode: boolean; icon: React.ReactNode;
}) {
  return (
    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className={`text-xs font-medium ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{title}</p>
      </div>
      <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{value}</p>
      <p className={`text-xs ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{reason}</p>
    </div>
  );
}
