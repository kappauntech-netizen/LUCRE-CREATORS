import { Activity, BarChart3, BriefcaseBusiness, CircleDollarSign, Megaphone, Radar, UsersRound } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function AdminDashboard() {
  return (
    <section className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span>CENTRO DE CONTROLE LUCRE</span><h1>Operação em uma única visão.</h1><p>Criadores, campanhas, receita e atividade operacional reunidos com clareza.</p></div>
        <a href="/admin/campaigns" className="dashboard-primary-action"><Megaphone size={17} /> Nova campanha</a>
      </div>
      <div className="metrics-grid metrics-grid--admin">
        <MetricCard label="Criadores" detail="Total cadastrado" icon={UsersRound} accent />
        <MetricCard label="Criadores ativos" detail="Ativos na rede" icon={Activity} />
        <MetricCard label="Marcas" detail="Marcas e potenciais clientes" icon={BriefcaseBusiness} />
        <MetricCard label="Campanhas" detail="Campanhas no período" icon={Megaphone} />
        <MetricCard label="Volume transacionado" detail="Volume bruto transacionado" icon={BarChart3} />
        <MetricCard label="Receita Lucre" detail="Receita reconhecida" icon={CircleDollarSign} />
      </div>
      <div className="dashboard-grid dashboard-grid--admin">
        <article className="dashboard-panel dashboard-panel--chart">
          <div className="panel-heading"><div><span>PULSO DA REDE</span><h2>Funil de ativação</h2></div><button>Visão mensal</button></div>
          <div className="funnel-preview">
            {['Visitantes', 'Candidaturas', 'Aprovados', 'Ativados', 'Primeira campanha', 'Recorrência'].map((stage, index) => <div key={stage}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stage}</strong><b>—</b></div>)}
          </div>
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading"><div><span>ATIVIDADE EM TEMPO REAL</span><h2>Movimentos da rede</h2></div><Activity size={17} /></div>
          <EmptyState icon={Radar} title="Aguardando atividade" description="Candidaturas, aprovações e entregas aparecerão aqui em tempo real." />
        </article>
      </div>
    </section>
  );
}
