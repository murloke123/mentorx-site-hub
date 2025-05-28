export interface CourseFormData {
  name: string;
  description: string;
  category: string;
  image: string;
  type: "free" | "paid";
  price: number;
  currency: string;
  discount: number;
  visibility: "public" | "private";
  isPublished: boolean;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  mentor_id: string;
  is_public: boolean;
  is_paid: boolean;
  price?: number | null;
  discount?: number | null;
  discounted_price?: number | null;
  image_url?: string | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  mentor_name?: string;
  mentor_avatar?: string | null;
  category?: string | null;
  category_id?: string | null;
  category_info?: {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
  } | null;
  enrollments?: { count: number }[];
}
