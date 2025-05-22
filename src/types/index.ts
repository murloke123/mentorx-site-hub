
export interface User {
  id: string;
  name: string;
  email: string;
  role: "mentor" | "mentee" | "admin";
  bio?: string;
  profileImage?: string;
  areas?: string[];
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  mentor_id: string;
  mentor_name?: string;
  is_public: boolean;
  is_paid: boolean;
  price?: number | null;
  image_url?: string | null;
  is_published?: boolean;
  enrollments?: { count: number }[];
  created_at?: string;
  updated_at?: string;
}

export interface Material {
  id: string;
  title: string;
  type: "video" | "pdf" | "text";
  url?: string;
  content?: string;
}

export interface ScheduleSlot {
  id: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  isBooked: boolean;
  sessionId?: string;
}

export interface Session {
  id: string;
  slotId: string;
  mentorId: string;
  menteeId: string;
  comment?: string;
  status: "pending" | "approved" | "rejected" | "completed";
}
