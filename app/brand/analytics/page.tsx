import { BarChart3 } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="INTELIGÊNCIA" title="Análises da marca" description="Investimento, alcance, conversões, volume transacionado e retorno por organização." icon={BarChart3} emptyTitle="Nenhum evento de campanha" emptyDescription="O painel não exibe números fictícios e será alimentado por eventos reais." />; }
