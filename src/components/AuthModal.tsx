import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogIn,
  UserPlus,
  Building2,
  Landmark,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Phone,
  User,
  MapPin
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, registerMosqueAndAdmin, registerGeneralUser, mosques } = useApp();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER_MOSQUE' | 'REGISTER_USER'>('LOGIN');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Mosque Admin Register inputs
  const [mName, setMName] = useState('');
  const [mDistrict, setMDistrict] = useState('');
  const [mUpazila, setMUpazila] = useState('');
  const [mAddress, setMAddress] = useState('');
  const [mYear, setMYear] = useState('১৯৯০');
  const [mPhone, setMPhone] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // General User Register inputs
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPass, setUserPass] = useState('');
  const [selectedMasjidId, setSelectedMasjidId] = useState(mosques[0]?.id || '');

  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);
  const [regErrorMessage, setRegErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterMosqueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage(null);
    setRegSuccessMessage(null);

    const res = registerMosqueAndAdmin({
      mosqueName: mName,
      district: mDistrict,
      upazila: mUpazila,
      address: mAddress,
      contactPhone: mPhone,
      contactEmail: mEmail,
      establishedYear: mYear,
      adminName,
      adminEmail,
      adminPhone,
      adminPassword: adminPass
    });

    if (res.success) {
      setRegSuccessMessage(res.message);
    } else {
      setRegErrorMessage(res.message);
    }
  };

  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage(null);
    setRegSuccessMessage(null);

    const res = registerGeneralUser({
      name: userName,
      email: userEmail,
      phone: userPhone,
      password: userPass,
      masjidId: selectedMasjidId
    });

    if (res.success) {
      setRegSuccessMessage(res.message);
    } else {
      setRegErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D4A3E]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-[#E0DCCF]">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E] text-[#CFDB95] flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                মসজিদ হিসাব প্ল্যাটফর্ম একাউন্ট
              </h3>
              <p className="text-xs text-[#8A8A8A]">নিরাপদ ও স্বচ্ছ হিসাব ব্যবস্থার সমন্বয়</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8A8A8A] hover:text-[#3D3D3D] hover:bg-[#F4F1EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#F4F1EA] p-1.5 rounded-full text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode('LOGIN');
              setLoginError(null);
              setRegSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all ${
              authMode === 'LOGIN' ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs' : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
            }`}
          >
            লগইন
          </button>
          <button
            onClick={() => {
              setAuthMode('REGISTER_MOSQUE');
              setRegSuccessMessage(null);
              setRegErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all ${
              authMode === 'REGISTER_MOSQUE' ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs' : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
            }`}
          >
            নতুন মসজিদ ও এডমিন
          </button>
          <button
            onClick={() => {
              setAuthMode('REGISTER_USER');
              setRegSuccessMessage(null);
              setRegErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all ${
              authMode === 'REGISTER_USER' ? 'bg-[#2D4A3E] text-[#E8EDDF] shadow-xs' : 'text-[#3D3D3D] hover:text-[#2D4A3E]'
            }`}
          >
            ইউজার নিবন্ধন
          </button>
        </div>

        {/* 1. LOGIN FORM */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">ইমেইল ঠিকানা:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin@masjid.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">পাসওয়ার্ড:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              লগইন করুন
            </button>

            {/* Quick Demo Credentials Box */}
            <div className="pt-4 border-t border-[#F4F1EA] text-[#8A8A8A] text-xs space-y-2">
              <span className="font-semibold text-[#3D3D3D] block">টেস্টিং ডেমো একাউন্টসমূহ (১-ক্লিক ফিলাপ):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@masjid.com');
                    setLoginPassword('123456');
                  }}
                  className="p-2.5 rounded-xl bg-[#FBF9F6] border border-[#E0DCCF] text-left hover:bg-[#F4F1EA] text-[#3D3D3D] transition-colors"
                >
                  <b className="text-[#9A7E6F] block">সুপার এডমিন:</b>
                  admin@masjid.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('barunmosjid@gmail.com');
                    setLoginPassword('123456');
                  }}
                  className="p-2.5 rounded-xl bg-[#FBF9F6] border border-[#E0DCCF] text-left hover:bg-[#F4F1EA] text-[#3D3D3D] transition-colors"
                >
                  <b className="text-[#2D4A3E] block">বরুন মসজিদ এডমিন:</b>
                  barunmosjid@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('khatib.barun@gmail.com');
                    setLoginPassword('123456');
                  }}
                  className="p-2.5 rounded-xl bg-[#FBF9F6] border border-[#E0DCCF] text-left hover:bg-[#F4F1EA] text-[#3D3D3D] transition-colors"
                >
                  <b className="text-[#5A5A40] block">অনুমোদিত ইউজার:</b>
                  khatib.barun@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('musalli.pending@gmail.com');
                    setLoginPassword('123456');
                  }}
                  className="p-2.5 rounded-xl bg-[#FBF9F6] border border-[#E0DCCF] text-left hover:bg-[#F4F1EA] text-[#3D3D3D] transition-colors"
                >
                  <b className="text-[#9A7E6F] block">পেন্ডিং ইউজার:</b>
                  musalli.pending@gmail.com
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER NEW MOSQUE & ADMIN FORM */}
        {authMode === 'REGISTER_MOSQUE' && (
          <form onSubmit={handleRegisterMosqueSubmit} className="space-y-4">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl text-xs text-[#2D4A3E] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <div>
                <b>মনোযোগ দিন:</b> আবেদন করার পর <b>সুপার এডমিনের অনুমোদন সাপেক্ষে</b> এই মসজিদের নিজস্ব ড্যাশবোর্ড তৈরি হবে এবং আপনি এডমিন হিসেবে তা নিয়ন্ত্রণ করতে পারবেন।
              </div>
            </div>

            {regSuccessMessage && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{regSuccessMessage}</span>
              </div>
            )}

            {regErrorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{regErrorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">মসজিদের পূর্ণ নাম: *</label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={e => setMName(e.target.value)}
                  placeholder="যেমন: চাঁদপুর চকবাজার শাহী জামে মসজিদ"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">জেলা: *</label>
                  <input
                    type="text"
                    required
                    value={mDistrict}
                    onChange={e => setMDistrict(e.target.value)}
                    placeholder="যেমন: চাঁদপুর"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">উপজেলা: *</label>
                  <input
                    type="text"
                    required
                    value={mUpazila}
                    onChange={e => setMUpazila(e.target.value)}
                    placeholder="যেমন: সদর"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">বিস্তারিত ঠিকানা: *</label>
                <input
                  type="text"
                  required
                  value={mAddress}
                  onChange={e => setMAddress(e.target.value)}
                  placeholder="চকবাজার মোড়, চাঁদপুর সদর"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">মসজিদের মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    value={mPhone}
                    onChange={e => setMPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">প্রতিষ্ঠিত সন:</label>
                  <input
                    type="text"
                    value={mYear}
                    onChange={e => setMYear(e.target.value)}
                    placeholder="যেমন: ১৯৯৫"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F4F1EA]">
                <span className="block text-xs font-bold text-[#2D4A3E] mb-2">এডমিন একাউন্ট তথ্য:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#3D3D3D] mb-0.5">এডমিনের নাম: *</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      placeholder="মো. রফিকুল ইসলাম"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#3D3D3D] mb-0.5">মোবাইল: *</label>
                    <input
                      type="text"
                      required
                      value={adminPhone}
                      onChange={e => setAdminPhone(e.target.value)}
                      placeholder="০১৮১২-XXXXXX"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-[11px] text-[#3D3D3D] mb-0.5">লগইন ইমেইল: *</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="admin@newmasjid.com"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#3D3D3D] mb-0.5">পাসওয়ার্ড: *</label>
                    <input
                      type="password"
                      required
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold shadow-sm transition-colors"
            >
              মসজিদ ও এডমিন আবেদন জমা দিন
            </button>
          </form>
        )}

        {/* 3. REGISTER GENERAL USER FORM */}
        {authMode === 'REGISTER_USER' && (
          <form onSubmit={handleRegisterUserSubmit} className="space-y-4">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCCF] rounded-2xl text-xs text-[#2D4A3E] flex items-start gap-2.5">
              <UserPlus className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <div>
                <b>মনোযোগ দিন:</b> আপনার আবেদনটি সংশ্লিষ্ট <b>মসজিদ এডমিনের অনুমোদন সাপেক্ষে</b> কার্যকর হবে। অনুমোদনের পর আপনি লগইন করে এই মসজিদের দৈনিক আয়-ব্যয়ের হিসাব ও রিপোর্ট দেখতে পারবেন।
              </div>
            </div>

            {regSuccessMessage && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{regSuccessMessage}</span>
              </div>
            )}

            {regErrorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{regErrorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">মসজিদ নির্বাচন করুন: *</label>
              <select
                value={selectedMasjidId}
                onChange={e => setSelectedMasjidId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] font-medium"
              >
                {mosques.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district}, {m.upazila})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">আপনার পূর্ণ নাম: *</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="যেমন: হাজী মো. ইউনুস মিয়া"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">ইমেইল: *</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">মোবাইল নম্বর: *</label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">পাসওয়ার্ড: *</label>
              <input
                type="password"
                required
                value={userPass}
                onChange={e => setUserPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold shadow-sm transition-colors"
            >
              ইউজার আবেদন সম্পন্ন করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
