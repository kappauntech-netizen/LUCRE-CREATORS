import { BarChart3 } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="INTELIGÊNCIA" title="Análises" description="Visualizações, envolvimento, cliques, conversões e receita." icon={BarChart3} emptyTitle="Desempenho ainda sem dados" emptyDescription="Os indicadores serão calculados a partir de campanhas e integrações reais." />; }
