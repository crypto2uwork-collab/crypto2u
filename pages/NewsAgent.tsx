import React, { useEffect, useState } from 'react';
import { Bot, RefreshCw, Clock, ExternalLink, Globe, Zap } from 'lucide-react';
import { fetchCryptoNews } from '../services/geminiService';
import { NewsItem } from '../types';

const NewsAgent: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchCryptoNews();
    setNews(data.news);
    setSources(data.sources);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Bot className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                AI News <span className="gradient-text">Agent</span>
              </h1>
            </div>
            <p className="text-slate-400 max-w-xl">
              Đặc vụ AI tự động quét tin tức từ Coindesk, TheBlock, Bloomberg... tổng hợp và dịch sang tiếng Việt theo thời gian thực.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="text-right hidden md:block">
              <div className="text-xs text-slate-500 font-bold uppercase">Trạng thái</div>
              <div className={`text-sm font-bold flex items-center justify-end gap-2 ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                {loading ? 'Đang quét web...' : 'Đã cập nhật'}
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-green-400'}`}></span>
              </div>
            </div>
            <button 
              onClick={loadNews}
              disabled={loading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-indigo-500/20"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading && news.length === 0 ? (
          // Loading Skeleton
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-800 h-64 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
             {news.length === 0 && !loading ? (
                <div className="text-center py-20 text-slate-500">
                   <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                   <p>Không tìm thấy tin tức nào. Vui lòng thử lại sau.</p>
                </div>
             ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col hover:border-indigo-500/40 transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-indigo-600/20"></div>
                      
                      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                         <Globe size={12} />
                         {item.source}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-indigo-300 transition">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock size={12} />
                          {item.time}
                        </div>
                        <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">
                           AI Summary
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
             )}

             {/* Footer Info */}
             <div className="mt-12 p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col md:flex-row gap-8 text-sm">
                   <div className="flex-1">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                         <Zap size={16} className="text-yellow-400"/>
                         Nguồn tham khảo (Grounding Sources)
                      </h4>
                      <ul className="space-y-2">
                         {sources.length > 0 ? sources.map((src, idx) => (
                            <li key={idx}>
                               <a href={src.uri} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 flex items-center gap-2 truncate">
                                  <ExternalLink size={12} />
                                  {src.title}
                               </a>
                            </li>
                         )) : (
                            <li className="text-slate-500">Dữ liệu được tổng hợp trực tiếp từ Google Search.</li>
                         )}
                      </ul>
                   </div>
                   <div className="md:w-1/3 text-slate-500">
                      <p className="mb-2">
                         <strong>Lưu ý:</strong> Nội dung được AI tổng hợp tự động từ các nguồn tin quốc tế. 
                         Đôi khi có thể có sai sót trong quá trình dịch thuật hoặc ngữ cảnh. 
                         Luôn kiểm tra lại thông tin gốc (DYOR).
                      </p>
                      <p>Cập nhật lần cuối: {lastUpdated?.toLocaleTimeString()}</p>
                   </div>
                </div>
             </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsAgent;