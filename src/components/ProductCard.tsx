import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap, MapPin, Truck } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { sound } from '../services/sound';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    t,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setSelectedProduct,
    openQuickOrder,
    setActiveModal,
  } = useShop();

  const isBn = language === 'bn';
  const isFavorited = isInWishlist(product.id);
  const discountPercent =
    product.regularPrice > product.salePrice
      ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
      : 0;

  const handleCardClick = () => {
    sound.playClick();
    setSelectedProduct(product);
    setActiveModal('product_detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playAddToCart();
    addToCart(product, 1);
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    openQuickOrder(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl border border-neutral-200/90 hover:border-orange-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Product Image Stage (Daraz 1:1 Aspect Ratio) */}
      <div className="relative aspect-square w-full bg-[#fafafa] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Daraz Badges (Top Left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isFlashSale && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#f85606] to-[#ff7300] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-tight">
              <Zap className="w-2.5 h-2.5 fill-current" />
              {isBn ? 'ফ্ল্যাশ ডিল' : 'Flash Deal'}
            </span>
          )}
          {product.featured && !product.isFlashSale && (
            <span className="bg-[#f85606] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              MALL
            </span>
          )}
          {product.salePrice >= 2000 && (
            <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
              <Truck className="w-2.5 h-2.5" />
              {isBn ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors z-10 cursor-pointer ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Preview Pill */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-neutral-900 text-[11px] font-bold rounded-full shadow-md">
            <Eye className="w-3 h-3 text-[#f85606]" />
            {isBn ? 'বিস্তারিত দেখুন' : 'Quick View'}
          </span>
        </div>
      </div>

      {/* Product Content Details (Daraz Standard Format) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-600 uppercase tracking-wider text-[10px] truncate max-w-[130px]">
              {product.brand}
            </span>
            {product.stock > 0 ? (
              <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                {isBn ? 'ইন স্টক' : 'In Stock'}
              </span>
            ) : (
              <span className="text-rose-500 text-[10px] font-bold">
                {isBn ? 'স্টক আউট' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Product Name (2 lines clamped) */}
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#f85606] transition-colors">
            {isBn ? product.nameBn : product.name}
          </h3>

          {/* Wholesale Tier Notice if available */}
          {product.isWholesaleAvailable && product.wholesaleTiers && (
            <p className="text-[10px] text-purple-700 font-bold mt-1 bg-purple-50 px-1.5 py-0.5 rounded inline-block">
              {isBn
                ? `পাইকারি: ${product.wholesaleTiers[0].minQty}+ পিসে ৳${product.wholesaleTiers[0].pricePerUnit}/পিস`
                : `Wholesale: ${product.wholesaleTiers[0].minQty}+ pcs @ ৳${product.wholesaleTiers[0].pricePerUnit}/pc`}
            </p>
          )}
        </div>

        {/* Pricing, Discount, Stars, Location and Order Buttons */}
        <div className="space-y-2 pt-1 border-t border-neutral-100">
          {/* Daraz Signature Orange Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#f85606] font-mono tabular-nums">
                ৳{product.salePrice.toLocaleString()}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] text-neutral-700 font-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Stars rating & Location tag */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-500 font-medium">
                  ({product.reviewsCount})
                </span>
              </div>

              {/* Location Tag */}
              <span className="flex items-center gap-0.5 text-[10px] text-neutral-500">
                <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                <span>{isBn ? 'কাওরান বাজার' : 'Kawran Bazar'}</span>
              </span>
            </div>
          </div>

          {/* Daraz Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleQuickOrder}
              disabled={product.stock <= 0}
              className="w-full py-1.5 px-2 bg-gradient-to-r from-[#f85606] to-[#ff6a00] hover:from-[#e04a00] hover:to-[#f85606] text-white text-[11px] font-black rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-95 disabled:bg-neutral-300 cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-current text-amber-200" />
              <span>{isBn ? 'অর্ডার' : 'Buy Now'}</span>
            </button>

            <button
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className="w-full py-1.5 px-2 bg-neutral-100 hover:bg-orange-50 hover:text-[#f85606] hover:border-orange-300 border border-neutral-200 text-neutral-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95 disabled:bg-neutral-200 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{isBn ? 'কার্ট' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
