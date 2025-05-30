export interface Mentor {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  highlight_message: string | null;
  phone?: string | null;
  sm_tit1?: string | null;
  sm_desc1?: string | null;
  sm_tit2?: string | null;
  sm_desc2?: string | null;
  sm_tit3?: string | null;
  sm_desc3?: string | null;
  category?: string | null;
  category_id?: string | null;
  courses_count?: number;
  followers_count?: number;
}
