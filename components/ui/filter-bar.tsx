import { SlidersHorizontal } from 'lucide-react';

export function FilterBar({ children, resultLabel }: { children: React.ReactNode; resultLabel?: string }) {
  return <div className="ui-filter-bar"><div><SlidersHorizontal size={16} /><strong>Filtros</strong>{children}</div>{resultLabel && <span>{resultLabel}</span>}</div>;
}
