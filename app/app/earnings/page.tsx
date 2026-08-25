import { CircleDollarSign } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="FINANCEIRO" title="Ganhos" description="Valores disponíveis, pendentes e histórico." icon={CircleDollarSign} emptyTitle="Nenhum lançamento financeiro" emptyDescription="Pagamentos aprovados e agendados serão exibidos com rastreabilidade." />; }
