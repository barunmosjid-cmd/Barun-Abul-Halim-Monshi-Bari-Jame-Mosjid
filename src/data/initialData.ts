import { Mosque, User, Member, Transaction } from '../types';

export const INITIAL_REPORT_TEMPLATE = {
  bismillahText: 'বিসমিল্লাহির রাহমানির রাহিম',
  headerTitle: 'বরুন আবুল হালিম মুন্সীবাড়ী জামে মসজিদ',
  subHeader: 'দৈনিক অটো ক্যাশবুক ও অডিট লেজার',
  addressLine: 'গ্রাম: বরুন, ডাকঘর: মুরাদনগর, জেলা: কুমিল্লা, বাংলাদেশ',
  phoneLine: '০১৭১২-৩৪৫৬৭৮ / ০১৮১৯-৯৮৭৬৫৪',
  emailLine: 'barunmosjid@gmail.com',
  registrationNo: 'রেজি নং: এম-১৪২৮/২০০৫',
  signatory1: 'ক্যাশিয়ার / হিসাবরক্ষক',
  signatory2: 'সাধারণ সম্পাদক',
  signatory3: 'সভাপতি / মুতাওয়াল্লী',
  footerNote: 'আল্লাহর সন্তুষ্টির উদ্দেশ্যে দান করুন। আপনার দান সাদকায়ে জারিয়া হিসেবে কবুল হোক। আমিন।',
  watermarkText: 'অফিসিয়াল কপি',
};

export const INITIAL_CATEGORIES = {
  income: [
    'জুমার ক্যাশ কালেকশন',
    'মাসিক সদস্য চাঁদা',
    'মসজিদ নির্মাণ অনুদান',
    'সাধারণ দান/সাদকা',
    'দানবাক্স কালেকশন',
    'রমজান ইফতার ও তারাবি ফান্ড',
    'ব্যাংক লভ্যাংশ / মুনাফা',
    'কোরবানি চামড়া বিক্রয় ফান্ড',
    'অন্যান্য আয়'
  ],
  expenseGroups: [
    {
      groupName: '🏗️ নির্মাণ ও উন্নয়ন খরচ',
      items: [
        '🏗️ ইট / বালু / রড / সিমেন্ট',
        '🏗️ রাজমিস্ত্রি ও শ্রমিক মজুরি',
        '🏗️ রংসামগ্রী, টাইলস ও গ্লাস',
        '🏗️ ইলেকট্রিক ও প্লাম্বিং ফিটিংস',
        '🏗️ অজুখানা ও ওয়াশরুম সংস্কার',
        '🏗️ মাইক ও সাউন্ড সিস্টেম ক্রয়'
      ]
    },
    {
      groupName: '🕌 নিয়মিত পরিচালনা ও বিল',
      items: [
        '🕌 ইমাম ও মুয়াজ্জিন বেতন/সম্মাননা',
        '🕌 খাদেম ভাতা',
        '🕌 বিদ্যুৎ ও পানি বিল',
        '🕌 মাইক ও সাউন্ড সিস্টেম মেরামত',
        '🕌 পরিষ্কার-পরিচ্ছন্নতা ও ধোলাই সামগ্রী',
        '🕌 জুমার মেহমান ও খতিব হাদিয়া',
        '🕌 অফিস ও খাতা-কলম স্টেশনারি',
        '🕌 অন্যান্য বিবিধ খরচ'
      ]
    }
  ]
};

export const INITIAL_MOSQUES: Mosque[] = [
  {
    id: 'masjid-barun',
    name: 'বরুন আবুল হালিম মুন্সীবাড়ী জামে মসজিদ',
    code: 'BARUN-01',
    district: 'কুমিল্লা',
    upazila: 'মুরাদনগর',
    address: 'গ্রাম: বরুন, ডাকঘর: মুরাদনগর, জেলা: কুমিল্লা',
    establishedYear: '১৯৮২',
    contactPhone: '০১৭১২-৩৪৫৬৭৮',
    contactEmail: 'barunmosjid@gmail.com',
    status: 'APPROVED',
    adminEmail: 'barunmosjid@gmail.com',
    adminName: 'মুন্সী আবুল কাসেম',
    createdAt: '2025-01-10T09:00:00Z',
    reportTemplate: { ...INITIAL_REPORT_TEMPLATE },
    categories: { ...INITIAL_CATEGORIES }
  },
  {
    id: 'masjid-baitul-mukarram',
    name: 'বায়তুল মোকাররম মডেল জামে মসজিদ',
    code: 'BMM-02',
    district: 'ঢাকা',
    upazila: 'পল্টন',
    address: 'দৈনিক বাংলা মোড়, পল্টন, ঢাকা-১০০০',
    establishedYear: '১৯৬৮',
    contactPhone: '০১৯১১-২২৩৩৪৪',
    contactEmail: 'baitul.admin@masjid.com',
    status: 'APPROVED',
    adminEmail: 'baitul.admin@masjid.com',
    adminName: 'মাওলানা আতিকুর রহমান',
    createdAt: '2025-02-01T10:30:00Z',
    reportTemplate: {
      bismillahText: 'বিসমিল্লাহির রাহমানির রাহিম',
      headerTitle: 'বায়তুল মোকাররম মডেল জামে মসজিদ',
      subHeader: 'কেন্দ্রীয় মসজিদ ও ইসলামিক শিক্ষা কমপ্লেক্স',
      addressLine: 'পল্টন, ঢাকা-১০০০, বাংলাদেশ',
      phoneLine: '০২-৯৫৫৫৫৫৫',
      emailLine: 'baitul.admin@masjid.com',
      registrationNo: 'জাতীয় মডেল রেজি: ০২',
      signatory1: 'হিসাব কর্মকর্তা',
      signatory2: 'সচিব / নাজের',
      signatory3: 'প্রধান খতিব ও সভাপতি',
      footerNote: 'সকল হিসাব কেন্দ্রীয় নিরীক্ষা কমিটির দ্বারা অনুমোদিত।',
      watermarkText: 'অফিসিয়াল কপি',
    },
    categories: { ...INITIAL_CATEGORIES }
  },
  {
    id: 'masjid-andarkillah',
    name: 'আন্দরকিল্লাহ শাহী জামে মসজিদ',
    code: 'ASK-03',
    district: 'চট্টগ্রাম',
    upazila: 'কোতোয়ালী',
    address: 'আন্দরকিল্লাহ মোড়, কোতোয়ালী, চট্টগ্রাম',
    establishedYear: '১৬৬৭',
    contactPhone: '০১৮১৮-৭৬৫৪৩২',
    contactEmail: 'andarkillah@masjid.com',
    status: 'APPROVED',
    adminEmail: 'andarkillah@masjid.com',
    adminName: 'আলহাজ্ব বোরহান উদ্দিন',
    createdAt: '2025-02-15T11:00:00Z',
    reportTemplate: {
      bismillahText: 'বিসমিল্লাহির রাহমানির রাহিম',
      headerTitle: 'আন্দরকিল্লাহ শাহী জামে মসজিদ',
      subHeader: 'ঐতিহাসিক কেন্দ্রীয় জামে মসজিদ',
      addressLine: 'আন্দরকিল্লাহ, কোতোয়ালী, চট্টগ্রাম',
      phoneLine: '০৩১-৬১২৩৪৫',
      emailLine: 'andarkillah@masjid.com',
      registrationNo: 'ঐতিহাসিক ওয়াকফ নং: ৯৮/চট্টগ্রাম',
      signatory1: 'হিসাবরক্ষক',
      signatory2: 'মুতাওয়াল্লী সেক্রেটারি',
      signatory3: 'সভাপতি ও মোতওয়াল্লী',
      footerNote: 'মসজিদ আল্লাহর ঘর, এখানে দান করে সওয়াব হাসিল করুন।',
      watermarkText: 'অফিসিয়াল কপি',
    },
    categories: { ...INITIAL_CATEGORIES }
  },
  {
    id: 'masjid-kasimpur',
    name: 'পদ্মা চর কাশিমপুর বাইতুন নূর জামে মসজিদ',
    code: 'KSP-04',
    district: 'রাজশাহী',
    upazila: 'বাঘা',
    address: 'চর কাশিমপুর, বাঘা, রাজশাহী',
    establishedYear: '২০১০',
    contactPhone: '০১৭৫২-৯৯৮৮৭৭',
    contactEmail: 'kasimpur.admin@masjid.com',
    status: 'PENDING',
    adminEmail: 'kasimpur.admin@masjid.com',
    adminName: 'মুহাম্মদ নজরুল ইসলাম',
    createdAt: '2026-09-01T08:00:00Z',
    reportTemplate: {
      ...INITIAL_REPORT_TEMPLATE,
      headerTitle: 'পদ্মা চর কাশিমপুর বাইতুন নূর জামে মসজিদ',
      addressLine: 'চর কাশিমপুর, বাঘা, রাজশাহী',
      emailLine: 'kasimpur.admin@masjid.com',
    },
    categories: { ...INITIAL_CATEGORIES }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-superadmin',
    name: 'কেন্দ্রীয় সুপার এডমিন (Super Admin)',
    email: 'admin@masjid.com',
    phone: '০১৭০০-০০০০০০',
    password: '123456',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    designationTitle: 'কেন্দ্রীয় সুপার এডমিন',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'u-pres-barun',
    name: 'আলহাজ্ব জহিরুল হক মুন্সী',
    email: 'president.barun@gmail.com',
    phone: '০১৭১১-২২৩৩৪৪',
    password: '123456',
    role: 'MOSQUE_ADMIN',
    committeeRole: 'PRESIDENT',
    designationTitle: 'সভাপতি / মুতাওয়াল্লী',
    status: 'APPROVED',
    masjidId: 'masjid-barun',
    createdAt: '2025-01-05T09:00:00Z',
    approvedBy: 'admin@masjid.com',
    approvedAt: '2025-01-05T10:00:00Z'
  },
  {
    id: 'u-cashier-barun',
    name: 'মোহাম্মদ ইব্রাহিম খলিল',
    email: 'cashier.barun@gmail.com',
    phone: '০১৮১২-৩৪৫৬৭৮',
    password: '123456',
    role: 'MOSQUE_ADMIN',
    committeeRole: 'CASHIER',
    designationTitle: 'ক্যাশিয়ার / হিসাবরক্ষক',
    status: 'APPROVED',
    masjidId: 'masjid-barun',
    createdAt: '2025-01-08T09:00:00Z',
    approvedBy: 'barunmosjid@gmail.com',
    approvedAt: '2025-01-08T10:00:00Z'
  },
  {
    id: 'u-admin-barun',
    name: 'মুন্সী আবুল কাসেম',
    email: 'barunmosjid@gmail.com',
    phone: '০১৭১২-৩৪৫৬৭৮',
    password: '123456',
    role: 'MOSQUE_ADMIN',
    committeeRole: 'COLLECTOR',
    designationTitle: 'আদায়কারী ও সাধারণ সম্পাদক',
    status: 'APPROVED',
    masjidId: 'masjid-barun',
    createdAt: '2025-01-10T09:00:00Z',
    approvedBy: 'admin@masjid.com',
    approvedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'u-user-barun-approved',
    name: 'মাওলানা রফিকুল ইসলাম',
    email: 'khatib.barun@gmail.com',
    phone: '০১৮১৬-৫৪৩২১০',
    password: '123456',
    role: 'GENERAL_USER',
    committeeRole: 'MEMBER',
    designationTitle: 'প্রধান খতিব ও মুসুল্লি',
    status: 'APPROVED',
    masjidId: 'masjid-barun',
    createdAt: '2025-01-15T09:00:00Z',
    approvedBy: 'barunmosjid@gmail.com',
    approvedAt: '2025-01-15T12:00:00Z'
  },
  {
    id: 'u-user-barun-pending',
    name: 'হাজী মো. ইউনুস মিয়া (নতুন মুসুল্লি)',
    email: 'musalli.pending@gmail.com',
    phone: '০১৭৭৭-৮৮৯৯০০',
    password: '123456',
    role: 'GENERAL_USER',
    committeeRole: 'MEMBER',
    status: 'PENDING',
    masjidId: 'masjid-barun',
    requestedMasjidName: 'বরুন আবুল হালিম মুন্সীবাড়ী জামে মসজিদ',
    createdAt: '2026-09-05T14:30:00Z'
  },
  {
    id: 'u-admin-baitul',
    name: 'মাওলানা আতিকুর রহমান (এডমিন)',
    email: 'baitul.admin@masjid.com',
    phone: '০১৯১১-২২৩৩৪৪',
    password: '123456',
    role: 'MOSQUE_ADMIN',
    committeeRole: 'PRESIDENT',
    designationTitle: 'প্রধান খতিব ও এডমিন',
    status: 'APPROVED',
    masjidId: 'masjid-baitul-mukarram',
    createdAt: '2025-02-01T10:30:00Z',
    approvedBy: 'admin@masjid.com',
    approvedAt: '2025-02-01T11:00:00Z'
  },
  {
    id: 'u-admin-pending',
    name: 'মুহাম্মদ নজরুল ইসলাম (প্রস্তাবিত এডমিন)',
    email: 'kasimpur.admin@masjid.com',
    phone: '০১৭৫২-৯৯৮৮৭৭',
    password: '123456',
    role: 'MOSQUE_ADMIN',
    status: 'PENDING',
    masjidId: 'masjid-kasimpur',
    requestedMasjidName: 'পদ্মা চর কাশিমপুর বাইতুন নূর জামে মসজিদ',
    createdAt: '2026-09-01T08:00:00Z'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'M-101',
    masjidId: 'masjid-barun',
    name: 'আলহাজ্ব জহিরুল হক মুন্সী',
    phone: '০১৭১১-২২৩৩৪৪',
    address: 'মুন্সীবাড়ী, বরুন, মুরাদনগর',
    monthlyFee: 1000,
    joinedDate: '2024-03-10'
  },
  {
    id: 'M-102',
    masjidId: 'masjid-barun',
    name: 'মো. ফজলুর রহমান ভূঁইয়া',
    phone: '০১৮১২-৩৪৫৬৭৮',
    address: 'পূর্ব পাড়া, বরুন',
    monthlyFee: 500,
    joinedDate: '2024-03-15'
  },
  {
    id: 'M-103',
    masjidId: 'masjid-barun',
    name: 'ডা. সাইদুর রহমান',
    phone: '০১৭৩৩-৪৪৫৫৬৬',
    address: 'উত্তর পাড়া, বরুন',
    monthlyFee: 1500,
    joinedDate: '2024-04-01'
  },
  {
    id: 'M-104',
    masjidId: 'masjid-barun',
    name: 'ইঞ্জি. তারেক মাহমুদ',
    phone: '০১৯২২-৮৮৯৯০০',
    address: 'পশ্চিম পাড়া, বরুন',
    monthlyFee: 1000,
    joinedDate: '2024-04-10'
  },
  {
    id: 'M-105',
    masjidId: 'masjid-barun',
    name: 'মাওলানা রফিকুল ইসলাম',
    phone: '০১৮১৬-৫৪৩২১০',
    address: 'মসজিদ কোয়ার্টার, বরুন',
    monthlyFee: 500,
    joinedDate: '2024-05-01'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1001',
    date: '2026-08-01T13:45',
    type: 'INCOME',
    category: 'জুমার ক্যাশ কালেকশন',
    amount: 14850,
    person: 'সাধারণ মুসল্লিবৃন্দ',
    phone: 'N/A',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'পবিত্র জুমার নামাজে বাক্স কালেকশন',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-01T14:00:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-01T14:05:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-01T14:30:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-01T15:00:00Z'
    }
  },
  {
    id: 'txn-2',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1002',
    date: '2026-08-03T11:00',
    type: 'INCOME',
    category: 'মাসিক সদস্য চাঁদা',
    amount: 10000,
    person: 'আলহাজ্ব জহিরুল হক মুন্সী (M-101)',
    memberId: 'M-101',
    phone: '০১৭১১-২২৩৩৪৪',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: '১০ মাসের চাঁদা অগ্রিম এককালীন জমা',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-03T11:15:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-03T11:20:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-03T11:45:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-03T12:00:00Z'
    }
  },
  {
    id: 'txn-3',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1003',
    date: '2026-08-05T17:30',
    type: 'EXPENSE',
    category: '🕌 বিদ্যুৎ ও পানি বিল',
    amount: 3420,
    person: 'পল্লী বিদ্যুৎ সমিতি, মুরাদনগর',
    phone: '০১৭১০-০০০০০০',
    paymentMethod: 'বিকাশ / নগদ (মোবাইল ব্যাংকিং)',
    note: 'জুলাই মাসের বিদ্যুৎ বিল পরিশোধ',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-05T17:40:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-05T17:45:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-05T18:00:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-05T18:30:00Z'
    }
  },
  {
    id: 'txn-4',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1004',
    date: '2026-08-07T14:00',
    type: 'INCOME',
    category: 'মসজিদ নির্মাণ অনুদান',
    amount: 50000,
    person: 'হাজী মো. নূরুল ইসলাম (প্রবাসী)',
    phone: '০১৭৫৫-৬৬৭৭৮৮',
    paymentMethod: 'ব্যাংক হিসাব',
    note: 'দ্বিতীয় তলার ছাদ ঢালাই কাজের জন্য বিশেষ অনুদান',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-07T14:20:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-07T14:25:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-07T15:00:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-07T15:30:00Z'
    }
  },
  {
    id: 'txn-5',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1005',
    date: '2026-08-10T10:15',
    type: 'EXPENSE',
    category: '🏗️ ইট / বালু / রড / সিমেন্ট',
    amount: 32500,
    person: 'মেসার্স ভাই ভাই হার্ডওয়্যার',
    phone: '০১৮২০-১১২২৩৩',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: '১০০ ব্যাগ সিমেন্ট ও ২ ট্রাক বালু ক্রয়',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-10T10:30:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-10T10:35:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-10T11:00:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-10T11:30:00Z'
    }
  },
  {
    id: 'txn-6',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1006',
    date: '2026-08-15T15:00',
    type: 'EXPENSE',
    category: '🕌 ইমাম ও মুয়াজ্জিন বেতন/সম্মাননা',
    amount: 22000,
    person: 'হাফেজ মাওলানা কারী আব্দুর রহমান',
    phone: '০১৮১৬-৭৭৮৮৯৯',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'ইমাম ও মুয়াজ্জিন সাহেবের জুলাই মাসের মাসিক বেতন',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-15T15:20:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-15T15:25:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-15T16:00:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-15T16:30:00Z'
    }
  },
  {
    id: 'txn-7',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1007',
    date: '2026-08-20T12:00',
    type: 'INCOME',
    category: 'মাসিক সদস্য চাঁদা',
    amount: 6000,
    person: 'মো. ফজলুর রহমান ভূঁইয়া (M-102)',
    memberId: 'M-102',
    phone: '০১৮১২-৩৪৫৬৭৮',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'বাৎসরিক ১২ মাসের চাঁদা এককালীন পরিশোধ',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-20T12:15:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-20T12:20:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-20T12:45:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-20T13:00:00Z'
    }
  },
  {
    id: 'txn-8',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1008',
    date: '2026-08-25T16:45',
    type: 'INCOME',
    category: 'সাধারণ দান/সাদকা',
    amount: 5500,
    person: 'অজ্ঞাতনামা পরহেযগার বান্দা',
    phone: 'N/A',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'মরহুম পিতা-মাতার মাগফিরাত কামনায় সদকা',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-25T17:00:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-25T17:05:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-25T17:30:00Z'
    },
    presidentApproval: {
      approved: true,
      approvedBy: 'আলহাজ্ব জহিরুল হক মুন্সী (সভাপতি)',
      approvedByEmail: 'president.barun@gmail.com',
      approvedAt: '2026-08-25T18:00:00Z'
    }
  },
  {
    id: 'txn-9',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1009',
    date: '2026-08-28T11:30',
    type: 'EXPENSE',
    category: '🏗️ রাজমিস্ত্রি ও শ্রমিক মজুরি',
    amount: 18000,
    person: 'ওস্তাদ মো. সোলেমান হেডমিস্ত্রি',
    phone: '০১৭৪০-৫৫৬৬৭৭',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'সিঁড়ি ও বারান্দার কাজ বাবদ সাপ্তাহিক মজুরি',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-08-28T11:45:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-08-28T11:45:00Z'
    },
    cashierApproval: {
      approved: true,
      approvedBy: 'মোহাম্মদ ইব্রাহিম খলিল (ক্যাশিয়ার)',
      approvedByEmail: 'cashier.barun@gmail.com',
      approvedAt: '2026-08-28T12:00:00Z'
    },
    presidentApproval: {
      approved: false // ⚠️ সভাপতির অনুমোদন এখনও হয়নি - তাই এটি হিসাবে যুক্ত হয়নি
    }
  },
  {
    id: 'txn-10',
    masjidId: 'masjid-barun',
    voucherNo: 'V-1010',
    date: '2026-09-01T13:15',
    type: 'INCOME',
    category: 'জুমার ক্যাশ কালেকশন',
    amount: 16200,
    person: 'সাধারণ মুসল্লিবৃন্দ',
    phone: 'N/A',
    paymentMethod: 'ক্যাশ (নগদ)',
    note: 'সেপ্টেম্বর মাসের প্রথম জুমার দানবাক্স কালেকশন',
    createdBy: 'barunmosjid@gmail.com',
    createdByName: 'মুন্সী আবুল কাসেম',
    createdAt: '2026-09-01T13:30:00Z',
    collectorApproval: {
      approved: true,
      approvedBy: 'মুন্সী আবুল কাসেম (আদায়কারী)',
      approvedByEmail: 'barunmosjid@gmail.com',
      approvedAt: '2026-09-01T13:30:00Z'
    },
    cashierApproval: {
      approved: false // ⚠️ ক্যাশিয়ারের অনুমোদন বাকি
    },
    presidentApproval: {
      approved: false // ⚠️ সভাপতির অনুমোদন বাকি - হিসাবে যুক্ত হয়নি
    }
  }
];
