
import { Course, Material, User, ScheduleSlot, Session } from "@/types";

// Mock mentors
export const mockMentors: User[] = [
  {
    id: "mentor1",
    name: "Ana Silva",
    email: "mentor1@teste.com",
    role: "mentor",
    bio: "Especialista em marketing digital com mais de 10 anos de experiência em grandes empresas.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    areas: ["Marketing Digital", "Branding", "Mídias Sociais"],
  },
  {
    id: "mentor2",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    role: "mentor",
    bio: "Gerente de Projetos certificado PMP com background em tecnologia e transformação digital.",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
    areas: ["Gestão de Projetos", "Agile", "Transformação Digital"],
  },
  {
    id: "mentor3",
    name: "Juliana Costa",
    email: "juliana@example.com",
    role: "mentor",
    bio: "Consultora financeira especializada em investimentos e planejamento para pessoas físicas e startups.",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
    areas: ["Finanças", "Investimentos", "Planejamento Financeiro"],
  },
  {
    id: "mentor4",
    name: "Pedro Almeida",
    email: "pedro@example.com",
    role: "mentor",
    bio: "Desenvolvedor sênior e arquiteto de software com vasta experiência em projetos inovadores.",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    areas: ["Desenvolvimento Web", "Arquitetura de Software", "DevOps"],
  },
];

// Mock courses materials
const marketingMaterials: Material[] = [
  {
    id: "mat1",
    title: "Introdução ao Marketing Digital",
    type: "pdf",
    url: "/placeholder.svg",
  },
  {
    id: "mat2",
    title: "Estratégias de SEO",
    type: "video",
    url: "/placeholder.svg",
  },
  {
    id: "mat3", 
    title: "Análise de Métricas",
    type: "text",
    content: "As métricas mais importantes para acompanhar em suas campanhas de marketing digital são..."
  }
];

const transformationMaterials: Material[] = [
  {
    id: "mat4",
    title: "Transformação em 5 Etapas - Módulo 1",
    type: "pdf",
    url: "/placeholder.svg",
  },
  {
    id: "mat5",
    title: "Transformação em 5 Etapas - Módulo 2",
    type: "video",
    url: "/placeholder.svg",
  },
  {
    id: "mat6",
    title: "Transformação em 5 Etapas - Módulo 3",
    type: "text",
    content: "Neste módulo, vamos aplicar as técnicas aprendidas em situações reais..."
  }
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "course1",
    title: "Marketing Digital para Iniciantes",
    description: "Aprenda os fundamentos do marketing digital e como aplicá-los em seu negócio.",
    mentorId: "mentor1",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
    materials: marketingMaterials,
    public: true,
  },
  {
    id: "course2",
    title: "Gestão de Projetos com Metodologias Ágeis",
    description: "Domine técnicas de gestão de projetos usando Scrum, Kanban e outras metodologias ágeis.",
    mentorId: "mentor2",
    price: 197,
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&auto=format&fit=crop",
    materials: [],
    public: true,
  },
  {
    id: "course3",
    title: "Finanças Pessoais e Investimentos",
    description: "Organize suas finanças e comece a investir com estratégia e conhecimento.",
    mentorId: "mentor3",
    price: 149.90,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop",
    materials: [],
    public: true,
  },
  {
    id: "course4",
    title: "Transformação em 5 Etapas",
    description: "Um curso completo para transformar sua carreira e alcançar seus objetivos profissionais.",
    mentorId: "mentor2",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1589994965851-a7f32ec1f7b1?q=80&w=400&auto=format&fit=crop",
    materials: transformationMaterials,
    public: true,
  },
  {
    id: "course5",
    title: "Desenvolvimento Web Fullstack",
    description: "Aprenda a criar aplicações web completas, do frontend ao backend.",
    mentorId: "mentor4",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&auto=format&fit=crop",
    materials: [],
    public: true,
  },
  {
    id: "course6",
    title: "Estratégias Avançadas de Marketing",
    description: "Aprofunde seus conhecimentos em marketing digital com técnicas avançadas.",
    mentorId: "mentor1",
    price: 249.90,
    imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=400&auto=format&fit=crop",
    materials: [],
    public: true,
  },
];

// Mock mentorados
export const mockMentorados: User[] = [
  {
    id: "mentorado1",
    name: "Maria Oliveira",
    email: "mentorado1@teste.com",
    role: "mentee",
    bio: "Estudante de marketing digital buscando especialização.",
    profileImage: "/placeholder.svg",
  },
  {
    id: "mentorado2",
    name: "João Santos",
    email: "mentorado2@teste.com",
    role: "mentee",
    bio: "Profissional em transição de carreira.",
    profileImage: "/placeholder.svg",
  },
  {
    id: "mentorado3",
    name: "Luciana Ferreira",
    email: "mentorado3@teste.com",
    role: "mentee",
    bio: "Empreendedora iniciando seu próprio negócio.",
    profileImage: "/placeholder.svg",
  },
  {
    id: "mentorado4",
    name: "Roberto Lima",
    email: "mentorado4@teste.com",
    role: "mentee",
    bio: "Gestor buscando aprimorar habilidades de liderança.",
    profileImage: "/placeholder.svg",
  },
  {
    id: "mentorado5",
    name: "Fernanda Costa",
    email: "mentorado5@teste.com",
    role: "mentee",
    bio: "Estudante universitária interessada em finanças.",
    profileImage: "/placeholder.svg",
  },
];

// Mock schedule slots
export const mockScheduleSlots: ScheduleSlot[] = [
  {
    id: "slot1",
    mentorId: "mentor1",
    date: "2025-05-20",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    isBooked: false,
  },
  {
    id: "slot2",
    mentorId: "mentor1",
    date: "2025-05-20",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    isBooked: true,
    sessionId: "session1",
  },
  {
    id: "slot3",
    mentorId: "mentor2",
    date: "2025-05-21",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    isBooked: false,
  },
];

// Mock sessions
export const mockSessions: Session[] = [
  {
    id: "session1",
    slotId: "slot2",
    mentorId: "mentor1",
    menteeId: "mentorado1",
    comment: "Gostaria de discutir estratégias de marketing para meu novo negócio",
    status: "approved",
  },
];

// Mock progresso dos mentorados nos cursos
export const mockCourseProgress = [
  {
    menteeId: "mentorado1",
    courseId: "course4",
    progress: [
      { materialId: "mat4", completed: true, lastAccessed: "2025-05-10" },
      { materialId: "mat5", completed: false, lastAccessed: null },
      { materialId: "mat6", completed: false, lastAccessed: null },
    ]
  },
  {
    menteeId: "mentorado2",
    courseId: "course4",
    progress: [
      { materialId: "mat4", completed: true, lastAccessed: "2025-05-12" },
      { materialId: "mat5", completed: false, lastAccessed: null },
      { materialId: "mat6", completed: false, lastAccessed: null },
    ]
  },
  {
    menteeId: "mentorado3",
    courseId: "course4",
    progress: [
      { materialId: "mat4", completed: false, lastAccessed: null },
      { materialId: "mat5", completed: false, lastAccessed: null },
      { materialId: "mat6", completed: false, lastAccessed: null },
    ]
  }
];
