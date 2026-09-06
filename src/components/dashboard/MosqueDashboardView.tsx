import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, formatDateTimeBengali } from '../../utils/bengaliUtils';
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  PlusCircle,
  FileText,
  Scale,
  Settings,
  UserCheck,
  Eye,
  MapPin,
  Phone,
  Printer,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  AlertTriangle
} from 'lucide-react';

interface MosqueDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onViewVoucher: (voucherNo: string) => void;
}

export const MosqueDashboardView: React.FC<MosqueDashboardViewProps> = ({
  onNavigateTab,
  onViewVoucher
}) => {
  const { activeMasjid, getMasjidStats, transactions, useBengaliDigits, currentUser } = useApp();

  if (!activeMasjid) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        কোনো মসজিদ নির্বাচিত নেই।
      </div>
    );
  }

  const stats = getMasjidStats(activeMasjid.id);
  const mosqueTxns = transactions.filter(t => t.masjidId === activeMasjid.id);
  const recentTxns = mosqueTxns.slice(0, 6);

  const isApproved = currentUser?.status === 'APPROVED';
  const isMosqueAdmin = currentUser?.role === 'MOSQUE_ADMIN' || currentUser?.role === 'SUPER_ADMIN';
  const isPresident = isMosqueAdmin || (currentUser?.committeeRole === 'PRESIDENT' && currentUser?.masjidId === activeMasjid.id);
  const isCashier = isMosqueAdmin || (currentUser?.committeeRole === 'CASHIER' && currentUser?.masjidId === activeMasjid.id);
  const isCollector = isMosqueAdmin || (currentUser?.committeeRole === 'COLLECTOR' && currentUser?.masjidId === activeMasjid.id);

  return (
    <div className="space-y-6">
      {/* Mosque Banner & Location Info */}
      <div className="bg-[#2D4A3E] text-[#E8EDDF] rounded-3xl p-6 sm:p-7 shadow-sm border border-[#3D5E50]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#CFDB95] text-[#2D4A3E] shadow-2xs">
                কোড: {activeMasjid.code}
              </span>
              <span className="text-xs text-[#CFDB95] font-medium">
                স্থাপিত: {activeMasjid.establishedYear} খ্রি.
              </span>
              <span className="text-[#CFDB95]/60">•</span>
              <span className="text-xs text-[#E8EDDF] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#CFDB95]" />
                {activeMasjid.upazila}, {activeMasjid.district}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif-bn tracking-tight text-white">
              {activeMasjid.name}
            </h2>

            <p className="text-xs sm:text-sm text-[#E8EDDF]/80 font-medium">
              {activeMasjid.address}
            </p>

            <div className="text-xs text-[#CFDB95] pt-1 flex items-center gap-3 flex-wrap">
              <span><b>এডমিন:</b> {activeMasjid.adminName}</span>
              {activeMasjid.contactPhone && (
                <span><b>যোগাযোগ:</b> {activeMasjid.contactPhone}</span>
              )}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isApproved && (
              <button
                onClick={() => onNavigateTab('entry')}
                className="px-4 py-2 bg-[#CFDB95] text-[#2D4A3E] rounded-full text-xs sm:text-sm font-bold shadow-sm hover:brightness-105 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                + ভাউচার এন্ট্রি
              </button>
            )}

            {isMosqueAdmin && (
              <button
                onClick={() => onNavigateTab('templatesettings')}
                className="px-4 py-2 border border-[#CFDB95] text-[#CFDB95] hover:bg-[#3D5E50] rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
                title="মসজিদের নাম, ঠিকানা ও রিপোর্ট টেমপ্লেট পরিবর্তন করুন"
              >
                <Settings className="w-4 h-4" />
                টেমপ্লেট কাস্টমাইজ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pending Vouchers Approval Notification Alert Bar */}
      {stats.pendingApprovalCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-800 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 font-serif-bn flex items-center gap-2">
                <span>{stats.pendingApprovalCount} টি ভাউচার অনুমোদনের অপেক্ষায় রয়েছে</span>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-sans">
                  {formatTaka(stats.pendingApprovalAmount, { useBengaliDigits })}
                </span>
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                নিয়ম অনুযায়ী আদায়কারী ও ক্যাশিয়ারের স্বাক্ষরের পর <b>সভাপতির চূড়ান্ত অনুমোদন</b> ব্যতিত ভাউচার মূল ফান্ড ও রিপোর্টে যুক্ত হবে না।
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('cashbook')}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4" />
            লেজারে অনুমোদন নিরীক্ষা করুন →
          </button>
        </div>
      )}

      {/* Auto Calculation Cards (Accounting Compliant: Strictly Approved Funds) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Current Approved Fund Balance */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0DCCF] shadow-sm hover:border-[#2D4A3E]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-[#8A8A8A] font-medium">অনুমোদিত মোট স্থিতি</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">অডিট পাস</span>
          </div>
          <h3 className="text-2xl font-bold text-[#2D4A3E] font-serif-bn tracking-tight">
            {formatTaka(stats.balance, { useBengaliDigits })}
          </h3>
          <p className="text-xs text-[#2D4A3E] mt-2 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2D4A3E]"></span>
            হাতে ও ব্যাংকে কার্যকর ক্যাশ ফান্ড
          </p>
        </div>

        {/* 2. Total Approved Income */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0DCCF] shadow-sm hover:border-[#5A5A40]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-[#8A8A8A] font-medium">অনুমোদিত মোট জমা</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">হিসাবে যুক্ত</span>
          </div>
          <h3 className="text-2xl font-bold text-[#5A5A40] font-serif-bn tracking-tight">
            {formatTaka(stats.totalIncome, { useBengaliDigits })}
          </h3>
          <p className="text-xs text-[#8A8A8A] mt-2 italic font-serif-bn">
            জুমা, দানবাক্স ও উন্নয়ন অনুদান
          </p>
        </div>

        {/* 3. Total Approved Expense */}
        <div className="bg-white p-5 rounded-3xl border border-[#E0DCCF] shadow-sm hover:border-[#9A7E6F]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-[#8A8A8A] font-medium">অনুমোদিত মোট ব্যয়</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">হিসাবে যুক্ত</span>
          </div>
          <h3 className="text-2xl font-bold text-[#9A7E6F] font-serif-bn tracking-tight">
            {formatTaka(stats.totalExpense, { useBengaliDigits })}
          </h3>
          <p className="text-xs text-[#8A8A8A] mt-2 italic font-serif-bn">
            বিদ্যুৎ বিল, নির্মাণ ও বেতন বিল
          </p>
        </div>

        {/* 4. Pending Approval Status Card */}
        <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 shadow-sm hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-amber-900 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-700" />
              অনুমোদন অপেক্ষমাণ
            </p>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">স্থগিত</span>
          </div>
          <h3 className="text-2xl font-bold text-amber-900 font-serif-bn tracking-tight">
            {formatTaka(stats.pendingApprovalAmount, { useBengaliDigits })}
          </h3>
          <p className="text-xs text-amber-800 mt-2 font-medium">
            {stats.pendingApprovalCount} টি ভাউচার সভাপতির অনুমোদনের অপেক্ষায়
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white rounded-2xl border border-[#E0DCCF] p-3 shadow-sm flex items-center gap-2 flex-wrap text-xs font-semibold">
        <button
          onClick={() => onNavigateTab('cashbook')}
          className="px-4 py-2 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <FileText className="w-4 h-4 text-[#CFDB95]" />
          📜 ক্যাশবুক ও ভাউচার অনুমোদন
          {stats.pendingApprovalCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px]">
              {stats.pendingApprovalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigateTab('members')}
          className="px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#6c6c50] text-white flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Users className="w-4 h-4 text-[#CFDB95]" />
          📋 সদস্য লেজার ও বকেয়া ({stats.memberCount})
        </button>

        <button
          onClick={() => onNavigateTab('balancesheet')}
          className="px-4 py-2 rounded-full bg-[#9A7E6F] hover:bg-[#a88c7d] text-white flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Scale className="w-4 h-4 text-[#E8EDDF]" />
          ⚖️ ব্যালেন্স শিট
        </button>

        {isMosqueAdmin && (
          <button
            onClick={() => onNavigateTab('userapproval')}
            className="px-4 py-2 rounded-full bg-[#CFDB95] text-[#2D4A3E] hover:brightness-105 font-bold flex items-center gap-1.5 transition-all shadow-2xs ml-auto"
          >
            <UserCheck className="w-4 h-4 text-[#2D4A3E]" />
            👥 ইউজার অনুমোদন
            {stats.pendingUsersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#2D4A3E] text-[#CFDB95] font-bold text-[10px]">
                {stats.pendingUsersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Recent Transactions Overview */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#F4F1EA] flex justify-between items-center bg-white">
          <div>
            <h4 className="font-bold font-serif-bn text-base sm:text-lg text-[#2D4A3E] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2D4A3E]" />
              সাম্প্রতিক লেনদেন সমূহ ({recentTxns.length} টি)
            </h4>
            <span className="text-xs text-[#8A8A8A]">সর্বশেষ এন্ট্রি করা আয় ও ব্যয়ের নিরীক্ষা অবস্থা</span>
          </div>

          <button
            onClick={() => onNavigateTab('cashbook')}
            className="text-xs font-semibold text-[#2D4A3E] hover:underline cursor-pointer"
          >
            সব দেখুন →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FBF9F6] text-xs uppercase tracking-wider text-[#8A8A8A] border-b border-[#F4F1EA]">
                <th className="px-6 py-3.5 font-semibold">তারিখ ও সময়</th>
                <th className="px-6 py-3.5 font-semibold">ভাউচার নং</th>
                <th className="px-6 py-3.5 font-semibold">ধরণ</th>
                <th className="px-6 py-3.5 font-semibold">খাত / বিবরণ</th>
                <th className="px-6 py-3.5 font-semibold text-right">পরিমাণ</th>
                <th className="px-6 py-3.5 font-semibold">অনুমোদন স্থিতি</th>
                <th className="px-6 py-3.5 font-semibold text-center">রসিদ ও প্রিন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1EA] text-sm">
              {recentTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#8A8A8A]">
                    এখনও কোনো ভাউচার এন্ট্রি করা হয়নি।
                  </td>
                </tr>
              ) : (
                recentTxns.map(t => {
                  const presOk = Boolean(t.presidentApproval?.approved);
                  return (
                    <tr key={t.id} className="hover:bg-[#FBF9F6]/80 transition-colors">
                      <td className="px-6 py-4 text-[#8A8A8A] whitespace-nowrap text-xs">
                        {formatDateTimeBengali(t.date, useBengaliDigits)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#3D3D3D] whitespace-nowrap text-xs font-mono">
                        {t.voucherNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.type === 'INCOME' ? (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                            আয়
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">
                            ব্যয়
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#3D3D3D] text-xs">
                        {t.category}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                        t.type === 'INCOME' ? 'text-[#2D4A3E]' : 'text-[#9A7E6F]'
                      }`}>
                        {formatTaka(t.amount, { useBengaliDigits })}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {presOk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            👑 অনুমোদিত (যুক্ত)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ⏳ অনুমোদন অপেক্ষমাণ
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onViewVoucher(t.voucherNo)}
                          className="px-3 py-1 rounded-full bg-[#F4F1EA] hover:bg-[#CFDB95] text-[#2D4A3E] font-semibold text-xs inline-flex items-center gap-1 transition-colors border border-[#E0DCCF]"
                          title="ভাউচার অনুমোদন বিবরণী ও প্রিন্ট রসিদ"
                        >
                          <Printer className="w-3 h-3" />
                          ভাউচার রসিদ
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
