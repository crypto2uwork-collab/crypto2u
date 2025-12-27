
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
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setTrending(data.coins.slice(0, 5)))
      .catch(() => {
        setTrending([
            { item: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png', market_cap_rank: 1 } },
            { item: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png', market_cap_rank: 2 } },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-500" />
          {t('trendingCoins')}
        </h3>
        <div className="space-y-3">
          {trending.map((coin) => (
            <Link to={`/news?q=${coin.item.name}`} key={coin.item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group">
              <img src={coin.item.thumb} alt={coin.item.name} className="w-6 h-6 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{coin.item.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{coin.item.symbol}</div>
              </div>
              <ArrowRight size={12} className="text-slate-300 group-hover:text-indigo-500 transition" />
            </Link>
          ))}
        </div>
      </div>

      <div className="card p-5 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
          <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
            Bạn cần hỗ trợ? Chat ngay với <strong>Crypto2u AI</strong> ở góc màn hình để được giải đáp thắc mắc về Crypto 24/7.
          </p>
      </div>
    </div>
  );
};

export default Sidebar;
