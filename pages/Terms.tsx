import React from 'react';
import { ShieldAlert, Scale, FileText, Globe, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Terms: React.FC = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
         <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                {t('termsTitle')}
            </h1>
         </div>
         
         <div className="card p-8 md:p-12 space-y-12">
            {/* Warning Box */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl flex gap-4 items-start">
                <ShieldAlert className="text-red-600 dark:text-red-400 w-8 h-8 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">IMPORTANT RISK WARNING</h3>
                    <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                        {t('termsWarning')}
                    </p>
                </div>
            </div>

            <section className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 font-bold">1</div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('term1_title')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('term1_desc')}</p>
                </div>
            </section>

            <section className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 font-bold">2</div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('term2_title')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('term2_desc')}</p>
                </div>
            </section>

            <section className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 font-bold">3</div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('term3_title')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('term3_desc')}</p>
                </div>
            </section>

            <section className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 font-bold">4</div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('term4_title')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('term4_desc')}</p>
                </div>
            </section>
         </div>
         
         <div className="mt-8 text-center text-sm text-slate-500">
            Last updated: Dec 2025
         </div>
      </div>
    </div>
  );
};

export default Terms;