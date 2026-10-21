import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  AlertCircle,
  MapPin,
  User,
  Phone,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BANGLADESH_DIVISIONS } from '../data/mockDatabase';
import { PaymentMethod } from '../types';
import { BkashPaymentModal } from './BkashPaymentModal';
import { sound } from '../services/sound';

export const CheckoutModal: React.FC = () => {
  const {
    t,
    language,
    cart,
    cartItemCount,
    cartSubtotal,
    cartWholesaleSavings,
    cartCouponDiscount,
    cartDeliveryFee,
    cartGrandTotal,
    selectedDeliveryZone,
    deliveryZones,
    setSelectedDeliveryZone,
    currentUser,
    createOrder,
    activeModal,
    setActiveModal,
  } = useShop();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [thanaArea, setThanaArea] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [formError, setFormError] = useState<string | null>(null);

  // Gateway modal trigger
  const [activeGatewayModal, setActiveGatewayModal] = useState<'bkash' | 'nagad' | 'sslcommerz' | null>(null);

  if (activeModal !== 'checkout') return null;

  const districtsList = BANGLADESH_DIVISIONS[division] || [];

  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const availableDistricts = BANGLADESH_DIVISIONS[newDivision] || [];
    setDistrict(availableDistricts[0] || '');

    // Auto-select zone if Dhaka vs Outside Dhaka
    if (newDivision === 'Dhaka') {
      const zoneDhaka = deliveryZones.find((z) => z.id === 'zone-dhaka');
      if (zoneDhaka) setSelectedDeliveryZone(zoneDhaka);
    } else {
      const zoneOutside = deliveryZones.find((z) => z.id === 'zone-outside-dhaka');
      if (zoneOutside) setSelectedDeliveryZone(zoneOutside);
    }
  };

  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your cart is empty. Please add products first.');
      return;
    }

    if (!fullName.trim()) {
      setFormError('Please enter your full recipient name.');
      return;
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      setFormError('Please provide a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    if (!thanaArea.trim() || !streetAddress.trim()) {
      setFormError('Please specify your Thana/Upazila and full street address.');
      return;
    }

    // If online payment selected, open gateway modal
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'sslcommerz') {
      setActiveGatewayModal(paymentMethod);
      return;
    }

    // Direct Cash on Delivery
    executeFinalOrder(undefined);
  };

  const executeFinalOrder = (transactionId?: string) => {
    createOrder({
      customerName: fullName.trim(),
      customerEmail: currentUser?.email,
      customerPhone: phoneNumber.trim(),
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phoneNumber.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        division,
        district,
        thanaArea: thanaArea.trim(),
        streetAddress: streetAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
      },
      paymentMethod,
      transactionId,
    });
    sound.playOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Secure Checkout & Order Placement
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              {t.checkout}
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInitiateOrder} className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Delivery & Payment Details */}
          <div className="md:col-span-7 p-6 space-y-6">
            
            {/* Delivery Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{t.deliveryInformation}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Chowdhury"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 font-mono focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Division */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.division} *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-hidden"
                  >
                    {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.district} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-hidden"
                  >
                    {districtsList.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Thana/Upazila */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.thana} *
                  </label>
                  <input
                    type="text"
                    required
                    value={thanaArea}
                    onChange={(e) => setThanaArea(e.target.value)}
                    placeholder="e.g. Dhanmondi / Mirpur"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Full Street Address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {t.streetAddress} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House number, Road, Sector / Area details..."
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              {/* Alternate phone and notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {t.alternatePhone}
                  </label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="Optional backup number"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {t.deliveryNotes}
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with security or call first"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{t.paymentMethod}</span>
              </div>

              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-neutral-900">{t.codName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {t.codDescription}
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-[9px]">
                        b
                      </span>
                      <span className="text-xs font-bold text-neutral-900">{t.bkashName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {t.bkashDescription}
                    </p>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7931E] bg-amber-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="nagad"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#F7931E] text-white flex items-center justify-center font-bold text-[9px]">
                        N
                      </span>
                      <span className="text-xs font-bold text-neutral-900">{t.nagadName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {t.nagadDescription}
                    </p>
                  </div>
                </label>

                {/* SSLCOMMERZ */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'border-[#0F568C] bg-sky-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={paymentMethod === 'sslcommerz'}
                    onChange={() => setPaymentMethod('sslcommerz')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0F568C]" />
                      <span className="text-xs font-bold text-neutral-900">{t.sslcommerzName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {t.sslcommerzDescription}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Review & Final Submit */}
          <div className="md:col-span-5 p-6 bg-neutral-50 border-t md:border-t-0 md:border-l border-neutral-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">
                {t.orderSummary} ({cartItemCount} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-neutral-900 tabular-nums shrink-0">
                      ৳{item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Box */}
              <div className="pt-4 border-t border-neutral-200 space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono text-neutral-900 tabular-nums">
                    ৳{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {cartWholesaleSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>{t.wholesaleDiscount}</span>
                    <span className="font-mono tabular-nums">
                      -৳{cartWholesaleSavings.toLocaleString()}
                    </span>
                  </div>
                )}

                {cartCouponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>{t.couponDiscount}</span>
                    <span className="font-mono tabular-nums">
                      -৳{cartCouponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.deliveryFee} ({selectedDeliveryZone.name})</span>
                  <span className="font-mono text-neutral-900 tabular-nums">
                    {cartDeliveryFee === 0 ? 'FREE' : `৳${cartDeliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>{t.total}</span>
                  <span className="font-mono text-base tabular-nums">
                    ৳{cartGrandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button & Policies note */}
            <div className="pt-6 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.placeOrder}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-neutral-500 text-center leading-normal">
                {t.agreeTerms}
              </p>
            </div>

          </div>
        </form>

      </div>

      {/* bKash/Nagad/SSLCOMMERZ Gateway Modal */}
      {activeGatewayModal && (
        <BkashPaymentModal
          method={activeGatewayModal}
          amount={cartGrandTotal}
          onSuccess={(trxId) => {
            setActiveGatewayModal(null);
            executeFinalOrder(trxId);
          }}
          onClose={() => setActiveGatewayModal(null)}
        />
      )}
    </div>
  );
};
