import { supabase } from '@/integrations/supabase/client';
import { LandingPageData, LandingPageFormData } from '@/types/landing-page';

export interface LandingPageDataWithCourse extends LandingPageData {
  course?: {
    title: string;
    description: string;
    price: number;
    image_url: string;
    mentor_id: string;
  };
}

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
      headline: data.headline || '',
      subheadline: data.subheadline || '',
      description: data.description || '',
      benefits: data.benefits || [],
      testimonials: data.testimonials || [],
      ctaText: data.cta_text || '',
      pricingText: data.pricing_text || '',
      bonusContent: data.bonus_content || '',
      aboutMentor: data.about_mentor || '',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
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
  formData?: LandingPageFormData
): Promise<LandingPageData> => {
  try {
    // Primeiro, desativar qualquer landing page existente
    await (supabase as any)
      .from('course_landing_pages')
      .update({ is_active: false })
      .eq('course_id', courseId);

    // Criar nova landing page
    const insertData = {
      course_id: courseId,
      template_type: templateType,
      headline: formData?.headline || '',
      subheadline: formData?.subheadline || '',
      description: formData?.description || '',
      benefits: formData?.benefits || [],
      testimonials: formData?.testimonials || [],
      cta_text: formData?.ctaText || '',
      pricing_text: formData?.pricingText || '',
      bonus_content: formData?.bonusContent || '',
      about_mentor: formData?.aboutMentor || '',
      is_active: true
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
      headline: data.headline || '',
      subheadline: data.subheadline || '',
      description: data.description || '',
      benefits: data.benefits || [],
      testimonials: data.testimonials || [],
      ctaText: data.cta_text || '',
      pricingText: data.pricing_text || '',
      bonusContent: data.bonus_content || '',
      aboutMentor: data.about_mentor || '',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Erro ao salvar landing page:', error);
    throw error;
  }
};

// Atualizar dados editáveis da landing page
export const updateLandingPageContent = async (
  landingPageId: string,
  formData: LandingPageFormData
): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('course_landing_pages')
      .update({
        headline: formData.headline,
        subheadline: formData.subheadline,
        description: formData.description,
        benefits: formData.benefits,
        testimonials: formData.testimonials,
        cta_text: formData.ctaText,
        pricing_text: formData.pricingText,
        bonus_content: formData.bonusContent,
        about_mentor: formData.aboutMentor,
        updated_at: new Date().toISOString()
      })
      .eq('id', landingPageId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar conteúdo da landing page:', error);
    throw error;
  }
};

// Buscar dados do curso para usar na landing page
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
        mentor:profiles!cursos_mentor_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('id', courseId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price || 0,
      image: data.image_url || '',
      mentor: {
        name: data.mentor?.[0]?.full_name || '',
        avatar: data.mentor?.[0]?.avatar_url || '',
        bio: data.mentor?.[0]?.bio || ''
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