import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Store,
  Eye,
  X,
  Copy,
  Check,
  Navigation,
  Download,
  Headphones,
  Award,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const ShopVisitingCardSection: React.FC = () => {
  const { storeSettings, language, showToast } = useShop();
  const [showFullCard, setShowFullCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const isBn = language === 'bn';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '192/193 Super Market, Bhaban No-2, Kawran Bazar, Tejgaon, Dhaka-1215'
  )}`;

  const copyToClipboard = (text: string, label: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    showToast(isBn ? `${label} ক্লিপবোর্ডে কপি করা হয়েছে!` : `${label} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <section id="visiting-card" className="bg-[#f5f5f5] py-8 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Daraz-Style Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f85606] to-[#ff7300] text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#f85606] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isBn ? 'দারাজ মল ভেরিফাইড শপ' : 'Daraz Mall Verified Wholesaler'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isBn ? '১০০% আসল পণ্য গ্যারান্টি' : '100% Genuine Guarantee'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-0.5">
                {isBn
                  ? 'দোকানের কার্ড, কাওরান বাজার লোকেশন ও সরাসরি সাপোর্ট'
                  : 'Shop Visiting Card, Kawran Bazar Location & Direct Support'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#catalog"
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors"
            >
              {isBn ? 'পণ্যসমূহ দেখুন' : 'Explore Products'}
            </a>
            <a
              href={`tel:${storeSettings.hotline}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#f85606] hover:bg-[#e04a00] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isBn ? 'সরাসরি কল' : 'Call Store'}</span>
            </a>
          </div>
        </div>

        {/* Content Grid: Visiting Card Visual (Left) + Detailed Info & Location (Right) */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visiting Card Preview & Photo */}
          <div className="lg:col-span-5 p-5 sm:p-7 bg-neutral-50/80 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-neutral-200">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#f85606]" />
                  {isBn ? 'আসল ভিজিটিং কার্ড' : 'Official Business Card'}
                </span>
                <span className="text-[11px] text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  {isBn ? 'কাওরান বাজার, ঢাকা' : 'Kawran Bazar, Dhaka'}
                </span>
              </div>

              {/* Card Image Container with Hover Zoom */}
              <div
                onClick={() => {
                  sound.playClick();
                  setShowFullCard(true);
                }}
                className="relative group rounded-xl overflow-hidden shadow-md border-2 border-white hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer bg-white"
              >
                <img
                  src="/assets/aistudio/IMG_20261021_172504_fe6990d1.jpg"
                  alt="Bablu Electric Visiting Card - Mahmudul Hassan Bablu"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                />
                
                {/* Overlay Prompt */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-bold">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-full mb-1">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span>{isBn ? 'বড় করে সম্পূর্ণ কার্ড দেখুন' : 'Click to View Full Card'}</span>
                  <span className="text-[10px] text-orange-200">
                    {isBn ? 'জুম ও ডাউনলোড সুবিধা' : 'Zoom & Download Feature'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowFullCard(true);
                  }}
                  className="flex-1 py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200 text-center font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#f85606]" />
                  <span>{isBn ? 'কার্ড প্রিভিউ' : 'Card Preview'}</span>
                </button>
                <a
                  href="/assets/aistudio/IMG_20261021_172504_fe6990d1.jpg"
                  download="Bablu_Electric_Visiting_Card.jpg"
                  className="flex-1 py-2 px-3 bg-orange-50 hover:bg-orange-100 text-[#f85606] rounded-lg border border-orange-200 text-center font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কার্ড সংরক্ষণ' : 'Save Card'}</span>
                </a>
              </div>
            </div>

            {/* Quick Trust Highlights below the card */}
            <div className="w-full mt-4 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'সরাসরি পাইকারি মূল্য' : 'Wholesale Direct Prices'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'হাতে পেয়ে টাকা পরিশোধ' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Nationwide Fast Courier'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'কাওরান বাজার ফিজিক্যাল শপ' : 'Kawran Bazar Outlet'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Store Details, Location Guide & Direct Support Channels */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Store Title & Proprietor Header */}
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Wholesale & Retail Showroom
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#f85606] tracking-tight">
                      BABLU ELECTRIC
                    </h3>
                    <p className="text-sm font-bold text-neutral-800">
                      {isBn
                        ? 'বাবলু ইলেকট্রিক — সকল প্রকার ইলেকট্রিক ও ইলেকট্রনিক্স পাইকারি'
                        : 'Bablu Electric — Wholesale & Retailer of All Kinds of Electric Goods'}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl text-right">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                      {isBn ? 'স্বত্বাধিকারী / Proprietor' : 'Proprietor'}
                    </span>
                    <span className="text-sm font-black text-neutral-900 block">
                      {isBn ? 'মাহমুদুল হাসান বাবলু' : 'Mahmudul Hassan Bablu'}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-600">
                      (Bablu Electric)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {isBn
                    ? 'কাওরান বাজার ইলেকট্রিক মার্কেটের স্বনামধন্য পাইকারি প্রতিষ্ঠান। ফ্যান, লাইট, সুইচ, তার, ট্রিমার, ব্লেন্ডার, গ্যাজেট ও ইলেকট্রনিক্স মালামাল সুলভ মূল্যে সরবরাহ করা হয়।'
                    : 'Renowned electrical & electronic goods wholesale showroom at Kawran Bazar Super Market, Dhaka. Specializing in trimmers, smart gadgets, kitchen choppers, wiring, switches, and LED lighting.'}
                </p>
              </div>

              {/* Exact Location & Landmark Guide */}
              <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200/80 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-[#f85606] text-white rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-900">
                        {isBn ? 'দোকানের ঠিকানা ও শোরুম লোকেশন' : 'Physical Store Address & Showroom Location'}
                      </span>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#f85606] hover:underline flex items-center gap-1"
                      >
                        <span>{isBn ? 'গুগল ম্যাপ' : 'Google Maps'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    
                    <p className="text-xs sm:text-sm font-bold text-neutral-800 mt-1 leading-snug">
                      192/193 Super Market, Bhaban No-2 (1st Floor), Kawran Bazar, Tejgaon, Dhaka-1215.
                    </p>
                    {isBn && (
                      <p className="text-xs text-neutral-600 mt-0.5">
                        ১৯২/১৯৩ সুপার মার্কেট, ভবন নং-২ (১ম ফ্লোর), কাওরান বাজার, তেজগাঁও, ঢাকা-১২১৫।
                      </p>
                    )}

                    <div className="mt-2 pt-2 border-t border-orange-200/60 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-[#f85606]" />
                        <span>
                          {isBn
                            ? 'ল্যান্ডমার্ক: কাওরান বাজার সুপার মার্কেট ২য় ভবন'
                            : 'Landmark: Kawran Bazar Super Market Building No-2, 1st Floor'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>
                          {isBn
                            ? 'খোলা: শনি-বৃহস্পতি সকাল ৯টা - রাত ৯টা'
                            : 'Open: Sat–Thu 9:00 AM – 9:00 PM'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Support & Phone Numbers Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-[#f85606]" />
                  <span>
                    {isBn
                      ? 'সরাসরি যোগাযোগ ও কাস্টমার সাপোর্ট (ফোন / হোয়াটসঅ্যাপ):'
                      : 'Direct Hotlines & Customer Support (Call / WhatsApp):'}
                  </span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Phone 1 */}
                  <div className="p-3 bg-white hover:bg-orange-50/50 border border-neutral-200 hover:border-orange-300 rounded-xl transition-all relative group">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                      Mobile 1 (Hotline)
                    </span>
                    <a
                      href="tel:01814006168"
                      className="font-mono font-black text-neutral-900 group-hover:text-[#f85606] text-sm block mt-0.5"
                    >
                      01814006168
                    </a>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href="tel:01814006168"
                        className="text-[10px] font-bold text-[#f85606] hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {isBn ? 'কল করুন' : 'Call'}
                      </a>
                      <button
                        onClick={() => copyToClipboard('01814006168', 'Mobile 1')}
                        className="text-[10px] text-neutral-500 hover:text-neutral-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedPhone === '01814006168' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {isBn ? 'কপি' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Phone 2 */}
                  <div className="p-3 bg-white hover:bg-orange-50/50 border border-neutral-200 hover:border-orange-300 rounded-xl transition-all relative group">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                      Mobile 2 (WhatsApp)
                    </span>
                    <a
                      href="tel:01770515183"
                      className="font-mono font-black text-neutral-900 group-hover:text-[#f85606] text-sm block mt-0.5"
                    >
                      01770515183
                    </a>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`https://wa.me/8801770515183?text=${encodeURIComponent(
                          isBn
                            ? 'আসসালামু আলাইকুম বাবলু ইলেকট্রিক! আমি পাইকারি পণ্য সম্পর্কে জানতে চাই।'
                            : 'Hello Bablu Electric! I would like to inquire about wholesale products.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        💬 WhatsApp
                      </a>
                      <button
                        onClick={() => copyToClipboard('01770515183', 'Mobile 2')}
                        className="text-[10px] text-neutral-500 hover:text-neutral-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedPhone === '01770515183' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {isBn ? 'কপি' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Telephone & Email */}
                  <div className="p-3 bg-white hover:bg-orange-50/50 border border-neutral-200 hover:border-orange-300 rounded-xl transition-all">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                      Telephone (Landline)
                    </span>
                    <span className="font-mono font-black text-neutral-900 text-sm block mt-0.5">
                      02-55014242
                    </span>
                    <div className="mt-2 text-[10px] text-neutral-600 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">mdbablu5183@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Call, WhatsApp, Google Maps Directions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:01814006168"
                onClick={() => sound.playClick()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f85606] hover:bg-[#d84803] text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/25 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>{isBn ? 'সরাসরি কল দিন: 01814006168' : 'Direct Call: 01814006168'}</span>
              </a>

              <a
                href={`https://wa.me/8801814006168?text=${encodeURIComponent(
                  isBn
                    ? 'আসসালামু আলাইকুম বাবলু ইলেকট্রিক! আমি কাওরান বাজার দোকান থেকে পণ্য কিনতে চাই।'
                    : 'Hello Bablu Electric! I want to order products from your Kawran Bazar showroom.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/25 transition-all active:scale-95"
              >
                <span>{isBn ? '💬 হোয়াটসঅ্যাপে মেসেজ দিন' : '💬 Chat on WhatsApp'}</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#f85606]" />
                <span>{isBn ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Full Resolution Visiting Card Lightbox Modal */}
      {showFullCard && (
        <div
          onClick={() => setShowFullCard(false)}
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-5 border border-neutral-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-black text-base text-neutral-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#f85606]" />
                  <span>BABLU ELECTRIC — Official Visiting Card</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  Mahmudul Hassan Bablu (Proprietor) | Kawran Bazar, Dhaka
                </p>
              </div>
              <button
                onClick={() => setShowFullCard(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-inner bg-neutral-100">
              <img
                src="/assets/aistudio/IMG_20261021_172504_fe6990d1.jpg"
                alt="Bablu Electric Visiting Card"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-neutral-700">
                <span className="font-bold text-neutral-900 block">192/193 Super Market, Bhaban No-2 (1st Floor)</span>
                <span>Kawran Bazar, Tejgaon, Dhaka-1215</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/assets/aistudio/IMG_20261021_172504_fe6990d1.jpg"
                  download="Bablu_Electric_Card.jpg"
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isBn ? 'ডাউনলোড' : 'Download'}
                </a>
                <a
                  href="tel:01814006168"
                  className="px-4 py-1.5 bg-[#f85606] hover:bg-[#d84803] text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call: 01814006168
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
