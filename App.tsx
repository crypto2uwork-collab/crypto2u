import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CryptoTicker from './components/CryptoTicker';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Research from './pages/Research';
import Glossary from './pages/Glossary';
import Community from './pages/Community';
import About from './pages/About';
import ArticleDetail from './pages/ArticleDetail';
import HelpCenter from './pages/HelpCenter'; 
import Terms from './pages/Terms'; 
import Privacy from './pages/Privacy'; 
import News from './pages/News';
import AIChatWidget from './components/AIChatWidget';
import { SettingsProvider } from './context/SettingsContext';

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 pb-12 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow relative">
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/research" element={<Research />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <CryptoTicker />
        <AIChatWidget />
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;