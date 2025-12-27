import React from 'react';
import { Zap } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center group cursor-pointer">
        <div className="absolute inset-0 bg-cyan-500/30 rounded-xl rotate-6 transition-transform group-hover:rotate-12 duration-300"></div>
        <div className="absolute inset-0 bg-indigo-500/30 rounded-xl -rotate-6 transition-transform group-hover:-rotate-12 duration-300"></div>
        <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10 overflow-hidden">
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <Zap className="text-white w-6 h-6 fill-white drop-shadow-md relative z-10" />
        </div>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col justify-center">
         <span className="font-display font-bold text-2xl leading-none tracking-tight flex items-baseline">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 dark:from-cyan-300 dark:to-blue-500 filter drop-shadow-sm">
                Crypto
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-extrabold filter drop-shadow-sm">
                2u
            </span>
         </span>
         <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase leading-none mt-1 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors pl-0.5">
            Academy
         </span>
      </div>
    </div>
  );
};

export default Logo;