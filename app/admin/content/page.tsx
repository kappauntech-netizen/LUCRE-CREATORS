import { FileCheck2 } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="CONTROLE DE QUALIDADE" title="Revisão de conteúdo" description="Fila central de aprovação e solicitação de ajustes." icon={FileCheck2} emptyTitle="Fila de revisão vazia" emptyDescription="Conteúdos enviados pelos criadores aparecerão associados à campanha." />; }
