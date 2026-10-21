import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface BkashPaymentModalProps {
  method: 'bkash' | 'nagad' | 'sslcommerz';
  amount: number;
  onSuccess: (trxId: string) => void;
  onClose: () => void;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  method,
  amount,
  onSuccess,
  onClose,
}) => {
  const { storeSettings, showToast } = useShop();

  const [trxId, setTrxId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const isBkash = method === 'bkash';
  const isNagad = method === 'nagad';
  const isSSL = method === 'sslcommerz';

  const merchantNumber = isBkash
    ? storeSettings.bkashMerchantNumber
    : isNagad
    ? storeSettings.nagadMerchantNumber
    : '01712-345678';

  const brandColor = isBkash
    ? 'bg-[#E2136E] text-white'
    : isNagad
    ? 'bg-[#F7931E] text-white'
    : 'bg-[#0F568C] text-white';

  const brandName = isBkash ? 'bKash' : isNagad ? 'Nagad' : 'SSLCOMMERZ';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(merchantNumber.split(' ')[0]);
    setCopied(true);
    showToast('Merchant number copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx) {
      setError('Please enter your 10-character Transaction ID (TrxID).');
      return;
    }

    if (cleanTrx.length < 8) {
      setError('Invalid Transaction ID format. TrxID must be at least 8 alphanumeric characters.');
      return;
    }

    setIsVerifying(true);

    // Simulate API callback reconciliation with gateway
    setTimeout(() => {
      setIsVerifying(false);
      showToast(`${brandName} Payment verified successfully!`, 'success');
      onSuccess(cleanTrx);
    }, 1200);
  };

  const handleTestSandboxAutoFill = () => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefix = isBkash ? 'BKSH' : isNagad ? 'NGD' : 'SSL';
    setTrxId(`${prefix}${Date.now().toString().slice(-4)}${randomHex}`);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        
        {/* Gateway Header */}
        <div className={`p-5 ${brandColor} flex items-center justify-between`}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              Official Merchant Payment Gateway
            </div>
            <h3 className="text-xl font-bold">{brandName} Gateway</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Details */}
        <div className="p-6 space-y-5 text-neutral-800">
          
          {/* Payable Amount Highlight */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-500 uppercase font-semibold">
                Amount to Pay
              </span>
              <div className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                ৳{amount.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 uppercase font-semibold block">
                Currency
              </span>
              <span className="text-sm font-bold text-neutral-700">BDT (৳)</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="text-xs space-y-2 bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700">
                Merchant Wallet Number:
              </span>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 bg-white border border-neutral-200 px-2 py-0.5 rounded hover:bg-neutral-100"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono font-bold text-sm text-neutral-900 bg-white p-2 rounded border border-neutral-200 text-center">
              {merchantNumber}
            </div>

            <ol className="list-decimal list-inside text-neutral-600 space-y-1 pt-1 text-[11px] leading-relaxed">
              <li>Open your <strong>{brandName} App</strong> or dial USSD.</li>
              <li>Select <strong>"Make Payment"</strong> or <strong>"Send Money"</strong>.</li>
              <li>Enter Merchant Number above and Amount <strong>৳{amount.toLocaleString()}</strong>.</li>
              <li>Enter Reference: <strong>MyShopBD</strong>.</li>
              <li>Enter your PIN and copy the <strong>Transaction ID (TrxID)</strong>.</li>
            </ol>
          </div>

          {/* TrxID Verification Form */}
          <form onSubmit={handleVerifyPayment} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Enter {brandName} Transaction ID (TrxID):
              </label>
              <input
                type="text"
                placeholder="e.g. BKSH9A284M810"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-lg border border-neutral-300 font-mono text-sm tracking-wider uppercase focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sandbox Helper for Instant Demonstration */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestSandboxAutoFill}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
              >
                Auto-fill test sandbox TrxID
              </button>
              <span className="text-[10px] text-neutral-400">
                SSL/TLS 256-Bit Encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isBkash
                  ? 'bg-[#E2136E] hover:bg-[#c90f5f] text-white'
                  : isNagad
                  ? 'bg-[#F7931E] hover:bg-[#df7f13] text-white'
                  : 'bg-[#0F568C] hover:bg-[#0c436d] text-white'
              }`}
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Transaction with Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Confirm Payment</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
