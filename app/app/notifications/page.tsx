import { Bell } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="CAIXA DE ENTRADA" title="Notificações" description="Oportunidades, aprovações, prazos e pagamentos." icon={Bell} emptyTitle="Você está em dia" emptyDescription="Alertas importantes da operação Lucre serão centralizados aqui." />; }
