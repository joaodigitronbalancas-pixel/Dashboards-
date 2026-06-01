import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Share2, 
  Download, 
  CalendarRange, 
  Fullscreen, 
  Copy, 
  Clock, 
  Heart, 
  AlertCircle,
  PlusCircle, 
  Trash2, 
  HelpCircle, 
  Maximize2, 
  Minimize2,
  CalendarDays,
  FileCheck2,
  Sparkles,
  Database,
  Building2,
  Lock,
  MessageSquare,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import BiCharts from './components/BiCharts';
import AiAnalyst from './components/AiAnalyst';
import ConfigModal from './components/ConfigModal';
import ExecutiveKpis from './components/ExecutiveKpis';
import ExecutiveIntelligence from './components/ExecutiveIntelligence';
import AutomationsWorkspace from './components/AutomationsWorkspace';

import { User, AdvancedFilter, SectorType, Dashboard, Comment, ScheduledReport } from './types';

export default function App() {
  // Session Identity State (Defaults to DIRETORIA for full-feature modeling)
  const [user, setUser] = useState<User>({
    id: 'u1',
    name: 'Eduardo Silva',
    email: 'joao.digitronbalancas@gmail.com',
    role: 'DIRETORIA',
    companyId: 'comp-1',
    permissions: ['read:global', 'write:filters', 'export']
  });

  // Filter systems
  const [activeSector, setActiveSector] = useState<SectorType>('COMERCIAL');
  const [activeFilters, setActiveFilters] = useState<AdvancedFilter>({
    period: 'this_month',
    companyId: 'comp-1',
    unit: 'Matriz SP',
    region: 'Todas',
    category: 'Todas',
    product: 'Todos'
  });

  // Toggle view between Sector Dashboard (original) and Global Executive intelligence (Enterprise)
  const [workspaceTab, setWorkspaceTab] = useState<'executive' | 'sector'>('executive');
  const [activeView, setActiveView] = useState<'bi' | 'automations'>('bi');

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layout Configuration modal toggles
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configModalTab, setConfigModalTab] = useState('connectors');

  // Dashboards & widgets listing
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [sectorData, setSectorData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Collaboration Panel: Comments list
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Auxiliary Popup Panel triggers
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);

  // Widget creation panel states
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetType, setNewWidgetType] = useState<'kpi' | 'bar' | 'line'>('kpi');
  const [newWidgetMetric, setNewWidgetMetric] = useState('');

  // 1. Load active list of Dashboards
  const fetchDashboards = async () => {
    try {
      const res = await fetch('/api/dashboards');
      const data = await res.json();
      setDashboards(data);
    } catch (err) {
      console.error('Failed to get dashboards list:', err);
    }
  };

  // 2. Query KPIs data based on active filters and active sector
  const querySectorData = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          ...activeFilters
        })
      });
      const data = await res.json();
      setSectorData(data);
    } catch (err) {
      console.error('Failed to query sector data metrics:', err);
    } finally {
      // Small luxurious timeout delay to make visual loading indicator apparent e.g., Power BI recalculations
      setTimeout(() => {
        setIsLoadingData(false);
      }, 400);
    }
  };

  // 3. Get collaboration comments for active dashboard ID
  const queryComments = async () => {
    try {
      const activeDashId = activeSector.toLowerCase();
      const res = await fetch(`/api/comments/${activeDashId}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to read comments trail', err);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  useEffect(() => {
    querySectorData();
    queryComments();
  }, [activeSector, activeFilters]);

  // Synchronize dynamic sector mapping on custom templates
  const activeDashboard = dashboards.find(d => d.sector === activeSector) || dashboards[0];

  // Exporters Logic (Excel / CSV representation downloader)
  const handleExportCSV = () => {
    if (!sectorData) return;
    
    let headers = "Métrica;Contexto;Valor Calculado;Progresso vs Meta\n";
    let rows = "";

    if (activeSector === 'COMERCIAL') {
      rows = `Faturamento;${activeFilters.unit};R$ ${sectorData.revenue.toLocaleString()};+7.2% acima da Meta\n` +
             `Ticket Médio;${activeFilters.unit};R$ ${sectorData.averageTicket.toLocaleString()};Mix Variável\n` +
             `Taxa Conversão;${activeFilters.unit};${sectorData.conversionRate}%;Ideal\n`;
    } else if (activeSector === 'FINANCEIRO') {
      rows = `Receita Operacional;${activeFilters.unit};R$ ${sectorData.revenue.toLocaleString()};Consolidado\n` +
             `Despesas OpEx;${activeFilters.unit};R$ ${sectorData.expenses.toLocaleString()};Ajustado\n` +
             `Lucro Líquido;${activeFilters.unit};R$ ${sectorData.profit.toLocaleString()};Margem ${sectorData.margin}%\n`;
    } else {
      rows = `OEE Fábrica;${activeFilters.unit};${sectorData.oee || 82.4}%;World Class Benchmark\n` +
             `Qualidade;${activeFilters.unit};${sectorData.quality || 99.4}%;Refugo Mínimo\n`;
    }

    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.id = "csv-download-trigger";
    link.setAttribute("href", url);
    link.setAttribute("download", `metrix_relatorio_${activeSector.toLowerCase()}_${activeFilters.unit.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Duplicate active dashboard (Adding customizable copies to our portfolio list)
  const handleDuplicateDashboard = async () => {
    if (!activeDashboard) return;
    
    const duplicate = {
      ...activeDashboard,
      id: "dash-dup-" + Date.now(),
      title: `${activeDashboard.title} (Cópia)`,
      isFavorite: false,
    };

    try {
      const res = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicate)
      });
      if (res.ok) {
        alert(`Dashboard "${duplicate.title}" duplicado com sucesso no Workspace!`);
        fetchDashboards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add customized KPI Widget live (Visual feeling of Power BI element creation)
  const handleAddCustomWidget = () => {
    if (!newWidgetTitle.trim() || !activeDashboard) return;

    const newWidget = {
      id: "w-cust-" + Date.now(),
      title: newWidgetTitle,
      type: newWidgetType,
      w: newWidgetType === 'kpi' ? 3 : 6,
      h: 1,
      metric: newWidgetMetric || "custom_measure"
    };

    const updatedDash = {
      ...activeDashboard,
      widgets: [...activeDashboard.widgets, newWidget]
    };

    // Reflect locally
    setDashboards(prev => prev.map(d => d.id === activeDashboard.id ? updatedDash : d));
    setNewWidgetTitle('');
    setShowAddWidget(false);
    alert(`Métrica personalizada "${newWidget.title}" anexada ao grid layout.`);
  };

  // Favorite toggle helper
  const handleToggleFavorite = async () => {
    if (!activeDashboard) return;
    const updated = { ...activeDashboard, isFavorite: !activeDashboard.isFavorite };
    
    try {
      const res = await fetch(`/api/dashboards/${activeDashboard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: updated.isFavorite })
      });
      if (res.ok) {
        setDashboards(prev => prev.map(d => d.id === activeDashboard.id ? updated : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compartilhar clipboard action
  const handleCopyShareLink = () => {
    const link = `${window.location.origin}/share/${activeSector.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Save report scheduling schema
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: ScheduledReport = {
      id: "sch-" + Date.now(),
      dashboardId: activeSector.toLowerCase(),
      dashboardTitle: activeDashboard?.title || activeSector,
      frequency: 'weekly',
      recipients: [user.email],
      format: 'PDF',
      time: '08:00',
      active: true
    };
    setScheduledReports(prev => [...prev, newReport]);
    setShowSchedulePopup(false);
    alert(`Agendamento corporativo ativo! Meta-relatórios serão encaminhados para ${user.email}.`);
  };

  // Comments submit engine
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId: activeSector.toLowerCase(),
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          content: newCommentText
        })
      });
      if (res.ok) {
        setNewCommentText('');
        queryComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openSettingsFromSidebar = (tabName: string) => {
    setConfigModalTab(tabName);
    setIsConfigModalOpen(true);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('bi-main-dashboard-grid');
    if (!element) return;
    
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. Left Collapsible Menu Sidebar */}
      <Sidebar 
        activeSector={activeSector}
        setActiveSector={setActiveSector}
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
        onOpenSettings={openSettingsFromSidebar}
        isDarkMode={isDarkMode}
      />

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Top Navigation Bar (Header) with complex global filters */}
        <Header 
          user={user}
          setUser={setUser}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenSettings={openSettingsFromSidebar}
          dashboardsList={dashboards}
          setActiveSector={setActiveSector}
        />

        {/* 3. Dashboard Workspace with Real-Time Loader, Grid customizer and IA Expert */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {activeView === 'automations' ? (
            <AutomationsWorkspace isDarkMode={isDarkMode} activeFilters={activeFilters} />
          ) : (
            <>
              {/* Dashboard Meta Bar (Power BI Toolbar) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-6 border-dashed border-slate-500/15" id="bi-meta-ribbon-toolbar">
            <div className="select-text">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl bg-gradient-to-tr text-white from-blue-600 to-indigo-600`}>
                  <BarChart3 className="w-5 h-5" />
                </span>
                <h2 className="font-display font-extrabold text-xl tracking-tight leading-none bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent dark:text-inherit">
                  {activeDashboard?.title || `Painel Corporativo: ${activeSector}`}
                </h2>
                
                {/* Public / Private Badge */}
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border
                  ${activeDashboard?.isPublic 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/25'}`}
                >
                  {activeDashboard?.isPublic ? 'Público' : 'Corporativo Privado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-display leading-tight">{activeDashboard?.description}</p>
            </div>

            {/* Quick Actions Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Add Custom Measure / Metrics widget (Enterprise feel!) */}
              <button
                id="btn-add-kpi-widget"
                onClick={() => setShowAddWidget(!showAddWidget)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border font-display transition-colors cursor-pointer
                  ${isDarkMode 
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-220 bg-white hover:bg-slate-50 text-slate-700'}`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>Criar Métrica</span>
              </button>

              {/* Duplicate Dashboard */}
              <button
                id="btn-duplicate-dashboard"
                onClick={handleDuplicateDashboard}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border font-display transition-colors cursor-pointer
                  ${isDarkMode 
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300' 
                    : 'border-slate-220 bg-white hover:bg-slate-50 text-slate-600'}`}
                title="Criar cópia idêntica no workspace"
              >
                <span>Duplicar</span>
              </button>

              {/* Toggle Favorite Dashboard */}
              <button
                id="btn-favorite-dashboard"
                onClick={handleToggleFavorite}
                className={`flex items-center gap-1.5 p-2 rounded-xl border transition-colors cursor-pointer
                  ${isDarkMode 
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800' 
                    : 'border-slate-220 bg-white hover:bg-slate-50'}
                  ${activeDashboard?.isFavorite ? 'text-red-500 hover:text-red-400' : 'text-slate-400 hover:text-slate-200'}`}
                title="Favoritar painel"
              >
                <Heart className={`w-4 h-4 ${activeDashboard?.isFavorite ? 'fill-red-500' : ''}`} />
              </button>

              {/* Fullscreen Trigger */}
              <button
                id="btn-toggle-fullscreen"
                onClick={toggleFullscreen}
                className={`flex items-center gap-1.5 p-2 rounded-xl border transition-colors cursor-pointer
                  ${isDarkMode ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300' : 'border-slate-220 bg-white hover:bg-slate-50 text-slate-600'}`}
                title="Alternar Tela Cheia"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Schedule Recurring Report */}
              <div className="relative">
                <button
                  id="btn-trigger-schedule-report"
                  onClick={() => { setShowSchedulePopup(!showSchedulePopup); setShowSharePopup(false); }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border font-display transition-colors cursor-pointer
                    ${isDarkMode 
                      ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300' 
                      : 'border-slate-220 bg-white hover:bg-slate-50 text-slate-600'}`}
                >
                  <CalendarDays className="w-4 h-4 text-purple-500" />
                  <span>Agendar Relatório</span>
                </button>
                
                {showSchedulePopup && (
                  <form onSubmit={handleSaveSchedule} className={`absolute top-11 right-0 rounded-2xl border p-4 shadow-2xl w-80 mt-1 z-40 animate-in fade-in slide-in-from-top-1
                    ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    <h4 className="font-display font-bold text-xs flex items-center gap-1.5 mb-3">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>Agendador Cron Automático</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight mb-3">Gere relatórios executivos em formato PDF anexados semanalmente e envie nos contatos do tenant.</p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">E-mail Corporativo</label>
                        <input type="email" required defaultValue={user.email} className={`w-full p-2 border rounded-xl text-xs bg-transparent focus:outline-none ${isDarkMode ? 'border-slate-800' : 'border-slate-220'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">Periodicidade</label>
                          <select className={`w-full p-2 border rounded-xl text-xs bg-transparent ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-220 bg-white'}`}>
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">Formato</label>
                          <select className={`w-full p-2 border rounded-xl text-xs bg-transparent ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-220 bg-white'}`}>
                            <option value="PDF">PDF de Alta Def</option>
                            <option value="XLS">Excel Geral (XLSX)</option>
                            <option value="PNG">Imagem PNG</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-4 p-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs transition-colors hover:bg-purple-500 shadow-md shadow-purple-500/15 cursor-pointer">
                      Ativar Envio Automático
                    </button>
                  </form>
                )}
              </div>

              {/* Share Options Trigger */}
              <div className="relative">
                <button
                  id="btn-trigger-share-dashboard"
                  onClick={() => { setShowSharePopup(!showSharePopup); setShowSchedulePopup(false); }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border font-display transition-colors cursor-pointer
                    ${isDarkMode 
                      ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300' 
                      : 'border-slate-220 bg-white hover:bg-slate-50 text-slate-600'}`}
                >
                  <Share2 className="w-4 h-4 text-blue-500" />
                  <span>Compartilhar</span>
                </button>

                {showSharePopup && (
                  <div className={`absolute top-11 right-0 rounded-2xl border p-4 shadow-2xl w-72 mt-1 z-40 animate-in fade-in slide-in-from-top-1
                    ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    <h4 className="font-display font-bold text-xs flex items-center gap-1.5 mb-2.5">
                      <Share2 className="w-4 h-4 text-blue-500" />
                      <span>Link de Compartilhamento</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight mb-3">Usuários externos com esta credencial URL poderão consultar as métricas em formato somente leitura.</p>
                    
                    <div className={`flex items-center justify-between p-2 rounded-xl mb-3 text-xs border
                      ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200'}`}
                    >
                      <span className="font-mono text-[9px] truncate mr-2">{window.location.origin}/share/{activeSector.toLowerCase()}</span>
                      <button
                        id="btn-copy-share-url"
                        onClick={handleCopyShareLink}
                        className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        {isCopied ? <span className="text-[10px]">Copiado!</span> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-500/15">
                      <span className="text-[10px] font-semibold">Exposição Pública Ativa</span>
                      <button
                        id="btn-toggle-public-pvt"
                        onClick={() => {
                          if (activeDashboard) {
                            const val = !activeDashboard.isPublic;
                            setDashboards(prev => prev.map(d => d.id === activeDashboard.id ? { ...d, isPublic: val } : d));
                          }
                        }}
                        className={`w-9 h-5 rounded-full flex items-center transition-all p-0.5 ${activeDashboard?.isPublic ? 'bg-emerald-600 justify-end' : 'bg-slate-600 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Export (CSV) */}
              <button
                id="btn-export-csv-reports"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white font-display transition-colors shadow-md shadow-blue-500/10 cursor-pointer hover:bg-blue-500 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>

            </div>
          </div>

          {/* Inline Widget Creation Drawer Box (Mimics dynamic BI customizations) */}
          {showAddWidget && (
            <div className={`p-6 rounded-2xl border space-y-4 animate-in slide-in-from-top-2 duration-150
              ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}
              id="add-widget-form-container"
            >
              <h3 className="font-display font-extrabold text-sm flex items-center gap-1.5 text-blue-400">
                <PlusCircle className="w-4 h-4" />
                <span>Integração de Medidores e Métricas Novas (Formulário)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">Título do Widget</label>
                  <input
                    id="new-widget-input-title"
                    type="text"
                    required
                    placeholder="Ex: Conversão do Sul-RS"
                    value={newWidgetTitle}
                    onChange={(e) => setNewWidgetTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs border bg-transparent focus:outline-none ${isDarkMode ? 'border-slate-800 focus:border-blue-500 text-white' : 'border-slate-220 focus:border-blue-600'}`}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">Formato Visual</label>
                  <select
                    id="new-widget-input-type"
                    value={newWidgetType}
                    onChange={(e) => setNewWidgetType(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl text-xs border bg-transparent ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-220 bg-white'}`}
                  >
                    <option value="kpi">KPI Card (Master)</option>
                    <option value="bar">Gráfico de Barras</option>
                    <option value="line">Gráfico de Linha</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold uppercase text-slate-500 block mb-1">Fato de Medição (Coluna)</label>
                  <select
                    id="new-widget-input-metric"
                    value={newWidgetMetric}
                    onChange={(e) => setNewWidgetMetric(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs border bg-transparent ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-220 bg-white'}`}
                  >
                    <option value="revenue_new">Volume Novos Contratos</option>
                    <option value="churn_rates">Taxa de Cancelamento (Churn)</option>
                    <option value="sla_compliance_new">Índice Conformidade SLA</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    id="btn-confirm-add-widget"
                    onClick={handleAddCustomWidget}
                    className="w-full p-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/10 cursor-pointer hover:bg-emerald-500"
                  >
                    Anexar Métrica no Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE GRAPHIC WORKSPACE GRID */}
          {/* I. TOP EXECUTIVE 14 KPI CARDS BANNER */}
          <div className="mb-6">
            <ExecutiveKpis activeFilters={activeFilters} isDarkMode={isDarkMode} />
          </div>

          {/* II. BI WORKSPACE SELECTOR MODE */}
          <div className="flex items-center gap-3 p-1.5 bg-slate-900/65 rounded-2xl border border-slate-800/80 mb-6 max-w-lg select-none">
            <button
              onClick={() => setWorkspaceTab('executive')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer
                ${workspaceTab === 'executive' 
                  ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/15' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>💎 Central Executiva Enterprise</span>
            </button>
            <button
              onClick={() => setWorkspaceTab('sector')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer
                ${workspaceTab === 'sector' 
                  ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/15' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 Visão Setorial Operacional</span>
            </button>
          </div>

          {/* III. RENDER ACTIVE VIEW */}
          {workspaceTab === 'executive' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <ExecutiveIntelligence activeFilters={activeFilters} isDarkMode={isDarkMode} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div id="bi-main-dashboard-grid" className="relative">
                
                {/* Visual Screen loading overlay simulating Power BI rendering delay */}
                {isLoadingData && (
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl select-none">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-xs font-semibold text-slate-300">Recalculando matrizes multidimensionais OLAP...</p>
                    </div>
                  </div>
                )}

                {/* A. Sector KPI Numbers Cards Panel */}
                <MetricCards sector={activeSector} data={sectorData} isDarkMode={isDarkMode} />

                {/* B. Sector Structured Core Recharts Charts aggregator */}
                <BiCharts sector={activeSector} data={sectorData} isDarkMode={isDarkMode} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-8">
                {/* C. Intelligent Executive ChatGPT Copilot chatbot */}
                <div className="xl:col-span-8">
                  <AiAnalyst sectorContext={activeSector} activeFilters={activeFilters} isDarkMode={isDarkMode} />
                </div>

                {/* D. Collaboration comments sidebar for active view (Human element of Looker Studio) */}
                <div className="xl:col-span-4 flex flex-col h-[520px] rounded-2xl border p-6 justify-between mt-8
                  ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}"
                  style={{ backgroundColor: isDarkMode ? '#030712' : '#ffffff', borderColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}
                >
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="font-display font-bold text-sm flex items-center gap-1.5 border-b pb-4 border-slate-500/15">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>Colaboração Setorial</span>
                    </h3>

                    {/* Comments Scroll trail */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 my-4" id="dashboard-collab-comments">
                      {comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                          <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
                          <p className="text-xs">Nenhum comentário anexado a este relatório.</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Seja o primeiro a ponderar sobre as métricas!</p>
                        </div>
                      ) : (
                        comments.map((comm) => (
                          <div key={comm.id} className="text-xs select-text">
                            <div className="flex items-start justify-between">
                              <span className="font-bold flex items-center gap-1">
                                {comm.userName}
                                <span className="text-[9px] font-mono text-purple-400 font-semibold px-1 py-0.2 rounded bg-purple-500/10">{comm.userRole}</span>
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">{new Date(comm.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-350 dark:text-slate-400 mt-1 pl-2 border-l border-indigo-600/30 leading-normal">{comm.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Submit panel form */}
                  {user.role === 'OPERADOR' || user.role === 'CLIENTE' ? (
                    <div className="p-3.5 border border-dashed rounded-xl border-slate-500/15 bg-slate-500/5 text-[10px] text-slate-500 leading-tight">
                      🔒 Perfil **{user.role}** possui apenas permissão de visualização e não pode aprovar ou tecer feedbacks no dashboard.
                    </div>
                  ) : (
                    <form onSubmit={handleAddComment} className="flex gap-2.5 pt-4 border-t border-slate-500/10">
                      <input
                        id="input-comment-text"
                        type="text"
                        required
                        placeholder="Comente um insight ou mencione @equipe..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className={`flex-1 p-2.5 rounded-xl text-xs border bg-transparent focus:outline-none ${isDarkMode ? 'border-slate-800 focus:border-indigo-500 text-white' : 'border-slate-200 focus:border-blue-600'}`}
                      />
                      <button
                        id="btn-submit-comment"
                        type="submit"
                        className="p-2.5 rounded-xl bg-purple-600 text-white transition-colors hover:bg-purple-500 shadow-md shadow-purple-500/15 cursor-pointer"
                      >
                        Enviar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
          </>
          )}

        </main>
      </div>

      {/* 4. Modular Multi-tenant Data Config Center Modal */}
      <ConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        activeTab={configModalTab}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
