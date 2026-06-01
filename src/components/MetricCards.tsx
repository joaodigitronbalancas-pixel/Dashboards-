import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Scale, 
  Target, 
  Sparkles,
  Users,
  Percent,
  CheckCircle2,
  Clock3
} from 'lucide-react';
import { SectorType } from '../types';

interface MetricCardsProps {
  sector: SectorType;
  data: any; // Dynamic response from backend
  isDarkMode: boolean;
}

export default function MetricCards({ sector, data, isDarkMode }: MetricCardsProps) {
  if (!data) return null;

  // Number currency and formatting helpers
  const fmtBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };
  const fmtPct = (val: number) => `${val}%`;
  const fmtNum = (val: number) => new Intl.NumberFormat('pt-BR').format(val);

  // Derive static target status/growth stats based on active simulated sector
  const getSectoredCards = () => {
    switch (sector) {
      case 'COMERCIAL':
        return [
          {
            title: 'Faturamento Bruto',
            value: fmtBRL(data.revenue),
            badge: '+12.4%',
            positive: true,
            icon: TrendingUp,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: `Meta global: ${fmtBRL(data.revenueGoal)}`
          },
          {
            title: 'Ticket Médio',
            value: fmtBRL(data.averageTicket),
            badge: '-2.4%',
            positive: false,
            icon: Scale,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            desc: 'Foco em upselling ativo'
          },
          {
            title: 'Conversão de Leads',
            value: fmtPct(data.conversionRate),
            badge: '+1.8%',
            positive: true,
            icon: Percent,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'SQL para Propostas fechadas'
          },
          {
            title: 'Progresso da Meta',
            value: '107%',
            badge: 'Dentro',
            positive: true,
            icon: Target,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            desc: 'Meta acumulada do trimestre'
          }
        ];

      case 'FINANCEIRO':
        return [
          {
            title: 'Receita Operacional',
            value: fmtBRL(data.revenue),
            badge: '+7.4%',
            positive: true,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Liquidez total no mês'
          },
          {
            title: 'Despesas Consold.',
            value: fmtBRL(data.expenses),
            badge: '+8.3%',
            positive: false, // Expenses going up is typically styled warning
            icon: Scale,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            desc: 'Cloud + Contratos CLT'
          },
          {
            title: 'Lucro Líquido Real',
            value: fmtBRL(data.profit),
            badge: '+14.2%',
            positive: true,
            icon: Sparkles,
            color: 'text-teal-500',
            bg: 'bg-teal-500/10',
            desc: 'Resultado líquido ajustado'
          },
          {
            title: 'Margem Líquida',
            value: fmtPct(data.margin),
            badge: 'Ideal',
            positive: true,
            icon: Percent,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: 'Benchmark de mercado: 25%'
          }
        ];

      case 'RH':
        return [
          {
            title: 'Total de Colaboradores',
            value: fmtNum(data.headcount),
            badge: '+4 novos',
            positive: true,
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            desc: 'CLT/PJ organizados'
          },
          {
            title: 'Turnover Voluntário',
            value: fmtPct(data.turnover),
            badge: 'Sob controle',
            positive: true,
            icon: Percent,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            desc: 'Média de mercado: 3.5%'
          },
          {
            title: 'Índice Absenteísmo',
            value: fmtPct(data.absenteeism),
            badge: '-0.3%',
            positive: true,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Faltas justificadas e licenças'
          },
          {
            title: 'Score Clima (eNPS)',
            value: fmtNum(data.enps),
            badge: 'Zona de Excelência',
            positive: true,
            icon: Sparkles,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            desc: 'Feedback anônimo trimestral'
          }
        ];

      case 'MARKETING':
        return [
          {
            title: 'Leads Gerados',
            value: fmtNum(data.leads),
            badge: '+18.2%',
            positive: true,
            icon: Users,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            desc: 'Canais orgânicos + Ads'
          },
          {
            title: 'CPC Médio (Ads)',
            value: fmtBRL(data.avgCpc),
            badge: '-3.1%',
            positive: true,
            icon: Scale,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
            desc: 'Custo por click consolidado'
          },
          {
            title: 'Custo de Aquisição (CAC)',
            value: fmtBRL(data.cac),
            badge: '-5.2%',
            positive: true,
            icon: Target,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            desc: 'Meta de LTV/CAC > 3x'
          },
          {
            title: 'Retorno de Campanha (ROI)',
            value: `${data.roi}x`,
            badge: 'Premium',
            positive: true,
            icon: Sparkles,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Retorno sobre o AdSpend'
          }
        ];

      case 'ATENDIMENTO':
        return [
          {
            title: 'Chamados Totais',
            value: fmtNum(data.tickets),
            badge: '-14%',
            positive: true,
            icon: TrendingUp,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            desc: 'Volume aberto no mês'
          },
          {
            title: 'SLA de Resolução',
            value: fmtPct(data.sla),
            badge: '98% acordo',
            positive: true,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Tempo médio sob contrato'
          },
          {
            title: 'Tempo de Resposta',
            value: `${data.avgResponse} min`,
            badge: '-2 min',
            positive: true,
            icon: Clock3,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            desc: 'Triagem e primeiro retorno'
          },
          {
            title: 'NPS de Suporte',
            value: fmtNum(data.nps),
            badge: 'Excepcional',
            positive: true,
            icon: Sparkles,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: 'Pesquisa pós-chamado'
          }
        ];

      case 'LOGÍSTICA':
        return [
          {
            title: 'Entregas OTIF (On-Time)',
            value: fmtPct(data.otif),
            badge: '+1.2%',
            positive: true,
            icon: CheckCircle2,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
            desc: 'Prazo e especificação ideal'
          },
          {
            title: 'Pedidos Despachados',
            value: fmtNum(data.orders),
            badge: '+9.4%',
            positive: true,
            icon: TrendingUp,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: 'Integrados com ERP Core'
          },
          {
            title: 'Giro de Estoque',
            value: `${data.stockTurns}x`,
            badge: 'Rápido',
            positive: true,
            icon: Scale,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            desc: 'Giro anual projetado'
          },
          {
            title: 'Custos de Envio',
            value: 'R$ 24,50',
            badge: 'Estável',
            positive: true,
            icon: Target,
            color: 'text-slate-500',
            bg: 'bg-slate-500/10',
            desc: 'Custo logístico por Frete'
          }
        ];

      default: // PRODUÇÃO
        return [
          {
            title: 'Classificação OEE',
            value: fmtPct(data.oee),
            badge: '+2.4%',
            positive: true,
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            desc: 'World Class benchmark: 85%'
          },
          {
            title: 'Disponibilidade total',
            value: fmtPct(data.availability),
            badge: '91% ideal',
            positive: true,
            icon: Clock3,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            desc: 'Tempo de operação ativa'
          },
          {
            title: 'Performance de Linha',
            value: fmtPct(data.performance),
            badge: '+1.1%',
            positive: true,
            icon: Scale,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            desc: 'Velocidade de setup e ciclo'
          },
          {
            title: 'Indicador de Qualidade',
            value: fmtPct(data.quality),
            badge: '+0.1%',
            positive: true,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            desc: 'Lotes aprovados sem refugo'
          }
        ];
    }
  };

  const cards = getSectoredCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            id={`metric-card-${idx}`}
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-350 hover:shadow-xl hover:-translate-y-0.5
              ${isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700' 
                : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'}`}
          >
            {/* Top decorative gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex items-center justify-between">
              <span className={`text-xs font-display font-semibold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between select-text">
              <h3 className="text-2xl font-mono font-bold tracking-tight">
                {card.value}
              </h3>
              
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono leading-none
                ${card.positive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-rose-500/10 text-rose-400'}`}
              >
                {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.badge}
              </span>
            </div>

            <p className="mt-2 text-[10px] font-display text-slate-500 leading-tight">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
