import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseFilter } from './components/CourseFilter';
import { CourseCard } from './components/CourseCard';
import { CourseDetailModal } from './components/CourseDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { StudentDashboard } from './components/StudentDashboard';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ConfigModal } from './components/ConfigModal';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import type { Course, Enrollment } from './types';
import { fetchCourses, fetchEnrollments } from './lib/supabase';
import { BookOpen, Layers } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'courses' | 'my-courses' | 'admin' | 'features'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('Dhammaan');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);
  const [playerCourse, setPlayerCourse] = useState<Course | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleOpenAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Load initial courses and enrollments
  const loadData = async () => {
    try {
      const [fetchedCourses, fetchedEnrollments] = await Promise.all([
        fetchCourses(),
        fetchEnrollments(user?.email, isAdmin)
      ]);
      setCourses(fetchedCourses);
      setEnrollments(fetchedEnrollments);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.email, isAdmin]);

  // Categories list
  const categories = [
    'Dhammaan',
    'Web Development',
    'Graphic Design',
    'Video Editing',
    'Basic Computer',
    'Mobile Apps'
  ];

  // Filter courses based on Category and Search Query
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'Dhammaan' || course.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q) ||
      course.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Check if a course is already enrolled by the student
  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some(
      (e) =>
        e.course_id === courseId &&
        (e.status === 'approved' || e.status === 'pending') &&
        (!user?.email || e.student_email.toLowerCase() === user.email.toLowerCase())
    );
  };

  const handleEnrollClick = (course: Course) => {
    setPaymentCourse(course);
  };

  const handleEnrollSuccess = () => {
    loadData();
    setTimeout(() => {
      setActiveTab('my-courses');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuthModal}
        openConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'courses' && (
          <div>
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExploreClick={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Courses Catalog Section */}
            <section id="courses-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Sahami Koorsooyinka
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                    Koorsooyinka Diyaarka Ah
                  </h2>
                </div>
              </div>

              {/* Category Filter */}
              <CourseFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                totalCoursesCount={filteredCourses.length}
              />

              {/* Courses Grid */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xs text-slate-400">Koorsooyinka waa la soo gelinayaa...</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Koorso lama helin</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Kuma helin koorso u dhiganta baaritaankaaga "{searchQuery}". Fadlan tirtir baaritaanka ama dooro qeyb kale.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Dhammaan');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    Tirtir Shaandhaynta
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnrollClick}
                      onViewDetails={setDetailCourse}
                      isEnrolled={isEnrolledInCourse(course.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Features & Benefits */}
            <FeaturesSection />
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div className="pt-12">
              <FeaturesSection />
            </div>
          </div>
        )}

        {activeTab === 'my-courses' && (
          <StudentDashboard
            enrollments={enrollments}
            courses={courses}
            onOpenClassroom={(course) => setPlayerCourse(course)}
            onExploreCourses={() => setActiveTab('courses')}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            enrollments={enrollments}
            courses={courses}
            onRefresh={loadData}
            onCourseAdded={(newCourse) => {
              setCourses([newCourse, ...courses]);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. Course Details & Curriculum Preview Modal */}
      <CourseDetailModal
        course={detailCourse}
        onClose={() => setDetailCourse(null)}
        onEnroll={(course) => {
          setDetailCourse(null);
          setPaymentCourse(course);
        }}
        isEnrolled={detailCourse ? isEnrolledInCourse(detailCourse.id) : false}
      />

      {/* 2. Local Payment Modal (Zaad, EVC Plus, Sahal) */}
      <PaymentModal
        course={paymentCourse}
        onClose={() => setPaymentCourse(null)}
        onSuccess={handleEnrollSuccess}
      />

      {/* 3. LMS Video Classroom Player for Approved Students */}
      <CoursePlayerModal
        course={playerCourse}
        onClose={() => setPlayerCourse(null)}
      />

      {/* 4. Auth Modal (Google OAuth & Demo Logins) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* 5. Supabase Config & Database Status Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
