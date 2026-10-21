import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  User,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateCartItemPrice } from '../services/storage';
import { sound } from '../services/sound';

export const QuickOrderModal: React.FC = () => {
  const {
    language,
    selectedProduct,
    activeModal,
    setActiveModal,
    createDirectOrder,
    currentUser,
    showToast,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'dhaka' | 'outside'>('dhaka');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedVariantId(selectedProduct.variants[0].id);
      } else {
        setSelectedVariantId(undefined);
      }
      setQuantity(1);
      setError(null);
    }
  }, [selectedProduct]);

  if (activeModal !== 'quick_order' || !selectedProduct) return null;

  const selectedVariant = selectedProduct.variants?.find((v) => v.id === selectedVariantId);
  const deliveryFee = deliveryZone === 'dhaka' ? 70 : 130;
  const pricing = calculateCartItemPrice(
    selectedProduct,
    quantity,
    selectedVariant?.priceDelta || 0
  );
  const totalPayable = pricing.totalAfterWholesale + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();

    if (!name) {
      setError(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }

    if (!phone || phone.length < 11) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number.'
      );
      return;
    }

    if (!address || address.length < 5) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/থানা/জেলা)।'
          : 'Please enter your full delivery address.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      createDirectOrder({
        product: selectedProduct,
        quantity,
        variantName: selectedVariant?.name,
        customerName: name,
        customerPhone: phone,
        shippingAddress: {
          fullName: name,
          phone,
          division: deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
          district: deliveryZone === 'dhaka' ? 'Dhaka City' : 'District Area',
          thanaArea: deliveryZone === 'dhaka' ? 'Dhaka' : 'Courier Thana',
          streetAddress: address,
          deliveryNotes: '1-Click Cash on Delivery Order',
        },
        deliveryFee,
        deliveryZoneName: deliveryZone === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে',
      });
      sound.playOrderSuccess();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-6">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-current text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                {language === 'bn' ? 'সরাসরি দ্রুত অর্ডার ফর্ম' : 'Quick 1-Click Order Form'}
              </h2>
              <p className="text-xs text-emerald-100">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি — পণ্য দেখে টাকা দিন' : 'Cash on Delivery — Inspect upon receipt'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Quick Snapshot Card */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex gap-3 items-center">
          <img
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            className="w-16 h-16 rounded-xl object-cover border border-neutral-200 bg-white shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">
              {language === 'bn' ? selectedProduct.nameBn : selectedProduct.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-extrabold text-neutral-900 font-mono tabular-nums">
                ৳{pricing.unitPrice.toLocaleString()}
              </span>
              {selectedProduct.regularPrice > pricing.unitPrice && (
                <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                  ৳{selectedProduct.regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] font-semibold text-neutral-600">
                {language === 'bn' ? 'পরিমাণ:' : 'Qty:'}
              </span>
              <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-neutral-100 text-neutral-600"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2.5 text-xs font-mono font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= selectedProduct.stock}
                  className="p-1 hover:bg-neutral-100 text-neutral-600 disabled:opacity-40"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="text-[11px] p-1 border border-neutral-300 rounded bg-white text-neutral-800"
                >
                  {selectedProduct.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-5 space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>{language === 'bn' ? 'আপনার সম্পূর্ণ নাম *' : 'Full Name *'}</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: মোঃ রহিম উল্লাহ' : 'e.g. Rahim Ullah'}
              className="w-full p-2.5 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর *' : 'Mobile Phone Number *'}</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-neutral-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা *' : 'Full Delivery Address *'}</span>
            </label>
            <textarea
              required
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'বাসা নং, রোড নং, এলাকা, থানা ও জেলার নাম লিখুন...'
                  : 'House, Road, Area, Thana and District details...'
              }
              className="w-full p-2.5 text-xs rounded-lg border border-neutral-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Delivery Area Selection */}
          <div>
            <span className="block font-bold text-neutral-800 mb-1.5">
              {language === 'bn' ? 'ডেলিভারি এরিয়া নির্বাচন করুন:' : 'Select Delivery Area:'}
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <label
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryZone === 'dhaka'
                    ? 'border-emerald-600 bg-emerald-50/60 font-bold'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="zone"
                    checked={deliveryZone === 'dhaka'}
                    onChange={() => setDeliveryZone('dhaka')}
                    className="text-emerald-600"
                  />
                  <span>{language === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</span>
                </div>
                <span className="font-mono text-emerald-800">৳৭০</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryZone === 'outside'
                    ? 'border-emerald-600 bg-emerald-50/60 font-bold'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="zone"
                    checked={deliveryZone === 'outside'}
                    onChange={() => setDeliveryZone('outside')}
                    className="text-emerald-600"
                  />
                  <span>{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</span>
                </div>
                <span className="font-mono text-emerald-800">৳১৩০</span>
              </label>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>{language === 'bn' ? 'পণ্যের মোট মূল্য:' : 'Product Subtotal:'}</span>
              <span className="font-mono font-medium tabular-nums">
                ৳{pricing.totalAfterWholesale.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
              <span className="font-mono font-medium tabular-nums">
                ৳{deliveryFee}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
              <span>{language === 'bn' ? 'সর্বমোট প্রদেয় টাকা:' : 'Total Payable:'}</span>
              <span className="font-mono text-base text-emerald-700 tabular-nums">
                ৳{totalPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {language === 'bn'
                ? 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)'
                : 'Confirm Order (Cash on Delivery)'}
            </span>
          </button>

          {/* Trust Guarantees */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-neutral-500 text-center">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>কোনো অগ্রিম টাকা দিতে হবে না</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>পণ্য চেক করে মূল্য পরিশোধ করুন</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
