// Interfaces para as seções da Landing Page

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  course_duration: string;
  students_count: string;
  rating: string;
  content_hours: string;
  background_image?: string;
  video_url?: string;
}

export interface AboutCourseSection {
  title: string;
  description: string;
  objectives: string[];
  target_audience: string[];
  prerequisites: string;
  certificate: boolean;
  methodology: string;
}

export interface AboutMentorSection {
  title: string;
  mentor_name: string;
  description: string;
  bio: string;
  credentials: string[];
  achievements: string[];
  photo_url?: string;
  social_links: {
    linkedin?: string;
    instagram?: string;
  };
  experience_years: number;
}

export interface ResultsSection {
  title: string;
  subtitle: string;
  statistics: Array<{
    metric: string;
    value: string;
    description: string;
  }>;
  case_studies: Array<{
    student_name: string;
    before: string;
    after: string;
    time: string;
  }>;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating: number;
    company?: string;
    result?: string;
  }>;
}

export interface CurriculumSection {
  title: string;
  subtitle: string;
  total_modules: number;
  total_lessons: number;
  total_hours: string;
  modules: Array<{
    module_number: number;
    title: string;
    description: string;
    duration: string;
    lessons: string[];
  }>;
}

export interface BonusSection {
  title: string;
  subtitle: string;
  total_bonus_value: string;
  bonus_items: Array<{
    title: string;
    description: string;
    value: string;
    format: string;
    image_url?: string;
  }>;
}

export interface PricingSection {
  title: string;
  subtitle: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  currency: string;
  payment_options: Array<{
    type: 'pix' | 'card';
    price: number;
    discount_text: string;
    installments: number;
    price_per_installment?: number;
  }>;
  guarantee: {
    days: number;
    description: string;
  };
  comparison: {
    course_value: string;
    bonus_value: string;
    total_value: string;
    you_pay: string;
  };
}

export interface FAQSection {
  title: string;
  subtitle: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FinalCTASection {
  title: string;
  subtitle: string;
  urgency_message: string;
  final_message: string;
  cta_text: string;
  secondary_cta: string;
  timer_enabled: boolean;
  timer_deadline: string;
  scarcity: {
    enabled: boolean;
    remaining_spots: number;
    message: string;
  };
  risk_reversal: string;
  contact_info: {
    whatsapp?: string;
    email?: string;
  };
}

// Interface principal da Landing Page com os novos campos
export interface LandingPageData {
  id?: string;
  courseId: string;
  templateType: 'modelo1' | 'modelo2' | 'modelo3';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // As 10 seções
  sec_hero: HeroSection;
  sec_about_course: AboutCourseSection;
  sec_about_mentor: AboutMentorSection;
  sec_results: ResultsSection;
  sec_testimonials: TestimonialsSection;
  sec_curriculum: CurriculumSection;
  sec_bonus: BonusSection;
  sec_pricing: PricingSection;
  sec_faq: FAQSection;
  sec_final_cta: FinalCTASection;
}

// Interface para dados da landing page com informações do curso
export interface LandingPageDataWithCourse extends LandingPageData {
  course?: {
    title: string;
    description: string;
    price: number;
    image_url: string;
    mentor_id: string;
  };
}

// Interface para formulários de edição por seção
export interface LandingPageSectionFormData {
  sectionType: 'sec_hero' | 'sec_about_course' | 'sec_about_mentor' | 'sec_results' | 
                'sec_testimonials' | 'sec_curriculum' | 'sec_bonus' | 'sec_pricing' | 
                'sec_faq' | 'sec_final_cta';
  data: HeroSection | AboutCourseSection | AboutMentorSection | ResultsSection | 
        TestimonialsSection | CurriculumSection | BonusSection | PricingSection | 
        FAQSection | FinalCTASection;
}

// Interface para template options
export interface TemplateOption {
  id: 'modelo1' | 'modelo2' | 'modelo3';
  name: string;
  description: string;
  preview: string;
  isActive: boolean;
}

// Tipos para compatibilidade com código existente (deprecated)
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface LandingPageFormData {
  headline: string;
  subheadline: string;
  description: string;
  benefits: string[];
  testimonials: Testimonial[];
  ctaText: string;
  pricingText: string;
  bonusContent: string;
  aboutMentor: string;
} 