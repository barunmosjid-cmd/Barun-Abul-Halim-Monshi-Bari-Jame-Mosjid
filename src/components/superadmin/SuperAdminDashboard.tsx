import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mosque, User, UserRole, ApprovalStatus } from '../../types';
import { formatTaka, formatDateBengali } from '../../utils/bengaliUtils';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Upload,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  Filter,
  Trash2,
  Edit3,
  Users,
  UserCheck,
  UserX,
  Plus,
  KeyRound,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  X
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onSwitchToMosqueDashboard: (masjidId: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onSwitchToMosqueDashboard
}) => {
  const {
    mosques,
    users,
    currentUser,
    getOverallStats,
    approveMosque,
    approveUser,
    getMasjidStats,
    useBengaliDigits,
    exportDataJSON,
    importDataJSON,
    deleteMosque,
    updateMosque,
    deleteUser,
    updateUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'all_mosques' | 'users' | 'backup'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // User Filter State
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | ApprovalStatus>('ALL');

  // Modals State
  const [editingMosque, setEditingMosque] = useState<Mosque | null>(null);
  const [deletingMosque, setDeletingMosque] = useState<Mosque | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Status message
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setActionAlert({ type, message });
    setTimeout(() => setActionAlert(null), 5000);
  };

  const stats = getOverallStats();
  const pendingMosques = mosques.filter(m => m.status === 'PENDING');
  const pendingUsers = users.filter(u => u.status === 'PENDING');

  const districts = Array.from(new Set(mosques.map(m => m.district).filter(Boolean)));

  const filteredMosques = mosques.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.upazila.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'ALL' || m.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearchTerm)) ||
      (u.requestedMasjidName && u.requestedMasjidName.toLowerCase().includes(userSearchTerm.toLowerCase()));

    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataJSON(content);
        if (res.success) {
          showAlert('success', res.message);
        } else {
          showAlert('error', res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Delete Mosque Handler
  const handleConfirmDeleteMosque = () => {
    if (!deletingMosque) return;
    const res = deleteMosque(deletingMosque.id);
    if (res.success) {
      showAlert('success', res.message);
    } else {
      showAlert('error', res.message);
    }
    setDeletingMosque(null);
  };

  // Save Mosque Edits Handler
  const handleSaveMosqueEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMosque) return;
    const res = updateMosque(editingMosque.id, editingMosque);
    if (res.success) {
      showAlert('success', res.message);
    } else {
      showAlert('error', res.message);
    }
    setEditingMosque(null);
  };

  // Delete User Handler
  const handleConfirmDeleteUser = () => {
    if (!deletingUser) return;
    const res = deleteUser(deletingUser.id);
    if (res.success) {
      showAlert('success', res.message);
    } else {
      showAlert('error', res.message);
    }
    setDeletingUser(null);
  };

  // Save User Edits Handler
  const handleSaveUserEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const res = updateUser(editingUser.id, editingUser);
    if (res.success) {
      showAlert('success', res.message);
    } else {
      showAlert('error', res.message);
    }
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
      {actionAlert && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm transition-all ${
            actionAlert.type === 'success'
              ? 'bg-[#FAF8F5] border border-[#2D4A3E] text-[#2D4A3E]'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#2D4A3E]" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
            <span>{actionAlert.message}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#2D4A3E] text-[#E8EDDF] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFDB95]/20 text-[#CFDB95] text-xs font-semibold mb-2.5 border border-[#CFDB95]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              কেন্দ্রীয় নিয়ন্ত্রণ ও পর্যবেক্ষণ কক্ষ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-bn tracking-wide">
              সুপার এডমিন কন্ট্রোল ড্যাশবোর্ড
            </h2>
            <p className="text-[#E8EDDF]/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              সারাদেশের সকল মসজিদ ও এডমিন নিয়ন্ত্রণ, নতুন আবেদন অনুমোদন, তথ্য এডিট, মসজিদ ও ইউজার ডিলিট এবং জাতীয় নিরীক্ষা।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDataJSON}
              className="px-4 py-2.5 rounded-full bg-[#CFDB95] hover:bg-[#b8c77b] text-[#2D4A3E] text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              জাতীয় ব্যাকআপ JSON
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mosques */}
        <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A8A8A]">মোট নিবন্ধিত মসজিদ</span>
            <div className="w-8 h-8 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#2D4A3E]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2D4A3E] mt-2 font-serif-bn">
            {formatTaka(stats.totalMosques, { useBengaliDigits, showDecimal: false }).replace('৳ ', '')} টি
          </p>
          <div className="text-[11px] text-[#5A5A40] mt-1 flex items-center gap-2">
            <span className="text-[#2D4A3E] font-semibold">{stats.approvedMosques} অনুমোদিত</span>
            <span>•</span>
            <span className="text-[#9A7E6F] font-semibold">{stats.pendingMosques} অপেক্ষমাণ</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A8A8A]">অপেক্ষমাণ অনুমোদন</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#9A7E6F]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#9A7E6F] mt-2 font-serif-bn">
            {formatTaka(pendingMosques.length + pendingUsers.length, { useBengaliDigits, showDecimal: false }).replace('৳ ', '')} টি
          </p>
          <p className="text-[11px] text-[#8A8A8A] mt-1">মসজিদ: {pendingMosques.length} • ইউজার: {pendingUsers.length}</p>
        </div>

        {/* Total Registered Users */}
        <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A8A8A]">এডমিন ও ইউজার সংখ্যা</span>
            <div className="w-8 h-8 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#2D4A3E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2D4A3E] mt-2 font-serif-bn">
            {formatTaka(stats.totalUsersCount, { useBengaliDigits, showDecimal: false }).replace('৳ ', '')} জন
          </p>
          <p className="text-[11px] text-[#8A8A8A] mt-1">সুপার এডমিন সহ সর্বমোট</p>
        </div>

        {/* Total National Balance */}
        <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A8A8A]">সার্বিক ক্যাশ ফান্ড স্থিতি</span>
            <span className="text-xs font-bold text-[#5A5A40] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E0DCCF]">স্থিতি</span>
          </div>
          <p className="text-2xl font-bold text-[#2D4A3E] mt-2 font-serif-bn">
            {formatTaka(stats.totalBalanceAll, { useBengaliDigits })}
          </p>
          <p className="text-[11px] text-[#8A8A8A] mt-1">সকল মসজিদের মিলিত ক্যাশ ও ব্যাংক</p>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex bg-[#F4F1EA] p-1.5 rounded-full text-xs font-semibold max-w-fit flex-wrap gap-1 border border-[#E0DCCF]">
        <button
          id="subtab-pending-btn"
          onClick={() => setActiveSubTab('pending')}
          className={`py-2 px-4 rounded-full transition-all flex items-center gap-2 ${
            activeSubTab === 'pending'
              ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs font-bold'
              : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
          }`}
        >
          <Clock className="w-4 h-4" />
          অপেক্ষমাণ আবেদন ({pendingMosques.length})
        </button>

        <button
          id="subtab-mosques-btn"
          onClick={() => setActiveSubTab('all_mosques')}
          className={`py-2 px-4 rounded-full transition-all flex items-center gap-2 ${
            activeSubTab === 'all_mosques'
              ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs font-bold'
              : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          মসজিদ ব্যবস্থাপনা ও ডিলিট ({mosques.length})
        </button>

        <button
          id="subtab-users-btn"
          onClick={() => setActiveSubTab('users')}
          className={`py-2 px-4 rounded-full transition-all flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs font-bold'
              : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
          }`}
        >
          <Users className="w-4 h-4" />
          এডমিন ও ইউজার নিয়ন্ত্রণ ({users.length})
        </button>

        <button
          id="subtab-backup-btn"
          onClick={() => setActiveSubTab('backup')}
          className={`py-2 px-4 rounded-full transition-all flex items-center gap-2 ${
            activeSubTab === 'backup'
              ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs font-bold'
              : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          ডাটা ব্যাকআপ ও অডিট
        </button>
      </div>

      {/* ============================================================ */}
      {/* SUBTAB 1: PENDING APPROVALS                                  */}
      {/* ============================================================ */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          {pendingMosques.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E0DCCF] p-8 text-center shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-[#2D4A3E] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                এই মুহূর্তে কোনো অপেক্ষমাণ মসজিদ বা এডমিন আবেদন নেই
              </h3>
              <p className="text-xs text-[#5A5A40] mt-1 max-w-md mx-auto">
                নতুন কোনো মসজিদ বা এডমিন রেজিস্ট্রেশন করলে তা সরাসরি এই টেবিলে প্রদর্শিত হবে এবং আপনি অনুমোদন দিতে পারবেন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMosques.map(mosque => (
                <div
                  key={mosque.id}
                  className="bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF8F5] text-[#9A7E6F] border border-[#E0DCCF]">
                        অনুমোদন অপেক্ষমাণ
                      </span>
                      <span className="text-xs text-[#8A8A8A]">কোড: {mosque.code}</span>
                      <span className="text-xs text-[#8A8A8A]">•</span>
                      <span className="text-xs text-[#8A8A8A]">
                        আবেদনের তারিখ: {formatDateBengali(mosque.createdAt, useBengaliDigits)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2D4A3E] font-serif-bn">
                      {mosque.name}
                    </h3>

                    <p className="text-xs text-[#3D3D3D]">
                      <b>অবস্থান:</b> {mosque.address}, {mosque.upazila}, {mosque.district}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#5A5A40] pt-1">
                      <div>
                        <b className="text-[#3D3D3D]">আবেদনকারী এডমিন:</b> {mosque.adminName}
                      </div>
                      <div>
                        <b className="text-[#3D3D3D]">ইমেইল:</b> {mosque.adminEmail}
                      </div>
                      <div>
                        <b className="text-[#3D3D3D]">যোগাযোগ ফোন:</b> {mosque.contactPhone}
                      </div>
                      <div>
                        <b className="text-[#3D3D3D]">প্রতিষ্ঠিত সন:</b> {mosque.establishedYear}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F4F1EA]">
                    <button
                      onClick={() => {
                        approveMosque(mosque.id, true);
                        showAlert('success', `"${mosque.name}" সফলভাবে অনুমোদন করা হয়েছে!`);
                      }}
                      className="px-4 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#CFDB95]" />
                      অনুমোদন করুন (Approve)
                    </button>

                    <button
                      onClick={() => {
                        approveMosque(mosque.id, false);
                        showAlert('error', `"${mosque.name}"-এর আবেদন বাতিল করা হয়েছে।`);
                      }}
                      className="px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-rose-50 text-rose-700 border border-[#E0DCCF] hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      বাতিল করুন
                    </button>

                    <button
                      onClick={() => setDeletingMosque(mosque)}
                      className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="আবেদনটি চিরতরে মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 2: ALL MOSQUES MANAGEMENT (WITH EDIT & DELETE)         */}
      {/* ============================================================ */}
      {activeSubTab === 'all_mosques' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="মসজিদের নাম, এডমিন, কোড বা জেলা খুঁজুন..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] text-[#3D3D3D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span className="text-xs text-[#5A5A40] font-medium">জেলা:</span>
              <select
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                className="text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] text-[#3D3D3D]"
              >
                <option value="ALL">সকল জেলা ({districts.length} টি)</option>
                {districts.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F1EA] text-[#2D4A3E] border-b border-[#E0DCCF] font-semibold">
                  <tr>
                    <th className="p-3.5">মসজিদের নাম ও অবস্থান</th>
                    <th className="p-3.5">এডমিন ও যোগাযোগ</th>
                    <th className="p-3.5 text-right">মোট জমা</th>
                    <th className="p-3.5 text-right">মোট খরচ</th>
                    <th className="p-3.5 text-right">ফান্ড স্থিতি</th>
                    <th className="p-3.5 text-center">স্ট্যাটাস</th>
                    <th className="p-3.5 text-center">কন্ট্রোল ও অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]">
                  {filteredMosques.map(m => {
                    const mStats = getMasjidStats(m.id);
                    return (
                      <tr key={m.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#2D4A3E] font-serif-bn text-sm">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-[#8A8A8A]">
                            {m.upazila}, {m.district} • কোড: <span className="font-mono font-bold text-[#2D4A3E]">{m.code}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-[#3D3D3D]">{m.adminName}</div>
                          <div className="text-[11px] text-[#8A8A8A]">{m.contactPhone}</div>
                        </td>

                        <td className="p-3.5 text-right font-semibold text-[#2D4A3E]">
                          {formatTaka(mStats.totalIncome, { useBengaliDigits })}
                        </td>

                        <td className="p-3.5 text-right font-semibold text-rose-700">
                          {formatTaka(mStats.totalExpense, { useBengaliDigits })}
                        </td>

                        <td className="p-3.5 text-right font-bold text-[#2D4A3E]">
                          {formatTaka(mStats.balance, { useBengaliDigits })}
                        </td>

                        <td className="p-3.5 text-center">
                          {m.status === 'APPROVED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CFDB95]/70 text-[#2D4A3E] border border-[#2D4A3E]/20">
                              অনুমোদিত
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-[#9A7E6F] border border-[#E0DCCF]">
                              অপেক্ষমাণ
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Inspect Dashboard */}
                            <button
                              onClick={() => onSwitchToMosqueDashboard(m.id)}
                              className="px-2.5 py-1 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] font-medium text-[11px] inline-flex items-center gap-1 transition-colors shadow-xs"
                              title="এই একক মসজিদের পৃথক ড্যাশবোর্ড ও ক্যাশবুক দেখুন"
                            >
                              <Eye className="w-3 h-3 text-[#CFDB95]" />
                              পরিদর্শন
                            </button>

                            {/* Edit Mosque */}
                            <button
                              onClick={() => setEditingMosque({ ...m })}
                              className="p-1.5 rounded-full bg-[#F4F1EA] hover:bg-[#CFDB95] text-[#2D4A3E] border border-[#E0DCCF] transition-colors"
                              title="মসজিদের নাম, ঠিকানা ও বিবরণ এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Mosque */}
                            <button
                              onClick={() => setDeletingMosque(m)}
                              className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                              title="মসজিদটি ডিলিট করুন (সুপার এডমিন ক্ষমতা)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 3: ALL USERS & ADMINS MANAGEMENT (EDIT & DELETE)     */}
      {/* ============================================================ */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* User Filters Bar */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="নাম, ইমেইল, মোবাইল বা মসজিদ খুঁজুন..."
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] text-[#3D3D3D]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Role filter */}
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value as any)}
                className="text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl px-3 py-2 focus:outline-hidden text-[#3D3D3D]"
              >
                <option value="ALL">সকল রোল (All Roles)</option>
                <option value="SUPER_ADMIN">সুপার এডমিন</option>
                <option value="MOSQUE_ADMIN">মসজিদ এডমিন</option>
                <option value="GENERAL_USER">সাধারণ ইউজার</option>
              </select>

              {/* Status filter */}
              <select
                value={userStatusFilter}
                onChange={e => setUserStatusFilter(e.target.value as any)}
                className="text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl px-3 py-2 focus:outline-hidden text-[#3D3D3D]"
              >
                <option value="ALL">সকল স্ট্যাটাস</option>
                <option value="APPROVED">অনুমোদিত (Approved)</option>
                <option value="PENDING">অপেক্ষমাণ (Pending)</option>
                <option value="REJECTED">বাতিল (Rejected)</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F1EA] text-[#2D4A3E] border-b border-[#E0DCCF] font-semibold">
                  <tr>
                    <th className="p-3.5">ব্যবহারকারীর নাম ও ইমেইল</th>
                    <th className="p-3.5">মোবাইল নম্বর</th>
                    <th className="p-3.5">রোল (Role)</th>
                    <th className="p-3.5">বরাদ্দকৃত মসজিদ (Assigned Mosque)</th>
                    <th className="p-3.5 text-center">অনুমোদন অবস্থা</th>
                    <th className="p-3.5 text-center">কন্ট্রোল ও অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]">
                  {filteredUsers.map(u => {
                    const assignedMosque = mosques.find(m => m.id === u.masjidId);
                    const isSelf = currentUser?.id === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#2D4A3E] text-sm">
                            {u.name} {isSelf && <span className="text-[10px] text-[#9A7E6F]">(আপনি)</span>}
                          </div>
                          <div className="text-[11px] text-[#8A8A8A]">{u.email}</div>
                        </td>

                        <td className="p-3.5 font-medium text-[#3D3D3D]">
                          {u.phone || 'N/A'}
                        </td>

                        <td className="p-3.5">
                          {u.role === 'SUPER_ADMIN' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2D4A3E] text-[#CFDB95] border border-[#2D4A3E]">
                              সুপার এডমিন
                            </span>
                          ) : u.role === 'MOSQUE_ADMIN' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-[#2D4A3E] border border-[#CFDB95]">
                              মসজিদ এডমিন
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F4F1EA] text-[#5A5A40]">
                              সাধারণ ইউজার
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {u.role === 'SUPER_ADMIN' ? (
                            <span className="text-[11px] text-[#8A8A8A] italic">জাতীয় পর্যায়ে সকল মসজিদ</span>
                          ) : assignedMosque ? (
                            <div>
                              <div className="font-semibold text-[#2D4A3E]">{assignedMosque.name}</div>
                              <div className="text-[10px] text-[#8A8A8A]">{assignedMosque.district} ({assignedMosque.code})</div>
                            </div>
                          ) : (
                            <span className="text-amber-700 font-medium">{u.requestedMasjidName || 'কোনো মসজিদ বরাদ্দ নেই'}</span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          {u.status === 'APPROVED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CFDB95]/70 text-[#2D4A3E]">
                              অনুমোদিত
                            </span>
                          ) : u.status === 'PENDING' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              অপেক্ষমাণ
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              বাতিল
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Quick Status Toggle */}
                            {u.status === 'PENDING' ? (
                              <button
                                onClick={() => {
                                  approveUser(u.id, true);
                                  showAlert('success', `"${u.name}"-কে অনুমোদন দেওয়া হয়েছে।`);
                                }}
                                className="px-2 py-1 rounded-full bg-[#2D4A3E] text-[#CFDB95] text-[10px] font-bold hover:bg-[#3D5E50]"
                                title="ইউজার অনুমোদন দিন"
                              >
                                অনুমোদন
                              </button>
                            ) : null}

                            {/* Edit User Button */}
                            <button
                              onClick={() => setEditingUser({ ...u })}
                              className="p-1.5 rounded-full bg-[#F4F1EA] hover:bg-[#CFDB95] text-[#2D4A3E] border border-[#E0DCCF] transition-colors"
                              title="ইউজারের রোল, মসজিদ, পাসওয়ার্ড ও তথ্য এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete User Button */}
                            <button
                              onClick={() => setDeletingUser(u)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-full transition-colors ${
                                isSelf
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              }`}
                              title={isSelf ? 'নিজেকে ডিলিট করা সম্ভব নয়' : 'ইউজার ডিলিট করুন'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBTAB 4: BACKUP & DATA RESTORE                              */}
      {/* ============================================================ */}
      {activeSubTab === 'backup' && (
        <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-7 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
              সিস্টেম ব্যাকআপ ও ডাটা সুরক্ষা
            </h3>
            <p className="text-xs text-[#5A5A40] mt-1">
              বাংলাদেশের সকল মসজিদের হিসাব, সদস্য লেজার ও ভাউচার সুরক্ষিত রাখতে নিয়মিত JSON ব্যাকআপ ডাউনলোড করে রাখুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#E0DCCF] rounded-2xl p-5 bg-[#FAF8F5] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#2D4A3E] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#2D4A3E]" />
                  সম্পূর্ণ ডাটাবেজ ব্যাকআপ (Export JSON)
                </h4>
                <p className="text-xs text-[#5A5A40] mt-1.5">
                  সকল মসজিদ, ইউজার একাউন্ট, সদস্য তালিকা এবং আয়-ব্যয়ের ক্যাশবুক ভাউচার এক ফাইলে ডাউনলোড হবে।
                </p>
              </div>
              <button
                onClick={exportDataJSON}
                className="mt-4 px-4 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                ব্যাকআপ ফাইল ডাউনলোড করুন
              </button>
            </div>

            <div className="border border-[#E0DCCF] rounded-2xl p-5 bg-[#FAF8F5] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#2D4A3E] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2D4A3E]" />
                  ডাটাবেজ রিস্টোর (Import JSON)
                </h4>
                <p className="text-xs text-[#5A5A40] mt-1.5">
                  পূর্বে সেভ করা JSON ব্যাকআপ ফাইল আপলোড করে হিসাব রিস্টোর করতে পারবেন।
                </p>
              </div>
              <label className="mt-4 px-4 py-2.5 rounded-full bg-[#CFDB95] hover:bg-[#b8c77b] text-[#2D4A3E] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-4 h-4" />
                ফাইল নির্বাচন করে রিস্টোর করুন
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: EDIT MOSQUE MODAL                                   */}
      {/* ============================================================ */}
      {editingMosque && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E0DCCF] my-8">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2D4A3E]" />
                <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                  মসজিদের তথ্য এডিট ও নিয়ন্ত্রণ
                </h3>
              </div>
              <button
                onClick={() => setEditingMosque(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMosqueEdits} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    মসজিদের পূর্ণ নাম: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.name}
                    onChange={e => setEditingMosque({ ...editingMosque, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] font-bold text-[#2D4A3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    মসজিদ কোড:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.code}
                    onChange={e => setEditingMosque({ ...editingMosque, code: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    অনুমোদন স্ট্যাটাস:
                  </label>
                  <select
                    value={editingMosque.status}
                    onChange={e => setEditingMosque({ ...editingMosque, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-bold"
                  >
                    <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                    <option value="PENDING">অপেক্ষমাণ (PENDING)</option>
                    <option value="REJECTED">বাতিল (REJECTED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    জেলা: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.district}
                    onChange={e => setEditingMosque({ ...editingMosque, district: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    উপজেলা / থানা: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.upazila}
                    onChange={e => setEditingMosque({ ...editingMosque, upazila: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    বিস্তারিত ঠিকানা: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.address}
                    onChange={e => setEditingMosque({ ...editingMosque, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    এডমিনের নাম:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMosque.adminName}
                    onChange={e => setEditingMosque({ ...editingMosque, adminName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    এডমিন ইমেইল:
                  </label>
                  <input
                    type="email"
                    required
                    value={editingMosque.adminEmail}
                    onChange={e => setEditingMosque({ ...editingMosque, adminEmail: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    যোগাযোগ ফোন:
                  </label>
                  <input
                    type="text"
                    value={editingMosque.contactPhone}
                    onChange={e => setEditingMosque({ ...editingMosque, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    প্রতিষ্ঠিত সন:
                  </label>
                  <input
                    type="text"
                    value={editingMosque.establishedYear}
                    onChange={e => setEditingMosque({ ...editingMosque, establishedYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#F4F1EA]">
                <button
                  type="button"
                  onClick={() => setEditingMosque(null)}
                  className="px-4 py-2 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-[#3D3D3D] font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] font-bold shadow-xs"
                >
                  পরিবর্তন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: DELETE MOSQUE CONFIRMATION MODAL                   */}
      {/* ============================================================ */}
      {deletingMosque && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-bn text-rose-800">
                  মসজিদ ডিলিট নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-rose-600">সুপার এডমিন সতর্কতা</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2">
              <p className="font-bold">
                আপনি কি নিশ্চিত যে আপনি <u>"{deletingMosque.name}"</u> মসজিদটি চিরতরে মুছে ফেলতে চান?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-800">
                <li>এই মসজিদের সকল আয়-ব্যয়ের ভাউচার ও ক্যাশবুক মুছে যাবে।</li>
                <li>নিবন্ধিত সদস্য ও তাদের বকেয়া লেজার মুছে যাবে।</li>
                <li>এই মসজিদের সংশ্লিষ্ট এডমিন ও ইউজার অ্যাকাউন্টসমূহ ডিলিট হয়ে যাবে।</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMosque(null)}
                className="px-4 py-2 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-[#3D3D3D] font-semibold"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMosque}
                className="px-5 py-2 text-xs rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                হ্যাঁ, মসজিদটি ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: EDIT USER & CONTROL MODAL                           */}
      {/* ============================================================ */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E0DCCF] my-8">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2D4A3E]" />
                <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                  ইউজার / এডমিন নিয়ন্ত্রণ ও এডিট
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdits} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  ব্যবহারকারীর নাম: *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    ইমেইল ঠিকানা: *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    ব্যবহারকারীর রোল: *
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-bold text-[#2D4A3E]"
                  >
                    <option value="SUPER_ADMIN">সুপার এডমিন (Super Admin)</option>
                    <option value="MOSQUE_ADMIN">মসজিদ এডমিন (Mosque Admin)</option>
                    <option value="GENERAL_USER">সাধারণ ইউজার (General User)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    অনুমোদন স্ট্যাটাস: *
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-bold"
                  >
                    <option value="APPROVED">অনুমোদিত (APPROVED)</option>
                    <option value="PENDING">অপেক্ষমাণ (PENDING)</option>
                    <option value="REJECTED">বাতিল (REJECTED)</option>
                  </select>
                </div>
              </div>

              {editingUser.role !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    বরাদ্দকৃত মসজিদ (Assigned Mosque): *
                  </label>
                  <select
                    value={editingUser.masjidId || ''}
                    onChange={e => setEditingUser({ ...editingUser, masjidId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-semibold text-[#2D4A3E]"
                  >
                    <option value="">-- কোনো মসজিদ বরাদ্দ নেই --</option>
                    {mosques.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.district}) [{m.code}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  পাসওয়ার্ড রিসেট / পরিবর্তন:
                </label>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="নতুন পাসওয়ার্ড লিখুন"
                  className="w-full px-3.5 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#F4F1EA]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-[#3D3D3D] font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] font-bold shadow-xs"
                >
                  ইউজার তথ্য সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: DELETE USER CONFIRMATION MODAL                     */}
      {/* ============================================================ */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-bn text-rose-800">
                  ইউজার ডিলিট নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-rose-600">সুপার এডমিন ক্ষমতা</p>
              </div>
            </div>

            <p className="text-xs text-[#3D3D3D]">
              আপনি কি নিশ্চিত যে আপনি <b>"{deletingUser.name}"</b> ({deletingUser.email}) এর অ্যাকাউন্টটি চিরতরে মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-[#3D3D3D] font-semibold"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2 text-xs rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                হ্যাঁ, ইউজারটি ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
