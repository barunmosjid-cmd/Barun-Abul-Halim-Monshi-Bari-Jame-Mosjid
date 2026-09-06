import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { QuickDemoBar } from './components/QuickDemoBar';
import { Navbar } from './components/Navbar';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { MosqueDashboardView } from './components/dashboard/MosqueDashboardView';
import { TransactionEntryForm } from './components/transactions/TransactionEntryForm';
import { CashbookLedger } from './components/transactions/CashbookLedger';
import { MemberLedgerView } from './components/members/MemberLedgerView';
import { BalanceSheetView } from './components/reports/BalanceSheetView';
import { MosqueTemplateSettings } from './components/admin/MosqueTemplateSettings';
import { UserApprovalManagement } from './components/admin/UserApprovalManagement';
import { RegistrationPortal } from './components/RegistrationPortal';
import { VoucherPrintModal } from './components/reports/VoucherPrintModal';
import { AuthModal } from './components/AuthModal';
import { AlertTriangle, Clock, ShieldCheck, Landmark, Heart, UserPlus } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, activeMasjid, setActiveMasjidId } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<string | null>(null);

  // If Super Admin clicks "পরিদর্শন" on a mosque
  const handleSwitchToMosqueDashboard = (masjidId: string) => {
    setActiveMasjidId(masjidId);
    setActiveTab('dashboard');
  };

  const isApproved = currentUser?.status === 'APPROVED';
  const isPending = currentUser?.status === 'PENDING';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#3D3D3D] antialiased">
      {/* 1. Quick Testing Demo Role Switcher Bar */}
      <QuickDemoBar />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 3. Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* If user is Pending approval, show clear explanation notice */}
        {isPending && (
          <div className="bg-[#FAF8F5] border border-[#E0DCCF] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-[#CFDB95] rounded-2xl text-[#2D4A3E] shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                আপনার একাউন্টটি অনুমোদনের অপেক্ষায় আছে (Pending Approval)
              </h3>
              <p className="text-xs text-[#5A5A40] mt-1">
                {currentUser?.role === 'MOSQUE_ADMIN'
                  ? 'আপনার নতুন মসজিদ ও এডমিন আবেদনটি কেন্দ্রীয় সুপার এডমিনের পর্যালোচনায় রয়েছে। অনুমোদন দেওয়া হলে আপনি নিজস্ব ড্যাশবোর্ড ও রিপোর্ট টেমপ্লেট পরিচালনা করতে পারবেন।'
                  : `আপনার আবেদনটি ${activeMasjid?.name || 'মসজিদ'}-এর এডমিনের অনুমোদনের অপেক্ষায় রয়েছে। এডমিন অনুমোদন দেওয়া মাত্রই আপনি দৈনিক আয়-ব্যয় এবং সদস্য লেজার রিপোর্ট বিস্তারিত দেখতে পারবেন।`}
              </p>
              <div className="mt-2 text-xs text-[#2D4A3E] font-medium">
                💡 ডেমো টেস্ট করতে উপরের <b>"দ্রুত রোল পরিবর্তন"</b> থেকে '১. সুপার এডমিন' বা '২. মসজিদ এডমিন' নির্বাচন করে অনুমোদন দেওয়া পরীক্ষা করুন।
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Tab Content Routing */}
        {activeTab === 'superadmin' && currentUser?.role === 'SUPER_ADMIN' && (
          <SuperAdminDashboard
            onSwitchToMosqueDashboard={handleSwitchToMosqueDashboard}
          />
        )}

        {activeTab === 'dashboard' && (
          <MosqueDashboardView
            onNavigateTab={setActiveTab}
            onViewVoucher={vNo => setSelectedVoucherForPrint(vNo)}
          />
        )}

        {activeTab === 'entry' && isApproved && (
          <TransactionEntryForm
            onTransactionAdded={vNo => setSelectedVoucherForPrint(vNo)}
            onViewVoucher={vNo => setSelectedVoucherForPrint(vNo)}
            onNavigateToCashbook={() => setActiveTab('cashbook')}
          />
        )}

        {activeTab === 'cashbook' && (
          <CashbookLedger
            onViewVoucher={vNo => setSelectedVoucherForPrint(vNo)}
          />
        )}

        {activeTab === 'members' && (
          <MemberLedgerView />
        )}

        {activeTab === 'balancesheet' && (
          <BalanceSheetView />
        )}

        {activeTab === 'templatesettings' && (
          <MosqueTemplateSettings />
        )}

        {activeTab === 'userapproval' && (
          <UserApprovalManagement />
        )}

        {activeTab === 'registration' && (
          <RegistrationPortal
            onNavigateToLogin={() => setAuthModalOpen(true)}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToSuperAdmin={() => setActiveTab('superadmin')}
            onNavigateToUserApproval={() => setActiveTab('userapproval')}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="no-print bg-white border-t border-[#E0DCCF] mt-12 py-6 text-xs text-[#8A8A8A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Landmark className="w-4 h-4 text-[#2D4A3E]" />
            <span className="font-bold text-[#2D4A3E] font-serif-bn">
              মসজিদ হিসাব - বাংলাদেশ মাল্টি-মসজিদ অটো ইআরপি
            </span>
            <span>•</span>
            <span>স্বচ্ছতা ও আমানতদারিতার ডিজিটাল রূপান্তর</span>
          </div>

          <div className="flex items-center gap-3 text-[#8A8A8A]">
            {activeMasjid ? (
              <span>বর্তমান সক্রিয় মসজিদ: <b className="text-[#2D4A3E]">{activeMasjid.name}</b></span>
            ) : null}
            <button
              onClick={() => setActiveTab('registration')}
              className="text-[#2D4A3E] hover:underline font-semibold flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              রেজিস্ট্রেশন
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal for Login/Registration */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Voucher Print Preview Modal */}
      {selectedVoucherForPrint && (
        <VoucherPrintModal
          voucherNo={selectedVoucherForPrint}
          onClose={() => setSelectedVoucherForPrint(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
