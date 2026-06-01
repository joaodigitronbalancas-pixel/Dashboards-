import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  FunnelChart, 
  Funnel, 
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';
import { SectorType } from '../types';
import { Sparkles, HelpCircle, Activity } from 'lucide-react';

interface BiChartsProps {
  sector: SectorType;
  data: any; // Dynamically calculated filtered raw JSON data
  isDarkMode: boolean;
}

export default function BiCharts({ sector, data, isDarkMode }: BiChartsProps) {
  if (!data) return null;

  // Premium palettes matched perfectly to the million-dollar design aesthetic
  const COLORS = ['#2563eb', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#f59e0b', '#f97316'];

  // Custom tooltips with dark/light premium card designs
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl border shadow-xl backdrop-blur-md select-none text-xs font-sans ring-1 ring-black/5
          ${isDarkMode ? 'bg-slate-900/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'}`}
        >
          <p className="font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
              <span className="font-display font-medium text-slate-400">{p.name}:</span>
              <span className="font-mono font-bold text-slate-100 dark:text-emerald-400">
                {typeof p.value === 'number' && p.value > 1000 ? `R$ ${p.value.toLocaleString('pt-BR')}` : p.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderActiveChart = () => {
    switch (sector) {
      case 'COMERCIAL': {
        const monthlyTrend = data.monthlyTrend || [];
        const productMix = data.productMix || [];
        const funnel = data.funnel || [];
        const regionalRanking = data.regionalRanking || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Monthly Area Chart */}
            <div className={`xl:col-span-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-base">Faturamento vs Meta (Série Histórica)</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">Atualizado</span>
              </div>
              <div className="h-80 w-full" id="comercial-revenue-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Area type="monotone" name="Realizado" dataKey="Real" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReal)" />
                    <Area type="monotone" name="Meta Estipulada" dataKey="Meta" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorMeta)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Mix Share */}
            <div className={`xl:col-span-4 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Mix de Vendas (Share de Produto)</h3>
              <div className="h-80 w-full flex items-center justify-center" id="comercial-mix-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productMix}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {productMix.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9, bottom: 0 }} layout="horizontal" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pipeline Funnel */}
            <div className={`xl:col-span-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Pipeline de Conversão (Funil de SDR)</h3>
              <div className="h-80 w-full flex items-center justify-center" id="comercial-funnel-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Funnel
                      dataKey="valor"
                      data={funnel}
                      isAnimationActive
                    >
                      <LabelList position="right" fill={isDarkMode ? '#cbd5e1' : '#1e293b'} stroke="none" dataKey="name" style={{ fontSize: 10 }} />
                      {funnel.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Funnel>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Ranking */}
            <div className={`xl:col-span-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Volume de Vendas por Região</h3>
              <div className="h-80 w-full" id="comercial-regions-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalRanking} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis type="number" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis type="category" dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Valor" radius={[0, 8, 8, 0]}>
                      {regionalRanking.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case 'FINANCEIRO': {
        const cashFlow = data.cashFlow || [];
        const costCenters = data.costCenters || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Cash Flow Forecast (Line) */}
            <div className={`xl:col-span-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-base">Fluxo de Caixa Mensal (Real vs Modelo Preditivo IA)</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/25">
                  <Sparkles className="w-3 h-3" />
                  <span>Forecast Ativo</span>
                </div>
              </div>
              <div className="h-80 w-full" id="financial-cashflow-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" name="Receitas (+)" dataKey="Entrada" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Despesas (-)" dataKey="Saida" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" name="Projeção IA" dataKey="Projetado" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Centers (Donut) */}
            <div className={`xl:col-span-4 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Despesas por Centro de Custo (OpEx)</h3>
              <div className="h-80 w-full flex items-center justify-center" id="financial-costs-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costCenters}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {costCenters.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9, bottom: 0 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case 'RH': {
        const trends = data.trends || [];
        const contracts = data.contracts || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Hirings vs Exits (Bar) */}
            <div className={`xl:col-span-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Contratações vs Desligamentos (Evolutivo)</h3>
              <div className="h-80 w-full" id="rh-hirings-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="Admissões" dataKey="Contratacoes" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Desligamentos" dataKey="Desligamentos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employment Type Contracts (Pie) */}
            <div className={`xl:col-span-4 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Estrutura de Contratos de Trabalho</h3>
              <div className="h-80 w-full flex items-center justify-center" id="rh-contracts-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contracts}
                      cx="50%"
                      cy="45%"
                      outerRadius={85}
                      innerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {contracts.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case 'MARKETING': {
        const channels = data.channels || [];
        const adsRoi = data.adsRoi || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Leads by Channel (Bar) */}
            <div className={`xl:col-span-7 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Aquisição de Leads por Mídia / Canal</h3>
              <div className="h-80 w-full" id="mkt-leads-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channels} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Leads Obtidos" dataKey="value" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ad Network performance comparison (Radar) */}
            <div className={`xl:col-span-5 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Comparativo de Eficiência (ROI Ad Networks)</h3>
              <div className="h-80 w-full flex items-center justify-center font-mono" id="mkt-ads-radar">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={adsRoi}>
                    <PolarGrid stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? '#94a3b8' : '#64748b'} style={{ fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke={isDarkMode ? '#475569' : '#cbd5e1'} style={{ fontSize: 8 }} />
                    <Radar name="Google Network" dataKey="Google" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                    <Radar name="Meta Network" dataKey="Meta" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case 'ATENDIMENTO': {
        const issues = data.issues || [];
        const ticketStatus = data.ticketStatus || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Recurrent support topics (Treemap) */}
            <div className={`xl:col-span-7 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Distribuição Volumétrica de Chamados (Assunto)</h3>
              <div className="h-80 w-full text-xs font-semibold" id="support-treemap">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={issues}
                    dataKey="value"
                    stroke={isDarkMode ? '#0f172a' : '#fff'}
                    fill="#3b82f6"
                  />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resolved vs Backlog (Line) */}
            <div className={`xl:col-span-5 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Resolvidos vs Backlog em Aberto (Semanal)</h3>
              <div className="h-80 w-full" id="support-resolved-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ticketStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" name="Resolvidos" dataKey="Resolvidos" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" name="Fila (Backlog)" dataKey="Backlog" stroke="#f43f5e" strokeWidth={1.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      case 'LOGÍSTICA': {
        const shippingVolume = data.shippingVolume || [];
        const deliveryStatus = data.deliveryStatus || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Shipment Dispatch Scale (Area) */}
            <div className={`xl:col-span-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Despachos Mensais vs Entregues No Prazo</h3>
              <div className="h-80 w-full" id="logistics-dispatch-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={shippingVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorShip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOntime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" name="Total Despachado" dataKey="Despachados" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorShip)" />
                    <Area type="monotone" name="Entregue No Prazo" dataKey="NoPrazo" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorOntime)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delivery Postal Status segmentation (Donut) */}
            <div className={`xl:col-span-4 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Status Operacional das Encomendas</h3>
              <div className="h-80 w-full flex items-center justify-center" id="logistics-status-pie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryStatus}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deliveryStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9, bottom: 0 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }

      default: { // PRODUÇÃO / OEE
        const productionHistory = data.productionHistory || [];
        const stops = data.stops || [];
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Yield by Assembly line (Bar) */}
            <div className={`xl:col-span-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-base">Rendimento Produtivo & OEE por Linha</h3>
                <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
              </div>
              <div className="h-80 w-full" id="production-assembly-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="Percentual OEE (%)" dataKey="OEE" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar name="Peças Fabricadas (Milhares)" dataKey="Pecas" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stops and micro setups (Line) */}
            <div className={`xl:col-span-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-display font-bold text-base mb-6">Microparadas e Perdas por Fábrica (Minutos)</h3>
              <div className="h-80 w-full" id="production-stops-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stops} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                    <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="Setup Máquina" dataKey="Setup" fill="#3b82f6" stackId="st" radius={[2, 2, 0, 0]} />
                    <Bar name="Atendimento Corretivo" dataKey="Manutencao" fill="#f43f5e" stackId="st" radius={[2, 2, 0, 0]} />
                    <Bar name="Atrasos s/ Classificação" dataKey="Outros" fill="#f59e0b" stackId="st" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="mt-8 select-none">
      {renderActiveChart()}
    </div>
  );
}
