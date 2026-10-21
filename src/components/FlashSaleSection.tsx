import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { sound } from '../services/sound';

export const FlashSaleSection: React.FC = () => {
  const { t, language, products } = useShop();

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 22,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const flashSaleProducts = products.filter((p) => p.isFlashSale && !p.isArchived);

  if (flashSaleProducts.length === 0) return null;

  return (
    <section id="flash-sale" className="bg-[#f5f5f5] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Daraz Flash Sale White Card Container */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs p-4 sm:p-5">
          
          {/* Daraz Header Bar with Orange Title & Countdown Boxes */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#f85606] tracking-tight flex items-center gap-1.5">
                  <Flame className="w-6 h-6 fill-current text-[#f85606] animate-pulse" />
                  {language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale'}
                </span>
                <span className="text-[11px] text-neutral-500 font-semibold block sm:inline sm:ml-1">
                  {language === 'bn' ? 'কাওরান বাজার মেগা ধামাকা' : 'On Sale Now'}
                </span>
              </div>

              {/* Daraz-Style Orange Countdown Clock */}
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                <span className="text-[11px] font-bold text-neutral-600 uppercase">
                  {language === 'bn' ? 'সময় বাকি:' : 'Ending in:'}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs font-black">
                  <span className="bg-[#f85606] text-white px-2 py-1 rounded shadow-xs tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[#f85606] font-bold">:</span>
                  <span className="bg-[#f85606] text-white px-2 py-1 rounded shadow-xs tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[#f85606] font-bold">:</span>
                  <span className="bg-[#f85606] text-white px-2 py-1 rounded shadow-xs tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop More Link */}
            <a
              href="#catalog"
              onClick={() => sound.playClick()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-[#f85606] text-[#f85606] hover:bg-[#f85606] hover:text-white rounded-xl text-xs font-black uppercase tracking-wide transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{language === 'bn' ? 'সব পণ্য দেখুন' : 'SHOP MORE'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Flash Sale Product Cards (4 Column Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {flashSaleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
