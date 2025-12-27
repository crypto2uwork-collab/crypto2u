
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { TrendingUp, Activity, FileText, AlertCircle, Copy, Check, Languages } from 'lucide-react';
import { summarizeText } from '../services/geminiService';

const Research: React.FC = () => {
  const { t, getContent } = useSettings();
  const { articles } = getContent();
  const researchArticles = articles.filter(a => a.category === 'nghien-cuu');
  
  // Summarizer Tool States
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsSummarizing(true);
    setSummary(null);
    
    const result = await summarizeText(inputText);
    
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleCopy = () => {
    if (summary) {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-3">
            {t('researchTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base">{t('researchSubtitle')}</p>
        </div>

        {/* AI SUMMARIZER TOOL */}
        <div className="card p-6 md:p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Languages size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {t('summarizerTitle')} 
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 hidden sm:inline-block">Beta</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{t('summarizerDesc')}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('summarizerPlaceholder')}
                        className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-900 dark:text-white text-xs leading-relaxed"
                    />
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 italic">
                            *Hỗ trợ tốt nhất: Tiếng Anh, Tiếng Việt.
                        </span>
                        <button 
                            onClick={handleSummarize}
                            disabled={isSummarizing || !inputText}
                            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSummarizing ? <Activity className="animate-spin" size={14} /> : <FileText size={14} />}
                            {isSummarizing ? 'Đang phân tích...' : t('summarizeBtn')}
                        </button>
                    </div>
                </div>

                <div className="md:w-1/2 flex flex-col">
                    {summary ? (
                        <div className="p-5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 animate-fade-in h-full flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t('summaryResult')}</h4>
                                <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-500 transition">
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[10rem] pr-2 custom-scrollbar">
                                <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                                    {summary}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 min-h-[10rem]">
                            {isSummarizing ? (
                                <div className="text-center">
                                    <Activity size={24} className="mb-2 text-indigo-500 animate-spin mx-auto" />
                                    <p className="text-xs font-medium text-slate-500 animate-pulse">AI đang đọc & dịch...</p>
                                </div>
                            ) : (
                                <>
                                    <FileText size={24} className="mb-2 opacity-20" />
                                    <p className="text-xs text-center opacity-60">Kết quả tóm tắt & dịch sẽ hiện ở đây</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <p>Hệ thống AI có thể đọc hiểu văn bản dài và dịch thuật ngữ Crypto chính xác hơn các công cụ dịch thông thường.</p>
            </div>
        </div>

        {/* Static Report Card */}
        <div className="card p-6 md:p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-center relative overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 -z-10"></div>
            <div className="mb-6">
                <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-3 border border-indigo-200 dark:border-indigo-500/30">
                    Vision 2026
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">{t('trendTitle')}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl">
                    {t('trendDesc')}
                </p>
            </div>
            <Link to="/article/top-10-altcoin-2026" className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition shadow-lg w-fit group">
                {t('readReport')} <TrendingUp className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
        </div>

        {/* Research Articles Grid */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
            {t('researchArticles')}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchArticles.map((article, idx) => (
                <Link to={`/article/${article.slug}`} key={idx} className="group block transform hover:-translate-y-1 transition-all duration-300">
                    <div className="card rounded-xl overflow-hidden h-full flex flex-col border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg">
                        <div className="h-44 overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col bg-white dark:bg-slate-800">
                            <span className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-3 w-fit border border-indigo-100 dark:border-indigo-500/30">
                                {article.category}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2 leading-snug">
                                {article.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                                {article.description}
                            </p>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs group-hover:underline flex items-center mt-auto">
                                {t('viewAnalysis')} &rarr;
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Research;
