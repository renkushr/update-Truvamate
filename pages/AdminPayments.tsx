import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, DollarSign, CreditCard, CheckCircle, Clock, 
  XCircle, RefreshCw, AlertCircle, Users, Wallet, BarChart3, Home, Camera, 
  HardDrive, Ticket, Image, Settings, ChevronRight, MapPin, TrendingUp, 
  TrendingDown, ArrowUpRight, ArrowDownRight, Banknote, ScanLine
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
      { name: 'การเงิน', icon: Wallet, path: '/admin/payments', badge: null, isActive: true },
      { name: 'Location Analytics', icon: MapPin, path: '/admin/location', badge: null },
    ]
  },
  {
    title: 'ตั้งค่า',
    items: [
      { name: 'Hero & Banners', icon: Image, path: '/admin', badge: null },
      { name: 'Payment Gateway', icon: CreditCard, path: '/admin/payment-settings', badge: null },
      { name: 'ตั้งราคาตั๋ว', icon: DollarSign, path: '/admin/ticket-pricing', badge: null },
      { name: 'ตั้งค่าระบบ', icon: Settings, path: '/admin/settings', badge: null },
    ]
  }
];

interface Payment {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: 'credit_card' | 'promptpay' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'purchase' | 'payout' | 'refund';
  date: string;
  transactionId: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    orderNumber: 'LTO-2025-123456',
    customerName: 'สมชาย ใจดี',
    amount: 525,
    method: 'credit_card',
    status: 'completed',
    type: 'purchase',
    date: '2025-12-10 10:30:00',
    transactionId: 'txn_abc123xyz',
  },
  {
    id: '2',
    orderNumber: 'LTO-2025-123457',
    customerName: 'สมหญิง รักสวย',
    amount: 50000,
    method: 'bank_transfer',
    status: 'completed',
    type: 'payout',
    date: '2025-12-09 14:20:00',
    transactionId: 'txn_def456uvw',
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-789012',
    customerName: 'วิชัย มั่งมี',
    amount: 2500,
    method: 'promptpay',
    status: 'pending',
    type: 'purchase',
    date: '2025-12-10 16:45:00',
    transactionId: 'txn_ghi789rst',
  },
  {
    id: '4',
    orderNumber: 'LTO-2025-123458',
    customerName: 'นภา สุขสันต์',
    amount: 175,
    method: 'credit_card',
    status: 'failed',
    type: 'purchase',
    date: '2025-12-10 18:00:00',
    transactionId: 'txn_jkl012mno',
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-555666',
    customerName: 'ประยุทธ สมหวัง',
    amount: 850,
    method: 'credit_card',
    status: 'refunded',
    type: 'refund',
    date: '2025-12-08 11:15:00',
    transactionId: 'txn_pqr345stu',
  },
  {
    id: '6',
    orderNumber: 'LTO-2025-999888',
    customerName: 'กมล ยิ้มสู้',
    amount: 3500,
    method: 'promptpay',
    status: 'completed',
    type: 'purchase',
    date: '2025-12-11 09:15:00',
    transactionId: 'txn_abc999xyz',
  },
  {
    id: '7',
    orderNumber: 'LTO-2025-777666',
    customerName: 'ธนิดา รักดี',
    amount: 1200,
    method: 'bank_transfer',
    status: 'completed',
    type: 'purchase',
    date: '2025-12-11 11:45:00',
    transactionId: 'txn_def777uvw',
  },
];

export const AdminPayments: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} />, label: 'สำเร็จ' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} />, label: 'รอดำเนินการ' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={14} />, label: 'ล้มเหลว' },
      refunded: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <RefreshCw size={14} />, label: 'คืนเงิน' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      purchase: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <ArrowUpRight size={14} />, label: 'ซื้อ' },
      payout: { bg: 'bg-green-100', text: 'text-green-800', icon: <ArrowDownRight size={14} />, label: 'จ่ายเงิน' },
      refund: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <RefreshCw size={14} />, label: 'คืนเงิน' },
    };
    const badge = badges[type as keyof typeof badges];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard size={16} className="text-blue-500" />;
      case 'promptpay': return <Banknote size={16} className="text-purple-500" />;
      case 'bank_transfer': return <DollarSign size={16} className="text-green-500" />;
      default: return <Wallet size={16} />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'credit_card': return 'บัตรเครดิต';
      case 'promptpay': return 'PromptPay';
      case 'bank_transfer': return 'โอนเงิน';
      default: return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchSearch = payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchType = filterType === 'all' || payment.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // Stats calculations
  const totalIncome = payments.filter(p => p.type === 'purchase' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPayout = payments.filter(p => p.type === 'payout' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

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
                  <Wallet className="text-brand-gold" size={28} />
                  จัดการการเงิน
                </h1>
                <p className="text-sm text-slate-500 mt-1">Payment Management - ติดตามธุรกรรมและการชำระเงิน</p>
              </div>
              <Button className="gap-2 shadow-lg">
                <Download size={18} />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">รายรับทั้งหมด</p>
                  <p className="text-2xl font-black text-green-600 mt-1">฿{totalIncome.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">จ่ายออก</p>
                  <p className="text-2xl font-black text-red-600 mt-1">฿{totalPayout.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">รอดำเนินการ</p>
                  <p className="text-3xl font-black text-yellow-600 mt-1">{pendingPayments}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">ล้มเหลว</p>
                  <p className="text-3xl font-black text-red-600 mt-1">{failedPayments}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหา Order, ชื่อลูกค้า, Transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-transparent appearance-none bg-white outline-none"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="completed">สำเร็จ</option>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="failed">ล้มเหลว</option>
                  <option value="refunded">คืนเงิน</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-transparent appearance-none bg-white outline-none"
                >
                  <option value="all">ประเภททั้งหมด</option>
                  <option value="purchase">ซื้อ</option>
                  <option value="payout">จ่ายเงิน</option>
                  <option value="refund">คืนเงิน</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ลูกค้า</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ประเภท</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ช่องทาง</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">จำนวนเงิน</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">วันที่</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-slate-900">{payment.orderNumber}</div>
                          <div className="text-xs text-slate-500 font-mono">{payment.transactionId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {payment.customerName.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{payment.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(payment.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.method)}
                          <span className="text-sm text-slate-600">{getMethodName(payment.method)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${payment.type === 'payout' || payment.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                          {payment.type === 'payout' || payment.type === 'refund' ? '-' : '+'}฿{payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{payment.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-brand-navy"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <Wallet size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">ไม่พบรายการธุรกรรม</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-brand-gold p-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">รายละเอียดธุรกรรม</h3>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-black/10 rounded-lg">
                <XCircle className="text-slate-900" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Order Number</label>
                  <div className="text-lg font-bold text-slate-900">{selectedPayment.orderNumber}</div>
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Transaction ID</label>
                <div className="text-sm font-mono text-slate-900">{selectedPayment.transactionId}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">ประเภท</label>
                  <div className="mt-1">{getTypeBadge(selectedPayment.type)}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">ช่องทาง</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getMethodIcon(selectedPayment.method)}
                    <span className="font-medium">{getMethodName(selectedPayment.method)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">จำนวนเงิน</label>
                <div className={`text-3xl font-black ${selectedPayment.type === 'payout' || selectedPayment.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedPayment.type === 'payout' || selectedPayment.type === 'refund' ? '-' : '+'}฿{selectedPayment.amount.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">ลูกค้า</label>
                <div className="text-lg font-bold text-slate-900">{selectedPayment.customerName}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">วันที่ทำรายการ</label>
                <div className="text-sm text-slate-900">{selectedPayment.date}</div>
              </div>

              {selectedPayment.status === 'pending' && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Button className="w-full bg-green-600">
                    <CheckCircle size={18} />
                    อนุมัติ
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-600">
                    <XCircle size={18} />
                    ปฏิเสธ
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
