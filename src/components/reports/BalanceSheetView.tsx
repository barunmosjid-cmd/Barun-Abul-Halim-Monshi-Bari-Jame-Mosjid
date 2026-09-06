import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, formatDateTimeBengali, numberToBengaliWords } from '../../utils/bengaliUtils';
import {
  Scale,
  Printer,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Building2,
  ShieldCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const BalanceSheetView: React.FC = () => {
  const { activeMasjid, transactions, useBengaliDigits } = useApp();
  const [includePendingAudit, setIncludePendingAudit] = useState(false);

  if (!activeMasjid) return null;

  const mosqueTxns = transactions.filter(t => t.masjidId === activeMasjid.id);
  const approvedTxns = mosqueTxns.filter(t => t.presidentApproval?.approved === true);
  const pendingTxns = mosqueTxns.filter(t => !t.presidentApproval?.approved);

  // Group by categories: Default strictly uses approvedTxns as per audit rules
  const activeTxnsForSheet = includePendingAudit ? mosqueTxns : approvedTxns;

  const { incomeByCategory, expenseByCategory, totalIncome, totalExpense, balance, pendingAmount } = useMemo(() => {
    const incMap: Record<string, number> = {};
    const expMap: Record<string, number> = {};
    let totalInc = 0;
    let totalExp = 0;

    activeTxnsForSheet.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'INCOME') {
        incMap[t.category] = (incMap[t.category] || 0) + amt;
        totalInc += amt;
      } else {
        expMap[t.category] = (expMap[t.category] || 0) + amt;
        totalExp += amt;
      }
    });

    const pendingSum = pendingTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      incomeByCategory: Object.entries(incMap).sort((a, b) => b[1] - a[1]),
      expenseByCategory: Object.entries(expMap).sort((a, b) => b[1] - a[1]),
      totalIncome: totalInc,
      totalExpense: totalExp,
      balance: totalInc - totalExp,
      pendingAmount: pendingSum
    };
  }, [activeTxnsForSheet, pendingTxns]);

  const template = activeMasjid.reportTemplate;

  return (
    <div className="space-y-6">
      {/* Screen Control Header */}
      <div className="no-print bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#CFDB95] text-[#2D4A3E]">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
              আর্থিক ব্যালেন্স শিট (Balance Sheet)
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            মসজিদের সর্বমোট সংগৃহীত আয় এবং ব্যয়ের নিরীক্ষিত ব্যালেন্স শিট। নিয়ম অনুযায়ী শুধুমাত্র সভাপতির অনুমোদনপ্রাপ্ত ভাউচারই চূড়ান্ত হিসাবে প্রতিফলিত হয়।
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {pendingTxns.length > 0 && (
            <label className="flex items-center gap-2 text-xs font-semibold text-[#3D3D3D] bg-[#F4F1EA] px-3 py-2 rounded-full border border-[#E0DCCF] cursor-pointer">
              <input
                type="checkbox"
                checked={includePendingAudit}
                onChange={e => setIncludePendingAudit(e.target.checked)}
                className="rounded border-[#CFDB95] text-[#2D4A3E] focus:ring-0"
              />
              <span>অপেক্ষমাণ ভাউচারসহ ড্রাফট দেখুন ({pendingTxns.length} টি)</span>
            </label>
          )}

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" />
            🖨️ ব্যালেন্স শিট প্রিন্ট করুন
          </button>
        </div>
      </div>

      {/* Audit Status Bar */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                চূড়ান্ত অডিট অন্তর্ভুক্ত ভাউচার: {approvedTxns.length} টি
              </span>
              <span className="text-[11px] text-emerald-700">
                সভাপতি কর্তৃক অনুমোদিত এবং মূল ব্যাংকিং ও ক্যাশবুক হিসেবে সংযুক্ত।
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
            অডিট পাস
          </span>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                অনুমোদন অপেক্ষমাণ ভাউচার: {pendingTxns.length} টি ({formatTaka(pendingAmount, { useBengaliDigits })})
              </span>
              <span className="text-[11px] text-amber-700">
                সভাপতির চূড়ান্ত অনুমোদনের পূর্বে মূল ব্যালেন্স শিটে যুক্ত হবে না।
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
            {includePendingAudit ? 'ড্রাফটে প্রদর্শিত' : 'হিসাববহির্ভূত'}
          </span>
        </div>
      </div>

      {/* Main Balance Sheet Paper Container */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Customized Report Header Pad */}
        <div className="text-center border-b-2 border-[#2D4A3E] pb-4 mb-6 space-y-1">
          <p className="text-xs font-serif-bn text-[#2D4A3E] font-semibold tracking-wider">
            {template?.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
          </p>

          <h1 className="text-xl sm:text-2xl font-bold font-serif-bn text-[#2D4A3E]">
            {template?.headerTitle || activeMasjid.name}
          </h1>

          <h3 className="text-sm font-bold text-[#5A5A40] font-serif-bn">
            {template?.subHeader ? `${template.subHeader} - ` : ''}আর্থিক ব্যালেন্স শিট (Balance Sheet)
          </h3>

          <p className="text-xs text-[#8A8A8A] font-medium">
            {template?.addressLine || activeMasjid.address}
          </p>

          <div className="text-[11px] text-[#8A8A8A] flex flex-wrap justify-center gap-x-4 pt-0.5">
            {template?.phoneLine && <span>মোবাইল: {template.phoneLine}</span>}
            {template?.registrationNo && <span>{template.registrationNo}</span>}
            <span>মুদ্রণ তারিখ: {formatDateTimeBengali(new Date().toISOString(), useBengaliDigits)}</span>
            <span className="text-emerald-800 font-bold">
              ({includePendingAudit ? 'ড্রাফট রিপোর্ট - অপেক্ষমাণসহ' : 'অফিসিয়াল অডিট রিপোর্ট - শুধুমাত্র সভাপতি অনুমোদিত'})
            </span>
          </div>
        </div>

        {/* Two-Column Balance Sheet Table */}
        <div className="border border-[#2D4A3E] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2D4A3E]">
            {/* Left Column: INCOME */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="bg-[#2D4A3E] text-[#E8EDDF] p-3 text-center font-bold text-sm">
                  আয় / সংগৃহীত জমা (Income)
                </div>
                <div className="p-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#F4F1EA] text-[#8A8A8A]">
                        <th className="py-2 text-left">খাত / বিবরণ</th>
                        <th className="py-2 text-right">পরিমাণ (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4F1EA]">
                      {incomeByCategory.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-[#8A8A8A]">
                            কোনো আয়ের রেকর্ড নেই।
                          </td>
                        </tr>
                      ) : (
                        incomeByCategory.map(([cat, amt], idx) => (
                          <tr key={idx} className="hover:bg-[#FBF9F6]">
                            <td className="py-2.5 font-medium text-[#3D3D3D]">{cat}</td>
                            <td className="py-2.5 text-right font-bold text-[#5A5A40]">
                              {formatTaka(amt, { useBengaliDigits })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Income Row */}
              <div className="bg-[#F4F1EA] border-t border-[#2D4A3E] p-3.5 flex justify-between items-center font-bold text-sm text-[#2D4A3E]">
                <span>সর্বমোট সংগৃহীত জমা:</span>
                <span className="text-base text-[#5A5A40]">{formatTaka(totalIncome, { useBengaliDigits })}</span>
              </div>
            </div>

            {/* Right Column: EXPENSES */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="bg-[#9A7E6F] text-[#E8EDDF] p-3 text-center font-bold text-sm">
                  ব্যয় / মসজিদ ও নির্মাণ খরচ (Expenses)
                </div>
                <div className="p-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#F4F1EA] text-[#8A8A8A]">
                        <th className="py-2 text-left">খাত / বিবরণ</th>
                        <th className="py-2 text-right">পরিমাণ (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4F1EA]">
                      {expenseByCategory.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-[#8A8A8A]">
                            কোনো ব্যয়ের রেকর্ড নেই।
                          </td>
                        </tr>
                      ) : (
                        expenseByCategory.map(([cat, amt], idx) => (
                          <tr key={idx} className="hover:bg-[#FBF9F6]">
                            <td className="py-2.5 font-medium text-[#3D3D3D]">{cat}</td>
                            <td className="py-2.5 text-right font-bold text-[#9A7E6F]">
                              {formatTaka(amt, { useBengaliDigits })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Expense Row */}
              <div className="bg-red-50/50 border-t border-[#2D4A3E] p-3.5 flex justify-between items-center font-bold text-sm text-[#9A7E6F]">
                <span>সর্বমোট খরচ:</span>
                <span className="text-base">{formatTaka(totalExpense, { useBengaliDigits })}</span>
              </div>
            </div>
          </div>

          {/* Grand Balance Footer Row */}
          <div className="bg-[#2D4A3E] text-[#E8EDDF] p-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#2D4A3E]">
            <div className="text-xs font-medium">
              কথায়: <span className="font-serif-bn font-bold text-[#CFDB95]">{numberToBengaliWords(balance)}</span>
            </div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>হাতে অবশিষ্ট ক্যাশ ফান্ড স্থিতি:</span>
              <span className="text-xl text-[#CFDB95] font-serif-bn">
                {formatTaka(balance, { useBengaliDigits })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        {template?.footerNote && (
          <p className="text-center text-xs text-[#8A8A8A] italic mt-6">
            {template.footerNote}
          </p>
        )}

        {/* Official 3-Tier Signatures Block */}
        <div className="pt-16 mt-8 border-t border-[#E0DCCF] grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t border-[#2D4A3E] pt-1.5 font-bold text-[#2D4A3E] font-serif-bn">
              {template?.signatory1 || 'আদায়কারী / হিসাবরক্ষক'}
            </div>
            <span className="text-[10px] text-[#8A8A8A]">স্বাক্ষর ও তারিখ</span>
          </div>

          <div className="space-y-1">
            <div className="border-t border-[#2D4A3E] pt-1.5 font-bold text-[#2D4A3E] font-serif-bn">
              {template?.signatory2 || 'ক্যাশিয়ার / কোষাধ্যক্ষ'}
            </div>
            <span className="text-[10px] text-[#8A8A8A]">স্বাক্ষর ও তারিখ</span>
          </div>

          <div className="space-y-1">
            <div className="border-t border-[#2D4A3E] pt-1.5 font-bold text-[#2D4A3E] font-serif-bn">
              {template?.signatory3 || 'সভাপতি / মুতাওয়াল্লী'}
            </div>
            <span className="text-[10px] text-[#8A8A8A]">চূড়ান্ত অনুমোদন ও তারিখ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
