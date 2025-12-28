
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) return <Navigate to="/profile" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, isLogin ? (email.split('@')[0]) : name);
    navigate('/community');
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full">
         <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Chào mừng trở lại!' : 'Bắt đầu hành trình'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
                {isLogin ? 'Đăng nhập để tương tác với cộng đồng.' : 'Tạo tài khoản miễn phí để lưu trữ kiến thức.'}
            </p>
         </div>

         <div className="card p-8 bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
               {!isLogin && (
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Họ tên</label>
                   <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text" 
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                      />
                   </div>
                 </div>
               )}

               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email" 
                      placeholder="email@vidu.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Mật khẩu</label>
                 <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                    />
                 </div>
               </div>

               <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group"
               >
                 {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </form>

            <div className="mt-8">
               <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                  <span className="relative px-4 bg-white dark:bg-slate-900 text-xs text-slate-400 font-bold uppercase">Hoặc</span>
               </div>

               <button className="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <Github size={18} /> Tiếp tục với GitHub
               </button>
            </div>
         </div>

         <p className="text-center mt-8 text-sm text-slate-500">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1.5 text-indigo-600 font-bold hover:underline"
            >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
            </button>
         </p>

         <div className="mt-12 flex items-center justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <ShieldCheck size={14} /> Secure Access
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <Sparkles size={14} /> AI Powered
            </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;
