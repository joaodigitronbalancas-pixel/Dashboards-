import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  MessageSquare, 
  RefreshCw, 
  Lightbulb, 
  User, 
  Bot,
  Zap,
  LineChart
} from 'lucide-react';
import { SectorType, AdvancedFilter } from '../types';

interface AiAnalystProps {
  sectorContext: SectorType;
  activeFilters: AdvancedFilter;
  isDarkMode: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export default function AiAnalyst({ sectorContext, activeFilters, isDarkMode }: AiAnalystProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `### Olá! Sou seu Assistente de IA Analítica Corporativa 🧠⚡

Analisei os dados atuais consolidados para o setor **${sectorContext}** sob a filial **${activeFilters.unit}**.

**Aqui estão alguns insights automáticos prévios baseados nesta série:**
* 📈 **Tendência de Alta**: Consistente evolução positiva (+12%) faturada nos últimos quarters.
* ⚠️ **Atenção em Custos**: Algumas rubricas setoriais de OpEx no centro de infraestrutura necessitam de renegociação prévia.

Fique à vontade para me fazer perguntas em linguagem natural como: *"Preveja o faturamento para os próximos 3 meses"* ou *"Quais os principais gargalos deste mês?"*.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested executive smart questions to minimize user friction
  const suggestions = [
    { label: 'O faturamento caiu em maio?', prompt: 'O faturamento caiu em maio? Faça um diagnóstico analítico.' },
    { label: 'Quais produtos mais venderam?', prompt: 'Quais produtos mais venderam e qual o share percentual de cada um?' },
    { label: 'Preveja os próximos 3 meses', prompt: 'Preveja os próximos 3 meses de faturamento operacional usando seu algoritmo preditivo.' },
    { label: 'Há alguma anomalia operacional?', prompt: 'Detectou alguma anomalia séria ou desvios em custos/turnover/OEE recentemente?' }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    const userMsgId = 'msg-' + Date.now();
    const newMessages = [
      ...messages,
      { id: userMsgId, role: 'user' as const, content: textToSend }
    ];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          sectorContext,
          activeFilters
        })
      });

      if (!response.ok) {
        throw new Error('Falha de resposta no canal de IA');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: 'model-' + Date.now(),
          role: 'model',
          content: data.content
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'model',
          content: `⚠️ **Conexão Interrompida**: Não consegui processar sua consulta analítica. Verifique suas credenciais de IA no painel Secrets do AI Studio ou revise as chaves de rede instaladas temporariamente.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Rendering formatted markdown block manually with clean look & code tags
  const renderFormattedMarkdown = (txt: string) => {
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-display font-bold text-base mt-4 mb-2 text-blue-500">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-display font-bold text-lg mt-5 mb-2 text-purple-400">{line.replace('## ', '')}</h3>;
      }
      // List items with bolding
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleaned = line.trim().substring(2);
        return (
          <li key={idx} className="text-xs text-slate-300 ml-4 list-disc mt-1.5 leading-relaxed select-text">
            {parseBolds(cleaned)}
          </li>
        );
      }
      // Number lines
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.match(/^(\d+\.\s)(.*)/);
        if (match) {
          return (
            <div key={idx} className="text-xs text-slate-300 ml-4 mt-2 list-decimal leading-relaxed select-text">
              <span className="font-semibold text-blue-400 mr-1">{match[1]}</span>
              {parseBolds(match[2])}
            </div>
          );
        }
      }
      // Standard line
      return line.trim() ? (
        <p key={idx} className="text-xs leading-relaxed mt-1.5 text-slate-300/90 select-text">
          {parseBolds(line)}
        </p>
      ) : <div key={idx} className="h-2" />;
    });
  };

  // Bolding parsing auxiliary engine
  const parseBolds = (chunk: string) => {
    const parts = chunk.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-slate-100 dark:text-white bg-slate-500/10 px-1 py-0.2 rounded font-display">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div 
      id="ai-analyst-panel"
      className={`rounded-2xl border flex flex-col h-[520px] select-none shadow-md overflow-hidden pulse-glow mt-8
        ${isDarkMode 
          ? 'bg-slate-950 border-slate-800 text-slate-200' 
          : 'bg-white border-slate-200 text-slate-800'}`}
    >
      {/* Header bar */}
      <div className={`p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white animate-pulse">
            <BrainCircuit className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">MetriX AI Copilot</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Analista McKinsey integrado</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-bounce" />
          <span>Ativo via Flash 3.5</span>
        </div>
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className={`px-4 py-3 border-b flex flex-wrap gap-2 ${isDarkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50 border-slate-150'}`}>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            id={`btn-sug-ai-${i}`}
            onClick={() => handleSendMessage(sug.prompt)}
            disabled={isLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-medium font-display transition-all duration-150 cursor-pointer hover:scale-101
              ${isDarkMode 
                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>{sug.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="ai-chat-canvas">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                ${isUser 
                  ? 'bg-blue-600 text-white' 
                  : (isDarkMode ? 'bg-slate-900 border border-slate-800 text-purple-400' : 'bg-slate-100 text-indigo-600')}`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              {/* Message block balloon */}
              <div className={`p-4 rounded-2xl text-xs select-text leading-relaxed tracking-normal
                ${isUser 
                  ? 'bg-blue-600/90 text-white font-display font-medium rounded-tr-none' 
                  : (isDarkMode ? 'bg-slate-900/60 border border-slate-850 rounded-tl-none text-slate-200' : 'bg-slate-50 border border-slate-200 rounded-tl-none text-slate-800')}`}
              >
                {isUser ? <p className="whitespace-pre-wrap">{msg.content}</p> : renderFormattedMarkdown(msg.content)}
              </div>
            </div>
          );
        })}

        {/* Loading/Analysing pulse loader */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-900 text-purple-400' : 'bg-slate-100 text-indigo-600'}`}>
              <Bot className="w-4.5 h-4.5 animate-bounce" />
            </div>
            <div className={`p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-2.5 font-display border
              ${isDarkMode ? 'bg-slate-900/50 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span>MetriX IA está interpretando as séries e calculando as projeções financeiras...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className={`p-4 border-t flex items-center gap-3.5 bg-slate-950/20 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}
      >
        <div className={`flex-1 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors
          ${isDarkMode 
            ? 'border-slate-800 bg-slate-900/70 focus-within:border-blue-500' 
            : 'border-slate-200 bg-white focus-within:border-blue-600'}`}
        >
          <input
            id="input-ai-prompt"
            type="text"
            placeholder="Pergunte ao MetriX Copilot sobre qualquer métrica corporativa..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isLoading}
            className="w-full bg-transparent focus:outline-none text-inherit placeholder-slate-500 font-display"
          />
        </div>
        <button
          id="btn-submit-ai-prompt"
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`p-2.5 rounded-xl text-white font-semibold transition-all duration-150 shadow-md cursor-pointer hover:scale-102
            ${(!inputValue.trim() || isLoading) 
              ? 'bg-slate-600 opacity-40 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/10'}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
