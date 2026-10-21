import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  X,
  Search,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus, Product, Coupon, PaymentStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    t,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    storeSettings,
    updateStoreSettings,
    auditLogs,
    currentUser,
    logout,
    activeModal,
    setActiveModal,
    setSelectedOrderForInvoice,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'coupons' | 'settings' | 'audit'
  >('overview');

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [productSearch, setProductSearch] = useState('');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<any | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('Pending');
  const [orderStatusNote, setOrderStatusNote] = useState('');

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics & Gadgets');
  const [newProdBrand, setNewProdBrand] = useState('Nova Audio');
  const [newProdRegularPrice, setNewProdRegularPrice] = useState(2500);
  const [newProdSalePrice, setNewProdSalePrice] = useState(1950);
  const [newProdCostPrice, setNewProdCostPrice] = useState(1300);
  const [newProdStock, setNewProdStock] = useState(30);
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/product_wireless_earbuds_1792578094066.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdIsFlashSale, setNewProdIsFlashSale] = useState(false);

  // Add Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(1000);

  // Settings State
  const [editStoreName, setEditStoreName] = useState(storeSettings.storeName);
  const [editHotline, setEditHotline] = useState(storeSettings.hotline);
  const [editAnnouncement, setEditAnnouncement] = useState(storeSettings.announcementText);
  const [editFreeDeliveryThreshold, setEditFreeDeliveryThreshold] = useState(
    storeSettings.freeDeliveryThreshold
  );

  if (activeModal !== 'admin_dashboard') return null;

  // Authorization check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900/80 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-neutral-900">Admin Authorization Required</h3>
          <p className="text-xs text-neutral-600">
            Please log in with verified administrator credentials to access this portal.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-xs font-semibold bg-neutral-100 rounded-lg text-neutral-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setActiveModal('admin_login')}
              className="px-4 py-2 text-xs font-semibold bg-neutral-900 rounded-lg text-white"
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(orders.reduce((acc, o) => acc + o.totalAmount, 0) / totalOrdersCount) : 0;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'All' ? true : o.orderStatus === orderStatusFilter
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) return;

    addProduct({
      name: newProdName,
      nameBn: newProdNameBn || newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: newProdSku.toUpperCase(),
      category: newProdCategory,
      categoryBn: newProdCategory,
      brand: newProdBrand,
      regularPrice: Number(newProdRegularPrice),
      salePrice: Number(newProdSalePrice),
      costPrice: Number(newProdCostPrice),
      stock: Number(newProdStock),
      images: [newProdImage],
      description: newProdDesc || 'Premium curated Bangladeshi product.',
      descriptionBn: 'উচ্চমানের কিউরেটেড পণ্য।',
      isFlashSale: newProdIsFlashSale,
      isWholesaleAvailable: true,
      wholesaleTiers: [
        { minQty: 5, discountPercentage: 10, pricePerUnit: Math.round(newProdSalePrice * 0.9) },
        { minQty: 10, discountPercentage: 18, pricePerUnit: Math.round(newProdSalePrice * 0.82) },
      ],
      featured: true,
    });

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdSku('');
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minPurchaseAmount: Number(newCouponMinSpend),
      expiresAt: '2026-12-31',
      isActive: true,
    });

    setNewCouponCode('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      storeName: editStoreName,
      hotline: editHotline,
      announcementText: editAnnouncement,
      freeDeliveryThreshold: Number(editFreeDeliveryThreshold),
    });
  };

  const handleExportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Division', 'Items', 'Total BDT', 'Payment Method', 'Payment Status', 'Fulfillment Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerPhone,
      o.shippingAddress.division,
      o.items.length,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `myshopbd_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV successfully.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl h-[94vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        
        {/* Admin Navigation Top Header */}
        <header className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">MyShop BD Control Center</span>
              <span className="text-neutral-400 text-xs block">
                Logged in: {currentUser.email} (Super Admin)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportOrdersCSV}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {t.exitAdmin}
            </button>
          </div>
        </header>

        {/* Dashboard Shell with Sidebar + Main View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar */}
          <aside className="w-56 bg-neutral-50 border-r border-neutral-200 p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Manager</span>
              </div>
              <span className="font-mono text-[11px] bg-neutral-200 text-neutral-800 px-1.5 rounded">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'products' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Products & Stock</span>
              </div>
              <span className="font-mono text-[11px] bg-neutral-200 text-neutral-800 px-1.5 rounded">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'coupons' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Promos</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'audit' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
          </aside>

          {/* Main Content View */}
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Store Analytics & Operational KPIs</h2>
                  <p className="text-xs text-neutral-500">Live sales performance for Bangladesh operations.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-neutral-500">Verified Revenue</span>
                    <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                      ৳{totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">From verified payments</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-neutral-500">Total Orders</span>
                    <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                      {totalOrdersCount}
                    </div>
                    <span className="text-[10px] text-neutral-500">Nationwide across 64 districts</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-neutral-500">Avg. Order Value (AOV)</span>
                    <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                      ৳{averageOrderValue.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-neutral-500">Includes wholesale bulk orders</span>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-amber-50/40 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-amber-800">Low Stock Alerts</span>
                    <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
                      {lowStockProducts.length}
                    </div>
                    <span className="text-[10px] text-amber-700 font-medium">Items under 15 units</span>
                  </div>
                </div>

                {/* Low Stock Warning List */}
                {lowStockProducts.length > 0 && (
                  <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Inventory Restock Needed:</span>
                    </div>
                    <div className="divide-y divide-amber-200/60">
                      {lowStockProducts.map((p) => (
                        <div key={p.id} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-neutral-900">{p.name}</span>
                            <span className="text-neutral-500 ml-2 font-mono text-[11px]">(SKU: {p.sku})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-amber-800 text-xs">
                              {p.stock} units remaining
                            </span>
                            <button
                              onClick={() => {
                                updateProduct(p.id, { stock: p.stock + 50 });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-amber-300 rounded shadow-xs hover:bg-amber-100"
                            >
                              Quick Restock +50
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Fulfillment & Orders Queue</h2>
                    <p className="text-xs text-neutral-500">Inspect, update states, and dispatch courier packages.</p>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-medium">
                    {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          orderStatusFilter === st
                            ? 'bg-white text-neutral-900 font-bold shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Area</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Fulfillment</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-mono font-bold text-neutral-900">
                            {order.orderNumber}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-neutral-900">{order.customerName}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="p-3 text-neutral-600">
                            {order.shippingAddress.thanaArea}, {order.shippingAddress.division}
                          </td>
                          <td className="p-3 font-mono font-bold tabular-nums">
                            ৳{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold uppercase text-[11px] block text-neutral-800">
                              {order.paymentMethod}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(order);
                                setNewOrderStatus(order.orderStatus);
                              }}
                              className="px-2.5 py-1 bg-neutral-900 text-white rounded text-[11px] font-semibold hover:bg-neutral-800"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrderForInvoice(order);
                                setActiveModal('order_confirmed');
                              }}
                              className="px-2.5 py-1 bg-white border border-neutral-200 rounded text-[11px] font-semibold hover:bg-neutral-100"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit Order Status Popup */}
                {selectedOrderForEdit && (
                  <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-5 max-w-md w-full space-y-4 border border-neutral-200 shadow-xl">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-neutral-900">
                          Update Order: {selectedOrderForEdit.orderNumber}
                        </h3>
                        <button onClick={() => setSelectedOrderForEdit(null)}>
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">New Fulfillment Status:</label>
                          <select
                            value={newOrderStatus}
                            onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                            className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Return Requested">Return Requested</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">Status Note / Tracking ID:</label>
                          <input
                            type="text"
                            placeholder="e.g. Dispatched with Steadfast Courier #SF8192"
                            value={orderStatusNote}
                            onChange={(e) => setOrderStatusNote(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForEdit(null)}
                            className="px-3 py-1.5 rounded text-neutral-600 hover:bg-neutral-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(selectedOrderForEdit.id, newOrderStatus, orderStatusNote);
                              setSelectedOrderForEdit(null);
                              setOrderStatusNote('');
                            }}
                            className="px-4 py-1.5 bg-neutral-900 text-white rounded font-semibold hover:bg-neutral-800"
                          >
                            Save Status Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Catalog & Inventory Controller</h2>
                    <p className="text-xs text-neutral-500">Manage SKUs, retail & wholesale pricing, and stock.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search SKU or Product..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="text-xs p-2 pl-7 rounded-lg border border-neutral-300 w-48 focus:outline-hidden"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Products Table */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Flash Sale</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                              />
                              <div>
                                <div className="font-semibold text-neutral-900 max-w-xs truncate">{p.name}</div>
                                <div className="text-[10px] text-neutral-400 font-medium">{p.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-neutral-600">{p.category}</td>
                          <td className="p-3 font-mono text-neutral-700">{p.sku}</td>
                          <td className="p-3 font-mono font-bold tabular-nums">
                            ৳{p.salePrice.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={p.stock}
                              onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })}
                              className="w-16 p-1 border border-neutral-300 rounded font-mono text-xs font-bold"
                            />
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => updateProduct(p.id, { isFlashSale: !p.isFlashSale })}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                p.isFlashSale ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              {p.isFlashSale ? 'Active' : 'Off'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Create Product Modal */}
                {showAddProductModal && (
                  <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
                    <form
                      onSubmit={handleCreateProductSubmit}
                      className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-neutral-200 shadow-2xl max-h-[85vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-center border-b pb-3">
                        <h3 className="font-bold text-base text-neutral-900">Add New Inventory Product</h3>
                        <button type="button" onClick={() => setShowAddProductModal(false)}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">Product Title (English) *</label>
                          <input
                            type="text"
                            required
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            placeholder="e.g. Nova Pro Studio Wireless Headset"
                            className="w-full p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">Product Title (Bengali)</label>
                          <input
                            type="text"
                            value={newProdNameBn}
                            onChange={(e) => setNewProdNameBn(e.target.value)}
                            placeholder="e.g. নোভা প্রো স্টুডিও ওয়্যারলেস হেডসেট"
                            className="w-full p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">SKU Code *</label>
                            <input
                              type="text"
                              required
                              value={newProdSku}
                              onChange={(e) => setNewProdSku(e.target.value)}
                              placeholder="NV-HD-01"
                              className="w-full p-2 border border-neutral-300 rounded-lg font-mono uppercase"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">Category</label>
                            <select
                              value={newProdCategory}
                              onChange={(e) => setNewProdCategory(e.target.value)}
                              className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                            >
                              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                              <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                              <option value="Grocery & Organic">Grocery & Organic</option>
                              <option value="Home & Living">Home & Living</option>
                              <option value="Wholesale Bundles">Wholesale Bundles</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">Selling Price (৳)</label>
                            <input
                              type="number"
                              required
                              value={newProdSalePrice}
                              onChange={(e) => setNewProdSalePrice(Number(e.target.value))}
                              className="w-full p-2 border border-neutral-300 rounded-lg font-mono"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">Regular Price (৳)</label>
                            <input
                              type="number"
                              value={newProdRegularPrice}
                              onChange={(e) => setNewProdRegularPrice(Number(e.target.value))}
                              className="w-full p-2 border border-neutral-300 rounded-lg font-mono"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-neutral-700 block mb-1">Initial Stock</label>
                            <input
                              type="number"
                              required
                              value={newProdStock}
                              onChange={(e) => setNewProdStock(Number(e.target.value))}
                              className="w-full p-2 border border-neutral-300 rounded-lg font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">Image Asset Path</label>
                          <input
                            type="text"
                            value={newProdImage}
                            onChange={(e) => setNewProdImage(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg font-mono"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-neutral-700 block mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            placeholder="Specifications and details..."
                            className="w-full p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="flashSaleCheck"
                            checked={newProdIsFlashSale}
                            onChange={(e) => setNewProdIsFlashSale(e.target.checked)}
                          />
                          <label htmlFor="flashSaleCheck" className="font-semibold text-neutral-800">
                            Feature in Flash Sale (with countdown timer)
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => setShowAddProductModal(false)}
                            className="px-3 py-1.5 rounded text-neutral-600 hover:bg-neutral-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800"
                          >
                            Save & Publish Product
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Promotional Discounts & Coupon Codes</h2>
                  <p className="text-xs text-neutral-500">Configure promotional vouchers for campaigns and Eid festivals.</p>
                </div>

                {/* Create Coupon Form */}
                <form onSubmit={handleCreateCouponSubmit} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <span className="text-xs font-bold text-neutral-900 block">Create New Discount Voucher</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-neutral-600 mb-1">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DHAKA2026"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full p-2 border rounded font-mono uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1">Discount Type</label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as any)}
                        className="w-full p-2 border rounded bg-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed BDT (৳)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1">Discount Value</label>
                      <input
                        type="number"
                        required
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(Number(e.target.value))}
                        className="w-full p-2 border rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1">Min Spend (৳)</label>
                      <input
                        type="number"
                        required
                        value={newCouponMinSpend}
                        onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                        className="w-full p-2 border rounded font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800"
                    >
                      Create Coupon
                    </button>
                  </div>
                </form>

                {/* Active Coupons List */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Min Purchase</th>
                        <th className="p-3">Times Used</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-mono font-bold text-neutral-900">{c.code}</td>
                          <td className="p-3 font-mono">
                            {c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}
                          </td>
                          <td className="p-3 font-mono">৳{c.minPurchaseAmount.toLocaleString()}</td>
                          <td className="p-3 font-mono">{c.usageCount}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteCoupon(c.id)}
                              className="text-neutral-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="max-w-xl space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Bangladesh Store Configuration</h2>
                  <p className="text-xs text-neutral-500">Configure logistics thresholds, helpline, and announcements.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Store Name</label>
                    <input
                      type="text"
                      value={editStoreName}
                      onChange={(e) => setEditStoreName(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Support Hotline</label>
                    <input
                      type="text"
                      value={editHotline}
                      onChange={(e) => setEditHotline(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Free Delivery Minimum Cart Threshold (৳)</label>
                    <input
                      type="number"
                      value={editFreeDeliveryThreshold}
                      onChange={(e) => setEditFreeDeliveryThreshold(Number(e.target.value))}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Top Announcement Bar Text</label>
                    <textarea
                      rows={2}
                      value={editAnnouncement}
                      onChange={(e) => setEditAnnouncement(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 text-xs shadow-xs"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            )}

            {/* AUDIT LOGS TAB */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Administrative Audit Trails</h2>
                  <p className="text-xs text-neutral-500">Immutable ledger of admin activities and inventory modifications.</p>
                </div>

                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-semibold uppercase text-[11px] border-b">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Admin</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target</th>
                        <th className="p-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50">
                          <td className="p-3 text-neutral-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-neutral-900 font-semibold">{log.adminEmail}</td>
                          <td className="p-3 text-amber-800 font-bold">{log.action}</td>
                          <td className="p-3 text-neutral-700">{log.target}</td>
                          <td className="p-3 text-neutral-600 font-sans">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
