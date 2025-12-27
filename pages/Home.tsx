
import React from 'react';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSettings } from '../context/SettingsContext';

const Home: React.FC = () => {
  const { t, getContent } = useSettings();
  const { articles } = getContent();

  const featuredArticles = articles.filter(a => a.category === 'nghien-cuu').slice(0, 2);
  const latestArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-500/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">{t('heroTag')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
            {t('heroTitle')} <br className="hidden md:block" />
            <span className="gradient-text">{t('heroSubtitle')}</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {t('heroDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/guides" className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 group w-full sm:w-auto justify-center">
              {t('ctaStart')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/research" className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-base hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition-all w-full sm:w-auto justify-center">
              {t('ctaResearch')}
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
         <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-3/4 space-y-12">
               {/* Features */}
               <section>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: <Shield className="w-5 h-5" />, title: t('featureSafe'), desc: t('featureSafeDesc'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                      { icon: <Zap className="w-5 h-5" />, title: t('featurePractical'), desc: t('featurePracticalDesc'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                      { icon: <Globe className="w-5 h-5" />, title: t('featureUpdate'), desc: t('featureUpdateDesc'), color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    ].map((feature, idx) => (
                      <div key={idx} className="card p-5 flex flex-col items-start hover:-translate-y-1">
                        <div className={`p-2.5 rounded-lg mb-3 ${feature.bg} ${feature.color}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
               </section>

               {/* Featured Articles */}
               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" /> {t('sectionFeatured')}
                     </h2>
                     <Link to="/research" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{t('viewAll')}</Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     {featuredArticles.map((article, idx) => (
                        <Link to={`/article/${article.slug}`} key={idx} className="group flex flex-col card overflow-hidden hover:shadow-lg transition-all">
                           <div className="relative aspect-[21/9] overflow-hidden bg-slate-200 dark:bg-slate-700/50">
                              <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              <span className="absolute top-3 left-3 text-[9px] font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {article.category}
                              </span>
                           </div>
                           <div className="p-5 flex-1 flex flex-col">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2 leading-snug">{article.title}</h3>
                              <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mb-4 flex-1">{article.description}</p>
                              <div className="flex items-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                 <span>{article.date}</span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </section>

               {/* Latest Articles */}
               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers size={20} className="text-purple-600 dark:text-purple-400" /> {t('sectionLatest')}
                     </h2>
                     <Link to="/guides" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{t('viewAll')}</Link>
                  </div>

                  <div className="flex flex-col gap-3">
                     {latestArticles.map((article, idx) => (
                        <Link to={`/article/${article.slug}`} key={idx} className="card p-3 flex items-center gap-4 hover:border-indigo-500 transition group">
                           <div className="relative w-20 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700/50">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0 py-0.5">
                              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5 block">
                                  {article.category}
                              </span>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate pr-4">{article.title}</h3>
                              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 hidden sm:block">{article.description}</p>
                              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                 <span>{article.date}</span>
                                 <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                 <span>{article.views} {t('views')}</span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </section>
            </div>

            {/* Sidebar */}
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
