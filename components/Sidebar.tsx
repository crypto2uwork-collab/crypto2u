
import React, { useEffect, useState } from 'react';
import { TrendingUp, Twitter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
  }
}

const Sidebar: React.FC = () => {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const { t } = useSettings();

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/search/trending')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch trending");
        return res.json();
      })
      .then(data => setTrending(data.coins.slice(0, 5)))
      .catch(err => {
        console.error(err);
        setTrending([
            { item: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png', market_cap_rank: 1 } },
            { item: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png', market_cap_rank: 2 } },
            { item: { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png', market_cap_rank: 5 } },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Trending Widget */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" />
          {t('trendingCoins')}
        </h3>
        <div className="space-y-3">
          {trending.length > 0 ? trending.map((coin) => (
            <Link 
              to={`/news?q=${coin.item.name}`} 
              key={coin.item.id} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer group"
            >
              <img src={coin.item.thumb} alt={coin.item.name} className="w-8 h-8 rounded-full shadow-sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{coin.item.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{coin.item.symbol} <span className="text-slate-300 dark:text-slate-600 mx-1">•</span> #{coin.item.market_cap_rank}</div>
              </div>
              <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          )) : (
            <div className="text-slate-500 text-xs text-center py-4">{t('loading')}</div>
          )}
        </div>
      </div>

      {/* Social Widget */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-[#1DA1F2]/10 rounded-lg">
                <Twitter className="text-[#1DA1F2] w-5 h-5" />
             </div>
             <div>
                 <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('followUs')}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400">@Crypto_2U</p>
             </div>
        </div>
        <a 
            href="https://twitter.com/Crypto_2U" 
            target="_blank" 
            rel="noreferrer" 
            className="block w-full text-center py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition shadow-md"
        >
            {t('followBtn')}
        </a>
      </div>

      {/* Support Message Card */}
      <div className="card p-5 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed">
            Bạn cần hỗ trợ? Chat ngay với <strong>AI Tutor</strong> ở góc màn hình để được giải đáp thắc mắc về Crypto 24/7.
          </p>
      </div>
    </div>
  );
};

export default Sidebar;
