import React from 'react';
import { Phone, MessageCircle, Store, Headphones, Volume2, VolumeX } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const FloatingActions: React.FC = () => {
  const { language, storeSettings, setActiveModal, showToast } = useShop();
  const [soundEnabled, setSoundEnabled] = React.useState(sound.getSoundEnabled());

  const isBn = language === 'bn';

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
    showToast(
      next
        ? (isBn ? 'সাউন্ড চালু 🔊' : 'Sound enabled 🔊')
        : (isBn ? 'সাউন্ড বন্ধ 🔇' : 'Sound muted 🔇'),
      'info'
    );
  };

  const whatsappMessage = isBn
    ? 'আসসালামু আলাইকুম বাবলু ইলেকট্রিক! আমি কাওরান বাজার দোকান থেকে অর্ডার করতে চাই।'
    : 'Hello Bablu Electric! I would like to place an order from your Kawran Bazar shop.';

  return (
    <aside aria-label="Quick contact and store tools" className="fixed bottom-5 left-4 z-40 flex flex-col gap-2.5">
      {/* WhatsApp Order with Bablu Electric Verified Number */}
      <a
        href={`https://wa.me/8801814006168?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.playClick()}
        className="group flex items-center gap-2 p-3 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 border-2 border-white"
        title={isBn ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন (০১৮১৪০০৬১৬৮)' : 'Order via WhatsApp (01814006168)'}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-black whitespace-nowrap">
          {isBn ? 'হোয়াটসঅ্যাপ অর্ডার' : 'WhatsApp'}
        </span>
      </a>

      {/* Direct Call to Mahmudul Hassan Bablu (01814006168) */}
      <a
        href="tel:01814006168"
        onClick={() => sound.playClick()}
        className="group flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 bg-[#f85606] hover:bg-[#d84803] text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 border border-orange-300"
        title={isBn ? 'সরাসরি কল দিন (০১৮১৪০০৬১৬৮)' : 'Call Store: 01814006168'}
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-mono font-bold whitespace-nowrap">
          01814006168
        </span>
      </a>

      {/* Store Visiting Card & Outlet Button */}
      <a
        href="#visiting-card"
        onClick={() => sound.playClick()}
        className="group flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 border border-neutral-700"
        title={isBn ? 'দোকানের কার্ড ও কাওরান বাজার লোকেশন' : 'Shop Card & Kawran Bazar Location'}
      >
        <Store className="w-4 h-4 text-amber-300" />
        <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
          {isBn ? 'দোকানের কার্ড' : 'Shop Card'}
        </span>
      </a>

      {/* 24/7 Support Modal Shortcut */}
      <button
        onClick={() => {
          sound.playClick();
          setActiveModal('support');
        }}
        className="group flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title={isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : 'Support Help Desk'}
      >
        <Headphones className="w-4 h-4 text-white" />
        <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
          {isBn ? 'সাপোর্ট' : 'Support'}
        </span>
      </button>

      {/* Sound Toggle */}
      <button
        onClick={handleToggleSound}
        className="group flex items-center justify-center p-2.5 bg-white hover:bg-neutral-100 text-neutral-800 rounded-full shadow-md transition-all hover:scale-105 border border-neutral-300 cursor-pointer w-10 h-10 self-start"
        title={soundEnabled ? (isBn ? 'সাউন্ড বন্ধ করুন' : 'Mute Sound') : (isBn ? 'সাউন্ড চালু করুন' : 'Enable Sound')}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-[#f85606]" />
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-400" />
        )}
      </button>
    </aside>
  );
};
