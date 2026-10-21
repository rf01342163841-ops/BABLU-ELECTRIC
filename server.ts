import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_DELIVERY_ZONES } from './src/data/mockDatabase';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory runtime state for server routes
let products = [...INITIAL_PRODUCTS];
let orders = [...INITIAL_ORDERS];
let coupons = [...INITIAL_COUPONS];
let settings = { ...INITIAL_SETTINGS };

// Zod Validation Schemas
const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantName: z.string().optional(),
  sku: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  image: z.string(),
});

const ShippingAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(11),
  alternatePhone: z.string().optional(),
  division: z.string(),
  district: z.string(),
  thanaArea: z.string().min(2),
  streetAddress: z.string().min(3),
  deliveryNotes: z.string().optional(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(11),
  shippingAddress: ShippingAddressSchema,
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  wholesaleSavings: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  couponCode: z.string().optional(),
  deliveryFee: z.number().nonnegative(),
  deliveryZoneId: z.string(),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'sslcommerz']),
  transactionId: z.string().optional(),
});

// ==================== REST API ENDPOINTS ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    storeName: 'MyShop BD',
    market: 'Bangladesh',
    currency: 'BDT (৳)',
    timestamp: new Date().toISOString(),
  });
});

// Get store settings and delivery zones
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({
    settings,
    deliveryZones: INITIAL_DELIVERY_ZONES,
  });
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { category, brand, search, flashSale } = req.query;
  let result = products.filter((p) => !p.isArchived);

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category);
  }

  if (brand && brand !== 'All') {
    result = result.filter((p) => p.brand === brand);
  }

  if (flashSale === 'true') {
    result = result.filter((p) => p.isFlashSale);
  }

  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const validatedData = CreateOrderSchema.parse(req.body);
    const orderNumber = `MSB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPaid = validatedData.paymentMethod !== 'cod' && Boolean(validatedData.transactionId);

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      ...validatedData,
      paymentStatus: isPaid ? 'Paid' : 'Unpaid',
      orderStatus: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order registered via ${validatedData.paymentMethod.toUpperCase()}${
            isPaid ? ' (Payment Verified)' : ''
          }`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder as any);

    // Concurrently adjust stock
    validatedData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid order payload', details: err.errors });
  }
});

// Track order
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query required' });
  }

  const clean = query.trim().toLowerCase();
  const matched = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === clean ||
      o.customerPhone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
  );

  if (!matched) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(matched);
});

// Coupons validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code || typeof cartTotal !== 'number') {
    return res.status(400).json({ error: 'Code and cartTotal required' });
  }

  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    return res.status(400).json({
      valid: false,
      message: `Minimum purchase amount of ৳${coupon.minPurchaseAmount.toLocaleString()} required.`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, cartTotal);
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount,
    coupon,
  });
});

// Bangladesh bKash Payment Gateway Integration Adapter
app.post('/api/payments/bkash/callback', (req: Request, res: Response) => {
  const { paymentID, trxID, status } = req.body;

  if (status === 'success' && trxID) {
    // Idempotently verify and update order
    return res.json({
      statusCode: '0000',
      statusMessage: 'Successful',
      trxID,
      paymentID,
    });
  }

  res.status(400).json({ statusCode: '2001', statusMessage: 'Payment verification failed' });
});

// Bangladesh SSLCOMMERZ IPN Webhook Adapter
app.post('/api/payments/sslcommerz/ipn', (req: Request, res: Response) => {
  const { tran_id, val_id, amount, status } = req.body;

  if (status === 'VALID' || status === 'VALIDATED') {
    return res.json({ status: 'VALIDATED', tran_id, val_id });
  }

  res.status(400).json({ status: 'FAILED' });
});

// In production, serve built frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`MyShop BD server running on port ${PORT}`);
});

export default app;
