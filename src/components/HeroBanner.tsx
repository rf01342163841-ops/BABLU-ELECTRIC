import React from 'react';
import {
  Truck,
  ShieldCheck,
  Zap,
  Layers,
  MapPin,
  CheckCircle2,
  Phone,
  Sparkles,
  Eye,
  Store,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const HeroBanner: React.FC = () => {
  const { language, storeSettings, setSelectedCategory } = useShop();

  const isBn = language === 'bn';

  const darazCategories = [
    { name: 'টি৯ হেয়ার ও দাড়ি ট্রিমার', en: 'Personal Care & Beauty', icon: '✂️' },
    { name: 'স্মার্টওয়াচ ও ব্লুটুথ অডিও', en: 'Electronics & Gadgets', icon: '⌚' },
    { name: 'ইলেকট্রিক চপার ও কিচেন', en: 'Home & Living', icon: '🍳' },
    { name: 'সুইচ, সকেট ও সার্কিট ব্রেকার', en: 'Switches & Electricals', icon: '🔌' },
    { name: 'এলইডি লাইট ও বাল্ব', en: 'LED Lights & Bulbs', icon: '💡' },
    { name: 'কপার তার ও ক্যাবল', en: 'Copper Wires & Cables', icon: '⚡' },
    { name: 'প্রিমিয়াম লেদার ওয়ালেট', en: 'Fashion & Lifestyle', icon: '👛' },
    { name: 'পাইকারি হোলসেল ডিল', en: 'Wholesale Bundles', icon: '📦' },
  ];

  return (
    <section className="bg-[#f5f5f5] pt-4 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Daraz-Style 3-Column Layout: Categories (Left) + Slider Banner (Center) + Store Visiting Card Box (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          
          {/* Left Column: Daraz Category Menu (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 bg-white rounded-xl border border-neutral-200/90 p-3 flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100 text-xs font-black text-neutral-800 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#f85606]" />
                <span>{isBn ? 'ক্যাটাগরি সমূহ' : 'All Categories'}</span>
              </div>

              <div className="space-y-0.5 pt-2">
                {darazCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat.en);
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-3 py-1.8 rounded-lg text-xs font-medium text-neutral-700 hover:text-[#f85606] hover:bg-orange-50/80 flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate group-hover:font-bold">{isBn ? cat.name : cat.en}</span>
                    </span>
                    <span className="text-neutral-300 text-xs group-hover:text-[#f85606]">›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Visiting Card shortcut at bottom of categories */}
            <div className="pt-2 border-t border-neutral-100">
              <a
                href="#visiting-card"
                onClick={() => sound.playClick()}
                className="flex items-center justify-between px-3 py-2 bg-orange-50 hover:bg-orange-100 text-[#f85606] text-xs font-bold rounded-lg transition-colors border border-orange-200"
              >
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  <span>{isBn ? 'দোকানের কার্ড ও লোকেশন' : 'Shop Card & Location'}</span>
                </span>
                <span>›</span>
              </a>
            </div>
          </div>

          {/* Center Column: Daraz Campaign Slider Banner */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-[#f85606] via-[#ff6a00] to-[#e04a00] text-white flex flex-col justify-between p-6 sm:p-8 min-h-[360px]">
            {/* Background subtle image overlay */}
            <img
              src="/src/assets/images/hero_ecommerce_lifestyle_1792578093417.jpg"
              alt="Daraz Style Mega Sale"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"
            />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? 'কাওরান বাজার পাইকারি মার্কেট' : 'Kawran Bazar Wholesale Hub'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-sm">
                {isBn
                  ? 'বাবলু ইলেকট্রিক — দারাজ স্টাইল অনলাইন শপ'
                  : 'BABLU ELECTRIC — Daraz Style Online Hub'}
              </h1>

              <p className="text-xs sm:text-sm text-orange-100 max-w-md leading-relaxed font-medium">
                {isBn
                  ? 'টি৯ ট্রিমার, আল্ট্রা স্মার্টওয়াচ, ইলেকট্রিক চপার এবং গ্যাজেট সরাসরি পাইকারি দরে। সারা দেশে ক্যাশ অন ডেলিভারি।'
                  : 'Genuine electronic goods, trimmers, kitchen appliances, and hardware with nationwide Cash on Delivery.'}
              </p>
            </div>

            <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
              <a
                href="#flash-sale"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-[#f85606] rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current text-[#f85606]" />
                <span>{isBn ? 'ফ্ল্যাশ সেল কিনুন' : 'Shop Flash Sale'}</span>
              </a>

              <a
                href="#visiting-card"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 bg-black/30 hover:bg-black/40 text-white rounded-xl text-xs font-bold border border-white/30 backdrop-blur-md transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>{isBn ? 'দোকানের কার্ড ও ঠিকানা' : 'Store Card & Map'}</span>
              </a>
            </div>

            {/* Bottom trust ticker */}
            <div className="relative z-10 pt-4 mt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-orange-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? '১০০% আসল পণ্য' : '100% Genuine'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? '৭ দিনের রিটার্ন গ্যারান্টি' : '7-Day Easy Return'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Bablu Electric Official Store Card & Direct Contact Box */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between shadow-2xs space-y-3">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#f85606] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {isBn ? 'অফিসিয়াল শোরুম' : 'Official Showroom'}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {isBn ? 'দোকান খোলা' : 'Store Open'}
                </span>
              </div>

              {/* Business Card Photo Thumbnail */}
              <div
                onClick={() => {
                  sound.playClick();
                  const el = document.getElementById('visiting-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-sm group cursor-pointer"
              >
                <img
                  src="/assets/aistudio/IMG_20261021_172504_fe6990d1.jpg"
                  alt="Bablu Electric Visiting Card"
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সম্পূর্ণ কার্ড দেখুন' : 'View Full Card'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-sm text-neutral-900 leading-tight">
                  BABLU ELECTRIC
                </h3>
                <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                  {isBn ? 'স্বত্বাধিকারী:' : 'Proprietor:'}{' '}
                  <strong className="text-neutral-900">Mahmudul Hassan Bablu</strong>
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  192/193 Super Market, Bhaban No-2, Kawran Bazar, Dhaka-1215
                </p>
              </div>

              {/* Direct Hotlines */}
              <div className="space-y-1.5 pt-1 text-xs">
                <a
                  href={`tel:${storeSettings.hotline}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-orange-50/70 hover:bg-orange-100 border border-orange-200 text-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#f85606]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isBn ? 'হটলাইন:' : 'Hotline:'}</span>
                  </span>
                  <span className="font-mono font-bold text-xs">{storeSettings.hotline}</span>
                </a>

                <a
                  href={`https://wa.me/88${storeSettings.alternatePhone}?text=${encodeURIComponent(
                    isBn ? 'আসসালামু আলাইকুম বাবলু ইলেকট্রিক!' : 'Hello Bablu Electric!'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-neutral-800 transition-colors"
                >
                  <span className="text-[11px] font-bold text-emerald-700">
                    💬 WhatsApp:
                  </span>
                  <span className="font-mono font-bold text-xs">{storeSettings.alternatePhone}</span>
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <a
                href="#visiting-card"
                onClick={() => sound.playClick()}
                className="w-full py-2 bg-[#f85606] hover:bg-[#d84803] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>{isBn ? 'দোকানের ঠিকানা ও ম্যাপ' : 'Showroom Card & Map'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
