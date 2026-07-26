import type {
  OnboardingAnswers,
  ProtocolActivity,
  ProtocolStackItem,
  GeneratedProtocol,
  GoalId,
} from './types';

const GOAL_LABELS: Record<GoalId, string> = {
  skincare: 'Skincare & Glow',
  posture: 'Postura & Mewing',
  focus: 'Focus & Performance',
  longevity: 'Longevità',
  energy: 'Energia & Vitalità',
  body: 'Composizione Corporea',
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function protocolScore(a: OnboardingAnswers): number {
  let base = 40;
  base += clamp(a.energyLevel, 1, 5) * 4;
  base += clamp(a.sleepQuality, 1, 5) * 4;
  base += clamp(6 - clamp(a.stressLevel, 1, 5), 1, 5) * 3;
  base += clamp(a.workoutFrequency, 0, 7) * 1.5;
  if (a.skinType) base += 4;
  base += a.secondaryGoals.length * 2;
  return Math.round(clamp(base, 35, 92));
}

export function priorities(a: OnboardingAnswers) {
  const list: { title: string; detail: string }[] = [];
  const push = (title: string, detail: string) => list.push({ title, detail });

  if (a.energyLevel <= 3)
    push("Risolvi l'energia bassa", 'Migliora sonno, luce mattutina e stabilità glicemica con colazione proteica.');
  if (a.sleepQuality <= 3)
    push("Ottimizza il recupero notturno", "Routine serale coerente, no schermi 60' prima di dormire, temperatura fresca.");
  if (a.stressLevel >= 3)
    push('Riduci lo stress cronico', 'Respiri 4-7-8, esposizione natura, limita caffeina dopo le 14.');
  if (a.goal === 'skincare')
    push('Costruisci la skincare core', 'Detersione, SPF 50 ogni mattina, retinolo serale progressivo.');
  if (a.goal === 'posture')
    push('Mewing e postura giornaliera', '10 min di mewing attivo, posture check ogni 2 ore.');
  if (a.goal === 'focus')
    push('Sistema il focus profondo', 'Blocchi di deep work 90 min, luce fredda, omega-3.');
  if (a.goal === 'longevity')
    push('Fondamenta di longevità', 'Movement quotidiano, sonno protetto, infiammazione bassa.');
  if (a.goal === 'energy')
    push("Ricarica l'energia cellulare", 'Idratazione, sole mattutino, camminate post-pasto.');
  if (a.goal === 'body')
    push('Composizione corporea', 'Proteine a target, forza 3x/sett, cammino quotidiano.');

  if (list.length < 3)
    push('Consistenza > intensità', "Il protocollo funziona se lo segui l'80% dei giorni, non il 100% perfetto.");
  if (list.length < 3)
    push('Misura e aggiusta', 'Traccia per 2 settimane, poi affina in base ai tuoi risultati.');

  return list.slice(0, 3);
}

function skincareActivities(skinType: string | undefined): ProtocolActivity[] {
  const base: ProtocolActivity[] = [
    { id: 'sk-am-cleanse', name: 'Detersione viso', duration: '1 min', xp: 10, slot: 'morning', category: 'skincare', why: 'Rimuove sebo notturno e prepone la pelle ai principi attivi.' },
    { id: 'sk-am-vitc', name: 'Siero vitamina C', duration: '1 min', xp: 12, slot: 'morning', category: 'skincare', why: 'Antiossidante che potenzia la protezione SPF.' },
    { id: 'sk-am-spf', name: 'SPF 50', duration: '1 min', xp: 15, slot: 'morning', category: 'skincare', why: 'La singola abitudini anti-aging più efficace.' },
    { id: 'sk-pm-cleanse', name: 'Doppia detersione', duration: '3 min', xp: 10, slot: 'evening', category: 'skincare', why: 'Rimuove SPF, sebo e inquinamento della giornata.' },
    { id: 'sk-pm-retinol', name: 'Retinolo (serale, a giorni alterni)', duration: '1 min', xp: 15, slot: 'evening', category: 'skincare', why: 'Stimola collagene e ricambio cellulare.' },
    { id: 'sk-pm-moist', name: 'Crema notte riparativa', duration: '1 min', xp: 10, slot: 'evening', category: 'skincare', why: 'Sigilla idratazione e sostiene la barriera cutanea.' },
  ];
  if (skinType === 'oily') {
    base.push({ id: 'sk-niacinamide', name: 'Niacinamide 10%', duration: '1 min', xp: 12, slot: 'morning', category: 'skincare', why: 'Regola la produzione di sebo.' });
  }
  if (skinType === 'dry') {
    base.push({ id: 'sk-hydrate', name: 'Acido ialuronico', duration: '1 min', xp: 12, slot: 'morning', category: 'skincare', why: 'Attira idratazione negli strati cutanei.' });
  }
  return base;
}

export function generateProtocol(a: OnboardingAnswers): GeneratedProtocol {
  const activities: ProtocolActivity[] = [];
  const stack: ProtocolStackItem[] = [];

  // Universal morning anchors
  activities.push(
    { id: 'un-sunlight', name: 'Luce solare 10 min', duration: '10 min', xp: 15, slot: 'morning', category: 'habit', why: 'Sincronizza il ritmo circadiano e migliora il sonno della notte successiva.' },
    { id: 'un-hydrate', name: '500 ml acqua + elettroliti', duration: '2 min', xp: 10, slot: 'morning', category: 'nutrition', why: "Ripristina l'idratazione dopo 7-9 ore senza liquidi." },
    { id: 'un-protein', name: 'Colazione proteica (30g+)', duration: '15 min', xp: 15, slot: 'morning', category: 'nutrition', why: 'Stabilizza glicemia e caffeina, riduce fame serale.' },
  );

  // Movement
  if (a.workoutFrequency >= 3) {
    activities.push({ id: 'mv-walk-post', name: 'Camminata 10 min post-pranzo', duration: '10 min', xp: 12, slot: 'afternoon', category: 'movement', why: 'Appiattisce la glicemia post-pasto del 30%.' });
  } else {
    activities.push({ id: 'mv-daily-walk', name: 'Camminata 20 min', duration: '20 min', xp: 15, slot: 'afternoon', category: 'movement', why: 'Il movimento più accessibile per composizione corporea e umore.' });
  }

  // Goal-specific
  if (a.goal === 'skincare' || a.secondaryGoals.includes('skincare')) {
    activities.push(...skincareActivities(a.skinType));
    stack.push(
      { id: 'st-spf', name: 'SPF 50 viso', type: 'habit', timing: 'Ogni mattina, rinnovata se esposto al sole', note: 'Protezione anti-aging #1.', safety: 'Rinnova ogni 2 ore con esposizione diretta.' },
      { id: 'st-retinol', name: 'Retinolo 0.3%', type: 'habit', timing: 'Sera, a giorni alterni', note: 'Inizia 2x/sett e sali gradualmente.', safety: "Evita in gravidanza. Può irritare all'inizio.", consultPro: true },
    );
  }

  if (a.goal === 'posture' || a.secondaryGoals.includes('posture')) {
    activities.push(
      { id: 'po-mewing', name: 'Mewing attivo 10 min', duration: '10 min', xp: 15, slot: 'morning', category: 'habit', why: 'Riposiziona lingua e mascella nel pattern neutro.' },
      { id: 'po-check', name: 'Posture check (allunga ogni 2h)', duration: '2 min', xp: 10, slot: 'afternoon', category: 'habit', why: 'Riduce tensione cervicale e forward head posture.' },
      { id: 'po-stretch', name: 'Allungamento petto + collo', duration: '5 min', xp: 12, slot: 'evening', category: 'movement', why: 'Inversione della postura da scrivania.' },
    );
    stack.push({ id: 'st-mewing', name: 'Mewing routine', type: 'habit', timing: 'Mattina + check serale', note: 'Lingua sul palato, respirazione nasale.', safety: 'Esercizio posturale, non sostituisce un consulto odontoiatrico.' });
  }

  if (a.goal === 'focus' || a.secondaryGoals.includes('focus')) {
    activities.push(
      { id: 'fo-deep', name: 'Deep work block 90 min', duration: '90 min', xp: 25, slot: 'morning', category: 'habit', why: 'La finestra cognitiva più alta è nelle prime 4 ore.' },
      { id: 'fo-walk', name: 'Walk & think 15 min', duration: '15 min', xp: 12, slot: 'afternoon', category: 'movement', why: 'Camminare facilita pensiero divergente e creativo.' },
    );
    stack.push(
      { id: 'st-omega3', name: 'Omega-3 (EPA+DHA 1g+)', type: 'supplement', timing: 'Con un pasto grasso', note: 'Supporta membrana neuronale e umore.', safety: 'Consulta il medico se in terapia anticoagulante.', consultPro: true },
    );
  }

  if (a.goal === 'longevity' || a.secondaryGoals.includes('longevity')) {
    activities.push(
      { id: 'lo-z2', name: 'Cardio Zona 2 (30 min)', duration: '30 min', xp: 20, slot: 'afternoon', category: 'movement', why: 'Migliora mitocondri e longevità metabolica.' },
    );
    stack.push(
      { id: 'st-creatine', name: 'Creatina monoidrato 3-5g', type: 'supplement', timing: 'Ogni giorno, con carboidrati', note: 'Cervello e forza, sicuro a dosi standard.', safety: 'Bevi acqua adeguata.', consultPro: true },
    );
  }

  if (a.goal === 'energy' || a.secondaryGoals.includes('energy')) {
    activities.push(
      { id: 'en-breath', name: 'Respiri 4-7-8 (3 cicli)', duration: '3 min', xp: 10, slot: 'evening', category: 'recovery', why: 'Attiva il sistema parasimpatico prima del sonno.' },
    );
    stack.push(
      { id: 'st-electrolytes', name: 'Elettroliti mattutini', type: 'nutrition', timing: 'Al risveglio in acqua', note: 'Sodio, potassio, magnesio per energia stabile.' },
    );
  }

  if (a.goal === 'body' || a.secondaryGoals.includes('body')) {
    activities.push(
      { id: 'bo-protein', name: 'Proteine a target (1.6g/kg)', duration: 'tutto il giorno', xp: 15, slot: 'morning', category: 'nutrition', why: 'Base per composizione corporea e massa magra.' },
      { id: 'bo-strength', name: 'Forza 3x/sett', duration: '45 min', xp: 25, slot: 'afternoon', category: 'movement', why: 'Il segnale più forte per mantenere muscolo.' },
    );
    stack.push(
      { id: 'st-protein', name: 'Proteine in polvere', type: 'supplement', timing: 'Post-allenamento o come spuntino', note: 'Conveniente per raggiungere il target proteico.' },
    );
  }

  // Evening anchors — sleep hygiene
  if (a.sleepQuality <= 3) {
    activities.push(
      { id: 'un-screens-off', name: "Schermi off 60' prima di dormire", duration: '60 min', xp: 15, slot: 'evening', category: 'recovery', why: 'La luce blu ritarda la melatonina di 90+ minuti.' },
      { id: 'un-cool-room', name: 'Camera 18-19°C', duration: '1 min', xp: 8, slot: 'evening', category: 'recovery', why: 'La temperatura fresca segnala al corpo che è notte.' },
    );
  } else {
    activities.push({ id: 'un-winddown', name: 'Wind-down routine', duration: '15 min', xp: 10, slot: 'evening', category: 'recovery', why: 'Segnale coerente al cervello che inizia il sonno.' });
  }

  // Magnesium for everyone + stress
  stack.push({
    id: 'st-magnesium',
    name: 'Magnesio glicinato 200-400mg',
    type: 'supplement',
    timing: 'Sera, 30-60 min prima di dormire',
    note: 'Rilassa muscoli e sistema nervoso, migliora qualità del sonno.',
    safety: 'Consulta il medico se prendi antibiotici quinolonici o in gravidanza.',
    consultPro: true,
  });

  if (a.stressLevel >= 3) {
    stack.push({ id: 'st-ashwagandha', name: 'Ashwagandha (adattogeno)', type: 'supplement', timing: 'Sera, cicla 8 sett on / 4 off', note: 'Può abbassare cortisolo percepito.', safety: 'Evita in gravidanza o con tiroide iper.', consultPro: true });
  }

  const score = protocolScore(a);
  return {
    score,
    priorities: priorities(a),
    activities,
    stack: dedupeStack(stack),
  };
}

function dedupeStack(items: ProtocolStackItem[]): ProtocolStackItem[] {
  const seen = new Set<string>();
  const out: ProtocolStackItem[] = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
}

export function levelFromXp(xp: number) {
  if (xp >= 3000) return { level: 5, name: 'Maestro Longevità', nextXp: 5000, progress: ((xp - 3000) / 2000) * 100 };
  if (xp >= 1500) return { level: 4, name: 'BioHacker Elite', nextXp: 3000, progress: ((xp - 1500) / 1500) * 100 };
  if (xp >= 700) return { level: 3, name: 'Esperto', nextXp: 1500, progress: ((xp - 700) / 800) * 100 };
  if (xp >= 300) return { level: 2, name: 'Costante', nextXp: 700, progress: ((xp - 300) / 400) * 100 };
  return { level: 1, name: 'Novizio', nextXp: 300, progress: (xp / 300) * 100 };
}

export function estimateImprovement(adherence: number) {
  return {
    energy: Math.round(adherence * 0.4 + 8),
    sleep: Math.round(adherence * 0.35 + 6),
    glow: Math.round(adherence * 0.5 + 10),
    focus: Math.round(adherence * 0.3 + 7),
  };
}

export { GOAL_LABELS };
