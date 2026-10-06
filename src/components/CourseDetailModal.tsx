import React, { useState } from 'react';
import { X, Play, Clock, BookOpen, User, CheckCircle2, ChevronDown, ChevronUp, Zap, FileText } from 'lucide-react';
import type { Course, Lesson } from '../types';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onEnroll,
  isEnrolled = false
}) => {
  const [activePreviewLesson, setActivePreviewLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  if (!course) return null;

  const toggleModule = (index: number) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter(i => i !== index));
    } else {
      setExpandedModules([...expandedModules, index]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col text-slate-100">
        
        {/* Header / Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-950">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8">
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md mb-2 inline-block">
              {course.category}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight font-heading">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-8">
          
          {/* Quick info row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Baraha (Instructor)</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{course.instructor}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Waqtiga Guud</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>{course.duration}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tirada Casharrada</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{course.lessons_count} Cashar</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Kharashka Koorsada</p>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                ${course.price} USD
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Faahfaahinta Koorsada
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* What you will learn */}
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 text-emerald-400">
              Maxaad ku baran doontaa koorsadan?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dhismaha mashaariic ficil ah oo suuqa looga baahan yahay.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Fahamka qoto dheer ee qalabka iyo barnaamijyada ugu casrisan.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Helitaanka shahaado rasmi ah marka aad dhameyso koorsada.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Koox gaar ah oo ardayda iyo macallimiinta ku wada xiriiraan.</span>
              </div>
            </div>
          </div>

          {/* Video Preview if selected */}
          {activePreviewLesson && (
            <div className="bg-slate-950 rounded-2xl p-4 border border-emerald-500/40 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <Play className="w-4 h-4 fill-emerald-400" />
                  <span>Daawo Tusaalaha: {activePreviewLesson.title}</span>
                </div>
                <button
                  onClick={() => setActivePreviewLesson(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Xir Daawashada
                </button>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                <video
                  src={activePreviewLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Curriculum Syllabus Accordion */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-heading">
                Manhajka & Qeybaha Koorsada (Curriculum)
              </h3>
              <span className="text-xs text-slate-400">
                {course.curriculum.length} Qaybood
              </span>
            </div>

            <div className="space-y-3">
              {course.curriculum.map((mod, idx) => {
                const isOpen = expandedModules.includes(idx);
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50"
                  >
                    <button
                      onClick={() => toggleModule(idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-white">
                          {mod.module}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{mod.lessons.length} cashar</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 space-y-2 border-t border-slate-800/70 pt-3">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/50 text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-2.5 text-slate-300">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="font-medium">{lesson.title}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">{lesson.duration}</span>
                              {lesson.preview ? (
                                <button
                                  onClick={() => setActivePreviewLesson(lesson)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold border border-emerald-500/30"
                                >
                                  <Play className="w-3 h-3 fill-emerald-400" />
                                  <span>Daawo Tusaale</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono">Xiran (Locked)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with Enrollment Action */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Wadarta Qiimaha:</p>
            <p className="text-2xl font-black text-white font-heading">
              ${course.price} <span className="text-xs text-emerald-400 font-medium">USD (Lacag bixin hal mar ah)</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-all w-1/3 sm:w-auto"
            >
              Xir
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isEnrolled ? 'Fiiri Dalabkaaga' : 'Is-qor Hadda (Enroll Now)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
