
import React, { useState, useEffect } from 'react';
import { MessageSquare, Twitter, Users, Clock, Send, Heart, Flame, Plus, ShieldCheck, Reply, CornerDownRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';
import { CommunityPost, CommunityReply } from '../types';

const Community: React.FC = () => {
  const { t } = useSettings();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Kiến thức' | 'Hỏi đáp' | 'Kinh nghiệm'>('Kiến thức');
  const [showForm, setShowForm] = useState(false);
  
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('crypto2u_community_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Bắt đầu với danh sách trống thay vì bài mẫu
      setPosts([]);
    }
  }, []);

  const savePosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('crypto2u_community_posts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !authorName.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: authorName,
      content: newPostContent,
      timestamp: 'Vừa xong',
      upvotes: 0,
      tag: selectedTag,
      avatarSeed: Math.floor(Math.random() * 100).toString(),
      replies: []
    };

    savePosts([post, ...posts]);
    setNewPostContent('');
    setAuthorName('');
    setShowForm(false);
  };

  const handleUpvote = (id: string) => {
    const updatedPosts = posts.map(p => 
      p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
    );
    savePosts(updatedPosts);
  };

  const handleCreateReply = (postId: string) => {
    if (!replyContent.trim() || !replyAuthor.trim()) return;

    const newReply: CommunityReply = {
      id: Date.now().toString(),
      author: replyAuthor,
      content: replyContent,
      timestamp: 'Vừa xong'
    };

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...(p.replies || []), newReply] };
      }
      return p;
    });

    savePosts(updatedPosts);
    setReplyContent('');
    setReplyAuthor('');
    setActiveReplyId(null);
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
                  <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                  >
                    <Plus size={18} /> Đăng bài mới
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={handleCreatePost} className="card p-6 border-indigo-500 animate-slide-up bg-white dark:bg-slate-800">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tên của bạn</label>
                        <input 
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          type="text" 
                          placeholder="VD: Nguyễn Văn A"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Chủ đề</label>
                        <select 
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="Kiến thức">Kiến thức</option>
                          <option value="Hỏi đáp">Hỏi đáp</option>
                          <option value="Kinh nghiệm">Kinh nghiệm</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nội dung chia sẻ</label>
                      <textarea 
                        required
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Hãy đặt câu hỏi hoặc chia sẻ kinh nghiệm của bạn về Crypto..."
                        className="w-full h-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 text-sm font-bold">Hủy</button>
                      <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                        <Send size={16} /> Đăng bài
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {posts.length > 0 ? posts.map((post) => (
                    <div key={post.id} className="space-y-4">
                      <div className="card p-5 group bg-white dark:bg-slate-800 hover:border-indigo-500/50 transition">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold text-lg">
                              {post.author.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{post.author}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase">{post.tag}</span>
                                <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1"><Clock size={10} /> {post.timestamp}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-6">
                                <button 
                                  onClick={() => handleUpvote(post.id)}
                                  className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition text-xs font-bold"
                                >
                                  <Heart size={16} className={post.upvotes > 15 ? 'fill-pink-500 text-pink-500' : ''} />
                                  {post.upvotes} Hữu ích
                                </button>
                                <button 
                                  onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                                  className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition text-xs font-bold"
                                >
                                  <Reply size={16} />
                                  Trả lời
                                </button>
                              </div>
                            </div>
                         </div>
                      </div>

                      {/* Replies List */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="ml-12 space-y-3">
                          {post.replies.map(reply => (
                            <div key={reply.id} className="card p-4 bg-slate-50/50 dark:bg-slate-900/30 border-l-4 border-l-indigo-500">
                               <div className="flex items-center gap-2 mb-2">
                                  <CornerDownRight size={14} className="text-slate-400" />
                                  <span className="font-bold text-slate-900 dark:text-white text-xs">{reply.author}</span>
                                  <span className="text-[10px] text-slate-400 ml-auto"><Clock size={10} className="inline mr-1" />{reply.timestamp}</span>
                               </div>
                               <p className="text-slate-600 dark:text-slate-400 text-sm pl-6">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {activeReplyId === post.id && (
                        <div className="ml-12 card p-4 bg-white dark:bg-slate-800 border-indigo-200 animate-slide-up">
                           <div className="mb-3">
                             <input 
                                value={replyAuthor}
                                onChange={(e) => setReplyAuthor(e.target.value)}
                                placeholder="Tên của bạn..." 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs mb-2 outline-none"
                             />
                             <textarea 
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Viết câu trả lời của bạn..." 
                                className="w-full h-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs outline-none resize-none"
                             />
                           </div>
                           <div className="flex justify-end gap-2">
                              <button onClick={() => setActiveReplyId(null)} className="text-xs font-bold text-slate-400 px-3">Hủy</button>
                              <button onClick={() => handleCreateReply(post.id)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Gửi trả lời</button>
                           </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 font-medium">Chưa có bài thảo luận nào. Hãy bắt đầu ngay!</p>
                      <button onClick={() => setShowForm(true)} className="mt-4 text-indigo-600 font-bold hover:underline">Đăng bài ngay &rarr;</button>
                    </div>
                  )}
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="card p-8 hover:border-indigo-500 transition group">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Twitter className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('twitterTitle')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('twitterDesc')}</p>
                    <a href="https://x.com/Crypto_2U" target="_blank" rel="noreferrer" className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
                      {t('followBtn')}
                    </a>
                </div>
                <div className="card p-8 hover:border-purple-500 transition group">
                    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('discordTitle')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('discordDesc')}</p>
                    <button disabled className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-8 py-2.5 rounded-xl font-bold cursor-not-allowed border border-slate-200 dark:border-slate-700">
                      {t('comingSoon')}
                    </button>
                </div>
              </div>

              <div className="card p-8 bg-indigo-50 dark:bg-indigo-900/20 border-dashed border-2 border-indigo-200 dark:border-indigo-800">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-indigo-600" />
                    Quy tắc cộng đồng
                 </h2>
                 <ul className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">✅ Tôn trọng ý kiến đa chiều của mọi người.</li>
                    <li className="flex items-center gap-2">❌ Tuyệt đối không shill kèo rác, lôi kéo đa cấp.</li>
                    <li className="flex items-center gap-2">✅ Ưu tiên các bài viết chia sẻ kiến thức sâu.</li>
                    <li className="flex items-center gap-2">❌ Không spam tin nhắn hoặc quảng cáo sàn.</li>
                 </ul>
              </div>
           </div>

           <div className="lg:w-1/4">
              <Sidebar />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
