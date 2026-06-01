import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Settings, 
  FileText, 
  ShieldAlert, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Lock, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Save, 
  ShieldCheck,
  Server,
  CloudLightning,
  UserSquare2,
  DatabaseZap,
  Activity
} from 'lucide-react';
import { DataConnector, AuditLog, UserRole } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string; // 'connectors' | 'rbac' | 'logs' | 'security'
  isDarkMode: boolean;
}

export default function ConfigModal({ isOpen, onClose, activeTab: initialTab, isDarkMode }: ConfigModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [connectors, setConnectors] = useState<DataConnector[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // New connector form state
  const [newConnName, setNewConnName] = useState('');
  const [newConnType, setNewConnType] = useState<any>('postgresql');
  const [newConnDetail, setNewConnDetail] = useState('');

  // Customizable Permission Matrices per RBAC Role (Simulated setup)
  const [permissions, setPermissions] = useState<Record<UserRole, { read: boolean; write: boolean; export: boolean; admin: boolean }>>({
    SUPER_ADMIN: { read: true, write: true, export: true, admin: true },
    DIRETORIA: { read: true, write: true, export: true, admin: false },
    GERENTE: { read: true, write: true, export: false, admin: false },
    SUPERVISOR: { read: true, write: false, export: false, admin: false },
    OPERADOR: { read: true, write: false, export: false, admin: false },
    CLIENTE: { read: true, write: false, export: false, admin: false },
  });

  // Security configs
  const [isLgpdActive, setIsLgpdActive] = useState(true);
  const [isMfaRequired, setIsMfaRequired] = useState(true);
  const [autoBackupInterval, setAutoBackupInterval] = useState('daily');
  const [isEncryptionActive, setIsEncryptionActive] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      fetchConnectors();
      fetchAuditLogs();
    }
  }, [isOpen]);

  const fetchConnectors = async () => {
    try {
      const res = await fetch('/api/connectors');
      const data = await res.json();
      setConnectors(data);
    } catch (err) {
      console.error('Failed to load database connections:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
    }
  };

  const handleSyncConnector = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await fetch(`/api/connectors/${id}/sync`, { method: 'POST' });
      const updated = await res.json();
      setConnectors(prev => prev.map(c => c.id === id ? updated : c));
      fetchAuditLogs(); // Refresh logs
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteConnector = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar esta conexão de banco de dados? Os relatórios vinculados podem ficar offline.')) return;
    try {
      await fetch(`/api/connectors/${id}`, { method: 'DELETE' });
      setConnectors(prev => prev.filter(c => c.id !== id));
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateConnector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnName.trim()) return;

    try {
      const res = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newConnName,
          type: newConnType,
          details: {
            host: newConnType !== 'excel' ? newConnDetail || 'prod-db.internal.cloud' : undefined,
            fileName: newConnType === 'excel' ? newConnDetail || 'custos_2026.xlsx' : undefined
          }
        })
      });

      const data = await res.json();
      setConnectors(prev => [...prev, data]);
      setNewConnName('');
      setNewConnDetail('');
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePermissionCheckbox = (role: UserRole, action: 'read' | 'write' | 'export' | 'admin') => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [action]: !prev[role][action]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main Container */}
      <div className={`relative z-10 w-full max-w-5xl h-[650px] rounded-3xl border flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200
        ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
      >
        
        {/* Modal Left Menu Sidebar tab toggle */}
        <div className={`w-64 border-r flex flex-col p-6 space-y-4 shrink-0
          ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-150 bg-slate-50/55'}`}
        >
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Painel de Controle</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-semibold tracking-wider">Enterprise Console</p>
          </div>

          <div className="flex-1 space-y-1">
            <button
              id="tab-btn-connectors"
              onClick={() => setActiveTab('connectors')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold rounded-xl transition-all
                ${activeTab === 'connectors' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100')}`}
            >
              <Database className="w-4.5 h-4.5" />
              <span>Conectores de Dados</span>
            </button>
            <button
              id="tab-btn-rbac"
              onClick={() => setActiveTab('rbac')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold rounded-xl transition-all
                ${activeTab === 'rbac' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10' 
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100')}`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Controle de Acesso RBAC</span>
            </button>
            <button
              id="tab-btn-logs"
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold rounded-xl transition-all
                ${activeTab === 'logs' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100')}`}
            >
              <FileText className="w-4.5 h-4.5" />
              <span>Logs & Auditoria</span>
            </button>
            <button
              id="tab-btn-security"
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 p-3 text-xs font-semibold rounded-xl transition-all
                ${activeTab === 'security' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10' 
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100')}`}
            >
              <ShieldAlert className="w-4.5 h-4.5" />
              <span>Segurança & LGPD</span>
            </button>
          </div>

          <div className="border-t pt-4 border-slate-500/15">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-[9px] font-mono whitespace-pre-wrap leading-tight text-slate-500">AES-256 Habilitado / TLS 1.3 Criptografia Ativa</span>
            </div>
          </div>
        </div>

        {/* Modal Core Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Bar */}
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-850 bg-slate-900/50' : 'border-slate-150 bg-white'}`}>
            <div>
              <h2 className="font-display font-bold text-base">
                {activeTab === 'connectors' && 'Conectores de Banco de Dados & APIs'}
                {activeTab === 'rbac' && 'Acessos Administrativos (RBAC) Personalizáveis'}
                {activeTab === 'logs' && 'Históricos de Auditoria de Acesso a Dados'}
                {activeTab === 'security' && 'Configurações de Segurança Corporativa & LGPD'}
              </h2>
              <p className="text-[11px] text-slate-500">Alterações no escopo do tenant atual afetam instantaneamente o sincronismo.</p>
            </div>
            
            <button 
              id="btn-close-modal"
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto p-8 h-full">

            {/* TAB 1: CONNECTORS */}
            {activeTab === 'connectors' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Create Connector Panel */}
                  <div className={`w-full lg:w-5/12 p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className="font-display font-bold text-xs flex items-center gap-1.5 mb-4">
                      <Plus className="w-4 h-4 text-blue-500" />
                      <span>Conectar Nova Fonte</span>
                    </h3>
                    
                    <form onSubmit={handleCreateConnector} className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Nome Alternativo</label>
                        <input
                          id="input-conn-name"
                          type="text"
                          required
                          placeholder="Ex: ERP Postgres Vendas"
                          value={newConnName}
                          onChange={(e) => setNewConnName(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-xs border bg-transparent focus:outline-none ${isDarkMode ? 'border-slate-800 focus:border-blue-500' : 'border-slate-220 focus:border-blue-600'}`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Tecnologia Conectora</label>
                        <select
                          id="select-conn-type"
                          value={newConnType}
                          onChange={(e) => setNewConnType(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-xs border bg-transparent ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-220 bg-white'}`}
                        >
                          <option value="postgresql">PostgreSQL</option>
                          <option value="mysql">MySQL</option>
                          <option value="sqlserver">SQL Server</option>
                          <option value="mongodb">MongoDB NoSQL</option>
                          <option value="excel">Arquivo Excel / CSV</option>
                          <option value="salesforce">Salesforce CRM</option>
                          <option value="google_sheets">Google Sheets Link</option>
                          <option value="rest_api">REST API Endpoint</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                          {newConnType === 'excel' ? 'Nome do Arquivo Planilha' : 'URL / Host de Conexão'}
                        </label>
                        <input
                          id="input-conn-detail"
                          type="text"
                          required
                          placeholder={newConnType === 'excel' ? 'Ex: custos_reais_2026.csv' : 'Ex: multi-host.rds.amazonaws.com'}
                          value={newConnDetail}
                          onChange={(e) => setNewConnDetail(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-xs border bg-transparent focus:outline-none ${isDarkMode ? 'border-slate-800 focus:border-blue-500' : 'border-slate-220 focus:border-blue-600'}`}
                        />
                      </div>

                      <button
                        id="btn-confirm-add-connector"
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-500/10 cursor-pointer hover:bg-blue-500"
                      >
                        <DatabaseZap className="w-3.5 h-3.5" />
                        <span>Conectar Fonte</span>
                      </button>
                    </form>
                  </div>

                  {/* Connectors List Table */}
                  <div className="flex-1 space-y-4">
                    <h3 className="font-display font-bold text-xs flex items-center gap-1.5 uppercase text-slate-400">
                      <Server className="w-4 h-4 text-slate-500" />
                      <span>Conectores Registrados</span>
                    </h3>

                    <div className="space-y-2.5">
                      {connectors.map((conn) => (
                        <div
                          key={conn.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-slate-500/5
                            ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-150 bg-slate-50/20'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/10">
                              <Database className="w-4.5 h-4.5 text-blue-500" />
                            </div>
                            <div className="select-text">
                              <p className="font-display font-bold text-xs">{conn.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest">{conn.type} • {conn.details.host || conn.details.fileName || conn.details.url || 'Conexão Local'}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">Último Sinc: {conn.lastSync === '-' ? '-' : new Date(conn.lastSync).toLocaleTimeString('pt-BR')}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full border
                              ${conn.status === 'connected' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/25'}`}
                            >
                              {conn.status === 'connected' ? 'Ativo' : 'Offline'}
                            </span>
                            
                            <button
                              id={`btn-sync-conn-${conn.id}`}
                              onClick={() => handleSyncConnector(conn.id)}
                              disabled={syncingId === conn.id}
                              className={`p-2 rounded-lg transition-colors border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                              title="Forçar Sincronismo"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${syncingId === conn.id ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                              id={`btn-delete-conn-${conn.id}`}
                              onClick={() => handleDeleteConnector(conn.id)}
                              className={`p-2 rounded-lg transition-colors border ${isDarkMode ? 'border-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400' : 'border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600'}`}
                              title="Remover Fontes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RBAC PERMISSIONS */}
            {activeTab === 'rbac' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl flex items-start gap-3 bg-indigo-500/5 border border-indigo-500/10">
                  <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-indigo-400">Permissões de Escopos do BI</p>
                    <p className="text-slate-400 mt-1">Ajuste na matriz abaixo as ações que cada identidade corporativa pode executar. Esse comportamento é refletido dinamicamente na visualização e nas transações de relatórios do usuário ativo.</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-500/15">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}>
                        <th className="p-4 font-display font-bold">Role / Perfil</th>
                        <th className="p-4 font-display font-bold text-center">Visualização (Read)</th>
                        <th className="p-4 font-display font-bold text-center">Modificação (Write)</th>
                        <th className="p-4 font-display font-bold text-center">Exportações (XLSX, PDF)</th>
                        <th className="p-4 font-display font-bold text-center">Dashboard ADM (Config)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/10 font-medium">
                      {(Object.keys(permissions) as UserRole[]).map((role) => (
                        <tr key={role} className={isDarkMode ? 'hover:bg-slate-950/20' : 'hover:bg-slate-50/50'}>
                          <td className="p-4 font-display">
                            <span className="font-bold flex items-center gap-2">
                              <UserSquare2 className="w-3.5 h-3.5 text-slate-450" />
                              {role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              id={`checkbox-rbac-${role.toLowerCase()}-read`}
                              onClick={() => togglePermissionCheckbox(role, 'read')}
                              className="mx-auto block"
                            >
                              {permissions[role].read ? <CheckSquare className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4 text-slate-500" />}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              id={`checkbox-rbac-${role.toLowerCase()}-write`}
                              onClick={() => togglePermissionCheckbox(role, 'write')}
                              className="mx-auto block"
                            >
                              {permissions[role].write ? <CheckSquare className="w-4 h-4 text-purple-500" /> : <Square className="w-4 h-4 text-slate-500" />}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              id={`checkbox-rbac-${role.toLowerCase()}-export`}
                              onClick={() => togglePermissionCheckbox(role, 'export')}
                              className="mx-auto block"
                            >
                              {permissions[role].export ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-500" />}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              id={`checkbox-rbac-${role.toLowerCase()}-admin`}
                              onClick={() => togglePermissionCheckbox(role, 'admin')}
                              className="mx-auto block"
                            >
                              {permissions[role].admin ? <CheckSquare className="w-4 h-4 text-amber-500" /> : <Square className="w-4 h-4 text-slate-500" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    id="btn-save-rbac-rules"
                    onClick={() => { alert('Matriz de controle de perfil gravada com sucesso no tenant!'); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs tracking-wide cursor-pointer hover:bg-purple-500 shadow-md shadow-purple-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Matriz</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: AUDIT TRAIL LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xs flex items-center gap-1.5 uppercase text-slate-400">
                    <Activity className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                    <span>Trilha Auditoria (LGPD)</span>
                  </h3>
                  <button
                    id="btn-refresh-audit-logs"
                    onClick={fetchAuditLogs}
                    className={`flex items-center gap-1 px-3 py-1 text-xs border rounded-lg transition-colors ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
                  >
                    <RefreshCw className="w-3 h-3 text-slate-500" />
                    <span>Atualizar</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 select-text
                        ${isDarkMode ? 'border-slate-850 bg-slate-950/20' : 'border-slate-150 bg-slate-50/20'}`}
                    >
                      <div className="p-1 px-2 rounded-md bg-slate-500/10 text-[9px] font-mono text-slate-500 font-semibold uppercase shrink-0">
                        AUDIT
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-bold font-display">{log.userName} ({log.action})</p>
                          <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">IP do Auditor: {log.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SAFETY, MFA & LGPD */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Encryption & MFA Configurations */}
                  <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className="font-display font-extrabold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" />
                      <span>Criptografia & MFA</span>
                    </h3>

                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">Criptografia AES-256 ativa</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Obrigatório pela regulamentação do ISO 27001.</p>
                        </div>
                        <button
                          id="btn-toggle-aes-encryption"
                          onClick={() => setIsEncryptionActive(!isEncryptionActive)}
                          className={`w-9 h-5 rounded-full flex items-center transition-all p-0.5 ${isEncryptionActive ? 'bg-emerald-600 justify-end' : 'bg-slate-600 justify-start'}`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">Exigir MFA para Administradores</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Verificação multifator obrigatória no login.</p>
                        </div>
                        <button
                          id="btn-toggle-mfa-required"
                          onClick={() => setIsMfaRequired(!isMfaRequired)}
                          className={`w-9 h-5 rounded-full flex items-center transition-all p-0.5 ${isMfaRequired ? 'bg-emerald-600 justify-end' : 'bg-slate-600 justify-start'}`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LGPD Compliance controls */}
                  <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className="font-display font-extrabold text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
                      <span>LGPD & Conformidade</span>
                    </h3>

                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">Anonimização de Logs de Pessoas</p>
                          <p className="text-[10px] text-slate-500 leading-tight font-display">Omite CPFs, E-mails e Telefones nas trilhas.</p>
                        </div>
                        <button
                          id="btn-toggle-lgpd-anonymization"
                          onClick={() => setIsLgpdActive(!isLgpdActive)}
                          className={`w-9 h-5 rounded-full flex items-center transition-all p-0.5 ${isLgpdActive ? 'bg-emerald-600 justify-end' : 'bg-slate-600 justify-start'}`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Backup Automático de BI</label>
                        <select
                          id="select-backup-frequency"
                          value={autoBackupInterval}
                          onChange={(e) => setAutoBackupInterval(e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs border bg-transparent ${isDarkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}
                        >
                          <option value="hourly">De hora em hora (Máxima Proteção)</option>
                          <option value="daily">Diário (Recomendado)</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl flex items-center gap-3 bg-red-500/5 border border-red-500/10">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                  <p className="text-[11px] text-slate-400 select-text">As chaves AES do aplicativo estão salvas em ambiente de hardware dedicado HSM (Hardware Security Module) nas instâncias de nuvem. Qualquer tentativa de exportar as chaves de segurança gera auditoria LGPD automática imediata.</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    id="btn-save-security-settings"
                    onClick={() => { alert('Preferências de segurança de dados atualizadas com sucesso no provisionamento!'); }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs tracking-wide cursor-pointer hover:bg-rose-500 shadow-md shadow-rose-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Gravar Proteções</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
