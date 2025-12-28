
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmailSent, setCheckEmailSent] = useState(false);
  
  const { login, signUp, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) return <Navigate to="/profile" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/community');
      } else {
        await signUp(email, password, name);
        setCheckEmailSent(true); // Hiển thị thông báo yêu cầu xác nhận email
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Invalid login credentials') {
        setError('Email hoặc mật khẩu không chính xác. Hoặc tài khoản chưa được xác nhận email.');
      } else {
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-md w-full card p-8 text-center space-y-6 animate-fade-in">
           <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kiểm tra Email của bạn!</h2>
           <p className="text-slate-600 dark:text-slate-400">
             Chúng tôi đã gửi một link xác nhận đến <strong>{email}</strong>. Vui lòng click vào link trong email để kích hoạt tài khoản Crypto2u.
           </p>
           <button 
             onClick={() => { setCheckEmailSent(false); setIsLogin(true); }}
             className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition"
           >
             Quay lại Đăng nhập
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full">
         <div className="text-center mb-8">
            <div className="flex justify-center mb-6"><Logo /></div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Chào mừng trở lại!' : 'Bắt đầu hành trình'}
            </h1>
            <p className="text-slate-500 text-sm">Cộng đồng học tập Crypto2u Academy</p>
         </div>

         <div className="card p-8 bg-white dark:bg-slate-900 border-indigo-100 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
               {error && (
                 <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-100 dark:border-red-900/30">
                   {error}
                 </div>
               )}
               
               {!isLogin && (
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Họ tên</label>
                   <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="VD: Nguyễn Văn A" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none text-sm text-slate-900 dark:text-white" />
                   </div>
                 </div>
               )}
               
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@vidu.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none text-sm text-slate-900 dark:text-white" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Mật khẩu</label>
                 <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none text-sm text-slate-900 dark:text-white" />
                 </div>
               </div>
               
               <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 group">
                 {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
                 {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
               </button>
            </form>
         </div>
         
         <p className="text-center mt-8 text-sm text-slate-500">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="ml-1.5 text-indigo-600 font-bold hover:underline">
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
         </p>
      </div>
    </div>
  );
};

export default Auth;
