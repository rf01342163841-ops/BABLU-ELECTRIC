import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
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
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryZones,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    activeModal,
    setActiveModal,
    storeSettings,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (activeModal !== 'cart') return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const amountNeededForFreeDelivery = Math.max(
    0,
    storeSettings.freeDeliveryThreshold - cartSubtotal
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">
              {t.shoppingCart} ({cartItemCount})
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-700">
          {amountNeededForFreeDelivery > 0 ? (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>
                  Add <strong className="font-mono text-neutral-900">৳{amountNeededForFreeDelivery.toLocaleString()}</strong> more for Free Delivery!
                </span>
                <span className="font-semibold text-emerald-700">
                  {Math.round(((storeSettings.freeDeliveryThreshold - amountNeededForFreeDelivery) / storeSettings.freeDeliveryThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((storeSettings.freeDeliveryThreshold - amountNeededForFreeDelivery) / storeSettings.freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You unlocked FREE nationwide delivery!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-neutral-700">{t.cartEmpty}</p>
              <p className="text-xs text-neutral-500 max-w-xs">
                Explore our curated gadget collection, fashion essentials, and wholesale bundles.
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-neutral-50/80 rounded-xl border border-neutral-200 relative group"
              >
                {/* Thumbnail */}
                <div className="w-18 h-18 rounded-lg overflow-hidden bg-white border border-neutral-200 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variantName && (
                      <span className="text-[11px] text-neutral-500 block">
                        Variant: {item.variantName}
                      </span>
                    )}

                    {item.wholesaleDiscountApplied && item.wholesaleDiscountApplied > 0 && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Wholesale savings: -৳{item.wholesaleDiscountApplied.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-neutral-900 font-mono tabular-nums block">
                        ৳{item.totalPrice.toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ৳{item.unitPrice}/pc
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area: Coupons, Delivery Zone, Totals & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/50 space-y-4">
            
            {/* Delivery Zone Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-500" />
                <span>{t.selectDeliveryZone}:</span>
              </label>
              <select
                value={selectedDeliveryZone.id}
                onChange={(e) => {
                  const zone = deliveryZones.find((z) => z.id === e.target.value);
                  if (zone) setSelectedDeliveryZone(zone);
                }}
                className="w-full text-xs p-2 rounded-lg bg-white border border-neutral-200 focus:outline-hidden focus:border-neutral-400"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {language === 'bn' ? z.nameBn : z.name} (৳{z.charge})
                  </option>
                ))}
              </select>
            </div>

            {/* Promo Code Form */}
            <div className="space-y-1">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                      <span className="text-emerald-600 text-[11px] ml-1">
                        (-৳{cartCouponDiscount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-white border border-neutral-200 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    {t.applyCoupon}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200 pt-3">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono text-neutral-900 font-medium tabular-nums">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartWholesaleSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.wholesaleDiscount}</span>
                  <span className="font-mono font-medium tabular-nums">
                    -৳{cartWholesaleSavings.toLocaleString()}
                  </span>
                </div>
              )}

              {cartCouponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.couponDiscount}</span>
                  <span className="font-mono font-medium tabular-nums">
                    -৳{cartCouponDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.deliveryFee}</span>
                <span className="font-mono text-neutral-900 font-medium tabular-nums">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    `৳${cartDeliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>{t.total}</span>
                <span className="font-mono text-base tabular-nums">
                  ৳{cartGrandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => setActiveModal('checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
