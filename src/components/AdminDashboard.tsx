import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Clock,
  Users,
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageCircle,
  PlusCircle,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Course, Enrollment, EnrollmentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL, updateEnrollmentStatus, createCourse } from '../lib/supabase';

interface AdminDashboardProps {
  enrollments: Enrollment[];
  courses: Course[];
  onRefresh: () => void;
  onCourseAdded: (course: Course) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  enrollments,
  courses,
  onRefresh,
  onCourseAdded
}) => {
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Course addition modal state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('25');
  const [newCourseCategory, setNewCourseCategory] = useState('Web Development');
  const [newCourseInstructor, setNewCourseInstructor] = useState('Gaadh Xirfad Academy');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // 1. STRICT ROUTE GUARD & ACCESS CHECK
  const isAuthorized = user?.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAuthorized) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-heading">
          Ogolaansho Ma Haysatid (Access Denied)
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
          Qeybta maamulka waxaa geli kara oo kaliya email-ka rasmiga ah ee <code className="text-emerald-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{ADMIN_EMAIL}</code>.
        </p>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto text-xs text-slate-400 mb-6">
          Email-ka hadda galay: <strong className="text-rose-400">{user?.email || 'Maba gashanid (Guest)'}</strong>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Ku Noqo Bogga Hore
          </a>
        </div>
      </div>
    );
  }

  // 2. METRICS COMPUTATION
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const rejectedEnrollments = enrollments.filter(e => e.status === 'rejected');

  const totalVerifiedRevenue = approvedEnrollments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPendingOrders = pendingEnrollments.length;
  const uniqueStudents = new Set(enrollments.map(e => e.student_email.toLowerCase())).size;

  // Filter enrollments
  const filteredEnrollments = enrollments.filter(e => {
    const matchesFilter = statusFilter === 'all' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.student_name.toLowerCase().includes(q) ||
      e.student_email.toLowerCase().includes(q) ||
      e.course_title.toLowerCase().includes(q) ||
      e.sender_number.includes(q) ||
      (e.transaction_id && e.transaction_id.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  // Action handlers
  const handleUpdateStatus = async (id: string, newStatus: EnrollmentStatus, studentName: string) => {
    setUpdatingId(id);
    setActionSuccessMsg('');

    try {
      const ok = await updateEnrollmentStatus(id, newStatus);
      if (ok) {
        if (newStatus === 'approved') {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch {
            // ignore confetti
          }
          setActionSuccessMsg(`Dalabka ${studentName} si guul leh ayaa loo xaqiijiyay! Koorsada ayaa loo furay.`);
        } else {
          setActionSuccessMsg(`Dalabka ${studentName} waxaa loo beddelay '${newStatus}'.`);
        }
        onRefresh();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Khalad ayaa dhacay marka la cusboonaysiinayay xaaladda.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStudentWhatsAppChat = (e: Enrollment) => {
    const cleanNumber = e.sender_number.replace(/[^0-9]/g, '');
    const msg = `Asc ${e.student_name}, maamulka Gaadh Xirfad ayaa kaala soo xiriiraya dalabkaaga koorsada: ${e.course_title}.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleCreateNewCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    setIsAddingCourse(true);
    try {
      const created = await createCourse({
        title: newCourseTitle.trim(),
        slug: newCourseTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCourseDesc.trim() || 'Koorso cusub oo tayo sare leh oo lagu barto Gaadh Xirfad.',
        instructor: newCourseInstructor.trim(),
        duration: '20 Saacadood',
        lessons_count: 24,
        price: parseFloat(newCoursePrice) || 25,
        category: newCourseCategory,
        thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        featured: false,
        curriculum: [
          {
            module: 'Qeybta 1: Hordhaca Koorsada',
            lessons: [
              { title: 'Casharka 1: Hordhac & Deegaanka Shaqada', duration: '30 daqiiqo', preview: true }
            ]
          }
        ]
      });

      onCourseAdded(created);
      setShowAddCourseModal(false);
      setNewCourseTitle('');
      setNewCourseDesc('');
      setActionSuccessMsg('Koorsada cusub si guul leh ayaa loogu daray!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Khalad ayaa dhacay marka koorsada la abuurayay.');
    } finally {
      setIsAddingCourse(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Xarunta Maamulka (Super Admin)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ku soo dhowow, <strong className="text-emerald-400">{user?.email}</strong>. Halkaan ka maamul dalabaadka ardayda iyo koorsooyinka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Koorso Cusub Ku Dar</span>
          </button>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Cusboonaysii</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="my-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* 2. METRICS & OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        
        {/* Card 1: Verified Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Verified Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            ${totalVerifiedRevenue.toLocaleString()} <span className="text-xs font-medium text-emerald-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Wadarta lacagta laga xaqiijiyay dalabaadka ({approvedEnrollments.length} dalab)
          </p>
        </div>

        {/* Card 2: Pending Approval Orders */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Pending Approval Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">
            {totalPendingOrders} <span className="text-xs font-medium text-slate-400">dalab</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dalabaad u baahan xaqiijin degdeg ah
          </p>
        </div>

        {/* Card 3: Total Enrolled Students */}
        <div className="glass-card p-5 rounded-2xl border border-sky-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {uniqueStudents} <span className="text-xs font-medium text-slate-400">arday</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tirada guud ee ardayda soo codsatay
          </p>
        </div>

        {/* Card 4: Total Courses */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Active Courses</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">
            {courses.length} <span className="text-xs font-medium text-slate-400">koorso</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Koorsooyinka hadda ku jira website-ka
          </p>
        </div>

      </div>

      {/* 3. ORDER MANAGEMENT TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        
        {/* Table Filters & Search Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/70">
          <div>
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <span>Maamulka Dalabaadka (Order Management)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {filteredEnrollments.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Fiiri, xaqiiji ama diid dalabaadka lacag-bixinta ardayda
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({enrollments.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Pending ({totalPendingOrders})</span>
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Approved ({approvedEnrollments.length})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rejected ({rejectedEnrollments.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Raadi arday, email, phone..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm">
              Wax dalab ah oo waafaqsan shuruudahan lama helin.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ardayga & Email</th>
                  <th className="py-3.5 px-4">Koorsada</th>
                  <th className="py-3.5 px-4">Qiimaha & Habka</th>
                  <th className="py-3.5 px-4">Number-ka & TxID</th>
                  <th className="py-3.5 px-4">Taariikhda</th>
                  <th className="py-3.5 px-4">Xaaladda (Status)</th>
                  <th className="py-3.5 px-4 text-right">Talaabooyinka (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEnrollments.map((enrollment) => {
                  const isUpdating = updatingId === enrollment.id;

                  return (
                    <tr
                      key={enrollment.id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      {/* Student Name & Email */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">
                          {enrollment.student_name}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          {enrollment.student_email}
                        </div>
                      </td>

                      {/* Course Title */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <span className="font-medium text-slate-200 line-clamp-2">
                          {enrollment.course_title}
                        </span>
                      </td>

                      {/* Amount & Method */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-emerald-400 text-sm">
                          ${enrollment.amount}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700">
                          {enrollment.payment_method}
                        </span>
                      </td>

                      {/* Sender Phone & TxID */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-semibold text-slate-200">
                          {enrollment.sender_number}
                        </div>
                        {enrollment.transaction_id ? (
                          <div className="text-slate-400 text-[10px] font-mono mt-0.5">
                            ID: <strong className="text-amber-400">{enrollment.transaction_id}</strong>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">TxID ma jiro</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(enrollment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(enrollment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {enrollment.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                        {enrollment.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                        {enrollment.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve (Xaqiiji) Action */}
                          {enrollment.status !== 'approved' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(enrollment.id, 'approved', enrollment.student_name)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1 disabled:opacity-50"
                              title="Xaqiiji dalabka si ardaygu koorsada u helo"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Xaqiiji</span>
                            </button>
                          )}

                          {/* Reject (Diid) Action */}
                          {enrollment.status !== 'rejected' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(enrollment.id, 'rejected', enrollment.student_name)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 hover:text-white border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1 disabled:opacity-50"
                              title="Diid dalabka"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Diid</span>
                            </button>
                          )}

                          {/* Student WhatsApp Contact */}
                          <a
                            href={getStudentWhatsAppChat(enrollment)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 transition-all"
                            title="Farriin WhatsApp u dir ardayga"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* MODAL: ADD NEW COURSE */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold font-heading mb-1">
              Koorso Cusub Ku Dar
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Koorso cusub ku daabac madasha Gaadh Xirfad.
            </p>

            <form onSubmit={handleCreateNewCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cinwaanka Koorsada (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="tusaale: Barashada AI & Machine Learning"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Qiimaha ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Qeybta (Category) *
                  </label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Basic Computer">Basic Computer</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Macallinka (Instructor)
                </label>
                <input
                  type="text"
                  value={newCourseInstructor}
                  onChange={(e) => setNewCourseInstructor(e.target.value)}
                  placeholder="tusaale: Eng. Axmed"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Faahfaahin Kooban (Description)
                </label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Koorso dhamaystiran oo aad ku baranayso..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Ka Laabo
                </button>
                <button
                  type="submit"
                  disabled={isAddingCourse}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isAddingCourse ? 'Waa la xareynayaa...' : 'Ku Dar Koorsada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
