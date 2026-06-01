import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Building2, 
  Clock, 
  Calendar, 
  MapPin, 
  UserSquare2, 
  ShieldCheck, 
  Command,
  SlidersHorizontal,
  Bell,
  HelpCircle,
  FileCheck2,
  ChevronDown
} from 'lucide-react';
import { User, Company, AdvancedFilter, UserRole, SectorType, Dashboard } from '../types';

interface HeaderProps {
  user: User;
  setUser: (user: User) => void;
  activeFilters: AdvancedFilter;
  setActiveFilters: (filters: AdvancedFilter) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSettings: (tab: string) => void;
  dashboardsList: Dashboard[];
  setActiveSector: (sector: SectorType) => void;
}

export default function Header({
  user,
  setUser,
  activeFilters,
  setActiveFilters,
  isDarkMode,
  setIsDarkMode,
  onOpenSettings,
  dashboardsList,
  setActiveSector
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showCompanySelector, setShowCompanySelector] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  // Pre-configured multi-company datasets
  const companies: Company[] = [
    { id: 'comp-1', name: 'Grupão Industrial S/A', group: 'MetaTech Holding', segment: 'Manufatura & Cloud', units: ['Matriz SP', 'Filial Sul-RS', 'Filial RJ'] },
    { id: 'comp-2', name: 'Varejo Brasil Log', group: 'Nacional Retail', segment: 'Logística & Varejo', units: ['DC Campinas', 'DC Curitiba', 'DC Nordeste'] }
  ];

  const rolesList: { role: UserRole; label: string; desc: string; authLevel: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Controle total, criação e edição global', authLevel: 'Nível 1' },
    { role: 'DIRETORIA', label: 'Diretoria Executiva', desc: 'Acesso total estratégico e faturamento', authLevel: 'Nível 2' },
    { role: 'GERENTE', label: 'Gerente Operacional', desc: 'Controle setorial e aprovações', authLevel: 'Nível 3' },
    { role: 'SUPERVISOR', label: 'Supervisor Integrado', desc: 'Moderação de metas e logs básicos', authLevel: 'Nível 4' },
    { role: 'OPERADOR', label: 'Operador Padrão', desc: 'Acesso apenas a leituras específicas', authLevel: 'Nível 5' },
    { role: 'CLIENTE', label: 'Cliente Externo', desc: 'Somente dashboards públicos compartilhados', authLevel: 'Nível 6' },
  ];

  // Dynamically populate active company details
  const activeCompany = companies.find(c => c.id === activeFilters.companyId) || companies[0];

  useEffect(() => {
    // Sync company's default unit if selection becomes invalid due to tenant changes
    if (!activeCompany.units.includes(activeFilters.unit)) {
      setActiveFilters({
        ...activeFilters,
        unit: activeCompany.units[0]
      });
    }
  }, [activeFilters.companyId]);

  // Global search implementation: Matches Dashboards, Sections, Metrics, and standard items
  const handleSearchSelect = (item: { type: string; label: string; sector?: SectorType; tab?: string }) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (item.sector) {
      setActiveSector(item.sector);
    } else if (item.tab) {
      onOpenSettings(item.tab);
    }
  };

  const getSearchResults = () => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const results: { type: string; label: string; subtitle: string; sector?: SectorType; tab?: string }[] = [];

    // Search dashboards
    dashboardsList.forEach(d => {
      if (d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)) {
        results.push({
          type: 'Dashboard',
          label: d.title,
          subtitle: `Setor: ${d.sector}`,
          sector: d.sector
        });
      }
    });

    // Search sectors
    const sectors = ['COMERCIAL', 'FINANCEIRO', 'RH', 'MARKETING', 'ATENDIMENTO', 'LOGÍSTICA', 'PRODUÇÃO'];
    sectors.forEach(s => {
      if (s.toLowerCase().includes(query)) {
        results.push({
          type: 'Setor de BI',
          label: `Canal ${s.charAt(0) + s.slice(1).toLowerCase()}`,
          subtitle: `Ver métricas de ${s}`,
          sector: s as SectorType
        });
      }
    });

    // Search metrics
    const metrics = [
      { name: 'Faturamento / Vendas', sec: 'COMERCIAL' as const },
      { name: 'OEE / Eficiência', sec: 'PRODUÇÃO' as const },
      { name: 'Fluxo de Caixa / Lucros', sec: 'FINANCEIRO' as const },
      { name: 'Turnover / Absenteísmo / CLT', sec: 'RH' as const },
      { name: 'Leads / ROI / Ads CAC', sec: 'MARKETING' as const },
      { name: 'NPS de Suporte / SLA', sec: 'ATENDIMENTO' as const },
      { name: 'OTIF / Envios / Correios', sec: 'LOGÍSTICA' as const },
    ];
    metrics.forEach(m => {
      if (m.name.toLowerCase().includes(query)) {
        results.push({
          type: 'Métrica Integrada',
          label: m.name,
          subtitle: `Filtrar base de dados do setor ${m.sec}`,
          sector: m.sec
        });
      }
    });

    // Search admin tabs
    const adminTabs = [
      { name: 'Conectores de Banco de Dados', tab: 'connectors' },
      { name: 'Controle de Permissões (RBAC)', tab: 'rbac' },
      { name: 'Logs de Auditoria de Acesso', tab: 'logs' },
      { name: 'LGPD & Configurações de Segurança', tab: 'security' }
    ];
    adminTabs.forEach(a => {
      if (a.name.toLowerCase().includes(query)) {
        results.push({
          type: 'Configuração ADM',
          label: a.name,
          subtitle: 'Acessar painel de gerenciamento',
          tab: a.tab
        });
      }
    });

    return results.slice(0, 5);
  };

  return (
    <header className={`sticky top-0 z-20 flex items-center justify-between h-20 px-8 border-b select-none transition-colors duration-150
      ${isDarkMode 
        ? 'bg-slate-950/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md'}`}
    >
      {/* Search & Breadcrumb Controls */}
      <div className="flex items-center gap-6 flex-1 max-w-lg">
        <div className="relative w-full" id="global-search-container">
          <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 transition-all duration-150
            ${isDarkMode 
              ? (isSearchFocused ? 'border-blue-500 bg-slate-900 ring-2 ring-blue-500/25' : 'border-slate-800 bg-slate-900/50')
              : (isSearchFocused ? 'border-blue-600 bg-white ring-2 ring-blue-600/15' : 'border-slate-200 bg-slate-50')}`}
          >
            <Search className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input 
              id="input-global-search"
              type="text"
              placeholder="Pesquisa global de dashboards, KPIs, métricas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-500 text-inherit font-display"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border text-[9px] font-mono text-slate-500 bg-slate-500/10 border-slate-500/30">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>

          {/* Autocomplete Box */}
          {isSearchFocused && getSearchResults().length > 0 && (
            <div className={`absolute top-13 left-0 right-0 rounded-2xl border p-2.5 shadow-xl max-h-96 overflow-y-auto mt-1 z-50 animate-in fade-in slide-in-from-top-1
              ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500 px-2 py-1 mb-1">Sugestões de Busca</div>
              {getSearchResults().map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => handleSearchSelect(item)}
                  className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-colors text-xs
                    ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'}`}
                >
                  <div>
                    <p className="font-display font-semibold">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.subtitle}</p>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border 
                    ${item.type === 'Dashboard' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : ''}
                    ${item.type === 'Setor de BI' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : ''}
                    ${item.type === 'Métrica Integrada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''}
                    ${item.type === 'Configuração ADM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : ''}`}
                  >
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced BI Filters Strip (Simulating Power BI level filter dynamic selection) */}
      <div className="hidden lg:flex items-center gap-3.5 mx-4 border-l border-r px-5 border-dashed border-slate-500/20">
        
        {/* Multi-company Tenant selector */}
        <div className="relative" id="company-tenant-dropdown">
          <button
            onClick={() => { setShowCompanySelector(!showCompanySelector); setShowUnitSelector(false); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border font-display transition-colors
              ${isDarkMode 
                ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900' 
                : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{activeCompany.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </button>
          
          {showCompanySelector && (
            <div className={`absolute top-10 left-0 rounded-xl border p-1.5 shadow-lg w-56 mt-1 z-50 animate-in fade-in slide-in-from-top-1
              ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              {companies.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => {
                    setActiveFilters({ ...activeFilters, companyId: comp.id, unit: comp.units[0] });
                    setShowCompanySelector(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors font-display
                    ${activeFilters.companyId === comp.id 
                      ? (isDarkMode ? 'bg-blue-600/15 text-blue-400' : 'bg-blue-50 text-blue-600') 
                      : (isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700')}`}
                >
                  <p className="font-semibold">{comp.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{comp.segment}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Multi-unit Branch selector */}
        <div className="relative" id="branch-unit-dropdown">
          <button
            onClick={() => { setShowUnitSelector(!showUnitSelector); setShowCompanySelector(false); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border font-display transition-colors
              ${isDarkMode 
                ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900' 
                : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-500" />
            <span>{activeFilters.unit}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </button>
          
          {showUnitSelector && (
            <div className={`absolute top-10 left-0 rounded-xl border p-1.5 shadow-lg w-48 mt-1 z-50 animate-in fade-in slide-in-from-top-1
              ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              {activeCompany.units.map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    setActiveFilters({ ...activeFilters, unit });
                    setShowUnitSelector(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors font-display
                    ${activeFilters.unit === unit 
                      ? (isDarkMode ? 'bg-purple-600/15 text-purple-400' : 'bg-purple-50 text-purple-600') 
                      : (isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50/80 text-slate-700')}`}
                >
                  {unit}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Period selection */}
        <div className="flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-display
          ${isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <select 
            id="select-period-filter"
            value={activeFilters.period}
            onChange={(e) => setActiveFilters({ ...activeFilters, period: e.target.value as any })}
            className="bg-transparent focus:outline-none text-xs font-semibold font-sans py-0.5 cursor-pointer pr-1"
          >
            <option value="this_month" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Este Mês (Maio/26)</option>
            <option value="7days" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Últimos 7 dias</option>
            <option value="30days" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Últimos 30 dias</option>
            <option value="last_month" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Mês Anterior (Abril/26)</option>
            <option value="today" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Hoje (Tempo Real)</option>
            <option value="yesterday" className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>Ontem</option>
          </select>
        </div>
      </div>

      {/* User RBAC & Theme Toggles Column */}
      <div className="flex items-center gap-3.5">
        
        {/* Theme select button */}
        <button
          id="btn-toggle-theme"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2.5 rounded-xl border transition-colors hover:bg-slate-500/10
            ${isDarkMode ? 'border-slate-800 text-amber-400 hover:text-amber-300' : 'border-slate-200 text-slate-600 hover:text-slate-900'}`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Multi-role RBAC selector (Visual Proof of Authorization Roles) */}
        <div className="relative" id="user-role-selector-container">
          <button 
            id="btn-rbac-role-dropdown"
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-display font-semibold transition-all duration-150
              ${isDarkMode 
                ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800' 
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}`}
          >
            <UserSquare2 className="w-4 h-4 text-indigo-500" />
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-[10px] text-slate-500 font-normal">Identidade Corp</p>
              <p className="font-semibold text-xs tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{rolesList.find(r => r.role === user.role)?.label}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </button>

          {showRoleSelector && (
            <div className={`absolute top-13 right-0 rounded-2xl border p-2 shadow-2xl w-72 mt-1 z-50 animate-in fade-in slide-in-from-top-1
              ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
            >
              <div className="flex items-center justify-between border-b px-2.5 py-2 mb-1.5 border-dashed border-slate-500/20">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Simulador de RBAC</span>
                </div>
                <span className="text-[9px] bg-slate-500/10 text-slate-400 px-1.5 py-0.5 rounded font-mono">Modo Demo</span>
              </div>

              {rolesList.map((entry) => (
                <button
                  id={`btn-select-role-${entry.role.toLowerCase()}`}
                  key={entry.role}
                  onClick={() => {
                    setUser({
                      ...user,
                      role: entry.role,
                      permissions: entry.role === 'SUPER_ADMIN' ? ['all'] : 
                                   entry.role === 'DIRETORIA' ? ['read:global', 'write:filters', 'export'] :
                                   entry.role === 'GERENTE' ? ['read:sector', 'comment'] : ['read:shared']
                    });
                    setShowRoleSelector(false);
                  }}
                  className={`w-full flex flex-col items-start text-left p-2 rounded-xl transition-colors font-display
                    ${user.role === entry.role 
                      ? (isDarkMode ? 'bg-indigo-600/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600') 
                      : (isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900')}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{entry.label}</span>
                    <span className="text-[8px] font-mono uppercase bg-slate-500/10 text-slate-400 px-1 py-0.2 rounded">{entry.authLevel}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-normal leading-tight">{entry.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
