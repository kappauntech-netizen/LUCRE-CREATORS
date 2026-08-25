import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Radar,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

const creatorCards = [
  { initials: '01', handle: 'Criador selecionado', niche: 'Beleza · Ao vivo' },
  { initials: '02', handle: 'Criador selecionado', niche: 'Tecnologia · Conteúdo' },
  { initials: '03', handle: 'Criador selecionado', niche: 'Moda · Vídeo' },
];

const journey = [
  ['01', 'Crie seu perfil', 'Apresente sua identidade, conteúdo, audiência e objetivos comerciais.'],
  ['02', 'Seja descoberto', 'Entre no radar de marcas que combinam com o seu posicionamento.'],
  ['03', 'Acesse oportunidades', 'Candidate-se a campanhas com planejamento, escopo e remuneração claros.'],
  ['04', 'Entregue e receba', 'Centralize conteúdo, aprovação, resultado e acompanhamento financeiro.'],
  ['05', 'Construa seu negócio', 'Transforme desempenho em reputação, recorrência e crescimento.'],
];

export default function Home() {
  return (
    <main className="site-shell">
      <PublicHeader />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-glow hero-glow--one" aria-hidden="true" />
        <div className="hero-glow hero-glow--two" aria-hidden="true" />

        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Rede de comércio com criadores</div>
          <h1 id="hero-title">Transforme influência<span>em negócios.</span></h1>
          <p>
            A rede que conecta criadores selecionados, marcas e oportunidades para
            transformar influência em crescimento mensurável.
          </p>
          <div className="hero-actions">
            <Link href="/apply" className="button button--gradient">Quero ser criador <ArrowUpRight size={18} /></Link>
            <Link href="/brands" className="button button--ghost"><BriefcaseBusiness size={18} /> Sou uma marca</Link>
          </div>
          <div className="hero-note"><span className="status-dot" /> Candidaturas para a rede fundadora em breve</div>
        </div>

        <div className="creator-stage" aria-label="Prévia visual da experiência Lucre Creators">
          <div className="preview-label">PRÉVIA VISUAL</div>
          <div className="orbit orbit--outer" aria-hidden="true" />
          <div className="orbit orbit--inner" aria-hidden="true" />
          <div className="stage-badge"><span>LUCRE</span><strong>REDE</strong></div>
          {creatorCards.map((creator, index) => (
            <article className={`creator-card creator-card--${index + 1}`} key={creator.initials}>
              <div className="creator-avatar"><span>{creator.initials}</span></div>
              <div><strong>{creator.handle}</strong><small>{creator.niche}</small></div>
              <ArrowUpRight size={16} />
            </article>
          ))}
          <div className="signal-card signal-card--top">
            <span className="signal-icon"><Sparkles size={15} /></span>
            <div><small>DESCUBRA</small><strong>Perfil verificado</strong></div>
          </div>
          <div className="signal-card signal-card--bottom">
            <span className="signal-pulse" />
            <div><small>AO VIVO</small><strong>Nova oportunidade</strong></div>
          </div>
        </div>
      </section>

      <div className="trust-rail" aria-label="Proposta de valor">
        <span>DESCOBERTA</span><i /><span>OPORTUNIDADE</span><i /><span>DESEMPENHO</span><i /><span>CRESCIMENTO</span>
      </div>

      <section className="network-section" id="creators">
        <div className="section-heading">
          <span>01 · A REDE</span>
          <h2>Talento chama atenção.<br /><em>Desempenho constrói valor.</em></h2>
          <p>A Lucre seleciona criadores com identidade, consistência e potencial comercial — não apenas números de seguidores.</p>
        </div>
        <div className="selection-grid">
          <article className="selection-card selection-card--wide">
            <div className="selection-icon"><Radar /></div>
            <span>MOTOR DE DESCOBERTA</span>
            <h3>Criadores certos para oportunidades reais.</h3>
            <p>Perfil, conteúdo, nicho, audiência e histórico de desempenho reunidos em uma visão profissional.</p>
            <div className="radar-visual" aria-hidden="true"><i /><i /><i /><span /></div>
          </article>
          <article className="selection-card">
            <div className="selection-icon"><UserRoundCheck /></div>
            <span>SELEÇÃO</span>
            <h3>Curadoria antes da escala.</h3>
            <p>Cada candidatura passa por análise. A rede cresce com qualidade e confiança.</p>
          </article>
          <article className="selection-card selection-card--gradient">
            <div className="selection-icon"><BarChart3 /></div>
            <span>DESEMPENHO</span>
            <h3>Reputação baseada no que você entrega.</h3>
            <p>Qualidade, pontualidade e resultado constroem a sua pontuação Lucre.</p>
          </article>
        </div>
      </section>

      <section className="journey-section" id="como-funciona">
        <div className="section-heading section-heading--compact">
          <span>02 · SEU NEGÓCIO COMO CRIADOR</span>
          <h2>Um caminho simples.<br /><em>Uma carreira mais profissional.</em></h2>
        </div>
        <div className="journey-list">
          {journey.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ArrowRight aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="brands-section" id="marcas">
        <div className="brand-orbit" aria-hidden="true"><i /><i /><span>ADERÊNCIA</span></div>
        <div className="brands-copy">
          <span>03 · PARA MARCAS</span>
          <h2>Encontre criadores<br /><em>que realmente entregam resultado.</em></h2>
          <p>
            Menos busca aleatória. Mais curadoria, operação e inteligência para conectar cada campanha ao criador com maior potencial de aderência.
          </p>
          <Link href="/brands" className="button button--light">Falar com a Lucre <ArrowUpRight size={18} /></Link>
        </div>
        <div className="brand-feature-list">
          <article><Radar /><div><strong>Compatibilidade orientada por dados</strong><span>Regras claras hoje. Inteligência proprietária amanhã.</span></div></article>
          <article><BriefcaseBusiness /><div><strong>Operação centralizada</strong><span>Planejamento, seleção, entrega e aprovação em um só fluxo.</span></div></article>
          <article><CircleDollarSign /><div><strong>Desempenho mensurável</strong><span>Aprendizado de campanha que melhora a próxima decisão.</span></div></article>
        </div>
      </section>

      <section className="final-cta">
        <span className="eyebrow"><Sparkles size={15} /> REDE FUNDADORA</span>
        <h2>Sua influência<br /><em>é um ativo.</em></h2>
        <p>Entre para a rede que trata a sua influência como negócio.</p>
        <Link href="/apply" className="button button--gradient">Quero fazer parte <ArrowUpRight size={18} /></Link>
      </section>

      <PublicFooter />
    </main>
  );
}
