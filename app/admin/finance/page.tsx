import { WalletCards } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="OPERAÇÕES FINANCEIRAS" title="Pagamentos" description="Valores pendentes, aprovados, agendados, pagos e com falha." icon={WalletCards} emptyTitle="Nenhum pagamento registrado" emptyDescription="A plataforma não cria transações fictícias. Pagamentos reais aparecerão após campanhas." />; }
