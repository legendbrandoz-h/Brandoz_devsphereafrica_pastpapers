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
  const [activeSemester, setActiveSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredUnits = SOFTWARE_ENGINEERING_UNITS.filter(unit => {
    const matchesSemester = activeSemester === 'all' || unit.semesterCode === activeSemester;
    if (!matchesSemester) return false;

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
              Explore all {SOFTWARE_ENGINEERING_UNITS.length} curriculum units across all 8 semesters (Year 1 Sem 1 to Year 4 Sem 2, with 7 units per semester). Click any unit to filter or open its past examination paper.
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
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Semester Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-xs">
            <button
              onClick={() => setActiveSemester('all')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeSemester === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All ({SOFTWARE_ENGINEERING_UNITS.length} Units)
            </button>

            {SE_SEMESTERS.map(sem => (
              <button
                key={sem.code}
                onClick={() => setActiveSemester(sem.code)}
                className={`px-3 py-1.5 rounded-xl font-black font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeSemester === sem.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {sem.code}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, title, topic..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Units Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Semester Summary Banner */}
          {activeSemester !== 'all' && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight">
                  {SE_SEMESTERS.find(s => s.code === activeSemester)?.label}
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {SE_SEMESTERS.find(s => s.code === activeSemester)?.title} &bull; {filteredUnits.length} Prescribed Units
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-bold text-xs">
                Semester {activeSemester}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.code}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shadow-sm">
                      {unit.code}
                    </span>
                    <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      Sem {unit.semesterCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
                      {unit.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {unit.description}
                    </p>
                  </div>

                  {/* Core Topics Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {unit.coreTopics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100/60 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium font-mono"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectUnit(unit);
                      onClose();
                    }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Filter className="w-3 h-3" />
                    <span>Filter Vault</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenUnitPaper(unit.code);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm shadow-blue-500/20 hover:scale-105 transition-all"
                  >
                    <span>Open Exam</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUnits.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No Software Engineering units matched your search.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">
            Showing {filteredUnits.length} of {SOFTWARE_ENGINEERING_UNITS.length} Software Engineering Units ({SE_SEMESTERS.length} Semesters, 7 Units each)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer hover:bg-slate-300 transition-colors"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
