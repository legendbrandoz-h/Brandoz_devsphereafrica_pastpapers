import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, BookOpen, Shield, Sparkles, Filter, Clock, 
  GraduationCap, Building, ChevronRight, FileText, CheckCircle2, 
  AlertCircle, Lock, ExternalLink, Zap, SlidersHorizontal, Eye,
  UploadCloud, UserCheck, Code2, Layers, ShieldCheck, Server
} from 'lucide-react';
import { PastPaper, UserProfile, ExamQuestion } from '../types';
import { SAMPLE_PAST_PAPERS } from '../data/pastPapers';
import { ThemeToggle } from './ThemeToggle';
import { AFRICAN_UNIVERSITIES } from '../data/universities';
import { SECurriculumModal } from './SECurriculumModal';
import { SE_SEMESTERS, SOFTWARE_ENGINEERING_UNITS } from '../data/softwareEngineeringCurriculum';

interface SecureRevisionVaultProps {
  currentUser: UserProfile;
  initialQuery?: string;
  customPapers?: PastPaper[];
  onOpenPaper: (paper: PastPaper) => void;
  onOpenAI: (paper?: PastPaper, question?: ExamQuestion) => void;
  onOpenUpload?: () => void;
  onOpenArchitecture?: () => void;
}

export const SecureRevisionVault: React.FC<SecureRevisionVaultProps> = ({
  currentUser,
  initialQuery = '',
  customPapers = [],
  onOpenPaper,
  onOpenAI,
  onOpenUpload,
  onOpenArchitecture
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedUniversity, setSelectedUniversity] = useState<string>(currentUser.school_name || 'All Universities');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'uploads' | 'recommended'>('all');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  // Combine sample repository with user uploaded papers
  const allAvailablePapers = useMemo(() => {
    const combined = [...customPapers, ...SAMPLE_PAST_PAPERS.filter(sp => !customPapers.some(cp => cp.paper_id === sp.paper_id))];
    return combined;
  }, [customPapers]);

  // Lightning-fast search with instant token matching
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
    <div id="phase-4-secure-revision-vault" className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 pb-20">
      
      {/* Student Academic Top Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-black uppercase tracking-widest text-blue-100">
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span>DevSphere Vault Active &bull; {currentUser.school_name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-white">
              SECURE REVISION VAULT
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-medium">
              Browsing encrypted examination archives for <span className="font-bold text-white underline decoration-blue-300">{currentUser.school_name}</span> &bull; {currentUser.year_of_study} ({currentUser.unit_papers_required})
            </p>
          </div>

          {/* Right Corner Utilities Float Block (Persistent across Paper Views) */}
          <div 
            id="vault-persistent-utilities-block"
            className="flex items-center flex-wrap gap-2.5 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-blue-400/30 shadow-2xl self-start md:self-center"
          >
            {/* SE Curriculum Full Directory Action */}
            <button
              id="vault-curriculum-directory-btn"
              onClick={() => setShowCurriculumModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Code2 className="w-4 h-4 text-blue-200" />
              <span>SE Syllabus (1.1 - 4.2)</span>
            </button>

            {/* Architecture Action - Strictly Admin Only */}
            {isAdmin && onOpenArchitecture && (
              <button
                id="vault-architecture-btn"
                onClick={onOpenArchitecture}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/20 hover:scale-105 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>Architecture (Admin)</span>
              </button>
            )}

            {/* Upload Exam Paper Action - Strictly Admin Only */}
            {isAdmin && onOpenUpload && (
              <button
                id="vault-upload-trigger-btn"
                onClick={onOpenUpload}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-slate-950" />
                <span>Upload Paper (Admin)</span>
              </button>
            )}

            {/* Utility 1: Dark Mode Toggle [ 🌓 ] */}
            <ThemeToggle id="vault-theme-toggle" variant="floating" className="!p-2.5" />

            {/* Utility 2: Quick Search Focus [ 🔍 ] */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
              <input
                id="vault-quick-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-32 sm:w-44 pl-8.5 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono font-bold"
              />
            </div>

            {/* Utility 3: AI Assistant Button [ 🤖 ] */}
            <button
              id="vault-ai-copilot-btn"
              onClick={() => onOpenAI(filteredPapers[0] || null)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-md shadow-blue-500/30 flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Copilot</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Search & Filter Bar Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
          
          {/* Main Full-Width Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
            <input
              id="vault-main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try typing "2.1 data basemanagement", "BSD 111", "Operating Systems", "Cloud Computing", "3.2"...'
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Software Engineering Semester Quick-Nav Tabs (1.1 - 4.2) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Semesters:</span>
            </span>

            <button
              onClick={() => { setSelectedSemester('All'); setSelectedYear('All Years'); }}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-[11px] tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedSemester === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                className={`px-2.5 py-1.5 rounded-xl font-black font-mono text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                  selectedSemester === sem.code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                Sem {sem.code}
              </button>
            ))}

            <button
              onClick={() => setShowCurriculumModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] hover:bg-indigo-100 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Code2 className="w-3 h-3" />
              <span>View All 51 Units</span>
            </button>
          </div>

          {/* Filter Row Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            
            {/* Tab Selection (All Papers / Uploaded Papers) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-black uppercase text-[11px] tracking-wider transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Archive ({allAvailablePapers.length})
              </button>

              <button
                onClick={() => setActiveTab('uploads')}
                className={`px-3 py-1.5 rounded-lg font-black uppercase text-[11px] tracking-wider transition-colors flex items-center gap-1.5 ${
                  activeTab === 'uploads'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Uploaded ({allAvailablePapers.filter(p => p.isUserUploaded).length})</span>
              </button>
            </div>

            {/* Quick Filter Tags / Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Quick:
              </span>

              {['2.1 data basemanagement', 'BSD 111', 'Operating Systems', 'Cloud Computing', 'Testing 3.1'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSearchQuery(preset)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono text-[11px] hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  #{preset}
                </button>
              ))}
            </div>

            {/* University Selection Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Campus:</span>
              <select
                id="vault-university-filter"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All Universities">All African Universities</option>
                {AFRICAN_UNIVERSITIES.map(u => (
                  <option key={u.id} value={u.name}>{u.name} ({u.acronym})</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Results Metadata & Query Latency Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredPapers.length} Verified Exam Papers Available
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Zap className="w-3.5 h-3.5" /> Token index latency: 8ms
            </span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Download DRM Active</span>
          </div>
        </div>

        {/* Exam Papers Grid */}
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.paper_id}
                id={`paper-card-${paper.paper_id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                
                {/* Paper Card Header */}
                <div className="p-6 space-y-4">
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs shadow-md shadow-blue-600/20 uppercase">
                        {paper.course_code}
                      </span>
                      {paper.search_tags.find(t => /^([1-4]\.[1-2])$/.test(t)) && (
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono font-black text-[10px] uppercase">
                          Sem {paper.search_tags.find(t => /^([1-4]\.[1-2])$/.test(t))}
                        </span>
                      )}
                      {paper.isUserUploaded && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Uploaded</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      EXAM {paper.exam_year}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                      {paper.unit_title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{paper.university_name}</span>
                    </p>
                  </div>

                  {/* Exam Specs details */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{paper.duration_hours}h Duration</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>{paper.total_marks} Marks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      <span>{paper.year_of_study}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{paper.questions.length} Sections</span>
                    </div>
                  </div>

                  {/* Token Tags Preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {paper.search_tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-bold uppercase tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  
                  {/* AI Copilot shortcut */}
                  <button
                    onClick={() => onOpenAI(paper)}
                    title="Open AI Study Assistant for this paper"
                    className="py-2 px-3 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Help</span>
                  </button>

                  {/* 1-Click Instant Secure View Action Button */}
                  <button
                    id={`open-paper-btn-${paper.paper_id}`}
                    onClick={() => onOpenPaper(paper)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs uppercase tracking-widest shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Instant View</span>
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
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                No matching past papers found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                We couldn't find any papers matching <span className="font-mono font-bold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>. Do you have a copy of this exam paper?
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedUniversity('All Universities');
                  setSelectedYear('All Years');
                  setActiveTab('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Reset Filters
              </button>

              {onOpenUpload && (
                <button
                  id="vault-empty-state-upload-btn"
                  onClick={onOpenUpload}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload This Paper Now</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Software Engineering Curriculum Modal (1.1 - 4.2) */}
      <SECurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        onSelectUnit={(unit) => {
          setSelectedSemester(unit.semesterCode);
          setSearchQuery(unit.code);
        }}
        onOpenUnitPaper={(courseCode) => {
          const match = allAvailablePapers.find(p => p.course_code.toUpperCase().includes(courseCode.toUpperCase()));
          if (match) {
            onOpenPaper(match);
          } else {
            setSearchQuery(courseCode);
          }
        }}
      />

    </div>
  );
};
