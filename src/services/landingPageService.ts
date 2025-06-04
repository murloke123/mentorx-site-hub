import { supabase } from '@/integrations/supabase/client';
import { 
  LandingPageData, 
  LandingPageDataWithCourse, 
  LandingPageFormData,
  LandingPageSectionFormData,
  HeroSection,
  AboutCourseSection,
  AboutMentorSection,
  ResultsSection,
  TestimonialsSection,
  CurriculumSection,
  BonusSection,
  PricingSection,
  FAQSection,
  FinalCTASection
} from '@/types/landing-page';

// Buscar landing page ativa de um curso
export const getCourseLandingPage = async (courseId: string): Promise<LandingPageDataWithCourse | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('course_landing_pages')
      .select(`
        *,
        course:cursos!course_landing_pages_course_id_fkey (
          title,
          description,
          price,
          image_url,
          mentor_id
        )
      `)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum registro encontrado
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      courseId: data.course_id,
      templateType: data.template_type as 'modelo1' | 'modelo2' | 'modelo3',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      sec_hero: data.sec_hero || getDefaultHeroSection(),
      sec_about_course: data.sec_about_course || getDefaultAboutCourseSection(),
      sec_about_mentor: data.sec_about_mentor || getDefaultAboutMentorSection(),
      sec_results: data.sec_results || getDefaultResultsSection(),
      sec_testimonials: data.sec_testimonials || getDefaultTestimonialsSection(),
      sec_curriculum: data.sec_curriculum || getDefaultCurriculumSection(),
      sec_bonus: data.sec_bonus || getDefaultBonusSection(),
      sec_pricing: data.sec_pricing || getDefaultPricingSection(),
      sec_faq: data.sec_faq || getDefaultFAQSection(),
      sec_final_cta: data.sec_final_cta || getDefaultFinalCTASection(),
      course: data.course
    };
  } catch (error) {
    console.error('Erro ao buscar landing page:', error);
    throw error;
  }
};

// Criar ou atualizar landing page
export const saveCourseLandingPage = async (
  courseId: string,
  templateType: 'modelo1' | 'modelo2' | 'modelo3',
  courseTitle?: string,
  coursePrice?: number
): Promise<LandingPageData> => {
  try {
    // Primeiro, desativar qualquer landing page existente
    await (supabase as any)
      .from('course_landing_pages')
      .update({ is_active: false })
      .eq('course_id', courseId);

    // Buscar informações do curso
    const { data: courseData } = await supabase
      .from('cursos')
      .select('title, price')
      .eq('id', courseId)
      .single();

    const title = courseTitle || courseData?.title || 'Transforme sua Carreira';
    const price = coursePrice || courseData?.price || 497;

    // Criar nova landing page
    const insertData = {
      course_id: courseId,
      template_type: templateType,
      is_active: true,
      sec_hero: getDefaultHeroSection(title),
      sec_about_course: getDefaultAboutCourseSection(),
      sec_about_mentor: getDefaultAboutMentorSection(),
      sec_results: getDefaultResultsSection(),
      sec_testimonials: getDefaultTestimonialsSection(),
      sec_curriculum: getDefaultCurriculumSection(),
      sec_bonus: getDefaultBonusSection(),
      sec_pricing: getDefaultPricingSection(price),
      sec_faq: getDefaultFAQSection(),
      sec_final_cta: getDefaultFinalCTASection()
    };

    const { data, error } = await (supabase as any)
      .from('course_landing_pages')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Atualizar referência na tabela courses
    await supabase
      .from('cursos')
      .update({ landing_page_id: data.id } as any)
      .eq('id', courseId);

    return {
      id: data.id,
      courseId: data.course_id,
      templateType: data.template_type as 'modelo1' | 'modelo2' | 'modelo3',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      sec_hero: data.sec_hero,
      sec_about_course: data.sec_about_course,
      sec_about_mentor: data.sec_about_mentor,
      sec_results: data.sec_results,
      sec_testimonials: data.sec_testimonials,
      sec_curriculum: data.sec_curriculum,
      sec_bonus: data.sec_bonus,
      sec_pricing: data.sec_pricing,
      sec_faq: data.sec_faq,
      sec_final_cta: data.sec_final_cta
    };
  } catch (error) {
    console.error('Erro ao salvar landing page:', error);
    throw error;
  }
};

// Nova função: Atualizar uma seção específica da landing page
export const updateLandingPageSection = async (
  landingPageId: string,
  sectionData: LandingPageSectionFormData
): Promise<void> => {
  try {
    const updateData = {
      [sectionData.sectionType]: sectionData.data,
      updated_at: new Date().toISOString()
    };

    const { error } = await (supabase as any)
      .from('course_landing_pages')
      .update(updateData)
      .eq('id', landingPageId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar seção da landing page:', error);
    throw error;
  }
};

// Nova função: Atualizar múltiplas seções de uma vez
export const updateMultipleLandingPageSections = async (
  landingPageId: string,
  sections: Partial<{
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
  }>
): Promise<void> => {
  try {
    const updateData = {
      ...sections,
        updated_at: new Date().toISOString()
    };

    const { error } = await (supabase as any)
      .from('course_landing_pages')
      .update(updateData)
      .eq('id', landingPageId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar seções da landing page:', error);
    throw error;
  }
};

// Função para compatibilidade com código antigo (deprecated)
export const updateLandingPageContent = async (
  landingPageId: string,
  formData: LandingPageFormData
): Promise<void> => {
  try {
    // Converter dados antigos para nova estrutura
    const heroUpdate: Partial<HeroSection> = {
      title: formData.headline,
      subtitle: formData.subheadline,
      description: formData.description,
      cta_text: formData.ctaText
    };

    const testimonialUpdate: Partial<TestimonialsSection> = {
      testimonials: formData.testimonials.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: t.avatar,
        rating: 5,
        company: '',
        result: ''
      }))
    };

    const aboutMentorUpdate: Partial<AboutMentorSection> = {
      description: formData.aboutMentor
    };

    await updateMultipleLandingPageSections(landingPageId, {
      sec_hero: heroUpdate as HeroSection,
      sec_testimonials: testimonialUpdate as TestimonialsSection,
      sec_about_mentor: aboutMentorUpdate as AboutMentorSection
    });
  } catch (error) {
    console.error('Erro ao atualizar conteúdo da landing page:', error);
    throw error;
  }
};

// Nova função: Buscar dados do curso para landing page
export const getCourseDataForLandingPage = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        id,
        title,
        description,
        price,
        image_url,
        mentor_id,
        profiles!cursos_mentor_id_fkey (
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('id', courseId)
      .single();

    if (error) throw error;

    // Corrigir o acesso aos dados do perfil
    const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

    return {
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image_url,
      mentor: {
        name: profile?.full_name || 'Mentor',
        avatar: profile?.avatar_url || '',
        bio: profile?.bio || ''
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados do curso:', error);
    throw error;
  }
};

// Verificar se o usuário tem permissão para editar a landing page
export const canEditLandingPage = async (courseId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;

    const { data, error } = await supabase
      .from('cursos')
      .select('mentor_id')
      .eq('id', courseId)
      .single();

    if (error) return false;

    return data.mentor_id === session.session.user.id;
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return false;
  }
};

export const updateCourseWithLandingPage = async (courseId: string, landingPageId: string): Promise<void> => {
  const { error } = await supabase
    .from('cursos')
    .update({ landing_page_id: landingPageId })
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course with landing page:', error);
    throw new Error('Falha ao vincular landing page ao curso');
  }
}; 

// === FUNÇÕES DE DADOS PADRÃO ===

function getDefaultHeroSection(title = 'Transforme sua Carreira'): HeroSection {
  return {
    title: `${title} em 30 Dias`,
    subtitle: 'Aprenda as habilidades mais demandadas do mercado',
    description: 'Curso prático e objetivo para profissionais que querem resultados reais',
    cta_text: 'Quero Me Inscrever Agora',
    course_duration: '30 dias',
    students_count: '500+',
    rating: '4.9',
    content_hours: '40h',
    background_image: '',
    video_url: ''
  };
}

function getDefaultAboutCourseSection(): AboutCourseSection {
  return {
    title: 'Sobre o Curso',
    description: 'Este curso foi desenvolvido para profissionais que desejam se destacar em sua área de atuação',
    objectives: [
      'Dominar habilidades práticas essenciais',
      'Aplicar conhecimento no mundo real',
      'Acelerar crescimento profissional',
      'Desenvolver expertise reconhecida'
    ],
    target_audience: [
      'Profissionais em início de carreira',
      'Pessoas em transição profissional',
      'Empreendedores e freelancers',
      'Estudantes da área'
    ],
    prerequisites: 'Nenhum conhecimento prévio necessário',
    certificate: true,
    methodology: 'Aprenda na prática com projetos reais'
  };
}

function getDefaultAboutMentorSection(): AboutMentorSection {
  return {
    title: 'Conheça seu Mentor',
    mentor_name: 'Especialista da Área',
    description: 'Profissional experiente e reconhecido no mercado',
    bio: 'Com anos de experiência prática, nosso mentor vai te guiar passo a passo para o sucesso',
    credentials: [
      'Especialização na área',
      'Experiência comprovada',
      'Resultados entregues'
    ],
    achievements: [
      'Mais de 1000 alunos formados',
      'Projetos de sucesso entregues',
      'Reconhecimento no mercado'
    ],
    photo_url: '',
    social_links: {
      linkedin: '',
      instagram: ''
    },
    experience_years: 10
  };
}

function getDefaultResultsSection(): ResultsSection {
  return {
    title: 'Resultados Comprovados',
    subtitle: 'Veja os números que comprovam a eficácia do método',
    statistics: [
      { metric: 'Alunos formados', value: '1.000+', description: 'Profissionais capacitados' },
      { metric: 'Taxa de sucesso', value: '95%', description: 'Dos alunos aplicam o método' },
      { metric: 'Satisfação', value: '4.9/5', description: 'Avaliação média dos alunos' },
      { metric: 'Certificados', value: '800+', description: 'Certificados emitidos' }
    ],
    case_studies: [
      {
        student_name: 'Ana Silva',
        before: 'Profissional júnior',
        after: 'Especialista reconhecida',
        time: '6 meses'
      }
    ]
  };
}

function getDefaultTestimonialsSection(): TestimonialsSection {
  return {
    title: 'O que nossos alunos dizem',
    subtitle: 'Transformações reais de quem aplicou o método',
    testimonials: [
      {
        id: '1',
        name: 'Maria Santos',
        role: 'Profissional da área',
        content: 'O curso transformou completamente minha forma de trabalhar. Recomendo demais!',
        avatar: '',
        rating: 5,
        company: 'Empresa XYZ',
        result: 'Crescimento profissional'
      },
      {
        id: '2',
        name: 'João Oliveira',
        role: 'Especialista',
        content: 'Método prático e objetivo. Consegui aplicar tudo no meu trabalho.',
        avatar: '',
        rating: 5,
        company: 'Consultoria ABC',
        result: 'Melhores resultados'
      }
    ]
  };
}

function getDefaultCurriculumSection(): CurriculumSection {
  return {
    title: 'Conteúdo Programático',
    subtitle: 'O que você vai aprender passo a passo',
    total_modules: 4,
    total_lessons: 24,
    total_hours: '40h',
    modules: [
      {
        module_number: 1,
        title: 'Fundamentos',
        description: 'Base sólida para começar com o pé direito',
        duration: '10h',
        lessons: ['Introdução', 'Conceitos básicos', 'Primeiros passos', 'Exercícios práticos']
      },
      {
        module_number: 2,
        title: 'Desenvolvimento',
        description: 'Aprofundando os conhecimentos',
        duration: '12h',
        lessons: ['Técnicas avançadas', 'Estratégias práticas', 'Casos de uso', 'Projetos guiados']
      },
      {
        module_number: 3,
        title: 'Aplicação Prática',
        description: 'Colocando em prática o aprendizado',
        duration: '12h',
        lessons: ['Projeto real', 'Implementação', 'Otimização', 'Resultados']
      },
      {
        module_number: 4,
        title: 'Especialização',
        description: 'Tornando-se um especialista',
        duration: '6h',
        lessons: ['Técnicas avançadas', 'Tendências do mercado', 'Networking', 'Próximos passos']
      }
    ]
  };
}

function getDefaultBonusSection(): BonusSection {
  return {
    title: 'Bônus Exclusivos',
    subtitle: 'Materiais extras para acelerar seus resultados',
    total_bonus_value: 'R$ 897',
    bonus_items: [
      {
        title: 'E-book Completo',
        description: 'Guia prático com templates e checklists',
        value: 'R$ 297',
        format: 'PDF',
        image_url: ''
      },
      {
        title: 'Planilhas de Trabalho',
        description: 'Organize seus projetos como um profissional',
        value: 'R$ 197',
        format: 'Excel',
        image_url: ''
      },
      {
        title: 'Acesso ao Grupo VIP',
        description: 'Comunidade exclusiva de alunos',
        value: 'R$ 197',
        format: 'Telegram',
        image_url: ''
      },
      {
        title: 'Sessão de Mentoria',
        description: '30 minutos individuais com o mentor',
        value: 'R$ 200',
        format: 'Videochamada',
        image_url: ''
      }
    ]
  };
}

function getDefaultPricingSection(price = 497): PricingSection {
  return {
    title: 'Investimento',
    subtitle: 'Transforme sua carreira com um investimento que se paga sozinho',
    price: price,
    original_price: price * 2,
    discount_percentage: 50,
    currency: 'BRL',
    payment_options: [
      {
        type: 'pix',
        price: price * 0.9,
        discount_text: '10% OFF no PIX',
        installments: 1
      },
      {
        type: 'card',
        price: price,
        installments: 12,
        price_per_installment: price / 12,
        discount_text: '12x sem juros'
      }
    ],
    guarantee: {
      days: 7,
      description: 'Garantia incondicional de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro'
    },
    comparison: {
      course_value: `R$ ${price}`,
      bonus_value: 'R$ 897',
      total_value: `R$ ${price + 897}`,
      you_pay: `R$ ${price}`
    }
  };
}

function getDefaultFAQSection(): FAQSection {
  return {
    title: 'Dúvidas Frequentes',
    subtitle: 'Tire suas principais dúvidas sobre o curso',
    faqs: [
      {
        question: 'Como funciona o acesso ao curso?',
        answer: 'Você recebe acesso imediato à plataforma após a confirmação do pagamento. O conteúdo fica disponível 24h por dia.'
      },
      {
        question: 'Por quanto tempo tenho acesso?',
        answer: 'O acesso é por tempo indeterminado! Você pode assistir quantas vezes quiser, no seu ritmo.'
      },
      {
        question: 'Preciso de conhecimento prévio?',
        answer: 'Não! O curso foi desenvolvido do básico ao avançado. Qualquer pessoa pode fazer.'
      },
      {
        question: 'Tem certificado?',
        answer: 'Sim! Ao concluir o curso você recebe um certificado de conclusão.'
      },
      {
        question: 'E se eu não gostar do curso?',
        answer: 'Oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do valor.'
      },
      {
        question: 'Como funciona o suporte?',
        answer: 'Você tem acesso ao grupo exclusivo de alunos e suporte direto com nossa equipe.'
      }
    ]
  };
}

function getDefaultFinalCTASection(): FinalCTASection {
  return {
    title: 'Não deixe sua carreira estagnar',
    subtitle: 'Esta é sua oportunidade de transformação',
    urgency_message: '⚠️ Oferta por tempo limitado',
    final_message: 'Milhares de profissionais já transformaram suas carreiras. Agora é a sua vez de fazer parte deste grupo.',
    cta_text: 'Garantir Minha Transformação Agora',
    secondary_cta: 'Ainda tenho dúvidas',
    timer_enabled: false,
    timer_deadline: '',
    scarcity: {
      enabled: false,
      remaining_spots: 50,
      message: 'Apenas {remaining_spots} vagas restantes'
    },
    risk_reversal: 'Lembre-se: você tem 7 dias de garantia total. Sem riscos!',
    contact_info: {
      whatsapp: '',
      email: 'suporte@mentorx.com'
    }
  };
} 