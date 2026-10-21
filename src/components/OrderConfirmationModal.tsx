import React from 'react';
import {
  CheckCircle,
  Printer,
  ShoppingBag,
  Clock,
  ArrowRight,
  Truck,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderConfirmationModal: React.FC = () => {
  const {
    t,
    language,
    selectedOrderForInvoice,
    activeModal,
    setActiveModal,
    storeSettings,
  } = useShop();

  if (activeModal !== 'order_confirmed' || !selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Top Actions Bar (Hidden on print) */}
        <div className="no-print p-4 sm:p-6 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                {t.orderConfirmed}
              </h2>
              <p className="text-xs text-emerald-800">
                Confirmation SMS dispatched to <strong className="font-mono">{order.customerPhone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg text-xs font-semibold border border-neutral-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printInvoice}</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body (Rendered for Screen and Print) */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-6">
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 block">
                {storeSettings.storeName}
              </span>
              <p className="text-xs text-neutral-500 max-w-xs mt-1">
                {storeSettings.address}
              </p>
              <p className="text-xs text-neutral-600 font-mono mt-0.5">
                Hotline: {storeSettings.hotline}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                Official Receipt / Invoice
              </span>
              <div className="text-lg font-mono font-bold text-neutral-900 mt-0.5">
                {order.orderNumber}
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-neutral-100 text-neutral-800">
                Status: {order.orderStatus}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="font-bold text-neutral-700 block mb-1">Billed & Shipped To:</span>
              <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
              <p className="text-neutral-600">{order.shippingAddress.streetAddress}</p>
              <p className="text-neutral-600">
                {order.shippingAddress.thanaArea}, {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
              <p className="font-mono text-neutral-900 mt-1">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="font-bold text-neutral-700 block mb-1">Payment & Logistics:</span>
              <p className="text-neutral-600">
                Method: <strong className="uppercase text-neutral-900">{order.paymentMethod}</strong>
              </p>
              <p className="text-neutral-600">
                Payment Status:{' '}
                <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>
                  {order.paymentStatus}
                </strong>
              </p>
              {order.transactionId && (
                <p className="font-mono text-neutral-900 text-[11px] mt-0.5 truncate">
                  TrxID: {order.transactionId}
                </p>
              )}
              {order.shippingAddress.deliveryNotes && (
                <p className="text-neutral-500 italic text-[11px] mt-1">
                  Note: "{order.shippingAddress.deliveryNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="p-2.5">
                      <div className="font-semibold text-neutral-900">{item.productName}</div>
                      {item.variantName && (
                        <div className="text-neutral-500 text-[10px]">Variant: {item.variantName}</div>
                      )}
                      <div className="text-neutral-400 font-mono text-[10px]">SKU: {item.sku}</div>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">৳{item.unitPrice.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono font-bold tabular-nums">৳{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-neutral-900 tabular-nums">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.wholesaleSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Wholesale Discount:</span>
                  <span className="font-mono tabular-nums">-৳{order.wholesaleSavings.toLocaleString()}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({order.couponCode}):</span>
                  <span className="font-mono tabular-nums">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-mono text-neutral-900 tabular-nums">
                  {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount:</span>
                <span className="font-mono text-base tabular-nums">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline Journey */}
          <div className="pt-4 border-t border-neutral-200">
            <span className="text-xs font-bold text-neutral-900 block mb-3">
              {t.timeline}
            </span>
            <div className="space-y-3">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{item.status}</span>
                      <span className="text-neutral-400 font-mono text-[10px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-[11px] mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer (No Print) */}
        <div className="no-print p-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
          <button
            onClick={() => {
              setActiveModal('track_order');
            }}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Track this order online</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold"
          >
            Done & Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
