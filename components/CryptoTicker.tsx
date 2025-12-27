import React, { useEffect, useState } from 'react';

interface CoinPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;

  const width = 50;
  const height = 16;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CryptoTicker: React.FC = () => {
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const coinIds = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'avalanche-2', 'polkadot', 'chainlink', 'dogecoin'];

  // Fallback data
  const generateFakeSparkline = (trend: 'up' | 'down') => {
    const data = [];
    let val = 100;
    for (let i = 0; i < 20; i++) {
        val = val + (Math.random() * 10 - 5) + (trend === 'up' ? 2 : -2);
        data.push(val);
    }
    return { price: data };
  };

  const fallbackCoins: CoinPrice[] = [
    { id: 'bitcoin', symbol: 'btc', current_price: 96540, price_change_percentage_24h: 1.2, sparkline_in_7d: generateFakeSparkline('up') },
    { id: 'ethereum', symbol: 'eth', current_price: 3650, price_change_percentage_24h: -0.5, sparkline_in_7d: generateFakeSparkline('down') },
    { id: 'solana', symbol: 'sol', current_price: 238, price_change_percentage_24h: 3.2, sparkline_in_7d: generateFakeSparkline('up') },
    { id: 'binancecoin', symbol: 'bnb', current_price: 715, price_change_percentage_24h: 0.1, sparkline_in_7d: generateFakeSparkline('up') },
    { id: 'ripple', symbol: 'xrp', current_price: 2.45, price_change_percentage_24h: 8.5, sparkline_in_7d: generateFakeSparkline('up') },
    { id: 'cardano', symbol: 'ada', current_price: 0.92, price_change_percentage_24h: -1.5, sparkline_in_7d: generateFakeSparkline('down') },
    { id: 'avalanche-2', symbol: 'avax', current_price: 42, price_change_percentage_24h: 2.1, sparkline_in_7d: generateFakeSparkline('up') },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data: CoinPrice[] = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setCoins(fallbackCoins);
        setLoading(false);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 h-10 flex items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...coins, ...coins].map((coin, idx) => {
           const isPositive = coin.price_change_percentage_24h >= 0;
           const color = isPositive ? '#10b981' : '#ef4444'; // emerald-500 : red-500
           
           return (
            <div key={`${coin.id}-${idx}`} className="mx-6 flex items-center gap-3">
              <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase">{coin.symbol}</span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-mono">${coin.current_price.toLocaleString()}</span>
                  <span className={`${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} text-xs font-bold`}>
                      {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
              </div>
              <div className="w-[50px]">
                 <Sparkline data={coin.sparkline_in_7d?.price} color={color} />
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CryptoTicker;