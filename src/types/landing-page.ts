export interface LandingPageData {
  id?: string;
  courseId: string;
  templateType: 'modelo1' | 'modelo2' | 'modelo3';
  headline: string;
  subheadline: string;
  description: string;
  benefits: string[];
  testimonials: Testimonial[];
  ctaText: string;
  pricingText: string;
  bonusContent: string;
  aboutMentor: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface TemplateOption {
  id: 'modelo1' | 'modelo2' | 'modelo3';
  name: string;
  description: string;
  preview: string; // URL da imagem de preview
  isActive: boolean;
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