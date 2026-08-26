import React, { useState, useRef, useEffect } from 'react';
import { 
  X, UploadCloud, FileText, CheckCircle2, AlertCircle, 
  Sparkles, Shield, Building, Plus, Trash2, ArrowRight, 
  Check, FileUp, Cpu, HelpCircle, ChevronDown, Lock, ShieldAlert, KeyRound
} from 'lucide-react';
import { PastPaper, UserProfile, ExamQuestion } from '../types';
import { AFRICAN_UNIVERSITIES, searchUniversities } from '../data/universities';

interface UploadPaperModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUploadSuccess: (newPaper: PastPaper) => void;
  onSwitchToAdminLogin?: () => void;
}

export const UploadPaperModal: React.FC<UploadPaperModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUploadSuccess,
  onSwitchToAdminLogin
}) => {
  const isAdmin = currentUser?.role === 'admin';

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContentSample, setFileContentSample] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessPaper, setUploadSuccessPaper] = useState<PastPaper | null>(null);

  // Form Fields
  const [courseCode, setCourseCode] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [universityName, setUniversityName] = useState(currentUser?.school_name || 'University of Nairobi');
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState('Semester 1');
  const [yearOfStudy, setYearOfStudy] = useState(currentUser?.year_of_study || 'Year 2');
  const [facultyDept, setFacultyDept] = useState('School of Computing & Informatics');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [totalMarks, setTotalMarks] = useState<number>(70);
  const [difficulty, setDifficulty] = useState<'Foundation' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [customTags, setCustomTags] = useState<string>('');

  // Questions Builder
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'q1',
      section: 'SECTION A (COMPULSORY - 30 MARKS)',
      questionNumber: 1,
      title: 'Theoretical Foundations & Practical Architectures',
      scenario: 'Analyze the core domain requirements and design specifications.',
      marks: 30,
      parts: [
        {
          label: '(a)',
          prompt: 'Explain the fundamental concepts and theoretical foundations with real-world examples.',
          marks: 10,
          markingGuide: 'Award marks for clear definitions and conceptual clarity.'
        },
        {
          label: '(b)',
          prompt: 'Discuss the design tradeoffs, methodology, and performance invariants.',
          marks: 20,
          markingGuide: 'Award marks for structured technical arguments.'
        }
      ],
      solutionHints: ['Focus on syllabus foundational principles and standard terminology.'],
      keyTopics: ['Core Theory', 'Design Principles']
    }
  ]);

  // University Dropdown autocomplete
  const [univSearchQuery, setUnivSearchQuery] = useState(currentUser?.school_name || 'University of Nairobi');
  const [showUnivDropdown, setShowUnivDropdown] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState(AFRICAN_UNIVERSITIES.slice(0, 6));

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser?.school_name) {
      setUniversityName(currentUser.school_name);
      setUnivSearchQuery(currentUser.school_name);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result as string) || '';
      setFileContentSample(text);

      const name = file.name.replace(/\.[^/.]+$/, '');
      const codeMatch = name.match(/([A-Z]{2,4}\s*\d{1,4}(\.\d)?)/i);
      if (codeMatch && !courseCode) {
        setCourseCode(codeMatch[1].toUpperCase());
      }
      
      const yearMatch = name.match(/\b(201\d|202\d)\b/);
      if (yearMatch) {
        setExamYear(parseInt(yearMatch[1], 10));
      }

      if (text.length > 50) {
        triggerAIDocumentParsing(text, file.name);
      }
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerAIDocumentParsing = async (textToParse: string, fileName: string) => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/papers/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent: textToParse, fileName })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.extracted) {
          const ext = data.extracted;
          if (ext.course_code) setCourseCode(ext.course_code);
          if (ext.unit_title) setUnitTitle(ext.unit_title);
          if (ext.university_name) {
            setUniversityName(ext.university_name);
            setUnivSearchQuery(ext.university_name);
          }
          if (ext.exam_year) setExamYear(ext.exam_year);
          if (ext.semester) setSemester(ext.semester);
          if (ext.year_of_study) setYearOfStudy(ext.year_of_study);
          if (ext.duration_hours) setDurationHours(ext.duration_hours);
          if (ext.total_marks) setTotalMarks(ext.total_marks);
          if (Array.isArray(ext.questions) && ext.questions.length > 0) {
            setQuestions(ext.questions);
          }
        }
      }
    } catch (err) {
      console.warn('Auto parsing request error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const newQ: ExamQuestion = {
      id: `q${nextNum}`,
      section: `SECTION B (QUESTION ${nextNum} - 20 MARKS)`,
      questionNumber: nextNum,
      title: `Question ${nextNum}: Specialized Technical Application`,
      scenario: 'Examine specific operational constraints and implementation strategies.',
      marks: 20,
      parts: [
        {
          label: '(a)',
          prompt: 'Detail the operational methodology and key performance characteristics.',
          marks: 10,
          markingGuide: 'Award marks for completeness and technical precision.'
        },
        {
          label: '(b)',
          prompt: 'Formulate an optimization plan or evaluate critical system vulnerabilities.',
          marks: 10,
          markingGuide: 'Award marks for analytical depth.'
        }
      ],
      solutionHints: ['Consult standard reference literature and syllabus objectives.'],
      keyTopics: [unitTitle || 'Core Domain', courseCode || 'Unit Analysis']
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
  };

  const handleQuestionChange = (index: number, field: keyof ExamQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!isAdmin) {
      setUploadError('Unauthorized: Only Admin accounts are authorized to upload papers.');
      return;
    }

    if (!courseCode.trim()) {
      setUploadError('Please specify the Course Code (e.g. CS 2.1, BIT 2204, LAW 101).');
      return;
    }
    if (!unitTitle.trim()) {
      setUploadError('Please provide the Unit/Subject Title (e.g. Data Base Management).');
      return;
    }
    if (!universityName.trim()) {
      setUploadError('Please select or specify the African University.');
      return;
    }

    try {
      setIsSubmitting(true);

      const parsedTags = customTags
        .split(/[,#\s]+/)
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        university_name: universityName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        unit_title: unitTitle.trim(),
        exam_year: Number(examYear) || new Date().getFullYear(),
        semester: semester,
        year_of_study: yearOfStudy,
        faculty_department: facultyDept,
        duration_hours: Number(durationHours) || 3,
        total_marks: Number(totalMarks) || 70,
        difficulty: difficulty,
        questions: questions,
        search_tags: parsedTags,
        fileName: selectedFile?.name || `${courseCode}_Exam_Paper_${examYear}.pdf`,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '1.20 MB',
        uploadedBy: currentUser?.school_email || 'DevSphere Administrator',
        userRole: 'admin'
      };

      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': 'admin'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload paper');
      }

      const data = await res.json();
      setUploadSuccessPaper(data.paper);
      onUploadSuccess(data.paper);
    } catch (err: any) {
      setUploadError(err.message || 'An unexpected error occurred during paper processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="upload-paper-modal" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                  UPLOAD PAST EXAMINATION PAPER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Authorized administrator repository ingestion with zero-download DRM encryption
              </p>
            </div>
          </div>

          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* Admin Role Check Guard */}
          {!isAdmin ? (
            <div className="text-center py-12 px-4 max-w-lg mx-auto space-y-6 animate-in fade-in">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 rounded-3xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 ring-8 ring-amber-50 dark:ring-amber-950/30">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Administrator Privileges Required
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Only verified <strong>Platform Administrators</strong> and <strong>Faculty Coordinators</strong> can upload and publish examination papers to the DevSphere repository to preserve strict academic provenance and integrity.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Current Account:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{currentUser?.school_email || 'Guest / Student'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Account Role:</span>
                  <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                    {currentUser?.role || 'student'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                  💡 <em>Admin Login Credentials:</em> <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-blue-600 dark:text-blue-300 font-bold">Branol123</code> (Password: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-blue-600 dark:text-blue-300 font-bold">Branol@006</code>)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {onSwitchToAdminLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToAdminLogin();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Log In as Admin</span>
                  </button>
                )}
              </div>
            </div>
          ) : uploadSuccessPaper ? (
            /* Success Notification View */
            <div className="text-center py-10 space-y-6 max-w-lg mx-auto animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>DRM Encrypted & Vault Published by Admin</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white tracking-tight uppercase">
                  {uploadSuccessPaper.course_code} Added to Vault!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {uploadSuccessPaper.unit_title} ({uploadSuccessPaper.university_name}) is now live in the repository and available for AI Tutoring.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase">Unit Code:</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400">{uploadSuccessPaper.course_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase">Institution:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{uploadSuccessPaper.university_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase">Exam Year:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{uploadSuccessPaper.exam_year} ({uploadSuccessPaper.semester})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400 uppercase">Questions:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{uploadSuccessPaper.questions.length} Sections ({uploadSuccessPaper.total_marks} Marks)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  id="success-done-btn"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-105"
                >
                  Return to Vault
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmitUpload} className="space-y-6">
              
              {/* Admin Banner */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800/80 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Logged in as <strong>Admin: {currentUser?.school_email}</strong></span>
                </div>
                <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                  Verified Publisher
                </span>
              </div>

              {/* Error Banner */}
              {uploadError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drag and Drop + Click Zone */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  1. Exam Paper Document (PDF, DOCX, TXT, or Scan)
                </label>
                
                <div
                  id="upload-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer group ${
                    dragOver
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 scale-[0.99]'
                      : selectedFile
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-850/50'
                  }`}
                >
                  <input
                    id="file-input-field"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                            {selectedFile.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Click to select a different file or drag and drop to replace.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileUp className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                          <span className="text-blue-600 dark:text-blue-400 underline underline-offset-4">Click to browse file</span> or drag & drop past paper here
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Supports PDF, DOCX, TXT, scanned PNG/JPG past exam sheets up to 25MB
                        </p>
                      </div>
                    </>
                  )}

                  {isAnalyzing && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini AI Auto-Analyzing Document Structure...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Course & Unit Details */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Academic Course & Subject Metadata
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Course Code * (e.g. CS 2.1, BIT 2204)
                    </label>
                    <input
                      id="course-code-input"
                      type="text"
                      required
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. CS 2.1"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Unit / Subject Title *
                    </label>
                    <input
                      id="unit-title-input"
                      type="text"
                      required
                      value={unitTitle}
                      onChange={(e) => setUnitTitle(e.target.value)}
                      placeholder="e.g. Data Base Management"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* University Selection with searchable autocomplete */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    African University / Institution *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="university-search-input"
                      type="text"
                      required
                      value={univSearchQuery}
                      onChange={(e) => {
                        setUnivSearchQuery(e.target.value);
                        setUniversityName(e.target.value);
                        setFilteredUniversities(searchUniversities(e.target.value));
                        setShowUnivDropdown(true);
                      }}
                      onFocus={() => setShowUnivDropdown(true)}
                      placeholder="Search or select African University..."
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {showUnivDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1">
                      {filteredUniversities.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setUniversityName(u.name);
                            setUnivSearchQuery(u.name);
                            setShowUnivDropdown(false);
                          }}
                          className="p-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                            <span className="text-slate-400 ml-1.5">({u.country})</span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                            {u.acronym}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Exam Specifics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Exam Year
                    </label>
                    <select
                      value={examYear}
                      onChange={(e) => setExamYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Trimester 3">Trimester 3</option>
                      <option value="Special / Supplementary">Special Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Search Tags & Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={customTags}
                    onChange={(e) => setCustomTags(e.target.value)}
                    placeholder="e.g. sql, normalization, concurrency, algorithms, bcnf"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Questions Section Builder */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      3. Exam Questions & Marking Rubric ({questions.length} Sections)
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Structured exam questions power the Gemini AI step-by-step solver.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div 
                      key={q.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-mono font-black text-[11px]">
                            Q{q.questionNumber || idx + 1}
                          </span>
                          <input
                            type="text"
                            value={q.section}
                            onChange={(e) => handleQuestionChange(idx, 'section', e.target.value)}
                            placeholder="e.g. SECTION A (COMPULSORY - 30 MARKS)"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Question Prompt / Title
                        </label>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => handleQuestionChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Relational Normalization & ACID Properties"
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        {q.parts.map((p, pIdx) => (
                          <div key={pIdx} className="flex gap-2 items-start pl-2 border-l-2 border-blue-500">
                            <span className="font-bold text-blue-600 dark:text-blue-400">{p.label}</span>
                            <span className="flex-1 line-clamp-2">{p.prompt}</span>
                            <span className="font-mono text-slate-400 font-bold">[{p.marks}m]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit & Security Assurance Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Encrypted Zero-Download DRM automatically applied upon admin upload.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    id="submit-upload-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Encrypting & Ingesting...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Publish Paper to Vault (Admin)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
