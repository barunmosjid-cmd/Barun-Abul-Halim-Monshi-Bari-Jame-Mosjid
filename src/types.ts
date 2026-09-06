export type UserRole = 'SUPER_ADMIN' | 'MOSQUE_ADMIN' | 'GENERAL_USER';
export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type TransactionType = 'INCOME' | 'EXPENSE';

// 3-Tier Mosque Approval Committee Roles
export type CommitteeDesignation =
  | 'COLLECTOR'   // আদায়কারী (Cash/Donation Collector / Entry Operator)
  | 'CASHIER'     // ক্যাশিয়ার (Cashier / Accounts Officer)
  | 'PRESIDENT'   // সভাপতি (President / Mutawalli - Final Authority)
  | 'SECRETARY'   // সাধারণ সম্পাদক
  | 'MEMBER';     // সাধারণ সদস্য / মুসুল্লি

export interface VoucherApprovalDetail {
  approved: boolean;
  approvedBy?: string;        // Name of the approver
  approvedByEmail?: string;   // Approver profile email
  approvedAt?: string;        // ISO Timestamp
  comment?: string;           // Optional remark or note
}

export interface ReportTemplate {
  bismillahText: string;
  headerTitle: string;
  subHeader: string;
  addressLine: string;
  phoneLine: string;
  emailLine: string;
  registrationNo: string;
  signatory1: string; // e.g. "ক্যাশিয়ার / হিসাবরক্ষক"
  signatory2: string; // e.g. "সাধারণ সম্পাদক"
  signatory3: string; // e.g. "সভাপতি / মুতাওয়াল্লী"
  footerNote: string;
  watermarkText: string;
}

export interface Mosque {
  id: string;
  name: string;
  code: string;
  district: string;
  upazila: string;
  address: string;
  establishedYear: string;
  contactPhone: string;
  contactEmail: string;
  status: ApprovalStatus;
  adminEmail: string;
  adminName: string;
  createdAt: string;
  reportTemplate: ReportTemplate;
  categories: {
    income: string[];
    expenseGroups: {
      groupName: string;
      items: string[];
    }[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  committeeRole?: CommitteeDesignation; // e.g. 'PRESIDENT' | 'CASHIER' | 'COLLECTOR'
  designationTitle?: string; // e.g. 'সভাপতি / মুতাওয়াল্লী', 'ক্যাশিয়ার / হিসাবরক্ষক', 'আদায়কারী'
  status: ApprovalStatus;
  masjidId?: string; // which mosque they belong to (null for super admin)
  requestedMasjidName?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Transaction {
  id: string;
  masjidId: string;
  voucherNo: string;
  date: string; // YYYY-MM-DDTHH:mm
  type: TransactionType;
  category: string;
  amount: number;
  person: string;
  memberId?: string;
  phone: string;
  paymentMethod: 'ক্যাশ (নগদ)' | 'ব্যাংক হিসাব' | 'বিকাশ / নগদ (মোবাইল ব্যাংকিং)';
  note: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;

  // 3-Tier Approval Status by respective profiles
  // Rule 1: Printing/PDF requires collectorApproval, cashierApproval, AND presidentApproval
  // Rule 2: Without presidentApproval, the voucher is NOT added to official accounts/balance
  collectorApproval: VoucherApprovalDetail; // ১. আদায়কারী অনুমোদন
  cashierApproval: VoucherApprovalDetail;   // ২. ক্যাশিয়ার অনুমোদন
  presidentApproval: VoucherApprovalDetail; // ৩. সভাপতি অনুমোদন (চূড়ান্ত - হিসাবে অন্তর্ভুক্তি)
}

export interface Member {
  id: string; // e.g. M-101
  masjidId: string;
  name: string;
  phone: string;
  address: string;
  monthlyFee: number;
  joinedDate: string;
  notes?: string;
}

export interface MemberLedgerItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  monthlyFee: number;
  totalPayable: number;
  totalPaid: number;
  due: number;
  advance: number;
  status: 'PAID' | 'DUE' | 'ADVANCE';
  payments: {
    date: string;
    voucherNo: string;
    category: string;
    amount: number;
    note: string;
  }[];
}

export interface MosqueStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  memberCount: number;
  activeUsersCount: number;
  pendingUsersCount: number;
  pendingApprovalCount: number; // Count of vouchers waiting for president approval
  pendingApprovalAmount: number; // Total amount not yet included in balance
  fullyApprovedCount: number;   // Vouchers approved by all 3
}
