import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka, formatDateTimeBengali, numberToBengaliWords } from '../../utils/bengaliUtils';
import {
  Printer,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Award,
  Check,
  RotateCcw
} from 'lucide-react';

interface VoucherPrintModalProps {
  voucherNo: string;
  onClose: () => void;
}

export const VoucherPrintModal: React.FC<VoucherPrintModalProps> = ({ voucherNo, onClose }) => {
  const { transactions, activeMasjid, useBengaliDigits, currentUser, approveVoucherTier } = useApp();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const txn = transactions.find(t => t.voucherNo === voucherNo);

  if (!txn || !activeMasjid) return null;

  const template = activeMasjid.reportTemplate;
  const isIncome = txn.type === 'INCOME';

  const collectorApproved = Boolean(txn.collectorApproval?.approved);
  const cashierApproved = Boolean(txn.cashierApproval?.approved);
  const presidentApproved = Boolean(txn.presidentApproval?.approved);

  const allApproved = collectorApproved && cashierApproved && presidentApproved;

  // Check current user authority for each tier
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isMosqueAdmin = currentUser?.role === 'MOSQUE_ADMIN' && currentUser.masjidId === txn.masjidId;
  const canApproveCollector = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'COLLECTOR' && currentUser.masjidId === txn.masjidId);
  const canApproveCashier = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'CASHIER' && currentUser.masjidId === txn.masjidId);
  const canApprovePresident = isSuperAdmin || isMosqueAdmin || (currentUser?.committeeRole === 'PRESIDENT' && currentUser.masjidId === txn.masjidId);

  const handleApprovalAction = (tier: 'collector' | 'cashier' | 'president', approved: boolean) => {
    const res = approveVoucherTier({
      transactionId: txn.id,
      tier,
      approved
    });
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D4A3E]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[96vh] overflow-y-auto border border-[#E0DCCF]">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-[#F4F1EA] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[#2D4A3E] font-serif-bn flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-[#2D4A3E]" />
              ভাউচার অনুমোদন ও প্রিন্ট প্রিভিউ: <span className="font-mono">{txn.voucherNo}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
                allApproved
                  ? 'bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF]'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              title={
                allApproved
                  ? 'সম্পূর্ণ অনুমোদিত ভাউচার প্রিন্ট করুন'
                  : 'সতর্কতা: এখনো সব অনুমোদন সম্পন্ন হয়নি'
              }
            >
              <Printer className="w-3.5 h-3.5" />
              {allApproved ? 'চূড়ান্ত প্রিন্ট / PDF' : 'খসড়া প্রিন্ট / PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F4F1EA] text-[#8A8A8A] hover:text-[#3D3D3D] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if any */}
        {feedbackMsg && (
          <div
            className={`no-print p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-current opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3-Tier Approval Workflow Status Bar (Hidden on print) */}
        <div className="no-print bg-[#FBF9F6] border border-[#E0DCCF] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-[#2D4A3E] flex items-center gap-1.5 font-serif-bn">
              <span>📋</span> ৩-স্তরীয় ভাউচার অনুমোদন নিরীক্ষা (Collector → Cashier → President):
            </span>

            {presidentApproved ? (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                মূল হিসাবে অন্তর্ভুক্ত (সভাপতি অনুমোদিত)
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                অননুমোদিত (হিসাবের বাইরে রক্ষিত)
              </span>
            )}
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. Collector Approval */}
            <div className={`p-3 rounded-xl border transition-all ${
              collectorApproved
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold flex items-center gap-1">
                  <span>১.</span> আদায়কারী / এন্ট্রিকারক
                </span>
                {collectorApproved ? (
                  <span className="p-0.5 rounded-full bg-emerald-600 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-700">
                <p><b>অবস্থা:</b> {collectorApproved ? 'অনুমোদিত ও স্বাক্ষরিত' : 'অপেক্ষমাণ'}</p>
                {txn.collectorApproval?.approvedBy && (
                  <p className="truncate"><b>স্বাক্ষরকারী:</b> {txn.collectorApproval.approvedBy}</p>
                )}
              </div>

              {canApproveCollector && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  {!collectorApproved ? (
                    <button
                      onClick={() => handleApprovalAction('collector', true)}
                      className="w-full py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3" /> আদায়কারী স্বাক্ষর দিন
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprovalAction('collector', false)}
                      className="w-full py-1 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-medium flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> স্বাক্ষর প্রত্যাহার
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. Cashier Approval */}
            <div className={`p-3 rounded-xl border transition-all ${
              cashierApproved
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold flex items-center gap-1">
                  <span>২.</span> ক্যাশিয়ার নিরীক্ষণ
                </span>
                {cashierApproved ? (
                  <span className="p-0.5 rounded-full bg-emerald-600 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-700">
                <p><b>অবস্থা:</b> {cashierApproved ? 'যাচাই ও অনুমোদিত' : 'অপেক্ষমাণ'}</p>
                {txn.cashierApproval?.approvedBy && (
                  <p className="truncate"><b>যাচাইকারী:</b> {txn.cashierApproval.approvedBy}</p>
                )}
              </div>

              {canApproveCashier && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  {!cashierApproved ? (
                    <button
                      onClick={() => handleApprovalAction('cashier', true)}
                      className="w-full py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3" /> ক্যাশিয়ার অনুমোদন দিন
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprovalAction('cashier', false)}
                      className="w-full py-1 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-medium flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> অনুমোদন প্রত্যাহার
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. President Approval (Highest Authority) */}
            <div className={`p-3 rounded-xl border transition-all ${
              presidentApproved
                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300'
                : 'bg-amber-50/60 border-amber-300 text-amber-950 ring-1 ring-amber-300'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold flex items-center gap-1">
                  <span>👑 ৩.</span> সভাপতি চূড়ান্ত অনুমোদন
                </span>
                {presidentApproved ? (
                  <span className="p-0.5 rounded-full bg-emerald-600 text-white">
                    <Award className="w-3 h-3" />
                  </span>
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-700">
                <p><b>অবস্থা:</b> {presidentApproved ? 'চূড়ান্ত অনুমোদিত (হিসাবে যুক্ত)' : 'অননুমোদিত (হিসাবে অপ্রবেশযোগ্য)'}</p>
                {txn.presidentApproval?.approvedBy && (
                  <p className="truncate"><b>অনুমোদনকারী:</b> {txn.presidentApproval.approvedBy}</p>
                )}
              </div>

              {canApprovePresident && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  {!presidentApproved ? (
                    <button
                      onClick={() => handleApprovalAction('president', true)}
                      className="w-full py-1 px-2.5 rounded-lg bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Award className="w-3 h-3 text-[#CFDB95]" /> সভাপতি হিসেবে অনুমোদন দিন
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprovalAction('president', false)}
                      className="w-full py-1 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-medium flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> অনুমোদন স্থগিত করুন
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* President Rule Notice */}
          {!presidentApproved && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">গুরুত্বপূর্ণ হিসাব নীতি:</p>
                <p>
                  স্ব স্ব মসজিদের সভাপতি মহোদয়ের প্রোফাইল থেকে অনুমোদন ব্যতিত কোনো ভাউচার মূল ক্যাশবুক বা ব্যালেন্স শিটের হিসাবে যুক্ত হবে না। এটি বর্তমানে <b>অননুমোদিত ও স্থগিত</b> অবস্থায় রয়েছে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Printable Voucher Paper */}
        <div className="relative border-2 border-[#2D4A3E] rounded-2xl p-6 sm:p-8 space-y-5 bg-white print:border-slate-800">
          {/* Watermark for non-approved vouchers on print */}
          {!presidentApproved && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none overflow-hidden">
              <span className="text-4xl sm:text-6xl font-black font-serif-bn text-rose-800 -rotate-25 tracking-widest border-4 border-rose-800 p-6 rounded-2xl">
                অননুমোদিত খসড়া / PENDING
              </span>
            </div>
          )}

          {/* Pad Header */}
          <div className="text-center border-b border-[#2D4A3E] pb-3 space-y-1">
            <p className="text-xs font-serif-bn text-[#2D4A3E] font-semibold tracking-wider">
              {template?.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
            </p>
            <h2 className="text-xl font-bold font-serif-bn text-[#2D4A3E]">
              {template?.headerTitle || activeMasjid.name}
            </h2>
            <p className="text-xs text-[#8A8A8A] font-medium">
              {template?.addressLine || activeMasjid.address}
            </p>
            {template?.phoneLine && (
              <p className="text-[11px] text-[#8A8A8A]">
                মোবাইল: {template.phoneLine} {template?.registrationNo && `• ${template.registrationNo}`}
              </p>
            )}

            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold font-serif-bn border ${
                isIncome
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {isIncome ? 'মানি রিসিট / জমা রশিদ' : 'ব্যয় ভাউচার স্লিপ'}
              </span>

              {presidentApproved ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  হিসাবে অন্তর্ভুক্ত (সভাপতি কর্তৃক চূড়ান্ত অনুমোদিত)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-700" />
                  অপেক্ষমাণ ভাউচার (অননুমোদিত - হিসাবে অপ্রবেশযোগ্য)
                </span>
              )}
            </div>
          </div>

          {/* Voucher Info Meta */}
          <div className="flex justify-between text-xs border-b border-[#F4F1EA] pb-2 text-[#3D3D3D]">
            <div>
              <b>ভাউচার নং:</b> <span className="font-mono font-bold text-[#2D4A3E]">{txn.voucherNo}</span>
            </div>
            <div>
              <b>তারিখ ও সময়:</b> {formatDateTimeBengali(txn.date, useBengaliDigits)}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FBF9F6] p-4 rounded-xl border border-[#E0DCCF]">
              <div>
                <span className="text-[#8A8A8A]">{isIncome ? 'দাতার নাম:' : 'গ্রহীতার নাম:'}</span>
                <p className="font-bold text-[#3D3D3D] text-sm font-serif-bn">{txn.person}</p>
              </div>
              <div>
                <span className="text-[#8A8A8A]">মোবাইল নম্বর:</span>
                <p className="font-semibold text-[#3D3D3D]">{txn.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[#8A8A8A]">খাত / বিবরণ:</span>
                <p className="font-bold text-[#3D3D3D]">{txn.category}</p>
              </div>
              <div>
                <span className="text-[#8A8A8A]">পেমেন্ট মাধ্যম:</span>
                <p className="font-semibold text-[#3D3D3D]">{txn.paymentMethod}</p>
              </div>
            </div>

            {txn.note && (
              <div className="p-3 bg-[#FBF9F6] rounded-xl border border-[#E0DCCF]">
                <span className="text-[#8A8A8A] block text-[11px]">সংক্ষিপ্ত নোট / বিবরণ:</span>
                <p className="font-medium text-[#3D3D3D]">{txn.note}</p>
              </div>
            )}

            {/* Amount Box */}
            <div className="p-4 bg-[#F4F1EA] border border-[#2D4A3E] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-[#2D4A3E] font-bold block">কথায় (টাকা):</span>
                <span className="font-serif-bn font-bold text-[#2D4A3E] text-sm">
                  {numberToBengaliWords(txn.amount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#2D4A3E] font-bold block">মোট পরিমাণ:</span>
                <span className="text-xl font-bold font-serif-bn text-[#2D4A3E]">
                  {formatTaka(txn.amount, { useBengaliDigits })}
                </span>
              </div>
            </div>
          </div>

          {/* 3-Tier Official Signatures & Digital Seals */}
          <div className="pt-8 grid grid-cols-3 gap-3 sm:gap-4 text-center text-[11px] text-[#3D3D3D]">
            {/* 1. Collector Stamp */}
            <div className="flex flex-col justify-end">
              <div className="min-h-[48px] flex flex-col items-center justify-center mb-1">
                {collectorApproved ? (
                  <div className="border border-emerald-500 bg-emerald-50/80 rounded-lg px-2 py-1 text-emerald-900 text-[10px] leading-tight font-medium">
                    <span className="font-bold text-emerald-800 block">✓ ডিজিটাল স্বাক্ষরিত</span>
                    <span>{txn.collectorApproval?.approvedBy || 'আদায়কারী'}</span>
                  </div>
                ) : (
                  <span className="text-amber-700 text-[10px] italic">স্বাক্ষরের অপেক্ষায়...</span>
                )}
              </div>
              <div className="border-t border-[#2D4A3E] pt-1 font-bold">
                {template?.signatory1 || 'আদায়কারী / এন্ট্রিকারক'}
              </div>
              <span className="text-[10px] text-[#8A8A8A]">অর্থ সংগ্রহ ও প্রস্তুতকারী</span>
            </div>

            {/* 2. Cashier Stamp */}
            <div className="flex flex-col justify-end">
              <div className="min-h-[48px] flex flex-col items-center justify-center mb-1">
                {cashierApproved ? (
                  <div className="border border-emerald-500 bg-emerald-50/80 rounded-lg px-2 py-1 text-emerald-900 text-[10px] leading-tight font-medium">
                    <span className="font-bold text-emerald-800 block">✓ অর্থ নিরীক্ষিত ও অনুমোদিত</span>
                    <span>{txn.cashierApproval?.approvedBy || 'ক্যাশিয়ার'}</span>
                  </div>
                ) : (
                  <span className="text-amber-700 text-[10px] italic">নিরীক্ষার অপেক্ষায়...</span>
                )}
              </div>
              <div className="border-t border-[#2D4A3E] pt-1 font-bold">
                {template?.signatory2 || 'ক্যাশিয়ার'}
              </div>
              <span className="text-[10px] text-[#8A8A8A]">তহবিল নিরীক্ষক</span>
            </div>

            {/* 3. President Seal (Final Authority) */}
            <div className="flex flex-col justify-end">
              <div className="min-h-[48px] flex flex-col items-center justify-center mb-1">
                {presidentApproved ? (
                  <div className="border-2 border-[#2D4A3E] bg-[#CFDB95]/40 rounded-lg px-2 py-1 text-[#2D4A3E] text-[10px] leading-tight font-bold shadow-2xs">
                    <span className="text-[#2D4A3E] block">★ চূড়ান্ত অনুমোদিত ও অন্তর্ভুক্ত ★</span>
                    <span>{txn.presidentApproval?.approvedBy || 'সভাপতি'}</span>
                  </div>
                ) : (
                  <span className="text-rose-700 text-[10px] font-bold bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                    অননুমোদিত (হিসাবে যুক্ত নয়)
                  </span>
                )}
              </div>
              <div className="border-t-2 border-[#2D4A3E] pt-1 font-bold text-[#2D4A3E]">
                {template?.signatory3 || 'সভাপতি / মুতাওয়াল্লী'}
              </div>
              <span className="text-[10px] text-[#8A8A8A]">চূড়ান্ত অনুমোদনকারী কর্তৃপক্ষ</span>
            </div>
          </div>

          {template?.footerNote && (
            <p className="text-center text-[10px] text-[#8A8A8A] italic pt-2 border-t border-[#F4F1EA]">
              {template.footerNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
