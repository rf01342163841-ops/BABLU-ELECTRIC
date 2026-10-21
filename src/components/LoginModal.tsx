import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, User, KeyRound, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LoginModal: React.FC = () => {
  const {
    t,
    activeModal,
    setActiveModal,
    login,
    currentUser,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(activeModal === 'admin_login');

  if (activeModal !== 'login' && activeModal !== 'admin_login') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (res.success) {
      if (email.trim().toLowerCase() === 'admin@myshopbd.com') {
        setActiveModal('admin_dashboard');
      } else {
        setActiveModal(null);
      }
    } else {
      setError(res.message);
    }
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@myshopbd.com');
    setPassword('admin123456');
    setIsAdminMode(true);
  };

  const handleCustomerQuickFill = () => {
    setEmail('customer@myshopbd.com');
    setPassword('pass1234');
    setIsAdminMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        
        {/* Modal Top */}
        <div className="p-6 pb-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAdminMode ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-white'}`}>
              {isAdminMode ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {isAdminMode ? 'Admin Authentication' : t.account}
              </h2>
              <p className="text-xs text-neutral-500">
                {isAdminMode ? 'Authorized staff & merchant access' : 'Access your orders & saved addresses'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <span className="text-[11px] font-bold text-neutral-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo One-Click Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCustomerQuickFill}
                className="py-1.5 px-2 bg-white hover:bg-neutral-100 rounded-lg text-[11px] font-semibold text-neutral-800 border border-neutral-200 transition-colors"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={handleAdminQuickFill}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 rounded-lg text-[11px] font-bold text-amber-900 border border-amber-200 transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full text-xs p-2.5 pl-9 rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 pl-9 rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900"
              />
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 text-xs font-bold rounded-lg text-white transition-colors shadow-xs ${
              isAdminMode
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            {isAdminMode ? 'Authenticate Admin Dashboard' : t.login}
          </button>

          {/* Toggle between customer & admin */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline"
            >
              {isAdminMode ? 'Switch to Customer Login' : 'Admin Portal Login'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
