import { UsersRound } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="REDE" title="Gestão de criadores" description="Candidaturas, perfis, pontuação, situação e histórico operacional." icon={UsersRound} emptyTitle="Nenhum criador no banco" emptyDescription="As candidaturas enviadas pelo site entrarão na fila de revisão." />; }
