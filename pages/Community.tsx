
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Send, Heart, Flame, Plus, ShieldCheck, Lock, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const Community: React.FC = () => {
  const { t } = useSettings();
  const { user, isLoggedIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Kiến thức');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isConfigured) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user || !isConfigured) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('community_posts').insert([
        { 
          author_id: user.id, 
          content: newPostContent, 
          tag: selectedTag 
        }
      ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        if (insertError.code === '42501') {
          setError("Lỗi bảo mật (RLS): Bạn chưa cấu hình quyền 'Insert' cho bảng community_posts trong Supabase Dashboard.");
        } else {
          setError(insertError.message || "Không thể gửi bài đăng. Vui lòng thử lại.");
        }
      } else {
        setNewPostContent('');
        setShowForm(false);
        fetchPosts(); // Tải lại danh sách bài viết
      }
    } catch (err: any) {
      setError("Đã có lỗi xảy ra trong quá trình gửi bài.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string, currentVotes: number) => {
    if (!isConfigured || !isLoggedIn) return;
    const { error } = await supabase
      .from('community_posts')
      .update({ upvotes: currentVotes + 1 })
      .eq('id', id);
    
    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: currentVotes + 1 } : p));
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="card p-12 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-2xl">
            <AlertTriangle size={64} className="text-amber-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Kết nối Database chưa sẵn sàng</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Trang Cộng đồng yêu cầu kết nối với Supabase để lưu trữ bài viết. <br/>
              Vui lòng mở file <strong>services/supabase.ts</strong> và thay thế <strong>URL</strong> cùng <strong>Anon Key</strong> bằng thông tin từ dự án của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">Mở Supabase Dashboard</a>
               <Link to="/" className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition">Quay về Trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition">
                      {showForm ? 'Đóng lại' : <><Plus size={18} /> Đăng bài mới</>}
                    </button>
                  ) : (
                    <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg">
                      <Lock size={16} /> Đăng nhập để thảo luận
                    </Link>
                  )}
                </div>

                {showForm && isLoggedIn && (
                  <form onSubmit={handleCreatePost} className="card p-6 border-indigo-500 animate-slide-up bg-white dark:bg-slate-800 shadow-xl">
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-900/30 flex gap-3 items-center">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Chủ đề</label>
                        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition">
                          <option value="Kiến thức">Kiến thức</option>
                          <option value="Hỏi đáp">Hỏi đáp</option>
                          <option value="Kinh nghiệm">Kinh nghiệm</option>
                        </select>
                      </div>
                    </div>

                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Nội dung bài viết</label>
                    <textarea 
                      required 
                      value={newPostContent} 
                      onChange={(e) => setNewPostContent(e.target.value)} 
                      placeholder="Hãy chia sẻ kinh nghiệm hoặc đặt câu hỏi của bạn..." 
                      className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm mb-4 outline-none resize-none focus:ring-2 focus:ring-indigo-500 transition" 
                    />
                    
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 text-sm font-bold hover:text-slate-700 transition">Hủy</button>
                      <button 
                        type="submit" 
                        disabled={submitting || !newPostContent.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {submitting ? 'Đang gửi...' : 'Đăng bài'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
                  ) : posts.length > 0 ? posts.map((post) => (
                    <div key={post.id} className="card p-5 bg-white dark:bg-slate-800 hover:border-indigo-500 transition shadow-sm">
                      <div className="flex items-start gap-4">
                        <img src={post.profiles?.avatar} className="w-10 h-10 rounded-full border border-indigo-100 bg-slate-100 shadow-sm" alt="" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{post.profiles?.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase tracking-wider">{post.tag}</span>
                            <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1"><Clock size={10} /> {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => handleUpvote(post.id, post.upvotes)} 
                              className={`flex items-center gap-1.5 transition text-xs font-bold ${isLoggedIn ? 'text-slate-500 hover:text-pink-500' : 'text-slate-300 cursor-not-allowed'}`}
                              title={isLoggedIn ? "Hữu ích" : "Đăng nhập để tương tác"}
                            >
                              <Heart size={16} className={post.upvotes > 0 ? 'fill-pink-500 text-pink-500' : ''} /> {post.upvotes} Hữu ích
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500">Chưa có thảo luận nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                    </div>
                  )}
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
