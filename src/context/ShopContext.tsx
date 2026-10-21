import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  Product,
  CartItem,
  Coupon,
  DeliveryZone,
  Order,
  OrderStatus,
  User,
  StoreSettings,
  AdminAuditLog,
} from '../types';
import { storage, calculateCartItemPrice, generateOrderNumber } from '../services/storage';
import { translations } from '../translations';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, variantName?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  deliveryZones: DeliveryZone[];
  selectedDeliveryZone: DeliveryZone;
  setSelectedDeliveryZone: (zone: DeliveryZone) => void;
  orders: Order[];
  createOrder: (orderPayload: {
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: any;
    paymentMethod: any;
    transactionId?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  requestOrderCancellation: (orderId: string, reason: string) => void;
  requestOrderReturn: (orderId: string, reason: string) => void;
  currentUser: User | null;
  login: (email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  auditLogs: AdminAuditLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openQuickOrder: (product: Product) => void;
  createDirectOrder: (payload: {
    product: Product;
    quantity: number;
    variantName?: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: any;
    deliveryFee: number;
    deliveryZoneName: string;
  }) => Order;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  // Computed Cart metrics
  cartSubtotal: number;
  cartWholesaleSavings: number;
  cartCouponDiscount: number;
  cartDeliveryFee: number;
  cartGrandTotal: number;
  cartItemCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(storage.getLanguage());
  const [products, setProductsState] = useState<Product[]>(storage.getProducts());
  const [cart, setCartState] = useState<CartItem[]>(storage.getCart());
  const [wishlist, setWishlistState] = useState<string[]>(storage.getWishlist());
  const [coupons, setCouponsState] = useState<Coupon[]>(storage.getCoupons());
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryZones] = useState<DeliveryZone[]>(storage.getDeliveryZones());
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone>(
    storage.getDeliveryZones()[0] || {
      id: 'zone-dhaka',
      name: 'Inside Dhaka City',
      nameBn: 'ঢাকা সিটি কর্পোরেশন',
      charge: 70,
      estimatedDays: '1-2 Days',
      estimatedDaysBn: '১-২ দিন',
    }
  );
  const [orders, setOrdersState] = useState<Order[]>(storage.getOrders());
  const [currentUser, setCurrentUserState] = useState<User | null>(storage.getCurrentUser());
  const [storeSettings, setStoreSettingsState] = useState<StoreSettings>(storage.getSettings());
  const [auditLogs, setAuditLogsState] = useState<AdminAuditLog[]>(storage.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.saveLanguage(lang);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const syncProducts = (newProds: Product[]) => {
    setProductsState(newProds);
    storage.saveProducts(newProds);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    const updated = [newProd, ...products];
    syncProducts(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'ADD_PRODUCT',
      target: newProd.name,
      details: `Added new product with SKU ${newProd.sku} and initial stock ${newProd.stock}`,
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast(`Product "${newProd.name}" added successfully.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    syncProducts(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'UPDATE_PRODUCT',
      target: id,
      details: `Updated product properties: ${Object.keys(updates).join(', ')}`,
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    syncProducts(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'DELETE_PRODUCT',
      target: target?.name || id,
      details: 'Product deleted from store catalog.',
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast('Product removed from catalog.');
  };

  const syncCart = (newCart: CartItem[]) => {
    setCartState(newCart);
    storage.saveCart(newCart);
  };

  const addToCart = (product: Product, quantity = 1, variantId?: string, variantName?: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.variantId === variantId
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      const newQty = existing.quantity + quantity;
      const pricing = calculateCartItemPrice(product, newQty);
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        unitPrice: pricing.unitPrice,
        totalPrice: pricing.totalAfterWholesale,
        wholesaleDiscountApplied: pricing.wholesaleSavings,
      };
    } else {
      const pricing = calculateCartItemPrice(product, quantity);
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        variantId,
        variantName,
        quantity,
        unitPrice: pricing.unitPrice,
        totalPrice: pricing.totalAfterWholesale,
        wholesaleDiscountApplied: pricing.wholesaleSavings,
      };
      updatedCart = [...cart, newItem];
    }

    syncCart(updatedCart);
    showToast(t.addedToCart, 'success');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updated = cart.map((item) => {
      if (item.id === itemId) {
        const pricing = calculateCartItemPrice(item.product, quantity);
        return {
          ...item,
          quantity,
          unitPrice: pricing.unitPrice,
          totalPrice: pricing.totalAfterWholesale,
          wholesaleDiscountApplied: pricing.wholesaleSavings,
        };
      }
      return item;
    });
    syncCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cart.filter((item) => item.id !== itemId);
    syncCart(updated);
  };

  const clearCart = () => {
    syncCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      showToast(t.removedFromWishlist, 'info');
    } else {
      updated = [...wishlist, productId];
      showToast(t.addedToWishlist, 'success');
    }
    setWishlistState(updated);
    storage.saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
  const cartWholesaleSavings = cart.reduce((acc, item) => acc + (item.wholesaleDiscountApplied || 0), 0);
  const cartItemTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  let cartCouponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const discount = (cartItemTotal * appliedCoupon.discountValue) / 100;
      cartCouponDiscount = appliedCoupon.maxDiscountAmount
        ? Math.min(discount, appliedCoupon.maxDiscountAmount)
        : discount;
    } else {
      cartCouponDiscount = Math.min(appliedCoupon.discountValue, cartItemTotal);
    }
  }

  // Free delivery threshold check
  const isFreeDelivery = cartItemTotal >= storeSettings.freeDeliveryThreshold;
  const cartDeliveryFee = isFreeDelivery ? 0 : selectedDeliveryZone.charge;
  const cartGrandTotal = Math.max(0, cartItemTotal - cartCouponDiscount + cartDeliveryFee);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: t.invalidCoupon };
    }

    if (cartItemTotal < found.minPurchaseAmount) {
      return {
        success: false,
        message: `Minimum purchase of ৳${found.minPurchaseAmount.toLocaleString()} required for this coupon.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: t.couponApplied };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`,
      usageCount: 0,
    };
    const updated = [newCoupon, ...coupons];
    setCouponsState(updated);
    storage.saveCoupons(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'ADD_COUPON',
      target: newCoupon.code,
      details: `Created coupon code ${newCoupon.code} with value ${newCoupon.discountValue}`,
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast(`Coupon ${newCoupon.code} created.`);
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    setCouponsState(updated);
    storage.saveCoupons(updated);
    showToast('Coupon removed.');
  };

  const createOrder = ({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
    transactionId,
  }: {
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: any;
    paymentMethod: any;
    transactionId?: string;
  }): Order => {
    const orderNumber = generateOrderNumber();
    const isPaid = paymentMethod !== 'cod' && Boolean(transactionId);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail: customerEmail || currentUser?.email,
      customerPhone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        variantName: item.variantName,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        image: item.product.images[0] || '',
      })),
      subtotal: cartSubtotal,
      wholesaleSavings: cartWholesaleSavings,
      discount: cartCouponDiscount,
      couponCode: appliedCoupon?.code,
      deliveryFee: cartDeliveryFee,
      deliveryZoneId: selectedDeliveryZone.id,
      totalAmount: cartGrandTotal,
      paymentMethod,
      paymentStatus: isPaid ? 'Paid' : 'Unpaid',
      transactionId: transactionId || (paymentMethod === 'cod' ? undefined : `TXN-${Date.now().toString(36).toUpperCase()}`),
      orderStatus: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order placed via ${paymentMethod.toUpperCase()}${isPaid ? ' (Payment Verified)' : ''}`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    storage.saveOrders(updatedOrders);

    // Concurrently adjust product stock
    const updatedProds = products.map((prod) => {
      const purchased = cart.find((c) => c.productId === prod.id);
      if (purchased) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchased.quantity),
        };
      }
      return prod;
    });
    syncProducts(updatedProds);

    // Record coupon usage
    if (appliedCoupon) {
      const updatedCoupons = coupons.map((c) =>
        c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c
      );
      setCouponsState(updatedCoupons);
      storage.saveCoupons(updatedCoupons);
    }

    // Clear cart and show invoice
    clearCart();
    setSelectedOrderForInvoice(newOrder);
    setActiveModal('order_confirmed');
    return newOrder;
  };

  const openQuickOrder = (product: Product) => {
    setSelectedProduct(product);
    setActiveModal('quick_order');
  };

  const createDirectOrder = ({
    product,
    quantity,
    variantName,
    customerName,
    customerPhone,
    shippingAddress,
    deliveryFee,
    deliveryZoneName,
  }: {
    product: Product;
    quantity: number;
    variantName?: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: any;
    deliveryFee: number;
    deliveryZoneName: string;
  }): Order => {
    const orderNumber = generateOrderNumber();
    const pricing = calculateCartItemPrice(product, quantity);
    const totalAmount = pricing.totalAfterWholesale + deliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail: currentUser?.email,
      customerPhone,
      shippingAddress,
      items: [
        {
          productId: product.id,
          productName: product.name,
          variantName,
          sku: product.sku,
          quantity,
          unitPrice: pricing.unitPrice,
          totalPrice: pricing.totalAfterWholesale,
          image: product.images[0] || '',
        },
      ],
      subtotal: product.salePrice * quantity,
      wholesaleSavings: pricing.wholesaleSavings,
      discount: 0,
      deliveryFee,
      deliveryZoneId: deliveryZoneName,
      totalAmount,
      paymentMethod: 'cod',
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Direct 1-Click Order placed via Cash on Delivery (${deliveryZoneName})`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    storage.saveOrders(updatedOrders);

    // Adjust product stock
    const updatedProds = products.map((p) =>
      p.id === product.id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
    );
    syncProducts(updatedProds);

    setSelectedOrderForInvoice(newOrder);
    setActiveModal('order_confirmed');
    showToast('অর্ডার সফলভাবে গ্রহণ করা হয়েছে!', 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const newTimeline = [
          ...o.timeline,
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status} by admin`,
          },
        ];
        return {
          ...o,
          orderStatus: status,
          timeline: newTimeline,
        };
      }
      return o;
    });

    setOrdersState(updated);
    storage.saveOrders(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'UPDATE_ORDER_STATUS',
      target: orderId,
      details: `Changed status to ${status}. Note: ${note || 'None'}`,
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast(`Order status updated to ${status}.`);
  };

  const requestOrderCancellation = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'Cancelled', `Cancellation requested: ${reason}`);
    showToast('Cancellation request submitted.');
  };

  const requestOrderReturn = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'Return Requested', `Return requested: ${reason}`);
    showToast('Return request submitted.');
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@myshopbd.com' && pass === 'admin123456') {
      const adminUser: User = {
        id: 'usr-admin',
        name: 'Shop Administrator',
        email: cleanEmail,
        phone: '01712345678',
        role: 'admin',
        createdAt: '2026-01-01',
      };
      setCurrentUserState(adminUser);
      storage.saveCurrentUser(adminUser);
      showToast('Logged in as Administrator.', 'success');
      return { success: true, message: 'Logged in as Administrator' };
    }

    if (pass.length >= 6) {
      const custUser: User = {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        phone: '01700000000',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      setCurrentUserState(custUser);
      storage.saveCurrentUser(custUser);
      showToast('Logged in successfully.', 'success');
      return { success: true, message: 'Logged in successfully' };
    }

    return { success: false, message: 'Invalid credentials. Password must be at least 6 characters.' };
  };

  const logout = () => {
    setCurrentUserState(null);
    storage.saveCurrentUser(null);
    showToast('Logged out.', 'info');
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    const updated = { ...storeSettings, ...updates };
    setStoreSettingsState(updated);
    storage.saveSettings(updated);
    storage.addAuditLog({
      adminEmail: currentUser?.email || 'admin@myshopbd.com',
      action: 'UPDATE_SETTINGS',
      target: 'Store Settings',
      details: `Modified store settings: ${Object.keys(updates).join(', ')}`,
    });
    setAuditLogsState(storage.getAuditLogs());
    showToast('Store settings updated.');
  };

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        t,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        deliveryZones,
        selectedDeliveryZone,
        setSelectedDeliveryZone,
        orders,
        createOrder,
        updateOrderStatus,
        requestOrderCancellation,
        requestOrderReturn,
        currentUser,
        login,
        logout,
        storeSettings,
        updateStoreSettings,
        auditLogs,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        openQuickOrder,
        createDirectOrder,
        activeModal,
        setActiveModal,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,
        toasts,
        showToast,
        cartSubtotal,
        cartWholesaleSavings,
        cartCouponDiscount,
        cartDeliveryFee,
        cartGrandTotal,
        cartItemCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
