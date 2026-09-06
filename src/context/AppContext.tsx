import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Mosque, User, Member, Transaction, MosqueStats, ReportTemplate } from '../types';
import {
  INITIAL_MOSQUES,
  INITIAL_USERS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_REPORT_TEMPLATE,
  INITIAL_CATEGORIES
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  activeMasjid: Mosque | null;
  mosques: Mosque[];
  users: UsersList;
  transactions: Transaction[];
  members: Member[];
  useBengaliDigits: boolean;
  toggleBengaliDigits: () => void;
  // Auth
  login: (email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  quickLoginAs: (type: 'superadmin' | 'barun_president' | 'barun_cashier' | 'barun_collector' | 'barun_admin' | 'baitul_admin' | 'barun_user' | 'pending_user') => void;
  registerMosqueAndAdmin: (data: {
    mosqueName: string;
    district: string;
    upazila: string;
    address: string;
    contactPhone: string;
    contactEmail: string;
    establishedYear: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    adminPassword: string;
  }) => { success: boolean; message: string };
  registerGeneralUser: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    masjidId: string;
  }) => { success: boolean; message: string };
  // Admin & Super Admin actions
  approveMosque: (masjidId: string, approve: boolean) => void;
  approveUser: (userId: string, approve: boolean) => void;
  updateMosqueDetailsAndTemplate: (
    masjidId: string,
    generalInfo: Partial<Mosque>,
    template: Partial<ReportTemplate>
  ) => void;
  setActiveMasjidId: (masjidId: string) => void;
  // Super Admin Control & Delete Powers
  deleteMosque: (masjidId: string) => { success: boolean; message: string };
  updateMosque: (masjidId: string, data: Partial<Mosque>) => { success: boolean; message: string };
  deleteUser: (userId: string) => { success: boolean; message: string };
  updateUser: (userId: string, data: Partial<User>) => { success: boolean; message: string };
  // Transactions & Cashbook & 3-Tier Approvals
  addTransaction: (data: Omit<Transaction, 'id' | 'voucherNo' | 'createdAt' | 'collectorApproval' | 'cashierApproval' | 'presidentApproval'> & {
    collectorApproval?: Transaction['collectorApproval'];
    cashierApproval?: Transaction['cashierApproval'];
    presidentApproval?: Transaction['presidentApproval'];
  }) => {
    success: boolean;
    voucherNo: string;
    message: string;
  };
  deleteTransaction: (txnId: string) => void;
  approveVoucherTier: (params: {
    transactionId: string;
    tier: 'collector' | 'cashier' | 'president';
    approved: boolean;
    comment?: string;
  }) => { success: boolean; message: string };
  batchApproveVouchers: (transactionIds: string[], tier: 'collector' | 'cashier' | 'president') => void;
  // Members
  addMember: (data: Omit<Member, 'id'>) => { success: boolean; memberId: string; message: string };
  deleteMember: (memberId: string) => void;
  // Stats
  getMasjidStats: (masjidId: string) => MosqueStats;
  getOverallStats: () => {
    totalMosques: number;
    approvedMosques: number;
    pendingMosques: number;
    totalIncomeAll: number;
    totalExpenseAll: number;
    totalBalanceAll: number;
    totalUsersCount: number;
  };
  // Backup
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => { success: boolean; message: string };
  resetToDefaultData: () => void;
}

type UsersList = User[];

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MOSQUES: 'masjid_erp_mosques_v1',
  USERS: 'masjid_erp_users_v1',
  TRANSACTIONS: 'masjid_erp_transactions_v1',
  MEMBERS: 'masjid_erp_members_v1',
  CURRENT_USER: 'masjid_erp_curr_user_v1',
  ACTIVE_MASJID: 'masjid_erp_active_masjid_v1',
  USE_BN_DIGITS: 'masjid_erp_bn_digits_v1'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mosques, setMosques] = useState<Mosque[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOSQUES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_MOSQUES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const existingEmails = new Set(parsed.map(u => u.email.toLowerCase()));
        const merged = [...parsed];
        INITIAL_USERS.forEach(initUser => {
          if (!existingEmails.has(initUser.email.toLowerCase())) {
            merged.push(initUser);
          }
        });
        return merged;
      } catch { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try {
        const parsed: Transaction[] = JSON.parse(saved);
        return parsed.map(t => ({
          ...t,
          collectorApproval: t.collectorApproval || {
            approved: true,
            approvedBy: t.createdByName ? `${t.createdByName} (আদায়কারী)` : 'মুন্সী আবুল কাসেম (আদায়কারী)',
            approvedByEmail: 'barunmosjid@gmail.com',
            approvedAt: t.createdAt
          },
          cashierApproval: t.cashierApproval || {
            approved: true,
            approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
            approvedByEmail: 'cashier.barun@gmail.com',
            approvedAt: t.createdAt
          },
          presidentApproval: t.presidentApproval !== undefined ? t.presidentApproval : {
            approved: true,
            approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
            approvedByEmail: 'president.barun@gmail.com',
            approvedAt: t.createdAt
          }
        }));
      } catch { /* ignore */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_MEMBERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Default to Mosque Admin of Barun Mosque
    return INITIAL_USERS[1];
  });

  const [activeMasjidId, setActiveMasjidIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MASJID);
    if (saved) return saved;
    return 'masjid-barun';
  });

  const [useBengaliDigits, setUseBengaliDigits] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USE_BN_DIGITS);
    return saved !== null ? saved === 'true' : true;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOSQUES, JSON.stringify(mosques));
  }, [mosques]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MASJID, activeMasjidId);
  }, [activeMasjidId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USE_BN_DIGITS, String(useBengaliDigits));
  }, [useBengaliDigits]);

  // STRICT MULTI-TENANT ISOLATION RULE:
  // If currentUser is NOT a Super Admin, their active mosque is rigidly bound to their assigned masjidId.
  // When currentUser changes, enforce this isolation immediately.
  useEffect(() => {
    if (currentUser && currentUser.role !== 'SUPER_ADMIN' && currentUser.masjidId) {
      setActiveMasjidIdState(currentUser.masjidId);
    }
  }, [currentUser]);

  const toggleBengaliDigits = () => {
    setUseBengaliDigits(prev => !prev);
  };

  // Resolve Active Mosque with strict cross-mosque data separation
  const activeMasjid: Mosque | null = useMemo(() => {
    // 1. If Super Admin: Can view and inspect whichever mosque is chosen via activeMasjidId
    if (currentUser?.role === 'SUPER_ADMIN') {
      return mosques.find(m => m.id === activeMasjidId) || mosques[0] || null;
    }

    // 2. If Mosque Admin or General User: STRICTLY locked to their assigned mosque.
    // They can NEVER access or switch to another mosque's account.
    if (currentUser?.masjidId) {
      const assigned = mosques.find(m => m.id === currentUser.masjidId);
      if (assigned) return assigned;
    }

    // 3. Fallback for unauthenticated visitor or new mosque selector
    return mosques.find(m => m.id === activeMasjidId) || mosques[0] || null;
  }, [currentUser, activeMasjidId, mosques]);

  // Set Active Mosque - strictly forbidden for non-superadmins
  const setActiveMasjidId = (id: string) => {
    if (currentUser && currentUser.role !== 'SUPER_ADMIN') {
      // Non-superadmins cannot switch mosques. Their data is isolated.
      return;
    }
    const m = mosques.find(item => item.id === id);
    if (m) {
      setActiveMasjidIdState(id);
    }
  };

  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' };
    }

    if (user.password && user.password !== pass) {
      return { success: false, message: 'পাসওয়ার্ড সঠিক নয়! দয়া করে পুনরায় চেষ্টা করুন।' };
    }

    if (user.role !== 'SUPER_ADMIN' && user.status === 'PENDING') {
      return {
        success: false,
        message: 'আপনার অ্যাকাউন্টটি এখনও অনুমোদিত হয়নি! সুপার এডমিন বা মসজিদ এডমিনের অনুমোদনের অপেক্ষায় আছে।'
      };
    }

    if (user.status === 'REJECTED') {
      return {
        success: false,
        message: 'আপনার অ্যাকাউন্ট আবেদনটি স্থগিত বা বাতিল করা হয়েছে।'
      };
    }

    setCurrentUser(user);
    if (user.masjidId) {
      setActiveMasjidIdState(user.masjidId);
    }
    return { success: true, message: 'লগইন সফল হয়েছে!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLoginAs = (type: 'superadmin' | 'barun_president' | 'barun_cashier' | 'barun_collector' | 'barun_admin' | 'baitul_admin' | 'barun_user' | 'pending_user') => {
    if (type === 'superadmin') {
      const u = users.find(x => x.role === 'SUPER_ADMIN') || INITIAL_USERS[0];
      setCurrentUser(u);
    } else if (type === 'barun_president') {
      const u = users.find(x => x.email === 'president.barun@gmail.com') || users.find(x => x.committeeRole === 'PRESIDENT' && x.masjidId === 'masjid-barun') || INITIAL_USERS[1];
      setCurrentUser(u);
      setActiveMasjidIdState('masjid-barun');
    } else if (type === 'barun_cashier') {
      const u = users.find(x => x.email === 'cashier.barun@gmail.com') || users.find(x => x.committeeRole === 'CASHIER' && x.masjidId === 'masjid-barun') || INITIAL_USERS[2];
      setCurrentUser(u);
      setActiveMasjidIdState('masjid-barun');
    } else if (type === 'barun_collector' || type === 'barun_admin') {
      const u = users.find(x => x.email === 'barunmosjid@gmail.com') || INITIAL_USERS[3];
      setCurrentUser(u);
      setActiveMasjidIdState('masjid-barun');
    } else if (type === 'baitul_admin') {
      const u = users.find(x => x.email === 'baitul.admin@masjid.com') || INITIAL_USERS[6];
      if (u) {
        setCurrentUser(u);
        setActiveMasjidIdState('masjid-baitul-mukarram');
      }
    } else if (type === 'barun_user') {
      const u = users.find(x => x.email === 'khatib.barun@gmail.com') || INITIAL_USERS[4];
      setCurrentUser(u);
      setActiveMasjidIdState('masjid-barun');
    } else if (type === 'pending_user') {
      const u = users.find(x => x.email === 'musalli.pending@gmail.com') || INITIAL_USERS[5];
      setCurrentUser(u);
      setActiveMasjidIdState('masjid-barun');
    }
  };

  const registerMosqueAndAdmin = (data: {
    mosqueName: string;
    district: string;
    upazila: string;
    address: string;
    contactPhone: string;
    contactEmail: string;
    establishedYear: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    adminPassword: string;
  }) => {
    const cleanEmail = data.adminEmail.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত আছে।' };
    }

    const newMasjidId = `masjid-${Date.now()}`;
    const newCode = `MSJ-${Math.floor(100 + Math.random() * 900)}`;

    const newMosque: Mosque = {
      id: newMasjidId,
      name: data.mosqueName.trim(),
      code: newCode,
      district: data.district.trim(),
      upazila: data.upazila.trim(),
      address: data.address.trim(),
      establishedYear: data.establishedYear || '২০২৪',
      contactPhone: data.contactPhone.trim(),
      contactEmail: data.contactEmail.trim() || data.adminEmail.trim(),
      status: 'PENDING', // Needs Super Admin Approval
      adminEmail: cleanEmail,
      adminName: data.adminName.trim(),
      createdAt: new Date().toISOString(),
      reportTemplate: {
        ...INITIAL_REPORT_TEMPLATE,
        headerTitle: data.mosqueName.trim(),
        addressLine: data.address.trim(),
        phoneLine: data.contactPhone.trim(),
        emailLine: data.contactEmail.trim() || data.adminEmail.trim()
      },
      categories: { ...INITIAL_CATEGORIES }
    };

    const newAdminUser: User = {
      id: `u-${Date.now()}`,
      name: data.adminName.trim(),
      email: cleanEmail,
      phone: data.adminPhone.trim(),
      password: data.adminPassword,
      role: 'MOSQUE_ADMIN',
      status: 'PENDING', // Needs Super Admin Approval
      masjidId: newMasjidId,
      requestedMasjidName: data.mosqueName.trim(),
      createdAt: new Date().toISOString()
    };

    setMosques(prev => [newMosque, ...prev]);
    setUsers(prev => [newAdminUser, ...prev]);

    return {
      success: true,
      message: 'মসজিদ ও এডমিন নিবন্ধন সফল হয়েছে! কেন্দ্রীয় সুপার এডমিন অনুমোদনের পর আপনি লগইন করে ড্যাশবোর্ড ব্যবহার করতে পারবেন।'
    };
  };

  const registerGeneralUser = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    masjidId: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত আছে।' };
    }

    const targetMasjid = mosques.find(m => m.id === data.masjidId);
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password: data.password,
      role: 'GENERAL_USER',
      status: 'PENDING', // Needs Mosque Admin Approval
      masjidId: data.masjidId,
      requestedMasjidName: targetMasjid?.name || 'মসজিদ',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);

    return {
      success: true,
      message: 'আপনার আবেদন সফল হয়েছে! সংশ্লিষ্ট মসজিদ এডমিনের অনুমোদনের পর আপনি লগইন করে আয়-ব্যয়ের হিসাব দেখতে পারবেন।'
    };
  };

  const approveMosque = (masjidId: string, approve: boolean) => {
    setMosques(prev =>
      prev.map(m => (m.id === masjidId ? { ...m, status: approve ? 'APPROVED' : 'REJECTED' } : m))
    );

    // Also approve or reject corresponding mosque admin
    setUsers(prev =>
      prev.map(u => {
        if (u.masjidId === masjidId && u.role === 'MOSQUE_ADMIN') {
          return {
            ...u,
            status: approve ? 'APPROVED' : 'REJECTED',
            approvedBy: currentUser?.email || 'Super Admin',
            approvedAt: new Date().toISOString()
          };
        }
        return u;
      })
    );
  };

  const approveUser = (userId: string, approve: boolean) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: approve ? 'APPROVED' : 'REJECTED',
            approvedBy: currentUser?.email || 'Admin',
            approvedAt: new Date().toISOString()
          };
        }
        return u;
      })
    );
  };

  const updateMosqueDetailsAndTemplate = (
    masjidId: string,
    generalInfo: Partial<Mosque>,
    template: Partial<ReportTemplate>
  ) => {
    setMosques(prev =>
      prev.map(m => {
        if (m.id === masjidId) {
          return {
            ...m,
            ...generalInfo,
            reportTemplate: {
              ...m.reportTemplate,
              ...template
            }
          };
        }
        return m;
      })
    );
  };

  // SUPER ADMIN POWER 1: Delete any Mosque with cascade data cleanup
  const deleteMosque = (masjidId: string): { success: boolean; message: string } => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'কেবলমাত্র সুপার এডমিন কোনো মসজিদ ডিলিট করতে পারবেন।' };
    }

    const targetMosque = mosques.find(m => m.id === masjidId);
    if (!targetMosque) {
      return { success: false, message: 'মসজিদটি পাওয়া যায়নি।' };
    }

    // 1. Remove mosque from list
    setMosques(prev => prev.filter(m => m.id !== masjidId));

    // 2. Cascade delete all transactions of this mosque
    setTransactions(prev => prev.filter(t => t.masjidId !== masjidId));

    // 3. Cascade delete all members of this mosque
    setMembers(prev => prev.filter(m => m.masjidId !== masjidId));

    // 4. Cascade delete or detach users associated with this mosque (except Super Admins)
    setUsers(prev => prev.filter(u => u.masjidId !== masjidId || u.role === 'SUPER_ADMIN'));

    // 5. If deleted mosque was active in Super Admin view, switch to next available mosque
    setActiveMasjidIdState(prev => {
      if (prev === masjidId) {
        const remaining = mosques.filter(m => m.id !== masjidId);
        return remaining[0]?.id || '';
      }
      return prev;
    });

    return {
      success: true,
      message: `"${targetMosque.name}" মসজিদ এবং এর সাথে সম্পর্কিত সকল ভাউচার, হিসাব ও ইউজার সফলভাবে মুছে ফেলা হয়েছে।`
    };
  };

  // SUPER ADMIN POWER 2: Full Edit & Control of any Mosque
  const updateMosque = (masjidId: string, data: Partial<Mosque>): { success: boolean; message: string } => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'শুধুমাত্র সুপার এডমিন সরাসরি যেকোনো মসজিদ নিয়ন্ত্রণ ও এডিট করতে পারবেন।' };
    }

    const targetMosque = mosques.find(m => m.id === masjidId);
    if (!targetMosque) {
      return { success: false, message: 'মসজিদটি খুঁজে পাওয়া যায়নি।' };
    }

    setMosques(prev =>
      prev.map(m => {
        if (m.id === masjidId) {
          const updated = { ...m, ...data };
          if (data.name && (!data.reportTemplate || !data.reportTemplate.headerTitle)) {
            updated.reportTemplate = {
              ...updated.reportTemplate,
              headerTitle: data.name
            };
          }
          return updated;
        }
        return m;
      })
    );

    // If admin name or email was modified in mosque details, sync to admin user
    if (data.adminName || data.adminEmail) {
      setUsers(prev =>
        prev.map(u => {
          if (u.masjidId === masjidId && u.role === 'MOSQUE_ADMIN') {
            return {
              ...u,
              name: data.adminName || u.name,
              email: data.adminEmail || u.email
            };
          }
          return u;
        })
      );
    }

    return { success: true, message: `"${targetMosque.name}"-এর তথ্য সফলভাবে হালনাগাদ করা হয়েছে।` };
  };

  // SUPER ADMIN POWER 3: Delete any Admin or User
  const deleteUser = (userId: string): { success: boolean; message: string } => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'শুধুমাত্র সুপার এডমিন যেকোনো এডমিন বা ইউজার ডিলিট করতে পারবেন।' };
    }

    if (currentUser?.id === userId) {
      return { success: false, message: 'আপনি নিজের সুপার এডমিন অ্যাকাউন্ট ডিলিট করতে পারবেন না!' };
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'ব্যবহারকারীটি পাওয়া যায়নি।' };
    }

    setUsers(prev => prev.filter(u => u.id !== userId));

    return {
      success: true,
      message: `ব্যবহারকারী "${targetUser.name}" (${targetUser.role === 'MOSQUE_ADMIN' ? 'মসজিদ এডমিন' : 'ইউজার'}) সফলভাবে মুছে ফেলা হয়েছে।`
    };
  };

  // SUPER ADMIN POWER 4: Edit & Control any User or Admin
  const updateUser = (userId: string, data: Partial<User>): { success: boolean; message: string } => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'শুধুমাত্র সুপার এডমিন যেকোনো ব্যবহারকারীকে নিয়ন্ত্রণ বা এডিট করতে পারবেন।' };
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'ব্যবহারকারীটি পাওয়া যায়নি।' };
    }

    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, ...data };
        }
        return u;
      })
    );

    // If currentUser is being updated, sync state
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...data } : null));
    }

    return { success: true, message: `"${targetUser.name}"-এর তথ্য সফলভাবে হালনাগাদ করা হয়েছে।` };
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'voucherNo' | 'createdAt' | 'collectorApproval' | 'cashierApproval' | 'presidentApproval'> & {
    collectorApproval?: Transaction['collectorApproval'];
    cashierApproval?: Transaction['cashierApproval'];
    presidentApproval?: Transaction['presidentApproval'];
  }) => {
    const masjidTxns = transactions.filter(t => t.masjidId === data.masjidId);
    const nextVoucherNum = 1001 + masjidTxns.length;
    const voucherNo = `V-${nextVoucherNum}`;

    const isCollectorOrAdmin =
      currentUser?.committeeRole === 'COLLECTOR' ||
      currentUser?.role === 'MOSQUE_ADMIN' ||
      currentUser?.role === 'SUPER_ADMIN';

    // 1. Collector Approval: Automatically approved if created by Collector or Admin, or set explicitly
    const defaultCollectorApproval = data.collectorApproval || (isCollectorOrAdmin && currentUser ? {
      approved: true,
      approvedBy: `${currentUser.name} (${currentUser.designationTitle || 'আদায়কারী'})`,
      approvedByEmail: currentUser.email,
      approvedAt: new Date().toISOString()
    } : {
      approved: false
    });

    // 2. Cashier Approval: Pending by default until Cashier approves
    const defaultCashierApproval = data.cashierApproval || {
      approved: false
    };

    // 3. President Approval: Pending by default until President approves
    const defaultPresidentApproval = data.presidentApproval || {
      approved: false
    };

    const newTxn: Transaction = {
      ...data,
      id: `txn-${Date.now()}`,
      voucherNo,
      createdAt: new Date().toISOString(),
      createdByName: currentUser?.name || 'অ্যাডমিন',
      collectorApproval: defaultCollectorApproval,
      cashierApproval: defaultCashierApproval,
      presidentApproval: defaultPresidentApproval
    };

    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      voucherNo,
      message: `ভাউচার (${voucherNo}) সফলভাবে সংরক্ষিত হয়েছে! ক্যাশিয়ার ও সভাপতির অনুমোদনের পর এটি স্বয়ংক্রিয়ভাবে মূল হিসাবে যুক্ত হবে।`
    };
  };

  const approveVoucherTier = (params: {
    transactionId: string;
    tier: 'collector' | 'cashier' | 'president';
    approved: boolean;
    comment?: string;
  }): { success: boolean; message: string } => {
    const txn = transactions.find(t => t.id === params.transactionId);
    if (!txn) {
      return { success: false, message: 'ভাউচারটি পাওয়া যায়নি।' };
    }

    // Role check:
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
    const isMosqueAdmin = currentUser?.role === 'MOSQUE_ADMIN' && currentUser.masjidId === txn.masjidId;
    const isCollector = currentUser?.committeeRole === 'COLLECTOR' && currentUser.masjidId === txn.masjidId;
    const isCashier = currentUser?.committeeRole === 'CASHIER' && currentUser.masjidId === txn.masjidId;
    const isPresident = currentUser?.committeeRole === 'PRESIDENT' && currentUser.masjidId === txn.masjidId;

    if (params.tier === 'collector' && !isSuperAdmin && !isMosqueAdmin && !isCollector) {
      return { success: false, message: 'কেবলমাত্র সংশ্লিষ্ট আদায়কারী বা এডমিন এই ধাপে অনুমোদন দিতে পারবেন।' };
    }
    if (params.tier === 'cashier' && !isSuperAdmin && !isMosqueAdmin && !isCashier) {
      return { success: false, message: 'কেবলমাত্র সংশ্লিষ্ট ক্যাশিয়ার বা এডমিন এই ধাপে অনুমোদন দিতে পারবেন।' };
    }
    if (params.tier === 'president' && !isSuperAdmin && !isMosqueAdmin && !isPresident) {
      return { success: false, message: 'কেবলমাত্র সংশ্লিষ্ট সভাপতি বা সুপার এডমিন এই চূড়ান্ত অনুমোদন দিতে পারবেন।' };
    }

    const approverName = currentUser?.name || 'অনুমোদনকারী';
    const defaultTitle = params.tier === 'president' ? 'সভাপতি' : params.tier === 'cashier' ? 'ক্যাশিয়ার' : 'আদায়কারী';
    const approverTitle = currentUser?.designationTitle || defaultTitle;
    const approverEmail = currentUser?.email || '';

    const approvalObj = {
      approved: params.approved,
      approvedBy: params.approved ? `${approverName} (${approverTitle})` : undefined,
      approvedByEmail: params.approved ? approverEmail : undefined,
      approvedAt: params.approved ? new Date().toISOString() : undefined,
      comment: params.comment || ''
    };

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === params.transactionId) {
          if (params.tier === 'collector') {
            return { ...t, collectorApproval: approvalObj };
          } else if (params.tier === 'cashier') {
            return { ...t, cashierApproval: approvalObj };
          } else {
            return { ...t, presidentApproval: approvalObj };
          }
        }
        return t;
      })
    );

    if (params.tier === 'president' && params.approved) {
      return {
        success: true,
        message: `ভাউচার (${txn.voucherNo}) সভাপতি মহোদয় কর্তৃক চূড়ান্ত অনুমোদিত হয়েছে এবং মূল হিসাবে সফলভাবে যুক্ত করা হয়েছে!`
      };
    }

    const tierNameBn = params.tier === 'collector' ? 'আদায়কারী' : params.tier === 'cashier' ? 'ক্যাশিয়ার' : 'সভাপতি';
    return {
      success: true,
      message: params.approved
        ? `ভাউচার (${txn.voucherNo}) সফলভাবে ${tierNameBn} কর্তৃক অনুমোদিত হয়েছে!`
        : `ভাউচার (${txn.voucherNo}) এর ${tierNameBn} অনুমোদন প্রত্যাহার করা হয়েছে।`
    };
  };

  const batchApproveVouchers = (transactionIds: string[], tier: 'collector' | 'cashier' | 'president') => {
    transactionIds.forEach(id => {
      approveVoucherTier({ transactionId: id, tier, approved: true });
    });
  };

  const deleteTransaction = (txnId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId));
  };

  const addMember = (data: Omit<Member, 'id'>) => {
    const masjidMembers = members.filter(m => m.masjidId === data.masjidId);
    const memberId = `M-${101 + masjidMembers.length}`;

    const newMember: Member = {
      ...data,
      id: memberId
    };

    setMembers(prev => [...prev, newMember]);
    return {
      success: true,
      memberId,
      message: `নতুন সদস্য সফলভাবে নিবন্ধিত হয়েছে! সদস্য আইডি: ${memberId}`
    };
  };

  const deleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const getMasjidStats = (masjidId: string): MosqueStats => {
    const allMasjidTxns = transactions.filter(t => t.masjidId === masjidId);
    let totalIncome = 0;
    let totalExpense = 0;
    let pendingApprovalCount = 0;
    let pendingApprovalAmount = 0;
    let fullyApprovedCount = 0;

    allMasjidTxns.forEach(t => {
      const amt = Number(t.amount) || 0;
      const isApprovedByPresident = Boolean(t.presidentApproval?.approved);
      const isFullyApproved = Boolean(
        t.collectorApproval?.approved &&
        t.cashierApproval?.approved &&
        t.presidentApproval?.approved
      );

      if (isFullyApproved) {
        fullyApprovedCount += 1;
      }

      // CRITICAL ACCOUNTING RULE:
      // "সভাপতির অনুমোদন ব্যতিত হিসাবে যুক্ত হবে না"
      if (isApprovedByPresident) {
        if (t.type === 'INCOME') {
          totalIncome += amt;
        } else {
          totalExpense += amt;
        }
      } else {
        pendingApprovalCount += 1;
        pendingApprovalAmount += amt;
      }
    });

    const masjidMembers = members.filter(m => m.masjidId === masjidId);
    const masjidUsers = users.filter(u => u.masjidId === masjidId);
    const activeUsers = masjidUsers.filter(u => u.status === 'APPROVED');
    const pendingUsers = masjidUsers.filter(u => u.status === 'PENDING');

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: allMasjidTxns.length,
      memberCount: masjidMembers.length,
      activeUsersCount: activeUsers.length,
      pendingUsersCount: pendingUsers.length,
      pendingApprovalCount,
      pendingApprovalAmount,
      fullyApprovedCount
    };
  };

  const getOverallStats = () => {
    let totalIncomeAll = 0;
    let totalExpenseAll = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      // Only include vouchers approved by president
      if (t.presidentApproval?.approved) {
        if (t.type === 'INCOME') totalIncomeAll += amt;
        else totalExpenseAll += amt;
      }
    });

    const approvedMosques = mosques.filter(m => m.status === 'APPROVED').length;
    const pendingMosques = mosques.filter(m => m.status === 'PENDING').length;

    return {
      totalMosques: mosques.length,
      approvedMosques,
      pendingMosques,
      totalIncomeAll,
      totalExpenseAll,
      totalBalanceAll: totalIncomeAll - totalExpenseAll,
      totalUsersCount: users.length
    };
  };

  const exportDataJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      mosques,
      users,
      transactions,
      members
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `masjid_hisab_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.mosques && data.users && data.transactions) {
        setMosques(data.mosques);
        setUsers(data.users);
        setTransactions(data.transactions);
        if (data.members) setMembers(data.members);
        return { success: true, message: 'ডাটা সফলভাবে রিস্টোর হয়েছে!' };
      }
      return { success: false, message: 'ভুল ডাটা ফরম্যাট! ফাইলটি যাচাই করুন।' };
    } catch {
      return { success: false, message: 'JSON ফাইল পার্স করতে সমস্যা হয়েছে।' };
    }
  };

  const resetToDefaultData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল ডাটা রিসেট করে প্রাথমিক ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
      setMosques(INITIAL_MOSQUES);
      setUsers(INITIAL_USERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setMembers(INITIAL_MEMBERS);
      setCurrentUser(INITIAL_USERS[1]);
      setActiveMasjidIdState('masjid-barun');
      localStorage.clear();
      alert('সিস্টেমের সকল ডাটা সফলভাবে প্রাথমিক রূপরেখায় রিসেট করা হয়েছে।');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeMasjid,
        mosques,
        users,
        transactions,
        members,
        useBengaliDigits,
        toggleBengaliDigits,
        login,
        logout,
        quickLoginAs,
        registerMosqueAndAdmin,
        registerGeneralUser,
        approveMosque,
        approveUser,
        updateMosqueDetailsAndTemplate,
        setActiveMasjidId,
        deleteMosque,
        updateMosque,
        deleteUser,
        updateUser,
        addTransaction,
        deleteTransaction,
        approveVoucherTier,
        batchApproveVouchers,
        addMember,
        deleteMember,
        getMasjidStats,
        getOverallStats,
        exportDataJSON,
        importDataJSON,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
