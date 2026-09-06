import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import { numberToBengaliWords, formatTaka, toBengaliNumber } from '../../utils/bengaliUtils';
import {
  FileCheck,
  CheckCircle2,
  Printer,
  Calendar,
  DollarSign,
  User,
  Phone,
  FileText,
  CreditCard,
  Building2,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

interface TransactionEntryFormProps {
  onTransactionAdded?: (voucherNo: string) => void;
  onViewVoucher?: (voucherNo: string) => void;
  onNavigateToCashbook?: () => void;
}

export const TransactionEntryForm: React.FC<TransactionEntryFormProps> = ({
  onTransactionAdded,
  onViewVoucher,
  onNavigateToCashbook
}) => {
  const { activeMasjid, members, addTransaction, currentUser, transactions, useBengaliDigits } = useApp();

  const nowString = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  const [dateTime, setDateTime] = useState(nowString);
  const [type, setType] = useState<TransactionType>('INCOME');
  const [selectedCategory, setSelectedCategory] = useState('জুমার ক্যাশ কালেকশন');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [personOption, setPersonOption] = useState('');
  const [customPerson, setCustomPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ক্যাশ (নগদ)' | 'ব্যাংক হিসাব' | 'বিকাশ / নগদ (মোবাইল ব্যাংকিং)'>('ক্যাশ (নগদ)');
  const [bankOrMfsDetails, setBankOrMfsDetails] = useState('');
  const [note, setNote] = useState('');

  const [lastVoucherNo, setLastVoucherNo] = useState<string | null>(null);
  const [lastSavedAmount, setLastSavedAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!activeMasjid) return null;

  const mosqueMembers = members.filter(m => m.masjidId === activeMasjid.id);

  // Calculate upcoming prospective voucher number
  const upcomingVoucherNo = useMemo(() => {
    const year = new Date(dateTime || Date.now()).getFullYear();
    const existingCount = transactions.filter(t => t.masjidId === activeMasjid.id && t.type === type).length;
    const prefix = type === 'INCOME' ? 'INC' : 'EXP';
    return `${prefix}-${year}-${String(existingCount + 1).padStart(4, '0')}`;
  }, [dateTime, type, transactions, activeMasjid.id]);

  const numericAmount = parseFloat(amount);
  const inWordsText = !isNaN(numericAmount) && numericAmount > 0 ? numberToBengaliWords(numericAmount) : '';

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'INCOME') {
      setSelectedCategory(activeMasjid.categories?.income[0] || 'জুমার ক্যাশ কালেকশন');
    } else {
      const firstGroup = activeMasjid.categories?.expenseGroups?.[0];
      setSelectedCategory(firstGroup?.items[0] || '🏗️ ইট / বালু / রড / সিমেন্ট');
    }
  };

  const handlePersonOptionChange = (val: string) => {
    setPersonOption(val);
    if (val === 'CUSTOM') {
      setCustomPerson('');
      setPhone('');
    } else if (val) {
      const selectedMember = mosqueMembers.find(m => m.id === val);
      if (selectedMember) {
        setCustomPerson(selectedMember.name);
        setPhone(selectedMember.phone || '');
      }
    } else {
      setCustomPerson('');
      setPhone('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('টাকার পরিমাণ সঠিকভাবে লিখুন (০ এর চেয়ে বেশি হতে হবে)।');
      return;
    }

    let finalCategory = selectedCategory;
    if (selectedCategory === 'CUSTOM' || selectedCategory.includes('নিজের মতো')) {
      finalCategory = customCategory.trim() || 'অন্যান্য খাত';
    }

    let finalPerson = type === 'INCOME' ? 'সাধারণ দাতা / মুসুল্লি' : 'দোকানদার / সেবা প্রদানকারী';
    let memberId: string | undefined = undefined;

    if (personOption && personOption !== 'CUSTOM') {
      const member = mosqueMembers.find(m => m.id === personOption);
      if (member) {
        finalPerson = `${member.name} (${member.id})`;
        memberId = member.id;
      }
    } else if (customPerson.trim()) {
      finalPerson = customPerson.trim();
    }

    // Combine notes with payment details if provided
    let combinedNote = note.trim();
    if (bankOrMfsDetails.trim()) {
      combinedNote = combinedNote
        ? `${combinedNote} [রেফারেন্স: ${bankOrMfsDetails.trim()}]`
        : `[রেফারেন্স: ${bankOrMfsDetails.trim()}]`;
    }

    setIsSubmitting(true);

    const result = addTransaction({
      masjidId: activeMasjid.id,
      date: dateTime || new Date().toISOString(),
      type,
      category: finalCategory,
      amount: numericAmount,
      person: finalPerson,
      memberId,
      phone: phone.trim() || 'N/A',
      paymentMethod,
      note: combinedNote,
      createdBy: currentUser ? currentUser.email : 'System'
    });

    setIsSubmitting(false);

    if (result.success) {
      setLastVoucherNo(result.voucherNo);
      setLastSavedAmount(numericAmount);
      setSuccessMsg(`ভাউচার সফলভাবে সেভ ও ক্যাশবুকে যুক্ত হয়েছে! ভাউচার নং: ${result.voucherNo}`);
      // reset input values for new entry
      setAmount('');
      setNote('');
      setBankOrMfsDetails('');
      setCustomCategory('');
      setCustomPerson('');
      setPersonOption('');
      setPhone('');

      if (onTransactionAdded) {
        onTransactionAdded(result.voucherNo);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header Card with Live Voucher Number Badge */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${
              type === 'INCOME' ? 'bg-[#CFDB95] text-[#2D4A3E]' : 'bg-[#9A7E6F] text-white'
            }`}>
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
                  {type === 'INCOME' ? 'নতুন জমা ভাউচার এন্ট্রি (Credit Voucher)' : 'নতুন ব্যয় ভাউচার এন্ট্রি (Debit Voucher)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FAF8F5] border border-[#E0DCCF] text-[#2D4A3E]">
                  ভাউচার নং: {upcomingVoucherNo}
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                মসজিদ: <span className="font-semibold text-[#2D4A3E]">{activeMasjid.name}</span> • এই ভাউচারের হিসাব স্বয়ংক্রিয়ভাবে ক্যাশবুক ও ব্যালেন্স শিটে যুক্ত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Type Toggle Switcher */}
        <div className="flex items-center bg-[#F4F1EA] p-1.5 rounded-full border border-[#E0DCCF] shrink-0">
          <button
            type="button"
            id="voucher-type-income-btn"
            onClick={() => handleTypeChange('INCOME')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              type === 'INCOME'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'text-[#3D3D3D] hover:text-black'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-[#CFDB95]" />
            জমা ভাউচার (আয়)
          </button>
          <button
            type="button"
            id="voucher-type-expense-btn"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              type === 'EXPENSE'
                ? 'bg-[#9A7E6F] text-white shadow-xs'
                : 'text-[#3D3D3D] hover:text-black'
            }`}
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-white" />
            ব্যয় ভাউচার (খরচ)
          </button>
        </div>
      </div>

      {/* 2. Success Notification Alert with Instant Print & Action */}
      {successMsg && (
        <div className="bg-[#FAF8F5] border-2 border-[#2D4A3E] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#CFDB95] rounded-2xl text-[#2D4A3E] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D4A3E] font-serif-bn">{successMsg}</p>
              <p className="text-xs text-[#5A5A40] mt-0.5">
                দৈনিক ক্যাশবুক, ব্যালেন্স শিট এবং ড্যাশবোর্ড ফান্ডে {lastSavedAmount ? formatTaka(lastSavedAmount, { useBengaliDigits }) : ''} সফলভাবে যুক্ত হয়েছে।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lastVoucherNo && onViewVoucher && (
              <button
                id="voucher-print-now-btn"
                onClick={() => onViewVoucher(lastVoucherNo)}
                className="px-4 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <Printer className="w-4 h-4 text-[#CFDB95]" />
                অফিসিয়াল স্লিপ প্রিন্ট করুন
              </button>
            )}
            {onNavigateToCashbook && (
              <button
                onClick={onNavigateToCashbook}
                className="px-3.5 py-2.5 rounded-full bg-white border border-[#E0DCCF] hover:bg-[#F4F1EA] text-[#3D3D3D] text-xs font-semibold"
              >
                ক্যাশবুক দেখুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Voucher Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Row 1: Date/Time, Voucher Type, Account Head (Category) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8A8A8A]" />
              ভাউচারের তারিখ ও সময়: *
            </label>
            <input
              type="datetime-local"
              required
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-medium text-[#3D3D3D]"
            />
          </div>

          {/* Prospective Voucher No */}
          <div>
            <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#8A8A8A]" />
              অটো ভাউচার সিরিয়াল নং:
            </label>
            <input
              type="text"
              readOnly
              value={upcomingVoucherNo}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#E0DCCF] rounded-xl font-mono font-bold text-[#2D4A3E] cursor-not-allowed"
            />
          </div>

          {/* Category / Account Head */}
          <div>
            <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8A8A8A]" />
              হিসাব খাত (Account Head): *
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-medium text-[#3D3D3D]"
            >
              {type === 'INCOME' ? (
                <>
                  {activeMasjid.categories?.income.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="CUSTOM">✍️ অন্যান্য / নিজের মতো নতুন খাতের নাম লিখুন</option>
                </>
              ) : (
                <>
                  {activeMasjid.categories?.expenseGroups.map((group, gIdx) => (
                    <optgroup key={gIdx} label={group.groupName}>
                      {group.items.map((item, iIdx) => (
                        <option key={iIdx} value={item}>
                          {item}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="CUSTOM">✍️ অন্যান্য / নিজের মতো নতুন ব্যয়ের নাম লিখুন</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Custom Category Input (If custom chosen) */}
        {(selectedCategory === 'CUSTOM' || selectedCategory.includes('নিজের মতো')) && (
          <div className="p-4 bg-[#FAF8F5] border border-[#CFDB95] rounded-2xl">
            <label className="block text-xs font-bold text-[#2D4A3E] mb-1">
              আপনার নিজস্ব খাতের নাম লিখুন:*
            </label>
            <input
              type="text"
              required
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              placeholder="যেমন: নতুন আইপিএস ব্যাটারি ক্রয়, গ্লাস ফিটিংস, কোরআন শরিফ ক্রয় ইত্যাদি"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
            />
          </div>
        )}

        {/* Row 2: Amount & Live In-Words */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#2D4A3E]" />
                টাকার পরিমাণ (৳ অংকে): *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="যেমন: 5000"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-bold text-[#2D4A3E]"
              />
            </div>

            {/* Payment Method */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#8A8A8A]" />
                পরিশোধ / জমা মাধ্যম: *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
              >
                <option value="ক্যাশ (নগদ)">ক্যাশ (নগদ টাকা)</option>
                <option value="ব্যাংক হিসাব">ব্যাংক হিসাব (চেক / অনলাইন ট্রান্সফার)</option>
                <option value="বিকাশ / নগদ (মোবাইল ব্যাংকিং)">বিকাশ / নগদ (মোবাইল ব্যাংকিং)</option>
              </select>
            </div>

            {/* Donor / Recipient from List */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8A8A8A]" />
                {type === 'INCOME' ? 'সদস্য তালিকা থেকে নির্বাচন:' : 'নিয়মিত গ্রহীতা নির্বাচন:'}
              </label>
              <select
                value={personOption}
                onChange={e => handlePersonOptionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
              >
                <option value="">-- তালিকা থেকে নির্বাচন করুন --</option>
                {mosqueMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id}) {m.phone ? `- ${m.phone}` : ''}
                  </option>
                ))}
                <option value="CUSTOM">✍️ অন্যান্য / নতুন ব্যক্তি বা প্রতিষ্ঠান</option>
              </select>
            </div>
          </div>

          {/* Automatic In-Words Bengali Live Preview */}
          {inWordsText && (
            <div className="p-3 bg-[#FAF8F5] border border-[#CFDB95] rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2D4A3E] shrink-0">কথায় টাকা:</span>
                <span className="font-serif-bn font-bold text-[#2D4A3E]">{inWordsText}</span>
              </div>
              <span className="text-[11px] text-[#5A5A40] hidden sm:inline">
                (অটোমেটিক ভাউচার রসিদে যুক্ত হবে)
              </span>
            </div>
          )}
        </div>

        {/* Conditional Bank / Mobile Banking details */}
        {paymentMethod !== 'ক্যাশ (নগদ)' && (
          <div className="p-4 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl">
            <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">
              {paymentMethod === 'ব্যাংক হিসাব'
                ? 'ব্যাংকের নাম, একাউন্ট নং ও চেক নং / ডিপোজিট স্লিপ নং লিখুন:'
                : 'মোবাইল ওয়ালেট নম্বর ও ট্রানজেকশন আইডি (TrxID) লিখুন:'}
            </label>
            <input
              type="text"
              value={bankOrMfsDetails}
              onChange={e => setBankOrMfsDetails(e.target.value)}
              placeholder={
                paymentMethod === 'ব্যাংক হিসাব'
                  ? 'যেমন: ইসলামী ব্যাংক, হিসাব নং: ২০৫০১২৩৪৫৬৭৮, চেক নং: ৮৭৬৫৪৩২'
                  : 'যেমন: বিকাশ মার্চেন্ট / পার্সোনাল ০১৮১২-XXXXXX, TrxID: 9LKA7219'
              }
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
            />
          </div>
        )}

        {/* Custom Person & Phone Input (if not selected from member list) */}
        {(personOption === 'CUSTOM' || !personOption) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8A8A8A]" />
                {type === 'INCOME' ? 'দাতার পূর্ণ নাম:' : 'গ্রহীতা বা প্রতিষ্ঠানের নাম:'}
              </label>
              <input
                type="text"
                value={customPerson}
                onChange={e => setCustomPerson(e.target.value)}
                placeholder={type === 'INCOME' ? 'যেমন: হাজী মো. নূরুল ইসলাম / সাধারণ মুসুল্লিয়ানে কেরাম' : 'যেমন: মেসার্স ভাই ভাই হার্ডওয়্যার / মো. করিম ইলেকট্রিশিয়ান'}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                মোবাইল নম্বর:
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="০১৭১১-XXXXXX"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
              />
            </div>
          </div>
        )}

        {/* Note / Description */}
        <div>
          <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#8A8A8A]" />
            ভাউচারের সংক্ষিপ্ত বিবরণ / উদ্দেশ্য:
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="যেমন: মসজিদের দ্বিতীয় তলার ছাদ ঢালাইয়ের জন্য বিশেষ অনুদান / জুলাই মাসের বিদ্যুৎ বিল পরিশোধ"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
          />
        </div>

        {/* Accounting Flow Assurance Box */}
        <div className="p-4 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl text-xs text-[#5A5A40] flex items-center gap-2.5">
          <FileCheck className="w-5 h-5 text-[#2D4A3E] shrink-0" />
          <span>
            <b>অটো হিসাব নিশ্চয়তা:</b> ভাউচারটি সংরক্ষণের সাথে সাথে <b>দৈনিক ক্যাশবুক</b>, <b>মাসিক অডিট লেজার</b> এবং <b>ব্যালেন্স শিটে</b> আয়-ব্যয়ের হিসাব স্বয়ংক্রিয়ভাবে আপডেট হবে।
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="save-voucher-btn"
          className={`w-full py-3.5 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
            type === 'INCOME'
              ? 'bg-[#2D4A3E] hover:bg-[#3D5E50]'
              : 'bg-[#9A7E6F] hover:bg-[#866a5c]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSubmitting ? 'সংরক্ষিত হচ্ছে...' : type === 'INCOME' ? 'জমা ভাউচার সেভ ও ক্যাশবুকে যুক্ত করুন' : 'ব্যয় ভাউচার সেভ ও ক্যাশবুকে যুক্ত করুন'}
        </button>
      </form>
    </div>
  );
};
