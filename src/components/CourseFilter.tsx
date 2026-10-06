import React from 'react';
import { LayoutGrid, Code, Palette, Video, Monitor, Smartphone } from 'lucide-react';

interface CourseFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalCoursesCount: number;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCoursesCount
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Development':
        return <Code className="w-4 h-4" />;
      case 'Graphic Design':
        return <Palette className="w-4 h-4" />;
      case 'Video Editing':
        return <Video className="w-4 h-4" />;
      case 'Basic Computer':
        return <Monitor className="w-4 h-4" />;
      case 'Mobile Apps':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Courses count badge */}
      <div className="text-xs text-slate-400 whitespace-nowrap self-end sm:self-center font-medium bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
        Waxaa diyaar ah: <strong className="text-emerald-400 font-bold">{totalCoursesCount}</strong> koorso
      </div>
    </div>
  );
};
