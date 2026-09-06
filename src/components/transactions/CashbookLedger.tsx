import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, formatDateTimeBengali, formatDateBengali } from '../../utils/bengaliUtils';
import {
  Printer,
  Search,
  Filter,
  Download,
  Calendar,
  Trash2,
  FileText,
  Building2,
  TrendingUp,
  TrendingDown,
  Wallet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Check,
  AlertTriangle
} from 'lucide-react';

interface CashbookLedgerProps {
  onViewVoucher?: (voucherNo: string) => void;
}

export const CashbookLedger: React.FC<CashbookLedgerProps> = ({ onViewVoucher }) => {
  const {
    activeMasjid,
    transactions,
    deleteTransaction,
    useBengaliDigits,
    currentUser,
    approveVoucherTier,
    batchApproveVouchers
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [approvalFilter, setApprovalFilter] = useState<'ALL' | 'APPROVED_ONLY' | 'PENDING_ONLY'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'THIS_MONTH' | 'THIS_YEAR'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!activeMasjid) return null;

  const mosqueTxns = transactions.filter(t => t.masjidId === activeMasjid.id);

  const filteredTxns = useMemo(() => {
    return mosqueTxns.filter(t => {
      // Type
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

      // Approval Filter:
      // APPROVED_ONLY: only transactions approved by President (counted in main accounts)
      // PENDING_ONLY: transactions awaiting President approval (not in main accounts)
      const isPresidentApproved = Boolean(t.presidentApproval?.approved);
      if (approvalFilter === 'APPROVED_ONLY' && !isPresidentApproved) return false;
      if (approvalFilter === 'PENDING_ONLY' && isPresidentApproved) return false;

      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          t.voucherNo.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.person.toLowerCase().includes(q) ||
          t.note.toLowerCase().includes(q) ||
          t.phone.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Date presets
      const txnDate = new Date(t.date);
      const now = new Date();

      if (dateFilter === 'TODAY') {
        const isToday =
          txnDate.getDate() === now.getDate() &&
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear();
        if (!isToday) return false;
      } else if (dateFilter === 'THIS_MONTH') {
        const isThisMonth =
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear();
        if (!isThisMonth) return false;
      } else if (dateFilter === 'THIS_YEAR') {
        const isThisYear = txnDate.getFullYear() === now.getFullYear();
        if (!isThisYear) return false;
      }

      // Custom date range
      if (startDate) {
        if (new Date(t.date) < new Date(startDate)) return false;
      }
      if (endDate) {
        const endD = new Date(endDate);
        endD.setHours(23, 59, 59);
        if (new Date(t.date) > endD) return false;
      }

      return true;
    });
  }, [mosqueTxns, typeFilter, approvalFilter, searchTerm, dateFilter, startDate, endDate]);

  // Calculations for President Approved transactions (Actual Accounts)
  const approvedTxns = filteredTxns.filter(t => t.presidentApproval?.approved === true);
  const pendingTxns = filteredTxns.filter(t => !t.presidentApproval?.approved);

  const approvedIncome = approvedTxns
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const approvedExpense = approvedTxns
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const approvedBalance = approvedIncome - approvedExpense;

  const pendingAmount = pendingTxns.reduce((acc, curr) => acc + curr.amount, 0);

  // User Authority Check
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isMosqueAdmin = currentUser?.role === 'MOSQUE_ADMIN' && currentUser.masjidId === activeMasjid.id;
  const isPresident = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'PRESIDENT' && currentUser.masjidId === activeMasjid.id);
  const isCashier = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'CASHIER' && currentUser.masjidId === activeMasjid.id);
  const isCollector = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'COLLECTOR' && currentUser.masjidId === activeMasjid.id);

  // Pending counts for quick action bar
  const pendingPresidentList = filteredTxns.filter(t => !t.presidentApproval?.approved);
  const pendingCashierList = filteredTxns.filter(t => !t.cashierApproval?.approved);
  const pendingCollectorList = filteredTxns.filter(t => !t.collectorApproval?.approved);

  const handleBatchApprove = (tier: 'collector' | 'cashier' | 'president') => {
    let listToApprove: typeof filteredTxns = [];
    if (tier === 'president') listToApprove = pendingPresidentList;
    else if (tier === 'cashier') listToApprove = pendingCashierList;
    else listToApprove = pendingCollectorList;

    if (listToApprove.length === 0) return;

    const ids = listToApprove.map(t => t.id);
    const res = batchApproveVouchers(ids, tier);
    setFeedbackMsg(res.message);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = ['VoucherNo', 'Date', 'Type', 'Category', 'Amount', 'Person', 'Phone', 'PaymentMethod', 'ApprovalStatus', 'Note', 'CreatedBy'];
    const rows = filteredTxns.map(t => [
      t.voucherNo,
      t.date,
      t.type === 'INCOME' ? 'জমা' : 'খরচ',
      `"${t.category.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.person.replace(/"/g, '""')}"`,
      t.phone,
      t.paymentMethod,
      t.presidentApproval?.approved ? 'সভাপতি কর্তৃক অনুমোদিত' : 'অপেক্ষমাণ (অননুমোদিত)',
      `"${t.note.replace(/"/g, '""')}"`,
      t.createdBy
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeMasjid.code}_cashbook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const template = activeMasjid.reportTemplate;
  const canDelete = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'MOSQUE_ADMIN';

  return (
    <div className="space-y-6">
      {/* Printable Report Header with Mosque Custom Template (Visible on Print) */}
      <div className="print-only hidden p-4 mb-4 text-center border-b-2 border-slate-900">
        <p className="text-xs font-serif-bn font-semibold text-slate-800 tracking-wider">
          {template?.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
        </p>
        <h1 className="text-2xl font-bold font-serif-bn mt-1 text-slate-950">
          {template?.headerTitle || activeMasjid.name}
        </h1>
        <p className="text-sm font-semibold text-slate-700">
          {template?.subHeader || 'দৈনিক অটো ক্যাশবুক ও অডিট লেজার'}
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          {template?.addressLine || activeMasjid.address}
        </p>
        <p className="text-xs text-slate-500">
          ফোন: {template?.phoneLine || activeMasjid.contactPhone} {template?.registrationNo && `• ${template.registrationNo}`}
        </p>
        <div className="mt-2 text-xs font-semibold text-slate-700 bg-slate-100 py-1 px-3 inline-block rounded">
          রিপোর্ট মুদ্রণের তারিখ: {formatDateTimeBengali(new Date().toISOString(), useBengaliDigits)} (শুধুমাত্র অনুমোদিত হিসাব)
        </div>
      </div>

      {/* Screen Control Bar */}
      <div className="no-print bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#CFDB95] text-[#2D4A3E]">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
                দৈনিক অটো ক্যাশবুক ও লেনদেন লেজার
              </h2>
            </div>
            <p className="text-xs text-[#8A8A8A] mt-1">
              মসজিদের দৈনন্দিন আয় ও খরচের বিস্তারিত ভাউচার নিরীক্ষা। নিয়ম অনুযায়ী সভাপতির অনুমোদন ব্যতিত হিসাবভুক্ত হয় না।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full bg-[#F4F1EA] hover:bg-[#E0DCCF] text-[#2D4A3E] text-xs font-bold flex items-center gap-1.5 border border-[#E0DCCF] transition-colors"
              title="এক্সেল বা সিএসভি ফাইল হিসেবে ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              CSV এক্সপোর্ট
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="ক্যাশ লেজার প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              🖨️ লেজার প্রিন্ট
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-between">
            <span>✓ {feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}

        {/* Batch Approval Toolbar for Authorized Officers */}
        {(isPresident || isCashier || isCollector) && (pendingPresidentList.length > 0 || pendingCashierList.length > 0 || pendingCollectorList.length > 0) && (
          <div className="p-3 bg-[#F4F1EA] rounded-2xl border border-[#CFDB95] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D4A3E]" />
              <span className="font-bold text-[#2D4A3E]">
                এক ক্লিকে অনুমোদনের সুযোগ ({currentUser?.name}):
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isPresident && pendingPresidentList.length > 0 && (
                <button
                  onClick={() => handleBatchApprove('president')}
                  className="px-3 py-1.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-[#CFDB95]" />
                  👑 সভাপতি হিসেবে সব চূড়ান্ত অনুমোদন ({pendingPresidentList.length} টি)
                </button>
              )}

              {isCashier && pendingCashierList.length > 0 && (
                <button
                  onClick={() => handleBatchApprove('cashier')}
                  className="px-3 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#6c6c50] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-[#CFDB95]" />
                  💰 ক্যাশিয়ার অনুমোদন ({pendingCashierList.length} টি)
                </button>
              )}

              {isCollector && pendingCollectorList.length > 0 && (
                <button
                  onClick={() => handleBatchApprove('collector')}
                  className="px-3 py-1.5 rounded-full bg-[#9A7E6F] hover:bg-[#a88c7d] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  📝 আদায়কারী স্বাক্ষর ({pendingCollectorList.length} টি)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-[#F4F1EA]">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ভাউচার নং, খাত বা দাতা..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:border-[#2D4A3E] text-[#3D3D3D]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:border-[#2D4A3E] text-[#3D3D3D]"
            >
              <option value="ALL">সকল ধরন (জমা ও খরচ)</option>
              <option value="INCOME">শুধু জমা (Income)</option>
              <option value="EXPENSE">শুধু খরচ (Expense)</option>
            </select>
          </div>

          {/* Approval Filter */}
          <div>
            <select
              value={approvalFilter}
              onChange={e => setApprovalFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:border-[#2D4A3E] text-[#3D3D3D] font-medium"
            >
              <option value="ALL">অনুমোদন: সকল ভাউচার ({mosqueTxns.length})</option>
              <option value="APPROVED_ONLY">✓ সভাপতি অনুমোদিত (হিসাবে যুক্ত)</option>
              <option value="PENDING_ONLY">⏳ অপেক্ষমাণ অননুমোদিত ({pendingTxns.length})</option>
            </select>
          </div>

          {/* Date Presets */}
          <div>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:border-[#2D4A3E] text-[#3D3D3D]"
            >
              <option value="ALL">সকল সময়</option>
              <option value="TODAY">আজকের লেনদেন</option>
              <option value="THIS_MONTH">চলতি মাস</option>
              <option value="THIS_YEAR">চলতি অর্থবছর</option>
            </select>
          </div>

          {/* Date range picker */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-1/2 px-2 py-2 text-[11px] bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden text-[#3D3D3D]"
              title="শুরুর তারিখ"
            />
            <span className="text-[#8A8A8A] text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-1/2 px-2 py-2 text-[11px] bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden text-[#3D3D3D]"
              title="শেষের তারিখ"
            />
          </div>
        </div>
      </div>

      {/* Summary of Filtered Items (Accounting Compliant: Strictly Approved Funds) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Approved Balance */}
        <div className="bg-white border border-[#E0DCCF] rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A8A] flex items-center gap-1">
              <span>অডিট ফান্ড স্থিতি</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">অনুমোদিত</span>
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-[#2D4A3E] font-serif-bn mt-1">
              {formatTaka(approvedBalance, { useBengaliDigits })}
            </p>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">কার্যকর অবশিষ্ট ক্যাশ স্থিতি</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F4F1EA] text-[#2D4A3E]">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Income */}
        <div className="bg-white border border-[#E0DCCF] rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A8A] flex items-center gap-1">
              <span>হিসাবে যুক্ত জমা</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">অনুমোদিত</span>
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-[#5A5A40] font-serif-bn mt-1">
              {formatTaka(approvedIncome, { useBengaliDigits })}
            </p>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">{approvedTxns.filter(t => t.type === 'INCOME').length} টি ভাউচার</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#CFDB95]/40 text-[#2D4A3E]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Expense */}
        <div className="bg-white border border-[#E0DCCF] rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A8A] flex items-center gap-1">
              <span>হিসাবে যুক্ত ব্যয়</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">অনুমোদিত</span>
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-[#9A7E6F] font-serif-bn mt-1">
              {formatTaka(approvedExpense, { useBengaliDigits })}
            </p>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">{approvedTxns.filter(t => t.type === 'EXPENSE').length} টি ভাউচার</span>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 text-[#9A7E6F]">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approval Vouchers (Excluded from main accounts) */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>অনুমোদন অপেক্ষমাণ</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">স্থগিত</span>
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-amber-900 font-serif-bn mt-1">
              {formatTaka(pendingAmount, { useBengaliDigits })}
            </p>
            <span className="text-[11px] text-amber-800 mt-0.5 block">
              {pendingTxns.length} টি ভাউচার (সভাপতির অনুমোদন ব্যতিত হিসাবে যুক্ত হয়নি)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FBF9F6] text-[#8A8A8A] border-b border-[#F4F1EA] font-semibold print:bg-slate-200">
              <tr>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">তারিখ ও সময়</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">ভাউচার নং</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">ধরন</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">খাত / বিবরণ</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-right">পরিমাণ (৳)</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">দাতা / গ্রহীতা</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">অনুমোদন নিরীক্ষা (আদায়কারী / ক্যাশিয়ার / সভাপতি)</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA]">হিসাব অবস্থা</th>
                <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-center no-print">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1EA] print:divide-slate-300">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#8A8A8A]">
                    কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredTxns.map(t => {
                  const collOk = Boolean(t.collectorApproval?.approved);
                  const cashOk = Boolean(t.cashierApproval?.approved);
                  const presOk = Boolean(t.presidentApproval?.approved);

                  return (
                    <tr key={t.id} className="hover:bg-[#FBF9F6]/80 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap text-[#8A8A8A]">
                        {formatDateTimeBengali(t.date, useBengaliDigits)}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[#3D3D3D] whitespace-nowrap font-mono">
                        {t.voucherNo}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {t.type === 'INCOME' ? (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                            আয়
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                            ব্যয়
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-[#3D3D3D]">
                        {t.category}
                        {t.note && (
                          <span className="text-[11px] text-[#8A8A8A] block truncate max-w-xs">{t.note}</span>
                        )}
                      </td>

                      <td className={`px-4 py-3.5 text-right font-bold whitespace-nowrap ${
                        t.type === 'INCOME' ? 'text-[#2D4A3E]' : 'text-[#9A7E6F]'
                      }`}>
                        {formatTaka(t.amount, { useBengaliDigits })}
                      </td>

                      <td className="px-4 py-3.5 text-[#3D3D3D]">
                        <span className="font-medium">{t.person}</span>
                        {t.phone && t.phone !== 'N/A' && (
                          <span className="text-[11px] text-[#8A8A8A] block">{t.phone}</span>
                        )}
                      </td>

                      {/* 3-Tier Approval Workflow Badges & Inline Quick Buttons */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {/* 1. Collector Badge */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border ${
                              collOk
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                            title={collOk ? `আদায়কারী: ${t.collectorApproval?.approvedBy || 'অনুমোদিত'}` : 'আদায়কারী অনুমোদন অপেক্ষমাণ'}
                          >
                            {collOk ? '✓' : '⏳'} আদায়কারী
                          </span>

                          {/* 2. Cashier Badge */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border ${
                              cashOk
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                            title={cashOk ? `ক্যাশিয়ার: ${t.cashierApproval?.approvedBy || 'নিরীক্ষিত'}` : 'ক্যাশিয়ার অনুমোদন অপেক্ষমাণ'}
                          >
                            {cashOk ? '✓' : '⏳'} ক্যাশিয়ার
                          </span>

                          {/* 3. President Badge */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border ${
                              presOk
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                            title={presOk ? `সভাপতি: ${t.presidentApproval?.approvedBy || 'চূড়ান্ত অনুমোদিত'}` : 'সভাপতির অনুমোদন অপেক্ষমাণ (হিসাবে যুক্ত নয়)'}
                          >
                            {presOk ? '👑 ✓' : '👑 ⏳'} সভাপতি
                          </span>
                        </div>

                        {/* Inline Quick Approval Action for Authorized User */}
                        <div className="no-print mt-1 flex items-center gap-1">
                          {isPresident && !presOk && (
                            <button
                              onClick={() => approveVoucherTier({ transactionId: t.id, tier: 'president', approved: true })}
                              className="px-2 py-0.5 rounded bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="সভাপতি হিসেবে দ্রুত চূড়ান্ত অনুমোদন দিয়ে হিসাবে যুক্ত করুন"
                            >
                              <Award className="w-2.5 h-2.5 text-[#CFDB95]" /> অনুমোদন করুন
                            </button>
                          )}

                          {isCashier && !cashOk && (
                            <button
                              onClick={() => approveVoucherTier({ transactionId: t.id, tier: 'cashier', approved: true })}
                              className="px-2 py-0.5 rounded bg-[#5A5A40] hover:bg-[#6c6c50] text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="ক্যাশিয়ার হিসেবে অনুমোদন দিন"
                            >
                              <Check className="w-2.5 h-2.5" /> ক্যাশিয়ার অনুমোদন
                            </button>
                          )}

                          {isCollector && !collOk && (
                            <button
                              onClick={() => approveVoucherTier({ transactionId: t.id, tier: 'collector', approved: true })}
                              className="px-2 py-0.5 rounded bg-[#9A7E6F] hover:bg-[#a88c7d] text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="আদায়কারী হিসেবে স্বাক্ষর করুন"
                            >
                              <Check className="w-2.5 h-2.5" /> আদায়কারী স্বাক্ষর
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Main Account Inclusion Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {presOk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            হিসাবে যুক্ত
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-700" />
                            অপেক্ষমাণ (হিসাববহির্ভূত)
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center no-print whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {onViewVoucher && (
                            <button
                              onClick={() => onViewVoucher(t.voucherNo)}
                              className="p-1.5 rounded-full hover:bg-[#CFDB95] text-[#2D4A3E] transition-colors"
                              title="ভাউচার অনুমোদন বিবরণী ও প্রিন্ট কপি দেখুন"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => {
                                if (window.confirm(`আপনি কি নিশ্চিত যে ভাউচার ${t.voucherNo} মুছে ফেলতে চান?`)) {
                                  deleteTransaction(t.id);
                                }
                              }}
                              className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                              title="ভাউচার মুছুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total Row */}
            <tfoot className="bg-[#F4F1EA] font-bold text-[#2D4A3E] border-t border-[#E0DCCF] print:bg-slate-200">
              <tr>
                <td colSpan={4} className="px-4 py-3.5 text-right font-serif-bn">
                  অনুমোদিত কার্যকর স্থিতি (মোট অনুমোদিত জমা - মোট অনুমোদিত খরচ):
                </td>
                <td className="px-4 py-3.5 text-right text-base text-[#2D4A3E]">
                  {formatTaka(approvedBalance, { useBengaliDigits })}
                </td>
                <td colSpan={4} className="px-4 py-3.5 text-[#8A8A8A] text-xs">
                  (অনুমোদিত জমা: {formatTaka(approvedIncome, { useBengaliDigits })} | অনুমোদিত খরচ: {formatTaka(approvedExpense, { useBengaliDigits })})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Print Signatures Block (Only appears on Print) */}
      <div className="print-only hidden pt-12 mt-8 border-t border-slate-400 grid grid-cols-3 gap-8 text-center text-xs">
        <div>
          <div className="border-t border-slate-900 pt-1 font-bold">
            {template?.signatory1 || 'ক্যাশিয়ার / হিসাবরক্ষক'}
          </div>
          <span className="text-[10px] text-slate-500">স্বাক্ষর ও তারিখ</span>
        </div>
        <div>
          <div className="border-t border-slate-900 pt-1 font-bold">
            {template?.signatory2 || 'সাধারণ সম্পাদক'}
          </div>
          <span className="text-[10px] text-slate-500">স্বাক্ষর ও তারিখ</span>
        </div>
        <div>
          <div className="border-t border-slate-900 pt-1 font-bold">
            {template?.signatory3 || 'সভাপতি / মুতাওয়াল্লী'}
          </div>
          <span className="text-[10px] text-slate-500">স্বাক্ষর ও তারিখ</span>
        </div>
      </div>
    </div>
  );
};
