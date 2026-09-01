import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Trash2, 
  UploadCloud, 
  CheckCircle2, 
  Mail, 
  GraduationCap, 
  RefreshCw, 
  Search, 
  Database,
  Lock,
  X,
  BookOpen,
  Sparkles,
  Layers,
  FileText,
  Plus,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { UserProfile, TeamMemberRecord, PastPaper } from '../types';
import { 
  getTeamMembersFromFirestore, 
  saveTeamMemberToFirestore, 
  deleteTeamMemberFromFirestore,
  getAllUsersFromFirestore,
  PersistentUserRecord
} from '../lib/userStorageService';
import { SOFTWARE_ENGINEERING_UNITS, SE_SEMESTERS, SEUnit } from '../data/softwareEngineeringCurriculum';

interface AdminTeamPanelProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadModal: (unitInfo?: {
    courseCode?: string;
    unitTitle?: string;
    department?: string;
    university?: string;
    yearOfStudy?: string;
    semester?: string;
  }) => void;
  customPapers?: PastPaper[];
  onOpenPaper?: (paper: PastPaper) => void;
}

export const AdminTeamPanel: React.FC<AdminTeamPanelProps> = ({
  currentUser,
  isOpen,
  onClose,
  onOpenUploadModal,
  customPapers = [],
  onOpenPaper
}) => {
  const [activeTab, setActiveTab] = useState<'units' | 'team' | 'clients' | 'emails'>('units');
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [clients, setClients] = useState<PersistentUserRecord[]>([]);
  const [loginAlerts, setLoginAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Unit & Course Search State
  const [unitSearchQuery, setUnitSearchQuery] = useState<string>('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  
  const userEmail = (currentUser?.school_email || '').toLowerCase().trim();
  const isAdmin = currentUser?.role === 'admin' && (userEmail === 'legendbrandoz@gmail.com');
  
  // Add member form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'moderator' | 'uploader'>('moderator');
  const [newUniversity, setNewUniversity] = useState('Zetech University');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      // 1. Fetch team members from Firestore
      const firestoreMembers = await getTeamMembersFromFirestore();
      setTeamMembers(firestoreMembers);

      // 2. Fetch clients from Firestore & server fallback
      const firestoreClients = await getAllUsersFromFirestore();
      if (firestoreClients.length > 0) {
        setClients(firestoreClients);
      } else {
        try {
          const res = await fetch('/api/admin/clients');
          const data = await res.json();
          if (data.clients) {
            setClients(data.clients);
          }
        } catch (e) {
          console.warn('Server clients fetch fallback:', e);
        }
      }

      // 3. Fetch login alerts
      try {
        const emailRes = await fetch('/api/auth/login-notifications');
        const emailData = await emailRes.json();
        if (emailData.notifications) {
          setLoginAlerts(emailData.notifications);
        }
      } catch (e) {
        console.warn('Email notification fetch notice:', e);
      }

    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Unit Search & Related Units Calculation Engine
  const { matchingUnits, relatedUnits, hasQuery } = useMemo(() => {
    const rawQ = unitSearchQuery.toLowerCase().trim();
    if (!rawQ) {
      // Filter by year/semester/category if active
      let filtered = SOFTWARE_ENGINEERING_UNITS;
      if (selectedYearFilter !== 'all') {
        filtered = filtered.filter(u => u.year === selectedYearFilter);
      }
      if (selectedSemesterFilter !== 'all') {
        filtered = filtered.filter(u => u.semesterCode === selectedSemesterFilter);
      }
      if (selectedCategoryFilter !== 'all') {
        filtered = filtered.filter(u => u.category === selectedCategoryFilter);
      }
      return { matchingUnits: filtered, relatedUnits: [], hasQuery: false };
    }

    const qTokens = rawQ.split(/[\s,_\-]+/).filter(t => t.length > 0);

    const matches: SEUnit[] = [];
    const related: SEUnit[] = [];

    // Identify department or prefix keywords
    const isComputing = ['code', 'prog', 'dev', 'soft', 'algo', 'bsd', 'cit', 'bcs', 'bcu', 'it'].some(k => rawQ.includes(k));
    const isMath = ['mat', 'math', 'calc', 'discrete', 'stat', 'algebra'].some(k => rawQ.includes(k));
    const isNetwork = ['net', 'cloud', 'bns', 'telecom', 'distrib', 'cyber', 'sec'].some(k => rawQ.includes(k));
    const isDatabase = ['data', 'sql', 'db', 'base', 'struct', 'wareh'].some(k => rawQ.includes(k));

    SOFTWARE_ENGINEERING_UNITS.forEach(unit => {
      const codeClean = unit.code.toLowerCase().replace(/\s+/g, '');
      const titleClean = unit.title.toLowerCase();
      const descClean = unit.description.toLowerCase();
      const topicsClean = unit.coreTopics.join(' ').toLowerCase();
      const semClean = unit.semesterCode.toLowerCase();
      const yearClean = unit.year.toLowerCase();
      const combinedCorpus = `${codeClean} ${unit.code.toLowerCase()} ${titleClean} ${descClean} ${topicsClean} ${semClean} ${yearClean}`;

      const isDirectMatch = qTokens.some(tok => combinedCorpus.includes(tok));

      if (isDirectMatch) {
        matches.push(unit);
      } else {
        // Check for related domain synergy
        const unitIsMath = unit.category === 'Mathematics & Theory' || unit.code.startsWith('MAT');
        const unitIsProg = unit.category === 'Development & Programming' || unit.code.startsWith('BSD');
        const unitIsSys = unit.category === 'Systems & Hardware' || unit.category === 'Core Engineering';
        
        if (
          (isMath && unitIsMath) ||
          (isComputing && unitIsProg) ||
          (isNetwork && (unitIsSys || unit.coreTopics.some(t => t.toLowerCase().includes('network') || t.toLowerCase().includes('cloud')))) ||
          (isDatabase && (unit.title.toLowerCase().includes('data') || unit.coreTopics.some(t => t.toLowerCase().includes('data') || t.toLowerCase().includes('database'))))
        ) {
          related.push(unit);
        }
      }
    });

    return { matchingUnits: matches, relatedUnits: related.slice(0, 8), hasQuery: true };
  }, [unitSearchQuery, selectedYearFilter, selectedSemesterFilter, selectedCategoryFilter]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setStatusMessage({ text: 'Please enter a valid email address.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const cleanEmail = newEmail.trim().toLowerCase();
    const newMember: TeamMemberRecord = {
      member_id: `team_${Math.random().toString(36).substring(2, 9)}`,
      email: cleanEmail,
      full_name: newName.trim() || cleanEmail.split('@')[0],
      role: newRole,
      added_by: currentUser.full_name || currentUser.school_email || 'Lead Administrator',
      added_at: new Date().toISOString(),
      can_upload: true,
      university: newUniversity.trim() || 'Zetech University'
    };

    try {
      await saveTeamMemberToFirestore(newMember);

      try {
        await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember)
        });
      } catch (err) {
        console.warn('Server sync notice:', err);
      }

      setTeamMembers(prev => [newMember, ...prev.filter(m => m.email !== cleanEmail)]);
      setNewEmail('');
      setNewName('');
      setStatusMessage({ 
        text: `Success! ${cleanEmail} has been granted upload permissions and added to the admin team.` 
      });
    } catch (err: any) {
      setStatusMessage({ text: err?.message || 'Failed to add team member.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (email: string) => {
    if (email.toLowerCase().includes('legendbrandoz@gmail.com')) {
      alert('Cannot remove the primary Lead Administrator.');
      return;
    }

    if (!confirm(`Are you sure you want to revoke upload access for ${email}?`)) {
      return;
    }

    try {
      await deleteTeamMemberFromFirestore(email);
      try {
        await fetch(`/api/admin/team/${encodeURIComponent(email)}`, { method: 'DELETE' });
      } catch (e) {}

      setTeamMembers(prev => prev.filter(m => m.email.toLowerCase() !== email.toLowerCase()));
      setStatusMessage({ text: `Revoked access for ${email}.` });
    } catch (err: any) {
      setStatusMessage({ text: 'Failed to revoke member permissions.', isError: true });
    }
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Admin Access Restricted</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The Admin Server is strictly reserved for the Lead Administrator (<strong>legendbrandoz@gmail.com</strong>).
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 cursor-pointer"
          >
            Return to Vault
          </button>
        </div>
      </div>
    );
  }

  const filteredClients = clients.filter(c => {
    const q = clientSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.school_email?.toLowerCase().includes(q) ||
      c.full_name?.toLowerCase().includes(q) ||
      c.school_name?.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Admin Server & Unit Repository</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-400/30">
                  Lead Administrator
                </span>
              </div>
              <p className="text-xs text-blue-200 font-medium mt-0.5">
                Search university units, explore related courses, and upload exam questions directly for each unit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'units'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Search Units & Upload ({SOFTWARE_ENGINEERING_UNITS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Uploaders ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'clients'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Registered Clients ({clients.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('emails');
              fetch('/api/auth/login-notifications')
                .then(r => r.json())
                .then(d => { if (d.notifications) setLoginAlerts(d.notifications); })
                .catch(() => {});
            }}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'emails'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-500" />
            <span>Sent Login Emails ({loginAlerts.length})</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center justify-between ${
            statusMessage.isError 
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs underline cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* Tab 1: SEARCH UNITS & UPLOAD PAPERS */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'units' && (
            <div className="space-y-6">
              
              {/* Unit Search & Filters Header */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span>Search & Explore Academic Units</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Search any unit code (e.g. <strong>BSD 111</strong>, <strong>BCU 112</strong>, <strong>MAT 111</strong>) or keyword. Upload buttons appear on every unit card.
                    </p>
                  </div>

                  {/* General Upload Button */}
                  <button
                    onClick={() => onOpenUploadModal()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer self-start md:self-auto"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-200" />
                    <span>Upload Custom Paper</span>
                  </button>
                </div>

                {/* Search Bar Input */}
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={unitSearchQuery}
                    onChange={(e) => setUnitSearchQuery(e.target.value)}
                    placeholder="Search by unit code (e.g., BSD 111, MAT, BCU), title, topic (algorithms, database, network), or semester..."
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  {unitSearchQuery && (
                    <button
                      onClick={() => setUnitSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Year, Semester & Category Pills */}
                <div className="space-y-2.5 pt-1">
                  {/* Year Selection Row */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> Year:
                    </span>

                    <button
                      onClick={() => { setSelectedYearFilter('all'); setSelectedSemesterFilter('all'); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedYearFilter === 'all' && selectedSemesterFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      All 4 Years ({SOFTWARE_ENGINEERING_UNITS.length} Units)
                    </button>

                    {(['Year 1', 'Year 2', 'Year 3', 'Year 4'] as const).map(yr => (
                      <button
                        key={yr}
                        onClick={() => {
                          setSelectedYearFilter(selectedYearFilter === yr ? 'all' : yr);
                          setSelectedSemesterFilter('all');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedYearFilter === yr
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>

                  {/* Semester Selection Row */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" /> Sem:
                    </span>

                    <button
                      onClick={() => setSelectedSemesterFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSemesterFilter === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      All Semesters
                    </button>

                    {SE_SEMESTERS.map(sem => (
                      <button
                        key={sem.code}
                        onClick={() => {
                          setSelectedSemesterFilter(selectedSemesterFilter === sem.code ? 'all' : sem.code);
                          setSelectedYearFilter('all');
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedSemesterFilter === sem.code
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Sem {sem.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Search Banner if Custom Code Entered */}
              {hasQuery && matchingUnits.length === 0 && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Custom Unit Search: "{unitSearchQuery.toUpperCase()}"</span>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      This unit code isn't in the default curriculum index. You can immediately upload past papers and questions for this new unit.
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenUploadModal({
                      courseCode: unitSearchQuery.toUpperCase().trim(),
                      unitTitle: `${unitSearchQuery.toUpperCase().trim()} Exam Paper`,
                      department: 'School of Computing & Informatics',
                      university: 'Zetech University'
                    })}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Exam for "{unitSearchQuery.toUpperCase()}"</span>
                  </button>
                </div>
              )}

              {/* DIRECT MATCHING UNITS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>
                      {hasQuery ? `Matching Units for "${unitSearchQuery}"` : 'Academic Curriculum Units'} ({matchingUnits.length})
                    </span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    Showing active syllabus units with instant upload controls
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingUnits.map(unit => {
                    const uploadedForThisUnit = customPapers.filter(
                      p => p.course_code.toLowerCase().replace(/\s+/g, '') === unit.code.toLowerCase().replace(/\s+/g, '')
                    );

                    return (
                      <div
                        key={unit.code}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        {/* Top: Badges & Header */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shadow-sm">
                                {unit.code}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800">
                                Sem {unit.semesterCode} &bull; {unit.year}
                              </span>
                            </div>

                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase">
                              {unit.category}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                              {unit.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {unit.description}
                            </p>
                          </div>

                          {/* Core Topics Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {unit.coreTopics.slice(0, 4).map((topic, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-medium border border-slate-200/60 dark:border-slate-800"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>

                          {/* Vault Status */}
                          <div className="pt-2 flex items-center justify-between text-xs">
                            {uploadedForThisUnit.length > 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{uploadedForThisUnit.length} Paper(s) in Vault</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Ready for custom paper upload</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BOTTOM ACTION BUTTON: Upload Exam Paper for this Unit */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80">
                          <button
                            onClick={() => onOpenUploadModal({
                              courseCode: unit.code,
                              unitTitle: unit.title,
                              department: 'School of Computing & Informatics',
                              university: 'Zetech University',
                              yearOfStudy: unit.year,
                              semester: unit.semester
                            })}
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md"
                          >
                            <UploadCloud className="w-4 h-4 text-blue-200" />
                            <span>Upload Paper for {unit.code}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RELATED UNITS SECTION (Appears when searching) */}
              {hasQuery && relatedUnits.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Related Academic Units & Prerequisites ({relatedUnits.length})</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      Curriculum-aligned sister units in the same academic domain
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedUnits.map(unit => (
                      <div
                        key={unit.code}
                        className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs">
                                {unit.code}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                                Sem {unit.semesterCode}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Related Subject</span>
                          </div>

                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {unit.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {unit.description}
                          </p>
                        </div>

                        {/* BOTTOM ACTION BUTTON: Upload Exam Paper for this Related Unit */}
                        <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/60">
                          <button
                            onClick={() => onOpenUploadModal({
                              courseCode: unit.code,
                              unitTitle: unit.title,
                              department: 'School of Computing & Informatics',
                              university: 'Zetech University',
                              yearOfStudy: unit.year,
                              semester: unit.semester
                            })}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4 text-indigo-200" />
                            <span>Upload Paper for {unit.code}</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 2: TEAM MEMBERS & UPLOADERS */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Add New Team Member Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Authorize Team Member / Uploader</span>
                  </div>
                  <button
                    onClick={() => onOpenUploadModal()}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Open Upload Tool</span>
                  </button>
                </div>

                <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Member Email (Any Email)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="colleague@gmail.com / school"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Full Name / Nickname
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Alex Kamau"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Assigned Role
                    </label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="moderator">Moderator (Can Upload)</option>
                      <option value="uploader">Paper Uploader</option>
                      <option value="admin">Co-Administrator</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>Add to Team</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Authorized Team Members ({teamMembers.length})
                  </h3>
                  <button
                    onClick={loadData}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamMembers.map(member => {
                    const isLead = member.email.toLowerCase().includes('legendbrandoz@gmail.com');
                    return (
                      <div 
                        key={member.member_id || member.email}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {member.full_name || member.email}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              member.role === 'admin'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {member.role}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{member.email}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorized to Upload & Publish Papers</span>
                          </div>
                        </div>

                        {!isLead && (
                          <button
                            onClick={() => handleRemoveMember(member.email)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Revoke Permissions"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: REGISTERED CLIENTS & EMAILS */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search clients by email, name..."
                    value={clientSearchQuery}
                    onChange={e => setClientSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold">
                    Total Registered: <span className="text-blue-600 dark:text-blue-400 font-black">{clients.length}</span>
                  </span>
                  <button
                    onClick={loadData}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">User & Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">University / Institution</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No registered clients found matching "{clientSearchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map((client, idx) => (
                          <tr key={client.user_id || client.school_email || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3">
                              <div className="font-bold text-slate-900 dark:text-white">
                                {client.full_name || 'Client Scholar'}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                {client.school_email}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                client.role === 'admin'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                  : client.role === 'team_member'
                                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {client.role || 'student'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">
                              {client.school_name || 'Zetech University'}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {client.joined_at ? new Date(client.joined_at).toLocaleDateString() : 'Active'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: SENT LOGIN EMAILS */}
          {activeTab === 'emails' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Automated Login Email Dispatch Logs
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct security notifications generated and sent to user email addresses upon every successful login.
                  </p>
                </div>
                <button
                  onClick={() => {
                    fetch('/api/auth/login-notifications')
                      .then(r => r.json())
                      .then(d => { if (d.notifications) setLoginAlerts(d.notifications); })
                      .catch(() => {});
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Email Logs</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Recipient Email & Name</th>
                        <th className="p-3">Subject & Content Snippet</th>
                        <th className="p-3">Dispatch Time</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {loginAlerts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">
                            No login email events recorded in current session. Every user login will automatically dispatch an email notice and register here.
                          </td>
                        </tr>
                      ) : (
                        loginAlerts.map((alert, idx) => (
                          <tr key={alert.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3">
                              <div className="font-bold text-slate-900 dark:text-white">
                                {alert.userName}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                {alert.email}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {alert.subject}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 text-[11px] max-w-md truncate">
                                {alert.bodySnippet}
                              </div>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {alert.loginTime}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{alert.status || 'DELIVERED'}</span>
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Connected Database: <strong className="text-slate-700 dark:text-slate-300 font-mono">Cloud Firestore (ai-studio-devsphereafricap)</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer transition-colors"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
