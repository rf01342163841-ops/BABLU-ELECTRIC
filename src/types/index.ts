export type Language = 'en' | 'bn';

export interface WholesaleTier {
  minQty: number;
  discountPercentage: number;
  pricePerUnit: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta?: number;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  category: string;
  categoryBn: string;
  brand: string;
  sku: string;
  regularPrice: number;
  salePrice: number;
  costPrice?: number;
  stock: number;
  images: string[];
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  isWholesaleAvailable?: boolean;
  wholesaleTiers?: WholesaleTier[];
  variants?: ProductVariant[];
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  featured?: boolean;
  tags?: string[];
  isArchived?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  wholesaleDiscountApplied?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  nameBn: string;
  charge: number;
  estimatedDays: string;
  estimatedDaysBn: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'sslcommerz';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Refunded';

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  division: string;
  district: string;
  thanaArea: string;
  streetAddress: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  wholesaleSavings: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  deliveryZoneId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  orderStatus: OrderStatus;
  timeline: OrderTimelineItem[];
  createdAt: string;
  cancellationReason?: string;
  returnReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  addresses?: OrderAddress[];
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeNameBn: string;
  tagline: string;
  taglineBn: string;
  proprietor: string;
  proprietorBn: string;
  hotline: string;
  alternatePhone: string;
  telephone: string;
  email: string;
  address: string;
  addressBn: string;
  cardImage: string;
  freeDeliveryThreshold: number;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  announcementText: string;
  announcementTextBn: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}
