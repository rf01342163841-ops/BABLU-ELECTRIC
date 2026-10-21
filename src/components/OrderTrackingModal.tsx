import React, { useState } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  FileText,
  RotateCcw,
  Ban,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    t,
    orders,
    activeModal,
    setActiveModal,
    setSelectedOrderForInvoice,
    requestOrderCancellation,
    requestOrderReturn,
  } = useShop();

  const [searchKey, setSearchKey] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [activeAction, setActiveAction] = useState<'cancel' | 'return' | null>(null);

  if (activeModal !== 'track_order') return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchKey.trim().toLowerCase();
    if (!clean) return;

    setSearched(true);
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.customerPhone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
    );
    setMatchedOrder(found || null);
    setActiveAction(null);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedOrder || !reasonInput.trim()) return;

    if (activeAction === 'cancel') {
      requestOrderCancellation(matchedOrder.id, reasonInput.trim());
    } else if (activeAction === 'return') {
      requestOrderReturn(matchedOrder.id, reasonInput.trim());
    }

    setActiveAction(null);
    setReasonInput('');
    // refresh matched order from updated state
    const updated = orders.find((o) => o.id === matchedOrder.id);
    if (updated) setMatchedOrder(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Processing':
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
      case 'Return Requested':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {t.trackOrderTitle}
              </h2>
              <p className="text-xs text-neutral-500">
                {t.trackOrderSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 border-b border-neutral-200 bg-white">
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Enter Order ID (e.g. MSB-2026-9842) or Phone"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-neutral-300 font-mono focus:outline-hidden focus:border-neutral-900"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {t.searchOrder}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => setSearchKey('MSB-2026-9842')}
              className="font-mono underline text-neutral-800 hover:text-amber-700"
            >
              MSB-2026-9842
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setSearchKey('01819876543')}
              className="font-mono underline text-neutral-800 hover:text-amber-700"
            >
              01819876543
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {searched && !matchedOrder && (
            <div className="text-center py-8 space-y-2">
              <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-800">{t.orderNotFound}</p>
              <p className="text-xs text-neutral-500">
                Please verify your order number in your SMS or contact our customer support hotline.
              </p>
            </div>
          )}

          {matchedOrder && (
            <div className="space-y-6">
              
              {/* Order Overview Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      Order Reference
                    </span>
                    <h3 className="text-base font-bold font-mono text-neutral-900">
                      {matchedOrder.orderNumber}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      matchedOrder.orderStatus
                    )}`}
                  >
                    {matchedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 pt-2 border-t border-neutral-200/60">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Recipient:</span>
                    <span className="font-medium text-neutral-900">{matchedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Destination:</span>
                    <span className="font-medium text-neutral-900">
                      {matchedOrder.shippingAddress.thanaArea}, {matchedOrder.shippingAddress.division}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Payment:</span>
                    <span className="font-medium text-neutral-900 uppercase">
                      {matchedOrder.paymentMethod} ({matchedOrder.paymentStatus})
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Grand Total:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      ৳{matchedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedOrderForInvoice(matchedOrder);
                      setActiveModal('order_confirmed');
                    }}
                    className="text-xs font-semibold text-neutral-800 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                    <span>View & Print Official Invoice</span>
                  </button>
                </div>
              </div>

              {/* Real-time Order Journey Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {t.timeline}
                </h4>

                <div className="space-y-3 border-l-2 border-neutral-200 pl-4 ml-2">
                  {matchedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <div className="text-xs font-bold text-neutral-900">{event.status}</div>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{event.note}</p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions: Cancellation / Return */}
              <div className="pt-2 border-t border-neutral-200">
                {activeAction ? (
                  <form onSubmit={handleActionSubmit} className="space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-xs font-bold text-neutral-900 block">
                      {activeAction === 'cancel' ? t.requestCancellation : t.requestReturn}
                    </span>
                    <textarea
                      required
                      rows={2}
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      placeholder="Please specify the reason for this request..."
                      className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveAction(null)}
                        className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-neutral-800"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-2">
                    {matchedOrder.orderStatus === 'Pending' || matchedOrder.orderStatus === 'Confirmed' ? (
                      <button
                        onClick={() => setActiveAction('cancel')}
                        className="text-xs font-medium text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{t.requestCancellation}</span>
                      </button>
                    ) : null}

                    {matchedOrder.orderStatus === 'Delivered' ? (
                      <button
                        onClick={() => setActiveAction('return')}
                        className="text-xs font-medium text-amber-800 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t.requestReturn}</span>
                      </button>
                    ) : null}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
