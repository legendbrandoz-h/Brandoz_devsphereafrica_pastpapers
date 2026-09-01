export type AppPhase = 'splash' | 'landing' | 'auth' | 'vault';

export interface University {
  id: string;
  name: string;
  country: string;
  acronym: string;
  verified: boolean;
  city: string;
}

export interface UserProfile {
  user_id: string;
  school_email: string;
  email?: string;
  token?: string;
  school_name: string;
  year_of_study: string;
  unit_papers_required: string;
  email_verified: boolean;
  role: 'admin' | 'student' | 'team_member';
  can_upload?: boolean;
  plan: 'free_trial' | 'monthly' | 'semester';
  joined_at: string;
  full_name?: string;
  team_title?: string;
}

export interface TeamMemberRecord {
  member_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'moderator' | 'uploader';
  added_by: string;
  added_at: string;
  can_upload: boolean;
  university?: string;
}

export interface QuestionPart {
  label: string;
  prompt: string;
  marks: number;
  markingGuide?: string;
}

export interface ExamQuestion {
  id: string;
  section: string;
  questionNumber: number;
  title: string;
  scenario?: string;
  marks: number;
  parts: QuestionPart[];
  solutionHints?: string[];
  keyTopics: string[];
}

export interface PastPaper {
  paper_id: string;
  university_name: string;
  university_acronym: string;
  course_code: string;
  unit_title: string;
  exam_year: number;
  semester: string;
  year_of_study: string;
  faculty_department: string;
  duration_hours: number;
  total_marks: number;
  secure_storage_url: string;
  search_tags: string[];
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  questions: ExamQuestion[];
  isUserUploaded?: boolean;
  uploadedAt?: string;
  uploadedBy?: string;
  fileName?: string;
  fileSize?: string;
}

export interface AIStudyMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  questionRef?: string;
}
