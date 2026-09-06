import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, formatDateBengali, formatDateTimeBengali } from '../../utils/bengaliUtils';
import { MemberLedgerItem } from '../../types';
import {
  Users,
  UserPlus,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MapPin,
  DollarSign,
  Search,
  Eye,
  Trash2
} from 'lucide-react';

export const MemberLedgerView: React.FC = () => {
  const {
    activeMasjid,
    members,
    transactions,
    addMember,
    deleteMember,
    useBengaliDigits,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ledger' | 'register'>('ledger');
  const [monthsCount, setMonthsCount] = useState<number>(12); // default 12 months (Ramadan to Ramadan)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberModal, setSelectedMemberModal] = useState<MemberLedgerItem | null>(null);

  // New member form
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mAddress, setMAddress] = useState('');
  const [mFee, setMFee] = useState('500');
  const [newMemberSuccess, setNewMemberSuccess] = useState<string | null>(null);

  if (!activeMasjid) return null;

  const mosqueMembers = members.filter(m => m.masjidId === activeMasjid.id);
  const mosqueTxns = transactions.filter(t => t.masjidId === activeMasjid.id && t.type === 'INCOME');

  // Calculate Ledger Data
  const memberLedger: MemberLedgerItem[] = useMemo(() => {
    return mosqueMembers.map(m => {
      const monthlyFee = m.monthlyFee || 0;
      const totalPayable = monthlyFee * monthsCount;

      // Find all payments where person matches member name or id
      const payments: MemberLedgerItem['payments'] = [];
      let totalPaid = 0;

      mosqueTxns.forEach(t => {
        const isMatched =
          (t.memberId && t.memberId === m.id) ||
          t.person.includes(m.id) ||
          t.person.includes(m.name);

        if (isMatched) {
          totalPaid += t.amount;
          payments.push({
            date: t.date,
            voucherNo: t.voucherNo,
            category: t.category,
            amount: t.amount,
            note: t.note
          });
        }
      });

      const dueDiff = totalPayable - totalPaid;
      let status: 'PAID' | 'DUE' | 'ADVANCE' = 'PAID';
      let due = 0;
      let advance = 0;

      if (dueDiff > 0) {
        status = 'DUE';
        due = dueDiff;
      } else if (dueDiff < 0) {
        status = 'ADVANCE';
        advance = Math.abs(dueDiff);
      } else {
        status = 'PAID';
      }

      return {
        id: m.id,
        name: m.name,
        phone: m.phone,
        address: m.address,
        monthlyFee,
        totalPayable,
        totalPaid,
        due,
        advance,
        status,
        payments
      };
    });
  }, [mosqueMembers, mosqueTxns, monthsCount]);

  const filteredLedger = memberLedger.filter(item => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q)
    );
  });

  // Totals for summary cards
  const totalPayableAll = filteredLedger.reduce((acc, c) => acc + c.totalPayable, 0);
  const totalPaidAll = filteredLedger.reduce((acc, c) => acc + c.totalPaid, 0);
  const totalDueAll = filteredLedger.reduce((acc, c) => acc + c.due, 0);
  const totalAdvanceAll = filteredLedger.reduce((acc, c) => acc + c.advance, 0);

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mPhone.trim()) {
      alert('সদস্যের নাম ও ফোন নম্বর পূরণ করুন।');
      return;
    }

    const feeNum = parseFloat(mFee) || 0;
    const res = addMember({
      masjidId: activeMasjid.id,
      name: mName.trim(),
      phone: mPhone.trim(),
      address: mAddress.trim() || 'ঠিকানা অপ্রদত্ত',
      monthlyFee: feeNum,
      joinedDate: new Date().toISOString().slice(0, 10)
    });

    if (res.success) {
      setNewMemberSuccess(res.message);
      setMName('');
      setMPhone('');
      setMAddress('');
      setMFee('500');
      setTimeout(() => setNewMemberSuccess(null), 4000);
    }
  };

  const template = activeMasjid.reportTemplate;
  const canManage = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'MOSQUE_ADMIN';

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
          সদস্যদের বাৎসরিক চাঁদা ও বকেয়া লেজার (রমজান থেকে রমজান)
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          {template?.addressLine || activeMasjid.address}
        </p>
        <p className="text-xs text-slate-500">
          মেয়াদ: পবিত্র রমজানুল মোবারক হতে আগামী রমজান পর্যন্ত ({monthsCount} মাসের হিসাব)
        </p>
      </div>

      {/* Screen Controls Header */}
      <div className="no-print bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#CFDB95] text-[#2D4A3E]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
              সদস্য লেজার ও বাৎসরিক বকেয়া হিসাব
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            পবিত্র রমজানুল মোবারক হতে পরবর্তী রমজান পর্যন্ত ১২ মাসের সদস্য চাঁদা ও বকেয়া নিরীক্ষণ।
          </p>
        </div>

        {/* Tab & Print buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#F4F1EA] p-1 rounded-full border border-[#E0DCCF] flex items-center">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'ledger'
                  ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#3D3D3D]'
              }`}
            >
              📋 বকেয়া লেজার
            </button>
            {canManage && (
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-sm'
                    : 'text-[#8A8A8A] hover:text-[#3D3D3D]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                নতুন সদস্য
              </button>
            )}
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            title="সদস্য লেজার প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            🖨️ লেজার প্রিন্ট
          </button>
        </div>
      </div>

      {/* TAB 1: LEDGER VIEW */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E0DCCF] rounded-3xl p-6 shadow-sm">
              <span className="text-xs text-[#8A8A8A] font-semibold">নিবন্ধিত মোট সদস্য</span>
              <p className="text-2xl font-bold text-[#3D3D3D] font-serif-bn mt-1">
                {mosqueMembers.length} জন
              </p>
              <span className="text-[11px] text-[#8A8A8A]">প্রতি মাসের নির্ধারিত চাঁদা সহ</span>
            </div>

            <div className="bg-white border border-[#E0DCCF] rounded-3xl p-6 shadow-sm">
              <span className="text-xs text-[#8A8A8A] font-semibold">বাৎসরিক মোট ধার্য ({monthsCount} মাস)</span>
              <p className="text-2xl font-bold text-[#2D4A3E] font-serif-bn mt-1">
                {formatTaka(totalPayableAll, { useBengaliDigits })}
              </p>
              <span className="text-[11px] text-[#8A8A8A]">সকল সদস্যের প্রদেয় চাঁদা</span>
            </div>

            <div className="bg-white border border-[#E0DCCF] rounded-3xl p-6 shadow-sm">
              <span className="text-xs text-[#5A5A40] font-semibold">মোট সংগৃহীত চাঁদা</span>
              <p className="text-2xl font-bold text-[#5A5A40] font-serif-bn mt-1">
                {formatTaka(totalPaidAll, { useBengaliDigits })}
              </p>
              <span className="text-[11px] text-[#8A8A8A]">ক্যাশবুকে জমা হয়েছে</span>
            </div>

            <div className="bg-white border border-[#E0DCCF] rounded-3xl p-6 shadow-sm">
              <span className="text-xs text-[#9A7E6F] font-semibold">সর্বমোট বকেয়া চাঁদা</span>
              <p className="text-2xl font-bold text-[#9A7E6F] font-serif-bn mt-1">
                {formatTaka(totalDueAll, { useBengaliDigits })}
              </p>
              <span className="text-[11px] text-[#8A8A8A]">সদস্যদের নিকট প্রাপ্য বকেয়া</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="no-print bg-white rounded-3xl border border-[#E0DCCF] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="সদস্যের নাম, আইডি বা ফোন..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:border-[#2D4A3E] text-[#3D3D3D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-[#8A8A8A] font-semibold whitespace-nowrap">
                হিসাবের মেয়াদ:
              </label>
              <select
                value={monthsCount}
                onChange={e => setMonthsCount(parseInt(e.target.value) || 12)}
                className="text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl px-3 py-2 focus:outline-hidden text-[#3D3D3D]"
              >
                <option value={12}>১২ মাস (রমজান থেকে রমজান)</option>
                <option value={6}>৬ মাস (অর্ধবার্ষিক)</option>
                <option value={3}>৩ মাস (ত্রৈমাসিক)</option>
                <option value={1}>১ মাস (চলতি মাস)</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden print:border-none print:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FBF9F6] text-[#8A8A8A] border-b border-[#F4F1EA] font-semibold print:bg-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA]">আইডি</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA]">সদস্যের নাম ও ফোন</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-right">মাসিক চাঁদা</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-right">বাৎসরিক ধার্য ({monthsCount} মাস)</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-right">মোট প্রদত্ত টাকা</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-right">বকেয়া / অ্যাডভান্স</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-center">অবস্থা</th>
                    <th className="px-4 py-3.5 border-b border-[#F4F1EA] text-center no-print">বিবরণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA] print:divide-slate-300">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#8A8A8A]">
                        কোনো সদস্যের রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map(m => (
                      <tr key={m.id} className="hover:bg-[#FBF9F6]/80 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-[#3D3D3D] whitespace-nowrap">
                          {m.id}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-[#3D3D3D] font-serif-bn">{m.name}</div>
                          <div className="text-[11px] text-[#8A8A8A] flex items-center gap-2">
                            <span>{m.phone}</span>
                            {m.address && <span>• {m.address}</span>}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right font-medium text-[#3D3D3D]">
                          {formatTaka(m.monthlyFee, { useBengaliDigits })}
                        </td>

                        <td className="px-4 py-3.5 text-right font-medium text-[#3D3D3D]">
                          {formatTaka(m.totalPayable, { useBengaliDigits })}
                        </td>

                        <td className="px-4 py-3.5 text-right font-bold text-[#5A5A40]">
                          {formatTaka(m.totalPaid, { useBengaliDigits })}
                        </td>

                        <td className="px-4 py-3.5 text-right font-bold whitespace-nowrap">
                          {m.due > 0 ? (
                            <span className="text-[#9A7E6F]">
                              {formatTaka(m.due, { useBengaliDigits })} (বকেয়া)
                            </span>
                          ) : m.advance > 0 ? (
                            <span className="text-[#5A5A40]">
                              {formatTaka(m.advance, { useBengaliDigits })} (অগ্রিম)
                            </span>
                          ) : (
                            <span className="text-[#8A8A8A]">৳ ০.০০</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {m.status === 'DUE' ? (
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                              বকেয়া রয়েছে
                            </span>
                          ) : m.status === 'ADVANCE' ? (
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E8EDDF] text-[#2D4A3E]">
                              অগ্রিম পরিশোধ
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                              পরিশোধিত
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center no-print whitespace-nowrap">
                          <button
                            onClick={() => setSelectedMemberModal(m)}
                            className="px-3 py-1.5 rounded-full bg-[#F4F1EA] hover:bg-[#CFDB95] text-[#2D4A3E] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors border border-[#E0DCCF]"
                            title="সদস্যের জমার ভাউচার রসিদ তালিকা দেখুন"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            রসিদ ({m.payments.length})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER NEW MEMBER & DIRECTORY */}
      {activeTab === 'register' && canManage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Registration Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn flex items-center gap-2 border-b border-[#F4F1EA] pb-3">
              <UserPlus className="w-5 h-5 text-[#2D4A3E]" />
              নতুন সদস্য নিবন্ধন ফরম
            </h3>

            {newMemberSuccess && (
              <div className="p-3.5 rounded-2xl bg-[#CFDB95]/40 border border-[#CFDB95] text-[#2D4A3E] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D4A3E]" />
                {newMemberSuccess}
              </div>
            )}

            <form onSubmit={handleRegisterMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  সদস্যের পূর্ণ নাম: *
                </label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={e => setMName(e.target.value)}
                  placeholder="যেমন: আলহাজ্ব জহিরুল হক মুন্সী"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  মোবাইল নম্বর: *
                </label>
                <input
                  type="tel"
                  required
                  value={mPhone}
                  onChange={e => setMPhone(e.target.value)}
                  placeholder="০১৭১১-২২৩৩৪৪"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  ঠিকানা (মহল্লা / বাড়ি):
                </label>
                <input
                  type="text"
                  value={mAddress}
                  onChange={e => setMAddress(e.target.value)}
                  placeholder="মুন্সীবাড়ী, বরুন, মুরাদনগর"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  নির্ধারিত মাসিক চাঁদা (৳): *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="50"
                  value={mFee}
                  onChange={e => setMFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-bold text-[#3D3D3D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                সদস্য সেভ করুন
              </button>
            </form>
          </div>

          {/* Right: Members List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F4F1EA] bg-[#FBF9F6]">
              <h4 className="text-xs font-bold text-[#2D4A3E] font-serif-bn">
                নিবন্ধিত সদস্যদের তালিকা ({mosqueMembers.length} জন)
              </h4>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBF9F6] text-[#8A8A8A] border-b border-[#F4F1EA] font-semibold sticky top-0">
                  <tr>
                    <th className="px-4 py-3">আইডি</th>
                    <th className="px-4 py-3">নাম</th>
                    <th className="px-4 py-3">ফোন</th>
                    <th className="px-4 py-3">মাসিক চাঁদা</th>
                    <th className="px-4 py-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]">
                  {mosqueMembers.map(m => (
                    <tr key={m.id} className="hover:bg-[#FBF9F6]">
                      <td className="px-4 py-3 font-bold text-[#3D3D3D]">{m.id}</td>
                      <td className="px-4 py-3 font-semibold text-[#3D3D3D] font-serif-bn">{m.name}</td>
                      <td className="px-4 py-3 text-[#8A8A8A]">{m.phone}</td>
                      <td className="px-4 py-3 font-bold text-[#2D4A3E]">৳ {m.monthlyFee}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`আপনি কি নিশ্চিত যে সদস্য ${m.name} (${m.id}) মুছে ফেলতে চান?`)) {
                              deleteMember(m.id);
                            }
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                          title="সদস্য মুছুন"
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
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 bg-[#2D4A3E]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-[#E0DCCF]">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                  {selectedMemberModal.name} ({selectedMemberModal.id})
                </h3>
                <p className="text-xs text-[#8A8A8A]">ফোন: {selectedMemberModal.phone}</p>
              </div>
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="text-[#8A8A8A] hover:text-[#3D3D3D] text-lg font-bold px-2 rounded-full hover:bg-[#F4F1EA]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FBF9F6] p-4 rounded-2xl border border-[#E0DCCF]">
              <div>
                <span className="text-[#8A8A8A]">মাসিক চাঁদা:</span> <b className="text-[#3D3D3D] block text-sm">{formatTaka(selectedMemberModal.monthlyFee, { useBengaliDigits })}</b>
              </div>
              <div>
                <span className="text-[#8A8A8A]">বাৎসরিক ধার্য:</span> <b className="text-[#3D3D3D] block text-sm">{formatTaka(selectedMemberModal.totalPayable, { useBengaliDigits })}</b>
              </div>
              <div>
                <span className="text-[#8A8A8A]">মোট প্রদান:</span> <b className="text-[#5A5A40] block text-sm">{formatTaka(selectedMemberModal.totalPaid, { useBengaliDigits })}</b>
              </div>
              <div>
                <span className="text-[#8A8A8A]">বকেয়া:</span> <b className="text-[#9A7E6F] block text-sm">{formatTaka(selectedMemberModal.due, { useBengaliDigits })}</b>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#3D3D3D] mb-2">প্রদত্ত রসিদ সমূহের তালিকা:</h4>
              {selectedMemberModal.payments.length === 0 ? (
                <p className="text-xs text-[#8A8A8A] italic">এখনো কোনো চাঁদা বা জমার রেকর্ড নেই।</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedMemberModal.payments.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FBF9F6] border border-[#E0DCCF] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#3D3D3D]">{p.voucherNo}</span>
                        <span className="text-[11px] text-[#8A8A8A] ml-2">{formatDateBengali(p.date, useBengaliDigits)}</span>
                        {p.note && <div className="text-[11px] text-[#8A8A8A] italic">{p.note}</div>}
                      </div>
                      <span className="font-bold text-[#5A5A40]">
                        {formatTaka(p.amount, { useBengaliDigits })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedMemberModal(null)}
              className="w-full py-2.5 bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] rounded-full text-xs font-bold transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
