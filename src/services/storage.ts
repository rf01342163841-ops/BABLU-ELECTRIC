import {
  Product,
  CartItem,
  Coupon,
  DeliveryZone,
  Order,
  User,
  StoreSettings,
  AdminAuditLog,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockDatabase';

const KEYS = {
  PRODUCTS: 'myshopbd_products',
  CART: 'myshopbd_cart',
  WISHLIST: 'myshopbd_wishlist',
  ORDERS: 'myshopbd_orders',
  COUPONS: 'myshopbd_coupons',
  DELIVERY_ZONES: 'myshopbd_delivery_zones',
  CURRENT_USER: 'myshopbd_current_user',
  SETTINGS: 'myshopbd_settings',
  AUDIT_LOGS: 'myshopbd_audit_logs',
  LANGUAGE: 'myshopbd_language',
};

export const storage = {
  getProducts(): Product[] {
    const raw = localStorage.getItem(KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getCart(): CartItem[] {
    const raw = localStorage.getItem(KEYS.CART);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  },

  getWishlist(): string[] {
    const raw = localStorage.getItem(KEYS.WISHLIST);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveWishlist(ids: string[]): void {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(ids));
  },

  getOrders(): Order[] {
    const raw = localStorage.getItem(KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  },

  getCoupons(): Coupon[] {
    const raw = localStorage.getItem(KEYS.COUPONS);
    if (!raw) {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
  },

  getDeliveryZones(): DeliveryZone[] {
    const raw = localStorage.getItem(KEYS.DELIVERY_ZONES);
    if (!raw) {
      localStorage.setItem(KEYS.DELIVERY_ZONES, JSON.stringify(INITIAL_DELIVERY_ZONES));
      return INITIAL_DELIVERY_ZONES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  },

  saveDeliveryZones(zones: DeliveryZone[]): void {
    localStorage.setItem(KEYS.DELIVERY_ZONES, JSON.stringify(zones));
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getSettings(): StoreSettings {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: StoreSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getAuditLogs(): AdminAuditLog[] {
    const raw = localStorage.getItem(KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AdminAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  getLanguage(): 'en' | 'bn' {
    const raw = localStorage.getItem(KEYS.LANGUAGE);
    if (!raw) return 'en'; // Default to English as requested
    return raw === 'bn' ? 'bn' : 'en';
  },

  saveLanguage(lang: 'en' | 'bn'): void {
    localStorage.setItem(KEYS.LANGUAGE, lang);
  },
};

/**
 * Robust pricing calculations respecting wholesale bulk rules and coupon limits
 */
export function calculateCartItemPrice(product: Product, quantity: number, variantPriceDelta: number = 0): {
  unitPrice: number;
  totalBeforeWholesale: number;
  wholesaleSavings: number;
  totalAfterWholesale: number;
} {
  const baseUnitPrice = product.salePrice + variantPriceDelta;
  let activeUnitPrice = baseUnitPrice;
  let wholesaleSavings = 0;

  if (product.isWholesaleAvailable && product.wholesaleTiers && product.wholesaleTiers.length > 0) {
    // Sort descending by minQty to find the highest matching tier
    const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
    const matchedTier = sortedTiers.find((tier) => quantity >= tier.minQty);

    if (matchedTier) {
      activeUnitPrice = matchedTier.pricePerUnit + variantPriceDelta;
      wholesaleSavings = (baseUnitPrice - activeUnitPrice) * quantity;
    }
  }

  return {
    unitPrice: activeUnitPrice,
    totalBeforeWholesale: baseUnitPrice * quantity,
    wholesaleSavings,
    totalAfterWholesale: activeUnitPrice * quantity,
  };
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MSB-${year}-${randomSuffix}`;
}
