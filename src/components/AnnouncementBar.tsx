import React from 'react';
import { Phone, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const { language, setLanguage, storeSettings } = useShop();

  return (
    <div className="bg-neutral-900 text-neutral-300 text-xs border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Announcement Text */}
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {language === 'bn' ? storeSettings.announcementTextBn : storeSettings.announcementText}
          </span>
        </div>

        {/* Right: Hotline & Language switcher */}
        <div className="flex items-center gap-4 shrink-0 text-xs">
          <a
            href={`tel:${storeSettings.hotline}`}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono tabular-nums">{storeSettings.hotline}</span>
          </a>

          <span className="text-neutral-700" aria-hidden="true">|</span>

          {/* Language Switcher */}
          <div className="flex items-center bg-neutral-800 rounded p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'en'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'bn'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
