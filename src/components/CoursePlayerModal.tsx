import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Circle,
  Download,
  BookOpen,
  ChevronRight,
  FileCode
} from 'lucide-react';
import type { Course, Lesson } from '../types';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose
}) => {
  if (!course) return null;

  // Flatten all lessons
  const allLessons: { lesson: Lesson; moduleName: string }[] = [];
  course.curriculum.forEach(m => {
    m.lessons.forEach(l => {
      allLessons.push({ lesson: l, moduleName: m.module });
    });
  });

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessonIndices, setCompletedLessonIndices] = useState<number[]>([0]);

  const currentItem = allLessons[currentLessonIndex] || allLessons[0];
  const progressPercent = Math.round((completedLessonIndices.length / allLessons.length) * 100);

  const toggleLessonCompleted = (idx: number) => {
    if (completedLessonIndices.includes(idx)) {
      setCompletedLessonIndices(completedLessonIndices.filter(i => i !== idx));
    } else {
      setCompletedLessonIndices([...completedLessonIndices, idx]);
    }
  };

  const nextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      if (!completedLessonIndices.includes(currentLessonIndex)) {
        setCompletedLessonIndices([...completedLessonIndices, currentLessonIndex]);
      }
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[94vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400">
                {currentItem.moduleName} • Casharka {currentLessonIndex + 1} ee {allLessons.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">{progressPercent}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Classroom Main Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Video Player Column */}
          <div className="flex-1 flex flex-col bg-black overflow-y-auto">
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                key={currentItem.lesson.title}
                src={currentItem.lesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Footer info & actions */}
            <div className="p-6 bg-slate-900/90 border-t border-slate-800/80 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Casharka Hadda Socda
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-0.5">
                    {currentItem.lesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleLessonCompleted(currentLessonIndex)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      completedLessonIndices.includes(currentLessonIndex)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {completedLessonIndices.includes(currentLessonIndex) ? 'Dhamaystiran' : 'Calaamadee in la dhameeyay'}
                    </span>
                  </button>

                  {currentLessonIndex < allLessons.length - 1 && (
                    <button
                      onClick={nextLesson}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <span>Casharka Xiga</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Description & Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Nuxurka Casharkan</span>
                  </h4>
                  <p className="leading-relaxed text-slate-400">
                    Casharkan waxaad ku baranaysaa talaabooyinka ficilka ah ee la xiriira {currentItem.lesson.title}. Hubi inaad la socoto adigoo furaya editor-kaaga si aad gacanta ugu tijaabiso.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-teal-400" />
                    <span>Faylasha Casharka & Qaybaha (Resources)</span>
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => alert('Faylka tusaalaha casharka waxaad ka heli kartaa repository-ga GitHub.')}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
                    >
                      <span className="truncate">Source-Code-Lesson-{currentLessonIndex + 1}.zip</span>
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-64 lg:h-auto overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Liiska Casharrada</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {completedLessonIndices.length}/{allLessons.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {allLessons.map((item, idx) => {
                const isCurrent = idx === currentLessonIndex;
                const isDone = completedLessonIndices.includes(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentLessonIndex(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      isCurrent
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLessonCompleted(idx);
                      }}
                      className="mt-0.5"
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 hover:text-emerald-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug line-clamp-2 ${isCurrent ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {idx + 1}. {item.lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>{item.lesson.duration}</span>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{item.moduleName}</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
