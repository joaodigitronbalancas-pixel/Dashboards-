import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Users2, 
  Megaphone, 
  Headphones, 
  Truck, 
  Factory, 
  Database, 
  Settings, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert, 
  Activity,
  Heart,
  Bot
} from 'lucide-react';
import { SectorType } from '../types';

interface SidebarProps {
  activeSector: SectorType;
  setActiveSector: (sector: SectorType) => void;
  activeView: 'bi' | 'automations';
  setActiveView: (view: 'bi' | 'automations') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenSettings: (tab: string) => void;
  isDarkMode: boolean;
}

export default function Sidebar({
  activeSector,
  setActiveSector,
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  onOpenSettings,
  isDarkMode
}: SidebarProps) {

  // Menu items with icons and colors matching each sector
  const sectorsList = [
    { id: 'COMERCIAL' as SectorType, label: 'Comercial', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'FINANCEIRO' as SectorType, label: 'Financeiro', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'RH' as SectorType, label: 'Recursos Humanos', icon: Users2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'MARKETING' as SectorType, label: 'Marketing', icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'ATENDIMENTO' as SectorType, label: 'Atendimento', icon: Headphones, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'LOGÍSTICA' as SectorType, label: 'Logística', icon: Truck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'PRODUÇÃO' as SectorType, label: 'Produção / OEE', icon: Factory, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const adminMenu = [
    { label: 'Conectores DB', icon: Database, tab: 'connectors' },
    { label: 'Controle de Acesso', icon: Settings, tab: 'rbac' },
    { label: 'Logs & Auditoria', icon: FileText, tab: 'logs' },
    { label: 'Segurança & LGPD', icon: ShieldAlert, tab: 'security' },
  ];

  return (
    <aside 
      id="sidebar-container"
      className={`relative z-30 flex flex-col h-screen border-r transition-all duration-300 select-none
        ${collapsed ? 'w-20' : 'w-72'} 
        ${isDarkMode 
          ? 'bg-slate-950 border-slate-800 text-slate-200' 
          : 'bg-white border-slate-200 text-slate-800'}`}
    >
      {/* Brand Header */}
      <div className={`p-6 flex items-center transition-all duration-300 ${collapsed ? 'justify-center border-b border-dashed' : 'justify-between border-b'} ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                MetriX Enterprise
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">BI & Analytics</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-sm shadow-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        )}
        
        {/* Collapse button */}
        {!collapsed && (
          <button 
            id="btn-collapse-sidebar"
            onClick={() => setCollapsed(true)}
            className={`p-1.5 rounded-lg border transition-colors hover:bg-slate-500/10 
              ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          id="btn-expand-sidebar"
          onClick={() => setCollapsed(false)}
          className={`absolute -right-3 top-8 z-40 p-1 rounded-full border transition-transform hover:scale-110 shadow-sm
            ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-250 text-slate-600'}`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Navigation Sectors */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        <div>
          <span className={`block font-mono text-[9px] uppercase tracking-widest px-2 mb-3 font-semibold text-slate-500 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'BI' : 'Setores de Negócio'}
          </span>
          <nav className="space-y-1">
            {sectorsList.map((sec) => {
              const active = activeSector === sec.id && activeView === 'bi';
              const IconComp = sec.icon;
              return (
                <button
                  id={`btn-sector-${sec.id.toLowerCase()}`}
                  key={sec.id}
                  onClick={() => {
                    setActiveSector(sec.id);
                    setActiveView('bi');
                  }}
                  className={`group relative w-full flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-150
                    ${collapsed ? 'justify-center' : 'gap-3'}
                    ${active 
                      ? (isDarkMode ? 'bg-slate-800/80 text-white shadow-inner' : 'bg-slate-100 text-slate-950')
                      : (isDarkMode ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}`}
                >
                  <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-105 ${sec.bg}`}>
                    <IconComp className={`w-4.5 h-4.5 ${sec.color}`} />
                  </div>
                  {!collapsed && (
                    <span className="flex-1 text-left font-display">{sec.label}</span>
                  )}
                  {!collapsed && active && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                  {collapsed && (
                    <div className="absolute left-20 hidden group-hover:block px-3 py-1.5 rounded-md bg-slate-950 text-white text-xs whitespace-nowrap shadow-md z-50">
                      {sec.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* IA & Automações Group */}
        <div>
          <span className={`block font-mono text-[9px] uppercase tracking-widest px-2 mb-3 font-semibold text-slate-500 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'IA' : 'Inteligência Artificial'}
          </span>
          <nav className="space-y-1">
            <button
              id="sidebar-btn-automations"
              onClick={() => setActiveView('automations')}
              className={`group relative w-full flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-150
                ${collapsed ? 'justify-center' : 'gap-3'}
                ${activeView === 'automations' 
                  ? (isDarkMode ? 'bg-slate-800/80 text-white shadow-inner' : 'bg-slate-100 text-slate-950')
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}`}
            >
              <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-105 bg-indigo-500/10`}>
                <Bot className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              {!collapsed && (
                <span className="flex-1 text-left font-display text-sm font-semibold bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Automações & IA</span>
              )}
              {!collapsed && activeView === 'automations' && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
              {collapsed && (
                <div className="absolute left-20 hidden group-hover:block px-3 py-1.5 rounded-md bg-slate-950 text-white text-xs whitespace-nowrap shadow-md z-50">
                  Automações & IA
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Administration and SaaS Tools */}
        <div>
          <span className={`block font-mono text-[9px] uppercase tracking-widest px-2 mb-3 font-semibold text-slate-500 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'ADM' : 'Administração SaaS'}
          </span>
          <nav className="space-y-1">
            {adminMenu.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  id={`btn-admin-tab-${item.tab}`}
                  key={idx}
                  onClick={() => onOpenSettings(item.tab)}
                  className={`group relative w-full flex items-center rounded-xl p-3 text-xs transition-colors
                    ${collapsed ? 'justify-center' : 'gap-3'}
                    ${isDarkMode 
                      ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                    <IconComp className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                  </div>
                  {!collapsed && <span className="flex-1 text-left font-display font-medium">{item.label}</span>}
                  {collapsed && (
                    <div className="absolute left-20 hidden group-hover:block px-3 py-1.5 rounded-md bg-slate-955 text-white text-xs whitespace-nowrap shadow-md z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Telemetry Status (No Margin Clutter, Simple Elegant Indicators) */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 Bg-slate-950/50' : 'border-slate-200 bg-slate-50/50'} ${collapsed ? 'items-center' : ''}`}>
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider uppercase">Sincronia Segura</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-[10px]">v2.6.1-enterprise</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>By DeepMind</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
