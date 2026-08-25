import { BarChart3 } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="INTELIGÊNCIA" title="Análises" description="Crescimento, aquisição, retenção, volume transacionado e desempenho de campanha." icon={BarChart3} emptyTitle="Inteligência aguardando eventos" emptyDescription="PostHog e os eventos do produto alimentarão os painéis sem métricas inventadas." />; }
