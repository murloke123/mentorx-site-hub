import { supabase } from '@/integrations/supabase/client';
import { CleanLandingPageData, HeroTemplatesConfig, DEFAULT_HERO_TEMPLATES } from '@/types/template-system';

export class TemplateService {
  // Extrair texto puro de HTML
  static extractCleanContent(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remover scripts e estilos
    const scripts = tempDiv.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  
  // Converter estrutura antiga (element_1) para nova estrutura limpa
  static migrateOldStructure(oldData: any): CleanLandingPageData {
    if (!oldData || !oldData.element_1) {
      return this.getDefaultCleanData();
    }
    
    const element1 = oldData.element_1;
    
    return {
      "attention-tag": this.extractCleanContent(element1.tagname || ""),
      "title": this.extractCleanContent(element1.title || ""),
      "description": this.extractCleanContent(element1.description || ""),
      "button1": this.extractCleanContent(element1.button1 || ""),
      "button2": this.extractCleanContent(element1.button2 || ""),
      "review": this.extractCleanContent(element1.review || ""),
      "floating_card1": this.extractCleanContent(element1.floating_card1 || ""),
      "floating_card2": this.extractCleanContent(element1.floating_card2 || ""),
      "floating_card3": this.extractCleanContent(element1.floating_card3 || ""),
      "floating_card4": this.extractCleanContent(element1.floating_card4 || "")
    };
  }
  
  // Dados padrão limpos
  static getDefaultCleanData(): CleanLandingPageData {
    return {
      "attention-tag": "⚡ Elite Performance garantido",
      "title": "Domine Marketing Digital em 30 Dias",
      "description": "Transforme sua carreira e conquiste a liberdade financeira com estratégias comprovadas que geraram mais de R$10 milhões em vendas.",
      "button1": "GARANTIR MINHA VAGA",
      "button2": "Ver Prévia Gratuita",
      "review": "4.9/5 • Baseado em 1.2k avaliações"
    };
  }
  
  // Aplicar template HTML a dados limpos
  static applyTemplate(fieldName: keyof CleanLandingPageData, cleanContent: string, templates: HeroTemplatesConfig): string {
    const template = templates[fieldName];
    if (!template) return cleanContent;
    
    let html = template.html;
    const words = cleanContent.split(' ');
    
    // Substituir placeholders com palavras do conteúdo
    template.placeholders.forEach((placeholder, index) => {
      const word = words[index] || '';
      html = html.replace(placeholder, word);
    });
    
    return html;
  }
  
  // Salvar templates customizados
  static async saveCustomTemplates(landingPageId: string, templates: HeroTemplatesConfig): Promise<void> {
    const { error } = await supabase
      .from('course_landing_pages')
      .update({
        custom_templates: templates,
        updated_at: new Date().toISOString()
      })
      .eq('id', landingPageId);
      
    if (error) throw error;
  }
  
  // Carregar templates (customizados ou padrão)
  static async loadTemplates(landingPageId: string): Promise<HeroTemplatesConfig> {
    const { data, error } = await supabase
      .from('course_landing_pages')
      .select('custom_templates')
      .eq('id', landingPageId)
      .single();
      
    if (error || !data?.custom_templates) {
      return DEFAULT_HERO_TEMPLATES;
    }
    
    return data.custom_templates;
  }
  
  // Migrar dados existentes para nova estrutura
  static async migrateExistingData(landingPageId: string): Promise<CleanLandingPageData> {
    try {
      // Buscar dados atuais
      const { data, error } = await supabase
        .from('course_landing_pages')
        .select('sec_hero')
        .eq('id', landingPageId)
        .single();
        
      if (error) throw error;
      
      // Converter para estrutura limpa
      const cleanData = this.migrateOldStructure(data?.sec_hero);
      
      // Salvar nova estrutura limpa
      const { error: updateError } = await supabase
        .from('course_landing_pages')
        .update({
          sec_hero_clean: cleanData,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPageId);
        
      if (updateError) throw updateError;
      
      return cleanData;
    } catch (error) {
      console.error('Erro na migração:', error);
      return this.getDefaultCleanData();
    }
  }
} 