import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Landmark, UserCheck, Clock, RefreshCw, Globe, Check } from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const {
    currentUser,
    activeMasjid,
    quickLoginAs,
    useBengaliDigits,
    toggleBengaliDigits,
    resetToDefaultData
  } = useApp();

  return (
    <div className="no-print bg-[#2D4A3E] text-[#E8EDDF] border-b border-[#3D5E50] text-xs py-2 px-3 sm:px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Role Quick Switch Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[#CFDB95] font-semibold mr-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CFDB95]" />
            দ্রুত রোল পরিবর্তন:
          </span>

          {/* 1. Super Admin */}
          <button
            id="quick-superadmin-btn"
            onClick={() => quickLoginAs('superadmin')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.role === 'SUPER_ADMIN'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="সুপার এডমিন: সারাদেশের সব মসজিদের অনুমোদন, এডিট, ডিলিট ও সার্বিক নিয়ন্ত্রণ"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            সুপার এডমিন
            {currentUser?.role === 'SUPER_ADMIN' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* 2. President (Barun Mosque) */}
          <button
            id="quick-president-btn"
            onClick={() => quickLoginAs('barun_president')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.committeeRole === 'PRESIDENT' && currentUser?.masjidId === 'masjid-barun'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs ring-1 ring-white'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="সভাপতি (আলহাজ্ব জহিরুল হক মুন্সী): ভাউচারের চূড়ান্ত অনুমোদনকারী—যার অনুমোদন ব্যতিত হিসাবে যুক্ত হবে না"
          >
            <span>👑</span>
            ১. সভাপতি
            {currentUser?.committeeRole === 'PRESIDENT' && currentUser?.masjidId === 'masjid-barun' && (
              <Check className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {/* 3. Cashier (Barun Mosque) */}
          <button
            id="quick-cashier-btn"
            onClick={() => quickLoginAs('barun_cashier')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.committeeRole === 'CASHIER' && currentUser?.masjidId === 'masjid-barun'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs ring-1 ring-white'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="ক্যাশিয়ার (মো. ইব্রাহিম খলিল): ভাউচারের অর্থ নিরীক্ষণ ও ২য় ধাপীয় অনুমোদনকারী"
          >
            <span>💰</span>
            ২. ক্যাশিয়ার
            {currentUser?.committeeRole === 'CASHIER' && currentUser?.masjidId === 'masjid-barun' && (
              <Check className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {/* 4. Collector (Barun Mosque) */}
          <button
            id="quick-collector-btn"
            onClick={() => quickLoginAs('barun_collector')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.committeeRole === 'COLLECTOR' && currentUser?.masjidId === 'masjid-barun'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs ring-1 ring-white'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="আদায়কারী (মুন্সী আবুল কাসেম): ভাউচার প্রস্তুতকারী ও ১ম ধাপীয় স্বাক্ষরকারী"
          >
            <span>📝</span>
            ৩. আদায়কারী
            {currentUser?.committeeRole === 'COLLECTOR' && currentUser?.masjidId === 'masjid-barun' && (
              <Check className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {/* 5. Mosque Admin (Baitul Mukarram Mosque - Isolation Verification) */}
          <button
            id="quick-mosqueadmin-baitul-btn"
            onClick={() => quickLoginAs('baitul_admin')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.masjidId === 'masjid-baitul-mukarram'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="অন্য মসজিদ (বায়তুল মোকাররম): পৃথক মসজিদ হিসাব - বরুন মসজিদের ডাটা আইসোলেটেড"
          >
            <Landmark className="w-3.5 h-3.5" />
            অন্য মসজিদ (আইসোলেশন)
            {currentUser?.masjidId === 'masjid-baitul-mukarram' && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* 6. Pending User */}
          <button
            id="quick-pendinguser-btn"
            onClick={() => quickLoginAs('pending_user')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
              currentUser?.status === 'PENDING'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'bg-[#3D5E50] text-[#E8EDDF] hover:bg-[#4d7262]'
            }`}
            title="পেন্ডিং ইউজার: অনুমোদনের অপেক্ষমাণ ইউজার"
          >
            <Clock className="w-3.5 h-3.5" />
            পেন্ডিং ইউজার
            {currentUser?.status === 'PENDING' && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        {/* Right toggles: Numerals toggle & reset */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-bn-digits-btn"
            onClick={toggleBengaliDigits}
            className="bg-[#3D5E50] hover:bg-[#4d7262] text-[#E8EDDF] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors border border-[#4d7262]"
            title="অংক প্রদর্শন পরিবর্তন করুন (বাংলা ১২৩ বা ইংরেজি 123)"
          >
            <Globe className="w-3.5 h-3.5 text-[#CFDB95]" />
            <span>অংক: {useBengaliDigits ? 'বাংলা (১২৩৪)' : 'English (1234)'}</span>
          </button>

          <button
            id="reset-demo-data-btn"
            onClick={resetToDefaultData}
            className="text-[#E8EDDF]/70 hover:text-rose-200 px-2 py-1 flex items-center gap-1 transition-colors text-[11px]"
            title="প্রাথমিক ডেমো ডাটায় রিসেট করুন"
          >
            <RefreshCw className="w-3 h-3" />
            রিসেট
          </button>
        </div>
      </div>
    </div>
  );
};
