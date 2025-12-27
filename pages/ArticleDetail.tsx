
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    setIsBookmarked(slug ? bookmarks.includes(slug) : false);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-xl font-bold mb-4">{t('articleNotFound')}</h2>
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">{t('backHome')}</button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-3/4">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition">
                <ArrowLeft size={16} />
                <span>{t('back')}</span>
             </button>

             <article className="card p-6 md:p-8 bg-white dark:bg-slate-800">
                 <header className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase mb-4">
                        {article.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                      {article.title}
                    </h1>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                       <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                       <span className="flex items-center gap-1.5"><Eye size={14} /> {viewCount} {t('views')}</span>
                    </div>
                 </header>

                 {/* Hero Image - Reduced size */}
                 <div className="rounded-xl overflow-hidden mb-8 shadow-sm max-h-[250px] sm:max-h-[350px] flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                 </div>

                 {/* Standardized Prose for consistency */}
                 <div className="prose prose-base max-w-none dark:prose-invert 
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-7
                    prose-strong:text-slate-900 dark:prose-strong:text-white
                    mb-10
                 ">
                    {article.content}
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100 dark:border-slate-700">
                    <div className="text-center sm:text-left">
                        <h3 className="text-slate-900 dark:text-white font-bold text-base">{t('shareTitle')}</h3>
                        <p className="text-slate-500 text-xs">{t('shareDesc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">
                        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                        {copied ? t('copied') : t('copyLink')}
                      </button>
                    </div>
                 </div>
             </article>
          </div>

          <div className="lg:w-1/4">
             <div className="sticky top-24">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
