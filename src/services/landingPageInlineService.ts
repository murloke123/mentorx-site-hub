import { supabase } from '../integrations/supabase/client';

export class LandingPageInlineService {
  
  /**
   * Buscar dados de uma landing page por ID
   */
  static async getLandingPage(id: string) {
    try {
      const { data, error } = await supabase
        .from('course_landing_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar landing page: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço getLandingPage:', error);
      throw error;
    }
  }

  /**
   * Atualizar uma seção específica da landing page
   */
  static async updateSection(pageId: string, section: string, data: any) {
    try {
      // Validar seção
      const validSections = [
        'sec_hero', 'sec_about_course', 'sec_about_mentor', 'sec_results',
        'sec_testimonials', 'sec_curriculum', 'sec_bonus', 'sec_pricing',
        'sec_faq', 'sec_final_cta'
      ];

      if (!validSections.includes(section)) {
        throw new Error('Seção inválida');
      }

      // Atualizar no banco
      const { data: updateResult, error } = await supabase
        .from('course_landing_pages')
        .update({
          [section]: data
        })
        .eq('id', pageId)
        .select();

      if (error) {
        throw new Error(`Erro ao atualizar seção: ${error.message}`);
      }

      if (!updateResult || updateResult.length === 0) {
        throw new Error('Página não encontrada');
      }

      return updateResult[0];
    } catch (error) {
      console.error('Erro no serviço updateSection:', error);
      throw error;
    }
  }
} 