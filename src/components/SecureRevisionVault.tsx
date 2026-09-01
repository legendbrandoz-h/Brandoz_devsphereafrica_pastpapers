import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, BookOpen, Sparkles, Filter, Clock, 
  GraduationCap, Building, ChevronRight, FileText, CheckCircle2, 
  AlertCircle, Lock, ExternalLink, Zap, SlidersHorizontal, Eye,
  UploadCloud, UserCheck, Code2, Layers, ShieldCheck, Server, Trash2,
  ListFilter, Check, BookMarked, HelpCircle, Lightbulb
} from 'lucide-react';
import { PastPaper, UserProfile, ExamQuestion } from '../types';
import { SAMPLE_PAST_PAPERS } from '../data/pastPapers';
import { ThemeToggle } from './ThemeToggle';
import { AFRICAN_UNIVERSITIES } from '../data/universities';
import { SECurriculumModal } from './SECurriculumModal';
import { SE_SEMESTERS, SOFTWARE_ENGINEERING_UNITS, SEUnit } from '../data/softwareEngineeringCurriculum';

interface SecureRevisionVaultProps {
  currentUser: UserProfile;
  initialQuery?: string;
  customPapers?: PastPaper[];
  onOpenPaper: (paper: PastPaper) => void;
  onOpenAI: (paper?: PastPaper, question?: ExamQuestion) => void;
  onOpenUpload?: (unitInfo?: {
    courseCode?: string;
    unitTitle?: string;
    department?: string;
    year?: string;
    semester?: string;
  }) => void;
  onOpenArchitecture?: () => void;
  onDeletePaper?: (paperId: string) => void;
}

export const SecureRevisionVault: React.FC<SecureRevisionVaultProps> = ({
  currentUser,
  initialQuery = '',
  customPapers = [],
  onOpenPaper,
  onOpenAI,
  onOpenUpload,
  onOpenArchitecture,
  onDeletePaper
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [viewMode, setViewMode] = useState<'units' | 'papers'>('units');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedUniversity, setSelectedUniversity] = useState<string>(currentUser.school_name || 'All Universities');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'uploads' | 'recommended'>('all');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [hideSamplePapers, setHideSamplePapers] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('devsphere_hide_samples') === 'true';
    }
    return false;
  });

  const toggleHideSamplePapers = () => {
    setHideSamplePapers(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('devsphere_hide_samples', String(next));
      }
      return next;
    });
  };

  // Combine sample repository with user uploaded papers (or filter samples out if user hid them)
  const allAvailablePapers = useMemo(() => {
    if (hideSamplePapers) {
      return customPapers;
    }
    const combined = [...customPapers, ...SAMPLE_PAST_PAPERS.filter(sp => !customPapers.some(cp => cp.paper_id === sp.paper_id))];
    return combined;
  }, [customPapers, hideSamplePapers]);

  // Filter Units by Year, Semester, Category and Search Query
  const filteredUnits = useMemo(() => {
    let units = [...SOFTWARE_ENGINEERING_UNITS];

    if (selectedYear !== 'All Years') {
      units = units.filter(u => u.year === selectedYear);
    }

    if (selectedSemester !== 'All') {
      units = units.filter(u => u.semesterCode === selectedSemester);
    }

    if (selectedCategory !== 'All') {
      units = units.filter(u => u.category === selectedCategory);
    }

    if (!searchQuery || !searchQuery.trim()) {
      return units;
    }

    const clean = searchQuery.toLowerCase().trim();
    const tokens = clean.split(/[\s,._-]+/).filter(t => t.length > 0);

    return units.filter(u => {
      const codeClean = u.code.toLowerCase().replace(/\s+/g, '');
      const corpus = `${u.code} ${codeClean} ${u.title} ${u.year} ${u.semester} ${u.semesterCode} ${u.category} ${u.description} ${u.coreTopics.join(' ')}`.toLowerCase();
      return tokens.every(tok => corpus.includes(tok)) || corpus.includes(clean);
    });
  }, [searchQuery, selectedYear, selectedSemester, selectedCategory]);

  // Fast search with token matching for papers
  const filteredPapers = useMemo(() => {
    let papers = [...allAvailablePapers];

    if (activeTab === 'uploads') {
      papers = papers.filter(p => p.isUserUploaded);
    }

    if (selectedUniversity && selectedUniversity.trim() && selectedUniversity !== 'All Universities') {
      const uFilter = selectedUniversity.toLowerCase().trim();
      papers = papers.filter(p => 
        p.university_name.toLowerCase().includes(uFilter) ||
        p.university_acronym.toLowerCase() === uFilter
      );
    }

    if (selectedYear && selectedYear.trim() && selectedYear !== 'All Years') {
      papers = papers.filter(p => p.year_of_study === selectedYear || p.course_code.includes(selectedYear));
    }

    if (selectedSemester && selectedSemester !== 'All') {
      const sCode = selectedSemester.toLowerCase().trim();
      papers = papers.filter(p => 
        p.search_tags.some(tag => tag.toLowerCase() === sCode) ||
        p.course_code.toLowerCase().includes(sCode)
      );
    }

    if (selectedDifficulty !== 'All') {
      papers = papers.filter(p => p.difficulty === selectedDifficulty);
    }

    if (!searchQuery || !searchQuery.trim()) {
      return papers;
    }

    const cleanQuery = searchQuery.toLowerCase().trim();
    const tokens = cleanQuery.split(/[\s,._-]+/).filter(t => t.length > 0);

    return papers.filter(paper => {
      const searchableCorpus = [
        paper.course_code.toLowerCase(),
        paper.unit_title.toLowerCase(),
        paper.university_name.toLowerCase(),
        paper.university_acronym.toLowerCase(),
        paper.year_of_study.toLowerCase(),
        paper.faculty_department.toLowerCase(),
        paper.exam_year.toString(),
        ...paper.search_tags.map(t => t.toLowerCase())
      ].join(' ');

      const matchedTokensCount = tokens.filter(token => searchableCorpus.includes(token)).length;
      const matchRatio = matchedTokensCount / tokens.length;
      return matchRatio >= 0.5 || searchableCorpus.includes(cleanQuery);
    });
  }, [allAvailablePapers, searchQuery, selectedUniversity, selectedYear, selectedSemester, selectedDifficulty, activeTab]);

  return (
    <div id="phase-4-secure-revision-vault" className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-24">
      
      {/* Student Academic Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-semibold tracking-wide text-blue-100">
              <BookMarked className="w-4 h-4 text-blue-200" />
              <span>University Past Paper Archive &bull; {currentUser.school_name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Past Papers & Course Units
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl font-normal leading-relaxed">
              Explore all <span className="font-semibold text-white underline decoration-blue-300">51+ Software Engineering curriculum units</span> and verified past exam papers. Designed to help students revise effectively with step-by-step AI guidance.
            </p>
          </div>

          {/* Top Quick Actions Block */}
          <div 
            id="vault-persistent-utilities-block"
            className="flex items-center flex-wrap gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl self-start md:self-center"
          >
            {/* Syllabus Matrix Modal */}
            <button
              id="vault-curriculum-directory-btn"
              onClick={() => setShowCurriculumModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 transition-all"
            >
              <Code2 className="w-4 h-4 text-indigo-200" />
              <span>Curriculum Matrix</span>
            </button>

            {/* Upload Exam Paper Action */}
            {onOpenUpload && (
              <button
                id="vault-upload-trigger-btn"
                onClick={() => onOpenUpload()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-slate-950" />
                <span>Upload Paper</span>
              </button>
            )}

            {/* Architecture Action - Admin Only */}
            {isAdmin && onOpenArchitecture && (
              <button
                id="vault-architecture-btn"
                onClick={onOpenArchitecture}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Architecture</span>
              </button>
            )}

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle id="vault-theme-toggle" variant="floating" className="!p-2.5" />

            {/* AI Assistant Button */}
            <button
              id="vault-ai-copilot-btn"
              onClick={() => onOpenAI(filteredPapers[0] || null)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Study Copilot</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Search & Filter Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
          
          {/* Top Row: View Switcher & Campus Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="vault-view-units-tab"
                onClick={() => setViewMode('units')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'units'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>All Academic Units ({SOFTWARE_ENGINEERING_UNITS.length})</span>
              </button>

              <button
                id="vault-view-papers-tab"
                onClick={() => setViewMode('papers')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'papers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Exam Papers Archive ({allAvailablePapers.length})</span>
              </button>
            </div>

            {/* University Selection Dropdown & Demo Papers Toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={toggleHideSamplePapers}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  hideSamplePapers 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle visibility of sample/mock exam papers"
              >
                {hideSamplePapers ? (
                  <>
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>Show Sample Papers</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-slate-400" />
                    <span>Hide Sample Papers</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm">Campus:</span>
                <select
                  id="vault-university-filter"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="All Universities">All Universities</option>
                  {AFRICAN_UNIVERSITIES.map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.acronym})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Full-Width Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 dark:text-blue-400" />
            <input
              id="vault-main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by unit code or topic (e.g., "BSD 111", "Operating Systems", "Calculus", "Data Structures", "2.1")...'
              className="w-full pl-14 pr-16 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 text-base sm:text-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Academic Year Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5 pr-1">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Year:</span>
            </span>

            <button
              onClick={() => { setSelectedYear('All Years'); setSelectedSemester('All'); }}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedYear === 'All Years' && selectedSemester === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All 4 Years ({SOFTWARE_ENGINEERING_UNITS.length} Units)
            </button>

            {(['Year 1', 'Year 2', 'Year 3', 'Year 4'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setSelectedYear(yr);
                  setSelectedSemester('All');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedYear === yr && selectedSemester === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {yr} ({SOFTWARE_ENGINEERING_UNITS.filter(u => u.year === yr).length} Units)
              </button>
            ))}
          </div>

          {/* Semester Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5 pr-1">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Semester:</span>
            </span>

            <button
              onClick={() => setSelectedSemester('All')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedSemester === 'All'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Semesters
            </button>

            {SE_SEMESTERS.map(sem => (
              <button
                key={sem.code}
                onClick={() => {
                  setSelectedSemester(sem.code);
                  setSelectedYear('All Years');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-semibold font-mono text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedSemester === sem.code
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                Sem {sem.code}
              </button>
            ))}
          </div>

          {/* Quick preset topics bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs sm:text-sm pt-1">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Quick Topics:
            </span>

            {['Structured Programming', 'Database Systems', 'Data Structures', 'Operating Systems', 'Cloud Computing', 'Computer Networks'].map((preset) => (
              <button
                key={preset}
                onClick={() => setSearchQuery(preset)}
                className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

        </div>

        {/* Results Metadata & View Status */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {viewMode === 'units' 
                ? `Showing ${filteredUnits.length} of ${SOFTWARE_ENGINEERING_UNITS.length} Units`
                : `${filteredPapers.length} Verified Exam Papers Available`
              }
            </span>
            <span>&bull;</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {selectedYear !== 'All Years' ? selectedYear : ''} {selectedSemester !== 'All' ? `Semester ${selectedSemester}` : (selectedYear === 'All Years' ? 'All Years & Semesters' : '')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Updated with Zetech University Curriculum</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: UNITS MATRIX (All 51+ Software Engineering Units)                 */}
        {/* ========================================================================= */}
        {viewMode === 'units' && (
          <div>
            {filteredUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnits.map((unit) => {
                  const paperMatch = allAvailablePapers.find(p => 
                    p.course_code.toUpperCase().replace(/\s+/g, '') === unit.code.toUpperCase().replace(/\s+/g, '')
                  );

                  return (
                    <div
                      key={unit.code}
                      id={`unit-card-${unit.code.replace(/\s+/g, '-').toLowerCase()}`}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                    >
                      {/* Unit Card Header & Details */}
                      <div className="p-6 space-y-4">
                        
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm shadow-sm">
                              {unit.code}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono font-semibold text-xs">
                              Sem {unit.semesterCode}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                              {unit.year}
                            </span>
                          </div>

                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {unit.category}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight leading-snug">
                            {unit.title}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
                            {unit.description}
                          </p>
                        </div>

                        {/* Core Topics Covered */}
                        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Core Revision Topics:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {unit.coreTopics.map((topic, idx) => (
                              <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Paper Availability Status */}
                        <div className="pt-2">
                          {paperMatch ? (
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-sm">
                              <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Verified Past Paper Available</span>
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                                Exam {paperMatch.exam_year}
                              </span>
                            </div>
                          ) : (
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span>Curriculum Unit &bull; Ready for Upload</span>
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Card Action Footer with clear buttons */}
                      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        
                        {paperMatch ? (
                          <div className="flex items-center justify-between gap-3">
                            <button
                              onClick={() => onOpenAI(paperMatch)}
                              className="py-2.5 px-3.5 rounded-xl text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>AI Study Help</span>
                            </button>

                            <button
                              onClick={() => onOpenPaper(paperMatch)}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Read Paper</span>
                            </button>
                          </div>
                        ) : null}

                        {onOpenUpload && (
                          <button
                            onClick={() => onOpenUpload({
                              courseCode: unit.code,
                              unitTitle: unit.title,
                              year: unit.year,
                              semester: unit.semester,
                              department: 'School of Computing & Informatics'
                            })}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              paperMatch 
                                ? 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300' 
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02]'
                            }`}
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>{paperMatch ? `Upload Another Paper for ${unit.code}` : `Upload Past Paper for ${unit.code}`}</span>
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  No units found matching "{searchQuery}" in {selectedYear} / Semester {selectedSemester}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedYear('All Years');
                    setSelectedSemester('All');
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Show All {SOFTWARE_ENGINEERING_UNITS.length} Units
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: EXAM PAPERS ARCHIVE                                              */}
        {/* ========================================================================= */}
        {viewMode === 'papers' && (
          <div>
            {filteredPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.paper_id}
                    id={`paper-card-${paper.paper_id}`}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                  >
                    {/* Paper Card Header */}
                    <div className="p-6 space-y-4">
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm shadow-sm">
                            {paper.course_code}
                          </span>
                          {paper.search_tags.find(t => /^([1-4]\.[1-2])$/.test(t)) && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono font-semibold text-xs">
                              Sem {paper.search_tags.find(t => /^([1-4]\.[1-2])$/.test(t))}
                            </span>
                          )}
                          {paper.isUserUploaded && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Student Upload</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          EXAM {paper.exam_year}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                          {paper.unit_title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2 font-medium">
                          <Building className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{paper.university_name}</span>
                        </p>
                      </div>

                      {/* Exam Specs details */}
                      <div className="grid grid-cols-2 gap-3 pt-3 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{paper.duration_hours}h Duration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>{paper.total_marks} Marks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-500" />
                          <span>{paper.year_of_study}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>{paper.questions.length} Sections</span>
                        </div>
                      </div>

                      {/* Tags Preview */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {paper.search_tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Card Action Footer */}
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAI(paper)}
                          title="Open AI Study Assistant for this paper"
                          className="py-2 px-3.5 rounded-xl text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>AI Help</span>
                        </button>

                        {(isAdmin || currentUser?.school_email === 'legendbrandoz@gmail.com' || currentUser?.email === 'legendbrandoz@gmail.com') && onDeletePaper && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete paper "${paper.course_code}: ${paper.unit_title}" from vault?`)) {
                                onDeletePaper(paper.paper_id);
                              }
                            }}
                            title="Delete this paper (Admin only)"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <button
                        id={`open-paper-btn-${paper.paper_id}`}
                        onClick={() => onOpenPaper(paper)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Paper</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    No matching past papers found
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We couldn't find any papers matching <span className="font-mono font-bold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedUniversity('All Universities');
                      setSelectedYear('All Years');
                      setSelectedSemester('All');
                      setActiveTab('all');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Reset Filters
                  </button>

                  {onOpenUpload && (
                    <button
                      id="vault-empty-state-upload-btn"
                      onClick={() => onOpenUpload()}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload This Paper Now</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Interactive Software Engineering Curriculum Modal */}
      <SECurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        onSelectUnit={(unit) => {
          setSelectedSemester(unit.semesterCode);
          setSearchQuery(unit.code);
          setViewMode('units');
        }}
        onOpenUnitPaper={(courseCode) => {
          const match = allAvailablePapers.find(p => p.course_code.toUpperCase().includes(courseCode.toUpperCase()));
          if (match) {
            onOpenPaper(match);
          } else {
            setSearchQuery(courseCode);
            setViewMode('units');
          }
        }}
      />

    </div>
  );
};
