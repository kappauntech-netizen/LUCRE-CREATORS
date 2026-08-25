'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { locales, translate, type Locale } from '@/config/i18n';

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const translatableAttributes = ['aria-label', 'placeholder', 'title'] as const;

function translateRaw(raw: string, locale: Locale) {
  const source = raw.trim().replace(/\s+/g, ' ');
  if (!source) return raw;
  const translated = translate(source, locale);
  if (translated === source) return raw;
  const leading = raw.match(/^\s*/)?.[0] ?? '';
  const trailing = raw.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function translateNode(root: Node, locale: Locale) {
  const translateText = (node: Text) => {
    const source = textSources.get(node) ?? node.nodeValue ?? '';
    if (!textSources.has(node)) textSources.set(node, source);
    const next = locale === 'pt-BR' ? source : translateRaw(source, locale);
    if (node.nodeValue !== next) node.nodeValue = next;
  };

  if (root.nodeType === Node.TEXT_NODE) translateText(root as Text);
  const owner = root.nodeType === Node.DOCUMENT_NODE ? (root as Document) : root.ownerDocument;
  if (!owner) return;
  const walker = owner.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const parent = current.parentElement;
    if (parent && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE'].includes(parent.tagName)) translateText(current as Text);
    current = walker.nextNode();
  }

  const elements = root instanceof Element ? [root, ...root.querySelectorAll('*')] : [];
  elements.forEach((element) => {
    let sources = attributeSources.get(element);
    if (!sources) { sources = new Map(); attributeSources.set(element, sources); }
    translatableAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      if (!sources?.has(attribute)) sources?.set(attribute, value);
      const source = sources?.get(attribute) ?? value;
      const next = locale === 'pt-BR' ? source : translate(source, locale);
      if (value !== next) element.setAttribute(attribute, next);
    });
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt-BR');

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem('lucre-locale', nextLocale);
    document.cookie = `lucre-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('lucre-locale');
    if (!stored || !locales.includes(stored as Locale)) return;
    const timer = window.setTimeout(() => setLocaleState(stored as Locale), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    translateNode(document.body, locale);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => translateNode(node, locale)));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
