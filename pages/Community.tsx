
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Send, Heart, Flame, Plus, ShieldCheck, Reply, Lock, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const Community: React.FC = () => {
  const { t } = useSettings();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Kiến thức');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles (
          name,
          avatar
        )
      `)
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    const { error } = await supabase.from('community_posts').insert([
      { 
        author_id: user.id, 
        content: newPostContent, 
        tag: selectedTag 
      }
    ]);

    if (!error) {
      setNewPostContent('');
      setShowForm(false);
      fetchPosts();
    }
  };

  const handleUpvote = async (id: string, currentVotes: number) => {
    const { error } = await supabase
      .from('community_posts')
      .update({ upvotes: currentVotes + 1 })
      .eq('id', id);
    
    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: currentVotes + 1 } : p));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t('communityTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            {t('communitySubtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           <div className="lg:w-3/4 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Flame className="text-orange-500" /> Bảng tin thảo luận
                  </h2>
                  {isLoggedIn ? (
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
                      <Plus size={18} /> Đăng bài mới
                    </button>
                  ) : (
                    <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg">
                      <Lock size={16} /> Đăng nhập để chia sẻ
                    </Link>
                  )}
                </div>

                {showForm && isLoggedIn && (
                  <form onSubmit={handleCreatePost} className="card p-6 border-indigo-500 animate-slide-up bg-white dark:bg-slate-800">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm">
                        <option value="Kiến thức">Kiến thức</option>
                        <option value="Hỏi đáp">Hỏi đáp</option>
                        <option value="Kinh nghiệm">Kinh nghiệm</option>
                      </select>
                    </div>
                    <textarea required value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Hãy chia sẻ kinh nghiệm của bạn..." className="w-full h-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm mb-4 outline-none resize-none" />
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 text-sm font-bold">Hủy</button>
                      <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Send size={16} /> Đăng bài</button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
                  ) : posts.map((post) => (
                    <div key={post.id} className="card p-5 bg-white dark:bg-slate-800 hover:border-indigo-500 transition shadow-sm">
                      <div className="flex items-start gap-4">
                        <img src={post.profiles?.avatar} className="w-10 h-10 rounded-full border border-indigo-100 bg-slate-100" alt="" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{post.profiles?.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase">{post.tag}</span>
                            <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1"><Clock size={10} /> {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{post.content}</p>
                          <div className="flex items-center gap-6">
                            <button onClick={() => handleUpvote(post.id, post.upvotes)} className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition text-xs font-bold">
                              <Heart size={16} className={post.upvotes > 0 ? 'fill-pink-500 text-pink-500' : ''} /> {post.upvotes} Hữu ích
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
           </div>
           <div className="lg:w-1/4"><Sidebar /></div>
        </div>
      </div>
    </div>
  );
};

export default Community;
