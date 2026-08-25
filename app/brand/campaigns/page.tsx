import { Megaphone } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="CAMPANHAS" title="Campanhas da marca" description="Rascunhos, publicações, seleção, execução e fechamento." icon={Megaphone} emptyTitle="Nenhuma campanha criada" emptyDescription="A criação real será implementada no mecanismo de campanhas, após a fundação ser aprovada." />; }
