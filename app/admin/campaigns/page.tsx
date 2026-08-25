import { Megaphone } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="OPERAÇÕES" title="Campanhas" description="Planejamento, requisitos, criadores, entregas e resultado." icon={Megaphone} emptyTitle="Nenhuma campanha publicada" emptyDescription="Crie campanhas somente com orçamento, entregas, direitos e prazos definidos." />; }
