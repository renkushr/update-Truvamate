import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DollarSign, Save, Plus, Trash2, Edit2, CheckCircle, AlertTriangle,
  BarChart3, Home, Settings, Camera, HardDrive, MapPin, Ticket, Users, Wallet,
  ChevronRight, Image, CreditCard, Calendar, Percent, Tag, TrendingUp,
  Clock, Globe, Calculator, Info, ScanLine
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Sidebar Menu Items
const MENU_SECTIONS = [
  {
    title: 'หลัก',
    items: [
      { name: 'Dashboard', icon: BarChart3, path: '/admin/dashboard', badge: null },
      { name: 'กลับหน้าหลัก', icon: Home, path: '/', badge: null },
    ]
  },
  {
    title: 'จัดการหวย',
    items: [
      { name: 'คำสั่งซื้อหวย', icon: Ticket, path: '/admin/lotto-orders', badge: '12' },
      { name: 'รูปตั๋ว (Google Photos)', icon: Camera, path: '/admin/photo-upload', badge: null },
      { name: 'รูปตั๋ว (Google Drive)', icon: HardDrive, path: '/admin/drive-photos', badge: null },
      { name: 'OCR สแกนตั๋ว', icon: ScanLine, path: '/admin/ocr-scanner', badge: 'New' },
    ]
  },
  {
    title: 'จัดการระบบ',
    items: [
      { name: 'ผู้ใช้งาน', icon: Users, path: '/admin/users', badge: '3' },
      { name: 'การเงิน', icon: Wallet, path: '/admin/payments', badge: null },
      { name: 'Location Analytics', icon: MapPin, path: '/admin/location', badge: null },
    ]
  },
  {
    title: 'ตั้งค่า',
    items: [
      { name: 'Hero & Banners', icon: Image, path: '/admin', badge: null },
      { name: 'Payment Gateway', icon: CreditCard, path: '/admin/payment-settings', badge: null },
      { name: 'ตั้งราคาตั๋ว', icon: DollarSign, path: '/admin/ticket-pricing', badge: null, isActive: true },
      { name: 'ตั้งค่าระบบ', icon: Settings, path: '/admin/settings', badge: null },
    ]
  }
];

interface LottoProduct {
  id: string;
  name: string;
  nameTH: string;
  logo: string;
  pricePerLine: number; // USD
  serviceFee: number; // USD
  minLines: number;
  maxLines: number;
  drawDays: string[];
  jackpotEstimate: string;
  enabled: boolean;
  popular: boolean;
  promotionDiscount: number; // percent
  promotionEndDate: string | null;
}

interface BundlePackage {
  id: string;
  name: string;
  lottoId: string;
  lines: number;
  originalPrice: number;
  discountPrice: number;
  savings: number;
  badge: string | null;
  enabled: boolean;
}

export const AdminTicketPricing: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // Exchange Rate
  const [exchangeRate, setExchangeRate] = useState(35.50);

  // Lotto Products
  const [lottoProducts, setLottoProducts] = useState<LottoProduct[]>([
    {
      id: 'powerball',
      name: 'Powerball',
      nameTH: 'พาวเวอร์บอล',
      logo: '🔴',
      pricePerLine: 2.00,
      serviceFee: 3.00,
      minLines: 1,
      maxLines: 50,
      drawDays: ['Monday', 'Wednesday', 'Saturday'],
      jackpotEstimate: '$500 Million',
      enabled: true,
      popular: true,
      promotionDiscount: 0,
      promotionEndDate: null,
    },
    {
      id: 'megamillions',
      name: 'Mega Millions',
      nameTH: 'เมกามิลเลียนส์',
      logo: '🟡',
      pricePerLine: 2.00,
      serviceFee: 3.00,
      minLines: 1,
      maxLines: 50,
      drawDays: ['Tuesday', 'Friday'],
      jackpotEstimate: '$350 Million',
      enabled: true,
      popular: true,
      promotionDiscount: 10,
      promotionEndDate: '2025-12-31',
    },
    {
      id: 'euromillions',
      name: 'EuroMillions',
      nameTH: 'ยูโรมิลเลียนส์',
      logo: '🔵',
      pricePerLine: 2.50,
      serviceFee: 3.50,
      minLines: 1,
      maxLines: 30,
      drawDays: ['Tuesday', 'Friday'],
      jackpotEstimate: '€180 Million',
      enabled: true,
      popular: false,
      promotionDiscount: 0,
      promotionEndDate: null,
    },
    {
      id: 'eurojackpot',
      name: 'EuroJackpot',
      nameTH: 'ยูโรแจ็คพอต',
      logo: '🟠',
      pricePerLine: 2.00,
      serviceFee: 3.00,
      minLines: 1,
      maxLines: 30,
      drawDays: ['Tuesday', 'Friday'],
      jackpotEstimate: '€90 Million',
      enabled: true,
      popular: false,
      promotionDiscount: 0,
      promotionEndDate: null,
    },
    {
      id: 'uklotto',
      name: 'UK Lotto',
      nameTH: 'ยูเคล็อตโต้',
      logo: '🟢',
      pricePerLine: 2.50,
      serviceFee: 2.50,
      minLines: 1,
      maxLines: 20,
      drawDays: ['Wednesday', 'Saturday'],
      jackpotEstimate: '£10 Million',
      enabled: false,
      popular: false,
      promotionDiscount: 0,
      promotionEndDate: null,
    },
  ]);

  // Bundle Packages
  const [bundles, setBundles] = useState<BundlePackage[]>([
    {
      id: 'pb-3',
      name: 'Powerball 3 Lines',
      lottoId: 'powerball',
      lines: 3,
      originalPrice: 15.00,
      discountPrice: 13.50,
      savings: 10,
      badge: null,
      enabled: true,
    },
    {
      id: 'pb-5',
      name: 'Powerball 5 Lines',
      lottoId: 'powerball',
      lines: 5,
      originalPrice: 25.00,
      discountPrice: 21.25,
      savings: 15,
      badge: 'Best Value',
      enabled: true,
    },
    {
      id: 'pb-10',
      name: 'Powerball 10 Lines',
      lottoId: 'powerball',
      lines: 10,
      originalPrice: 50.00,
      discountPrice: 40.00,
      savings: 20,
      badge: 'Most Popular',
      enabled: true,
    },
    {
      id: 'mm-3',
      name: 'Mega Millions 3 Lines',
      lottoId: 'megamillions',
      lines: 3,
      originalPrice: 15.00,
      discountPrice: 13.50,
      savings: 10,
      badge: null,
      enabled: true,
    },
    {
      id: 'mm-5',
      name: 'Mega Millions 5 Lines',
      lottoId: 'megamillions',
      lines: 5,
      originalPrice: 25.00,
      discountPrice: 21.25,
      savings: 15,
      badge: 'Hot Deal',
      enabled: true,
    },
  ]);

  // Service Fee Settings
  const [feeSettings, setFeeSettings] = useState({
    baseServiceFee: 3.00,
    expressProcessingFee: 5.00,
    subscriptionDiscount: 15, // percent off for subscriptions
    firstTimeDiscount: 20, // percent off for first purchase
    referralDiscount: 10, // percent off when referred
  });

  const calculateTHB = (usd: number) => (usd * exchangeRate).toFixed(2);

  const updateProduct = (id: string, field: keyof LottoProduct, value: any) => {
    setLottoProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    setIsSaved(false);
  };

  const addBundle = () => {
    const newBundle: BundlePackage = {
      id: `bundle-${Date.now()}`,
      name: 'New Bundle',
      lottoId: 'powerball',
      lines: 3,
      originalPrice: 15.00,
      discountPrice: 13.50,
      savings: 10,
      badge: null,
      enabled: true,
    };
    setBundles(prev => [...prev, newBundle]);
    setIsSaved(false);
  };

  const removeBundle = (id: string) => {
    if (window.confirm('ต้องการลบ Bundle นี้หรือไม่?')) {
      setBundles(prev => prev.filter(b => b.id !== id));
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-white fixed left-0 top-0 h-full overflow-y-auto transition-all duration-300 z-40 flex flex-col`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-gold rounded-lg flex items-center justify-center font-black text-slate-900 text-lg">
              T
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-xl font-black tracking-tighter text-brand-gold uppercase">Truvamate</h2>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!sidebarCollapsed && (
                <div className="px-6 mb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">{section.title}</span>
                </div>
              )}
              <div className="space-y-1 px-3">
                {section.items.map((item, itemIndex) => {
                  const isActive = item.isActive || location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-brand-gold text-slate-900 font-bold' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-sm">{item.name}</span>
                          {item.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              item.badge === 'New' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors w-full"
          >
            <ChevronRight size={18} className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span className="text-sm">ย่อเมนู</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Ticket className="text-brand-gold" size={28} />
                  ตั้งราคาตั๋ว Lotto
                </h1>
                <p className="text-sm text-slate-500 mt-1">จัดการราคาและโปรโมชั่นตั๋วหวยต่างประเทศ</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Exchange Rate */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <Globe size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-600">1 USD =</span>
                  <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold text-center"
                  />
                  <span className="text-sm text-slate-600">THB</span>
                </div>
                <Button onClick={handleSave} className="gap-2 shadow-lg" disabled={isSaved}>
                  <Save size={18} /> {isSaved ? 'บันทึกแล้ว!' : 'บันทึก'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Ticket className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">สินค้าที่เปิดขาย</p>
                  <p className="text-xl font-black text-slate-900">
                    {lottoProducts.filter(p => p.enabled).length} / {lottoProducts.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bundles ที่เปิด</p>
                  <p className="text-xl font-black text-slate-900">
                    {bundles.filter(b => b.enabled).length} / {bundles.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Percent className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">โปรโมชั่นใช้งาน</p>
                  <p className="text-xl font-black text-slate-900">
                    {lottoProducts.filter(p => p.promotionDiscount > 0).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">ค่าบริการเฉลี่ย</p>
                  <p className="text-xl font-black text-slate-900">
                    ${feeSettings.baseServiceFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lotto Products */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="text-red-500" size={20} />
                สินค้า Lotto ต่างประเทศ
              </h2>
              <p className="text-sm text-slate-500 mt-1">ตั้งราคา ค่าบริการ และโปรโมชั่น</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">สินค้า</th>
                    <th className="px-4 py-4">ราคา/Line (USD)</th>
                    <th className="px-4 py-4">ราคา (THB)</th>
                    <th className="px-4 py-4">ค่าบริการ</th>
                    <th className="px-4 py-4">Min-Max Lines</th>
                    <th className="px-4 py-4">โปรโมชั่น</th>
                    <th className="px-4 py-4">สถานะ</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lottoProducts.map((product) => (
                    <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${!product.enabled ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.logo}</span>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              {product.name}
                              {product.popular && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">🔥 Popular</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{product.nameTH}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {product.drawDays.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={product.pricePerLine}
                          onChange={(e) => updateProduct(product.id, 'pricePerLine', parseFloat(e.target.value))}
                          step="0.01"
                          className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm font-mono text-center"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-green-600">
                          ฿{calculateTHB(product.pricePerLine)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={product.serviceFee}
                          onChange={(e) => updateProduct(product.id, 'serviceFee', parseFloat(e.target.value))}
                          step="0.01"
                          className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm font-mono text-center"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={product.minLines}
                            onChange={(e) => updateProduct(product.id, 'minLines', parseInt(e.target.value))}
                            className="w-12 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-center"
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type="number"
                            value={product.maxLines}
                            onChange={(e) => updateProduct(product.id, 'maxLines', parseInt(e.target.value))}
                            className="w-12 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-center"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={product.promotionDiscount}
                            onChange={(e) => updateProduct(product.id, 'promotionDiscount', parseInt(e.target.value))}
                            className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm text-center"
                          />
                          <span className="text-xs text-slate-500">%</span>
                        </div>
                        {product.promotionDiscount > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            ลด {product.promotionDiscount}%
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => updateProduct(product.id, 'enabled', !product.enabled)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            product.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {product.enabled ? 'เปิด' : 'ปิด'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateProduct(product.id, 'popular', !product.popular)}
                            className={`p-1.5 rounded-lg ${
                              product.popular
                                ? 'bg-red-100 text-red-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                            title="Popular"
                          >
                            <TrendingUp size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bundle Packages */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="text-purple-500" size={20} />
                  Bundle Packages
                </h2>
                <p className="text-sm text-slate-500 mt-1">แพ็คเกจราคาพิเศษ</p>
              </div>
              <Button size="sm" onClick={addBundle} className="gap-2">
                <Plus size={16} /> เพิ่ม Bundle
              </Button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundles.map((bundle) => {
                const lotto = lottoProducts.find(p => p.id === bundle.lottoId);
                return (
                  <div key={bundle.id} className={`border rounded-xl p-4 relative ${
                    bundle.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
                  }`}>
                    {bundle.badge && (
                      <span className="absolute -top-2 -right-2 text-xs px-2 py-1 bg-red-500 text-white rounded-full font-bold">
                        {bundle.badge}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{lotto?.logo || '🎫'}</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={bundle.name}
                          onChange={(e) => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, name: e.target.value } : b
                            ));
                          }}
                          className="font-bold text-slate-900 bg-transparent border-none outline-none w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-slate-500">Lines</label>
                        <input
                          type="number"
                          value={bundle.lines}
                          onChange={(e) => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, lines: parseInt(e.target.value) } : b
                            ));
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Lotto</label>
                        <select
                          value={bundle.lottoId}
                          onChange={(e) => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, lottoId: e.target.value } : b
                            ));
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm"
                        >
                          {lottoProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-slate-500">ราคาเต็ม ($)</label>
                        <input
                          type="number"
                          value={bundle.originalPrice}
                          onChange={(e) => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, originalPrice: parseFloat(e.target.value) } : b
                            ));
                          }}
                          step="0.01"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm line-through text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">ราคาขาย ($)</label>
                        <input
                          type="number"
                          value={bundle.discountPrice}
                          onChange={(e) => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, discountPrice: parseFloat(e.target.value) } : b
                            ));
                          }}
                          step="0.01"
                          className="w-full bg-green-50 border border-green-200 rounded px-2 py-1 text-sm font-bold text-green-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          ประหยัด {bundle.savings}%
                        </span>
                        <span className="text-xs text-slate-500">
                          ≈ ฿{calculateTHB(bundle.discountPrice)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setBundles(prev => prev.map(b => 
                              b.id === bundle.id ? { ...b, enabled: !b.enabled } : b
                            ));
                          }}
                          className={`p-1.5 rounded ${
                            bundle.enabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => removeBundle(bundle.id)}
                          className="p-1.5 rounded bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fee Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Calculator className="text-blue-500" size={20} />
                ค่าบริการและค่าธรรมเนียม
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ค่าบริการพื้นฐาน ($)</label>
                    <input
                      type="number"
                      value={feeSettings.baseServiceFee}
                      onChange={(e) => setFeeSettings(prev => ({ ...prev, baseServiceFee: parseFloat(e.target.value) }))}
                      step="0.01"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ค่า Express Processing ($)</label>
                    <input
                      type="number"
                      value={feeSettings.expressProcessingFee}
                      onChange={(e) => setFeeSettings(prev => ({ ...prev, expressProcessingFee: parseFloat(e.target.value) }))}
                      step="0.01"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Percent className="text-green-500" size={20} />
                ส่วนลดอัตโนมัติ
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subscription (%)</label>
                    <input
                      type="number"
                      value={feeSettings.subscriptionDiscount}
                      onChange={(e) => setFeeSettings(prev => ({ ...prev, subscriptionDiscount: parseInt(e.target.value) }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ซื้อครั้งแรก (%)</label>
                    <input
                      type="number"
                      value={feeSettings.firstTimeDiscount}
                      onChange={(e) => setFeeSettings(prev => ({ ...prev, firstTimeDiscount: parseInt(e.target.value) }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Referral (%)</label>
                    <input
                      type="number"
                      value={feeSettings.referralDiscount}
                      onChange={(e) => setFeeSettings(prev => ({ ...prev, referralDiscount: parseInt(e.target.value) }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Calculator Preview */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Info className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">💰 ตัวอย่างราคาที่ลูกค้าจ่าย</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {lottoProducts.filter(p => p.enabled).slice(0, 3).map(product => {
                    const linesCount = 5;
                    const basePrice = product.pricePerLine * linesCount;
                    const serviceFee = product.serviceFee;
                    const discount = product.promotionDiscount > 0 ? (basePrice * product.promotionDiscount / 100) : 0;
                    const totalUSD = basePrice + serviceFee - discount;
                    const totalTHB = totalUSD * exchangeRate;
                    
                    return (
                      <div key={product.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span>{product.logo}</span>
                          <span className="font-bold">{product.name}</span>
                          <span className="text-xs opacity-75">x{linesCount} lines</span>
                        </div>
                        <div className="text-sm opacity-90 space-y-1">
                          <div className="flex justify-between">
                            <span>ค่าตั๋ว:</span>
                            <span>${basePrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ค่าบริการ:</span>
                            <span>${serviceFee.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-green-200">
                              <span>ส่วนลด ({product.promotionDiscount}%):</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg border-t border-white/20 pt-2 mt-2">
                            <span>รวม:</span>
                            <span>฿{totalTHB.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminTicketPricing;
