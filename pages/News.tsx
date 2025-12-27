import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Bot, RefreshCw, Clock, ExternalLink, Globe, Search, Newspaper, FileText } from 'lucide-react';
import { fetchCryptoNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { useSettings } from '../context/SettingsContext';

const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Initialize from localStorage for persistence
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('crypto_ai_news_archive');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { getContent, t } = useSettings();
  const { articles } = getContent();

  const loadNews = async (searchQuery?: string) => {
    setLoading(true);
    const data = await fetchCryptoNews(searchQuery);
    
    if (data.news.length > 0) {
        setNews(prev => {
            // Merge new items with existing items, filtering duplicates by title
            const uniqueNewItems = data.news.filter(
                newItem => !prev.some(existingItem => existingItem.title === newItem.title)
            );
            // Prepend new items (LIFO) and keep the list size reasonable (e.g., 50)
            const updatedList = [...uniqueNewItems, ...prev].slice(0, 50);
            localStorage.setItem('crypto_ai_news_archive', JSON.stringify(updatedList));
            return updatedList;
        });
    }
    
    setSources(data.sources);
    setLoading(false);
  };

  // Only load news automatically if the list is empty or if there is a specific query
  useEffect(() => {
    if (news.length === 0 || query) {
        loadNews(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    setSearchParams({ q: input.value });
  };

  // Filter local articles based on query
  const relevantArticles = query 
    ? articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        
        {/* Header & Search */}
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                {t('newsTitle')}
            </h1>
            <div className="max-w-2xl mx-auto relative">
                <form onSubmit={handleSearch}>
                    <input 
                        name="search"
                        defaultValue={query}
                        type="text" 
                        placeholder={t('searchNewsPlaceholder')}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-slate-900 dark:text-white"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition">
                        <Search size={20} />
                    </button>
                </form>
            </div>
            {query && (
                <p className="mt-4 text-slate-500">
                    Kết quả cho: <span className="font-bold text-indigo-600 dark:text-indigo-400">"{query}"</span>
                </p>
            )}
        </div>

        {/* SECTION 1: Local Articles Matches */}
        {relevantArticles.length > 0 && (
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileText className="text-indigo-500" />
                    {t('relatedArticles')}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relevantArticles.map((article, idx) => (
                         <Link to={`/article/${article.slug}`} key={idx} className="card p-4 flex gap-4 hover:border-indigo-500 transition group">
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{article.description}</p>
                            </div>
                         </Link>
                    ))}
                </div>
            </div>
        )}

        {/* SECTION 2: AI Live News */}
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="text-pink-500" />
                {query ? t('liveNewsResult') : t('latestNews')}
            </h2>
            <button 
              onClick={() => loadNews(query)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-bold">{loading ? t('updating') : t('refresh')}</span>
            </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-800/50 border-none"></div>
            ))}
          </div>
        ) : (
          <>
             {news.length === 0 ? (
                <div className="text-center py-12 card border-dashed">
                   <Bot className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                   <p className="text-slate-500">{t('noNewsFound')}</p>
                </div>
             ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, idx) => (
                    <div key={idx} className="card p-6 flex flex-col hover:border-indigo-500 transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                         <Globe size={12} />
                         {item.source}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock size={12} />
                          {item.time}
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-1 rounded">
                           AI Summary
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
             )}

             {/* Sources */}
             {sources.length > 0 && (
                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Grounding Sources</h4>
                    <div className="flex flex-wrap gap-3">
                        {sources.map((src, idx) => (
                            <a key={idx} href={src.uri} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                <ExternalLink size={10} /> {src.title}
                            </a>
                        ))}
                    </div>
                </div>
             )}
          </>
        )}

      </div>
    </div>
  );
};

export default News;