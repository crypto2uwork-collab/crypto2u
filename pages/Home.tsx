
import React from 'react';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Layers, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';

const Home: React.FC = () => {
  const { t, getContent } = useSettings();
  const { articles } = getContent();

  const featuredArticles = articles.filter(a => a.category === 'nghien-cuu').slice(0, 2);
  const latestArticles = articles.slice(0, 5);

  const getLikes = (slug: string) => {
    return localStorage.getItem(`crypto2u_likes_${slug}`) || '0';
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-500/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">{t('heroTag')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight text-slate-900 dark:text-white">
            {t('heroTitle')} <span className="gradient-text">{t('heroSubtitle')}</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/guides" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/20 transition flex items-center gap-2">
              {t('ctaStart')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
         <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-3/4 space-y-12">
               {/* Features */}
               <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: <Shield size={18} />, title: t('featureSafe'), desc: t('featureSafeDesc'), color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { icon: <Zap size={18} />, title: t('featurePractical'), desc: t('featurePracticalDesc'), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { icon: <Globe size={18} />, title: t('featureUpdate'), desc: t('featureUpdateDesc'), color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                  ].map((f, i) => (
                    <div key={i} className="card p-5 hover:-translate-y-1 transition">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>{f.icon}</div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
               </div>

               {/* Featured */}
               <section>
                  <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" /> {t('sectionFeatured')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                     {featuredArticles.map((a, i) => (
                        <Link to={`/article/${a.slug}`} key={i} className="group card overflow-hidden">
                           <div className="aspect-video overflow-hidden bg-slate-200 relative">
                              <img src={a.image} alt={a.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-pink-500">
                                <Heart size={10} className="fill-pink-500" /> {getLikes(a.slug)}
                              </div>
                           </div>
                           <div className="p-5">
                              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition">{a.title}</h3>
                              <p className="text-xs text-slate-500 line-clamp-2">{a.description}</p>
                           </div>
                        </Link>
                     ))}
                  </div>
               </section>

               {/* Latest */}
               <section>
                  <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Layers size={20} className="text-purple-600" /> {t('sectionLatest')}
                  </h2>
                  <div className="space-y-4">
                     {latestArticles.map((a, i) => (
                        <Link to={`/article/${a.slug}`} key={i} className="card p-3 flex items-center gap-4 hover:border-indigo-500 transition group">
                           <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                              <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">{a.title}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-[10px] text-slate-500">{a.date} • {a.views} {t('views')}</p>
                                <span className="text-[10px] text-pink-500 font-bold flex items-center gap-0.5">
                                  <Heart size={10} className="fill-pink-500" /> {getLikes(a.slug)}
                                </span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </section>
            </div>

            <aside className="lg:w-1/4">
               <div className="sticky top-24">
                  <Sidebar />
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
};

export default Home;
