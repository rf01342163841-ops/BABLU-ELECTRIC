import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Truck,
  Store,
  Headphones,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    storeSettings,
    cartItemCount,
    cartGrandTotal,
    wishlist,
    currentUser,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    products,
    setActiveModal,
    showToast,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.getSoundEnabled());
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const isBn = language === 'bn';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
    showToast(
      next
        ? (isBn ? 'সাউন্ড চালু করা হয়েছে 🔊' : 'Sound enabled 🔊')
        : (isBn ? 'সাউন্ড বন্ধ করা হয়েছে 🔇' : 'Sound muted 🔇'),
      'info'
    );
  };

  const trendingKeywords = [
    { label: isBn ? 'টি৯ ট্রিমার' : 'T9 Trimmer', q: 'T9' },
    { label: isBn ? 'স্মার্টওয়াচ' : 'Smart Watch', q: 'Smart Watch' },
    { label: isBn ? 'ফুড চপার' : 'Electric Chopper', q: 'Chopper' },
    { label: isBn ? 'ইলেকট্রিক সুইচ' : 'Switches & Sockets', q: 'Switch' },
    { label: isBn ? 'তামার তার' : 'Copper Wire', q: 'Wire' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-neutral-200">
      
      {/* Daraz-Style Top Utility Bar */}
      <div className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 text-[11px] py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="text-[#f85606] font-black">
              {isBn ? 'দারাজ স্টাইল অনলাইন শপ' : 'Daraz-Style Store'}
            </span>
            <span aria-hidden="true" className="text-neutral-300">|</span>
            <span className="truncate font-medium text-neutral-700">
              {isBn
                ? 'কাওরান বাজার পাইকারি মার্কেট — বাবলু ইলেকট্রিক'
                : 'Kawran Bazar Wholesale Hub — Bablu Electric'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            {/* Store Visiting Card & Location */}
            <a
              href="#visiting-card"
              onClick={() => sound.playClick()}
              className="hover:text-[#f85606] transition-colors flex items-center gap-1 font-bold text-neutral-800"
            >
              <Store className="w-3.5 h-3.5 text-[#f85606]" />
              <span>{isBn ? 'দোকানের কার্ড ও লোকেশন' : 'Shop Card & Location'}</span>
            </a>

            {/* 24/7 Support */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal('support');
              }}
              className="hover:text-[#f85606] transition-colors flex items-center gap-1 cursor-pointer font-bold text-neutral-800"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? 'কাস্টমার সাপোর্ট' : 'Support 24/7'}</span>
            </button>

            {/* Track Order */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal('track_order');
              }}
              className="hidden md:flex hover:text-[#f85606] transition-colors items-center gap-1 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.trackOrder}</span>
            </button>

            {/* Direct Phone Hotline */}
            <a
              href={`tel:${storeSettings.hotline}`}
              className="hidden lg:flex hover:text-[#f85606] transition-colors items-center gap-1 font-bold"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span className="font-mono">{storeSettings.hotline}</span>
            </a>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-neutral-200 transition-colors cursor-pointer text-[10px]"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#f85606]" />
                  <span className="hidden sm:inline font-bold text-[#f85606]">{isBn ? 'সাউন্ড চালু' : 'Sound On'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline text-neutral-400">{isBn ? 'সাউন্ড মিউট' : 'Muted'}</span>
                </>
              )}
            </button>

            {/* Language toggle */}
            <div className="flex items-center bg-white rounded border border-neutral-200 px-1 py-0.5 text-[10px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#f85606] text-white font-bold' : 'text-neutral-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${
                  language === 'bn' ? 'bg-[#f85606] text-white font-bold' : 'text-neutral-600'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Daraz-Orange Header */}
      <div className="bg-[#f85606] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo Lockup: Bablu Electric with stylized B */}
            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('All');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#f85606] flex items-center justify-center font-black text-2xl shadow-md border-2 border-orange-200">
                <span className="text-emerald-600">B</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-xs">
                    BABLU ELECTRIC
                  </span>
                </div>
                <span className="text-[10px] text-orange-100 font-bold uppercase tracking-wider -mt-1">
                  {isBn ? 'কাওরান বাজার পাইকারি শোরুম' : 'Kawran Bazar Wholesale Hub'}
                </span>
              </div>
            </button>

            {/* Wide Search Bar - Daraz Style with Trending Keywords */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 flex-col">
              <form onSubmit={handleSearchSubmit} className="relative w-full flex shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isBn
                      ? 'বাবলু ইলেকট্রিক-এ খুঁজুন... (টি৯ ট্রিমার, চপার, স্মার্টওয়াচ, লাইট, সুইচ)'
                      : 'Search in Bablu Electric... (T9 Trimmer, Chopper, Smart Watch, Lights)'
                  }
                  className="w-full bg-white text-neutral-900 placeholder-neutral-400 text-xs sm:text-sm pl-4 pr-12 py-2.5 rounded-l-lg border-0 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 px-6 rounded-r-lg text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Trending Keywords underneath */}
              <div className="flex items-center gap-2 mt-1 text-[10px] text-orange-100 overflow-x-auto no-scrollbar">
                <span className="text-orange-200 font-bold shrink-0">{isBn ? 'জনপ্রিয়:' : 'Trending:'}</span>
                {trendingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      sound.playClick();
                      setSearchQuery(kw.q);
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline hover:text-white cursor-pointer shrink-0"
                  >
                    {kw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions: Store Card, Support, Account, Wishlist & Cart */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Quick Store Card Button */}
              <a
                href="#visiting-card"
                onClick={() => sound.playClick()}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Store className="w-4 h-4 text-amber-200" />
                <span>{isBn ? 'দোকানের কার্ড' : 'Shop Card'}</span>
              </a>

              {/* Support Quick Modal Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveModal('support');
                }}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-amber-200" />
                <span>{isBn ? 'সাপোর্ট' : 'Support'}</span>
              </button>

              {/* Account */}
              <button
                onClick={() => {
                  sound.playClick();
                  if (currentUser) {
                    setActiveModal('account_profile');
                  } else {
                    setActiveModal('login');
                  }
                }}
                className="flex items-center gap-1.5 text-white hover:text-orange-100 text-xs font-semibold p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {currentUser ? (currentUser.role === 'admin' ? 'Admin' : currentUser.name) : t.login}
                </span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveModal('account_wishlist');
                }}
                className="relative p-2 text-white hover:text-orange-100 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title={t.wishlist}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#f85606] font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveModal('cart');
                }}
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-xs font-bold text-[#f85606] bg-white hover:bg-orange-50 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline font-mono">৳{cartGrandTotal.toLocaleString()}</span>
                {cartItemCount > 0 && (
                  <span className="bg-[#f85606] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Search Input */}
          <div className="md:hidden mt-2.5">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'বাবলু ইলেকট্রিক-এ খুঁজুন...' : 'Search in Bablu Electric...'}
                className="w-full bg-white text-neutral-900 placeholder-neutral-400 text-xs pl-3.5 pr-9 py-2 rounded-lg focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-neutral-900 text-white rounded-md flex items-center justify-center text-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 p-4 space-y-3">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {isBn ? 'ক্যাটাগরি সমূহ' : 'Categories'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                  setMobileMenuOpen(false);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-orange-50 hover:text-[#f85606] text-left font-medium transition-colors cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200 flex flex-col gap-2">
            <a
              href="#visiting-card"
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-orange-50 text-[#f85606] font-bold text-xs rounded-lg flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>{isBn ? 'দোকানের কার্ড ও কাওরান বাজার লোকেশন' : 'Shop Card & Kawran Bazar Location'}</span>
            </a>
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal('support');
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              <span>{isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : 'Customer Support 24/7'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
