import { ArrowUpRight, BarChart3, BriefcaseBusiness, CircleDollarSign, Megaphone, Radar, UsersRound } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function BrandDashboard() {
  return (
    <section className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span>ÁREA DA MARCA</span><h1>Comércio com criadores sob controle.</h1><p>Campanhas, criadores, investimento e desempenho em uma visão isolada por organização.</p></div>
        <a href="/brand/campaigns/new" className="dashboard-primary-action"><Megaphone size={17} /> Criar campanha <ArrowUpRight size={16} /></a>
      </div>
      <div className="metrics-grid metrics-grid--creator">
        <MetricCard label="Campanhas ativas" detail="Nenhuma campanha ativa" icon={BriefcaseBusiness} accent />
        <MetricCard label="Criadores" detail="Criadores contratados" icon={UsersRound} />
        <MetricCard label="Investimento total" detail="Investimento reconhecido" icon={CircleDollarSign} />
        <MetricCard label="Desempenho" detail="Após a primeira campanha" icon={BarChart3} />
      </div>
      <div className="dashboard-grid dashboard-grid--main">
        <article className="dashboard-panel dashboard-panel--chart">
          <div className="panel-heading"><div><span>DESEMPENHO DA CAMPANHA</span><h2>Da distribuição ao resultado.</h2></div><button>Últimos 30 dias</button></div>
          <div className="chart-empty"><div className="chart-grid" aria-hidden="true"><i /><i /><i /><i /><span /></div><p>Dados reais aparecerão quando a organização publicar sua primeira campanha.</p></div>
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading"><div><span>COMPATIBILIDADE DE CRIADORES</span><h2>Recomendações</h2></div><Radar size={17} /></div>
          <EmptyState icon={Radar} title="Planejamento antes da seleção" description="Crie uma campanha para iniciar a curadoria de criadores baseada em regras." />
        </article>
      </div>
    </section>
  );
}
