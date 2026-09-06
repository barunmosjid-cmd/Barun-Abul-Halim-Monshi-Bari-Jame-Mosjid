import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Landmark,
  User,
  Phone,
  Mail,
  KeyRound,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface RegistrationPortalProps {
  onNavigateToLogin?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToSuperAdmin?: () => void;
  onNavigateToUserApproval?: () => void;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({
  onNavigateToLogin,
  onNavigateToDashboard,
  onNavigateToSuperAdmin,
  onNavigateToUserApproval
}) => {
  const { registerMosqueAndAdmin, registerGeneralUser, mosques, quickLoginAs } = useApp();

  const [activeType, setActiveType] = useState<'ADMIN' | 'USER'>('ADMIN');

  // Mosque & Admin Form State
  const [mName, setMName] = useState('');
  const [mDistrict, setMDistrict] = useState('চাঁদপুর');
  const [mUpazila, setMUpazila] = useState('চাঁদপুর সদর');
  const [mAddress, setMAddress] = useState('');
  const [mYear, setMYear] = useState('১৯৯৫');
  const [mPhone, setMPhone] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mRegNo, setMRegNo] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('সাধারণ সম্পাদক');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // General User Form State
  const [selectedMasjidId, setSelectedMasjidId] = useState(mosques[0]?.id || '');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userRoleNote, setUserRoleNote] = useState('নিয়মিত মুসুল্লি ও সাধারণ দাতা');

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    type: 'ADMIN' | 'USER';
    title: string;
    details: string;
    approverText: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsSubmitting(true);

    const res = registerMosqueAndAdmin({
      mosqueName: mName,
      district: mDistrict,
      upazila: mUpazila,
      address: mAddress,
      contactPhone: mPhone,
      contactEmail: mEmail,
      establishedYear: mYear,
      adminName: `${adminName} (${adminDesignation})`,
      adminEmail,
      adminPhone,
      adminPassword: adminPass
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessInfo({
        type: 'ADMIN',
        title: 'মসজিদ ও এডমিন রেজিস্ট্রেশন আবেদন সফল!',
        details: `"${mName}" এবং এডমিন "${adminName}" এর অ্যাকাউন্ট সফলভাবে সংরক্ষিত হয়েছে।`,
        approverText: 'কেন্দ্রীয় সুপার এডমিন (Super Admin)'
      });
      // reset form
      setMName('');
      setMAddress('');
      setMPhone('');
      setMEmail('');
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
      setAdminPass('');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleUserRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsSubmitting(true);

    const res = registerGeneralUser({
      name: `${userName} [${userRoleNote}]`,
      email: userEmail,
      phone: userPhone,
      password: userPass,
      masjidId: selectedMasjidId
    });

    setIsSubmitting(false);

    const targetMosque = mosques.find(m => m.id === selectedMasjidId);

    if (res.success) {
      setSuccessInfo({
        type: 'USER',
        title: 'ইউজার রেজিস্ট্রেশন আবেদন সফল!',
        details: `"${userName}" এর ইউজার আবেদন "${targetMosque?.name || 'মসজিদ'}"-এর অধীনে সংরক্ষিত হয়েছে।`,
        approverText: `${targetMosque?.name || 'মসজিদ'}-এর এডমিন`
      });
      // reset form
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setUserPass('');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] text-[#2D4A3E] border border-[#E0DCCF] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#CFDB95]" />
              কেন্দ্রীয় মসজিদ হিসাব নিবন্ধন ও একাউন্ট পোর্টাল
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D4A3E] font-serif-bn">
              এডমিন ও ইউজার রেজিস্ট্রেশন ফরম
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A40] mt-1 max-w-2xl leading-relaxed">
              সুপার এডমিনের অনুমোদন সাপেক্ষে মসজিদ এডমিন এবং মসজিদ এডমিনের অনুমোদন সাপেক্ষে সাধারণ ইউজারগণ এই সফটওয়্যার ব্যবহার করতে পারবেন।
            </p>
          </div>

          {/* Type Toggle Pills */}
          <div className="flex bg-[#F4F1EA] p-1.5 rounded-full border border-[#E0DCCF] shrink-0">
            <button
              type="button"
              id="reg-tab-admin-btn"
              onClick={() => {
                setActiveType('ADMIN');
                setErrorMessage(null);
                setSuccessInfo(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === 'ADMIN'
                  ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs'
                  : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              ১. মসজিদ এডমিন ফরম
            </button>
            <button
              type="button"
              id="reg-tab-user-btn"
              onClick={() => {
                setActiveType('USER');
                setErrorMessage(null);
                setSuccessInfo(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === 'USER'
                  ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs'
                  : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              ২. সাধারণ ইউজার ফরম
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Explanation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-3xl border transition-all ${
          activeType === 'ADMIN'
            ? 'bg-[#FAF8F5] border-[#2D4A3E] ring-1 ring-[#2D4A3E]/30'
            : 'bg-white border-[#E0DCCF] opacity-75'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#2D4A3E] text-[#CFDB95] flex items-center justify-center font-bold text-xs">
              ১
            </div>
            <h3 className="text-sm font-bold text-[#2D4A3E] font-serif-bn">
              মসজিদ এডমিন অনুমোদন প্রক্রিয়া
            </h3>
          </div>
          <p className="text-xs text-[#5A5A40] leading-relaxed">
            নতুন মসজিদের তথ্য ও এডমিনের আবেদন জমা দেওয়ার পর <b>জাতীয় সুপার এডমিনের</b> ড্যাশবোর্ডে যাবে। সুপার এডমিন যাচাই করে অনুমোদন (Approve) দিলে এডমিন লগইন করে মসজিদের ড্যাশবোর্ড, ক্যাশবুক, মেম্বার লেজার ও ভাউচার পরিচালনা করতে পারবেন।
          </p>
        </div>

        <div className={`p-5 rounded-3xl border transition-all ${
          activeType === 'USER'
            ? 'bg-[#FAF8F5] border-[#2D4A3E] ring-1 ring-[#2D4A3E]/30'
            : 'bg-white border-[#E0DCCF] opacity-75'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#9A7E6F] text-white flex items-center justify-center font-bold text-xs">
              ২
            </div>
            <h3 className="text-sm font-bold text-[#2D4A3E] font-serif-bn">
              সাধারণ ইউজার অনুমোদন প্রক্রিয়া
            </h3>
          </div>
          <p className="text-xs text-[#5A5A40] leading-relaxed">
            মুসুল্লি, দাতা বা সাধারণ ব্যবহারকারী হিসেবে রেজিস্ট্রেশনের পর আপনার আবেদনটি সংশ্লিষ্ট <b>মসজিদ এডমিনের</b> অনুমোদন টেবিলে যাবে। এডমিন অনুমোদন দেওয়া মাত্রই ইউজার লগইন করে ওই মসজিদের আয়-ব্যয় ভাউচার ও ব্যালেন্স শিট দেখতে পারবেন।
          </p>
        </div>
      </div>

      {/* Success Confirmation Card with Quick Testing Actions */}
      {successInfo && (
        <div className="bg-[#FAF8F5] border-2 border-[#2D4A3E] rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-[#CFDB95] rounded-2xl text-[#2D4A3E] shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2D4A3E] font-serif-bn">
                {successInfo.title}
              </h3>
              <p className="text-xs text-[#3D3D3D] mt-1 font-medium">
                {successInfo.details}
              </p>
              <div className="mt-3 p-3 bg-white rounded-2xl border border-[#E0DCCF] text-xs text-[#5A5A40] space-y-1">
                <p className="font-semibold text-[#2D4A3E] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#9A7E6F]" />
                  অনুমোদনের দায়িত্ব: <span className="text-[#9A7E6F] font-bold">{successInfo.approverText}</span>
                </p>
                <p>
                  অনুমোদন সম্পন্ন হওয়ার পর আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিয়ে সরাসরি লগইন করা যাবে।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Easy Testing */}
          <div className="pt-2 border-t border-[#E0DCCF] flex flex-wrap items-center gap-2.5">
            {successInfo.type === 'ADMIN' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    quickLoginAs('superadmin');
                    if (onNavigateToSuperAdmin) onNavigateToSuperAdmin();
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#CFDB95]" />
                  সুপার এডমিন হিসেবে আবেদনটি অনুমোদন দিন (টেস্টিং)
                </button>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="px-4 py-2.5 rounded-full bg-white border border-[#E0DCCF] hover:bg-[#F4F1EA] text-[#3D3D3D] text-xs font-semibold"
                >
                  লগইন পাতায় যান
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    quickLoginAs('barun_admin');
                    if (onNavigateToUserApproval) onNavigateToUserApproval();
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4 text-[#CFDB95]" />
                  মসজিদ এডমিন হিসেবে আবেদনটি অনুমোদন দিন (টেস্টিং)
                </button>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="px-4 py-2.5 rounded-full bg-white border border-[#E0DCCF] hover:bg-[#F4F1EA] text-[#3D3D3D] text-xs font-semibold"
                >
                  লগইন পাতায় যান
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. MOSQUE & ADMIN REGISTRATION FORM                          */}
      {/* ============================================================ */}
      {activeType === 'ADMIN' && (
        <form onSubmit={handleAdminRegister} className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#F4F1EA] pb-3">
            <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D4A3E]" />
              মসজিদের মৌলিক তথ্য
            </h3>
            <p className="text-xs text-[#8A8A8A]">যে মসজিদের জন্য হিসাব খোলা হচ্ছে তার বিবরণ প্রদান করুন</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                মসজিদের পূর্ণ নাম: *
              </label>
              <input
                type="text"
                required
                value={mName}
                onChange={e => setMName(e.target.value)}
                placeholder="যেমন: চাঁদপুর বায়তুল আমান জামে মসজিদ"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                জেলা: *
              </label>
              <input
                type="text"
                required
                value={mDistrict}
                onChange={e => setMDistrict(e.target.value)}
                placeholder="যেমন: চাঁদপুর / কুমিল্লা / ঢাকা"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                উপজেলা / থানা: *
              </label>
              <input
                type="text"
                required
                value={mUpazila}
                onChange={e => setMUpazila(e.target.value)}
                placeholder="যেমন: চাঁদপুর সদর / ফরিদগঞ্জ"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A8A8A]" />
                বিস্তারিত ঠিকানা / গ্রাম / ওয়ার্ড / পাড়া: *
              </label>
              <input
                type="text"
                required
                value={mAddress}
                onChange={e => setMAddress(e.target.value)}
                placeholder="যেমন: বরুন মুন্সীবাড়ী, ৩ নং ওয়ার্ড, ইউনিয়ন: রামপুর"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8A8A8A]" />
                প্রতিষ্ঠিত সন:
              </label>
              <input
                type="text"
                value={mYear}
                onChange={e => setMYear(e.target.value)}
                placeholder="১৯৯৫"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                মসজিদ কমিটি / ওয়াকফ রেজিঃ নং (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={mRegNo}
                onChange={e => setMRegNo(e.target.value)}
                placeholder="ওয়াকফ নং: ১২৩৪৫"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                মসজিদের অফিসিয়াল ফোন / হেল্পলাইন:
              </label>
              <input
                type="text"
                value={mPhone}
                onChange={e => setMPhone(e.target.value)}
                placeholder="০১৭১১-XXXXXX"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                মসজিদের অফিসিয়াল ইমেইল:
              </label>
              <input
                type="email"
                value={mEmail}
                onChange={e => setMEmail(e.target.value)}
                placeholder="contact@masjid.org"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Admin Account Section */}
          <div className="pt-4 border-t border-[#F4F1EA] space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D4A3E]" />
              <h3 className="text-sm font-bold text-[#2D4A3E] font-serif-bn">
                মসজিদ এডমিন একাউন্ট তথ্য (লগইন ক্রেডেনশিয়াল)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  এডমিনের নাম: *
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  placeholder="মো. রফিকুল ইসলাম"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  কমিটিতে পদবি: *
                </label>
                <select
                  value={adminDesignation}
                  onChange={e => setAdminDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                >
                  <option value="সাধারণ সম্পাদক">সাধারণ সম্পাদক</option>
                  <option value="ক্যাশিয়ার / অর্থ সম্পাদক">ক্যাশিয়ার / অর্থ সম্পাদক</option>
                  <option value="সভাপতি">সভাপতি</option>
                  <option value="মুতাওয়াল্লী">মুতাওয়াল্লী</option>
                  <option value="ইমাম / খতিব">ইমাম / খতিব</option>
                  <option value="অফিস সহকারী">অফিস সহকারী</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  এডমিনের মোবাইল: *
                </label>
                <input
                  type="text"
                  required
                  value={adminPhone}
                  onChange={e => setAdminPhone(e.target.value)}
                  placeholder="০১৮১২-XXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  লগইন ইমেইল ঠিকানা: *
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="admin@newmasjid.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  লগইন পাসওয়ার্ড: *
                </label>
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl text-xs text-[#5A5A40] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2D4A3E] shrink-0" />
            <span>
              <b>অনুমোদন শর্ত:</b> ফরমটি সাবমিট করলে কেন্দ্রীয় সুপার এডমিনের তালিকায় অপেক্ষমাণ হিসেবে জমা থাকবে। সুপার এডমিন যাচাইপূর্বক অনুমোদন দিলে আপনার একাউন্ট সক্রিয় হবে।
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'মসজিদ ও এডমিন রেজিস্ট্রেশন সম্পন্ন করুন'}
          </button>
        </form>
      )}

      {/* ============================================================ */}
      {/* 2. GENERAL USER / MUSALLI REGISTRATION FORM                  */}
      {/* ============================================================ */}
      {activeType === 'USER' && (
        <form onSubmit={handleUserRegister} className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#F4F1EA] pb-3">
            <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#2D4A3E]" />
              সাধারণ ইউজার / মুসুল্লি রেজিস্ট্রেশন ফরম
            </h3>
            <p className="text-xs text-[#8A8A8A]">
              মসজিদের দৈনিক ক্যাশবুক, আয়-ব্যয় ভাউচার ও ব্যালেন্স শিট দেখতে নিচের তথ্য পূরণ করুন
            </p>
          </div>

          <div className="space-y-4">
            {/* Select Mosque */}
            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#2D4A3E]" />
                যে মসজিদের হিসাব দেখতে চান তা নির্বাচন করুন: *
              </label>
              <select
                value={selectedMasjidId}
                onChange={e => setSelectedMasjidId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden font-bold text-[#2D4A3E]"
              >
                {mosques.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district}, {m.upazila})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  আপনার পূর্ণ নাম: *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="যেমন: হাজী মো. ইউনুস মিয়া"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  আপনার পরিচয় / ধরন:
                </label>
                <select
                  value={userRoleNote}
                  onChange={e => setUserRoleNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                >
                  <option value="নিয়মিত মুসুল্লি ও সাধারণ দাতা">নিয়মিত মুসুল্লি ও সাধারণ দাতা</option>
                  <option value="মসজিদের আজীবন সদস্য">মসজিদের আজীবন সদস্য</option>
                  <option value="উপদেষ্টা পরিষদের সদস্য">উপদেষ্টা পরিষদের সদস্য</option>
                  <option value="স্থানীয় বাসিন্দা">স্থানীয় বাসিন্দা</option>
                  <option value="প্রবাসী দাতা">প্রবাসী দাতা</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  মোবাইল নম্বর: *
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  লগইন ইমেইল ঠিকানা: *
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="musalli@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#8A8A8A]" />
                পাসওয়ার্ড সেট করুন: *
              </label>
              <input
                type="password"
                required
                value={userPass}
                onChange={e => setUserPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl text-xs text-[#5A5A40] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#9A7E6F] shrink-0" />
            <span>
              <b>অনুমোদন নির্দেশিকা:</b> আবেদন করার পর সংশ্লিষ্ট মসজিদ এডমিনের অনুমোদনের পর আপনি লগইন করে দৈনিক আয়-ব্যয় ভাউচার ও মাসিক রিপোর্ট দেখতে পারবেন।
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'ইউজার রেজিস্ট্রেশন সম্পন্ন করুন'}
          </button>
        </form>
      )}
    </div>
  );
};
