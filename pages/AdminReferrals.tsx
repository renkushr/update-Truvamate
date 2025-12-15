import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import {
  Users, DollarSign, TrendingUp, Settings, Download, Search, Filter,
  CheckCircle, Clock, XCircle, Calendar, Mail, User, ArrowUpDown,
  RefreshCw, Edit, Save, X, Gift, Award, AlertCircle, Home,
  BarChart3, ShoppingCart, Package, CreditCard, Image, ScanLine
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  getAllReferrals,
  getReferralSettings,
  updateReferralSettings,
  markCommissionAsPaid,
  type Referral,
  type ReferralSettings
} from '../services/referralService';

export const AdminReferrals: React.FC = () => {
  const { user, showToast } = useGlobal();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'commission'>('date');
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<ReferralSettings | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState('referrals');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allReferrals, currentSettings] = await Promise.all([
        getAllReferrals(),
        getReferralSettings(),
      ]);

      setReferrals(allReferrals);
      setSettings(currentSettings);
      setTempSettings(currentSettings);
    } catch (error) {
      console.error('Error loading referral data:', error);
      showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
    }
    setLoading(false);
  };

  const handleMarkAsPaid = async (referralId: string) => {
    try {
      await markCommissionAsPaid(referralId);
      showToast('อัพเดทสถานะเรียบร้อย', 'success');
      await loadData();
    } catch (error) {
      console.error('Error marking as paid:', error);
      showToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleSaveSettings = async () => {
    if (!tempSettings) return;

    try {
      await updateReferralSettings(tempSettings);
      setSettings(tempSettings);
      setEditingSettings(false);
      showToast('บันทึกการตั้งค่าแล้ว', 'success');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const filteredReferrals = referrals
    .filter((ref) => {
      const matchesSearch =
        ref.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referredUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referrerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referredUserEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !ref.commissionPaid) ||
        (statusFilter === 'completed' && ref.commissionPaid);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.commission - a.commission;
      }
    });

  const stats = {
    total: referrals.length,
    completed: referrals.filter((r) => r.commissionPaid).length,
    pending: referrals.filter((r) => !r.commissionPaid).length,
    totalCommission: referrals.reduce((sum, r) => sum + r.commission, 0),
    paidCommission: referrals.filter((r) => r.commissionPaid).reduce((sum, r) => sum + r.commission, 0),
    pendingCommission: referrals.filter((r) => !r.commissionPaid).reduce((sum, r) => sum + r.commission, 0),
  };

  const exportToCSV = () => {
    const headers = ['วันที่', 'ผู้แนะนำ', 'อีเมล', 'เพื่อน', 'อีเมล', 'ค่าคอมมิชชั่น', 'สถานะ'];
    const rows = filteredReferrals.map((ref) => [
      new Date(ref.createdAt).toLocaleDateString('th-TH'),
      ref.referrerName,
      ref.referrerEmail,
      ref.referredUserName,
      ref.referredUserEmail,
      ref.commission,
      ref.commissionPaid ? 'จ่ายแล้ว' : 'รอจ่าย',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `referrals_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <Link to="/">
            <Button>กลับหน้าหลัก</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <RefreshCw className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black">จัดการโปรแกรมแนะนำเพื่อน</h1>
          <p className="text-purple-200 mt-1">Admin Referral Management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                <p className="font-bold">Admin Menu</p>
              </div>
              <nav className="p-2">
                <Link to="/admin">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Home size={20} />
                    <span className="font-semibold">Dashboard</span>
                  </button>
                </Link>
                <Link to="/admin/panel">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <BarChart3 size={20} />
                    <span className="font-semibold">Admin Panel</span>
                  </button>
                </Link>
                <Link to="/admin/lotto-orders">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <ShoppingCart size={20} />
                    <span className="font-semibold">คำสั่งซื้อล็อตโต้</span>
                  </button>
                </Link>
                <Link to="/admin/users">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Users size={20} />
                    <span className="font-semibold">จัดการผู้ใช้</span>
                  </button>
                </Link>
                <Link to="/admin/payments">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <CreditCard size={20} />
                    <span className="font-semibold">ตรวจสอบการชำระเงิน</span>
                  </button>
                </Link>
                <Link to="/admin/payment-settings">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Settings size={20} />
                    <span className="font-semibold">ตั้งค่าการชำระเงิน</span>
                  </button>
                </Link>
                <Link to="/admin/ticket-pricing">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Package size={20} />
                    <span className="font-semibold">ตั้งค่าราคาตั๋ว</span>
                  </button>
                </Link>
                <Link to="/admin/settings">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Settings size={20} />
                    <span className="font-semibold">ตั้งค่าทั่วไป</span>
                  </button>
                </Link>
                <Link to="/admin/photo-upload">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Image size={20} />
                    <span className="font-semibold">อัพโหลดรูป</span>
                  </button>
                </Link>
                <Link to="/admin/drive-photos">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <Image size={20} />
                    <span className="font-semibold">รูปจาก Drive</span>
                  </button>
                </Link>
                <Link to="/admin/ocr-scanner">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-slate-100 text-slate-700">
                    <ScanLine size={20} />
                    <span className="font-semibold">OCR สแกนตั๋ว</span>
                  </button>
                </Link>
                <Link to="/admin/referrals">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl bg-purple-100 text-purple-700">
                    <Gift size={20} />
                    <span className="font-semibold">โปรแกรมแนะนำเพื่อน</span>
                  </button>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-500" size={24} />
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Total
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500 mt-1">Referrals ทั้งหมด</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">฿{stats.paidCommission.toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">จ่ายแล้ว ({stats.completed})</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-orange-500" size={24} />
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">฿{stats.pendingCommission.toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">รอจ่าย ({stats.pending})</p>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="text-purple-500" size={24} />
                  ตั้งค่าโปรแกรม
                </h2>
                {!editingSettings && (
                  <Button onClick={() => setEditingSettings(true)} variant="outline" size="sm">
                    <Edit size={16} />
                    แก้ไข
                  </Button>
                )}
              </div>

              {editingSettings && tempSettings ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.commissionRate}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, commissionRate: parseFloat(e.target.value) })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Min Order Value (฿)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.minOrderValue}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, minOrderValue: parseFloat(e.target.value) })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Max Commission (฿)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.maxCommission}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, maxCommission: parseFloat(e.target.value) })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                      <Save size={16} />
                      บันทึก
                    </Button>
                    <Button onClick={() => {
                      setEditingSettings(false);
                      setTempSettings(settings);
                    }} variant="outline">
                      <X size={16} />
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Award className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">{settings?.commissionRate}%</p>
                      <p className="text-sm text-slate-500">Commission Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">฿{settings?.minOrderValue}</p>
                      <p className="text-sm text-slate-500">Min Order</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">฿{settings?.maxCommission}</p>
                      <p className="text-sm text-slate-500">Max Commission</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Referrals ({filteredReferrals.length})</h2>
                  <div className="flex gap-2">
                    <Button onClick={loadData} variant="outline" size="sm">
                      <RefreshCw size={16} />
                    </Button>
                    <Button onClick={exportToCSV} variant="outline" size="sm">
                      <Download size={16} />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อ, อีเมล..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="pending">รอจ่าย</option>
                    <option value="completed">จ่ายแล้ว</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date">วันที่</option>
                    <option value="commission">ค่าคอมมิชชั่น</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">วันที่</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">ผู้แนะนำ</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">เพื่อนที่แนะนำ</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">ค่าคอมมิชชั่น</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">สถานะ</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} />
                            {new Date(referral.createdAt).toLocaleDateString('th-TH')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{referral.referrerName}</p>
                            <p className="text-sm text-slate-500">{referral.referrerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{referral.referredUserName}</p>
                            <p className="text-sm text-slate-500">{referral.referredUserEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">฿{referral.commission.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          {referral.commissionPaid ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              <CheckCircle size={14} />
                              จ่ายแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                              <Clock size={14} />
                              รอจ่าย
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {!referral.commissionPaid && (
                            <Button
                              onClick={() => handleMarkAsPaid(referral.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={14} />
                              จ่ายเงิน
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredReferrals.length === 0 && (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">ไม่พบข้อมูล</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReferrals;
