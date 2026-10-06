import React from 'react';
import { Clock, BookOpen, User, Star, CheckCircle, Zap } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onViewDetails,
  isEnrolled = false
}) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300">
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onViewDetails(course)}>
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
          {course.category}
        </span>

        {/* Featured Pill */}
        {course.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-md">
            Ugu caansan
          </span>
        )}

        {/* Price badge in corner */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-emerald-500/90 text-white font-extrabold text-base shadow-lg backdrop-blur-md">
          ${course.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Duration & Lessons */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-2.5 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>{course.lessons_count} Cashar</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(course)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2 cursor-pointer leading-snug"
          >
            {course.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor & Rating */}
          <div className="flex items-center justify-between py-2 border-t border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
                {course.instructor}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(course)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 hover:text-white transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Faahfaahin</span>
          </button>

          {isEnrolled ? (
            <button
              onClick={() => onViewDetails(course)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Waad Diiwaangashan tahay</span>
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all text-center flex items-center justify-center gap-1 group-hover:shadow-emerald-500/40"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200" />
              <span>Is-qor (${course.price})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
