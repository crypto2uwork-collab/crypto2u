
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { BookOpen, Layers, Zap } from 'lucide-react';

const Guides: React.FC = () => {
  const { t, getContent } = useSettings();
  const { articles } = getContent();
  
  // Filter articles by category 'huong-dan' AND level
  const beginnerGuides = articles.filter(a => a.category === 'huong-dan' && a.level === 'Beginner');
  const intermediateGuides = articles.filter(a => a.category === 'huong-dan' && a.level === 'Intermediate');
  const advancedGuides = articles.filter(a => a.category === 'huong-dan' && a.level === 'Advanced');

  const GuideSection = ({ title, desc, articles, icon, colorClass, borderClass }: any) => (
    <div className="mb-12">
       <div className={`card p-6 border-t-4 ${borderClass} mb-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900`}>
          <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm ${colorClass}`}>
                  {/* Fixed: cast icon to React.ReactElement with size prop to satisfy TS requirements */}
                  {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
              </div>
              <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{desc}</p>
              </div>
          </div>
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((guide: any, idx: number) => (
            <Link to={`/article/${guide.slug}`} key={idx} className="card p-5 hover:border-indigo-500 transition group flex flex-col h-full hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 bg-slate-200 dark:bg-slate-700/50">
                 <img src={guide.image} alt={guide.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                {guide.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                {guide.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{guide.date}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">{t('readNow')} &rarr;</span>
              </div>
            </Link>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t('guidesTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base">
            {t('guidesSubtitle')}
          </p>
        </div>

        <GuideSection 
            title={t('levelBeginner')} 
            desc={t('levelBeginnerDesc')} 
            articles={beginnerGuides}
            icon={<BookOpen />}
            colorClass="text-emerald-500"
            borderClass="border-emerald-500"
        />

        <GuideSection 
            title={t('levelIntermediate')} 
            desc={t('levelIntermediateDesc')} 
            articles={intermediateGuides}
            icon={<Layers />}
            colorClass="text-amber-500"
            borderClass="border-amber-500"
        />

        <GuideSection 
            title={t('levelAdvanced')} 
            desc={t('levelAdvancedDesc')} 
            articles={advancedGuides}
            icon={<Zap />}
            colorClass="text-indigo-500"
            borderClass="border-indigo-500"
        />

      </div>
    </div>
  );
};

export default Guides;
