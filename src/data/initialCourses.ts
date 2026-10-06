import type { Course, Enrollment } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Barashada Full-Stack Web Development (React, Next.js & Tailwind)',
    slug: 'fullstack-web-development',
    description: 'Koorso dhamaystiran oo aad ku baranayso dhisida websaytyo iyo web apps casri ah bilow ilaa heer xirfadle. Waxaad baran doontaa HTML, CSS, JavaScript, React 19, Next.js, Supabase, iyo sida mashruucaaga loogu daro internet-ka.',
    instructor: 'Ustaad Maxamed Cabdi',
    duration: '32 Saacadood',
    lessons_count: 42,
    price: 35.00,
    category: 'Web Development',
    thumbnail_url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    curriculum: [
      {
        module: 'Qeybta 1: Barashada HTML5 & Modern CSS',
        lessons: [
          { title: 'Horudhaca Web-ka & Deegaanka Shaqada (VS Code)', duration: '25 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
          { title: 'Semantic HTML5 iyo Dhismaha Bogga Internet-ka', duration: '40 daqiiqo', preview: false },
          { title: 'CSS Flexbox & Modern Grid Masterclass', duration: '55 daqiiqo', preview: false },
          { title: 'Responsive Design & Mobile Optimization', duration: '45 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 2: JavaScript Casri ah (ES6+)',
        lessons: [
          { title: 'Variables, Functions & Modern Array Methods', duration: '50 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
          { title: 'DOM Manipulation iyo Event Listeners', duration: '45 daqiiqo', preview: false },
          { title: 'Async/Await iyo Fetching Data from APIs', duration: '55 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 3: React.js & Tailwind CSS',
        lessons: [
          { title: 'React Components, Props & Hooks (useState, useEffect)', duration: '60 daqiiqo', preview: false },
          { title: 'Tailwind CSS Utility Classes & Component Styling', duration: '45 daqiiqo', preview: false },
          { title: 'Custom Hooks iyo State Management', duration: '55 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 4: Dhisida Mashruuca Ugu Danbeeya & Supabase',
        lessons: [
          { title: 'Isku xirka Database & Supabase Authentication', duration: '75 daqiiqo', preview: false },
          { title: 'Deployment to Vercel & Netlify oo toos ah', duration: '30 daqiiqo', preview: false }
        ]
      }
    ]
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    title: 'Graphic Design & UI/UX Masterclass (Figma, Photoshop, Illustrator)',
    slug: 'graphic-design-ui-ux',
    description: 'Baro naqshadaynta xayeysiisyada ganacsiyada, logo samaynta, social media posters, iyo UI/UX design casri ah adoo isticmaalaya Figma iyo Adobe Suite.',
    instructor: 'Eng. Ayaan Axmed',
    duration: '24 Saacadood',
    lessons_count: 30,
    price: 25.00,
    category: 'Graphic Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    curriculum: [
      {
        module: 'Qeybta 1: Aasaaska Naqshadaynta (Design Principles)',
        lessons: [
          { title: 'Color Theory, Contrast & Typography', duration: '35 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
          { title: 'Visual Hierarchy & Balance ee Xayeysiiska', duration: '40 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 2: Adobe Photoshop Professional',
        lessons: [
          { title: 'Photo Manipulation, Cutout & Background Removal', duration: '50 daqiiqo', preview: false },
          { title: 'Samaynta Social Media Posters Ganacsi ah', duration: '65 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 3: Figma & UI/UX App Design',
        lessons: [
          { title: 'Figma Auto-Layout & Design System', duration: '55 daqiiqo', preview: false },
          { title: 'Interactive Prototypes & Mobile App UI Design', duration: '70 daqiiqo', preview: false }
        ]
      }
    ]
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: 'Video Editing & Motion Graphics (Premiere Pro & After Effects)',
    slug: 'video-editing-motion-graphics',
    description: 'Xirfadda ugu doonista badan ee suuqa maanta! Baro jarjarista fiidiyowyada, color grading, sound design, iyo animation-yada After Effects ee Reels, TikTok, YouTube & TV Ads.',
    instructor: 'Khaliil Cabdiraxmaan',
    duration: '28 Saacadood',
    lessons_count: 36,
    price: 30.00,
    category: 'Video Editing',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    curriculum: [
      {
        module: 'Qeybta 1: Adobe Premiere Pro Mastery',
        lessons: [
          { title: 'Workspace, Timeline & Cutting Techniques', duration: '40 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
          { title: 'Transitions, Keyframing & Speed Ramping', duration: '50 daqiiqo', preview: false },
          { title: 'Color Grading & Cinematic LUTs', duration: '45 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 2: After Effects & Motion Design',
        lessons: [
          { title: 'Lower Thirds, Kinetic Typography & Titles', duration: '55 daqiiqo', preview: false },
          { title: 'Visual Effects (VFX) & Green Screen Samaynta', duration: '60 daqiiqo', preview: false }
        ]
      }
    ]
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Aasaaska Kumbuyuutarka & Microsoft Office (Word, Excel, PowerPoint)',
    slug: 'basic-computer-skills',
    description: 'Koorso loogu talagalay qof walba oo doonaya inuu barto computer-ka bilow ilaa heer aad si xirfad leh u isticmaasho Microsoft Word, Excel formulas, PowerPoint presentations, iyo email management.',
    instructor: 'Faadumo Nuur',
    duration: '18 Saacadood',
    lessons_count: 24,
    price: 20.00,
    category: 'Basic Computer',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    curriculum: [
      {
        module: 'Qeybta 1: Barashada Windows & Kumbuyuutarka',
        lessons: [
          { title: 'Qaybaha Kumbuyuutarka & File Management', duration: '30 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
          { title: 'Internet-ka, Browsers & Amniga Xogta Gaarka ah', duration: '35 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 2: Microsoft Word Professional',
        lessons: [
          { title: 'Qorista Warqadaha Rasmiga ah & CV Samaynta', duration: '45 daqiiqo', preview: false },
          { title: 'Naqshadaynta Reports & Books ee Word', duration: '40 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 3: Microsoft Excel Practical Formulas',
        lessons: [
          { title: 'Tables, SUM, AVERAGE, IF Formulas', duration: '60 daqiiqo', preview: false },
          { title: 'Xisaabaadka Ganacsiga & Financial Reports', duration: '50 daqiiqo', preview: false }
        ]
      }
    ]
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    title: 'Barashada Python Programming & Automation',
    slug: 'python-programming-automation',
    description: 'Baro luuqadda Python si fudud oo ficil ah. Dhis barnaamijyo, automate garee howlaha maalinlaha ah, oo baro aasaaska falanqaynta xogta (Data Analysis).',
    instructor: 'Eng. Cali Jaamac',
    duration: '26 Saacadood',
    lessons_count: 32,
    price: 28.00,
    category: 'Web Development',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    curriculum: [
      {
        module: 'Qeybta 1: Python Fundamentals',
        lessons: [
          { title: 'Setup, Python Syntax & Data Types', duration: '35 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
          { title: 'Loops, Conditional Logic & Functions', duration: '45 daqiiqo', preview: false }
        ]
      },
      {
        module: 'Qeybta 2: Automation Scripts & Web Scraping',
        lessons: [
          { title: 'Automating Excel & PDF Files', duration: '55 daqiiqo', preview: false },
          { title: 'Web Scraping using Beautiful Soup', duration: '60 daqiiqo', preview: false }
        ]
      }
    ]
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    title: 'Dhisida Mobile Apps (Flutter & Dart)',
    slug: 'mobile-app-development-flutter',
    description: 'Ku dhis hal code app-ka Android iyo iOS adigoo isticmaalaya Flutter framework. Baro UI design, State Management, iyo isku xirka REST API & Supabase.',
    instructor: 'Xasan Diiriye',
    duration: '30 Saacadood',
    lessons_count: 38,
    price: 35.00,
    category: 'Mobile Apps',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    curriculum: [
      {
        module: 'Qeybta 1: Dart Programming Language',
        lessons: [
          { title: 'Dart Basics & Object Oriented Programming', duration: '45 daqiiqo', preview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
        ]
      },
      {
        module: 'Qeybta 2: Flutter Widgets & State Management',
        lessons: [
          { title: 'Stateless vs Stateful Widgets & Layouts', duration: '50 daqiiqo', preview: false },
          { title: 'Clean Architecture & Provider / Riverpod', duration: '60 daqiiqo', preview: false }
        ]
      }
    ]
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'ord-101',
    user_id: 'user-sample-1',
    course_id: 'a1111111-1111-1111-1111-111111111111',
    student_name: 'Guuleed Sharmaarke',
    student_email: 'guuleed@example.com',
    course_title: 'Barashada Full-Stack Web Development (React, Next.js & Tailwind)',
    amount: 35,
    payment_method: 'Zaad',
    sender_number: '+252 63 4567890',
    transaction_id: 'TX892348',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ord-102',
    user_id: 'user-sample-2',
    course_id: 'b2222222-2222-2222-2222-222222222222',
    student_name: 'Nasro Jaamac',
    student_email: 'nasro.j@example.com',
    course_title: 'Graphic Design & UI/UX Masterclass (Figma, Photoshop, Illustrator)',
    amount: 25,
    payment_method: 'EVC Plus',
    sender_number: '+252 61 5882314',
    transaction_id: 'EVC-99120',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'ord-103',
    user_id: 'user-sample-3',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    student_name: 'Cabdirisaaq Xuseen',
    student_email: 'c.xuseen@example.com',
    course_title: 'Video Editing & Motion Graphics (Premiere Pro & After Effects)',
    amount: 30,
    payment_method: 'Sahal',
    sender_number: '+252 90 7112233',
    transaction_id: 'SHL-44102',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];
