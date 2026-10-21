import React, { useState } from 'react';
import { X, HelpCircle, Shield, Truck, RotateCcw, FileText, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PolicyModal: React.FC = () => {
  const { activeModal, setActiveModal, storeSettings } = useShop();

  const [activeSection, setActiveSection] = useState<'faq' | 'shipping' | 'returns' | 'about' | 'privacy'>('faq');

  if (activeModal !== 'policy_faq' && activeModal !== 'policy_general') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Help Center & Store Policies
            </h2>
            <p className="text-xs text-neutral-500">
              {storeSettings.storeName} Bangladesh Customer Assurance
            </p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Strip */}
        <div className="flex border-b border-neutral-200 bg-white overflow-x-auto no-scrollbar px-6 text-xs font-bold">
          <button
            onClick={() => setActiveSection('faq')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'faq' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveSection('shipping')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'shipping' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
            }`}
          >
            Shipping & Delivery
          </button>
          <button
            onClick={() => setActiveSection('returns')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'returns' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
            }`}
          >
            Returns & Refunds
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'about' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === 'privacy' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500'
            }`}
          >
            Privacy & Terms
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto text-xs leading-relaxed text-neutral-700 space-y-4">
          
          {activeSection === 'faq' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-xs mb-1">
                  1. Can I inspect the product before paying with Cash on Delivery (COD)?
                </h4>
                <p className="text-neutral-600">
                  Yes, absolutely! We encourage you to inspect the exterior condition and package integrity in front of the delivery rider before handing over the cash payment.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-xs mb-1">
                  2. How fast is delivery inside Dhaka?
                </h4>
                <p className="text-neutral-600">
                  Orders placed before 2:00 PM are processed the same day and typically delivered within 24 to 48 hours via our dedicated Dhaka logistics fleet.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-xs mb-1">
                  3. How do wholesale tiered discounts work?
                </h4>
                <p className="text-neutral-600">
                  When you select 5, 10, or more units of an eligible wholesale product, the bulk tier price is applied automatically in real time in your cart. You don't need a special wholesale account.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-xs mb-1">
                  4. How can I verify my bKash or Nagad payment?
                </h4>
                <p className="text-neutral-600">
                  During checkout, select bKash or Nagad. You will receive the official merchant wallet number. Make the payment and enter your 10-character Transaction ID (TrxID) for instant reconciliation.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 text-sm">Delivery Zones & Timelines</h4>
              <p>
                We deliver to all 64 districts across Bangladesh via trusted courier services (Pathao, Steadfast, eCourier, and SA Paribahan).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="font-bold text-neutral-900 block">Inside Dhaka City</span>
                  <span className="font-mono text-emerald-700 font-bold">৳70 Fee</span>
                  <p className="text-[11px] text-neutral-500 mt-1">1-2 Days (Express)</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="font-bold text-neutral-900 block">Sub-Dhaka (Gazipur/Savar)</span>
                  <span className="font-mono text-emerald-700 font-bold">৳100 Fee</span>
                  <p className="text-[11px] text-neutral-500 mt-1">2-3 Days</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="font-bold text-neutral-900 block">Outside Dhaka (Nationwide)</span>
                  <span className="font-mono text-emerald-700 font-bold">৳130 Fee</span>
                  <p className="text-[11px] text-neutral-500 mt-1">3-4 Days</p>
                </div>
              </div>
              <p className="pt-2 text-emerald-700 font-semibold">
                * All orders totaling ৳{storeSettings.freeDeliveryThreshold.toLocaleString()} or above qualify for 100% Free Nationwide Delivery.
              </p>
            </div>
          )}

          {activeSection === 'returns' && (
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 text-sm">7-Day Replacement & Return Policy</h4>
              <p>
                If your product arrives damaged, defective, or does not match the product description on our website, you are eligible for an immediate replacement or full refund within 7 calendar days of delivery.
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Item must be in its original packaging with all included accessories and warranty stickers.</li>
                <li>Submit a return request online via your account order history or by calling our hotline.</li>
                <li>Our courier rider will pick up the item from your doorstep at zero return fee.</li>
              </ul>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 text-sm">About {storeSettings.storeName}</h4>
              <p>
                {storeSettings.storeName} is a modern, transparent e-commerce and wholesale ecosystem built for the Bangladeshi market. Inspired by the reliable merchant traditions of HT Bazar, we connect retail shoppers, businesses, and resellers directly with authorized distributors and first-tier importers.
              </p>
              <p>
                Hub & Headquarters: {storeSettings.address}
              </p>
              <p className="font-mono">
                Hotline: {storeSettings.hotline} · Email: {storeSettings.email}
              </p>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 text-sm">Privacy & Security Commitment</h4>
              <p>
                We adhere to strict data security standards. Customer phone numbers and addresses are used solely for fulfillment logistics and order confirmation SMS. We never store customer credit card details or bank credentials.
              </p>
              <p>
                All digital transactions are encrypted with 256-bit TLS protocols and verified directly with Bangladesh payment gateways.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
