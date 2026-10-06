-- ========================================================
-- GAADH XIRFAD - SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Admin Email: mohaking918@gmail.com
-- Payment Receiver: +252 676863923 (Zaad, EVC Plus, Sahal)
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  instructor TEXT DEFAULT 'Gaadh Xirfad Academy',
  duration TEXT DEFAULT '20 Saacadood',
  lessons_count INTEGER DEFAULT 18,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  curriculum JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENROLLMENTS / ORDERS TABLE
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  course_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'Zaad', 'EVC Plus', 'Sahal'
  sender_number TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR auth.jwt() ->> 'email' = 'mohaking918@gmail.com');

-- Courses Policies
DROP POLICY IF EXISTS "Courses are readable by everyone" ON courses;
CREATE POLICY "Courses are readable by everyone"
  ON courses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admin can insert courses" ON courses;
CREATE POLICY "Only admin can insert courses"
  ON courses FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = 'mohaking918@gmail.com');

DROP POLICY IF EXISTS "Only admin can update courses" ON courses;
CREATE POLICY "Only admin can update courses"
  ON courses FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'mohaking918@gmail.com');

DROP POLICY IF EXISTS "Only admin can delete courses" ON courses;
CREATE POLICY "Only admin can delete courses"
  ON courses FOR DELETE
  USING (auth.jwt() ->> 'email' = 'mohaking918@gmail.com');

-- Enrollments Policies
DROP POLICY IF EXISTS "Users can view their own enrollments or admin view all" ON enrollments;
CREATE POLICY "Users can view their own enrollments or admin view all"
  ON enrollments FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'email' = 'mohaking918@gmail.com'
  );

DROP POLICY IF EXISTS "Authenticated users can create enrollment" ON enrollments;
CREATE POLICY "Authenticated users can create enrollment"
  ON enrollments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'email' = 'mohaking918@gmail.com'
    OR user_id IS NULL -- allows guest orders if not yet signed in
  );

DROP POLICY IF EXISTS "Admin can update enrollment status" ON enrollments;
CREATE POLICY "Admin can update enrollment status"
  ON enrollments FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'mohaking918@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'mohaking918@gmail.com');

-- Trigger to create profile automatically on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    CASE WHEN new.email = 'mohaking918@gmail.com' THEN 'admin' ELSE 'student' END
  )
  ON CONFLICT (id) DO UPDATE
  SET role = CASE WHEN EXCLUDED.email = 'mohaking918@gmail.com' THEN 'admin' ELSE profiles.role END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- SEED DATA: COURSES
-- ========================================================
INSERT INTO courses (id, title, slug, description, instructor, duration, lessons_count, price, category, thumbnail_url, featured, curriculum)
VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Barashada Full-Stack Web Development (React, Next.js & Tailwind)',
  'fullstack-web-development',
  'Koorso dhamaystiran oo aad ku baranayso dhisida websaytyo iyo web apps casri ah bilow ilaa heer xirfadle. Waxaad baran doontaa HTML, CSS, JavaScript, React 19, Next.js 15, Supabase, iyo sida loo geeyo internet-ka.',
  'Ustaad Maxamed Cabdi',
  '32 Saacadood',
  42,
  35.00,
  'Web Development',
  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1200&auto=format&fit=crop',
  true,
  '[
    {"module": "Qeybta 1: Barashada HTML5 & Modern CSS", "lessons": [{"title": "Horudhaca Web-ka & Deegaanka Shaqada (VS Code)", "duration": "25 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Semantic HTML iyo Dhismaha Bogga", "duration": "40 daqiiqo", "preview": false}, {"title": "CSS Flexbox & Grid Masterclass", "duration": "55 daqiiqo", "preview": false}]},
    {"module": "Qeybta 2: JavaScript Casri ah (ES6+)", "lessons": [{"title": "Variables, Functions & Array Methods", "duration": "50 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Async/Await iyo Fetching Data APIs", "duration": "45 daqiiqo", "preview": false}]},
    {"module": "Qeybta 3: React.js & Tailwind CSS", "lessons": [{"title": "React Components & State Hooks", "duration": "60 daqiiqo", "preview": false}, {"title": "Tailwind CSS Styling & Responsive Design", "duration": "45 daqiiqo", "preview": false}]},
    {"module": "Qeybta 4: Dhisida Mashruuca Ugu Danbeeya & Supabase", "lessons": [{"title": "Isku xirka Database & Auth (Supabase)", "duration": "75 daqiiqo", "preview": false}, {"title": "Deployment to Vercel & Netlify", "duration": "30 daqiiqo", "preview": false}]}
  ]'::jsonb
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Graphic Design & UI/UX Masterclass (Figma, Photoshop, Illustrator)',
  'graphic-design-ui-ux',
  'Baro naqshadaynta xayeysiisyada ganacsiyada, logo samaynta, social media posters, iyo UI/UX design casri ah adoo isticmaalaya Figma iyo Adobe Suite.',
  'Eng. Ayaan Axmed',
  '24 Saacadood',
  30,
  25.00,
  'Graphic Design',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
  true,
  '[
    {"module": "Qeybta 1: Aasaaska Naqshadaynta (Design Principles)", "lessons": [{"title": "Color Theory & Typography", "duration": "35 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Layout & Visual Hierarchy", "duration": "40 daqiiqo", "preview": false}]},
    {"module": "Qeybta 2: Adobe Photoshop Professional", "lessons": [{"title": "Photo Manipulation & Background Removal", "duration": "50 daqiiqo", "preview": false}, {"title": "Social Media Ad Posters Samayntooda", "duration": "65 daqiiqo", "preview": false}]},
    {"module": "Qeybta 3: Figma & UI/UX App Design", "lessons": [{"title": "Figma Wireframing & Auto-Layout", "duration": "55 daqiiqo", "preview": false}, {"title": "Interactive Prototype & Mobile App UI", "duration": "70 daqiiqo", "preview": false}]}
  ]'::jsonb
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Video Editing & Motion Graphics (Premiere Pro & After Effects)',
  'video-editing-motion-graphics',
  'Xirfadda ugu doonista badan ee suuqa maanta! Baro jarjarista fiidiyowyada, color grading, sound design, iyo animation-yada After Effects ee Reels, TikTok, YouTube & TV Ads.',
  'Khaliil Cabdiraxmaan',
  '28 Saacadood',
  36,
  30.00,
  'Video Editing',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
  true,
  '[
    {"module": "Qeybta 1: Adobe Premiere Pro", "lessons": [{"title": "Workspace, Timeline & Cutting Techniques", "duration": "40 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Transitions, Keyframing & Speed Ramps", "duration": "50 daqiiqo", "preview": false}, {"title": "Professional Color Grading & LUTs", "duration": "45 daqiiqo", "preview": false}]},
    {"module": "Qeybta 2: After Effects & Motion Graphics", "lessons": [{"title": "Lower Thirds, Text Animation & Titles", "duration": "55 daqiiqo", "preview": false}, {"title": "VFX & Green Screen Mastery", "duration": "60 daqiiqo", "preview": false}]}
  ]'::jsonb
),
(
  'd4444444-4444-4444-4444-444444444444',
  'Aasaaska Kumbuyuutarka & Microsoft Office (Word, Excel, PowerPoint)',
  'basic-computer-skills',
  'Koorso loogu talagalay qof walba oo doonaya inuu barto computer-ka bilow ilaa heer aad si xirfad leh u isticmaasho Microsoft Word, Excel formulas, PowerPoint presentations, iyo email management.',
  'Faadumo Nuur',
  '18 Saacadood',
  24,
  20.00,
  'Basic Computer',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
  false,
  '[
    {"module": "Qeybta 1: Barashada Windows & Computer Basics", "lessons": [{"title": "Qaybaha Kumbuyuutarka & File Management", "duration": "30 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Internet-ka, Browsers & Amniga Xogta", "duration": "35 daqiiqo", "preview": false}]},
    {"module": "Qeybta 2: Microsoft Word Professional", "lessons": [{"title": "Qorista Warqadaha Rasmiga ah & CV Samaynta", "duration": "45 daqiiqo", "preview": false}]},
    {"module": "Qeybta 3: Microsoft Excel Practical Formulas", "lessons": [{"title": "Tables, SUM, AVERAGE, IF Functions", "duration": "60 daqiiqo", "preview": false}, {"title": "Xisaabaadka Ganacsiga & Reports", "duration": "50 daqiiqo", "preview": false}]}
  ]'::jsonb
),
(
  'e5555555-5555-5555-5555-555555555555',
  'Barashada Python Programming & Automation',
  'python-programming-automation',
  'Baro luuqadda Python si fudud oo ficil ah. Dhis barnaamijyo, automate garee howlaha maalinlaha ah, oo baro aasaaska xogta (Data Analysis).',
  'Eng. Cali Jaamac',
  '26 Saacadood',
  32,
  28.00,
  'Web Development',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  false,
  '[
    {"module": "Qeybta 1: Python Fundamentals", "lessons": [{"title": "Setup, Syntax & Data Types", "duration": "35 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}, {"title": "Loops, Conditionals & Functions", "duration": "45 daqiiqo", "preview": false}]},
    {"module": "Qeybta 2: File Handling & Automation Scripts", "lessons": [{"title": "Automating Excel & PDF files", "duration": "55 daqiiqo", "preview": false}, {"title": "Web Scraping with Beautiful Soup", "duration": "60 daqiiqo", "preview": false}]}
  ]'::jsonb
),
(
  'f6666666-6666-6666-6666-666666666666',
  'Dhisida Mobile Apps (Flutter & Dart)',
  'mobile-app-development-flutter',
  'Ku dhis hal code app-ka Android iyo iOS adigoo isticmaalaya Flutter framework. Baro UI design, State Management, iyo isku xirka REST API & Supabase.',
  'Xasan Diiriye',
  '30 Saacadood',
  38,
  35.00,
  'Web Development',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
  false,
  '[
    {"module": "Qeybta 1: Dart Programming", "lessons": [{"title": "Dart Basics & Object Oriented Programming", "duration": "45 daqiiqo", "preview": true, "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"}]},
    {"module": "Qeybta 2: Flutter Widgets & Layouts", "lessons": [{"title": "Stateless vs Stateful Widgets", "duration": "50 daqiiqo", "preview": false}, {"title": "Clean Architecture & State Management", "duration": "60 daqiiqo", "preview": false}]}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
