import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Award, 
  Percent, 
  Scale, 
  Target, 
  ShieldCheck, 
  Zap, 
  Coins, 
  LineChart, 
  Briefcase, 
  TrendingDown, 
  Layers 
} from 'lucide-react';
import { AdvancedFilter } from '../types';

interface ExecutiveKpisProps {
  activeFilters: AdvancedFilter;
  isDarkMode: boolean;
}

export default function ExecutiveKpis({ activeFilters, isDarkMode }: ExecutiveKpisProps) {
  // Analytical dynamic factor calculation to ensure everything shifts with headers
  const getDynamicFactors = () => {
    let factor = 1.0;
    if (activeFilters.companyId === 'comp-2') factor *= 0.65;
    
    // Unit scaling
    const unit = activeFilters.unit;
    if (unit === 'Filial Sul-RS') factor *= 0.45;
    else if (unit === 'Filial RJ') factor *= 0.55;
    else if (unit === 'DC Campinas') factor *= 0.75;
    else if (unit === 'DC Curitiba') factor *= 0.35;
    else if (unit === 'DC Nordeste') factor *= 0.48;
    else if (unit === 'Matriz SP') factor *= 1.25;

    // Period scaling
    const period = activeFilters.period;
    let periodFactor = 1.0;
    let labelCompare = 'vs mês anterior';
    if (period === 'today') { periodFactor = 0.032; labelCompare = 'vs ontem'; }
    else if (period === 'yesterday') { periodFactor = 0.031; labelCompare = 'vs anteontem'; }
    else if (period === '7days') { periodFactor = 0.22; labelCompare = 'vs sem anterior'; }
    else if (period === 'last_month') { periodFactor = 0.96; labelCompare = 'vs mês anterior'; }
    else if (period === 'this_month') { periodFactor = 1.05; labelCompare = 'vs mês anterior'; }

    // Region scaling
    const region = activeFilters.region;
    if (region === 'Sudeste') factor *= 1.4;
    else if (region === 'Sul') factor *= 1.1;
    else if (region === 'Nordeste') factor *= 0.8;
    else if (region === 'Centro-Oeste') factor *= 0.6;
    else if (region === 'Norte') factor *= 0.4;

    return { factor: factor * periodFactor, labelCompare };
  };

  const { factor, labelCompare } = getDynamicFactors();

  // Helper formatting BRL values
  const fmtBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  // Helper formatting ratio
  const fmtNum = (val: number) => new Intl.NumberFormat('pt-BR').format(Math.round(val));

  // Generate dynamic, realistic sparkline paths based on an ID seed and factor
  const generateSparkline = (seedId: number, baseVal: number, positive: boolean) => {
    // Generate a set of 8 realistic fluctuation points
    const points: number[] = [];
    let current = baseVal * 0.9;
    const step = (baseVal * 0.2) / 7;
    for (let i = 0; i < 8; i++) {
      const variation = Math.sin(seedId + i * 1.5) * (baseVal * 0.05);
      const trend = positive ? i * step : -i * (step * 0.5);
      points.push(current + variation + trend);
    }
    
    // Calculate SVG bounding box properties
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = maxVal - minVal || 1;
    
    // Map to width=120, height=35
    const width = 120;
    const height = 35;
    const padding = 2;
    const mappedPts = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    
    return {
      pointsStr: mappedPts.join(' '),
      lastY: parseFloat(mappedPts[mappedPts.length - 1].split(',')[1])
    };
  };

  // 14 KPIs metadata mapping
  const kpiDataList = [
    {
      id: 1,
      title: 'Receita Total',
      value: fmtBRL(3542900 * factor),
      badge: '+14.2%',
      positive: true,
      icon: DollarSign,
      colorClass: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      compareVal: fmtBRL(3102400 * factor),
      bgGlow: 'hover:shadow-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 2,
      title: 'Receita Recorrente',
      value: fmtBRL(2150400 * factor),
      badge: '+8.7%',
      positive: true,
      icon: Coins,
      colorClass: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      compareVal: fmtBRL(1978200 * factor),
      bgGlow: 'hover:shadow-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 3,
      title: 'EBITDA',
      value: fmtBRL(1184300 * factor),
      badge: '+16.4%',
      positive: true,
      icon: Activity,
      colorClass: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      compareVal: fmtBRL(1017000 * factor),
      bgGlow: 'hover:shadow-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 4,
      title: 'ROI Corporativo',
      value: `${(28.4 * (factor > 0 ? 1 : 0.9)).toFixed(1)}%`,
      badge: '+2.1%',
      positive: true,
      icon: Award,
      colorClass: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      compareVal: '26.3% no quarter',
      bgGlow: 'hover:shadow-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      id: 5,
      title: 'ROAS',
      value: `${(5.4 * (factor > 0 ? 1 : 0.95)).toFixed(1)}x`,
      badge: '-0.3x',
      positive: false,
      icon: LineChart,
      colorClass: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      compareVal: '5.7x estipulado',
      bgGlow: 'hover:shadow-rose-500/10',
      borderColor: 'border-rose-500/20'
    },
    {
      id: 6,
      title: 'Ticket Médio',
      value: fmtBRL(11240 * (activeFilters.companyId === 'comp-2' ? 0.8 : 1.1)),
      badge: '+4.5%',
      positive: true,
      icon: Scale,
      colorClass: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      compareVal: fmtBRL(10750 * (activeFilters.companyId === 'comp-2' ? 0.8 : 1.1)),
      bgGlow: 'hover:shadow-sky-500/10',
      borderColor: 'border-sky-500/20'
    },
    {
      id: 7,
      title: 'Crescimento Mensal',
      value: `${(12.8 * (factor > 0 ? 1 : 0.85)).toFixed(1)}%`,
      badge: '+1.4%',
      positive: true,
      icon: TrendingUp,
      colorClass: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      compareVal: '11.4% mês anterior',
      bgGlow: 'hover:shadow-teal-500/10',
      borderColor: 'border-teal-500/20'
    },
    {
      id: 8,
      title: 'Crescimento Anual',
      value: `${(34.2 * (factor > 0 ? 1 : 0.9)).toFixed(1)}%`,
      badge: '+3.8%',
      positive: true,
      icon: Layers,
      colorClass: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      compareVal: '30.4% YoY acumulado',
      bgGlow: 'hover:shadow-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      id: 9,
      title: 'Lucro Operacional',
      value: fmtBRL(985400 * factor),
      badge: '+11.2%',
      positive: true,
      icon: Briefcase,
      colorClass: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      compareVal: fmtBRL(886000 * factor),
      bgGlow: 'hover:shadow-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      id: 10,
      title: 'Fluxo de Caixa Livre',
      value: fmtBRL(820400 * factor),
      badge: '+15.9%',
      positive: true,
      icon: Coins,
      colorClass: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      compareVal: fmtBRL(707900 * factor),
      bgGlow: 'hover:shadow-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 11,
      title: 'Índice de Eficiência',
      value: `${(92.4 * (factor > 0 ? 1 : 0.98)).toFixed(1)}%`,
      badge: '+1.6%',
      positive: true,
      icon: Zap,
      colorClass: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      compareVal: '90.8% no benchmark',
      bgGlow: 'hover:shadow-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      id: 12,
      title: 'Meta x Realizado',
      value: `${(108.4 * (factor > 0 ? 1 : 0.95)).toFixed(1)}%`,
      badge: '+8.4%',
      positive: true,
      icon: Target,
      colorClass: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      compareVal: 'Meta: 100% batida',
      bgGlow: 'hover:shadow-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 13,
      title: 'Saúde Financeira',
      value: `${Math.round(94 * (factor > 0 ? 1 : 0.96))}%`,
      badge: 'Classe AAA',
      positive: true,
      icon: ShieldCheck,
      colorClass: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      compareVal: 'Estável com liquidez',
      bgGlow: 'hover:shadow-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 14,
      title: 'Score Corporativo',
      value: `${Math.round(88 * (factor > 0 ? 1 : 0.95))}/100`,
      badge: 'Excelente',
      positive: true,
      icon: Zap,
      colorClass: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      compareVal: '84/100 mês passado',
      bgGlow: 'hover:shadow-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 mt-2">
        <h3 className="font-display font-extrabold text-sm tracking-tight flex items-center gap-2 text-indigo-400">
          <Layers className="w-4.5 h-4.5 text-indigo-500" />
          <span>PAINEL EXECUTIVO DE KPI FINANCEIROS & SAÚDE CORPORATIVA COLP</span>
        </h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-500/10 px-2 py-0.5 rounded-full select-none">
          14 Indicadores Consolidados
        </span>
      </div>

      {/* Horizontal scrolling grid container for premium dense view similar to Bloomberg terminal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4" id="executive-14kpis-panel">
        {kpiDataList.map((kpi) => {
          const sparkInfo = generateSparkline(kpi.id, 100, kpi.positive);
          return (
            <div 
              key={kpi.id}
              className={`p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md flex flex-col justify-between 
                ${isDarkMode 
                  ? 'bg-slate-900/45 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700/80 text-slate-100' 
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:shadow-xl text-slate-800'}
                shadow-sm hover:translate-y-[-2px] hover:shadow-md ${kpi.bgGlow} ${kpi.borderColor}`}
            >
              {/* Card Title & Icon */}
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-display font-semibold select-all ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {kpi.title}
                </span>
                <span className={`p-1.5 rounded-xl ${kpi.bgColor} ${kpi.colorClass} flex items-center justify-center shrink-0`}>
                  <kpi.icon className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card Value & Performance Badge */}
              <div className="my-2.5">
                <h4 className="font-display font-extrabold text-lg tracking-tight select-all leading-none">
                  {kpi.value}
                </h4>
                <div className="flex items-center gap-1.0 mt-1.5 flex-wrap">
                  <span className={`text-[9px] font-mono font-bold flex items-center px-1.5 py-0.2 rounded-full
                    ${kpi.positive 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'}`}
                  >
                    {kpi.positive ? '▲' : '▼'} {kpi.badge}
                  </span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-sans whitespace-nowrap`}>
                    {labelCompare}
                  </span>
                </div>
              </div>

              {/* Sparkline Visual Component using raw SVG paths for lightweight precision */}
              <div className="flex flex-col justify-end h-8 mt-2.5">
                <div className="flex items-end justify-between border-t border-dashed border-slate-500/10 pt-2 font-mono text-[9px] text-slate-500">
                  <span className="truncate max-w-[50px]" title={kpi.compareVal}>{kpi.compareVal}</span>
                  <svg className="w-16 h-6 overflow-visible" viewBox="0 0 120 35" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={kpi.positive ? '#10b981' : '#f43f5e'}
                      strokeWidth="2"
                      points={sparkInfo.pointsStr}
                    />
                    {/* Circle marker on end */}
                    <circle 
                      cx="120" 
                      cy={sparkInfo.lastY} 
                      r="3" 
                      fill={kpi.positive ? '#34d399' : '#fb7185'} 
                    />
                  </svg>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
