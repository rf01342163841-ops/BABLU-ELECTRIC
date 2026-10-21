import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  Store,
  Headphones,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const Footer: React.FC = () => {
  const { language, storeSettings, setActiveModal, showToast } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isBn = language === 'bn';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    sound.playClick();
    setSubscribed(true);
    showToast(
      isBn
        ? 'ধন্যবাদ! বাবলু ইলেকট্রিক নিউজলেটারে যুক্ত হয়েছেন।'
        : 'Thank you for subscribing to Bablu Electric updates!',
      'success'
    );
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      
      {/* Newsletter & Direct Help Hotline */}
      <div className="border-b border-neutral-800 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#f85606]">
                {isBn ? 'কাওরান বাজার পাইকারি মার্কেট' : 'Kawran Bazar Wholesale Market'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isBn
                  ? 'বাবলু ইলেকট্রিক — পাইকারি ও খুচরা ইলেকট্রনিক্স শপ'
                  : 'BABLU ELECTRIC — Wholesale & Retail Electronics'}
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-lg">
                {isBn
                  ? 'টি৯ ট্রিমার, চপার, স্মার্টওয়াচ, ফ্যান, সুইচ ও তার পাইকারি দরে কিনুন। বিশেষ অফার ও আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।'
                  : 'Trimmers, food choppers, smartwatches, wiring, LED lights, and switches at direct wholesale rates. Subscribe for catalog deals.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-3 bg-neutral-800 rounded-xl text-emerald-400 flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'সফলভাবে সাবস্ক্রাইব সম্পন্ন হয়েছে!' : 'Successfully subscribed to updates!'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md ml-auto">
                  <input
                    type="email"
                    required
                    placeholder={isBn ? 'আপনার ইমেইল অ্যাড্রেস লিখুন' : 'Enter your email address'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-neutral-800 text-white placeholder-neutral-500 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-700 focus:outline-hidden focus:border-[#f85606]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#f85606] hover:bg-[#d84803] text-white rounded-lg font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <span>{isBn ? 'সাবস্ক্রাইব' : 'Subscribe'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Address from Visiting Card */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f85606] text-white flex items-center justify-center font-black text-sm shadow-sm">
                B
              </div>
              <div>
                <span className="text-sm font-black text-white tracking-tight block">
                  BABLU ELECTRIC
                </span>
                <span className="text-[10px] text-orange-200 block">
                  {isBn ? 'বাবলু ইলেকট্রিক — কাওরান বাজার' : 'Wholesale Showroom — Kawran Bazar'}
                </span>
              </div>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed">
              {isBn ? (
                <>
                  স্বত্বাধিকারী: <strong className="text-white">মাহমুদুল হাসান বাবলু</strong>
                  <br />
                  সকল প্রকার ইলেকট্রিক ও ইলেকট্রনিক্স পাইকারি ও খুচরা বিক্রেতা।
                </>
              ) : (
                <>
                  Proprietor: <strong className="text-white">Mahmudul Hassan Bablu</strong>
                  <br />
                  Wholesaler & Retailer of all kinds of electric and electronic goods.
                </>
              )}
            </p>

            <div className="space-y-1.5 pt-1 text-neutral-300 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#f85606] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  192/193 Super Market, Bhaban No-2 (1st Floor), Kawran Bazar, Tejgaon, Dhaka-1215.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isBn ? 'মোবাইল:' : 'Mobile:'}{' '}
                  <strong className="font-mono text-white">{storeSettings.hotline}</strong>,{' '}
                  <strong className="font-mono text-white">{storeSettings.alternatePhone}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>
                  {isBn ? 'ল্যান্ডফোন:' : 'Telephone:'}{' '}
                  <strong className="font-mono text-white">02-55014242</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-mono">mdbablu5183@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {isBn ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#visiting-card"
                  onClick={() => sound.playClick()}
                  className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-orange-400"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{isBn ? 'দোকানের কার্ড ও কাওরান বাজার লোকেশন' : 'Shop Card & Kawran Bazar Outlet'}</span>
                </a>
              </li>
              <li>
                <a href="#flash-sale" onClick={() => sound.playClick()} className="hover:text-white transition-colors">
                  ⚡ {isBn ? 'ফ্ল্যাশ সেল অফার' : 'Flash Sale Deals'}
                </a>
              </li>
              <li>
                <a href="#wholesale-section" onClick={() => sound.playClick()} className="hover:text-white transition-colors">
                  📦 {isBn ? 'পাইকারি মার্কেট রেট' : 'Wholesale Bulk Rates'}
                </a>
              </li>
              <li>
                <a href="#catalog" onClick={() => sound.playClick()} className="hover:text-white transition-colors">
                  🛍️ {isBn ? 'সকল প্রোডাক্ট ক্যাটালগ' : 'All Products Catalog'}
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModal('track_order');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  🚚 {isBn ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {isBn ? 'কাস্টমার সাপোর্ট' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModal('support');
                  }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 font-bold text-blue-400 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{isBn ? '২৪/৭ লাইভ সাপোর্ট হেল্পডেস্ক' : '24/7 Support Help Desk'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModal('policy_faq');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isBn ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions (FAQ)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModal('policy_shipping');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isBn ? 'ডেলিভারি ও শিপিং পলিসি' : 'Delivery & Shipping Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModal('policy_return');
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isBn ? '৭ দিনের রিপ্লেসমেন্ট ও রিটার্ন' : '7 Days Return & Warranty'}
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {isBn ? 'পেমেন্ট ও ডেলিভারি' : 'Payment & Delivery'}
            </h4>
            <p className="text-neutral-400 text-xs">
              {isBn
                ? 'সারা দেশে ক্যাশ অন ডেলিভারি এবং বিকাশ/নগদে সহজ পেমেন্ট সুবিধা।'
                : 'Cash on Delivery (COD) across all 64 districts with bKash / Nagad options.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
              <span className="bg-neutral-800 text-neutral-200 px-2.5 py-1 rounded border border-neutral-700">
                💵 Cash on Delivery
              </span>
              <span className="bg-neutral-800 text-pink-400 px-2.5 py-1 rounded border border-neutral-700">
                bKash
              </span>
              <span className="bg-neutral-800 text-amber-400 px-2.5 py-1 rounded border border-neutral-700">
                Nagad
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">
                {isBn
                  ? 'কাওরান বাজার ইলেকট্রিক সুপার মার্কেট সমিতি সদস্য'
                  : 'Kawran Bazar Electric Super Market Member'}
              </span>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} BABLU ELECTRIC. All rights reserved.</p>
          <p>Wholesale & Retail Showroom | Kawran Bazar, Tejgaon, Dhaka-1215</p>
        </div>
      </div>
    </footer>
  );
};
