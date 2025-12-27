
import React from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';

const Footer: React.FC = () => {
  const { t } = useSettings();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed mb-4">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition"><Github size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">{t('explore')}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('guides')}</Link></li>
              <li><Link to="/research" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('research')}</Link></li>
              <li><Link to="/glossary" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('glossary')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/help" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('helpCenter')}</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{t('privacy')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">{t('riskTitle')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed">
              {t('riskDesc')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-500 dark:text-slate-600">
          &copy; {new Date().getFullYear()} Crypto2u. {t('rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
