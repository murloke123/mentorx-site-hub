
import { supabase } from '@/integrations/supabase/client';
import { LandingPageData } from '@/types/landing-page';

export const templateService = {
  async getTemplateData(templateType: string): Promise<LandingPageData | null> {
    try {
      console.log(`🔍 Buscando dados do template: ${templateType}`);

      const { data, error } = await supabase
        .from('course_landing_pages')
        .select('*')
        .eq('layout_name', templateType)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar template:', error);
        return null;
      }

      if (!data) {
        console.log(`⚠️ Template ${templateType} não encontrado`);
        return null;
      }

      console.log(`✅ Template ${templateType} carregado com sucesso`);
      
      return {
        id: data.id,
        template_type: data.layout_name || templateType,
        course_id: data.course_id,
        mentor_id: data.mentor_id,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at,
        layout_name: data.layout_name,
        layout_body: data.layout_body || {},
        layout_images: data.layout_images || {},
        ...data.layout_body
      };
      
    } catch (error) {
      console.error('❌ Erro inesperado ao carregar template:', error);
      return null;
    }
  },

  async updateTemplateData(templateId: string, data: Partial<LandingPageData>): Promise<boolean> {
    try {
      console.log(`💾 Salvando dados do template: ${templateId}`);
      
      const { layout_body, layout_images, ...otherData } = data;
      
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (layout_body) {
        updateData.layout_body = layout_body;
      }

      if (layout_images) {
        updateData.layout_images = layout_images;
      }

      Object.keys(otherData).forEach(key => {
        if (key !== 'id' && key !== 'created_at' && key !== 'template_type') {
          updateData[key] = (otherData as any)[key];
        }
      });

      const { error } = await supabase
        .from('course_landing_pages')
        .update(updateData)
        .eq('id', templateId);

      if (error) {
        console.error('❌ Erro ao salvar template:', error);
        return false;
      }

      console.log(`✅ Template ${templateId} salvo com sucesso`);
      return true;
      
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar template:', error);
      return false;
    }
  },

  async createTemplate(data: Omit<LandingPageData, 'id' | 'created_at' | 'updated_at'>): Promise<LandingPageData | null> {
    try {
      const { layout_body, layout_images, ...otherData } = data;
      
      const insertData = {
        layout_name: data.template_type,
        course_id: data.course_id,
        mentor_id: data.mentor_id,
        is_active: data.is_active,
        layout_body: layout_body || {},
        layout_images: layout_images || {},
        ...otherData
      };

      const { data: newTemplate, error } = await supabase
        .from('course_landing_pages')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar template:', error);
        return null;
      }

      return {
        id: newTemplate.id,
        template_type: newTemplate.layout_name,
        course_id: newTemplate.course_id,
        mentor_id: newTemplate.mentor_id,
        is_active: newTemplate.is_active,
        created_at: newTemplate.created_at,
        updated_at: newTemplate.updated_at,
        layout_name: newTemplate.layout_name,
        layout_body: newTemplate.layout_body || {},
        layout_images: newTemplate.layout_images || {},
        ...newTemplate.layout_body
      };
      
    } catch (error) {
      console.error('❌ Erro inesperado ao criar template:', error);
      return null;
    }
  }
};
