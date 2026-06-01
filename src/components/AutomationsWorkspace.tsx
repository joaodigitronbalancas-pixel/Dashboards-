import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Settings, 
  Database, 
  FileText, 
  Bot, 
  Workflow, 
  Play, 
  Info, 
  Zap, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  History, 
  UploadCloud, 
  Code, 
  Copy, 
  Share2, 
  RefreshCw, 
  Heart, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  Mail, 
  MessageSquare, 
  Terminal, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Layers, 
  Check, 
  ChevronRight, 
  Sliders, 
  Calendar,
  Send,
  HelpCircle,
  Eye,
  Trash2,
  FileSpreadsheet,
  Globe,
  DatabaseZap,
  Network
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface AutomationsWorkspaceProps {
  isDarkMode: boolean;
  activeFilters: any;
}

// Sparkline data generator for KPIs
const generateSparklineData = (baseVal: number, variance: number, points = 10) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `t${i}`,
    val: baseVal + Math.sin(i * 1.2) * variance + (Math.random() - 0.5) * (variance * 0.4)
  }));
};

// Types & Configs
interface AutomationNode {
  id: string;
  type: string;
  label: string;
  category: 'gatilho' | 'acao' | 'condicao';
  x: number;
  y: number;
  params: Record<string, string>;
  status?: 'idle' | 'success' | 'running' | 'error';
}

interface AutomationConnection {
  id: string;
  fromId: string;
  toId: string;
}

interface Agent {
  id: string;
  name: string;
  role: 'financeiro' | 'comercial' | 'rh' | 'marketing' | 'atendimento' | 'produção' | 'logística' | 'diretoria' | 'jurídico' | 'compras';
  avatar: string;
  objective: string;
  functions: string[];
  mestrePrompt: string;
  tools: string[];
  metrics: {
    efficiency: number;
    tasksToday: number;
    accuracy: number;
  };
  status: 'active' | 'training' | 'idle';
  history: string[];
}

export default function AutomationsWorkspace({ isDarkMode, activeFilters }: AutomationsWorkspaceProps) {
  // Navigation inside the automation hub
  const [activeTab, setActiveTab] = useState<'kpi' | 'builder' | 'agents' | 'prompts' | 'sector' | 'integrations' | 'monitoring' | 'training'>('kpi');

  // --- 1. STATE FOR KPI DASHBOARD ---
  const [kpiMetrics, setKpiMetrics] = useState({
    activeAutomations: 24,
    activeAgents: 10,
    processedToday: 1845,
    hoursSaved: 342,
    savingsEst: 20520, // USD or BRL
    flowsToday: 12904,
    successRate: 99.4,
    failureAlerts: 2,
    roi: 385, // %
  });

  // --- 2. STATE FOR WORKFLOW BUILDER ---
  const [nodes, setNodes] = useState<AutomationNode[]>([
    { id: '1', type: 'webhook', label: 'Gatilho: Webhook API', category: 'gatilho', x: 50, y: 150, params: { path: '/api/v1/lead', method: 'POST' }, status: 'idle' },
    { id: '2', type: 'ia', label: 'IA: Qualificar Lead', category: 'acao', x: 280, y: 150, params: { model: 'Gemini 2.5 Flash', prompt: 'Avalie este lead.' }, status: 'idle' },
    { id: '3', type: 'condicao', label: 'Roteador: Score > 80?', category: 'condicao', x: 510, y: 150, params: { field: 'ia_score', operator: '>', value: '80' }, status: 'idle' },
    { id: '4', type: 'crm', label: 'CRM: Salesforce Pipeline', category: 'acao', x: 740, y: 60, params: { dealStage: 'Qualificado', assignTo: 'Equipe Especial' }, status: 'idle' },
    { id: '5', type: 'whatsapp', label: 'Whats: Alerta de Lead', category: 'acao', x: 740, y: 240, params: { recipient: 'Comercial Regional', template: 'Novo Lead Quente' }, status: 'idle' },
  ]);

  const [connections, setConnections] = useState<AutomationConnection[]>([
    { id: 'c1', fromId: '1', toId: '2' },
    { id: 'c2', fromId: '2', toId: '3' },
    { id: 'c3', fromId: '3', toId: '4' },
    { id: 'c4', fromId: '3', toId: '5' },
  ]);

  const [builderLogs, setBuilderLogs] = useState<string[]>([]);
  const [isFlowRunning, setIsFlowRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AutomationNode | null>(null);

  // --- 3. STATE FOR AGENT CHUB ---
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'a1',
      name: 'Dr. Capital',
      role: 'financeiro',
      avatar: '💼',
      objective: 'Análise contínua do fluxo de caixa corporativo, estimativa de runway e detecção proativa de riscos de crédito/pagamento.',
      functions: [
        'Análise de Fluxo de Caixa Diário/Mensal',
        'Modelos Preditivos de Receitas e Inadimplências',
        'Detecção de Sobrecarga de Despesas e Alertas de Estouro',
        'Recomendações Logísticas de Investimento de Curto Prazo',
        'Geração e Exportação de Balancetes Dinâmicos'
      ],
      mestrePrompt: 'Você é o Dr. Capital, Diretor de IA Financeira do ERP. Analise todos os demonstrativos sob uma ótica estrita de liquidez e governança de risco financeiro.',
      tools: ['Simulador OLAP', 'Engine de Juros Compostos', 'Scorers de Crédito SAP', 'Exportador CSV/XLSX'],
      metrics: { efficiency: 97.4, tasksToday: 18, accuracy: 99.1 },
      status: 'active',
      history: ['Projeção de caixa D+30 recalculada.', 'Identificados 4 riscos de crédito em fornecedores regionais.', 'Relatório de custos finalizado.']
    },
    {
      id: 'a2',
      name: 'Tracker Sales',
      role: 'comercial',
      avatar: '📈',
      objective: 'Maximizar as taxas de conversão do CRM HubSpot/Salesforce, identificar leads em atrito e sugerir estratégias de up-selling.',
      functions: [
        'Forecast de Vendas Mensal/Semestral',
        'Pontuação Preditiva de Leads (Lead Scoring)',
        'Checkup da Performance de Vendedores Individuais',
        'Modelagem de Metas de Conversão e Desempenho'
      ],
      mestrePrompt: 'Você é o Tracker Sales, especialista em fechar novos negócios corporativos. Busque acelerar o ciclo de vendas reduzindo atritos burocráticos.',
      tools: ['Mapeador de Pipelines', 'Web Scraper LinkedIn', 'Algoritmo de Atribuição Comercial'],
      metrics: { efficiency: 94.6, tasksToday: 42, accuracy: 96.5 },
      status: 'active',
      history: ['Mapeamento de 28 leads quentes do Sul realizado.', 'Previsão de vendas para Q3 atualizada.', 'Estudo de churn concluído.']
    },
    {
      id: 'a3',
      name: 'Gente Forte',
      role: 'rh',
      avatar: '👥',
      objective: 'Identificar picos de produtividade laboral, predizer riscos de turnover e apoiar planos de treinamento corporativo automatizados.',
      functions: [
        'Detecção Precoce de Turnover Assistida por IA',
        'Indicadores de Burnout e Clima Laboral em Tempo Real',
        'Avaliação de Produtividade em Ambientes Híbridos',
        'Automatização da Jornada de Treinamentos'
      ],
      mestrePrompt: 'Você é o Gente Forte, agente do RH focado no desenvolvimento humano associado a altos índices de rendimento operacional saudável.',
      tools: ['Fatores Climáticos Colaborativos', 'Dashboard de Produtividade', 'Simulador de Turnover'],
      metrics: { efficiency: 98.2, tasksToday: 9, accuracy: 98.8 },
      status: 'idle',
      history: ['Análise de turnover concluída para o setor operacional.', '15 trilhas de treinamento validadas de forma autônoma.']
    },
    {
      id: 'a4',
      name: 'Hyper Brand',
      role: 'marketing',
      avatar: '🎯',
      objective: 'Análise e otimização imediata do ROI em campanhas pagas (Meta, Google Ads) com micro-redirecionamento orçamentário autônomo.',
      functions: [
        'Análise de Desempenho Multicanal em Tempo Real',
        'Recomendação Preditiva de Reajustes no Bid de Anúncios',
        'Geração e Teste de Copys para Landing Pages',
        'Identificador de Tendências em Nichos Específicos'
      ],
      mestrePrompt: 'Você é o Hyper Brand, cientista de dados de marketing focado no menor CAC e no maior LTV possível em canais digitais globais.',
      tools: ['Meta & Google Ads Connectors', 'Gerador de Copys IA', 'CAC Tracker'],
      metrics: { efficiency: 91.8, tasksToday: 24, accuracy: 95.2 },
      status: 'active',
      history: ['Otimização de orçamento sugerida com +12% de ROI estimado.', 'Geração de copy para Q4 concluída.']
    },
    {
      id: 'a5',
      name: 'Atendente Master',
      role: 'atendimento',
      avatar: '🎧',
      objective: 'Resolver chamados de nível 1 instantaneamente via WhatsApp/Telegram com respostas empáticas altamente contextuais de base de conhecimento corporativo.',
      functions: [],
      mestrePrompt: 'Você é o Atendente Master de Suporte.',
      tools: [],
      metrics: { efficiency: 98.5, tasksToday: 1420, accuracy: 97.9 },
      status: 'active',
      history: []
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [activePlaygroundChat, setActivePlaygroundChat] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: 'Saudações! Sou o Dr. Capital. Como posso auxiliar na análise financeira estratégica e otimização do seu fluxo de caixa hoje?', time: '14:20' }
  ]);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [isAgentResponding, setIsAgentResponding] = useState(false);

  // --- 4. STATE FOR PROMPT LIBRARY ---
  const [prompts, setPrompts] = useState([
    { id: 'p1', title: 'Calculadora de Runway e Fluxo Trimestral', category: 'Financeiro', prompt: 'Analise o fluxo de caixa anexo e identifique qual o runway exato em meses baseado na média de churn operacional de {meses_burn}. Defina hipóteses pessimistas e otimistas.', version: 'v1.4', author: 'Dir. Financeira' },
    { id: 'p2', title: 'Auditor de Leads & Cold Mailing Corporativo', category: 'Comercial', prompt: 'Examine as informações estruturadas do lead {nome_lead}, gere uma mensagem fria hiper-personalizada no tom de vendas corporativo focando no problema de {dor_lead}.', version: 'v2.1', author: 'Ger. Comercial' },
    { id: 'p3', title: 'Preditor de Risco de Turnover Estrutural', category: 'RH', prompt: 'Atuando como psicólogo organizacional, examine o histórico de satisfação anônimo e marque tendências de esgotamento intelectual (Burnout) e taxas prováveis de turnover.', version: 'v1.0', author: 'Coord. Clima' },
    { id: 'p4', title: 'Otimizador de Meta/Google Ads Copys', category: 'Marketing', prompt: 'Escreva 3 variações de títulos altamente clicáveis no estilo "AIDA" para a campanha {produto_nome} focando em CFOs e gestores enterprise.', version: 'v2.3', author: 'Analista Growth' },
  ]);

  const [promptSearch, setPromptSearch] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [newPromptForm, setNewPromptForm] = useState({ title: '', category: 'Financeiro', prompt: '', version: 'v1.0' });

  // --- 5. STATE FOR GENERATIVE CORPORATE AI ---
  const [selectedGenType, setSelectedGenType] = useState('report');
  const [genInputs, setGenInputs] = useState({ title: 'Relatório Trimestral', extra: 'Foco em faturamento de franquias SP', isGenerating: false });
  const [genOutput, setGenOutput] = useState('');

  // --- 6. STATE FOR SECTOR PRE-BUILTS ---
  const [sectorAutomationsStates, setSectorAutomationsStates] = useState([
    { id: 'sa1', title: 'Cobrança Automática Ativa', sector: 'Financeiro', active: true, frequency: 'A cada 3 dias', param: 'Aviso amigável seguido de restrição', scale: 85 },
    { id: 'sa2', title: 'Conciliação Bancária Noturna', sector: 'Financeiro', active: true, frequency: 'Diário (02:00)', param: 'Matching automático via extrato OFX', scale: 95 },
    { id: 'sa3', title: 'Follow-up de Leads Quentes', sector: 'Comercial', active: false, frequency: 'Após 24h sem resposta', param: 'Canal preferencial WhatsApp empresarial', scale: 60 },
    { id: 'sa4', title: 'Admissão de Funcionário Autônoma', sector: 'RH', active: true, frequency: 'Sob gatilho ERP', param: 'Validação facial e envio de contratos gov', scale: 90 },
    { id: 'sa5', title: 'Chatbot IA Atendimento 1º Nível', sector: 'Atendimento', active: true, frequency: 'Instantanêo (24/7)', param: 'Conectado à documentação PDF interna', scale: 99 },
  ]);

  // --- 7. STATE FOR INTEGRATIONS ---
  const [integrationsList, setIntegrationsList] = useState([
    { id: 'int1', name: 'OpenAI GPT-4o / Realtime', type: 'IA LLM', configured: true, ping: '38ms', cost: '$0.002 / 1k toks' },
    { id: 'int2', name: 'Google Gemini 2.5 Pro / Flash', type: 'IA LLM', configured: true, ping: '42ms', cost: '$0.00015 / 1k toks' },
    { id: 'int3', name: 'DeepSeek R1 / V3 Corporate', type: 'IA LLM', configured: false, ping: '--', cost: '$0.0001 / 1k toks' },
    { id: 'int4', name: 'SAP S/4HANA SDK Connector', type: 'ERP', configured: true, ping: '120ms', cost: 'Incluído na Licença' },
    { id: 'int5', name: 'HubSpot API Pipeline', type: 'CRM', configured: true, ping: '78ms', cost: 'Webhook Push Ativo' },
    { id: 'int6', name: 'Bling ERP Micro-Serviço', type: 'ERP', configured: false, ping: '--', cost: 'Manual Sync' },
    { id: 'int7', name: 'WhatsApp Cloud API Enterprise', type: 'Comunicação', configured: true, ping: '15ms', cost: 'R$ 0.12 / sessão' },
    { id: 'int8', name: 'Microsoft Teams Webhook', type: 'Comunicação', configured: true, ping: '20ms', cost: 'Grátis' },
  ]);

  // --- 8. STATE FOR LOGS & MONITORING ---
  const [runningFlowsCount, setRunningFlowsCount] = useState(14);
  const [pausedFlowsCount, setPausedFlowsCount] = useState(3);
  const [activeLogs, setActiveLogs] = useState<{ id: string; time: string; level: 'info' | 'warning' | 'error'; msg: string; service: string }[]>([
    { id: 'l1', time: '14:21:05', level: 'info', msg: 'Gatilho Webhook recebido por CRM Lead', service: 'n8n CORE' },
    { id: 'l2', time: '14:21:06', level: 'info', msg: 'Iniciando processamento por Gemini IA... Contagem de tokens: 540', service: 'IA Gateway' },
    { id: 'l3', time: '14:21:08', level: 'info', msg: 'Lead de alta intenção detectado. Score: 92/100', service: 'IA Agent a2' },
    { id: 'l4', time: '14:21:08', level: 'info', msg: 'Roteamento efetuado com sucesso para Salesforce Regional Sul', service: 'Salesforce CRM' },
    { id: 'l5', time: '14:21:09', level: 'info', msg: 'Disparo de template Whatsapp para Representante Regional efetuado', service: 'WhatsApp Cloud' },
  ]);

  // --- 9. STATE FOR TRAINING CENTER ---
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 'f1', name: 'Demonstrativo_Caixa_2025.xlsx', size: '2.4 MB', type: 'Excel', chunks: 142, status: 'Indexed', date: '25/05/2026' },
    { id: 'f2', name: 'Manual_Boas_Vindas_Colaboradores.pdf', size: '1.8 MB', type: 'PDF', chunks: 85, status: 'Indexed', date: '29/05/2026' },
    { id: 'f3', name: 'Especificacao_Tecnica_APIs_Bling.docx', size: '920 KB', type: 'Word', chunks: 41, status: 'Idle', date: '01/06/2026' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-scrolling ref for logs
  const logsConsoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsConsoleEndRef.current) {
      logsConsoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeLogs]);

  // Interactively generate live logs
  useEffect(() => {
    const timer = setInterval(() => {
      const services = ['Database Sync', 'Webhooks Engine', 'Dr. Capital AI', 'Tracker Sales', 'Bling Integration', 'HubSpot Link'];
      const levels: ('info' | 'warning' | 'error')[] = ['info', 'info', 'info', 'warning', 'info'];
      const messages = [
        'Sincronização de balanço efetuada com sucesso no banco principal.',
        'Sessão de treinamento de agente AI atualizada. 14 novos chunks injetados.',
        'Consulta de Runway financeira de cliente efetuada pelo token de gateway.',
        'Alerta de alta inatividade detectado no pipeline comercial do HubSpot.',
        'Webhook recebido com sucesso de Omie ERP (Fatura #459203).',
        'Iniciando rotina de conciliação bancária de transações pendentes.',
        'Disparo de fatura automática via WhatsApp para 4 clientes inadimplentes.',
      ];
      
      const randService = services[Math.floor(Math.random() * services.length)];
      const randLevel = levels[Math.floor(Math.random() * levels.length)];
      const randMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date().toLocaleTimeString('pt-BR');

      setActiveLogs(prev => [
        ...prev.slice(-30), // keep last 30 logs
        { id: `l-${Date.now()}`, time: now, level: randLevel, msg: randMsg, service: randService }
      ]);
      
      // Update small metric fluctuation
      setKpiMetrics(prev => ({
        ...prev,
        processedToday: prev.processedToday + (Math.random() > 0.4 ? 1 : 0),
        flowsToday: prev.flowsToday + Math.floor(Math.random() * 3),
        savingsEst: prev.savingsEst + (Math.random() > 0.8 ? 5 : 0)
      }));
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // --- HANDLERS ---
  
  // 1. Visual Flow Runner Animation
  const handleExecuteBuilderFlow = () => {
    if (isFlowRunning) return;
    setIsFlowRunning(true);
    setBuilderLogs(['[Execução] Iniciando fluxo de automação integrado corporativo...', '[Gatilho] Ouvindo porta webhook /api/v1/lead para análise de dados quentes.']);

    // Stagger node activation
    nodes.forEach((node, idx) => {
      setTimeout(() => {
        setNodes(curr => curr.map(n => n.id === node.id ? { ...n, status: 'running' } : n));
        setBuilderLogs(prev => [...prev, `[Processando] Ativando bloco "${node.label}"...`]);
        
        setTimeout(() => {
          setNodes(curr => curr.map(n => n.id === node.id ? { ...n, status: 'success' } : n));
          setBuilderLogs(prev => [...prev, `[Sucesso] Bloco "${node.label}" executor processado sem exceções.`]);
          
          if (idx === nodes.length - 1) {
            setIsFlowRunning(false);
            setBuilderLogs(prev => [...prev, '✨ [Finalizado] Fluxo executado com 100% de sucesso. Métricas integradas no dashboard.']);
            setKpiMetrics(prev => ({
              ...prev,
              processedToday: prev.processedToday + 1,
              hoursSaved: prev.hoursSaved + 0.5,
              savingsEst: prev.savingsEst + 30
            }));
          }
        }, 1200);

      }, idx * 1800);
    });
  };

  // 2. Inject Pre-built Templates to Canvas
  const handleLoadTemplateInBuilder = (templateName: string) => {
    setBuilderLogs([`[Template] Carregando modelo pré-configurado: ${templateName}`]);
    if (templateName === 'cobranca') {
      setNodes([
        { id: '1', type: 'banco', label: 'Financeiro: Banco SQL', category: 'gatilho', x: 50, y: 150, params: { query: 'SELECT * FROM invoices WHERE due_date = TODAY' }, status: 'idle' },
        { id: '2', type: 'ia', label: 'AI: Dr. Capital Verificador', category: 'acao', x: 280, y: 150, params: { rule: 'Validar risco de crédito de cada devedor' }, status: 'idle' },
        { id: '3', type: 'condicao', label: 'Filtro: É Parceiro Recorrente?', category: 'condicao', x: 510, y: 150, params: { type: 'boolean' }, status: 'idle' },
        { id: '4', type: 'email', label: 'Email: Cobrança Amistosa', category: 'acao', x: 740, y: 60, params: { template: 'Lembrete Amigável' }, status: 'idle' },
        { id: '5', type: 'whatsapp', label: 'Whats: Alerta de Multa/Aviso', category: 'acao', x: 740, y: 240, params: { template: 'Multa Notificação Formal' }, status: 'idle' },
      ]);
    } else if (templateName === 'leads') {
      setNodes([
        { id: '1', type: 'webhook', label: 'HubSpot: Lead Criado', category: 'gatilho', x: 50, y: 150, params: { trigger: 'Opportunity created' }, status: 'idle' },
        { id: '2', type: 'ia', label: 'AI: Qualificação de Interesse', category: 'acao', x: 280, y: 150, params: { model: 'GPT-4o Agentic' }, status: 'idle' },
        { id: '3', type: 'condicao', label: 'Lead Score > 70', category: 'condicao', x: 510, y: 150, params: { operator: '>' }, status: 'idle' },
        { id: '4', type: 'crm', label: 'CRM: Agendar Reunião', category: 'acao', x: 740, y: 60, params: { autoBook: 'true' }, status: 'idle' },
        { id: '5', type: 'telegram', label: 'Telegram: Alerta Time Ops', category: 'acao', x: 740, y: 240, params: { chat_id: 'sales_group' }, status: 'idle' },
      ]);
    } else {
      // Default
      setNodes([
        { id: '1', type: 'webhook', label: 'Custom Trigger', category: 'gatilho', x: 100, y: 150, params: {}, status: 'idle' },
        { id: '2', type: 'ia', label: 'Copilot AI Magic', category: 'acao', x: 400, y: 150, params: {}, status: 'idle' },
      ]);
    }
  };

  // Reset Builder nodes status
  const handleResetBuilder = () => {
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
    setBuilderLogs([]);
  };

  // 3. AI Agent chat responses generator
  const handleSendPlaygroundMessage = () => {
    if (!playgroundInput.trim() || isAgentResponding) return;
    const userMsg = playgroundInput;
    setPlaygroundInput('');
    
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setActivePlaygroundChat(prev => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setIsAgentResponding(true);

    setTimeout(() => {
      let responseText = '';
      
      if (selectedAgent.role === 'financeiro') {
        responseText = `📊 **Análise Consolidada do Fluxo de Caixa (Dr. Capital):**
Refletindo sua pergunta ("${userMsg}"), verifiquei nossas últimas 24h de conciliação.
- **Runway Estimada:** 14.5 meses, supondo nosso burn-rate atual estável de R$ 380k/mês.
- **Projeção de Caixa D+15:** Incremento potencial de R$ 1.25M devido a recebimentos no setor Comercial.
- **Riscos Principais:** Encontrei uma anomalia na adimplência operacional de 2 clientes específicos do setor logístico. Recomendo ativar nossa automação de **Cobrança Ativa Inteligente** imediatamente para reter perdas.
- **Investimento Sugerido:** Alocar excesso de R$ 450k em fundos de liquidez diária DI (103% CDI) para cobrir o passivo circulante do final do mês.`;
      } else if (selectedAgent.role === 'comercial') {
        responseText = `📈 **Análise de Performance Comercial (Tracker Sales):**
Baseado no seu input ("${userMsg}"), fiz uma análise em nosso pipeline corporativo do CRM:
- **Forecast de Vendas (Mês Corrente):** R$ 4.2M com 84% de probabilidade estatística.
- **Oportunidades Quentes:** Identifiquei 12 novas contas com score preditivo acima de 80 prontas para fechamento rápido se houver follow-up ativo.
- **Indicadores Individuais:** Setor de Franquias SP opera com pico sazonal positivo (+14% acima da meta). O setor de Minas Gerais requer revisão de metas imediatas por atrito regional.`;
      } else if (selectedAgent.role === 'rh') {
        responseText = `👥 **Simulação Laboral de Segurança (Gente Forte):**
Processando o tema ("${userMsg}"), analisei os dados anônimos de satisfação e horas extras integrados:
- **Alerta de Turnover:** O risco acumulado nos últimos 30 dias se mantém baixo (3.2%), exceto no setor de Suporte operacional devido ao volume de chamados de Nível 1.
- **Rendimento Geral:** As trilhas de e-learning aplicadas de forma autônoma aumentaram a conformidade técnica das equipes de desenvolvimento em 18%.
- **Clima Geral:** Recomendo promover um balanço de carga de chamados e horas de folga utilizando nosso bot automatizado de bem-estar.`;
      } else {
        responseText = `🎯 **Projeção Multicanal e CAC Tracker (Hyper Brand):**
Avaliando a consulta ("${userMsg}"):
- **Meta / Google Ads ROI:** Nosso ROI se mantém saudável em 3.4x.
- **Redirecionamento de Bid Recomendado:** Mover 15% do orçamento inativo do canal de anúncios secundários direto para a campanha principal de Q4, onde o Custo por Clique caiu 8%.
- **Nova Sugestão de Copy Autônoma:** *"Sua empresa com automação em nível global. Elimine gargalos com AI. Solicite demonstração MetriX."*`;
      }

      setActivePlaygroundChat(prev => [...prev, { sender: 'agent', text: responseText, time: timeNow }]);
      setIsAgentResponding(false);
      
      // Save history log
      setSelectedAgent(prev => ({
        ...prev,
        history: [`Consulta resolvida: "${userMsg.slice(0, 30)}..."`, ...prev.history],
        metrics: {
          ...prev.metrics,
          tasksToday: prev.metrics.tasksToday + 1
        }
      }));
    }, 1800);
  };

  // 4. Prompt creation
  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptForm.title || !newPromptForm.prompt) return;
    const newP = {
      id: `p-${Date.now()}`,
      title: newPromptForm.title,
      category: newPromptForm.category,
      prompt: newPromptForm.prompt,
      version: newPromptForm.version || 'v1.0',
      author: 'Você (Autor)'
    };
    setPrompts([newP, ...prompts]);
    setNewPromptForm({ title: '', category: 'Financeiro', prompt: '', version: 'v1.0' });
    setSelectedPrompt(newP);
  };

  // 5. Training Files Drag / Drop and Progress Simulation
  const handleFileDropSimulation = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadedFiles([
              {
                id: `f-${Date.now()}`,
                name: 'Estrutura_Metas_Corporate_Q4.csv',
                size: '410 KB',
                type: 'CSV',
                chunks: 38,
                status: 'Indexed',
                date: 'Hoje'
              },
              ...uploadedFiles
            ]);
            // Add a log
            setActiveLogs(prev => [
              ...prev,
              { id: `l-upload-${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), level: 'info', msg: 'Novo arquivo corpus CSV fatiado em 38 vetores e indexado!', service: 'RAG Embedder' }
            ]);
          }, 400);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  // 6. Corporate AI Generative trigger
  const handleGenerateCorporateDocument = () => {
    setGenInputs(prev => ({ ...prev, isGenerating: true }));
    setGenOutput('');
    
    setTimeout(() => {
      let content = '';
      if (selectedGenType === 'report') {
        content = `# RELATÓRIO CORPORATIVO DE PERFORMANCE OPERACIONAL
Gerado em: 01 de Junho de 2026 - MetriX Enterprise AI

## 1. Sumário Executivo
Este documento consolida os fluxos integrados e o desempenho operacional dos setores comerciais e financeiros. O ROI consolidado do trimestre aponta para **385%**, com uma expressiva economia de tempo calculada em **342 horas úteis** através das novas rotinas de automação visual n8n/Make integradas.

## 2. Indicadores Consolidados
- **Automações Ativas:** 24 fluxos ininterruptos
- **Sucesso de Execução:** 99.4% (sem exceções prioritárias nas últimas 72 horas)
- **Custo de Infraestrutura IA:** Estável ($0.00018 por requisição média)

## 3. Plano de Melhorias Recomendado
Baseado no agente preditivo "Dr. Capital", recomenda-se a estruturação imediata do Gateway de Cobranças automáticas para estancar atrasos recorrentes identificados no cluster regional de serviços SP.`;
      } else if (selectedGenType === 'contract') {
        content = `# ACORDO DE NÍVEL DE SERVIÇO (SLA) & INTEGRAÇÃO DE SISTEMAS
CONTRATANTE: METRIX ENTERPRISE SOLUÇÕES SA
CONTRATADO: GATEWAY DE AUTOMAÇÕES CORP

### Cláusula 1ª - Do Objeto do Serviço
O presente contrato regula os termos de integração de APIs escaláveis sob os modelos de Inteligência Artificial Gemini 2.5 e OpenAI GPT-4o, garantindo tempo de resposta máximo (ping) inferior a 150ms e taxa de sucesso nas chamadas webhook mínima de 99.5%.

### Cláusula 2ª - Dos Logs e Auditoria
Toda a roteirização de dados sensíveis obedecerá as regras estritas da LGPD, criptografando-se payloads de ponta-a-ponta.`;
      } else {
        content = `# ATA DE ALINHAMENTO EXECUTIVO DE DEPLOYMENT
Participantes: Eduardo Silva (Diretoria), Dr. Capital AI, Hyper Brand AI, Tracer Sales AI
Data da Reunião: 01 de Junho de 2026

## Pauta Única: Otimização de CAC e Atribuição Financeira

## Deliberações:
1. **Atribuição Comercial:** Tracker Sales validou e priorizou 28 novos leads quentes do CRM para atendimento acelerado em SP.
2. **Realocação Financeira:** Dr. Capital recomendou alocação imediata de caixa disponível para redução do juro rotativo de investimentos de capital de giro.
3. **Marketing Preditivo:** Otimizar o bid das campanhas ativas gerando economia financeira estimada de R$ 20.5k este mês.`;
      }
      setGenOutput(content);
      setGenInputs(prev => ({ ...prev, isGenerating: false }));
    }, 1500);
  };

  // Filtered prompts
  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.prompt.toLowerCase().includes(promptSearch.toLowerCase())
  );

  return (
    <div className={`p-1 space-y-6 select-text rounded-2xl ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* SECTION HEADER BLOCK */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-dashed
        ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.2 rounded-2xl bg-indigo-650 text-white shadow-lg shadow-indigo-600/20">
              <Bot className="w-5 h-5 text-amber-300 animate-pulse" />
            </span>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent dark:text-inherit">
                Automações & Inteligência Artificial
              </h1>
              <p className="text-xs text-slate-400 font-display mt-0.5">Central Unificada de Agentes, No-Code Workflows, RAG Training e Prompts Corporativos</p>
            </div>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 md:mt-0 p-1.2 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          {[
            { id: 'kpi', label: 'Monitor Geral', icon: Sparkles },
            { id: 'builder', label: 'No-Code Builder', icon: Workflow },
            { id: 'agents', label: 'Agentes IA', icon: Bot },
            { id: 'prompts', label: 'Prompt Library', icon: FileText },
            { id: 'sector', label: 'Setoriais', icon: Layers },
            { id: 'training', label: 'Treinamento RAG', icon: UploadCloud },
            { id: 'integrations', label: 'Conectores', icon: Database },
            { id: 'monitoring', label: 'Logs Desk', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.8 rounded-xl text-xs font-bold font-display transition-all cursor-pointer
                  ${active 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-750 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}`}
              >
                <Icon className={`w-3.5 h-3.5 ${active && tab.id === 'kpi' ? 'text-amber-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CONTENT WORKSPACE SWITCHER --- */}

      {/* TABS A: MONITOR GERAL ACCUMULATED INDICATORS */}
      {activeTab === 'kpi' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* BENTO GRID KPI METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* KPI 1: Active Automations */}
            <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between h-[120px]
              ${isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Módulos Ativos</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold font-display">+12.4%</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="font-display font-extrabold text-2xl tracking-tight">{kpiMetrics.activeAutomations}</h3>
                <span className="text-[10px] text-slate-500 font-display">Sem falhas</span>
              </div>
              <div className="h-6 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSparklineData(15, 2)}>
                    <Area type="monotone" dataKey="val" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 2: Active Agents Team */}
            <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between h-[120px]
              ${isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Agentes Operando</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold font-display">10/10 on</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="font-display font-extrabold text-2xl tracking-tight">{kpiMetrics.activeAgents}</h3>
                <span className="text-[10px] text-slate-500 font-display">RAG Atualizado</span>
              </div>
              <div className="h-6 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSparklineData(8, 0.8)}>
                    <Area type="monotone" dataKey="val" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 3: Processed actions today */}
            <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between h-[120px]
              ${isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Atividades Hoje</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono font-bold font-display">+18% vs ontem</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="font-display font-extrabold text-2xl tracking-tight">{kpiMetrics.processedToday}</h3>
                <span className="text-[10px] text-slate-500 font-display">Atuantes</span>
              </div>
              <div className="h-6 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSparklineData(1500, 150)}>
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 4: Hours Saved accumulated */}
            <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between h-[120px]
              ${isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Tempo Economizado</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono font-bold font-display">94.4% Efic.</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="font-display font-extrabold text-2xl tracking-tight">{kpiMetrics.hoursSaved}h</h3>
                <span className="text-[10px] text-slate-500 font-display">Este mês</span>
              </div>
              <div className="h-6 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSparklineData(300, 30)}>
                    <Area type="monotone" dataKey="val" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 5: Financial economy */}
            <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between h-[120px]
              ${isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Preservado (Est)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold font-display">ROI {kpiMetrics.roi}%</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-amber-400">R$ {kpiMetrics.savingsEst.toLocaleString()}</h3>
                <span className="text-[10px] text-slate-500 font-display">Mensal</span>
              </div>
              <div className="h-6 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSparklineData(20000, 800)}>
                    <Area type="monotone" dataKey="val" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>

          {/* ROI CHART AND SECTOR DISTRIBUTION GRAPHS BENTO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: General Timeline & ROI metrics of workflows */}
            <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <h3 className="font-display font-extrabold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Curva Incremental de Retorno Financeiro Estimado (ROI)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Comparação trimestral entre investimento na plataforma AI e economia estimada de processos operacionais</p>
              </div>

              <div className="h-[240px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Jan 26', custo: 3200, economia: 10400, roi: 325 },
                    { name: 'Fev 26', custo: 3200, economia: 11900, roi: 371 },
                    { name: 'Mar 26', custo: 4500, economia: 16800, roi: 373 },
                    { name: 'Abr 26', custo: 4500, economia: 18200, roi: 404 },
                    { name: 'Mai 26', custo: 5200, economia: 20520, roi: 394 },
                    { name: 'Jun 26 (Proj)', custo: 5200, economia: 23100, roi: 444 },
                  ]}>
                    <defs>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="economia" name="Economia Estimada (R$)" stroke="#10b981" fillOpacity={1} fill="url(#colorEconomia)" strokeWidth={2} />
                    <Area type="monotone" dataKey="custo" name="Investimento Plataforma (R$)" stroke="#e11d48" fillOpacity={1} fill="url(#colorCusto)" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t pt-4 border-dashed border-slate-800/10 mt-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">ROI ACUMULADO</span>
                  <p className="text-sm font-extrabold text-emerald-400 font-display">394.6%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">TAXA MÉDIA SUCESSO</span>
                  <p className="text-sm font-extrabold text-indigo-400 font-display">{kpiMetrics.successRate}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">TOTAL VOL PROTOCOLADO</span>
                  <p className="text-sm font-extrabold text-white font-display">12.9k execs/d</p>
                </div>
              </div>
            </div>

            {/* Right: AI Usage by Sector & Fail Alerts */}
            <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <h3 className="font-display font-bold text-sm flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Uso de IA / Setores de Negócio</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Distribuição percentual de requisições e processamento de agentes de IA nas últimas 24 horas</p>
              </div>

              <div className="h-[180px] w-full relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Financeiro', value: 35, color: '#10b981' },
                        { name: 'Comercial', value: 25, color: '#3b82f6' },
                        { name: 'Suporte', value: 20, color: '#f59e0b' },
                        { name: 'Marketing', value: 12, color: '#ec4899' },
                        { name: 'Recursos H.', value: 8, color: '#a855f7' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        { name: 'Financeiro', color: '#10b981' },
                        { name: 'Comercial', color: '#3b82f6' },
                        { name: 'Suporte', color: '#f59e0b' },
                        { name: 'Marketing', color: '#ec4899' },
                        { name: 'Recursos H.', color: '#a855f7' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Centered overall metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-[9px] uppercase font-mono font-semibold text-slate-500">MÉDIA DIÁRIA</span>
                  <span className="text-lg font-bold font-display text-slate-200">18.4k</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {[
                  { name: 'Financeiro', percent: 35, color: 'bg-emerald-500' },
                  { name: 'Comercial', percent: 25, color: 'bg-blue-500' },
                  { name: 'Suporte / CRM', percent: 20, color: 'bg-amber-500' },
                  { name: 'Marketing', percent: 12, color: 'bg-pink-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-slate-200 font-bold">{item.percent}%</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ACTIVE FAILURES ALERT BANNER AND EXECUTIVE GENERATIVE AI BOX */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Generative AI Corporative Suite */}
            <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <h3 className="font-display font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                  <Cpu className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                  <span>Engine de Geração de Documentos e Relatórios Corporativos</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Interaja com a IA generativa integrada nos metadados OLAP para criar cópias formais pré-qualificadas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                
                {/* Action select */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-black block mb-1">Qual documento gerar?</label>
                    <div className="space-y-1">
                      {[
                        { id: 'report', label: 'Relatório Executivo Trimestral' },
                        { id: 'contract', label: 'Contrato de Parceria & SLA' },
                        { id: 'minute', label: 'Ata de Alinhamento Executivo' },
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedGenType(type.id)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold font-display border transition-colors cursor-pointer block
                            ${selectedGenType === type.id 
                              ? 'bg-indigo-650 text-white border-indigo-500' 
                              : 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-800'}`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateCorporateDocument}
                    disabled={genInputs.isGenerating}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs tracking-tight shadow-lg shadow-indigo-650/15 cursor-pointer disabled:opacity-50"
                  >
                    {genInputs.isGenerating ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Compilando Vetores...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                        <span>Gerar com MetriX AI</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Right text viewer box */}
                <div className="md:col-span-2 flex flex-col h-[230px] rounded-xl border border-slate-850 bg-slate-950 p-4 select-text">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Terminal className="w-3 h-3" />
                      <span>Documento Formatado Markdown</span>
                    </span>
                    {genOutput && (
                      <button 
                        onClick={() => { navigator.clipboard.writeText(genOutput); }} 
                        className="p-1 px-2 rounded bg-slate-900 text-[10px] text-blue-400 hover:text-white"
                      >
                        Copiar Conteúdo
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto text-xs font-mono text-slate-350 leading-relaxed space-y-2 select-text" id="generative-document-output">
                    {genOutput ? (
                      <div className="whitespace-pre-wrap">{genOutput}</div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center select-none">
                        <Cpu className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                        <p>Plataforma Enterprise GenAI Pronta</p>
                        <p className="text-[10px] text-slate-500 mt-1">Escolha um documento na esquerda e clique em gerar.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side: Active failure tracker logs list */}
            <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <h3 className="font-display font-bold text-sm flex items-center gap-1.5 text-red-500">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-400 animate-bounce" />
                  <span>Alertas Críticos & Resolução Ativa</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Sistemas conectados sem perda de pacotes, exceto pelos avisos de autenticação abaixo:</p>
              </div>

              <div className="space-y-3.5 my-4">
                <div className="p-3.2 rounded-xl bg-yellow-500/5 border border-yellow-500/15 flex items-start gap-2.5">
                  <span className="mt-0.5 text-yellow-500">⚠️</span>
                  <div>
                    <span className="text-[11px] font-bold font-display text-slate-300">Conexão Bling ERP Requer Chave</span>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Disparos manuais suspensos. Automação de nota fiscal retida até o re-input do client token.</p>
                    <button onClick={() => setActiveTab('integrations')} className="text-[9px] font-mono text-blue-400 hover:underline mt-1 cursor-pointer">Resolver Credencial →</button>
                  </div>
                </div>

                <div className="p-3.2 rounded-xl bg-red-500/5 border border-red-500/15 flex items-start gap-2.5">
                  <span className="mt-0.5 text-red-500">💥</span>
                  <div>
                    <span className="text-[11px] font-bold font-display text-slate-300">DeepSeek API Limite Atingido</span>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Inadequação de créditos na conta. Atendente Master migrado autonomamente para Gemini Flash como contingência.</p>
                    <button onClick={() => setActiveTab('monitoring')} className="text-[9px] font-mono text-red-400 hover:underline mt-1 cursor-pointer">Injetar Créditos via Gateway →</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">MONITORAMENTO DE SINAL</span>
                  <span className="text-xs font-bold text-slate-300">Nenhum vazamento de buffer</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TABS B: VISUAL NO-CODE builder (n8n, Make, Zapier clone) */}
      {activeTab === 'builder' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Builder Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-850 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExecuteBuilderFlow}
                disabled={isFlowRunning}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-650 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-650/15 cursor-pointer"
              >
                {isFlowRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Fluxo Executando...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Testar Execução Inteligente</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetBuilder}
                className="px-3.5 py-2 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Limpar Estado
              </button>
              
              <div className="w-px h-6 bg-slate-800 mx-2 hidden md:block" />

              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden md:inline">Modelos Enterprise Rápidos:</span>
              <button
                onClick={() => handleLoadTemplateInBuilder('cobranca')}
                className="px-3 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 text-xs font-semibold rounded-xl cursor-pointer"
              >
                🏦 Régua de Cobrança Financeira
              </button>
              <button
                onClick={() => handleLoadTemplateInBuilder('leads')}
                className="px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600/30 text-blue-405 text-xs font-semibold rounded-xl cursor-pointer"
              >
                🎯 HubSpot qualified Leads Scoring
              </button>
            </div>

            <div className="p-1 px-3 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-400 border border-slate-850">
              Modo Conexões Visuais: <span className="text-emerald-400 font-bold">Ativo (n8n/Make)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left canvas board */}
            <div className="xl:col-span-8 space-y-4">
              <div 
                className={`relative h-[480px] w-full rounded-2xl border p-4 overflow-hidden shadow-inner flex flex-col justify-between select-none
                  ${isDarkMode 
                    ? 'bg-slate-950 border-slate-800 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]' 
                    : 'bg-slate-50 border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]'}`}
                id="no-code-visual-canvas"
              >
                <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl z-20 pointer-events-none">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Ambiente Sandbox</span>
                  <span className="text-xs font-bold text-slate-200">Editor Arrastável de Nós Conectados</span>
                </div>

                {/* VISUAL LAYOUT CONNECTIONS LINES (Canvas Render simulation) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                    </marker>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  {connections.map((conn) => {
                    const fromNode = nodes.find(n => n.id === conn.fromId);
                    const toNode = nodes.find(n => n.id === conn.toId);
                    if (!fromNode || !toNode) return null;

                    // Connector calculations (approximations)
                    const x1 = fromNode.x + 190;
                    const y1 = fromNode.y + 24;
                    const x2 = toNode.x;
                    const y2 = toNode.y + 24;

                    const dx = Math.abs(x2 - x1) * 0.5;
                    const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                    const activeRunning = fromNode.status === 'success' && toNode.status === 'running';

                    return (
                      <g key={conn.id}>
                        <path 
                          d={path} 
                          fill="none" 
                          stroke={isFlowRunning ? 'url(#lineGrad)' : '#334155'} 
                          strokeWidth={2.5} 
                          markerEnd="url(#arrow)" 
                          className={isFlowRunning ? 'stroke-dasharray' : ''}
                          style={{
                            strokeDasharray: isFlowRunning ? '8, 8' : 'none',
                            animation: isFlowRunning ? 'dash 20s linear infinite' : 'none'
                          }}
                        />
                        {activeRunning && (
                          <circle r={6} fill="#fbbf24" animate-pulse="true">
                            <animateMotion dur="1s" repeatCount="indefinite" path={path} />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* NODES ITERATOR */}
                <div className="relative w-full h-full z-10">
                  {nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const getIconForType = (type: string) => {
                      switch(type) {
                        case 'webhook': return <Globe className="w-4 h-4 text-sky-400" />;
                        case 'ia': return <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />;
                        case 'condicao': return <Network className="w-4 h-4 text-purple-400" />;
                        case 'crm': return <DatabaseZap className="w-4 h-4 text-blue-400" />;
                        case 'whatsapp': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
                        case 'banco': return <Database className="w-4 h-4 text-[#bfdbfe]" />;
                        case 'email': return <Mail className="w-4 h-4 text-red-400" />;
                        default: return <Workflow className="w-4 h-4 text-slate-400" />;
                      }
                    };

                    const getStatusColor = (status?: string) => {
                      if (status === 'success') return 'border-emerald-500 bg-emerald-950/25';
                      if (status === 'running') return 'border-yellow-500 bg-yellow-950/25 animate-pulse';
                      if (status === 'error') return 'border-red-500 bg-red-950/25 animate-bounce';
                      return isSelected ? 'border-indigo-500 bg-slate-900/90' : 'border-slate-800 bg-slate-900/70';
                    };

                    return (
                      <div
                        id={`builder-node-${node.id}`}
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`absolute w-[220px] rounded-xl border p-3 flex flex-col gap-1 transition-all cursor-pointer shadow-lg backdrop-blur-sm select-none hover:scale-[1.02]
                          ${getStatusColor(node.status)}`}
                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{node.category}</span>
                          <span className="p-1 rounded-md bg-slate-950/50">
                            {getIconForType(node.type)}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-display text-slate-200 block truncate">{node.label}</span>
                        
                        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-800/65 text-[10px] text-slate-400">
                          <span className="font-mono text-[9px] text-slate-500">Node ID: #{node.id}</span>
                          {node.status === 'success' && <span className="text-emerald-405 font-semibold font-display">• Pronto</span>}
                          {node.status === 'running' && <span className="text-yellow-405 font-semibold font-display animate-pulse">• Executando</span>}
                          {(!node.status || node.status === 'idle') && <span className="text-slate-500">Aguardando</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nodes selector sidebar helper inside canvas */}
                <div className="flex items-center justify-between w-full p-2 rounded-xl bg-slate-900/95 border border-slate-850 z-20">
                  <span className="text-[10px] text-slate-400 font-display">Clique em qualquer nó acima para calibrar seus parâmetros ao vivo ou arrastar novos blocos de gatilhos.</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        const id = String(nodes.length + 1);
                        setNodes([...nodes, { id, type: 'email', label: `Ação: Enviar Email #${id}`, category: 'acao', x: 400 + Math.random() * 100, y: 150 + Math.random() * 100, params: {} }]);
                      }}
                      className="p-1 px-2.5 rounded bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-[10px] select-none cursor-pointer"
                    >
                      + Novo Bloco
                    </button>
                    <button
                      onClick={() => {
                        if (nodes.length > 2) {
                          setNodes(nodes.slice(0, -1));
                          setConnections(connections.slice(0, -1));
                        }
                      }}
                      className="p-1 px-2 rounded bg-red-600/10 text-red-400 hover:bg-red-650 hover:text-white font-bold text-[10px] select-none cursor-pointer"
                    >
                      Remover Último
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right parameter and logs sidebar */}
            <div className="xl:col-span-4 space-y-4">
              
              {/* Parameters Calibrator Card */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[220px]
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div>
                  <h3 className="font-display font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Calibrador de Parâmetros</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Selecione um bloco no visual board para sintonizar variáveis sem código.</p>
                </div>

                {selectedNode ? (
                  <div className="space-y-3.5 my-4 animate-in fade-in duration-100">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Título Amistoso</span>
                      <input 
                        type="text" 
                        value={selectedNode.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, label: val } : n));
                          setSelectedNode(prev => prev ? { ...prev, label: val } : null);
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-transparent text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Categoria de Bloco</span>
                        <span className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs font-bold block uppercase font-mono text-indigo-400">{selectedNode.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Tipo Técnico ID</span>
                        <span className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs block font-mono text-amber-400">{selectedNode.type}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] text-slate-400 font-display">
                      ⚡ **Aviso:** Parâmetros de sincronia foram validados e estão ativos sob a API integrada MetriX local.
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-600 text-xs font-display">
                    Nenhum bloco selecionado no momento.<br />Clique em um bloco para editar.
                  </div>
                )}

                <div className="border-t border-slate-800/10 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Modo: n8n Engine</span>
                  <span className="text-emerald-450">• Online</span>
                </div>
              </div>

              {/* Real-time builder logs */}
              <div className="p-4 rounded-2xl border bg-slate-950 border-slate-800 flex flex-col justify-between h-[240px]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-widest block mb-2">Simulação Logs de Execução</span>
                  <div className="h-[180px] overflow-y-auto space-y-1.5 scrollbar-thin text-[10px] font-mono text-slate-350" id="visual-flow-terminal-logs">
                    {builderLogs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center select-none">
                        <Play className="w-6 h-6 text-slate-800 mb-1" />
                        <p>Inicie o fluxo acima para</p>
                        <p>rastrear logs OLAP em tempo real</p>
                      </div>
                    ) : (
                      builderLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="text-indigo-400 font-bold">[{new Date().toLocaleTimeString('pt-BR')}]</span> {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TABS C: CENTRAL DE AGENTES IA (Finance, Sales, HR, Marketing) */}
      {activeTab === 'agents' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Left selector menu cards list */}
            <div className="xl:col-span-1 space-y-3">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-black mb-1">Mesa Executiva de Agentes</span>
              
              {agents.map((agent) => {
                const active = selectedAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setActivePlaygroundChat([
                        { sender: 'agent', text: `Saudações! Sou o ${agent.name} (${agent.role.toUpperCase()}). Como posso auxiliar nas demandas estratégicas corporativas deste setor hoje?`, time: '14:20' }
                      ]);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 relative cursor-pointer hover:scale-[1.01]
                      ${active 
                        ? 'bg-gradient-to-tr from-slate-900 to-slate-850 border-indigo-500/80 shadow-lg' 
                        : 'bg-slate-950 border-slate-850 hover:bg-slate-900 opacity-80 hover:opacity-100'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-lg shadow border border-slate-700/60 shrink-0">
                      {agent.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display text-slate-200 truncate">{agent.name}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full border
                          ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/10 text-amber-500 border-amber-500/25'}`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase text-indigo-400 font-bold block mt-0.5">{agent.role}</span>
                      <p className="text-[10px] text-slate-500 truncate mt-1 leading-normal">{agent.objective}</p>
                    </div>

                    {active && <div className="absolute right-3 bottom-3 w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </button>
                );
              })}
            </div>

            {/* Right Playground Dashboard & configuration console */}
            <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Profile Card & Master Prompt and Tools (Col Span 5) */}
              <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between space-y-4
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-650/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                      {selectedAgent.avatar}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase font-black text-indigo-400">AGENTE CORPORATIVO DETALHADO</span>
                      <h2 className="font-display font-extrabold text-sm text-slate-100 leading-tight">{selectedAgent.name}</h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-display">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Objetivo da IA</span>
                      <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{selectedAgent.objective}</p>
                    </div>

                    {selectedAgent.functions.length > 0 && (
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block uppercase">Capacidades Autorais (Agente)</span>
                        <ul className="space-y-1 mt-1.5 pr-1">
                          {selectedAgent.functions.map((fn, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                              <span className="text-amber-400 mt-0.5">•</span>
                              <span className="leading-tight">{fn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Prompt Mestre de Atuação</span>
                      <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl mt-1 text-[10px] text-slate-400 leading-normal max-h-[100px] overflow-y-auto font-mono">
                        {selectedAgent.mestrePrompt}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Ferramentas Acopladas (APIs)</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {selectedAgent.tools.map((tool, idx) => (
                          <span key={idx} className="p-1 px-2 rounded-lg bg-slate-900 text-[10px] text-slate-300 border border-slate-850 font-mono">
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro-metrics for efficiency */}
                <div className="pt-3 border-t border-slate-800/20 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[8px] font-mono text-slate-500">PRECISÃO IA</span>
                    <p className="text-xs font-extrabold text-emerald-400">{selectedAgent.metrics.accuracy}%</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-500">TAREFAS HOJE</span>
                    <p className="text-xs font-extrabold text-white">{selectedAgent.metrics.tasksToday}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-500">CONFIABILIDADE</span>
                    <p className="text-xs font-extrabold text-indigo-400">{selectedAgent.metrics.efficiency}%</p>
                  </div>
                </div>

              </div>

              {/* Chat Playground box (Col Span 7) */}
              <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between h-[480px]
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold font-display text-slate-200">Terminal Conversacional Playground</span>
                  </div>

                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Sincronia: Gemini Live API</span>
                </div>

                {/* Messages scrollarea */}
                <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 scrollbar-thin text-xs" id="agent-playground-console">
                  {activePlaygroundChat.map((msg, idx) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-2`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed select-text
                          ${isUser 
                            ? 'bg-indigo-650 text-white rounded-tr-none' 
                            : 'bg-slate-900 border border-slate-850 text-slate-300 rounded-tl-none'}`}
                        >
                          {/* Markdown parsing replacement */}
                          <div className="whitespace-pre-wrap font-display select-text text-[11px]">{msg.text}</div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 mt-1">{msg.time}</span>
                      </div>
                    );
                  })}

                  {isAgentResponding && (
                    <div className="flex items-start gap-2 text-slate-500 text-[10px] italic animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>{selectedAgent.name} está analisando as projeções OLAP...</span>
                    </div>
                  )}
                </div>

                {/* Send input */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/25">
                  <input
                    type="text"
                    required
                    placeholder={`Pergunte ao ${selectedAgent.name} (ex: Projetar caixa D+30...)`}
                    value={playgroundInput}
                    onChange={(e) => setPlaygroundInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendPlaygroundMessage();
                    }}
                    disabled={isAgentResponding}
                    className="flex-1 text-xs p-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendPlaygroundMessage}
                    disabled={isAgentResponding}
                    className="p-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer disabled:opacity-55"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* TABS D: CENTRAL DE PROMPTS COMPREHENSIVE */}
      {activeTab === 'prompts' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left list and Search (Col Span 5) */}
            <div className="xl:col-span-5 space-y-4">
              
              <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pesquisar prompt na biblioteca corporativa..."
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  className="flex-1 text-xs bg-transparent border-none text-white focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredPrompts.map((p) => {
                  const active = selectedPrompt?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPrompt(p)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-1 cursor-pointer
                        ${active 
                          ? 'bg-slate-900 border-indigo-500' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-900'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono px-2 py-0.5 roundedbg bg-slate-900 border border-slate-800 text-indigo-400 font-bold">{p.category}</span>
                        <span className="text-[9px] font-mono text-slate-500 font-semibold">{p.version}</span>
                      </div>
                      <span className="text-xs font-bold font-display text-slate-100 block truncate leading-tight mt-1">{p.title}</span>
                      <p className="text-[10px] text-slate-500 font-mono line-clamp-1 leading-normal mt-0.5">{p.prompt}</p>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right editor & creator form (Col Span 7) */}
            <div className="xl:col-span-7 grid grid-cols-1 gap-6">
              
              {/* Creator Card */}
              <div className={`p-5 rounded-2xl border
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <h3 className="font-display font-extrabold text-sm text-indigo-400 flex items-center gap-1.5 mb-4">
                  <FileText className="w-4 h-4" />
                  <span>Cadastrar Novo Prompt Estruturado (Biblioteca)</span>
                </h3>

                <form onSubmit={handleCreatePrompt} className="space-y-3.5 text-xs font-display">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Título Amigável</span>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ex: Auditor Geral de Notas" 
                        value={newPromptForm.title}
                        onChange={(e) => setNewPromptForm(e.target.value ? { ...newPromptForm, title: e.target.value } : newPromptForm)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Setor / Categoria</span>
                      <select 
                        value={newPromptForm.category}
                        onChange={(e) => setNewPromptForm({ ...newPromptForm, category: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white"
                      >
                        <option value="Financeiro">Financeiro / Cashflow</option>
                        <option value="Comercial">Comercial / CRM</option>
                        <option value="RH">RH / Turnover</option>
                        <option value="Marketing">Marketing / Ads ROI</option>
                        <option value="Atendimento">Atendimento / Telefone</option>
                        <option value="Produção">Produção / OEE</option>
                        <option value="Jurídico">Jurídico / Compliance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-slate-400">Template / Prompt de Comando</span>
                      <span className="text-[8px] font-mono text-slate-600">Use chaves {"{var}"} para variáveis</span>
                    </div>
                    <textarea 
                      required 
                      rows={3}
                      placeholder="Identifique os custos anônimos nas linhas do CSV {dados} e classifique por prioridade..." 
                      value={newPromptForm.prompt}
                      onChange={(e) => setNewPromptForm({ ...newPromptForm, prompt: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-500">Autor: Eduardo Silva (Diretoria)</span>
                    <button
                      type="submit"
                      className="p-2.5 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs tracking-tight shadow cursor-pointer"
                    >
                      Salvar na Biblioteca Corporativa
                    </button>
                  </div>
                </form>

              </div>

              {/* Viewer & Copy Prompt Card */}
              {selectedPrompt ? (
                <div className={`p-4 rounded-2xl border animate-in fade-in duration-100 bg-slate-950 border-slate-800`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 px-1.8 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded font-mono uppercase">{selectedPrompt.category}</span>
                      <span className="text-xs font-bold text-slate-200">{selectedPrompt.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => { navigator.clipboard.writeText(selectedPrompt.prompt); }}
                        className="p-1.5 px-2.5 bg-slate-900 hover:bg-slate-850 hover:text-white rounded-lg text-[10px] font-mono text-blue-400 cursor-pointer"
                      >
                        Copiar Prompt
                      </button>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-850 bg-slate-900/60 font-mono text-[10.5px] text-slate-300 leading-normal whitespace-pre-wrap select-text">
                    {selectedPrompt.prompt}
                  </div>
                  <div className="flex items-center justify-between pt-1.5 text-[9px] font-mono text-slate-500 uppercase mt-2">
                    <span>Versão ativa: {selectedPrompt.version}</span>
                    <span>Modificado por: {selectedPrompt.author}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-slate-850 bg-slate-950/20 text-center py-6 text-xs text-slate-500">
                  Selecione um prompt na lista para copiar ou simular modificações.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* TABS E: SECTOR AUTOMATIONS COOP CONSOLE */}
      {activeTab === 'sector' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorAutomationsStates.map((automation) => (
              <div
                key={automation.id}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between min-h-[220px]
                  ${automation.active 
                    ? 'bg-slate-950 border-slate-800' 
                    : 'bg-slate-950/40 border-slate-900 opacity-70 hover:opacity-100'}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-3.5">
                    <span className="text-[9px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-400 font-bold font-display">{automation.sector}</span>
                    
                    {/* Toggle Switch Button */}
                    <button
                      onClick={() => {
                        setSectorAutomationsStates(curr => curr.map(a => a.id === automation.id ? { ...a, active: !a.active } : a));
                        setActiveLogs(prev => [
                          ...prev,
                          { id: `l-toggle-${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), level: 'info', msg: `Módulo "${automation.title}" foi ${!automation.active ? 'DESPERTADO' : 'SUSPENSO'} pelo usuário.`, service: 'Workspace Manager' }
                        ]);
                        // Fluctuate count
                        setKpiMetrics(prev => ({
                          ...prev,
                          activeAutomations: prev.activeAutomations + (!automation.active ? 1 : -1)
                        }));
                      }}
                      className="cursor-pointer"
                    >
                      {automation.active ? (
                        <ToggleRight className="w-9 h-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-9 h-6 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <span className="text-xs font-bold font-display text-slate-200 block leading-tight">{automation.title}</span>
                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Periodicidade</span>
                      <span className="text-slate-350 font-bold block bg-slate-900/60 p-1.5 rounded-lg border border-slate-850 font-display mt-0.5">{automation.frequency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Parâmetro Ativo</span>
                      <span className="text-slate-350 font-mono text-[10.5px] block truncate bg-slate-900/60 p-1.5 rounded-lg border border-slate-850 mt-0.5">{automation.param}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/10 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">Inadimplência Reduzida:</span>
                  <span className="text-emerald-400 font-bold font-display">+{automation.scale}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TABS F: AGENTS TRAINING WITH CLUSTERING SIMULATOR */}
      {activeTab === 'training' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Drop Zone Box and Tables List */}
            <div className="xl:col-span-8 space-y-4">
              
              {/* Drop File Mock Trigger */}
              <div 
                onClick={handleFileDropSimulation}
                className="p-8 border border-dashed rounded-2xl border-indigo-500/35 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all text-center flex flex-col items-center justify-center cursor-pointer select-none"
              >
                {isUploading ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-xs font-bold text-slate-350">Processando e Particionando Corpus... ({uploadProgress}%)</span>
                    <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-9 h-9 text-indigo-455 mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-slate-200 font-display">Enviar Documentos para Treinamento dos Agentes</span>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1 max-w-sm">Insira PDFs, planilhas Excel/CSV, arquivos Word ou websites para chunking vetorial automático.</p>
                    <p className="text-[9px] font-mono text-indigo-400 mt-2.5">💡 Clique aqui para simular o upload dinâmico de metas de Q4.</p>
                  </>
                )}
              </div>

              {/* Table listing */}
              <div className={`p-5 rounded-2xl border
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <h3 className="font-display font-extrabold text-sm text-slate-200 mb-3.5 flex items-center justify-between">
                  <span>Documentos de RAG Indexados na Base</span>
                  <span className="text-[10px] text-slate-500 font-mono">Total de bases: {uploadedFiles.length}</span>
                </h3>

                <div className="overflow-x-auto select-text">
                  <table className="w-full text-left text-xs font-display">
                    <thead>
                      <tr className="border-b border-slate-850 text-[10px] text-slate-500 uppercase tracking-wider">
                        <th className="pb-2.5">Nome do Arquivo</th>
                        <th className="pb-2.5">Tamanho</th>
                        <th className="pb-2.5">Formato</th>
                        <th className="pb-2.5">Pedaços Vetoriais</th>
                        <th className="pb-2.5">Sincronia</th>
                        <th className="pb-2.5">Envio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="text-slate-300">
                          <td className="py-3 font-bold truncate max-w-[200px]">{file.name}</td>
                          <td className="py-3 text-slate-450">{file.size}</td>
                          <td className="py-3 font-mono text-[10px]">{file.type}</td>
                          <td className="py-3 text-indigo-400 font-mono text-center">{file.chunks || '--'}</td>
                          <td className="py-3">
                            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                              {file.status}
                            </span>
                          </td>
                          <td className="py-3 text-[10px] text-slate-500">{file.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Right Scatter Cloud Simulation Graph */}
            <div className="xl:col-span-4 space-y-4">
              
              <div className={`p-4 rounded-2xl border min-h-[360px] flex flex-col justify-between
                ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div>
                  <h3 className="font-display font-extrabold text-xs uppercase text-slate-400 tracking-wider">
                    Visualização de Cluster Vetorial RAG
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">Representação espacial de embeddings gerados no banco de vetores MetriX.</p>
                </div>

                {/* Recharts Scatter graph */}
                <div className="h-[210px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#102a43/30" />
                      <XAxis type="number" dataKey="x" name="id" hide />
                      <YAxis type="number" dataKey="y" name="val" hide />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Chunks de Conhecimento" data={[
                        { x: 10, y: 30, z: 200, fill: '#6366f1' },
                        { x: 15, y: 40, z: 120, fill: '#6366f1' },
                        { x: 20, y: 35, z: 150, fill: '#6366f1' },
                        { x: 50, y: 70, z: 180, fill: '#3b82f6' },
                        { x: 55, y: 75, z: 220, fill: '#3b82f6' },
                        { x: 80, y: 15, z: 100, fill: '#10b981' },
                        { x: 85, y: 10, z: 140, fill: '#10b981' },
                        { x: 92, y: 20, z: 90, fill: '#10b981' },
                      ]} fill="#6366f1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between border-t border-slate-800/15 pt-3 text-[10px] text-slate-500 font-mono mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>Financeiro</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Comercial</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>RH Clima</span>
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* TABS G: CONECTORES & INTEGRAÇÕES LIST */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrationsList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[140px]
                  ${item.configured 
                    ? 'bg-slate-950 border-slate-800 bg-gradient-to-tr from-slate-950 to-slate-900/50' 
                    : 'bg-slate-950/20 border-slate-900 opacity-60 hover:opacity-100'}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{item.type}</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded
                      ${item.configured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}
                    >
                      {item.configured ? 'Ativado' : 'Aguardando Credencial'}
                    </span>
                  </div>

                  <span className="text-xs font-bold font-display text-slate-205 block leading-tight mt-3">{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">{item.cost}</span>
                </div>

                <div className="pt-2 border-t border-slate-805/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Ping Conexão:</span>
                  <span className="text-slate-300 font-bold">{item.ping}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TABS H: LOGS & MONITORING IN REAL TIME TERMINAL */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI running and metrics stats */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Módulos Concorrentes</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-emerald-400">{runningFlowsCount} executando</h3>
                <p className="text-[10px] text-slate-500 mt-1">Sessões de escuta ativa de webhooks enterprise estruturadas.</p>
              </div>
              <div className="flex gap-2.5 mt-2 pt-2.5 border-t border-slate-800/10">
                <button
                  onClick={() => { setRunningFlowsCount(p => p + 1); }}
                  className="flex-1 p-2 bg-indigo-650 hover:bg-indigo-600 text-[10px] font-bold text-white rounded-lg cursor-pointer"
                >
                  Acionar Novo
                </button>
                <button
                  onClick={() => { if (runningFlowsCount > 0) setRunningFlowsCount(p => p - 1); }}
                  className="flex-1 p-2 bg-red-600/10 hover:bg-slate-800 text-[10px] text-red-500 rounded-lg cursor-pointer"
                >
                  Suspender um
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Desvio Médio Conexão</span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-white">41 ms</h3>
                <p className="text-[10px] text-slate-500 mt-1">Sincronia robusta e redundância de gateway multiproduto funcional.</p>
              </div>
              <div className="h-10 opacity-30 mt-2">
                {/* Micro chart line for ping stability */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { val: 42 }, { val: 38 }, { val: 41 }, { val: 45 }, { val: 39 }, { val: 42 }, { val: 41 }
                  ]}>
                    <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex flex-col justify-between
              ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Erros Observados</span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-yellow-450">{kpiMetrics.failureAlerts} avisos</h3>
                <p className="text-[10px] text-slate-500 mt-1">Conectores de API inativos ou expirados auditados no cluster.</p>
              </div>
              <div className="flex gap-2.5 mt-2">
                <button
                  onClick={() => {
                    setKpiMetrics(prev => ({ ...prev, failureAlerts: 0 }));
                    setActiveLogs(prev => [
                      ...prev,
                      { id: `l-clear-${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), level: 'info', msg: 'Histórico de alertas expurgado pelo administrador.', service: 'Audit Manager' }
                    ]);
                  }}
                  className="w-full p-2 bg-slate-900 border border-slate-850 text-[10px] text-slate-300 font-bold hover:bg-slate-850 rounded-lg cursor-pointer"
                >
                  Marcar Todos como Resolvidos
                </button>
              </div>
            </div>

          </div>

          {/* Terminal stream console log view */}
          <div className="p-5 rounded-2xl border bg-slate-950 border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-850 mb-3 ml-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-widest flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Console Stream Ativo OLAP & AI logs</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500 block">Velocidade: 4.5s refresh</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            <div className="h-[280px] overflow-y-auto space-y-2 pr-1 text-xs font-mono text-slate-300 select-text" id="live-stream-terminal">
              {activeLogs.map((log) => {
                const getLevelColor = (level: string) => {
                  if (level === 'warning') return 'text-yellow-405 font-bold';
                  if (level === 'error') return 'text-red-405 font-bold';
                  return 'text-indigo-405 font-bold';
                };
                return (
                  <div key={log.id} className="leading-relaxed hover:bg-slate-900 p-1 rounded transition-colors select-text">
                    <span className="text-slate-600">[{log.time}]</span>{' '}
                    <span className={getLevelColor(log.level)}>[{log.level.toUpperCase()}]</span>{' '}
                    <span className="text-indigo-300">({log.service})</span>{' '}
                    <span className="text-slate-200 select-text">{log.msg}</span>
                  </div>
                );
              })}
              <div ref={logsConsoleEndRef} />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
