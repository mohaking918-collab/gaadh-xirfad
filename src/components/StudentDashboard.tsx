import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import type { Course, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { MERCHANT_PHONE } from '../lib/supabase';

interface StudentDashboardProps {
  enrollments: Enrollment[];
  courses: Course[];
  onOpenClassroom: (course: Course) => void;
  onExploreCourses: () => void;
  onRefresh: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  enrollments,
  courses,
  onOpenClassroom,
  onExploreCourses,
  onRefresh
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  // Filter enrollments for current student
  const studentEnrollments = enrollments.filter(e => {
    if (user?.email) {
      return e.student_email.toLowerCase() === user.email.toLowerCase();
    }
    return true;
  });

  const filteredList = studentEnrollments.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = e.course_title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCourseDetails = (courseId: string, courseTitle: string) => {
    return courses.find(c => c.id === courseId || c.title.toLowerCase() === courseTitle.toLowerCase()) || courses[0];
  };

  const getWhatsAppFollowupLink = (enrollment: Enrollment) => {
    const cleanNumber = MERCHANT_PHONE.replace(/[^0-9]/g, '');
    const msg = `Asc Admin, waxaan sugayaa xaqiijinta koorsada: ${enrollment.course_title} ($${enrollment.amount}).
Email: ${enrollment.student_email}
Numberka: ${enrollment.sender_number}
Tixraaca: ${enrollment.transaction_id || 'Ma jiro'}`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Xafiiska Ardayga
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Koorsooyinkayga (My Courses)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ku soo dhowow, <strong className="text-slate-200">{user?.full_name || user?.email || 'Arday'}</strong>. Halkaan kala soco koorsooyinka aad is-diiwaangelisay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cusboonaysii</span>
          </button>
          <button
            onClick={onExploreCourses}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <span>Koorso Cusub Dooro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dhammaan ({studentEnrollments.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'approved'
                ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>La Xaqiijiyay ({studentEnrollments.filter(e => e.status === 'approved').length})</span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Sugaya Xaqiijin ({studentEnrollments.filter(e => e.status === 'pending').length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Raadi koorso..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Courses List */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            Weli koorso kuma jirtid
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6">
            Kama diiwaangashanid koorsooyin hadda. Sahami liiska koorsooyinka oo bilow barashada xirfadaha casriga ah!
          </p>
          <button
            onClick={onExploreCourses}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/25"
          >
            Daawo Koorsooyinka Diyaar ah
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((enrollment) => {
            const course = getCourseDetails(enrollment.course_id, enrollment.course_title);
            const isApproved = enrollment.status === 'approved';
            const isPending = enrollment.status === 'pending';
            const isRejected = enrollment.status === 'rejected';

            return (
              <div
                key={enrollment.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isApproved && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>La Xaqiijiyay (Approved)</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Sugaya Xaqiijin (Pending)</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Lama Aqbalin (Rejected)</span>
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400">
                    {course.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-2 mb-2 leading-snug">
                      {course.title}
                    </h3>

                    {/* Order Details Snippet */}
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between text-slate-400">
                        <span>Habka Lacagta:</span>
                        <span className="text-white font-medium">{enrollment.payment_method} (${enrollment.amount})</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Number-kaaga:</span>
                        <span className="text-slate-300 font-mono">{enrollment.sender_number}</span>
                      </div>
                      {enrollment.transaction_id && (
                        <div className="flex justify-between text-slate-400">
                          <span>TxID:</span>
                          <span className="text-emerald-400 font-mono">{enrollment.transaction_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action based on status */}
                  <div>
                    {isApproved ? (
                      <button
                        onClick={() => onOpenClassroom(course)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Gal Casharrada (Start Learning)</span>
                      </button>
                    ) : isPending ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-tight">
                          Dalabkaaga waa la helay. Admin-ka ayaa xaqiijinaya lacag-bixintaada dhowr daqiiqo gudahood.
                        </div>
                        <a
                          href={getWhatsAppFollowupLink(enrollment)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Dedeji Xaqiijinta (WhatsApp)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] leading-tight">
                          Dalabka lacag-bixinta lama xaqiijin. Fadlan la xiriir maamulka.
                        </div>
                        <a
                          href={getWhatsAppFollowupLink(enrollment)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Wax ka weydii WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
