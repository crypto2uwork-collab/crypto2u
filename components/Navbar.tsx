
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bitcoin, BookOpen, PieChart, Users, HelpCircle, Home, Search as SearchIcon, FileText, Newspaper, User, LogOut, Settings } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t, getContent } = useSettings();
  const { user, isLoggedIn, logout } = useAuth();
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
    setIsUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('home'), path: '/', icon: <Home size={18} /> },
    { name: t('news'), path: '/news', icon: <Newspaper size={18} /> },
    { name: t('guides'), path: '/guides', icon: <BookOpen size={18} /> },
    { name: t('research'), path: '/research', icon: <PieChart size={18} /> },
    { name: t('glossary'), path: '/glossary', icon: <HelpCircle size={18} /> },
    { name: t('community'), path: '/community', icon: <Users size={18} /> },
  ];

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
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200 dark:border-slate-800 py-3' 
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
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-3"></div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="mr-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-sm hover:border-indigo-500 transition group"
              >
                <SearchIcon size={16} />
                <span className="hidden lg:inline">{t('searchCmd')}</span>
              </button>

              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-md transition"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user?.name}</span>
                    <img src={user?.avatar} className="w-8 h-8 rounded-full bg-slate-100 border border-indigo-100" alt="Avatar" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 animate-fade-in">
                       <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                          <User size={16} /> Trang cá nhân
                       </Link>
                       <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                          <Settings size={16} /> Cài đặt
                       </Link>
                       <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                       <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                       >
                          <LogOut size={16} /> Đăng xuất
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition">
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="xl:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-600 dark:text-slate-400 p-2"
              >
                <SearchIcon size={22} />
              </button>
              
              <button
                className="text-slate-600 dark:text-slate-400 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`xl:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden shadow-xl ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col p-6 space-y-2">
             {isLoggedIn && (
               <Link to="/profile" className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4">
                  <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-slate-500">Xem hồ sơ của bạn</div>
                  </div>
               </Link>
             )}
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold py-3 px-4 rounded-xl flex items-center gap-3 ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
            {!isLoggedIn && (
               <Link 
                to="/auth" 
                className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-center"
                onClick={() => setMobileMenuOpen(false)}
               >
                 Đăng nhập ngay
               </Link>
            )}
            {isLoggedIn && (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-center"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
