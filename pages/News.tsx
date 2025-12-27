
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Clock, Globe, Search, ShieldCheck, Zap, ExternalLink, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { fetchCryptoNews } from '../services/geminiService';
import { useSettings } from '../context/SettingsContext';

const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [news, setNews] = useState<any[]>(() => {
    const saved = localStorage.getItem('crypto_agent_news_cache');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Standby');
  const { t } = useSettings();

  const loadNews = async (searchQuery?: string) => {
    setLoading(true);
    setStatus('Scanning Global Sources...');
    try {
        const data = await fetchCryptoNews(searchQuery);
        setStatus('AI Analyzing & Translating...');
        
        if (data.news && data.news.length > 0) {
            setNews(data.news);
            localStorage.setItem('crypto_agent_news_cache', JSON.stringify(data.news));
            setStatus('Ready');
        } else {
            setStatus('No data found');
        }
    } catch (err: any) {
        setStatus('Error processing news');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    setSearchParams({ q: input.value });
  };

  const getSentimentStyle = (sentiment: string) => {
    switch(sentiment) {
        case 'Tích cực': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        case 'Tiêu cực': return 'text-red-500 bg-red-500/10 border-red-500/20';
        default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch(sentiment) {
        case 'Tích cực': return <TrendingUp size={14} />;
        case 'Tiêu cực': return <TrendingDown size={14} />;
        default: return <Minus size={14} />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Zap className={`text-white ${loading ? 'animate-pulse' : ''}`} size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
                        AI News <span className="gradient-text">Agent</span>
                    </h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                    Agent thông minh quét tin tức từ 100+ nguồn uy tín & Phân tích bằng AI.
                </p>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px]">
                <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agent Status</div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{status}</span>
                    </div>
                </div>
                <button 
                    onClick={() => loadNews(query)}
                    disabled={loading}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto relative mb-12">
            <form onSubmit={handleSearch}>
                <input 
                    name="search"
                    defaultValue={query}
                    type="text" 
                    placeholder="Tìm tin tức theo chủ đề (Bitcoin, Solana, AI...)"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-5 pl-14 pr-14 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-slate-900 dark:text-white transition-all"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition shadow-md">
                    <ArrowRight size={20} />
                </button>
            </form>
        </div>

        {/* News Grid */}
        {loading && news.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="card h-64 animate-pulse bg-slate-200 dark:bg-slate-800 border-none"></div>
                ))}
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, idx) => (
                    <div key={idx} className="card p-6 flex flex-col group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                <Globe size={12} /> {item.source}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold ${getSentimentStyle(item.sentiment)}`}>
                                {getSentimentIcon(item.sentiment)}
                                {item.sentiment}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-4">
                            {item.summary}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Clock size={12} />
                                {item.time}
                            </div>
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Chi tiết <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Intelligence Info */}
        <div className="mt-16 card p-8 bg-slate-900 border-none text-slate-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex flex-col md:flex-row gap-10 relative z-10">
                <div className="flex-1">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-indigo-400" />
                        AI Agent Intelligence
                    </h4>
                    <p className="text-sm leading-relaxed mb-4">
                        Dữ liệu được cập nhật từ API chuyên biệt cho tin tức Crypto (CryptoCompare). AI Agent của chúng tôi tự động tóm tắt và đánh giá thị trường (Bullish/Bearish) để bạn có cái nhìn tổng quan nhanh nhất mà không cần đọc hàng nghìn từ tiếng Anh.
                    </p>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Updates
                        </span>
                        <span className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Multi-source Verification
                        </span>
                    </div>
                </div>
                <div className="md:w-1/3 flex flex-col justify-end">
                    <p className="text-[10px] italic opacity-60">
                        * Thông tin do AI Agent tổng hợp từ nguồn quốc tế. Luôn thực hiện nghiên cứu cá nhân (DYOR) trước khi ra quyết định đầu tư.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default News;
