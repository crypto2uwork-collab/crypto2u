
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Calendar, Award, Edit3, MessageSquare, BookOpen, LogOut, Save, Camera, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState(user?.bio || '');

  if (!isLoggedIn) return <Navigate to="/auth" />;

  const handleSave = () => {
    updateUser({ name: editedName, bio: editedBio });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Bài thảo luận', value: '0', icon: <MessageSquare size={18} />, color: 'text-indigo-500' },
    { label: 'Bài đã học', value: '12', icon: <BookOpen size={18} />, color: 'text-emerald-500' },
    { label: 'Điểm uy tín', value: '150', icon: <Award size={18} />, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar Info */}
          <div className="lg:w-1/3">
             <div className="card p-8 bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20"></div>
                
                <div className="relative mb-6 mt-4 inline-block group">
                   <img 
                    src={user?.avatar} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100"
                   />
                   <button className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300">
                      <Camera size={16} />
                   </button>
                </div>

                <div className="mb-6">
                   {isEditing ? (
                     <input 
                       value={editedName}
                       onChange={(e) => setEditedName(e.target.value)}
                       className="text-center text-xl font-display font-bold w-full bg-slate-50 dark:bg-slate-800 border-b-2 border-indigo-500 focus:outline-none mb-2"
                     />
                   ) : (
                     <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h2>
                   )}
                   <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                     Rank: {user?.rank}
                   </span>
                </div>

                <div className="text-left space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="flex-shrink-0" size={16} /> {user?.email}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="flex-shrink-0" size={16} /> Tham gia: {user?.joinedDate}
                   </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                   {isEditing ? (
                      <button onClick={handleSave} className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm">
                         <Save size={16} /> Lưu thay đổi
                      </button>
                   ) : (
                      <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm">
                         <Edit3 size={16} /> Chỉnh sửa hồ sơ
                      </button>
                   )}
                   <button onClick={logout} className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition">
                      <LogOut size={16} /> Đăng xuất
                   </button>
                </div>
             </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-2/3 space-y-8">
             {/* Stats */}
             <div className="grid grid-cols-3 gap-4">
                {stats.map((s, i) => (
                   <div key={i} className="card p-6 text-center bg-white dark:bg-slate-900">
                      <div className={`mx-auto mb-3 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${s.color}`}>
                         {s.icon}
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                   </div>
                ))}
             </div>

             {/* About / Bio */}
             <div className="card p-8 bg-white dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   Giới thiệu bản thân
                </h3>
                {isEditing ? (
                  <textarea 
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm leading-relaxed"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{user?.bio}"
                  </p>
                )}
             </div>

             {/* Recent Activity Mock */}
             <div className="card p-8 bg-white dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Hoạt động gần đây</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 flex-shrink-0">
                         <BookOpen size={20} />
                      </div>
                      <div>
                         <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Bạn đã hoàn thành bài học "Bitcoin là gì?"</p>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">Hôm qua • +20 Points</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 flex-shrink-0">
                         <User size={20} />
                      </div>
                      <div>
                         <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Bạn đã gia nhập Crypto2u Academy</p>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">10/12/2025 • Welcome Gift</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
