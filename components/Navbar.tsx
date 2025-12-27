
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bitcoin, BookOpen, PieChart, Users, HelpCircle, Home, Search as SearchIcon, FileText, Newspaper } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t, getContent } = useSettings();
  const { articles, glossary } = getContent();
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: t('home'), path: '/', icon: <Home size={18} /> },
    { name: t('news'), path: '/news', icon: <Newspaper size={18} /> },
    { name: t('guides'), path: '/guides', icon: <BookOpen size={18} /> },
    { name: t('research'), path: '/research', icon: <PieChart size={18} /> },
    { name: t('glossary'), path: '/glossary', icon: <HelpCircle size={18} /> },
    { name: t('community'), path: '/community', icon: <Users size={18} /> },
    { name: t('about'), path: '/about', icon: <Bitcoin size={18} /> },
  ];

  const filteredArticles = searchQuery.trim() === '' 
    ? [] 
    : articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);

  const filteredTerms = searchQuery.trim() === '' 
    ? [] 
    : glossary.filter(t => 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.definition.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm border-slate-200 py-3' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <NavLink to="/">
              <Logo />
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="w-px h-6 bg-slate-200 mx-3"></div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-sm hover:border-indigo-500 hover:text-indigo-600 transition group"
              >
                <SearchIcon size={16} />
                <span>{t('searchCmd')}</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] text-slate-500 font-mono">Ctrl K</kbd>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="xl:hidden flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-600 p-2"
              >
                <SearchIcon size={24} />
              </button>
              
              <button
                className="text-slate-600 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`xl:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 overflow-hidden shadow-xl ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col p-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold py-3 px-4 rounded-xl flex items-center gap-3 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          ></div>

          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center px-4 py-4 border-b border-slate-100 gap-3">
              <SearchIcon className="text-indigo-500 w-5 h-5" />
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/news?q=${searchQuery}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent border-none text-slate-900 text-lg placeholder-slate-400 focus:outline-none focus:ring-0"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">ESC</button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto bg-slate-50 p-2">
              {searchQuery.trim() === '' ? (
                <div className="py-12 text-center text-slate-400">
                  <p>{t('searchPlaceholder')}</p>
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  <button 
                    onClick={() => {
                        navigate(`/news?q=${searchQuery}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                    }}
                    className="w-full text-center py-2 text-indigo-600 font-bold hover:underline"
                  >
                    Xem tất cả tin tức về "{searchQuery}" &rarr;
                  </button>

                  {filteredArticles.length === 0 && filteredTerms.length === 0 && (
                    <div className="py-8 text-center text-slate-500">
                      {t('noResults')} "{searchQuery}"
                    </div>
                  )}

                  {filteredArticles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('guides')}</h3>
                        {filteredArticles.map((article) => (
                          <button
                            key={article.slug}
                            onClick={() => handleNavigate(`/article/${article.slug}`)}
                            className="w-full text-left bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group flex items-start gap-3"
                          >
                             <div className="bg-indigo-50 p-2 rounded text-indigo-600">
                                <FileText size={18} />
                             </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-indigo-600">
                                {article.title}
                              </div>
                              <div className="text-sm text-slate-500 line-clamp-1">{article.description}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {filteredTerms.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('glossary')}</h3>
                        {filteredTerms.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNavigate('/glossary')}
                             className="w-full text-left bg-white p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:shadow-md transition group flex items-start gap-3"
                          >
                            <div className="bg-purple-50 p-2 rounded text-purple-600">
                                <BookOpen size={18} />
                             </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-purple-600">
                                {term.term}
                              </div>
                              <div className="text-sm text-slate-500 line-clamp-1">{term.definition}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
