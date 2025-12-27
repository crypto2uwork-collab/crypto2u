import React from 'react';
import { Lock, EyeOff, Database, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Privacy: React.FC = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
         <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                {t('privacyTitle')}
            </h1>
         </div>

         <div className="grid md:grid-cols-3 gap-6 mb-12">
             <div className="card p-6 text-center hover:border-emerald-500 transition-colors">
                 <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Lock size={24} />
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('privacyFeature1')}</h4>
             </div>
             <div className="card p-6 text-center hover:border-indigo-500 transition-colors">
                 <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <EyeOff size={24} />
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('privacyFeature2')}</h4>
             </div>
             <div className="card p-6 text-center hover:border-purple-500 transition-colors">
                 <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Database size={24} />
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('privacyFeature3')}</h4>
             </div>
         </div>
         
         <div className="card p-8 md:p-12 space-y-12">
            <section className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-800"></span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('priv1_title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('priv1_desc')}</p>
            </section>

            <section className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-800"></span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('priv2_title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('priv2_desc')}</p>
            </section>

            <section className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-800"></span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('priv3_title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('priv3_desc')}</p>
            </section>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl flex items-center gap-4">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400 w-8 h-8 flex-shrink-0" />
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                    Your trust is our priority. We are committed to transparency and data minimization.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Privacy;