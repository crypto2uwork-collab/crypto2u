import React from 'react';
import { MessageCircle, Mail, HelpCircle, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const HelpCenter: React.FC = () => {
  const { t } = useSettings();

  const faqs = [
    { q: t('faq1_q'), a: t('faq1_a') },
    { q: t('faq2_q'), a: t('faq2_a') },
    { q: t('faq3_q'), a: t('faq3_a') },
    { q: t('faq4_q'), a: t('faq4_a') },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
           <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6">
             {t('helpTitle')}
           </h1>
           <p className="text-xl text-slate-600 dark:text-slate-300">
             {t('helpSubtitle')}
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card p-8 flex items-start gap-6 group cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('chatAI')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{t('chatAIDesc')}</p>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                       Chat Now <ChevronRight size={16} />
                    </div>
                </div>
            </div>
            
            <div className="card p-8 flex items-start gap-6 group cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                <div className="bg-purple-100 dark:bg-purple-900/40 p-4 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t('contactSupport')}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{t('contactDesc')}</p>
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                       support@crypto2u.com
                    </div>
                </div>
            </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 text-center">{t('faqTitle')}</h2>
        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <div key={idx} className="card p-6 md:p-8 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                        <HelpCircle size={20} className="text-indigo-500 mt-1 flex-shrink-0" />
                        {faq.q}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8 border-l-2 border-slate-100 dark:border-slate-700 ml-2">
                        {faq.a}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;