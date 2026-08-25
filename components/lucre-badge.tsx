import { Badge } from '@/components/ui/badge';
import { BadgeCheck } from 'lucide-react';

export function LucreBadge({ children = 'VERIFICADO PELA LUCRE' }: { children?: React.ReactNode }) {
  return <Badge className="lucre-badge"><BadgeCheck size={13} />{children}</Badge>;
}
