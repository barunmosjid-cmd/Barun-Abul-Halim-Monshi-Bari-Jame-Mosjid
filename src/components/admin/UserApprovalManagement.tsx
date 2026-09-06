import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateBengali } from '../../utils/bengaliUtils';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Phone,
  Mail,
  Shield,
  Calendar
} from 'lucide-react';

export const UserApprovalManagement: React.FC = () => {
  const { activeMasjid, users, approveUser, useBengaliDigits, currentUser } = useApp();

  if (!activeMasjid) return null;

  // Filter users for this mosque
  const mosqueUsers = users.filter(u => u.masjidId === activeMasjid.id && u.role === 'GENERAL_USER');
  const pendingUsers = mosqueUsers.filter(u => u.status === 'PENDING');
  const approvedUsers = mosqueUsers.filter(u => u.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#CFDB95] text-[#2D4A3E]">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2D4A3E] font-serif-bn">
                ইউজার অনুমোদন ও সদস্য একাউন্ট নিয়ন্ত্রণ
              </h2>
            </div>
            <p className="text-xs text-[#5A5A40] mt-1.5 max-w-2xl leading-relaxed">
              {activeMasjid.name}-এর জন্য নিবন্ধিত সাধারণ ইউজার, মুসুল্লি ও কমিটি সদস্যদের অনুমোদন দিন। অনুমোদনের পরই কেবল তারা ড্যাশবোর্ডে প্রবেশ করে আয়-ব্যয়ের হিসাব দেখতে পারবেন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E0DCCF] text-[#9A7E6F] text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Clock className="w-4 h-4 text-[#9A7E6F]" />
              অপেক্ষমাণ: {pendingUsers.length} জন
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#CFDB95]/80 border border-[#2D4A3E]/20 text-[#2D4A3E] text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <UserCheck className="w-4 h-4 text-[#2D4A3E]" />
              অনুমোদিত: {approvedUsers.length} জন
            </div>
          </div>
        </div>
      </div>

      {/* 1. Pending Approvals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-[#2D4A3E] font-serif-bn flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9A7E6F]" />
            অনুমোদনের অপেক্ষায় থাকা নতুন ইউজারগণ ({pendingUsers.length})
          </h3>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E0DCCF] p-8 text-center text-[#8A8A8A] text-xs shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-[#2D4A3E] mx-auto mb-2 opacity-80" />
            বর্তমানে কোনো ইউজার অনুমোদনের অপেক্ষায় নেই। নতুন কেউ রেজিস্ট্রেশন করলে এখানে তালিকায় জমা হবে।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUsers.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-3xl border border-[#E0DCCF] p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF8F5] text-[#9A7E6F] border border-[#E0DCCF]">
                      অনুমোদন অপেক্ষমাণ
                    </span>
                    <span className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateBengali(user.createdAt, useBengaliDigits)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#2D4A3E] font-serif-bn">
                      {user.name}
                    </h4>
                    <p className="text-xs text-[#5A5A40]">পদবি: সাধারণ ইউজার / মুসুল্লি</p>
                  </div>

                  <div className="space-y-1 text-xs text-[#3D3D3D] pt-2 border-t border-[#F4F1EA]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#F4F1EA]">
                  <button
                    onClick={() => approveUser(user.id, true)}
                    className="flex-1 py-2 rounded-full bg-[#2D4A3E] hover:bg-[#3D5E50] text-[#E8EDDF] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    অনুমোদন করুন (Approve)
                  </button>

                  <button
                    onClick={() => approveUser(user.id, false)}
                    className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-rose-50 text-rose-700 border border-[#E0DCCF] hover:border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    প্রত্যাখ্যান
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Approved Users List */}
      <div className="bg-white rounded-3xl border border-[#E0DCCF] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E0DCCF] bg-[#FAF8F5] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2D4A3E] font-serif-bn flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#2D4A3E]" />
            অনুমোদিত সকল সক্রিয় ইউজার তালিকা ({approvedUsers.length})
          </h3>
          <span className="text-xs text-[#5A5A40]">তারা হিসাব ও রিপোর্ট দেখার ক্ষমতাপ্রাপ্ত</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F1EA] text-[#2D4A3E] border-b border-[#E0DCCF] font-semibold">
              <tr>
                <th className="p-3.5">ইউজারের নাম</th>
                <th className="p-3.5">ইমেইল</th>
                <th className="p-3.5">মোবাইল</th>
                <th className="p-3.5">ভূমিকা / পদবি</th>
                <th className="p-3.5">অনুমোদনের তারিখ</th>
                <th className="p-3.5 text-center">অবস্থা</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1EA]">
              {approvedUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="p-3.5 font-semibold text-[#2D4A3E] font-serif-bn text-sm">
                    {user.name}
                  </td>
                  <td className="p-3.5 text-[#3D3D3D]">{user.email}</td>
                  <td className="p-3.5 text-[#3D3D3D]">{user.phone || 'N/A'}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F5] text-[#2D4A3E] border border-[#E0DCCF]">
                      সাধারণ ইউজার
                    </span>
                  </td>
                  <td className="p-3.5 text-[#8A8A8A]">
                    {formatDateBengali(user.approvedAt || user.createdAt, useBengaliDigits)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CFDB95]/70 text-[#2D4A3E] border border-[#2D4A3E]/20 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2D4A3E]" />
                      অনুমোদিত
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => approveUser(user.id, false)}
                      className="text-rose-600 hover:text-rose-800 font-medium text-[11px] underline"
                      title="অ্যাকাউন্ট স্থগিত করুন"
                    >
                      স্থগিত করুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
