'use client';

import { Languages } from 'lucide-react';
import { localeOptions, type Locale } from '@/config/i18n';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();
  return (
    <label className={cn('language-selector', compact && 'language-selector--compact')}>
      <Languages aria-hidden="true" size={16} />
      <span className="sr-only">Selecionar idioma</span>
      <select aria-label="Selecionar idioma" value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
        {localeOptions.map((option) => <option key={option.value} value={option.value}>{compact ? option.short : option.label}</option>)}
      </select>
    </label>
  );
}
