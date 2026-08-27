import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, TeamMemberRecord } from '../types';

export interface PersistentUserRecord {
  user_id: string;
  full_name?: string;
  school_email: string;
  password_hash?: string;
  school_name: string;
  year_of_study: string;
  unit_papers_required: string;
  email_verified: boolean;
  role: 'student' | 'admin' | 'team_member';
  can_upload?: boolean;
  plan: 'free_trial' | 'monthly' | 'semester';
  joined_at: string;
  last_login_at?: string;
  auth_provider?: string;
  team_title?: string;
}

const USERS_COLLECTION = 'devsphere_users';
const TEAM_COLLECTION = 'devsphere_team_members';
const AUDIT_LOGS_COLLECTION = 'devsphere_login_audit';

/**
 * Normalizes email or username to a safe Firestore document ID
 */
export function sanitizeDocId(identifier: string): string {
  return identifier.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '_');
}

/**
 * Persists a new or existing user account directly into Cloud Firestore
 */
export async function saveUserToFirestore(userData: PersistentUserRecord): Promise<boolean> {
  try {
    const docId = sanitizeDocId(userData.school_email);
    const userDocRef = doc(db, USERS_COLLECTION, docId);

    const payload = {
      ...userData,
      updated_at: serverTimestamp()
    };

    await setDoc(userDocRef, payload, { merge: true });

    // Also record login audit log
    try {
      const auditRef = doc(collection(db, AUDIT_LOGS_COLLECTION));
      await setDoc(auditRef, {
        user_id: userData.user_id,
        school_email: userData.school_email,
        full_name: userData.full_name || 'Client',
        role: userData.role,
        school_name: userData.school_name,
        timestamp: serverTimestamp(),
        device_ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
      });
    } catch (auditErr) {
      console.warn('Audit log write skipped:', auditErr);
    }

    return true;
  } catch (error) {
    console.error('Failed to persist user in Firestore:', error);
    return false;
  }
}

/**
 * Fetches a user record by email or username from Cloud Firestore
 */
export async function getUserFromFirestore(identifier: string): Promise<PersistentUserRecord | null> {
  try {
    const docId = sanitizeDocId(identifier);
    const userDocRef = doc(db, USERS_COLLECTION, docId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as PersistentUserRecord;
    }

    // Query collection for email or username matches
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    let foundUser: PersistentUserRecord | null = null;
    querySnapshot.forEach(d => {
      const u = d.data() as PersistentUserRecord;
      if (
        u.school_email?.toLowerCase() === identifier.toLowerCase().trim() ||
        u.user_id?.toLowerCase() === identifier.toLowerCase().trim()
      ) {
        foundUser = u;
      }
    });

    return foundUser;
  } catch (error) {
    console.error('Failed to query user from Firestore:', error);
    return null;
  }
}

/**
 * Retrieves all registered users and clients from Cloud Firestore
 */
export async function getAllUsersFromFirestore(): Promise<PersistentUserRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users: PersistentUserRecord[] = [];
    querySnapshot.forEach(docSnap => {
      users.push(docSnap.data() as PersistentUserRecord);
    });
    return users;
  } catch (error) {
    console.error('Failed to retrieve all users from Firestore:', error);
    return [];
  }
}

/**
 * Returns total count of all registered users saved in Firestore
 */
export async function getTotalRegisteredUsersCount(): Promise<number> {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.size;
  } catch (error) {
    console.warn('Error counting firestore users:', error);
    return 0;
  }
}

/**
 * Save an Admin Team member to Cloud Firestore
 */
export async function saveTeamMemberToFirestore(member: TeamMemberRecord): Promise<boolean> {
  try {
    const docId = sanitizeDocId(member.email);
    const memberRef = doc(db, TEAM_COLLECTION, docId);
    await setDoc(memberRef, {
      ...member,
      updated_at: serverTimestamp()
    }, { merge: true });

    // Also ensure user profile has team_member role and can_upload = true
    const userDocId = sanitizeDocId(member.email);
    const userRef = doc(db, USERS_COLLECTION, userDocId);
    await setDoc(userRef, {
      school_email: member.email,
      full_name: member.full_name,
      role: member.role === 'admin' ? 'admin' : 'team_member',
      can_upload: member.can_upload,
      team_title: member.role === 'admin' ? 'Co-Administrator' : 'Paper Moderator & Uploader',
      updated_at: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Failed to save team member to Firestore:', error);
    return false;
  }
}

/**
 * Get all authorized Admin Team members from Cloud Firestore
 */
export async function getTeamMembersFromFirestore(): Promise<TeamMemberRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, TEAM_COLLECTION));
    const members: TeamMemberRecord[] = [];
    querySnapshot.forEach(docSnap => {
      members.push(docSnap.data() as TeamMemberRecord);
    });

    // If empty, return default lead admin and core team
    if (members.length === 0) {
      return [
        {
          member_id: 'team_branol_lead',
          email: 'branol123@devsphere.africa',
          full_name: 'Branol (Lead Admin)',
          role: 'admin',
          added_by: 'System Origin',
          added_at: '2026-01-01T00:00:00.000Z',
          can_upload: true,
          university: 'DevSphere Central Administration'
        },
        {
          member_id: 'team_mod_1',
          email: 'admin@devsphere.africa',
          full_name: 'Exam Operations Admin',
          role: 'admin',
          added_by: 'Branol (Lead Admin)',
          added_at: '2026-01-10T00:00:00.000Z',
          can_upload: true,
          university: 'University of Nairobi'
        }
      ];
    }

    return members;
  } catch (error) {
    console.error('Failed to get team members from Firestore:', error);
    return [
      {
        member_id: 'team_branol_lead',
        email: 'branol123@devsphere.africa',
        full_name: 'Branol (Lead Admin)',
        role: 'admin',
        added_by: 'System Origin',
        added_at: '2026-01-01T00:00:00.000Z',
        can_upload: true,
        university: 'DevSphere Central Administration'
      }
    ];
  }
}

/**
 * Remove an Admin Team member from Cloud Firestore
 */
export async function deleteTeamMemberFromFirestore(email: string): Promise<boolean> {
  try {
    const docId = sanitizeDocId(email);
    await deleteDoc(doc(db, TEAM_COLLECTION, docId));
    return true;
  } catch (error) {
    console.error('Failed to delete team member from Firestore:', error);
    return false;
  }
}

/**
 * Check if a given email/user is authorized to upload past papers
 */
export async function checkUserCanUpload(emailOrUsername: string, userRole?: string): Promise<boolean> {
  if (!emailOrUsername) return false;
  const clean = emailOrUsername.toLowerCase().trim();

  // Lead admin is always authorized
  if (clean === 'branol123' || clean === 'branol' || clean.includes('branol') || userRole === 'admin') {
    return true;
  }

  try {
    const docId = sanitizeDocId(clean);
    const memberDoc = await getDoc(doc(db, TEAM_COLLECTION, docId));
    if (memberDoc.exists() && memberDoc.data()?.can_upload === true) {
      return true;
    }
  } catch (e) {
    console.warn('Error checking team permissions:', e);
  }

  return false;
}
