import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DarazChannelsBar } from './components/DarazChannelsBar';
import { ShopVisitingCardSection } from './components/ShopVisitingCardSection';
import { FlashSaleSection } from './components/FlashSaleSection';
import { WholesaleSection } from './components/WholesaleSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { LoginModal } from './components/LoginModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { QuickOrderModal } from './components/QuickOrderModal';
import { SupportModal } from './components/SupportModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { sound } from './services/sound';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Search,
  Sparkles,
  Layers,
  Tag,
  Store,
  Flame,
  LayoutGrid,
} from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const {
    t,
    language,
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Extract unique brands
  const brands = ['All', ...Array.from(new Set(products.map((p) => p.brand)))];

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    if (product.isArchived) return false;

    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    // Brand filter
    if (selectedBrand !== 'All' && product.brand !== selectedBrand) {
      return false;
    }

    // In stock filter
    if (inStockOnly && product.stock <= 0) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchNameBn = product.nameBn.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchNameBn && !matchBrand && !matchSku && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.salePrice - b.salePrice;
    if (sortBy === 'price_high') return b.salePrice - a.salePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] selection:bg-orange-200 selection:text-orange-900 font-sans">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Daraz-Style Responsive Navigation Bar */}
      <Navbar />

      {/* Daraz-Style Hero Campaign 3-Column Layout */}
      <HeroBanner />

      {/* Daraz 6-Channels Icon Bar (Card, Location, Support, Mall, Free Delivery, Wholesale) */}
      <DarazChannelsBar />

      {/* Bablu Electric Visiting Card & Kawran Bazar Outlet Location & Support Hub */}
      <ShopVisitingCardSection />

      {/* Daraz Flash Sale (ফ্ল্যাশ সেল) with Live Countdown */}
      <FlashSaleSection />

      {/* Wholesale & Bulk Deals */}
      <WholesaleSection />

      {/* Daraz "Just For You" / "আপনার জন্য পণ্য" Catalog Section */}
      <main id="catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Daraz Catalog Header & Filter Strip */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#f85606]">
                <LayoutGrid className="w-4 h-4" />
                <span>{language === 'bn' ? 'দারাজ স্টাইল কালেকশন' : 'Daraz Style Showcase'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 mt-0.5">
                {searchQuery
                  ? (language === 'bn' ? `"${searchQuery}" এর সার্চ ফলাফল` : `Search results for "${searchQuery}"`)
                  : language === 'bn'
                  ? 'আপনার জন্য পণ্য (Just For You)'
                  : 'Just For You (Curated Products)'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                {language === 'bn'
                  ? `কাওরান বাজার বাবলু ইলেকট্রিক শোরুম থেকে সরাসরি পাইকারি ও খুচরা ক্যাশ অন ডেলিভারি। মোট ${sortedProducts.length}টি পণ্য পাওয়া গেছে।`
                  : `Wholesale & retail with Cash on Delivery from Bablu Electric Kawran Bazar. Showing ${sortedProducts.length} products.`}
              </p>
            </div>

            {/* Sorting & Stock Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* In Stock toggle */}
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer bg-neutral-50 hover:bg-neutral-100 px-3 py-2 rounded-xl border border-neutral-200 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    sound.playClick();
                    setInStockOnly(e.target.checked);
                  }}
                  className="rounded text-[#f85606] focus:ring-0 cursor-pointer"
                />
                <span>{language === 'bn' ? 'ইন স্টক পণ্য' : 'In Stock Only'}</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    sound.playClick();
                    setSortBy(e.target.value as any);
                  }}
                  className="bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">{language === 'bn' ? 'জনপ্রিয়তা অনুযায়ী (Featured)' : 'Featured & Popular'}</option>
                  <option value="price_low">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                  <option value="price_high">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                  <option value="rating">{language === 'bn' ? 'সেরা রেটিং প্রাপ্ত' : 'Top Customer Rating'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 shrink-0 uppercase tracking-wider">
              {language === 'bn' ? 'ব্র্যান্ড:' : 'Brands:'}
            </span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => {
                  sound.playClick();
                  setSelectedBrand(b);
                }}
                className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedBrand === b
                    ? 'bg-[#f85606] text-white font-bold shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {b}
              </button>
            ))}
            {selectedBrand !== 'All' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedBrand('All');
                }}
                className="text-xs text-[#f85606] hover:underline shrink-0 ml-1 font-bold"
              >
                সব ব্র্যান্ড দেখুন
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid (Daraz 4-Column on Desktop, 2-Column on Mobile) */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#f85606] mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-neutral-900">
              কোনো পণ্য পাওয়া যায়নি
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              দয়া করে অন্য কোনো নাম দিয়ে সার্চ করুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 bg-[#f85606] hover:bg-[#d84803] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      {/* Global Interactive Modals and Drawers */}
      <ProductDetailModal />
      <QuickOrderModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />
      <CustomerAccountModal />
      <LoginModal />
      <PolicyModal />
      <AdminDashboard />
      <SupportModal />

      {/* Floating Quick Action Buttons (WhatsApp, Phone, Store Card, Support, Sound) */}
      <FloatingActions />

      {/* Global Toast Feedback Container */}
      <ToastContainer />

      {/* Global Footer with Bablu Electric & Daraz Style Links */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}
