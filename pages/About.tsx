
import React from 'react';
import { Target, Heart, Users, ShieldCheck, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About: React.FC = () => {
  const { t } = useSettings();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t('aboutDesc')}
          </p>
        </div>

        {/* Mission Section - Updated Background for better readability */}
        <div className="card p-8 md:p-12 mb-16 relative overflow-hidden bg-slate-900 dark:bg-indigo-950 text-white border-none shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -z-10"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10"></div>
           
           <h2 className="text-3xl font-display font-bold mb-6 text-white">{t('missionTitle')}</h2>
           <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 text-slate-100 text-lg leading-relaxed font-medium">
                 <p>{t('missionDesc')}</p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                 <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                    <ShieldCheck className="w-20 h-20 text-indigo-400" />
                 </div>
              </div>
           </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t('visionTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Zap className="w-8 h-8 text-cyan-500" />, title: t('valAccessible'), text: t('valAccessibleDesc') },
            { icon: <Target className="w-8 h-8 text-pink-500" />, title: t('valAccurate'), text: t('valAccurateDesc') },
            { icon: <Users className="w-8 h-8 text-amber-500" />, title: t('valCommunity'), text: t('valCommunityDesc') },
          ].map((val, idx) => (
            <div key={idx} className="card p-8 text-center hover:-translate-y-2 transition duration-300">
              <div className="mb-4 inline-flex p-3 bg-slate-100 dark:bg-slate-700/50 rounded-full">{val.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{val.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-10 rounded-3xl text-center">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('joinUs')}</h2>
           <p className="text-slate-600 dark:text-slate-300 mb-8">Theo dõi Crypto2u trên X để cập nhật những phân tích thị trường nhanh nhất.</p>
           <a href="https://x.com/Crypto_2U" target="_blank" rel="noreferrer" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition">
              {t('followBtn')}
           </a>
        </div>
      </div>
    </div>
  );
};

export default About;
