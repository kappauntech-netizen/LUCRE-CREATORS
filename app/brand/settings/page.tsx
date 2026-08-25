import { Settings } from 'lucide-react';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
export default function Page() { return <WorkspacePage eyebrow="ORGANIZAÇÃO" title="Configurações da marca" description="Dados, usuários, papéis e preferências da organização." icon={Settings} emptyTitle="Configuração da organização" emptyDescription="Somente usuários autorizados da marca terão acesso a estes dados." />; }
