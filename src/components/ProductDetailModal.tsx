import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  Share2,
  Heart,
  Package,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateCartItemPrice } from '../services/storage';
import { sound } from '../services/sound';

export const ProductDetailModal: React.FC = () => {
  const {
    language,
    t,
    storeSettings,
    selectedProduct,
    setSelectedProduct,
    activeModal,
    setActiveModal,
    addToCart,
    isInWishlist,
    toggleWishlist,
    openQuickOrder,
    showToast,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Customer review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Sync variant selection and quantity when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedVariantId(selectedProduct.variants[0].id);
      } else {
        setSelectedVariantId(undefined);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (activeModal !== 'product_detail' || !selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const selectedVariant = selectedProduct.variants?.find((v) => v.id === selectedVariantId);

  // Compute live price with wholesale discount
  const pricing = calculateCartItemPrice(
    selectedProduct,
    quantity,
    selectedVariant?.priceDelta || 0
  );

  const handleAddToCart = () => {
    sound.playAddToCart();
    addToCart(selectedProduct, quantity, selectedVariantId, selectedVariant?.name);
  };

  const handleBuyNow = () => {
    sound.playClick();
    addToCart(selectedProduct, quantity, selectedVariantId, selectedVariant?.name);
    setActiveModal('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    if (!selectedProduct.reviews) {
      selectedProduct.reviews = [];
    }
    selectedProduct.reviews.unshift(newRev);
    selectedProduct.reviewsCount += 1;
    setReviewerName('');
    setReviewComment('');
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Top Close Bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`p-2 rounded-full border border-neutral-200 bg-white/90 backdrop-blur-xs transition-colors cursor-pointer ${
              isFavorited ? 'text-rose-600' : 'text-neutral-600 hover:text-rose-600'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => {
              setActiveModal(null);
              setSelectedProduct(null);
            }}
            className="p-2 rounded-full border border-neutral-200 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-neutral-50/70 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Main Image Stage */}
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-xs relative">
                <img
                  src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all"
                />
                {selectedProduct.isFlashSale && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-[10px] font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    Flash Deal
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-neutral-900 shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bablu Electric Verified Store Showcase */}
            <div className="mt-5 p-3.5 bg-orange-50/70 rounded-xl border border-orange-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#f85606] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#f85606]" />
                  <span>{language === 'bn' ? 'অফিসিয়াল বিক্রেতা: বাবলু ইলেকট্রিক' : 'Official Seller: Bablu Electric'}</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-600 bg-white px-2 py-0.5 rounded border border-orange-200">
                  {language === 'bn' ? 'কাওরান বাজার শোরুম' : 'Kawran Bazar Showroom'}
                </span>
              </div>
              <p className="text-neutral-700 text-[11px] leading-snug">
                {language === 'bn' ? (
                  <>স্বত্বাধিকারী: <strong>মাহমুদুল হাসান বাবলু</strong> | ১৯২/১৯৩ সুপার মার্কেট, ভবন-২ (১ম ফ্লোর), কাওরান বাজার, ঢাকা।</>
                ) : (
                  <>Proprietor: <strong>Mahmudul Hassan Bablu</strong> | 192/193 Super Market, Bhaban-2 (1st Floor), Kawran Bazar, Dhaka.</>
                )}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-neutral-800">
                <span>{language === 'bn' ? 'হটলাইন:' : 'Hotline:'} <strong className="text-[#f85606]">{storeSettings.hotline}</strong></span>
                <span>WhatsApp: <strong>{storeSettings.alternatePhone}</strong></span>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি (পণ্য দেখে টাকা দিন)' : 'Cash on Delivery Nationwide (Pay upon inspection)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? '৭ দিনের সহজ রিপ্লেসমেন্ট ও রিটার্ন সুবিধা' : '7 Days Easy Return & Replacement Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? '১০০% আসল ও টেস্ট করা ইনটেক পণ্য' : '100% Genuine & Tested Brand New Goods'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: PDP Info & Purchasing Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Brand Header */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-neutral-700">
                    {selectedProduct.brand}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>{selectedProduct.category}</span>
                </div>
                <span className="font-mono text-[11px] text-neutral-400">
                  SKU: {selectedProduct.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                {language === 'bn' ? selectedProduct.nameBn : selectedProduct.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700 font-mono tabular-nums">
                  {selectedProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs text-neutral-500">
                  {selectedProduct.reviewsCount} customer reviews
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    ৳{pricing.unitPrice.toLocaleString()}
                  </span>
                  {selectedProduct.regularPrice > pricing.unitPrice && (
                    <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                      ৳{selectedProduct.regularPrice.toLocaleString()}
                    </span>
                  )}
                  {pricing.wholesaleSavings > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                      Wholesale Tier Applied! (Saved ৳{pricing.wholesaleSavings.toLocaleString()})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {selectedProduct.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {t.inStock} ({selectedProduct.stock} units ready in Banani Hub)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">{t.outOfStock}</span>
                  )}
                </div>
              </div>

              {/* Wholesale Tiers Matrix (if available) */}
              {selectedProduct.isWholesaleAvailable && selectedProduct.wholesaleTiers && (
                <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 mb-2">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.wholesaleTiersTitle}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProduct.wholesaleTiers.map((tier, idx) => {
                      const isTierActive = quantity >= tier.minQty;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuantity(tier.minQty)}
                          className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                            isTierActive
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                              : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="text-[11px] font-semibold">{tier.minQty}+ units</div>
                          <div className="text-xs font-bold font-mono tabular-nums">
                            ৳{tier.pricePerUnit}
                          </div>
                          <div className={`text-[10px] ${isTierActive ? 'text-amber-300' : 'text-emerald-600'}`}>
                            Save {tier.discountPercentage}%
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variants Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 block">
                    {t.selectVariant}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          selectedVariantId === variant.id
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-semibold text-neutral-700">{t.quantity}:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-bold text-neutral-900 focus:outline-hidden font-mono"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= selectedProduct.stock}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-neutral-500 font-mono">
                  Total: <span className="font-bold text-neutral-900">৳{pricing.totalAfterWholesale.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => openQuickOrder(selectedProduct)}
                  disabled={selectedProduct.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current text-amber-300" />
                  <span>
                    {language === 'bn'
                      ? 'সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)'
                      : 'Order Now (Cash on Delivery)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock <= 0}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>

                  <a
                    href={`https://wa.me/88${storeSettings.alternatePhone}?text=${encodeURIComponent(
                      language === 'bn'
                        ? `আসসালামু আলাইকুম বাবলু ইলেকট্রিক! আমি "${selectedProduct.name}" (মূল্য: ৳${pricing.totalAfterWholesale}) কাওরান বাজার দোকান থেকে ক্যাশ অন ডেলিভারি অর্ডার করতে চাই।`
                        : `Hello Bablu Electric! I would like to order "${selectedProduct.name}" (Price: ৳${pricing.totalAfterWholesale}) for Cash on Delivery from your Kawran Bazar shop.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-200 cursor-pointer"
                  >
                    <span>{language === 'bn' ? '💬 হোয়াটসঅ্যাপে অর্ডার' : '💬 WhatsApp Order'}</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Tabs: Description, Specs, Reviews */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-4 border-b border-neutral-200 text-xs font-semibold pb-2">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'desc'
                      ? 'text-neutral-900 border-b-2 border-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'specs'
                      ? 'text-neutral-900 border-b-2 border-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {t.specifications}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'text-neutral-900 border-b-2 border-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {t.reviews} ({selectedProduct.reviewsCount})
                </button>
              </div>

              <div className="pt-3 text-xs text-neutral-600 leading-relaxed min-h-[90px]">
                {activeTab === 'desc' && (
                  <p>{language === 'bn' ? selectedProduct.descriptionBn : selectedProduct.description}</p>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Brand</span>
                      <span className="font-medium text-neutral-900">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Model / SKU</span>
                      <span className="font-mono text-neutral-900">{selectedProduct.sku}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Origin</span>
                      <span className="font-medium text-neutral-900">Official Importer Verified</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Warranty</span>
                      <span className="font-medium text-neutral-900">7-Day Replacement Guarantee</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Review list */}
                    <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-semibold text-neutral-800">{rev.userName}</span>
                              <span className="text-neutral-400 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-current" />
                              ))}
                              {rev.verifiedPurchase && (
                                <span className="text-emerald-700 ml-2 font-medium">✓ Verified Buyer</span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-600">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-neutral-400 italic">No customer reviews yet. Be the first to review!</p>
                      )}
                    </div>

                    {/* Add Review Form */}
                    <form onSubmit={handleAddReview} className="border-t border-neutral-200 pt-3 space-y-2">
                      <span className="text-[11px] font-bold text-neutral-800 block">Write a Verified Review</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Your Name (e.g. Shakib Ahmed)"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="p-1.5 text-[11px] rounded border border-neutral-200 focus:outline-hidden"
                          required
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="p-1.5 text-[11px] rounded border border-neutral-200 focus:outline-hidden"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                          <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                          <option value={3}>⭐⭐⭐ 3 Stars</option>
                          <option value={2}>⭐⭐ 2 Stars</option>
                          <option value={1}>⭐ 1 Star</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Share your experience with this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={2}
                        className="w-full p-1.5 text-[11px] rounded border border-neutral-200 focus:outline-hidden"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-neutral-900 text-white rounded text-[11px] font-semibold hover:bg-neutral-800"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
