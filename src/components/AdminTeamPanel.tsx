import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Trash2, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Building2, 
  GraduationCap, 
  RefreshCw, 
  Search, 
  Database,
  Lock,
  X
} from 'lucide-react';
import { UserProfile, TeamMemberRecord } from '../types';
import { 
  getTeamMembersFromFirestore, 
  saveTeamMemberToFirestore, 
  deleteTeamMemberFromFirestore,
  getAllUsersFromFirestore,
  PersistentUserRecord
} from '../lib/userStorageService';

interface AdminTeamPanelProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadModal: () => void;
}

export const AdminTeamPanel: React.FC<AdminTeamPanelProps> = ({
  currentUser,
  isOpen,
  onClose,
  onOpenUploadModal
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'clients'>('team');
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [clients, setClients] = useState<PersistentUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Add member form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'moderator' | 'uploader'>('moderator');
  const [newUniversity, setNewUniversity] = useState('University of Nairobi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      // 1. Fetch team members from server or Firestore
      const firestoreMembers = await getTeamMembersFromFirestore();
      setTeamMembers(firestoreMembers);

      // 2. Fetch clients from Firestore & server
      const firestoreClients = await getAllUsersFromFirestore();
      if (firestoreClients.length > 0) {
        setClients(firestoreClients);
      } else {
        // Fallback to server API
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
      university: newUniversity.trim() || 'University Faculty'
    };

    try {
      // Save to Cloud Firestore persistent database
      await saveTeamMemberToFirestore(newMember);

      // Also call server endpoint
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
    if (email.toLowerCase().includes('branol123')) {
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

  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.school_email?.toLowerCase().includes(q) ||
      c.full_name?.toLowerCase().includes(q) ||
      c.school_name?.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Admin & Team Control Panel</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-400/30">
                  Administrator
                </span>
              </div>
              <p className="text-xs text-blue-200 font-medium mt-0.5">
                Manage team upload permissions, moderators, and view persistent client registrations in Firestore.
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
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'team'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admin Team & Uploaders ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'clients'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Registered Clients & Emails ({clients.length})</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center justify-between ${
            statusMessage.isError 
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs underline cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'team' ? (
            <div className="space-y-6">
              {/* Add New Team Member Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Authorize Team Member / Uploader</span>
                  </div>
                  <button
                    onClick={onOpenUploadModal}
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
                    const isLead = member.email.toLowerCase().includes('branol123');
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
          ) : (
            <div className="space-y-4">
              {/* Clients Header with Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search clients by email, name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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

              {/* Clients Table */}
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
                            No registered clients found matching "{searchQuery}".
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
                              {client.school_name || 'University of Nairobi'}
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
