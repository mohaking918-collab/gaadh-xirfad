export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
}

export interface Lesson {
  id?: string;
  title: string;
  duration: string;
  preview?: boolean;
  videoUrl?: string;
  completed?: boolean;
}

export interface CurriculumModule {
  module: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  duration: string;
  lessons_count: number;
  price: number;
  category: 'Web Development' | 'Graphic Design' | 'Video Editing' | 'Basic Computer' | 'Mobile Apps' | string;
  thumbnail_url: string;
  featured?: boolean;
  curriculum: CurriculumModule[];
  created_at?: string;
}

export type PaymentMethod = 'Zaad' | 'EVC Plus' | 'Sahal';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  amount: number;
  payment_method: PaymentMethod;
  sender_number: string;
  transaction_id?: string;
  status: EnrollmentStatus;
  created_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingOrders: number;
  approvedOrders: number;
  totalStudents: number;
  totalCourses: number;
}
