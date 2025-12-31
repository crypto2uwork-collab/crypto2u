
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Twitter, Share2, Heart, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getContent, t } = useSettings();
  const { user, isLoggedIn, isConfigured } = useAuth();
  const { articles } = getContent();
  
  const article = articles.find(a => a.slug === slug);
  const [stats, setStats] = useState({ views: 0, likes: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (slug && isConfigured) {
      initArticleStats();
    }
  }, [slug, isConfigured, user]);

  const initArticleStats = async () => {
    setLoadingStats(true);
    try {
      // 1. Tăng lượt xem (Upsert logic)
      const { data: currentData } = await supabase
        .from('article_stats')
        .select('*')
        .eq('slug', slug)
        .single();

      const newViews = (currentData?.views || 0) + 1;
      const newLikes = currentData?.likes || 0;

      await supabase.from('article_stats').upsert({ 
        slug: slug, 
        views: newViews,
        likes: newLikes
      });

      setStats({ views: newViews, likes: newLikes });

      // 2. Kiểm tra xem người dùng hiện tại đã thích chưa
      if (user) {
        const { data: likeData } = await supabase
          .from('article_user_likes')
          .select('*')
          .eq('user_id', user.id)
          .eq('article_slug', slug)
          .single();
        
        setIsLiked(!!likeData);
      }
    } catch (err) {
      console.error("Lỗi lấy chỉ số bài viết:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thả tim bài viết!");
      navigate('/auth');
      return;
    }
    if (!slug || !user || actionLoading) return;

    setActionLoading(true);
    try {
      if (isLiked) {
        // Hủy thích
        await supabase
          .from('article_user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('article_slug', slug);
        
        const newLikesCount = Math.max(0, stats.likes - 1);
        await supabase.from('article_stats').update({ likes: newLikesCount }).eq('slug', slug);
        
        setStats(prev => ({ ...prev, likes: newLikesCount }));
        setIsLiked(false);
      } else {
        // Thêm thích
        const { error: likeError } = await supabase
          .from('article_user_likes')
          .insert({ user_id: user.id, article_slug: slug });

        if (!likeError) {
          const newLikesCount = stats.likes + 1;
          await supabase.from('article_stats').update({ likes: newLikesCount }).eq('slug', slug);
          
          setStats(prev => ({ ...prev, likes: newLikesCount }));
          setIsLiked(true);
        }
      }
    } catch (err) {
      console.error("Lỗi thao tác like:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`Đọc bài viết: ${article?.title} trên Crypto2u Academy`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  if (!article) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-xl font-bold mb-4">{t('articleNotFound')}</h2>
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">{t('backHome')}</button>
      </div>
    );
  }

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
                         <Eye size={14} /> {loadingStats ? '...' : stats.views.toLocaleString()} lượt xem
                       </span>
                       <button 
                        onClick={handleLike}
                        disabled={actionLoading}
                        className={`flex items-center gap-1.5 transition ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                       >
                         {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Heart size={14} className={isLiked ? 'fill-current' : ''} />}
                         {loadingStats ? '...' : stats.likes.toLocaleString()} yêu thích
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
                            disabled={actionLoading}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border transition font-bold text-sm ${
                              isLiked ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} className={isLiked ? 'fill-white' : ''} />}
                            {isLiked ? 'Đã yêu thích' : 'Yêu thích'}
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
