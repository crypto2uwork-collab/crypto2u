
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Clock, Globe, Search, ShieldCheck, Zap, ExternalLink, ArrowRight, TrendingUp, TrendingDown, Minus, Search as SearchIcon, AlertCircle, Cpu } from 'lucide-react';
import { fetchCryptoNews } from '../services/geminiService';
import { useSettings } from '../context/SettingsContext';

const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [news, setNews] = useState<any[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [inputValue, setInputValue] = useState(query);
  const { t } = useSettings();

  const loadNews = async (searchQuery?: string) => {
    setLoading(true);
    setStatus(searchQuery ? `Đang truy vấn dữ liệu cho "${searchQuery}"...` : 'Đang quét tin tức Crypto...');
    
    try {
        const data = await fetchCryptoNews(searchQuery);
        
        if (data.news && data.news.length > 0) {
            setNews(data.news);
            setSources(data.sources || []);
            setStatus('Dữ liệu đã sẵn sàng');
        } else {
            setStatus('Chủ đề không thuộc lĩnh vực Crypto');
            setNews([]);
            setSources([]);
        }
    } catch (err: any) {
        setStatus('Lỗi xử lý Agent');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    setInputValue(query);
    loadNews(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue });
    } else {
      setSearchParams({});
    }
  };

  const getSentimentStyle = (sentiment: string) => {
    if (sentiment === 'Tích cực') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (sentiment === 'Tiêu cực') return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'Tích cực') return <TrendingUp size={14} />;
    if (sentiment === 'Tiêu cực') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Cpu className={`text-white ${loading ? 'animate-spin' : ''}`} size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
                        Crypto <span className="gradient-text">Search Agent</span>
                    </h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg">
                    Agent thông minh chuyên biệt lĩnh vực Blockchain. Hỗ trợ tìm kiếm từ khóa, dự án (Monad, Berachain...) và phân tích sắc thái tin tức.
                </p>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px]">
                <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agent Status</div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{status}</span>
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
            <form onSubmit={handleSearchSubmit}>
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    type="text" 
                    placeholder="Nhập tên dự án hoặc từ khóa (VD: Monad, Berachain, Bitcoin...)"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-5 pl-14 pr-14 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-slate-900 dark:text-white transition-all"
                />
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition shadow-md">
                    <ArrowRight size={20} />
                </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">Gợi ý:</span>
                {['Monad', 'Berachain', 'LayerZero', 'ZkSync'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => { setInputValue(tag); setSearchParams({ q: tag }); }}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 transition"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        {/* News Grid */}
        {loading && news.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="card h-64 animate-pulse bg-slate-200 dark:bg-slate-800 border-none"></div>
                ))}
            </div>
        ) : (
            <>
                {news.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, idx) => (
                            <div key={idx} className="card p-6 flex flex-col group hover:scale-[1.01] transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest truncate max-w-[70%]">
                                        <Globe size={12} /> {item.source}
                                    </span>
                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold ${getSentimentStyle(item.sentiment)}`}>
                                        {getSentimentIcon(item.sentiment)}
                                        {item.sentiment}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
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
                                        Nguồn tin <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <SearchIcon size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy kết quả phù hợp</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            Từ khóa <b>"{query}"</b> không nằm trong phạm vi kiến thức Crypto hoặc không có tin tức mới liên quan.
                        </p>
                        {query && (
                             <button 
                                onClick={() => { setInputValue(''); setSearchParams({}); }}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                            >
                                Xem tin tức tổng hợp
                            </button>
                        )}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default News;
