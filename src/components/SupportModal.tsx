import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const SupportModal: React.FC = () => {
  const { activeModal, setActiveModal, storeSettings, language, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'chat'>('contact');
  const [chatMessage, setChatMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(sound.getSoundEnabled());

  const isBn = language === 'bn';

  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: isBn
        ? 'আসসালামু আলাইকুম! বাবলু ইলেকট্রিক কাস্টমার সার্ভিসে স্বাগতম। আমরা কীভাবে আপনাকে সাহায্য করতে পারি?'
        : 'Welcome to Bablu Electric Customer Care & Help Desk! How can we assist you today?',
      time: 'Just now',
    },
  ]);

  if (activeModal !== 'support') return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    sound.playClick();
    const userText = chatMessage.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Just now' };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      sound.playAddToCart();
      let reply = isBn
        ? 'ধন্যবাদ! আপনার বার্তার জন্য। জরুরি প্রয়োজনে আমাদের হটলাইন ০১৮১৪০০৬১৬৮ অথবা ০১৭৭০৫১৫১৮৩ নম্বরে সরাসরি কল দিন।'
        : 'Thank you for your message! For immediate assistance, call our helpline at 01814006168 or 01770515183.';
      const lower = userText.toLowerCase();

      if (lower.includes('wholesale') || lower.includes('bulk') || lower.includes('পাইকারি') || lower.includes('দাম') || lower.includes('price')) {
        reply = isBn
          ? 'আমরা কাওরান বাজারে সরাসরি পাইকারি বিক্রি করি। ৫ পিস বা তার বেশি অর্ডারে বিশেষ পাইকারি ডিসকাউন্ট দেওয়া হয়। বাবলু ভাইয়ের সাথে কথা বলতে কল করুন ০১৮১৪০০৬১৬৮।'
          : 'We supply wholesale directly from our Kawran Bazar showroom. Orders of 5+ units receive special bulk pricing. Call proprietor Mahmudul Hassan Bablu directly at 01814006168.';
      } else if (lower.includes('address') || lower.includes('location') || lower.includes('shop') || lower.includes('ঠিকানা') || lower.includes('দোকান')) {
        reply = isBn
          ? 'আমাদের শো-রুমের ঠিকানা: ১৯২/১৯৩ সুপার মার্কেট, ভবন নং-২ (১ম ফ্লোর), কাওরান বাজার, তেজগাঁও, ঢাকা-১২১৫। সকাল ৯টা থেকে রাত ৯টা পর্যন্ত খোলা।'
          : 'Showroom Address: 192/193 Super Market, Bhaban No-2 (1st Floor), Kawran Bazar, Tejgaon, Dhaka-1215. Open Saturday–Thursday 9:00 AM – 9:00 PM.';
      } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('courier') || lower.includes('ডেলিভারি')) {
        reply = isBn
          ? 'ঢাকা সিটিতে ১-২ দিনে এবং ঢাকার বাইরে ৩-৪ দিনে সুন্দরবন/রেডেক্স কুরিয়ারে ক্যাশ অন ডেলিভারি দেওয়া হয়। পণ্য হাতে পেয়ে মূল্য পরিশোধ করতে পারবেন।'
          : 'Cash on delivery is available nationwide! Inside Dhaka delivery takes 1-2 days (৳70), and outside Dhaka 2-4 days (৳130). You pay after inspecting your product.';
      }

      setChatHistory((prev) => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
    }, 600);
  };

  const toggleSoundState = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
    showToast(next ? (isBn ? 'সাউন্ড চালু করা হয়েছে 🔊' : 'Sound enabled 🔊') : (isBn ? 'সাউন্ড বন্ধ করা হয়েছে 🔇' : 'Sound muted 🔇'), 'info');
  };

  const faqs = [
    {
      q: isBn ? 'বাবলু ইলেকট্রিকের আসল ঠিকানা কোথায়?' : 'Where is Bablu Electric showroom located?',
      a: isBn
        ? '১৯২/১৯৩ সুপার মার্কেট, ভবন নং-২ (১ম ফ্লোর), কাওরান বাজার, তেজগাঁও, ঢাকা-১২১৫।'
        : '192/193 Super Market, Bhaban No-2 (1st Floor), Kawran Bazar, Tejgaon, Dhaka-1215.',
    },
    {
      q: isBn ? 'সারা দেশে কি ক্যাশ অন ডেলিভারি পাওয়া যায়?' : 'Is Cash on Delivery (COD) available nationwide?',
      a: isBn
        ? 'হ্যাঁ, ৬৪টি জেলায় ক্যাশ অন ডেলিভারি সুবিধা আছে। পণ্য দেখে ডেলিভারিম্যানকে টাকা দিন।'
        : 'Yes, Cash on Delivery is available across all 64 districts of Bangladesh. You inspect the parcel before paying.',
    },
    {
      q: isBn ? 'পাইকারি অর্ডারের নিয়ম কী?' : 'What are the rules for wholesale bulk orders?',
      a: isBn
        ? 'যে কোনো পণ্যে ৫ পিস বা তার বেশি কার্টুনে অর্ডার করলে পাইকারি মূল্য প্রযোজ্য হবে।'
        : 'Any product order with 5+ units automatically qualifies for wholesale tiered discount pricing.',
    },
    {
      q: isBn ? 'কীভাবে সরাসরি প্রোপাইটারের সাথে কথা বলব?' : 'How do I speak directly with the proprietor?',
      a: isBn
        ? 'মাহমুদুল হাসান বাবলু (স্বত্বাধিকারী): ০১৭১৪০০৬১৬৮ অথবা ০১৭৭০৫১৫১৮৩ নম্বরে সরাসরি কল দিন।'
        : 'Call proprietor Mahmudul Hassan Bablu directly at 01814006168 or 01770515183.',
    },
  ];

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
      >
        {/* Header - Daraz Orange Style */}
        <div className="bg-gradient-to-r from-[#f85606] to-[#ff6600] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {isBn ? '২৪/৭ কাস্টমার সাপোর্ট ও হেল্প ডেস্ক' : 'Customer Support & Help Desk'}
              </h3>
              <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  {isBn
                    ? 'বাবলু ইলেকট্রিক — লাইভ সাপোর্ট প্রতিনিধি সক্রিয়'
                    : 'Bablu Electric — Live Support Active'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSoundState}
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-200" /> : <VolumeX className="w-4 h-4 opacity-70" />}
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('contact');
            }}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'border-[#f85606] text-[#f85606] font-black'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isBn ? 'হটলাইন ও লোকেশন' : 'Hotlines & Location'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('chat');
            }}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'border-[#f85606] text-[#f85606] font-black'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? 'লাইভ চ্যাট' : 'Live Chat'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('faq');
            }}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'faq'
                ? 'border-[#f85606] text-[#f85606] font-black'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isBn ? 'সাধারণ প্রশ্নোত্তর (FAQ)' : 'FAQ & Policies'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: CONTACT HOTLINES & PHYSICAL STORE */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-xs">
                <span className="font-bold text-[#f85606] block text-sm">
                  Bablu Electric (Wholesale & Retail)
                </span>
                <p className="text-neutral-700 mt-1 leading-snug">
                  Proprietor: <strong>Mahmudul Hassan Bablu</strong>
                  <br />
                  192/193 Super Market, Bhaban No-2 (1st Floor), Kawran Bazar, Tejgaon, Dhaka-1215.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href="tel:01814006168"
                  onClick={() => sound.playClick()}
                  className="p-3 bg-white hover:bg-orange-50/50 border border-neutral-200 hover:border-orange-300 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#f85606] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                      Primary Hotline
                    </span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">01814006168</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/8801770515183?text=${encodeURIComponent('Hello Bablu Electric!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-3 bg-white hover:bg-emerald-50/50 border border-neutral-200 hover:border-emerald-300 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <span className="text-base">💬</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                      WhatsApp & Mobile
                    </span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">01770515183</span>
                  </div>
                </a>

                <div className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                      Landline Telephone
                    </span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">02-55014242</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                      Physical Outlet
                    </span>
                    <span className="font-bold text-neutral-900 text-xs">Kawran Bazar, Dhaka</span>
                  </div>
                </div>
              </div>

              {/* Fast Visiting Card Lightbox trigger */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <span className="text-xs text-neutral-600">
                  {isBn ? 'দোকানের আসল ভিজিটিং কার্ড দেখতে চান?' : 'Need to verify our official visiting card?'}
                </span>
                <a
                  href="#visiting-card"
                  onClick={() => {
                    sound.playClick();
                    setActiveModal(null);
                  }}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#f85606] rounded-lg text-xs font-bold border border-orange-200 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কার্ড দেখুন' : 'View Card'}</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[320px]">
              <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-2xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#f85606] text-white rounded-tr-none'
                          : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          msg.sender === 'user' ? 'text-orange-200' : 'text-neutral-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={
                    isBn
                      ? 'আপনার প্রশ্ন বা অনুসন্ধান লিখুন...'
                      : 'Ask a question (e.g. wholesale, delivery, address)...'
                  }
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-[#f85606]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f85606] hover:bg-[#e04a00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isBn ? 'পাঠান' : 'Send'}</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="text-[#f85606]">Q{idx + 1}.</span>
                    <span>{f.q}</span>
                  </h4>
                  <p className="text-neutral-600 pl-5 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer with immediate call prompt */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span>{isBn ? 'সরাসরি সহায়তা: ০১৮১৪০০৬১৬৮' : 'Direct Helpline: 01814006168'}</span>
          <a
            href="tel:01814006168"
            onClick={() => sound.playClick()}
            className="px-3 py-1 bg-[#f85606] text-white font-bold rounded-lg hover:bg-[#d84803] transition-colors"
          >
            {isBn ? 'কল দিন' : 'Call Now'}
          </a>
        </div>
      </div>
    </div>
  );
};
