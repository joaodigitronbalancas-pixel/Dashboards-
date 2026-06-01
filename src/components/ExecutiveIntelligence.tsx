import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  MapPin, 
  DollarSign, 
  Coins, 
  Activity, 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle, 
  Flame, 
  Zap, 
  Table, 
  Compass, 
  Play, 
  Download, 
  HelpCircle,
  Eye
} from 'lucide-react';
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
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Treemap 
} from 'recharts';
import { AdvancedFilter } from '../types';

interface ExecutiveIntelligenceProps {
  activeFilters: AdvancedFilter;
  isDarkMode: boolean;
}

export default function ExecutiveIntelligence({ activeFilters, isDarkMode }: ExecutiveIntelligenceProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'geo' | 'products' | 'heatmaps' | 'costs' | 'anomaly'>('trends');
  
  // Drill-down local state variables to mimic real Power BI interaction
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Dynamic factors to align with header filters instantly
  const getFactor = () => {
    let factor = 1.0;
    if (activeFilters.companyId === 'comp-2') factor *= 0.65;
    
    const unit = activeFilters.unit;
    if (unit === 'Filial Sul-RS') factor *= 0.45;
    else if (unit === 'Filial RJ') factor *= 0.55;
    else if (unit === 'DC Campinas') factor *= 0.75;
    else if (unit === 'DC Curitiba') factor *= 0.35;
    else if (unit === 'DC Nordeste') factor *= 0.48;
    else if (unit === 'Matriz SP') factor *= 1.25;

    const period = activeFilters.period;
    let periodFactor = 1.0;
    if (period === 'today') periodFactor = 0.035;
    else if (period === 'yesterday') periodFactor = 0.033;
    else if (period === '7days') periodFactor = 0.23;
    else if (period === 'last_month') periodFactor = 0.95;

    const region = activeFilters.region;
    if (region === 'Sudeste') factor *= 1.35;
    else if (region === 'Sul') factor *= 1.08;
    else if (region === 'Nordeste') factor *= 0.78;
    else if (region === 'Centro-Oeste') factor *= 0.58;
    else if (region === 'Norte') factor *= 0.38;

    return factor * periodFactor;
  };

  const factor = getFactor();

  // Primary colors
  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f97316'];

  // Excel / CSV / PDF Export simulation inside app
  const triggerExport = (format: string, chartName: string) => {
    if (format === 'csv' || format === 'excel') {
      const headers = "Indicador;Categoria;Valor Calculado;Crescimento\n";
      const rows = `Faturamento Executivo;${chartName};R$ ${(1284500 * factor).toLocaleString('pt-BR')};+14.2%\n` +
                   `Custo Operacional;Margem de Contribuição;34.6%;Ideal\n` +
                   `Meta Corporativa;EBITDA;R$ ${(580210 * factor).toLocaleString('pt-BR')};Dentro do Prazo\n`;
      const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `metrix_exec_export_${chartName.toLowerCase().replace(/\s+/g, '_')}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Exportando ${chartName} no formato ${format.toUpperCase()} de Alta Definição de BI! Download iniciado...`);
    }
  };

  const fmtBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Static/calculated Data sets dynamically mapped with filters:
  
  // 12 Months financials (Chart 1 & 2 & 20 & 21)
  const financial12Months = [
    { name: 'Jun/25', Receita: Math.round(210000 * factor), Despesas: Math.round(155000 * factor), Lucro: Math.round(55000 * factor), EBITDA: Math.round(75000 * factor), Projecao: Math.round(210000 * factor) },
    { name: 'Jul/25', Receita: Math.round(230000 * factor), Despesas: Math.round(162000 * factor), Lucro: Math.round(68000 * factor), EBITDA: Math.round(82000 * factor), Projecao: Math.round(230000 * factor) },
    { name: 'Ago/25', Receita: Math.round(250000 * factor), Despesas: Math.round(170000 * factor), Lucro: Math.round(80000 * factor), EBITDA: Math.round(98000 * factor), Projecao: Math.round(250000 * factor) },
    { name: 'Set/25', Receita: Math.round(240000 * factor), Despesas: Math.round(165000 * factor), Lucro: Math.round(75000 * factor), EBITDA: Math.round(92000 * factor), Projecao: Math.round(240000 * factor) },
    { name: 'Out/25', Receita: Math.round(285000 * factor), Despesas: Math.round(180000 * factor), Lucro: Math.round(105000 * factor), EBITDA: Math.round(125000 * factor), Projecao: Math.round(285000 * factor) },
    { name: 'Nov/25', Receita: Math.round(310000 * factor), Despesas: Math.round(195000 * factor), Lucro: Math.round(115000 * factor), EBITDA: Math.round(140000 * factor), Projecao: Math.round(310000 * factor) },
    { name: 'Dez/25', Receita: Math.round(390000 * factor), Despesas: Math.round(240000 * factor), Lucro: Math.round(150000 * factor), EBITDA: Math.round(180000 * factor), Projecao: Math.round(390000 * factor) },
    { name: 'Jan/26', Receita: Math.round(290000 * factor), Despesas: Math.round(185000 * factor), Lucro: Math.round(105000 * factor), EBITDA: Math.round(120000 * factor), Projecao: Math.round(290000 * factor) },
    { name: 'Fev/26', Receita: Math.round(315000 * factor), Despesas: Math.round(190000 * factor), Lucro: Math.round(125000 * factor), EBITDA: Math.round(135000 * factor), Projecao: Math.round(315000 * factor) },
    { name: 'Mar/26', Receita: Math.round(340000 * factor), Despesas: Math.round(200000 * factor), Lucro: Math.round(140000 * factor), EBITDA: Math.round(160000 * factor), Projecao: Math.round(340000 * factor) },
    { name: 'Abr/26', Receita: Math.round(365000 * factor), Despesas: Math.round(210000 * factor), Lucro: Math.round(155000 * factor), EBITDA: Math.round(175000 * factor), Projecao: Math.round(365000 * factor) },
    { name: 'Mai/26', Receita: Math.round(395000 * factor), Despesas: Math.round(220000 * factor), Lucro: Math.round(175000 * factor), EBITDA: Math.round(195000 * factor), Projecao: Math.round(395000 * factor) },
    // Forecast 12 Months lines based on IA
    { name: 'Jun/26 (F)', Receita: null, Despesas: null, Lucro: null, EBITDA: null, Projecao: Math.round(415000 * factor) },
    { name: 'Jul/26 (F)', Receita: null, Despesas: null, Lucro: null, EBITDA: null, Projecao: Math.round(430000 * factor) },
    { name: 'Ago/26 (F)', Receita: null, Despesas: null, Lucro: null, EBITDA: null, Projecao: Math.round(455000 * factor) },
    { name: 'Set/26 (F)', Receita: null, Despesas: null, Lucro: null, EBITDA: null, Projecao: Math.round(442000 * factor) }
  ];

  // Current Year vs Last Year (Chart 2)
  const compareYears = [
    { month: 'Jan', AnoAtual: Math.round(290000 * factor), AnoAnterior: Math.round(240000 * factor) },
    { month: 'Fev', AnoAtual: Math.round(315000 * factor), AnoAnterior: Math.round(250000 * factor) },
    { month: 'Mar', AnoAtual: Math.round(340000 * factor), AnoAnterior: Math.round(260000 * factor) },
    { month: 'Abr', AnoAtual: Math.round(365000 * factor), AnoAnterior: Math.round(275000 * factor) },
    { month: 'Mai', AnoAtual: Math.round(395000 * factor), AnoAnterior: Math.round(290000 * factor) },
    { month: 'Jun', AnoAtual: Math.round(415000 * factor), AnoAnterior: Math.round(30000 * factor * 10) } // forecast
  ];

  // Geographics Breakdown (Chart 3, 4, 5, 6 & ABC Curves 13 & interactive map)
  const regionalDistribution = [
    { name: 'Sudeste', Receita: Math.round(1580200 * factor), percent: '44.3%', status: 'Acima da Meta', state: 'SP' },
    { name: 'Sul', Receita: Math.round(980300 * factor), percent: '27.5%', status: 'Na Meta', state: 'RS' },
    { name: 'Nordeste', Receita: Math.round(540400 * factor), percent: '15.2%', status: 'Abaixo da Meta', state: 'PE' },
    { name: 'Centro-Oeste', Receita: Math.round(310100 * factor), percent: '8.7%', status: 'Em Risco', state: 'DF' },
    { name: 'Norte', Receita: Math.round(152100 * factor), percent: '4.3%', status: 'Em Evolução', state: 'AM' }
  ];

  const stateDetails = [
    { state: 'São Paulo', initials: 'SP', Receita: Math.round(954200 * factor), LucroMark: 34 },
    { state: 'Rio de Janeiro', initials: 'RJ', Receita: Math.round(380400 * factor), LucroMark: 28 },
    { state: 'Minas Gerais', initials: 'MG', Receita: Math.round(245600 * factor), LucroMark: 31 },
    { state: 'Rio Grande do Sul', initials: 'RS', Receita: Math.round(298000 * factor), LucroMark: 29 },
    { state: 'Paraná', initials: 'PR', Receita: Math.round(180500 * factor), LucroMark: 30 },
    { state: 'Santa Catarina', initials: 'SC', Receita: Math.round(155400 * factor), LucroMark: 33 },
    { state: 'Pernambuco', initials: 'PE', Receita: Math.round(145000 * factor), LucroMark: 26 },
    { state: 'Bahia', initials: 'BA', Receita: Math.round(120200 * factor), LucroMark: 27 },
    { state: 'Ceará', initials: 'CE', Receita: Math.round(98400 * factor), LucroMark: 25 },
    { state: 'Distrito Federal', initials: 'DF', Receita: Math.round(150400 * factor), LucroMark: 35 },
    { state: 'Goiás', initials: 'GO', Receita: Math.round(89700 * factor), LucroMark: 29 },
    { state: 'Pará', initials: 'PA', Receita: Math.round(59600 * factor), LucroMark: 22 },
    { state: 'Amazonas', initials: 'AM', Receita: Math.round(62000 * factor), LucroMark: 24 }
  ];

  const stateCities = [
    { name: 'São Paulo', Receita: Math.round(684200 * factor), state: 'SP' },
    { name: 'Campinas', Receita: Math.round(180400 * factor), state: 'SP' },
    { name: 'São Bernardo', Receita: Math.round(89600 * factor), state: 'SP' },
    { name: 'Rio de Janeiro', Receita: Math.round(298000 * factor), state: 'RJ' },
    { name: 'Niterói', Receita: Math.round(82400 * factor), state: 'RJ' },
    { name: 'Porto Alegre', Receita: Math.round(195000 * factor), state: 'RS' },
    { name: 'Caxias do Sul', Receita: Math.round(103000 * factor), state: 'RS' },
    { name: 'Belo Horizonte', Receita: Math.round(180400 * factor), state: 'MG' },
    { name: 'Recife', Receita: Math.round(112000 * factor), state: 'PE' },
    { name: 'Manaus', Receita: Math.round(62000 * factor), state: 'AM' }
  ];

  const unitCompare = [
    { name: 'Matriz SP', Faturamento: Math.round(1954200 * factor), Custos: Math.round(1150400 * factor), Rentabilidade: 41 },
    { name: 'Filial Sul-RS', Faturamento: Math.round(980300 * factor), Custos: Math.round(680200 * factor), Rentabilidade: 31 },
    { name: 'Filial RJ', Faturamento: Math.round(608400 * factor), Custos: Math.round(448500 * factor), Rentabilidade: 26 },
    { name: 'DC Campinas', Faturamento: Math.round(452300 * factor), Custos: Math.round(310000 * factor), Rentabilidade: 31 },
    { name: 'DC Curitiba', Faturamento: Math.round(230400 * factor), Custos: Math.round(175000 * factor), Rentabilidade: 24 },
    { name: 'DC Nordeste', Faturamento: Math.round(398100 * factor), Custos: Math.round(298400 * factor), Rentabilidade: 25 }
  ];

  // Products, Categories and Channels (Chart 7, 8, 9, 10, 11, 12, 13, 14, 28, 29, 30)
  const productMix = [
    { name: 'Cloud ERP Core', value: Math.round(1540100 * factor), margin: 68, Category: 'SaaS' },
    { name: 'BI Executive Pack', value: Math.round(1080200 * factor), margin: 72, Category: 'Analytics' },
    { name: 'CRM Pro Integration', value: Math.round(510500 * factor), margin: 59, Category: 'SaaS' },
    { name: 'Legacy API Gateway', value: Math.round(283700 * factor), margin: 44, Category: 'Gateway' },
    { name: 'AI Forecast Module', value: Math.round(128400 * factor), margin: 85, Category: 'Analytics' }
  ];

  const sellersList = [
    { name: 'Ana Beatriz', Vendas: Math.round(485400 * factor), percent: 122 },
    { name: 'Marcos Silveira', Vendas: Math.round(420100 * factor), percent: 115 },
    { name: 'Priscilla Dias', Vendas: Math.round(398400 * factor), percent: 104 },
    { name: 'Rodrigo Nunes', Vendas: Math.round(315000 * factor), percent: 98 },
    { name: 'Larissa Alencar', Vendas: Math.round(280900 * factor), percent: 89 },
    { name: 'Fabiano Costa', Vendas: Math.round(210200 * factor), percent: 84 }
  ];

  const salesChannels = [
    { name: 'Inside Sales', Receita: Math.round(1542000 * factor), ticket: 15400 },
    { name: 'Digital Checkout', Receita: Math.round(985400 * factor), ticket: 8900 },
    { name: 'Parceiros / VARs', Receita: Math.round(620100 * factor), ticket: 22000 },
    { name: 'Enterprise RFP', Receita: Math.round(395400 * factor), ticket: 79000 }
  ];

  const conversionFunnel = [
    { stage: 'A. Leads Gerados', Qtd: Math.round(24200 * factor), conversion: 100 },
    { stage: 'B. Contatos Elegíveis', Qtd: Math.round(15800 * factor), conversion: 65 },
    { stage: 'C. SQL Qualificados', Qtd: Math.round(7900 * factor), conversion: 50 },
    { stage: 'D. Demonstrações', Qtd: Math.round(3800 * factor), conversion: 48 },
    { stage: 'E. Propostas de Negócio', Qtd: Math.round(1450 * factor), conversion: 38 },
    { stage: 'F. Vendas Concluídas', Qtd: Math.round(520 * factor), conversion: 35 }
  ];

  // ABC Curve points calculated inline dynamically
  const abcProductsCurved = productMix
    .sort((a, b) => b.value - a.value)
    .reduce((acc: any[], item, index, arr) => {
      const sumAll = arr.reduce((s, x) => s + x.value, 0);
      const prevSum = index > 0 ? acc[index - 1].accum : 0;
      const currentShare = (item.value / sumAll) * 100;
      const accum = prevSum + currentShare;
      let cl = 'A';
      if (accum > 80 && accum <= 95) cl = 'B';
      else if (accum > 95) cl = 'C';
      acc.push({
        ...item,
        share: currentShare,
        accum,
        class: cl
      });
      return acc;
    }, []);

  // Performance and Sales Heatmaps Grid Matrices (Chart 16, 17, 18)
  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const times = ['08h-11h', '11h-14h', '14h-17h', '17h-20h'];
  const heatmapPerformanceMatrix = [
    { day: 'Segunda', dpt: 'Matriz', score: 94 }, { day: 'Segunda', dpt: 'Sul', score: 86 }, { day: 'Segunda', dpt: 'RJ', score: 71 },
    { day: 'Terça', dpt: 'Matriz', score: 98 }, { day: 'Terça', dpt: 'Sul', score: 92 }, { day: 'Terça', dpt: 'RJ', score: 84 },
    { day: 'Quarta', dpt: 'Matriz', score: 95 }, { day: 'Quarta', dpt: 'Sul', score: 89 }, { day: 'Quarta', dpt: 'RJ', score: 78 },
    { day: 'Quinta', dpt: 'Matriz', score: 88 }, { day: 'Quinta', dpt: 'Sul', score: 94 }, { day: 'Quinta', dpt: 'RJ', score: 62 },
    { day: 'Sexta', dpt: 'Matriz', score: 91 }, { day: 'Sexta', dpt: 'Sul', score: 78 }, { day: 'Sexta', dpt: 'RJ', score: 85 },
    { day: 'Sábado', dpt: 'Matriz', score: 64 }, { day: 'Sábado', dpt: 'Sul', score: 54 }, { day: 'Sábado', dpt: 'RJ', score: 48 },
  ];

  // Outliers & Anomaly parameters (Chart 22)
  const anomaliesScatterList = [
    { x: 100, y: 120, size: 400, name: 'Anomalia A: Cloud Server Peak (Maio)', type: 'warning' },
    { x: 220, y: 180, size: 250, name: 'Operação Padrão: Matriz SP', type: 'normal' },
    { x: 340, y: 310, size: 200, name: 'Parada de setup excessiva (Abri)', type: 'alert' },
    { x: 150, y: 440, size: 300, name: 'Outlier de Ticket: RFP Gtech', type: 'success' },
    { x: 420, y: 150, size: 180, name: 'Logística Peak: Greve Rodoviária', type: 'warning' },
    { x: 280, y: 390, size: 220, name: 'Contratação Express: Setor Comercial', type: 'normal' }
  ];

  // Top 20 Clients ranking lists (Chart 11)
  const clientsList = [
    { rank: 1, name: 'TechSolutions Global S/A', billing: 384500 * factor, category: 'Enterprise SaaS', ltv: 1100000, margin: 68 },
    { rank: 2, name: 'Varejo Central Multilojas', billing: 310200 * factor, category: 'Cloud BI Bundle', ltv: 940000, margin: 71 },
    { rank: 3, name: 'NorteLog Logística S/A', billing: 285400 * factor, category: 'Custom Integrations', ltv: 850000, margin: 58 },
    { rank: 4, name: 'E-commerce Brasil Express', billing: 220300 * factor, category: 'API Legacy Suite', ltv: 620000, margin: 49 },
    { rank: 5, name: 'Stark Indústrias Metal', billing: 195400 * factor, category: 'Enterprise SaaS', ltv: 550000, margin: 66 },
    { rank: 6, name: 'Hospital das Nações S/A', billing: 180400 * factor, category: 'Cloud BI Bundle', ltv: 520000, margin: 70 },
    { rank: 7, name: 'Supermercado Nova Era', billing: 165300 * factor, category: 'Custom Integrations', ltv: 480000, margin: 55 },
    { rank: 8, name: 'Banco Alpha Digital Co', billing: 152000 * factor, category: 'API Legacy Suite', ltv: 450000, margin: 48 },
    { rank: 9, name: 'Construtora Liderança', billing: 139500 * factor, category: 'Enterprise SaaS', ltv: 390000, margin: 62 },
    { rank: 10, name: 'Lumiar Distribuidora Ltda', billing: 125400 * factor, category: 'Cloud BI Bundle', ltv: 350000, margin: 69 },
    { rank: 11, name: 'Plásticos do Sul S.A.', billing: 118400 * factor, category: 'Custom Integrations', ltv: 320000, margin: 54 },
    { rank: 12, name: 'Mídia Brasil Digital', billing: 109200 * factor, category: 'API Legacy Suite', ltv: 290000, margin: 47 },
    { rank: 13, name: 'Agrícola Sementes D’Ouro', billing: 98100 * factor, category: 'Enterprise SaaS', ltv: 260000, margin: 60 },
    { rank: 14, name: 'Indústrias Reunidas Sul', billing: 92400 * factor, category: 'Cloud BI Bundle', ltv: 240000, margin: 68 },
    { rank: 15, name: 'Vila Imperial Embalagens', billing: 85100 * factor, category: 'Custom Integrations', ltv: 210000, margin: 53 },
    { rank: 16, name: 'Santaluz Cosméticos', billing: 78900 * factor, category: 'API Legacy Suite', ltv: 190000, margin: 46 },
    { rank: 17, name: 'Auto Peças Matriz RS', billing: 72400 * factor, category: 'Enterprise SaaS', ltv: 170000, margin: 59 },
    { rank: 18, name: 'Nacional Alimentos S/A', billing: 68500 * factor, category: 'Cloud BI Bundle', ltv: 150000, margin: 67 },
    { rank: 19, name: 'Metalúrgica Rio Doce', billing: 61500 * factor, category: 'Custom Integrations', ltv: 130000, margin: 51 },
    { rank: 20, name: 'Gás & Energia Multicorp', billing: 54900 * factor, category: 'API Legacy Suite', ltv: 110000, margin: 45 }
  ];

  // Costs matrices & departments comparison (Chart 24 & 26 & 27)
  const costCenters = [
    { name: 'Folha de Benefícios', value: Math.round(542000 * factor), color: '#3b82f6' },
    { name: 'Infraestrutura CloudAWS', value: Math.round(284100 * factor), color: '#8b5cf6' },
    { name: 'Mídia Paga & Ads', value: Math.round(180500 * factor), color: '#06b6d4' },
    { name: 'Impostos e Fata', value: Math.round(110200 * factor), color: '#10b981' },
    { name: 'OpEx Operacional Geral', value: Math.round(75400 * factor), color: '#f59e0b' }
  ];

  const departmentCompare = [
    { subject: 'Vendas', Atual: 96, Anterior: 85, benchmark: 90 },
    { subject: 'Engenharia', Atual: 84, Anterior: 91, benchmark: 90 },
    { subject: 'Suporte SLA', Atual: 98, Anterior: 95, benchmark: 95 },
    { subject: 'Infra', Atual: 91, Anterior: 88, benchmark: 92 },
    { subject: 'Marketing', Atual: 88, Anterior: 82, benchmark: 85 }
  ];

  // Helper map rendering click action
  const handleMapStateClick = (stateInitials: string) => {
    setSelectedState(selectedState === stateInitials ? null : stateInitials);
  };

  const getFilteredCities = () => {
    if (!selectedState) return stateCities;
    return stateCities.filter(c => c.state === selectedState);
  };

  return (
    <div className="w-full text-slate-100 dark:text-slate-100 select-text">
      
      {/* Dynamic drill filters status bar if filters are active */}
      {(selectedState || selectedProduct || selectedClient) && (
        <div className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl mb-4 text-indigo-400 font-mono flex-wrap bg-indigo-500/10 border border-indigo-505/20`}>
          <SlidersHorizontal className="w-4 h-4 animate-pulse shrink-0" />
          <span>Filtros Drilled de Drill-Down ativos:</span>
          {selectedState && (
            <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
              Estado: {selectedState}
              <button onClick={() => setSelectedState(null)} className="hover:text-amber-300 font-bold ml-1">×</button>
            </span>
          )}
          {selectedProduct && (
            <span className="bg-sky-600 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
              Produto: {selectedProduct}
              <button onClick={() => setSelectedProduct(null)} className="hover:text-amber-300 font-bold ml-1">×</button>
            </span>
          )}
          {selectedClient && (
            <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
              Cliente: {selectedClient}
              <button onClick={() => setSelectedClient(null)} className="hover:text-amber-300 font-bold ml-1">×</button>
            </span>
          )}
          <button 
            onClick={() => { setSelectedState(null); setSelectedProduct(null); setSelectedClient(null); }}
            className={`ml-auto text-[10px] font-bold text-slate-500 underline hover:text-slate-300`}
          >
            Limpar Todos os Drills
          </button>
        </div>
      )}

      {/* CORE GRID EXECUTIVE LAYOUT - DENSE Bloomberg/Tableau multi-pane */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 1. THREE COLUMN PATTERN: LEFT EXEC PANEL - AI Central, Alerts & Goals (4 cols on xl) */}
        <div className="xl:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* A. Central de Inteligência Artificial */}
          <div className={`p-6 rounded-3xl border backdrop-blur-md relative overflow-hidden flex-1
            ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            {/* Glowing border accent */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
            <div className="flex items-center justify-between border-b pb-4 border-dashed border-slate-500/15 mb-4">
              <h3 className="font-display font-extrabold text-sm flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <span>CENTRAL DE INTELIGÊNCIA ARTIFICIAL IA</span>
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">RECALCULADO</span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-2 leading-relaxed">
                <span className="font-bold text-indigo-400">Resumo Executivo Auto:</span> A receita operacional cresceu <b className="text-emerald-400">14.2%</b> em termos sequenciais consolidados impulsionada por upgrades na linha <i>Cloud ERP Core</i>. No entanto, as despesas corporativas aumentaram <b className="text-rose-400">8.3%</b> com forte reflexo em serviços adicionais AWS sob demanda.
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5"><Zap className="w-3.5 h-3.5" /></span>
                  <div>
                    <h4 className="font-semibold text-slate-200">Oportunidade de Crescimento</h4>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-snug`}>Aumento expressivo no ROI de Google Ads (4.8x) indica margem de sobrecompra e escala de lead pipelines para Inside Sales.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="p-1 rounded-full bg-rose-500/10 text-rose-400 mt-0.5"><AlertTriangle className="w-3.5 h-3.5" /></span>
                  <div>
                    <h4 className="font-semibold text-slate-200">Alertas Financeiros & Riscos</h4>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-snug`}>Existe risco imediato de leve queda de margem corporativa líquida nos próximos 60 dias devido a reajustes salariais gerais de CLT.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="p-1 rounded-full bg-amber-500/10 text-amber-500 mt-0.5"><TrendingDown className="w-3.5 h-3.5" /></span>
                  <div>
                    <h4 className="font-semibold text-slate-200">Quedas de Desempenho</h4>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-snug`}>As despesas gerais de OpEx sofreram desvio padrão de segurança e se encontram 11% acima do histórico normal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="p-1 rounded-full bg-blue-500/10 text-blue-400 mt-0.5"><CheckCircle className="w-3.5 h-3.5" /></span>
                  <div>
                    <h4 className="font-semibold text-slate-200">Sugestões Estratégicas</h4>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-snug`}>Redirecionar OPEX excessivo de contratação para automação de SLA de atendimento com chatbots para neutralizar CAC.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* B. Painel de Alertas Críticos */}
          <div className={`p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md
            ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
            <div className="flex items-center justify-between border-b pb-3 border-dashed border-slate-500/15 mb-4">
              <h3 className="font-display font-extrabold text-sm flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>PAINEL DE ALERTAS ATIVOS AD</span>
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            </div>

            <div className="space-y-3 text-xs leading-normal">
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/10">
                <span className="font-semibold">Média de Cloud R$ 15k acima!</span>
                <span className="font-mono text-[9px] bg-rose-500/20 px-2 py-0.5 rounded-md uppercase font-bold">ALTO</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                <span>Variação anormal de Ticket no RJ (-2%)</span>
                <span className="font-mono text-[9px] bg-amber-500/20 px-2 py-0.5 rounded-md uppercase font-bold">MÉDIO</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
                <span>Meta Regional Sul na linha de perigo</span>
                <span className="font-mono text-[9px] bg-blue-500/20 px-2 py-0.5 rounded-md uppercase font-bold">INFO</span>
              </div>
            </div>
          </div>

          {/* C. Painel de Metas e Previsões Corporativas */}
          <div className={`p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md
            ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
            <div className="flex items-center justify-between border-b pb-3 border-dashed border-slate-500/15 mb-4">
              <h3 className="font-display font-extrabold text-sm flex items-center gap-2 text-sky-400">
                <Coins className="w-5 h-5 text-sky-500" />
                <span>METAS & PREVISÕES FUTURAS IA</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Progress bar metrics (Panel de Metas) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Meta Trimestral Corporativa</span>
                  <span className="font-mono font-bold text-sky-400">{fmtBRL(10000000 * factor)} / {fmtBRL(10842000 * factor)} (108%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-650 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Meta Anual (Acumulado)</span>
                  <span className="font-mono font-bold text-purple-400">{fmtBRL(35429000 * factor)} / {fmtBRL(40000000 * factor)} (88%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-650 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              {/* Scenarios Predictions Panel */}
              <div className="bg-slate-500/5 p-3 rounded-2xl border border-dashed border-slate-500/10 space-y-2">
                <h4 className="font-semibold text-sky-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Cenários IA de Próximos 12m:
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                  <div className="bg-emerald-500/5 p-1 rounded-lg border border-emerald-500/10">
                    <span className="text-emerald-400 font-bold block">Otimista</span>
                    <span className="font-mono block">{fmtBRL(4850000 * factor)}</span>
                  </div>
                  <div className="bg-blue-500/5 p-1 rounded-lg border border-blue-500/10">
                    <span className="text-blue-400 font-bold block">Provável</span>
                    <span className="font-mono block">{fmtBRL(4150000 * factor)}</span>
                  </div>
                  <div className="bg-rose-500/5 p-1 rounded-lg border border-rose-500/10">
                    <span className="text-rose-400 font-bold block">Pessimista</span>
                    <span className="font-mono block">{fmtBRL(3410000 * factor)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 2. THE MASTER TABBED GRIDS PANEL (8 cols on xl) */}
        <div className="xl:col-span-8 flex flex-col justify-between">
          
          {/* TAB BUTTONS BAR - Styled beautifully like Tableau menu rails */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/40 rounded-2xl border border-slate-800/80 mb-6 font-display overflow-x-auto">
            <button 
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'trends' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Evolutivos & Previsões IA</span>
            </button>
            <button 
              onClick={() => setActiveTab('geo')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'geo' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Mapa Geográfico & Unidades</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'products' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Table className="w-4 h-4" />
              <span>Canais, Clientes & ABC</span>
            </button>
            <button 
              onClick={() => setActiveTab('heatmaps')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'heatmaps' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Flame className="w-4 h-4" />
              <span>Heatmaps de Matriz</span>
            </button>
            <button 
              onClick={() => setActiveTab('costs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'costs' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Compass className="w-4 h-4" />
              <span>Custos & Departamentos</span>
            </button>
            <button 
              onClick={() => setActiveTab('anomaly')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                ${activeTab === 'anomaly' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Anomalias & Outliers</span>
            </button>
          </div>

          {/* ACTIVE TAB GRIDS BOX */}
          <div className="flex-1 min-h-[460px]">
            
            {/* TAB 1: FINANCES TRENDS & IA FORECASTS */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                
                {/* Visual Group Row 1: Evolução Financeira 12M & Ano Atual vs Ano Anterior */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Evolução Financeira 12 Meses */}
                  <div className={`p-6 rounded-3xl border relative ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-extrabold text-sm">1. Evolução Financeira LTM (12 Meses)</h4>
                      <div className="flex gap-1.5">
                        <button onClick={() => triggerExport('excel', 'Financeiro 12M')} className="text-slate-400 hover:text-white p-1 rounded" title="Excel"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financial12Months} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorEvol1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEevolProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: '#334155', fontSize: 11 }} />
                          <Area type="monotone" name="Receita" dataKey="Receita" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEvol1)" />
                          <Area type="monotone" name="Lucro Operacional" dataKey="Lucro" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEevolProfit)" />
                          <Line type="monotone" name="EBITDA" dataKey="EBITDA" stroke="#a78bfa" strokeWidth={1.5} dot={{ r: 2 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Comparativo Ano Atual vs Anterior */}
                  <div className={`p-6 rounded-3xl border relative ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-extrabold text-sm">2. Comparativo Ano Atual vs Ano Anterior</h4>
                      <button onClick={() => triggerExport('csv', 'Comparativo Anual')} className="text-slate-400 hover:text-white p-1 rounded" title="CSV"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={compareYears} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="month" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderColor: '#334155', fontSize: 11 }} />
                          <Line type="monotone" name="Ano Atual (LTM)" dataKey="AnoAtual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                          <Line type="monotone" name="Ano Anterior" strokeDasharray="4 4" dataKey="AnoAnterior" stroke="#64748b" strokeWidth={1.5} dot={{ r: 1 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Visual Group Row 2: Sazonalidade & Forecast Predict 12M */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Chart 19: Análise de Sazonalidade */}
                  <div className={`p-6 rounded-3xl border relative ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">19. Análise de Sazonalidade e Velocidade Semanal</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'S1-Início', volume: 84 * factor },
                          { name: 'S2-Aceleração', volume: 112 * factor },
                          { name: 'S3-Estável', volume: 139 * factor },
                          { name: 'S4-Fechamentos', volume: 184 * factor }
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area type="monotone" name="Volume Operacional" dataKey="volume" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 20 & 21: Forecast IA 12M & Tendência linear */}
                  <div className={`p-6 rounded-3xl border relative ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-extrabold text-sm">20/21. Forecast IA Predição & Tendência Próximos 12 meses</h4>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase">Intervalos de Confiança: 93%</span>
                    </div>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financial12Months} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <Tooltip />
                          {/* Real sequence up to May */}
                          <Area type="monotone" name="Faturamento Real" dataKey="Receita" stroke="#3b82f6" fill="none" strokeWidth={2.5} />
                          {/* Forecast sequence with dashed projections */}
                          <Area type="monotone" name="Projeção IA Modelada" dataKey="Projecao" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="5 5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: GEOGRAPHIC BREAKDOWN & MAPS */}
            {activeTab === 'geo' && (
              <div className="space-y-6">
                
                {/* Row 1: Interactive Geographic Brazil Map (Chart 15) */}
                <div className={`p-6 rounded-3xl border relative ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-display font-extrabold text-sm">15. Mapa Geográfico Corporativo Interativo de BI</h4>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} leading-tight`}>Pressione nos estados dinâmicos para executar drill-down OLAP!</p>
                    </div>
                    <div className="flex gap-2.5">
                      <button onClick={() => triggerExport('png', 'Mapa Geográfico')} className="text-slate-400 hover:text-white p-1 rounded" title="Baixar PNG"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* SVG Brasil Map - Interactive regions & state vector layouts */}
                    <div className="md:col-span-7 flex justify-center py-4 bg-slate-950/20 rounded-2xl border border-slate-500/5 relative select-none">
                      <svg width="240" height="240" viewBox="0 0 500 500" className="opacity-90 overflow-visible transition-all">
                        {/* AM (Norte) */}
                        <path 
                          d="M100 130 L180 100 L210 150 L140 220 L70 170 Z" 
                          fill={selectedState === 'AM' ? '#8b5cf6' : '#22c55e'} 
                          stroke="#1e293b" 
                          strokeWidth="3" 
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleMapStateClick('AM')}
                        />
                        <text x="135" y="150" fill="white" fontSize="16" fontWeight="bold" className="pointer-events-none">AM</text>

                        {/* PE (Nordeste) */}
                        <path 
                          d="M320 120 L390 100 L410 160 L340 180 Z" 
                          fill={selectedState === 'PE' ? '#8b5cf6' : '#0ea5e9'} 
                          stroke="#1e293b" 
                          strokeWidth="3" 
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleMapStateClick('PE')}
                        />
                        <text x="360" y="145" fill="white" fontSize="16" fontWeight="bold" className="pointer-events-none">PE</text>

                        {/* SP (Sudeste) */}
                        <path 
                          d="M250 280 L320 270 L340 330 L270 340 Z" 
                          fill={selectedState === 'SP' ? '#8b5cf6' : '#3b82f6'} 
                          stroke="#1e293b" 
                          strokeWidth="3" 
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleMapStateClick('SP')}
                        />
                        <text x="290" y="310" fill="white" fontSize="16" fontWeight="bold" className="pointer-events-none">SP</text>

                        {/* RS (Sul) */}
                        <path 
                          d="M230 360 L290 350 L310 410 L250 420 Z" 
                          fill={selectedState === 'RS' ? '#8b5cf6' : '#ec4899'} 
                          stroke="#1e293b" 
                          strokeWidth="3" 
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleMapStateClick('RS')}
                        />
                        <text x="265" y="390" fill="white" fontSize="16" fontWeight="bold" className="pointer-events-none">RS</text>

                        {/* DF (Centro-Oeste) */}
                        <path 
                          d="M230 200 L290 190 L300 250 L240 260 Z" 
                          fill={selectedState === 'DF' ? '#8b5cf6' : '#f59e0b'} 
                          stroke="#1e293b" 
                          strokeWidth="3" 
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleMapStateClick('DF')}
                        />
                        <text x="260" y="235" fill="white" fontSize="16" fontWeight="bold" className="pointer-events-none">DF</text>
                      </svg>
                    </div>

                    {/* Drill-down state description list */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Mapeamento Regional</span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">Total Brasil LTM</span>
                          <span className="font-mono font-bold text-emerald-405">{fmtBRL(3542900 * factor)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {getFilteredCities().map((city, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-slate-500/5 transition-all">
                            <span className="font-semibold text-slate-300">{city.name}</span>
                            <span className="font-mono text-emerald-400 font-bold">{fmtBRL(city.Receita)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Row 2: Charts 3, 4, 5, 6, 23 (Region, State, Cidade, Unidades, Branch Comparatives) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 3 & 4 & 6: Receita por Região e Estado */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">3/4. Volume de Receita por Região e Estado Consolidado</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionalDistribution} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis type="number" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis type="category" dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                          <Tooltip formatter={(value: any) => fmtBRL(Number(value))} />
                          <Bar dataKey="Receita" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                            {regionalDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 23 & 6: Comparativo entre Unidades / Filiais */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">6/23. Comparativo Financeiro entre Filiais / Unidades de BI</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={unitCompare} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <Tooltip formatter={(value: any) => fmtBRL(Number(value))} />
                          <Bar dataKey="Faturamento" fill="#06b6d4" name="Realizado" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Custos" fill="#ef4444" name="OpEx Consumido" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: PRODUCTS MIX, CHANNELS & ABC CURVES */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Row 1: Sell Products, Categories and Channels (Chart 7, 8, 9, 10) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 7/8 Product Mix & Categorias */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4 font-sans">7/8. Faturamento por Produto & Categoria SaaS</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productMix}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {productMix.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => fmtBRL(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* legend labels */}
                    <div className="flex flex-wrap gap-2 justify-center mt-3 text-[10px]">
                      {productMix.map((p, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-slate-400 font-semibold">{p.name} ({fmtBRL(p.value)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chart 9/10 Channels & Sellers faturamento */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">9/10. Receita por Canal de Venda e Performance de Vendedores</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesChannels} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <Tooltip formatter={(value: any) => fmtBRL(Number(value))} />
                          <Bar dataKey="Receita" fill="#8b5cf6" name="Faturamento no Canal" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Row 2: ABCCurve & Stacked funnels (Chart 13 & 14) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 13: Curva ABC de Lucratividade */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-extrabold text-sm">13. Curva ABC Acumulada de Produtos</h4>
                      <span className="text-[9px] bg-sky-500/10 text-sky-400 font-bold px-2 py-0.5 rounded-full uppercase">80% da receita: Classe A</span>
                    </div>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={abcProductsCurved}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 8 }} />
                          <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                          <Tooltip />
                          <Area type="monotone" name="Acúmulo de Share (%)" dataKey="accum" fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 14: Commercial Conversion Funnel */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">14. Funil de Conversão Comercial de Oportunidades</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionFunnel} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis type="number" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis type="category" dataKey="stage" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                          <Tooltip />
                          <Bar dataKey="Qtd" fill="#10b981" radius={[0, 4, 4, 0]}>
                            {conversionFunnel.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: HEATMAPS & VELOCITY MATRICES */}
            {activeTab === 'heatmaps' && (
              <div className="space-y-6">
                
                {/* Visual heatmaps (Chart 16 & 17 & 18) represented as dense professional BI matrices */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-display font-extrabold text-sm">16/17/18. Heatmaps de Performance, Vendas & Matriz Financeira</h4>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} leading-tight`}>Velocidade de atividade corporativa (Colunas: Dias úteis, Linhas: Unidades)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Performance Heatmap */}
                    <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-500/5">
                      <span className="text-[10px] uppercase font-mono font-bold text-sky-400 block mb-2">Matriz de Performance (Ocorrências)</span>
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-semibold">
                        <div className="p-2 text-slate-500">Unidade</div>
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg">Seg-Ter</div>
                        <div className="p-2 bg-emerald-500/30 text-emerald-300 border border-emerald-500/20 rounded-lg">Qua-Qui</div>
                        <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">Sex-Sáb</div>

                        <div className="p-2 text-slate-400 text-left">Matriz SP</div>
                        <div className="p-2 bg-emerald-600/50 text-white rounded-lg">98%</div>
                        <div className="p-2 bg-emerald-500/40 text-white rounded-lg">92%</div>
                        <div className="p-2 bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg">84%</div>

                        <div className="p-2 text-slate-400 text-left">Filial RS</div>
                        <div className="p-2 bg-emerald-500/30 text-white rounded-lg">88%</div>
                        <div className="p-2 bg-emerald-600/40 text-white rounded-lg">94%</div>
                        <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg">71%</div>

                        <div className="p-2 text-slate-400 text-left">Filial RJ</div>
                        <div className="p-2 bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg">81%</div>
                        <div className="p-2 bg-emerald-500/30 text-white rounded-lg">85%</div>
                        <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg">68%</div>
                      </div>
                    </div>

                    {/* Vendas & Finance Heatmap (Chart 17 & 18) */}
                    <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-500/5">
                      <span className="text-[10px] uppercase font-mono font-bold text-purple-400 block mb-2">Matriz Financeira (Rentabilidade por Canal)</span>
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-semibold">
                        <div className="p-2 text-slate-500">Unidade</div>
                        <div className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg">Inside Sales</div>
                        <div className="p-2 bg-purple-500/30 text-purple-300 border border-purple-500/20 rounded-lg">Checkout</div>
                        <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">Enterprise</div>

                        <div className="p-2 text-slate-400 text-left">Matriz SP</div>
                        <div className="p-2 bg-purple-600/50 text-white rounded-lg">41%</div>
                        <div className="p-2 bg-purple-500/40 text-white rounded-lg">38%</div>
                        <div className="p-2 bg-purple-500/30 text-white rounded-lg">34%</div>

                        <div className="p-2 text-slate-400 text-left">Filial RS</div>
                        <div className="p-2 bg-purple-500/30 text-white rounded-lg">32%</div>
                        <div className="p-2 bg-purple-500/20 text-white rounded-lg">28%</div>
                        <div className="p-2 bg-rose-505/20 text-rose-400 border border-rose-500/25 rounded-lg">21%</div>

                        <div className="p-2 text-slate-400 text-left">Filial RJ</div>
                        <div className="p-2 bg-purple-500/20 text-white rounded-lg">26%</div>
                        <div className="p-2 bg-purple-500/30 text-white rounded-lg">29%</div>
                        <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg">18%</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: COSTS & DEPARTMENTS COMPARATIVES */}
            {activeTab === 'costs' && (
              <div className="space-y-6">
                
                {/* Cost Distribution & Centers (Chart 26 & 27) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Costs Donut */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">26/27. Distribuição de Custos por Centro de Custo OpEx</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costCenters}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {costCenters.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => fmtBRL(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Departments Comparison (Chart 24) */}
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="font-display font-extrabold text-sm mb-4">24. Radar comparativo entre Departamentos e SLA</h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={departmentCompare}>
                          <PolarGrid stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? '#94a3b8' : '#64748b'} style={{ fontSize: 9 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} style={{ fontSize: 8 }} />
                          <Radar name="Atual" dataKey="Atual" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                          <Radar name="Meta Target" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeDasharray="3 3" />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Margins breakdown (Chart 28 & 29 & 30) */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h4 className="font-display font-extrabold text-sm mb-4">28/29/30. Margens por Produto, Cliente e Rentabilidade por Unidade</h4>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productMix} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="name" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                        <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                        <Tooltip formatter={(value: any) => `${value}%`} />
                        <Bar dataKey="margin" name="Margem (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: OUTLIERS & ANOMALY DETECTIONS */}
            {activeTab === 'anomaly' && (
              <div className="space-y-6">
                
                {/* Outliers mapping (Chart 22 & 25) */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-display font-extrabold text-sm">22. Algoritmo IA de Detecção de Anomalias e Pontos Outliers</h4>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} leading-tight`}>Flutuações inesperadas sob auditoria sistêmica.</p>
                    </div>
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">2 Desvios Críticos</span>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis type="number" dataKey="x" name="Custo Operacional LTM" unit="k" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                        <YAxis type="number" dataKey="y" name="Variação de Despesa" unit="%" stroke={isDarkMode ? '#64748b' : '#94a3b8'} style={{ fontSize: 9 }} />
                        <ZAxis type="number" dataKey="size" range={[60, 400]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        {/* Highlights outliers using bright red cells */}
                        <Scatter name="Atividades" data={anomaliesScatterList} fill="#f43f5e">
                          {anomaliesScatterList.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.type === 'alert' || entry.type === 'warning' ? '#f43f5e' : '#10b981'} 
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Outlier descriptions lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anomaliesScatterList.filter(e => e.type === 'alert' || e.type === 'warning').map((anom, idx) => (
                    <div key={idx} className="p-3 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-start gap-2.5">
                      <span className="p-1 rounded-full bg-red-500/15 text-red-400 mt-0.5">⚠️</span>
                      <div>
                        <h5 className="font-bold text-xs text-red-300">{anom.name}</h5>
                        <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-0.5 leading-snug`}>Identificamos picos que ultrapassam 2.5 desvios padrões normais no histórico do período.</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. ADDITIONAL EXECUTIVE TABLES SECTION (Rankings of customers, products, branches, etc.) */}
      <div className={`mt-8 p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md
        ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4 border-dashed border-slate-500/15 mb-6">
          <div>
            <h4 className="font-display font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-indigo-400">
              <Table className="w-5 h-5 text-indigo-500" />
              <span>TABELAS EXECUTIVAS DE RANKING CORPORATIVO INTEGRADO</span>
            </h4>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1`}>Top records e rankings para suporte em decisões e follow up comercial.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => triggerExport('excel', 'Tabelas Executivas')} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-2xs cursor-pointer font-bold transition-all shadow-md shadow-indigo-600/10">
              <Download className="w-3.5 h-3.5" />
              <span>Exportar XLS Executivo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column A: Ranking de Clientes */}
          <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-500/5 overflow-hidden">
            <span className="text-[10px] font-mono tracking-wider text-sky-400 font-bold block mb-3 uppercase">RANKING DE CLIENTES (TOP 20)</span>
            <div className="overflow-x-auto max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
              {clientsList.slice(0, 10).map((client) => (
                <div key={client.rank} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-500/5 transition-all">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-sky-500/15 text-sky-400 font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">{client.rank}</span>
                    <span className="font-semibold text-slate-350 truncate max-w-[120px]">{client.name}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{fmtBRL(client.billing)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Ranking de Produtos & Equipes */}
          <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-500/5 overflow-hidden">
            <span className="text-[10px] font-mono tracking-wider text-purple-400 font-bold block mb-3 uppercase">RANKING DE PRODUTOS & EQUIPES</span>
            <div className="overflow-x-auto max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
              {abcProductsCurved.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-500/5 transition-all">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-purple-500/15 text-purple-400 font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="font-semibold text-slate-350 truncate max-w-[120px]">{prod.name}</span>
                  </span>
                  <div className="flex gap-1">
                    <span className="font-mono font-bold text-slate-400">{fmtBRL(prod.value)}</span>
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${prod.class === 'A' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>Classe {prod.class}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column C: Ranking de Vendedores & Filiais */}
          <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-500/5 overflow-hidden">
            <span className="text-[10px] font-mono tracking-wider text-amber-500 font-bold block mb-3 uppercase">RANKING DE VENDEDORES & FILIAIS</span>
            <div className="overflow-x-auto max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
              {sellersList.map((seller, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-500/5 transition-all">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-amber-500/15 text-amber-500 font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="font-semibold text-slate-350 truncate max-w-[120px]">{seller.name}</span>
                  </span>
                  <div className="flex gap-1.5 items-center font-mono">
                    <span className="text-emerald-400 font-bold">{fmtBRL(seller.Vendas)}</span>
                    <span className="text-[9px] text-slate-500 text-right">({seller.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
