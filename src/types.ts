export interface Activity {
  id: string;
  name: string;
  duration?: string;
  completed: boolean;
  xp: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'skincare' | 'integrators' | 'tools';
  amazonUrl: string;
  daysRemaining?: number;
  totalDays?: number;
}

export interface GlowUpData {
  week: number;
  score: number;
  date: Date;
}

export interface FacialReport {
  faceShape: 'oval' | 'square' | 'diamond' | 'heart' | 'round' | 'oblong';
  symmetry: number;
  jawAngle: number;
  skinQuality: 'excellent' | 'good' | 'fair' | 'needs_attention';
  hairRecommendation: string;
  hairReason: string;
  beardRecommendation: string;
  beardReason: string;
  eyewearRecommendation: string;
  eyewearStyles: string[];
  glowUpScore: number;
}

export interface LevelInfo {
  level: number;
  name: string;
  nextXp: number;
  progress: number;
}

export function getLevelInfo(xp: number): LevelInfo {
  if (xp >= 3000) return { level: 5, name: 'Maestro Longevità', nextXp: 5000, progress: ((xp - 3000) / 2000) * 100 };
  if (xp >= 1500) return { level: 4, name: 'BioHacker Elite', nextXp: 3000, progress: ((xp - 1500) / 1500) * 100 };
  if (xp >= 700) return { level: 3, name: 'Esperto Pelle', nextXp: 1500, progress: ((xp - 700) / 800) * 100 };
  if (xp >= 300) return { level: 2, name: 'Apprendista', nextXp: 700, progress: ((xp - 300) / 400) * 100 };
  return { level: 1, name: 'Novizio', nextXp: 300, progress: (xp / 300) * 100 };
}

export function formatCountdown(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
