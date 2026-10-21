import React from 'react';
import { Package, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const WholesaleSection: React.FC = () => {
  const { t, products } = useShop();

  const wholesaleProducts = products.filter(
    (p) => p.isWholesaleAvailable && p.wholesaleTiers && p.wholesaleTiers.length > 0 && !p.isArchived
  );

  return (
    <section id="wholesale" className="py-12 bg-neutral-100/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>B2B & Retail Merchant Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              {t.wholesaleDeals}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {t.wholesaleSub}
            </p>
          </div>

          {/* Wholesale Perks pill strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Direct Factory Invoices
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Stepped Price Reductions
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Fast Cargo Dispatch
            </span>
          </div>
        </div>

        {/* Wholesale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wholesaleProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
