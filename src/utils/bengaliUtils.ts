const enToBnDigits: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

const bnToEnDigits: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null || num === '') return '০';
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => enToBnDigits[digit] || digit);
}

export function toEnglishNumber(str: string): string {
  if (!str) return '';
  return str.replace(/[০-৯]/g, (digit) => bnToEnDigits[digit] || digit);
}

export function formatTaka(
  amount: number | undefined | null,
  options?: { useBengaliDigits?: boolean; showDecimal?: boolean }
): string {
  const amt = Number(amount || 0);
  const useBn = options?.useBengaliDigits !== false; // default true
  const showDec = options?.showDecimal ?? true;

  const formattedEn = amt.toLocaleString('en-IN', {
    minimumFractionDigits: showDec ? 2 : 0,
    maximumFractionDigits: showDec ? 2 : 0,
  });

  if (!useBn) {
    return `৳ ${formattedEn}`;
  }

  return `৳ ${toBengaliNumber(formattedEn)}`;
}

export function formatDateTimeBengali(dateStr: string, useBengaliDigits = true): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const day = d.getDate();
    const month = monthsBn[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'বিকাল/রাত' : 'সকাল/দুপুর';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

    const formatted = `${day} ${month} ${year}, ${displayHours}:${minutes} ${ampm}`;
    return useBengaliDigits ? toBengaliNumber(formatted) : formatted;
  } catch {
    return dateStr;
  }
}

export function formatDateBengali(dateStr: string, useBengaliDigits = true): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const formatted = `${day}-${month}-${year}`;
    return useBengaliDigits ? toBengaliNumber(formatted) : formatted;
  } catch {
    return dateStr;
  }
}

// Convert amount to Bengali words
export function numberToBengaliWords(n: number): string {
  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
    'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
    'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'উনত্রিশ', 'ত্রিশ',
    'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'উনচল্লিশ', 'চল্লিশ',
    'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'উনপঞ্চাশ', 'পঞ্চাশ',
    'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'উনষাট', 'ষাট',
    'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'উনসত্তর', 'সত্তর',
    'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'উনাশি', 'আশি',
    'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'অষ্টআশি', 'ঊননব্বই', 'নব্বই',
    'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
  ];

  const intPart = Math.floor(Math.abs(n));
  if (intPart === 0) return 'শূন্য টাকা মাত্র';

  function convertTwoDigits(num: number): string {
    return units[num] || '';
  }

  function convertPart(val: number): string {
    let out = '';
    const crore = Math.floor(val / 10000000);
    val %= 10000000;
    const lakh = Math.floor(val / 100000);
    val %= 100000;
    const thousand = Math.floor(val / 1000);
    val %= 1000;
    const hundred = Math.floor(val / 100);
    const rest = val % 100;

    if (crore > 0) out += `${convertPart(crore)} কোটি `;
    if (lakh > 0) out += `${convertTwoDigits(lakh)} লাখ `;
    if (thousand > 0) out += `${convertTwoDigits(thousand)} হাজার `;
    if (hundred > 0) out += `${convertTwoDigits(hundred)} শত `;
    if (rest > 0) out += `${convertTwoDigits(rest)} `;

    return out.trim();
  }

  const words = convertPart(intPart);
  return `${words} টাকা মাত্র`;
}
