
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Twitter, Link as LinkIcon, Check, Share2, Heart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getContent, t } = useSettings();
  const { articles } = getContent();
  
  const article = articles.find(a => a.slug === slug);
  const [copied, setCopied] = useState(false);
  const [realtimeViews, setRealtimeViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Real-time views & Likes simulation using localStorage
  useEffect(() => {
    if (slug) {
      const viewsKey = `crypto2u_views_${slug}`;
      const likesKey = `crypto2u_likes_${slug}`;
      const isLikedKey = `crypto2u_user_liked_${slug}`;
      
      // Views
      const baseViews = article?.views || 0;
      const extraViews = parseInt(localStorage.getItem(viewsKey) || '0');
      const newExtraViews = extraViews + 1;
      localStorage.setItem(viewsKey, newExtraViews.toString());
      setRealtimeViews(baseViews + newExtraViews);

      // Likes
      const savedLikes = parseInt(localStorage.getItem(likesKey) || '0');
      setLikes(savedLikes);
      
      // Check user liked
      const userLiked = localStorage.getItem(isLikedKey) === 'true';
      setIsLiked(userLiked);

      // Simulate other people viewing (every 30s)
      const interval = setInterval(() => {
        setRealtimeViews(prev => prev + Math.floor(Math.random() * 2));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [slug, article]);

  const handleLike = () => {
    if (!slug) return;
    const likesKey = `crypto2u_likes_${slug}`;
    const isLikedKey = `crypto2u_user_liked_${slug}`;
    
    if (isLiked) {
      const newLikes = Math.max(0, likes - 1);
      setLikes(newLikes);
      setIsLiked(false);
      localStorage.setItem(likesKey, newLikes.toString());
      localStorage.setItem(isLikedKey, 'false');
    } else {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setIsLiked(true);
      localStorage.setItem(likesKey, newLikes.toString());
      localStorage.setItem(isLikedKey, 'true');
    }
  };

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

  const handleShareX = () => {
    const text = encodeURIComponent(`Đọc bài viết: ${article.title} trên Crypto2u Academy`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
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
                    <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                      {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                       <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                       <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                         <Eye size={14} /> {realtimeViews.toLocaleString()} lượt xem
                       </span>
                       <button 
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition ${isLiked ? 'text-pink-500 scale-110' : 'hover:text-pink-500'}`}
                       >
                         <Heart size={14} className={isLiked ? 'fill-current' : ''} /> {likes.toLocaleString()} yêu thích
                       </button>
                    </div>
                 </header>

                 <div className="rounded-xl overflow-hidden mb-8 shadow-sm max-h-[400px] flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                 </div>

                 <div className="prose prose-lg max-w-none dark:prose-invert 
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-8
                    mb-12
                 ">
                    {article.content}
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1 flex items-center gap-2">
                              <Share2 size={18} className="text-indigo-500" /> Chia sẻ kiến thức
                            </h3>
                            <p className="text-slate-500 text-sm">Thấy bài viết hữu ích? Đừng ngần ngại lan tỏa tới cộng đồng.</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button 
                            onClick={handleLike}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border transition font-bold text-sm ${
                              isLiked ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Heart size={16} className={isLiked ? 'fill-white' : ''} /> {isLiked ? 'Đã yêu thích' : 'Yêu thích'}
                          </button>
                          <button 
                            onClick={handleShareX}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition shadow-lg"
                          >
                            <Twitter size={16} className="fill-white" /> Chia sẻ lên X
                          </button>
                        </div>
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
