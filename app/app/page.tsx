import { ArrowUpRight, BarChart3, BellRing, BriefcaseBusiness, CircleDollarSign, Clock3, Compass, Sparkles } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function CreatorDashboard() {
  return (
    <section className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span>BOM DIA</span><h1>Seu negócio como criador.</h1><p>O que importa para sua operação, reunido em uma visão clara.</p></div>
        <a href="/app/opportunities" className="dashboard-primary-action"><Compass size={17} /> Explorar oportunidades <ArrowUpRight size={16} /></a>
      </div>
      <div className="metrics-grid metrics-grid--creator">
        <MetricCard label="Oportunidades disponíveis" detail="Aguardando oportunidades reais" icon={Compass} accent />
        <MetricCard label="Campanhas ativas" detail="Nenhuma campanha ativa" icon={BriefcaseBusiness} />
        <MetricCard label="Ganhos neste mês" detail="Conectado aos pagamentos" icon={CircleDollarSign} />
        <MetricCard label="Desempenho" detail="Dados após a primeira campanha" icon={BarChart3} />
      </div>
      <div className="dashboard-grid dashboard-grid--main">
        <article className="dashboard-panel dashboard-panel--chart">
          <div className="panel-heading"><div><span>VISÃO DO DESEMPENHO</span><h2>Seu crescimento em um só lugar.</h2></div><button>Últimos 30 dias</button></div>
          <div className="chart-empty"><div className="chart-grid" aria-hidden="true"><i /><i /><i /><i /><span /></div><p>O gráfico será ativado quando houver dados reais de campanha.</p></div>
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading"><div><span>A SEGUIR</span><h2>Próximas ações</h2></div><Clock3 size={17} /></div>
          <EmptyState icon={BellRing} title="Tudo em dia" description="Prazos, aprovações e entregas aparecerão aqui." />
        </article>
      </div>
      <article className="dashboard-panel">
        <div className="panel-heading"><div><span>RECOMENDADO</span><h2>Oportunidades para o seu perfil</h2></div><Sparkles size={17} /></div>
        <EmptyState icon={Compass} title="Sua próxima oportunidade começa pelo perfil" description="Complete suas informações para que a equipe Lucre possa recomendar oportunidades com maior aderência." action="Completar perfil" />
      </article>
    </section>
  );
}
