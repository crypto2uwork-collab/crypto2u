
import React from 'react';
import { MessageSquare, Twitter, Users, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';

const Community: React.FC = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t('communityTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            {t('communitySubtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           <div className="lg:w-3/4 space-y-12">
              {/* Channels */}
              <div className="grid md:grid-cols-2 gap-8">
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

              {/* Events - Updated to Coming Soon state */}
              <div className="card p-8 bg-slate-50 dark:bg-slate-800/50 border-dashed border-2">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Users size={28} className="text-indigo-500" />
                    {t('eventsTitle')}
                 </h2>
                 
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-6 animate-pulse">
                        <Clock className="text-indigo-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 italic tracking-wide">COMING SOON</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Chúng tôi đang lên kế hoạch cho các buổi Webinar và AMA chất lượng. Hãy theo dõi Twitter để không bỏ lỡ thông báo mới nhất!
                    </p>
                 </div>
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
