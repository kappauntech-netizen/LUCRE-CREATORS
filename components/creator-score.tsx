import { Progress } from '@/components/ui/progress';
import type { CSSProperties } from 'react';

export function CreatorScore({ score, label = 'PONTUAÇÃO LUCRE' }: { score: number | null; label?: string }) {
  const normalizedScore = score === null ? 0 : Math.min(100, Math.max(0, score));
  return <div className="creator-score">
    <div className="creator-score-ring" style={{ '--score': normalizedScore } as CSSProperties}><strong>{score === null ? '—' : Math.round(score)}</strong></div>
    <div className="creator-score-copy"><span>{label}</span><strong>{score === null ? 'Ainda não calculado' : `${Math.round(score)} de 100`}</strong><Progress value={normalizedScore} aria-label={score === null ? 'Pontuação ainda não calculada' : `${score} de 100`} /></div>
  </div>;
}
