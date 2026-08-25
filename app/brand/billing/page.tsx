import { ReceiptText } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="FINANCEIRO" title="Faturamento" description="Orçamentos, taxas, cobranças e documentos financeiros." icon={ReceiptText} emptyTitle="Nenhum lançamento" emptyDescription="A arquitetura financeira será ativada com o mecanismo de pagamentos." />; }
