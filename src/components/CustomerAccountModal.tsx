import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  ExternalLink,
  Truck,
  FileText,
  Clock,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const CustomerAccountModal: React.FC = () => {
  const {
    t,
    currentUser,
    logout,
    orders,
    wishlist,
    products,
    activeModal,
    setActiveModal,
    setSelectedOrderForInvoice,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  if (activeModal !== 'account_profile' && activeModal !== 'account_wishlist') return null;

  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail === currentUser.email ||
          o.customerPhone === currentUser.phone
      )
    : orders.slice(0, 3); // show recent for demo

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {currentUser?.name || 'Customer Account'}
              </h2>
              <p className="text-xs text-neutral-500">
                {currentUser?.email || 'Logged in shopper'} · Market: Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={() => {
                  logout();
                  setActiveModal(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            )}
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.myOrders} ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{t.wishlist} ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>{t.myProfile}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-700">No orders yet</p>
                  <p className="text-xs text-neutral-500">Your placed orders will appear here.</p>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold font-mono text-neutral-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-neutral-500 ml-2 font-mono">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white">
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5 border-t border-neutral-200/60 pt-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-neutral-700">
                          <span className="truncate max-w-xs">{it.productName} (×{it.quantity})</span>
                          <span className="font-mono tabular-nums font-semibold">৳{it.totalPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
                      <div>
                        <span className="text-neutral-500">Total: </span>
                        <strong className="font-mono text-neutral-900">৳{order.totalAmount.toLocaleString()}</strong>
                        <span className="text-neutral-400 text-[11px] ml-1 uppercase">({order.paymentMethod})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderForInvoice(order);
                            setActiveModal('order_confirmed');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-md shadow-xs flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveModal('track_order');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-neutral-900 rounded-md shadow-xs flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-700">Your wishlist is empty</p>
                  <p className="text-xs text-neutral-500">
                    Click the heart icon on any product card to save it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <h3 className="font-bold text-neutral-900 text-sm">Customer Details</h3>
                <div className="grid grid-cols-2 gap-3 text-neutral-700">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Full Name:</span>
                    <span className="font-semibold">{currentUser?.name || 'Guest Shopper'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Email Address:</span>
                    <span className="font-semibold font-mono">{currentUser?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Contact Phone:</span>
                    <span className="font-semibold font-mono">{currentUser?.phone || '+880 1700-000000'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Account Type:</span>
                    <span className="font-semibold uppercase">{currentUser?.role || 'Customer'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Saved Addresses</span>
                </h3>
                {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                  currentUser.addresses.map((addr, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-neutral-200">
                      <p className="font-semibold text-neutral-900">{addr.fullName}</p>
                      <p className="text-neutral-600">{addr.streetAddress}</p>
                      <p className="text-neutral-600">{addr.thanaArea}, {addr.district}, {addr.division}</p>
                      <p className="font-mono text-neutral-800 mt-1">{addr.phone}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 italic">
                    Primary Address: Banani / Gulshan, Dhaka, Bangladesh. (Addresses are saved automatically at checkout).
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
