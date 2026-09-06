import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportTemplate, Mosque } from '../../types';
import {
  Settings,
  Landmark,
  FileText,
  Save,
  CheckCircle2,
  Eye,
  Building,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const MosqueTemplateSettings: React.FC = () => {
  const { activeMasjid, updateMosqueDetailsAndTemplate, currentUser } = useApp();

  const [masjidName, setMasjidName] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [address, setAddress] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Report template fields
  const [bismillahText, setBismillahText] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [phoneLine, setPhoneLine] = useState('');
  const [emailLine, setEmailLine] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [signatory1, setSignatory1] = useState('');
  const [signatory2, setSignatory2] = useState('');
  const [signatory3, setSignatory3] = useState('');
  const [footerNote, setFooterNote] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeMasjid) {
      setMasjidName(activeMasjid.name || '');
      setDistrict(activeMasjid.district || '');
      setUpazila(activeMasjid.upazila || '');
      setAddress(activeMasjid.address || '');
      setEstablishedYear(activeMasjid.establishedYear || '');
      setContactPhone(activeMasjid.contactPhone || '');
      setContactEmail(activeMasjid.contactEmail || '');

      const tmpl = activeMasjid.reportTemplate;
      setBismillahText(tmpl?.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম');
      setHeaderTitle(tmpl?.headerTitle || activeMasjid.name);
      setSubHeader(tmpl?.subHeader || 'দৈনিক অটো ক্যাশবুক ও অডিট লেজার');
      setAddressLine(tmpl?.addressLine || activeMasjid.address);
      setPhoneLine(tmpl?.phoneLine || activeMasjid.contactPhone);
      setEmailLine(tmpl?.emailLine || activeMasjid.contactEmail);
      setRegistrationNo(tmpl?.registrationNo || '');
      setSignatory1(tmpl?.signatory1 || 'ক্যাশিয়ার / হিসাবরক্ষক');
      setSignatory2(tmpl?.signatory2 || 'সাধারণ সম্পাদক');
      setSignatory3(tmpl?.signatory3 || 'সভাপতি / মুতাওয়াল্লী');
      setFooterNote(tmpl?.footerNote || '');
    }
  }, [activeMasjid]);

  if (!activeMasjid) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        মসজিদের তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const generalInfo: Partial<Mosque> = {
      name: masjidName,
      district,
      upazila,
      address,
      establishedYear,
      contactPhone,
      contactEmail
    };

    const template: Partial<ReportTemplate> = {
      bismillahText,
      headerTitle,
      subHeader,
      addressLine,
      phoneLine,
      emailLine,
      registrationNo,
      signatory1,
      signatory2,
      signatory3,
      footerNote
    };

    updateMosqueDetailsAndTemplate(activeMasjid.id, generalInfo, template);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#CFDB95] text-[#2D4A3E]">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
                মসজিদ ড্যাশবোর্ড ও রিপোর্ট টেমপ্লেট কাস্টমাইজেশন
              </h2>
            </div>
            <p className="text-xs text-[#5A5A40] mt-1.5 max-w-2xl leading-relaxed">
              এখানে মসজিদের নাম ও ঠিকানা পরিবর্তন করতে পারবেন এবং প্রতিটি ভাউচার, ক্যাশবুক ও ব্যালেন্স শিটের হেডার টেমপ্লেট নিজস্ব রূপরেখায় সাজিয়ে নিতে পারবেন।
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CFDB95]/80 text-[#2D4A3E] text-xs font-bold border border-[#2D4A3E]/20 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#2D4A3E]" />
              পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে!
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Mosque General Info + Template Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. General Mosque Info */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#2D4A3E] border-b border-[#F4F1EA] pb-3 flex items-center gap-2 font-serif-bn">
              <Building className="w-4 h-4 text-[#2D4A3E]" />
              ১. মসজিদের মৌলিক পরিচয় ও যোগাযোগের ঠিকানা
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  মসজিদের পূর্ণ নাম: *
                </label>
                <input
                  type="text"
                  required
                  value={masjidName}
                  onChange={e => setMasjidName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden font-semibold text-[#3D3D3D]"
                  placeholder="যেমন: বরুন আবুল হালিম মুন্সীবাড়ী জামে মসজিদ"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    জেলা: *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="যেমন: কুমিল্লা"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    উপজেলা / থানা: *
                  </label>
                  <input
                    type="text"
                    required
                    value={upazila}
                    onChange={e => setUpazila(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="যেমন: মুরাদনগর"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  বিস্তারিত ঠিকানা (গ্রাম / মহল্লা / ডাকঘর): *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                  placeholder="যেমন: গ্রাম: বরুন, ডাকঘর: মুরাদনগর, জেলা: কুমিল্লা"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    ইমেইল ঠিকানা:
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="masjid@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    প্রতিষ্ঠিত সন:
                  </label>
                  <input
                    type="text"
                    value={establishedYear}
                    onChange={e => setEstablishedYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="যেমন: ১৯৮২"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Report Header & Pad Template */}
          <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#2D4A3E] border-b border-[#F4F1EA] pb-3 flex items-center gap-2 font-serif-bn">
              <FileText className="w-4 h-4 text-[#2D4A3E]" />
              ২. প্রতিটি রিপোর্টে মুদ্রিত হওয়ার টেমপ্লেট কনফিগারেশন
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  প্যাডের শীর্ষে আরবী বাণী / বিসমিল্লাহ:
                </label>
                <input
                  type="text"
                  value={bismillahText}
                  onChange={e => setBismillahText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-center font-serif-bn text-[#2D4A3E] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  রিপোর্টের প্রধান হেডার টাইটেল:
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={e => setHeaderTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden font-bold text-[#2D4A3E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    সাব-হেডার (Sub-Title):
                  </label>
                  <input
                    type="text"
                    value={subHeader}
                    onChange={e => setSubHeader(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="দৈনিক অটো ক্যাশবুক ও অডিট লেজার"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    সরকারি / ওয়াকফ রেজি নং:
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={e => setRegistrationNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                    placeholder="যেমন: রেজি নং: এম-১৪২৮/২০০৫"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  রিপোর্টে প্রদর্শিত পূর্ণ ঠিকানা লাইন:
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                  placeholder="গ্রাম: বরুন, মুরাদনগর, কুমিল্লা"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    রিপোর্টে প্রদর্শিত ফোন লাইন:
                  </label>
                  <input
                    type="text"
                    value={phoneLine}
                    onChange={e => setPhoneLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                    রিপোর্টে প্রদর্শিত ইমেইল:
                  </label>
                  <input
                    type="text"
                    value={emailLine}
                    onChange={e => setEmailLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                  />
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-3 border-t border-[#F4F1EA]">
                <span className="block text-xs font-bold text-[#2D4A3E] mb-2.5">
                  রিপোর্টের নিচের ৩ জন কর্মকর্তার স্বাক্ষর পদবি:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-[#5A5A40] mb-0.5">স্বাক্ষরকারী ১:</label>
                    <input
                      type="text"
                      value={signatory1}
                      onChange={e => setSignatory1(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden text-[#3D3D3D]"
                      placeholder="ক্যাশিয়ার / হিসাবরক্ষক"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#5A5A40] mb-0.5">স্বাক্ষরকারী ২:</label>
                    <input
                      type="text"
                      value={signatory2}
                      onChange={e => setSignatory2(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden text-[#3D3D3D]"
                      placeholder="সাধারণ সম্পাদক"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#5A5A40] mb-0.5">স্বাক্ষরকারী ৩:</label>
                    <input
                      type="text"
                      value={signatory3}
                      onChange={e => setSignatory3(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:outline-hidden text-[#3D3D3D]"
                      placeholder="সভাপতি / মুতাওয়াল্লী"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3D] mb-1">
                  রিপোর্টের পাদটীকা / ফুটনোট বার্তা:
                </label>
                <textarea
                  rows={2}
                  value={footerNote}
                  onChange={e => setFooterNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FBF9F6] border border-[#E0DCCF] rounded-xl focus:ring-1 focus:ring-[#2D4A3E] focus:outline-hidden text-[#3D3D3D]"
                  placeholder="আল্লাহর সন্তুষ্টির উদ্দেশ্যে দান করুন..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            পরিবর্তন সংরক্ষণ করুন
          </button>
        </div>

        {/* Right Col: Live Preview of Report Header Pad (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-[#2D4A3E] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#2D4A3E]" />
                লাইভ রিপোর্ট হেডার ও প্যাড প্রিভিউ
              </span>
              <span className="text-[11px] text-[#8A8A8A]">প্রতিটি রিপোর্টে এটি দেখাবে</span>
            </div>

            {/* Visual Paper Pad Preview */}
            <div className="bg-white border-2 border-[#2D4A3E] rounded-3xl p-6 shadow-md space-y-4">
              {/* Pad Top */}
              <div className="text-center border-b-2 border-[#2D4A3E]/30 pb-4 space-y-1.5">
                <p className="text-xs font-serif-bn text-[#2D4A3E] font-bold tracking-wider">
                  {bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
                </p>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#2D4A3E] text-[#CFDB95] flex items-center justify-center shadow-xs">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2D4A3E] font-serif-bn leading-tight">
                    {headerTitle || masjidName || 'মসজিদের নাম'}
                  </h3>
                </div>

                {subHeader && (
                  <p className="text-xs font-medium text-[#5A5A40]">
                    {subHeader}
                  </p>
                )}

                <p className="text-[11px] text-[#3D3D3D] font-medium">
                  {addressLine || address || 'ঠিকানা'}
                </p>

                <div className="text-[10px] text-[#8A8A8A] flex flex-wrap justify-center gap-x-3">
                  {phoneLine && <span>ফোন: {phoneLine}</span>}
                  {emailLine && <span>ইমেইল: {emailLine}</span>}
                  {registrationNo && <span>{registrationNo}</span>}
                </div>
              </div>

              {/* Sample Content Watermark */}
              <div className="py-8 px-4 bg-[#FAF8F5] border border-dashed border-[#E0DCCF] rounded-2xl text-center space-y-2">
                <span className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-widest block">
                  [ক্যাশ ভাউচার / দৈনিক ক্যাশবুক / ব্যালেন্স শিট টেবিল]
                </span>
                <p className="text-xs text-[#5A5A40] italic">
                  সকল রিপোর্ট স্বয়ংক্রিয়ভাবে উপরের কাস্টমাইজড হেডার টেমপ্লেট নিয়ে প্রিন্ট ও প্রদর্শিত হবে।
                </p>
              </div>

              {/* Signatures Preview */}
              <div className="pt-4 border-t border-[#E0DCCF] grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <div className="h-6 border-b border-[#E0DCCF]"></div>
                  <span className="text-[10px] text-[#5A5A40] font-medium block truncate">
                    {signatory1 || 'ক্যাশিয়ার'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-6 border-b border-[#E0DCCF]"></div>
                  <span className="text-[10px] text-[#5A5A40] font-medium block truncate">
                    {signatory2 || 'সাধারণ সম্পাদক'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-6 border-b border-[#E0DCCF]"></div>
                  <span className="text-[10px] text-[#5A5A40] font-medium block truncate">
                    {signatory3 || 'সভাপতি'}
                  </span>
                </div>
              </div>

              {footerNote && (
                <div className="pt-2 text-center text-[10px] text-[#8A8A8A] border-t border-[#F4F1EA]">
                  {footerNote}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
