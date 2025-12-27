
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Twitter, Facebook, Link as LinkIcon, Check, Bookmark, BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getContent, t } = useSettings();
  const { articles } = getContent();
  
  const article = articles.find(a => a.slug === slug);
  const [copied, setCopied] = useState(false);
  const [viewCount, setViewCount] = useState(article ? article.views : 0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const relatedArticles = article 
    ? articles.filter(a => a.category === article.category && a.slug !== article.slug).slice(0, 3) 
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    const storageKey = `article_views_${slug}`;
    const storedViews = localStorage.getItem(storageKey);
    let currentViews = storedViews ? parseInt(storedViews, 10) : article.views;
    const newViews = currentViews + 1;
    localStorage.setItem(storageKey, newViews.toString());
    setViewCount(newViews);
  }, [slug, article]);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    if (slug && bookmarks.includes(slug)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [slug]);

  const handleBookmark = () => {
    if (!slug) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((s: string) => s !== slug);
    } else {
      newBookmarks = [...bookmarks, slug];
    }
    localStorage.setItem('bookmarked_articles', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Crypto2u`;
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 text-center text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">{t('articleNotFound')}</h2>
        <button onClick={() => navigate('/')} className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('backHome')}</button>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Article Content */}
          <div className="lg:w-3/4">
             {/* Back Button */}
             <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>{t('back')}</span>
             </button>

             <article className="card p-6 md:p-10 border-none md:border-solid bg-white dark:bg-slate-800">
                 {/* Article Header */}
                 <header className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
                    <div className="flex items-center justify-between mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                            <BookOpen size={12} />
                            {article.category}
                        </span>
                        
                        <button 
                           onClick={handleBookmark}
                           className={`p-2 rounded-full transition ${
                             isBookmarked 
                               ? 'bg-indigo-600 text-white' 
                               : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                           }`}
                           title="Save article"
                        >
                           <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-[1.3] tracking-tight">
                      {article.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                       <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{t('published')} {article.date}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{viewCount.toLocaleString()} {t('views')}</span>
                       </div>
                    </div>
                 </header>

                 {/* Hero Image - Constrained size */}
                 <div className="rounded-2xl overflow-hidden mb-10 shadow-sm bg-slate-100 dark:bg-slate-700/50 max-h-[350px] md:max-h-[450px] flex items-center justify-center">
                    <img 
                       src={article.image} 
                       alt={article.title} 
                       loading="lazy"
                       className="w-full h-full object-cover"
                     />
                 </div>

                 {/* Content Body - Optimized Typography */}
                 <div className="prose prose-base md:prose-lg max-w-none 
                    prose-slate dark:prose-invert
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-7
                    prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 dark:prose-strong:text-white
                    prose-li:text-slate-700 dark:prose-li:text-slate-300
                    prose-img:rounded-xl prose-img:max-h-[400px] prose-img:mx-auto
                    mb-12
                 ">
                    {article.content}
                 </div>

                 {/* Share Section */}
                 <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100 dark:border-slate-700">
                    <div className="text-center sm:text-left">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{t('shareTitle')}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('shareDesc')}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`, '_blank')}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 text-[#1DA1F2] border border-slate-200 dark:border-slate-600 hover:border-[#1DA1F2] transition shadow-sm"
                      >
                        <Twitter size={20} />
                      </button>
                      <button 
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank')}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 text-[#1877F2] border border-slate-200 dark:border-slate-600 hover:border-[#1877F2] transition shadow-sm"
                      >
                        <Facebook size={20} />
                      </button>
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-sm"
                      >
                        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                        {copied ? t('copied') : t('copyLink')}
                      </button>
                    </div>
                 </div>
             </article>

             {/* Related Articles */}
             {relatedArticles.length > 0 && (
                <div className="mt-16">
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('relatedArticles')}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedArticles.map((related) => (
                         <Link 
                            to={`/article/${related.slug}`} 
                            key={related.slug} 
                            className="card overflow-hidden group flex flex-col h-full hover:shadow-lg"
                         >
                            <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-700/50">
                              <img 
                                src={related.image} 
                                alt={related.title} 
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug mb-2 text-sm line-clamp-2">
                                  {related.title}
                                </h4>
                                <div className="mt-auto text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <Calendar size={10} /> {related.date}
                                </div>
                            </div>
                         </Link>
                      ))}
                   </div>
                </div>
             )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
             <div className="sticky top-24 space-y-8">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
