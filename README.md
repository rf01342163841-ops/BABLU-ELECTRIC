# MyShop BD — Full-Stack Bangladesh E-Commerce & Wholesale Platform

A complete, production-oriented e-commerce and wholesale platform inspired by the shopping experience of HT Bazar Bangladesh, crafted with modern white UI, BDT (৳) currency, bilingual English/Bengali interfaces, real-time inventory management, Cash on Delivery, and bKash / Nagad / SSLCOMMERZ payment adapters.

---

## 🌟 Key Architecture & Highlights

- **Market**: Bangladesh (`BDT ৳` currency format with tabular numerals)
- **Languages**: English and Bengali (বাংলা) with instant real-time toggle
- **Design System**: Anti-slop, clean white luxury aesthetic with zero-pill metadata discipline, high-fidelity commercial photography, and responsive layouts
- **Wholesale & B2B Engine**: Automatic bulk tier volume discounts (`Buy 5+ get ৳X/ea`, `Buy 10+ get ৳Y/ea`)
- **Flash Sale Rush**: Live countdown timer with stock allocation meters
- **Fulfillment Zones**:
  - Inside Dhaka City: ৳70 (1-2 Days Express)
  - Sub-Dhaka (Gazipur, Savar, Narayanganj): ৳100 (2-3 Days)
  - Outside Dhaka (Nationwide across 63 districts): ৳130 (3-4 Days)
  - Free Delivery threshold: Orders over ৳2,500
- **Bangladesh Payment Adapters**:
  - Cash on Delivery (COD) with delivery notes
  - bKash Merchant API & USSD workflow with Transaction ID (TrxID) verification
  - Nagad Mobile Banking
  - SSLCOMMERZ Gateway adapter
- **Admin Control Center (`/admin`)**:
  - Real-time sales KPIs & revenue metrics
  - Inventory manager (Add product, adjust stock, wholesale tiers, flash sales)
  - Order fulfillment pipeline (Pending -> Confirmed -> Processing -> Shipped -> Delivered)
  - Coupon code generator (Percentage vs Fixed BDT)
  - Administrative audit ledger & CSV export

---

## 🔐 Default Seeded Credentials

### Administrator Portal
- **URL**: Click **"Admin Portal"** in top bar or footer
- **Email**: `admin@myshopbd.com`
- **Password**: `admin123456`
- **Role**: Super Admin (full inventory & order control)

### Customer Demo Account
- **Email**: `customer@myshopbd.com`
- **Password**: `pass1234`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend API**: Node.js, Express, TypeScript, Zod Schema Validation
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Unit tests in `tests/shop.test.ts`

---

## 🚀 Quick Start Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Database Migrations & Seeding
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Run Unit Test Suite
```bash
npx tsx tests/shop.test.ts
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```
