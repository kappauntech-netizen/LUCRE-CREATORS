import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT } from '@/config/product';

export function BrandLockup({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn('brand-lockup', compact && 'brand-lockup--compact')} aria-label={`${PRODUCT.name} — início`}>
      <Image className="brand-lucre-logo" src="/lucre-logo.svg" alt="Lucre" width={156} height={39} priority />
      <span className="brand-separator">/</span>
      <span className="brand-creators">CREATORS</span>
    </Link>
  );
}
