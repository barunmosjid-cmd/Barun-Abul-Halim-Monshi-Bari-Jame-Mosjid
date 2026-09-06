import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Building2,
  ChevronDown,
  Printer,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Receipt,
  FileSpreadsheet,
  Users,
  Settings,
  Bell
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, activeTab, setActiveTab }) => {
  const { currentUser, activeMasjid, mosques, users, setActiveMasjidId, logout } = useApp();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isMosqueAdmin = currentUser?.role === 'MOSQUE_ADMIN';
  const isApproved = currentUser?.status === 'APPROVED';

  const pendingMosquesCount = mosques.filter(m => m.status === 'PENDING').length;
  const pendingUsersCount = activeMasjid
    ? users.filter(u => u.masjidId === activeMasjid.id && u.role === 'GENERAL_USER' && u.status === 'PENDING').length
    : 0;

  return (
    <header className="bg-[#2D4A3E] text-[#E8EDDF] shadow-md sticky top-0 z-40 border-b border-[#3D5E50]">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo and Brand */}
          <div
            className="flex items-center gap-3 min-w-0 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#CFDB95] flex items-center justify-center shrink-0 shadow-sm text-[#2D4A3E] font-serif font-bold text-xl">
              ম
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate font-serif-bn">
                  মসজিদ হিসাব
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-semibold bg-[#3D5E50] text-[#CFDB95] rounded-full border border-[#4d7262]">
                  বাংলাদেশ ইআরপি
                </span>
              </div>
              <p className="text-xs text-[#E8EDDF]/80 truncate max-w-xs sm:max-w-md">
                {activeMasjid ? activeMasjid.name : 'কেন্দ্রীয় মসজিদ হিসাব প্ল্যাটফর্ম'}
              </p>
            </div>
          </div>

          {/* Center/Right: Mosque Selector, Registration Link, User status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Registration Button */}
            <button
              id="navbar-registration-btn"
              onClick={() => setActiveTab('registration')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                activeTab === 'registration'
                  ? 'bg-[#CFDB95] text-[#2D4A3E] border-[#CFDB95] shadow-xs'
                  : 'bg-[#3D5E50] text-[#CFDB95] border-[#4d7262] hover:bg-[#4a7263]'
              }`}
              title="নতুন এডমিন বা ইউজার রেজিস্ট্রেশন ফরম"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রেজিস্ট্রেশন ফরম</span>
              <span className="sm:hidden">নিবন্ধন</span>
            </button>

            {/* Mosque Switcher (For Super Admin or info tag) */}
            {isSuperAdmin ? (
              <div className="relative flex items-center bg-[#3D5E50] border border-[#4d7262] rounded-full px-3 py-1.5 text-xs text-[#E8EDDF]">
                <Building2 className="w-3.5 h-3.5 text-[#CFDB95] mr-1.5 shrink-0" />
                <span className="hidden lg:inline text-[#CFDB95] mr-1 font-medium">মসজিদ:</span>
                <select
                  id="masjid-selector-dropdown"
                  value={activeMasjid?.id || ''}
                  onChange={(e) => setActiveMasjidId(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer max-w-[130px] sm:max-w-[190px] truncate"
                >
                  {mosques.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#2D4A3E] text-white">
                      {m.name} ({m.district}) {m.status !== 'APPROVED' ? '[অনুমোদন বাকি]' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#CFDB95] ml-1 pointer-events-none" />
              </div>
            ) : activeMasjid ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#3D5E50] border border-[#4d7262] rounded-full px-3 py-1 text-xs text-[#E8EDDF]">
                <Building2 className="w-3.5 h-3.5 text-[#CFDB95]" />
                <span className="truncate max-w-[150px] font-medium">{activeMasjid.district} • {activeMasjid.upazila}</span>
              </div>
            ) : null}

            {/* User Profile / Status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px]">
                    {isSuperAdmin ? (
                      <span className="text-[#CFDB95] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> সুপার এডমিন
                      </span>
                    ) : isMosqueAdmin ? (
                      <span className="text-[#CFDB95] font-semibold">
                        মসজিদ এডমিন
                      </span>
                    ) : (
                      <span className="text-[#E8EDDF] font-medium">সাধারণ ইউজার</span>
                    )}

                    {currentUser.status === 'APPROVED' ? (
                      <span className="text-[#CFDB95] inline-flex items-center" title="অ্যাকাউন্ট অনুমোদিত">
                        <CheckCircle2 className="w-3 h-3 text-[#CFDB95]" />
                      </span>
                    ) : (
                      <span className="text-amber-300 inline-flex items-center" title="অ্যাকাউন্ট অনুমোদনের অপেক্ষায়">
                        <AlertCircle className="w-3 h-3 text-amber-300" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Print button */}
                <button
                  id="navbar-print-btn"
                  onClick={() => window.print()}
                  className="p-2 rounded-full bg-[#3D5E50] hover:bg-[#4d7262] text-[#E8EDDF] hover:text-white transition-colors border border-[#4d7262]"
                  title="বর্তমান পাতা প্রিন্ট বা PDF সেভ করুন"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Logout button */}
                <button
                  id="navbar-logout-btn"
                  onClick={logout}
                  className="p-2 rounded-full bg-[#3D5E50] hover:bg-rose-900/60 text-[#E8EDDF] hover:text-rose-200 border border-[#4d7262] transition-colors"
                  title="লগআউট করুন"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-full bg-[#CFDB95] text-[#2D4A3E] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                লগইন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secondary App Navigation Bar */}
      <div className="no-print bg-[#3D5E50] border-t border-[#2D4A3E] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none text-xs sm:text-sm font-medium">
          {/* If Super Admin, show Super Admin panel tab with Pending badge */}
          {isSuperAdmin && (
            <button
              id="tab-superadmin-btn"
              onClick={() => setActiveTab('superadmin')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'superadmin'
                  ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                  : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>সুপার এডমিন কন্ট্রোল</span>
              {pendingMosquesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#2D4A3E] text-[10px] font-extrabold animate-pulse">
                  {pendingMosquesCount}
                </span>
              )}
            </button>
          )}

          {/* Mosque Overview & Daily Cashbook tabs */}
          <button
            id="tab-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            ড্যাশবোর্ড ও হিসাব
          </button>

          {/* Voucher Entry (Prominent for all approved users) */}
          {isApproved && (
            <button
              id="tab-entry-btn"
              onClick={() => setActiveTab('entry')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'entry'
                  ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                  : 'bg-[#2D4A3E]/70 text-[#CFDB95] hover:bg-[#2D4A3E] hover:text-white border border-[#4d7262]'
              }`}
            >
              <Receipt className="w-4 h-4 text-[#CFDB95] shrink-0" />
              ভাউচার তৈরি ও এন্ট্রি
            </button>
          )}

          {/* Cashbook Ledger */}
          <button
            id="tab-cashbook-btn"
            onClick={() => setActiveTab('cashbook')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cashbook'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
            }`}
          >
            📜 ক্যাশবুক লেজার
          </button>

          {/* Member Ledger & Dues */}
          <button
            id="tab-members-btn"
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
            }`}
          >
            👤 সদস্য ও চাঁদা লেজার
          </button>

          {/* Balance Sheet */}
          <button
            id="tab-balancesheet-btn"
            onClick={() => setActiveTab('balancesheet')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'balancesheet'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
            }`}
          >
            ⚖️ ব্যালেন্স শিট
          </button>

          {/* Mosque Admin specific tabs: Template customization and User approvals */}
          {(isSuperAdmin || (isMosqueAdmin && isApproved)) && (
            <>
              <button
                id="tab-templatesettings-btn"
                onClick={() => setActiveTab('templatesettings')}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'templatesettings'
                    ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                    : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
                }`}
              >
                ⚙️ প্যাড ও রিপোর্ট টেমপ্লেট
              </button>

              <button
                id="tab-userapproval-btn"
                onClick={() => setActiveTab('userapproval')}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'userapproval'
                    ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                    : 'text-[#E8EDDF] hover:bg-[#4a7263] hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>ইউজার অনুমোদন</span>
                {pendingUsersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#2D4A3E] text-[10px] font-extrabold animate-pulse">
                    {pendingUsersCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Dedicated Registration Tab */}
          <button
            id="tab-registration-btn"
            onClick={() => setActiveTab('registration')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'registration'
                ? 'bg-[#CFDB95] text-[#2D4A3E] font-bold shadow-xs'
                : 'text-[#CFDB95] hover:bg-[#4a7263] hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            রেজিস্ট্রেশন ফরম
          </button>
        </div>
      </div>
    </header>
  );
};
