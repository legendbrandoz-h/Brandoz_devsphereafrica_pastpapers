import React, { useState } from 'react';
import { 
  X, BookOpen, Layers, Search, ChevronRight, CheckCircle2, 
  ExternalLink, Sparkles, Filter, Code2, GraduationCap 
} from 'lucide-react';
import { 
  SE_SEMESTERS, 
  SOFTWARE_ENGINEERING_UNITS, 
  SEUnit, 
  SESemesterInfo 
} from '../data/softwareEngineeringCurriculum';
import { PastPaper } from '../types';

interface SECurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (unit: SEUnit) => void;
  onOpenUnitPaper: (courseCode: string) => void;
}

export const SECurriculumModal: React.FC<SECurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectUnit,
  onOpenUnitPaper
}) => {
  const [activeYear, setActiveYear] = useState<string>('all');
  const [activeSemester, setActiveSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredUnits = SOFTWARE_ENGINEERING_UNITS.filter(unit => {
    const matchesYear = activeYear === 'all' || unit.year === activeYear;
    const matchesSemester = activeSemester === 'all' || unit.semesterCode === activeSemester;
    if (!matchesYear || !matchesSemester) return false;

    if (!searchQuery.trim()) return true;
    const clean = searchQuery.toLowerCase().trim();
    return (
      unit.code.toLowerCase().includes(clean) ||
      unit.title.toLowerCase().includes(clean) ||
      unit.semesterCode.toLowerCase().includes(clean) ||
      unit.category.toLowerCase().includes(clean) ||
      unit.coreTopics.some(t => t.toLowerCase().includes(clean))
    );
  });

  return (
    <div 
      id="se-curriculum-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-7 text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-mono font-bold uppercase tracking-widest border border-white/15">
              <Code2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Full Curriculum Directory &bull; 1.1 to 4.2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              SOFTWARE ENGINEERING UNITS
            </h2>
            <p className="text-xs text-blue-100 max-w-xl font-medium">
              Explore all {SOFTWARE_ENGINEERING_UNITS.length} curriculum units across all 4 academic years (Year 1 to Year 4, Semesters 1.1 to 4.2). Click any unit to filter or open its past examination paper.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* Quick Search */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by unit code (BSD 111, MAT 111), title, or topic..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Year Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> Year:
            </span>

            <button
              onClick={() => { setActiveYear('all'); setActiveSemester('all'); }}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeYear === 'all' && activeSemester === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All 4 Years ({SOFTWARE_ENGINEERING_UNITS.length} Units)
            </button>

            {(['Year 1', 'Year 2', 'Year 3', 'Year 4'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setActiveYear(yr);
                  setActiveSemester('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeYear === yr && activeSemester === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {yr} ({SOFTWARE_ENGINEERING_UNITS.filter(u => u.year === yr).length})
              </button>
            ))}
          </div>

          {/* Semester Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Sem:
            </span>

            <button
              onClick={() => { setActiveSemester('all'); }}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeSemester === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Semesters
            </button>

            {SE_SEMESTERS.map(sem => (
              <button
                key={sem.code}
                onClick={() => {
                  setActiveSemester(sem.code);
                  setActiveYear('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-black font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeSemester === sem.code
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Sem {sem.code}
              </button>
            ))}
          </div>

        </div>

        {/* Units Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Filter Summary Banner */}
          {(activeYear !== 'all' || activeSemester !== 'all') && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight">
                  {activeSemester !== 'all' 
                    ? SE_SEMESTERS.find(s => s.code === activeSemester)?.label
                    : activeYear
                  }
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {activeSemester !== 'all' ? SE_SEMESTERS.find(s => s.code === activeSemester)?.title : `All Units for ${activeYear}`} &bull; {filteredUnits.length} Prescribed Units
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-bold text-xs">
                {activeSemester !== 'all' ? `Semester ${activeSemester}` : activeYear}
              </span>
            </div>
          )}

          {/* Grid of Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.code}
                className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs uppercase shadow-sm">
                        {unit.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10px]">
                        Sem {unit.semesterCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                        {unit.year}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {unit.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {unit.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  {/* Core Topics */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {unit.coreTopics.map((topic, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectUnit(unit);
                      onClose();
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Filter in Vault</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenUnitPaper(unit.code);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>View Exam Paper</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
