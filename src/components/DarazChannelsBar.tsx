import React from 'react';
import {
  ShieldCheck,
  Truck,
  Store,
  MapPin,
  Headphones,
  Tag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

export const DarazChannelsBar: React.FC = () => {
  const { language, setActiveModal, showToast } = useShop();
  const [soundOn, setSoundOn] = React.useState(sound.getSoundEnabled());

  const isBn = language === 'bn';

  const handleSoundToggle = () => {
    const next = sound.toggleSound();
    setSoundOn(next);
    showToast(
      next
        ? (isBn ? 'সাউন্ড চালু করা হয়েছে 🔊' : 'Sound enabled 🔊')
        : (isBn ? 'সাউন্ড বন্ধ করা হয়েছে 🔇' : 'Sound muted 🔇'),
      'info'
    );
  };

  const channels = [
    {
      id: 'visiting_card',
      icon: Store,
      bg: 'bg-orange-500 text-white',
      border: 'border-orange-400',
      title: isBn ? 'দোকানের কার্ড' : 'Shop Card',
      desc: isBn ? 'বাবলু ইলেকট্রিক আসল কার্ড' : 'Verified Business Card',
      action: () => {
        sound.playClick();
        const el = document.getElementById('visiting-card');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'outlet_location',
      icon: MapPin,
      bg: 'bg-emerald-600 text-white',
      border: 'border-emerald-500',
      title: isBn ? 'দোকানের লোকেশন' : 'Store Location',
      desc: isBn ? 'কাওরান বাজার সুপার মার্কেট' : 'Kawran Bazar Outlet',
      action: () => {
        sound.playClick();
        const el = document.getElementById('visiting-card');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'support_hotline',
      icon: Headphones,
      bg: 'bg-blue-600 text-white',
      border: 'border-blue-500',
      title: isBn ? 'কাস্টমার সাপোর্ট' : 'Support 24/7',
      desc: isBn ? '০১৮১৪০০৬১৬৮ কল দিন' : 'Helpline 01814006168',
      action: () => {
        sound.playClick();
        setActiveModal('support');
      },
    },
    {
      id: 'mall',
      icon: ShieldCheck,
      bg: 'bg-red-600 text-white',
      border: 'border-red-500',
      title: isBn ? 'দারাজ মল' : 'Bablu Mall',
      desc: isBn ? '১০০% অরিজিনাল পণ্য' : '100% Authentic Goods',
      action: () => {
        sound.playClick();
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'free_delivery',
      icon: Truck,
      bg: 'bg-amber-500 text-white',
      border: 'border-amber-400',
      title: isBn ? 'ফ্রি ডেলিভারি' : 'Free Shipping',
      desc: isBn ? '৳২,৫০০+ অর্ডারে ফ্রি' : 'On orders ৳2,500+',
      action: () => {
        sound.playClick();
        showToast(
          isBn
            ? '৳২,৫০০ বা তার বেশি মূল্যের অর্ডারে সারা দেশে ফ্রি ডেলিভারি!'
            : 'Free nationwide delivery on orders over ৳2,500!',
          'info'
        );
      },
    },
    {
      id: 'wholesale',
      icon: Tag,
      bg: 'bg-purple-600 text-white',
      border: 'border-purple-500',
      title: isBn ? 'পাইকারি বাজার' : 'Wholesale Deals',
      desc: isBn ? '৫+ পিসে স্পেশাল ছাড়' : 'Tiered Bulk Rates',
      action: () => {
        sound.playClick();
        const el = document.getElementById('wholesale-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="bg-[#f5f5f5] py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-neutral-200/90 shadow-2xs">
          
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-100 text-xs">
            <span className="font-bold text-neutral-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f85606]"></span>
              {isBn ? 'দারাজ কুইক চ্যানেল ও সার্ভিস' : 'Daraz Quick Services & Channels'}
            </span>

            {/* Sound toggle button */}
            <button
              onClick={handleSoundToggle}
              className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-[#f85606] transition-colors cursor-pointer bg-neutral-100 hover:bg-orange-50 px-2 py-1 rounded-lg"
            >
              {soundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#f85606]" />
                  <span>{isBn ? 'সাউন্ড চালু' : 'Sound On'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isBn ? 'সাউন্ড মিউট' : 'Sound Off'}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {channels.map((ch) => {
              const IconComp = ch.icon;
              return (
                <button
                  key={ch.id}
                  onClick={ch.action}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 transition-all text-left cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${ch.bg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-neutral-900 text-xs block truncate group-hover:text-[#f85606] transition-colors">
                      {ch.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate font-medium">
                      {ch.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
