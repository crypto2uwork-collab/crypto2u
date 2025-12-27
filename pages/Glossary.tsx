import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Glossary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { t, getContent } = useSettings();
  const { glossary } = getContent();

  const filteredTerms = useMemo(() => {
    return glossary.filter(item => {
      const matchSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                          item.definition.toLowerCase().includes(search.toLowerCase());
      const matchLetter = selectedLetter ? item.term.toUpperCase().startsWith(selectedLetter) : true;
      return matchSearch && matchLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, selectedLetter, glossary]);

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t('glossaryTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {t('glossarySubtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('searchTerm')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
          />
        </div>

        {/* Alphabet Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
           <button 
             onClick={() => setSelectedLetter(null)}
             className={`px-3 py-1 rounded text-sm font-bold transition ${!selectedLetter ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
           >
             ALL
           </button>
           {alphabet.map(letter => (
             <button
               key={letter}
               onClick={() => setSelectedLetter(letter === '#' ? null : letter)}
               className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition ${selectedLetter === letter ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
             >
               {letter}
             </button>
           ))}
        </div>

        {/* Terms List */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, idx) => (
              <div key={idx} className="card p-6 hover:border-indigo-500 transition">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.term}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.definition}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-slate-500">{t('noResults')} "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glossary;