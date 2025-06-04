import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, EyeOff, X, Bot, Scan } from "lucide-react";
import '../../styles/inline-editor.css';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface EditableContent {
  [key: string]: any;
}

interface SectionMapping {
  selector: string[];
  keywords: string[];
  fallbackSelectors: string[];
}

// Mapeamento inteligente das seções
const SECTION_MAPPINGS: { [key: string]: SectionMapping } = {
  sec_hero: {
    selector: [
      '.hero', '.banner', '.jumbotron', '[id*="hero"]', '[class*="hero"]',
      'section:first-of-type', '.main-banner', '.top-section'
    ],
    keywords: ['curso', 'aprenda', 'domine', 'transforme', 'descubra'],
    fallbackSelectors: ['h1', '.title:first-of-type', '.main-title']
  },
  sec_about_course: {
    selector: [
      '[id*="about"]', '[class*="about"]', '[id*="course"]', '[class*="course"]',
      '.course-info', '.about-course', '.course-description'
    ],
    keywords: ['sobre o curso', 'conteúdo', 'metodologia', 'o que você vai aprender'],
    fallbackSelectors: ['section:nth-of-type(2)', '.description']
  },
  sec_about_mentor: {
    selector: [
      '[id*="mentor"]', '[class*="mentor"]', '[id*="instrutor"]', '[class*="instrutor"]',
      '.teacher', '.instructor', '.about-mentor'
    ],
    keywords: ['mentor', 'instrutor', 'professor', 'especialista', 'quem sou'],
    fallbackSelectors: ['.profile', '.bio']
  },
  sec_results: {
    selector: [
      '[id*="result"]', '[class*="result"]', '[id*="sucesso"]', '[class*="sucesso"]',
      '.results', '.success', '.achievements'
    ],
    keywords: ['resultados', 'sucesso', 'conquistas', 'transformação', 'antes e depois'],
    fallbackSelectors: ['.stats', '.numbers']
  },
  sec_testimonials: {
    selector: [
      '[id*="testimonial"]', '[class*="testimonial"]', '[id*="depoimento"]', '[id*="depoimento"]',
      '.reviews', '.feedback', '.testimonials'
    ],
    keywords: ['depoimento', 'testemunho', 'avaliação', 'feedback', 'alunos'],
    fallbackSelectors: ['.review', '.quote']
  },
  sec_curriculum: {
    selector: [
      '[id*="curriculum"]', '[class*="curriculum"]', '[id*="modulo"]', '[id*="modulo"]',
      '.modules', '.curriculum', '.course-content', '.syllabus'
    ],
    keywords: ['módulos', 'currículo', 'conteúdo programático', 'grade', 'aulas'],
    fallbackSelectors: ['.content-list', '.modules-list']
  },
  sec_bonus: {
    selector: [
      '[id*="bonus"]', '[class*="bonus"]', '[id*="extra"]', '[class*="extra"]',
      '.bonuses', '.extras', '.additional'
    ],
    keywords: ['bônus', 'extras', 'brinde', 'adicional', 'grátis'],
    fallbackSelectors: ['.gifts', '.freebies']
  },
  sec_pricing: {
    selector: [
      '[id*="pricing"]', '[class*="pricing"]', '[id*="preco"]', '[id*="preco"]',
      '.price', '.investment', '.payment', '.plans'
    ],
    keywords: ['preço', 'investimento', 'valor', 'R$', 'pagamento'],
    fallbackSelectors: ['.price-box', '.cost']
  },
  sec_faq: {
    selector: [
      '[id*="faq"]', '[class*="faq"]', '[id*="duvida"]', '[id*="duvida"]',
      '.questions', '.doubts', '.help'
    ],
    keywords: ['faq', 'perguntas', 'dúvidas', 'ajuda', 'questões'],
    fallbackSelectors: ['.accordion', '.qa']
  },
  sec_final_cta: {
    selector: [
      '[id*="cta"]', '[class*="cta"]', '[id*="action"]', '[id*="action"]',
      '.call-to-action', '.final-cta', '.subscribe', '.buy-now'
    ],
    keywords: ['inscreva-se', 'comprar', 'adquirir', 'começar', 'garanta'],
    fallbackSelectors: ['button:last-of-type', '.btn-primary:last-of-type']
  }
};

// Mapeamento de data-field para campos do banco
const HERO_FIELD_MAP = {
  tagname: 'tagname',
  title: 'title', 
  description: 'description',
  button1: 'button1',
  button2: 'button2',
  review: 'review',
  floating_card1: 'floating_card1',
  floating_card2: 'floating_card2',
  floating_card3: 'floating_card3',
  floating_card4: 'floating_card4'
};

const templates: TemplateOption[] = [
  {
    id: 'modelo1',
    name: 'Modelo 1',
    description: 'Modelo focado em conversão',
    preview: '/landing-page-modelo1-completa.html',
  },
  {
    id: 'modelo2',
    name: 'Modelo 2',
    description: 'Modelo moderno e elegante',
    preview: '/landing-page-modelo2-completa.html',
  },
  {
    id: 'modelo3',
    name: 'Modelo 3',
    description: 'Modelo modular - Apenas Hero (em desenvolvimento)',
    preview: '/components/landing-modelo3/sections/model3_sec_hero.html',
  },
];

const CourseLandingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [landingPageId, setLandingPageId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState<EditableContent>({});
  const [originalContent, setOriginalContent] = useState<EditableContent>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalAction, setModalAction] = useState<'exit' | 'close'>('exit');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar dados do curso e template ativo
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;

      // Garantir que loading está ativo
      setIsPageLoading(true);
      
      try {
        console.log('🔍 Carregando dados para curso:', courseId);
        
        // Buscar dados do curso E landing page em paralelo para ser mais rápido
        const [courseResult, landingPageResult] = await Promise.all([
          supabase.from('cursos').select('*').eq('id', courseId).single(),
          supabase.from('course_landing_pages').select('*').eq('course_id', courseId).single()
        ]);

        const { data: course } = courseResult;
        if (!course) {
          console.error('❌ Curso não encontrado');
          return;
        }

        setCourseData(course);
        console.log('✅ Curso carregado:', course.title);

        // Se landing page já existe, usar dados direto
        if (landingPageResult.data) {
          const existingPage = landingPageResult.data;
          console.log('✅ Landing page encontrada (paralela):', existingPage.template_type);
          
          const templateType = existingPage.template_type;
          setSelectedTemplate(templateType);
          setActiveTemplate(templateType);
          setLandingPageId(existingPage.id);
          
          const content = {
            sec_hero: (existingPage as any).sec_hero || {},
            sec_about_course: (existingPage as any).sec_about_course || {},
            sec_about_mentor: (existingPage as any).sec_about_mentor || {},
            sec_results: (existingPage as any).sec_results || {},
            sec_testimonials: (existingPage as any).sec_testimonials || {},
            sec_curriculum: (existingPage as any).sec_curriculum || {},
            sec_bonus: (existingPage as any).sec_bonus || {},
            sec_pricing: (existingPage as any).sec_pricing || {},
            sec_faq: (existingPage as any).sec_faq || {},
            sec_final_cta: (existingPage as any).sec_final_cta || {}
          };
          setEditableContent(content);
          setOriginalContent(content);
          
          setIsPageLoading(false);
          console.log(`✅ Template "${templateType}" carregado em paralelo!`);
          } else {
          // Se não existe, criar um novo
          await initializeLandingPage(courseId, course.mentor_id);
        }

      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        // Fallback para modelo1 em caso de erro
        setSelectedTemplate('modelo1');
        setActiveTemplate('modelo1');
        setIsPageLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const initializeLandingPage = async (courseId: string, mentorId: string) => {
    try {
      // Verificar se já existe landing page para este curso
      const { data: existingPage } = await supabase
        .from('course_landing_pages')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (existingPage) {
        // Landing page já existe - carregar dados
        console.log('✅ Landing page encontrada:', existingPage.template_type);
        
        // Definir templates de forma atômica para evitar flash
        const templateType = existingPage.template_type;
        setSelectedTemplate(templateType);
        setActiveTemplate(templateType);
        setLandingPageId(existingPage.id);
        
        // Carregar conteúdo editável
        const content = {
          sec_hero: (existingPage as any).sec_hero || {},
          sec_about_course: (existingPage as any).sec_about_course || {},
          sec_about_mentor: (existingPage as any).sec_about_mentor || {},
          sec_results: (existingPage as any).sec_results || {},
          sec_testimonials: (existingPage as any).sec_testimonials || {},
          sec_curriculum: (existingPage as any).sec_curriculum || {},
          sec_bonus: (existingPage as any).sec_bonus || {},
          sec_pricing: (existingPage as any).sec_pricing || {},
          sec_faq: (existingPage as any).sec_faq || {},
          sec_final_cta: (existingPage as any).sec_final_cta || {}
        };
        setEditableContent(content);
        setOriginalContent(content);
        
        console.log(`✅ Template "${templateType}" carregado sem flash`);
      } else {
        // Landing page não existe - criar com modelo1 padrão
        console.log('⚠️ Landing page não encontrada. Criando com modelo1 padrão...');
        
        const { data: newPage, error } = await supabase
          .from('course_landing_pages')
          .insert({
            course_id: courseId,
            mentor_id: mentorId,
            template_type: 'modelo1',
            is_active: true
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao criar landing page:', error);
          return;
        }

        console.log('✅ Landing page criada com modelo1');
        setSelectedTemplate('modelo1');
        setActiveTemplate('modelo1');
        setLandingPageId(newPage.id);
        setEditableContent({
          sec_hero: {},
          sec_about_course: {},
          sec_about_mentor: {},
          sec_results: {},
          sec_testimonials: {},
          sec_curriculum: {},
          sec_bonus: {},
          sec_pricing: {},
          sec_faq: {},
          sec_final_cta: {}
        });
        setOriginalContent({
          sec_hero: {},
          sec_about_course: {},
          sec_about_mentor: {},
          sec_results: {},
          sec_testimonials: {},
          sec_curriculum: {},
          sec_bonus: {},
          sec_pricing: {},
          sec_faq: {},
          sec_final_cta: {}
        });
      }
      
      // Finalizar loading após definir TODOS os estados
      setTimeout(() => {
        setIsPageLoading(false);
      }, 50); // Reduzir delay para ser mais rápido
      
    } catch (error) {
      console.error('❌ Erro ao inicializar landing page:', error);
      // Em caso de erro, usar modelo1 como fallback
      setSelectedTemplate('modelo1');
      setActiveTemplate('modelo1');
      setIsPageLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!courseId || !landingPageId || !selectedTemplate) return;

    setIsLoading(true);
    setIsPageLoading(true);
    
    try {
      console.log(`🔄 Atualizando template de ${activeTemplate} para ${selectedTemplate}`);

      // Fazer UPDATE apenas no template_type
      const { error } = await supabase
        .from('course_landing_pages')
        .update({ 
          template_type: selectedTemplate,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPageId);

      if (error) throw error;

      setActiveTemplate(selectedTemplate);
      console.log('✅ Template atualizado com sucesso!');
      
      // Pequeno delay para evitar flash
      setTimeout(() => {
        setIsPageLoading(false);
        alert('Template salvo com sucesso!');
      }, 300);
      
    } catch (error) {
      console.error('❌ Erro ao salvar template:', error);
      setIsPageLoading(false);
      alert('Erro ao salvar template');
    } finally {
      setIsLoading(false);
    }
  };

  // 🤖 ROBÔ ANALISADOR INTELIGENTE (ATUALIZADO para usar seletores específicos)
  const analyzePageContent = async () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) {
      console.error('❌ Iframe não disponível para análise');
      const indicator = document.createElement('div');
      indicator.className = 'saving-indicator error show';
      indicator.innerHTML = '❌ Página não carregada';
      document.body.appendChild(indicator);
      setTimeout(() => indicator.remove(), 3000);
      return;
    }

    setIsAnalyzing(true);
    const analyzingIndicator = showAnalyzingIndicator();
    
    try {
      console.log('🤖 Analisando seção hero com seletores específicos...');
      
      // Extrair conteúdo usando seletores específicos
      const extractedContent = extractContentFromPage();
      
      if (!extractedContent) {
        throw new Error('Não foi possível extrair conteúdo da página');
      }
      
      // Contar elementos encontrados
      const heroContent = extractedContent.sec_hero.element_1;
      const fieldsFound = Object.keys(heroContent).filter(key => 
        key !== 'position' && key !== 'className' && key !== 'extractedAt' && heroContent[key]
      );
      
      if (fieldsFound.length === 0) {
        throw new Error('Nenhum campo válido foi encontrado na seção hero');
      }
      
      // Remover indicador de análise
      analyzingIndicator.remove();
      
      // Salvar conteúdo analisado
      await saveExtractedContent(extractedContent);
      
      console.log(`🎉 Análise concluída! ${fieldsFound.length} campos extraídos da hero`);
      showAnalysisCompleteIndicator();
      
      // Mostrar resumo da análise
      const summary = fieldsFound.map(field => `${field}: "${heroContent[field]}"`).join('\n');
      
      setTimeout(() => {
        alert(`🤖 Análise da Hero Concluída!\n\nCampos extraídos: ${fieldsFound.length}\n\nConteúdo encontrado:\n${summary}`);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro durante análise:', error);
      analyzingIndicator.remove();
      
      const errorIndicator = document.createElement('div');
      errorIndicator.className = 'saving-indicator error show';
      errorIndicator.innerHTML = `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      document.body.appendChild(errorIndicator);
      setTimeout(() => errorIndicator.remove(), 5000);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extrair conteúdo estruturado de um elemento
  const extractElementContent = (element: Element) => {
    const text = element.textContent?.trim() || '';
    const tagName = element.tagName.toLowerCase();
    const className = element.className || '';
    
    // Filtrar textos muito curtos ou vazios
    if (!text || text.length < 5) {
      return null;
    }
    
    // Detectar tipo de conteúdo
    let contentType = 'text';
    if (tagName === 'button' || className.includes('btn')) contentType = 'button';
    else if (tagName.startsWith('h')) contentType = 'heading';
    else if (className.includes('price') || text.includes('R$')) contentType = 'price';
    
    return {
      text: text,
      type: contentType,
      tagName: tagName
    };
  };

  // Salvar conteúdo analisado no banco
  const saveAnalyzedContent = async (content: EditableContent) => {
    if (!landingPageId) return;

    try {
      console.log('💾 Salvando conteúdo analisado...');
      
      const { error } = await supabase
        .from('course_landing_pages')
        .update({
          ...content,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPageId);

      if (error) throw error;

      console.log('✅ Conteúdo analisado salvo com sucesso!');
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('❌ Erro ao salvar conteúdo analisado:', error);
      throw error;
    }
  };

  // Aplicar conteúdo salvo de volta à página
  const applyContentToPage = () => {
    console.log('📝 Conteúdo salvo no banco de dados. Página original mantida intacta.');
  };

  // Modo de edição inline funcional
  const initializeEditMode = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    if (isEditMode) {
      // Aplicar estilos de edição e tornar elementos editáveis
      let style = doc.querySelector('#edit-mode-styles');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'edit-mode-styles';
        style.textContent = `
          .editable-text {
            position: relative !important;
            outline: 2px dashed #3b82f6 !important;
            outline-offset: 2px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            cursor: text !important;
            border-radius: 4px !important;
            min-height: 20px !important;
            background-color: rgba(59, 130, 246, 0.02) !important;
          }
          .editable-text:hover {
            outline-color: #10b981 !important;
            background-color: rgba(16, 185, 129, 0.05) !important;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
            transform: scale(1.002) !important;
          }
          .editable-text:focus {
            outline-color: #f59e0b !important;
            background-color: rgba(245, 158, 11, 0.05) !important;
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15) !important;
            transform: scale(1.005) !important;
          }
          .editable-text.editing {
            outline-color: #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.05) !important;
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.2) !important;
            transform: scale(1.01) !important;
          }
          .edit-indicator { 
            position: fixed !important; 
            top: 10px !important; 
            right: 10px !important; 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important; 
            color: white !important; 
            padding: 12px 20px !important; 
            border-radius: 12px !important; 
            font-weight: bold !important;
            z-index: 9999 !important;
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4) !important;
            font-size: 14px !important;
            animation: pulse-edit 2s infinite !important;
          }
          @keyframes pulse-edit {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .section-badge {
            position: absolute !important;
            top: -28px !important;
            left: 0 !important;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            color: white !important;
            padding: 4px 12px !important;
            border-radius: 16px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            opacity: 0 !important;
            transition: all 0.3s ease !important;
            z-index: 1000 !important;
            pointer-events: none !important;
            white-space: nowrap !important;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
          }
          .editable-text:hover .section-badge {
            opacity: 1 !important;
            transform: translateY(-2px) !important;
          }
          @keyframes saving-pulse {
            0%, 100% { 
              background-color: rgba(16, 185, 129, 0.05) !important; 
              outline-color: #10b981 !important;
            }
            50% { 
              background-color: rgba(16, 185, 129, 0.15) !important;
              outline-color: #059669 !important;
            }
          }
          .editable-text.saving {
            animation: saving-pulse 1.5s infinite !important;
          }
          /* Garantir que elementos com outline sejam visíveis */
          * {
            outline-style: dashed !important;
          }
          .editable-text[contenteditable="true"] {
            outline: 3px dashed #3b82f6 !important;
            outline-offset: 3px !important;
          }
        `;
        doc.head.appendChild(style);
        
        // Adicionar indicador visual melhorado no topo
        const indicator = doc.createElement('div');
        indicator.className = 'edit-indicator';
        indicator.innerHTML = '✏️ MODO EDIÇÃO ATIVO<br><small style="font-size: 11px; opacity: 0.8;">Duplo clique para editar</small>';
        doc.body.appendChild(indicator);
        
        console.log('🎨 Estilos de edição aplicados!');
      }

      // Encontrar e tornar elementos editáveis
      console.log('🔍 Iniciando processo de tornar elementos editáveis...');
      makeElementsEditable(doc);
      
    } else {
      // Remover modo de edição
      const style = doc.querySelector('#edit-mode-styles');
      const indicator = doc.querySelector('.edit-indicator');
      if (style) style.remove();
      if (indicator) indicator.remove();
      
      // Remover edição de todos os elementos
      const editables = doc.querySelectorAll('.editable-text');
      console.log(`🧹 Removendo edição de ${editables.length} elementos`);
      editables.forEach((element: any) => {
        element.classList.remove('editable-text', 'editing', 'saving');
        element.contentEditable = 'false';
        element.removeAttribute('data-section');
        element.removeAttribute('data-original-text');
        element.removeAttribute('data-edit-id');
        element.removeAttribute('data-field-type');
        
        // Limpar estilos inline forçados
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.backgroundColor = '';
        element.style.cursor = '';
        element.style.transition = '';
        element.style.borderRadius = '';
        element.style.minHeight = '';
        element.style.boxShadow = '';
        element.style.transform = '';
        
        // Remover badges
        const badge = element.querySelector('.section-badge');
        if (badge) badge.remove();
      });
    }
  };

  // NOVO: Extrair conteúdo automaticamente da página usando data-field attributes
  const extractContentFromPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return null;

    const doc = iframe.contentDocument;
    const heroContent: any = {
      position: 0,
      className: '',
      extractedAt: new Date().toISOString()
    };

    // Extrair cada campo usando seu data-field attribute
    Object.keys(HERO_FIELD_MAP).forEach((fieldType) => {
      try {
        const element = doc.querySelector(`[data-field="${fieldType}"]`);
        if (element) {
          heroContent[fieldType] = element.textContent?.trim() || '';
          console.log(`✅ Extraído ${fieldType}:`, heroContent[fieldType]);
        } else {
          console.warn(`⚠️ Elemento não encontrado para ${fieldType}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao extrair ${fieldType}:`, error);
      }
    });

    return heroContent;
  };

  // NOVO: Salvar conteúdo extraído automaticamente no banco
  const saveExtractedContent = async (content: any) => {
    if (!landingPageId) return;

    try {
      console.log('💾 Salvando conteúdo extraído...', content);
      
      // CORRIGIDO: Salvar no formato JSONB dentro de sec_hero
      const heroData = {
        element_1: {
          ...content,
          extractedAt: new Date().toISOString(),
          position: 0,
          className: ''
        }
      };
      
      const { error } = await supabase
        .from('course_landing_pages')
        .update({
          sec_hero: heroData,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPageId);

      if (error) throw error;

      // Atualizar estado local no formato correto
      setEditableContent(prev => ({
        ...prev,
        sec_hero: heroData
      }));
      
      setOriginalContent(prev => ({
        ...prev,
        sec_hero: heroData
      }));
      
      console.log('✅ Conteúdo extraído salvo no banco!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar conteúdo extraído:', error);
    }
  };

  // Tornar elementos editáveis (SIMPLIFICADO: apenas hero com data-field)
  const makeElementsEditable = (doc: Document) => {
    let editableCount = 0;

    // APENAS elementos com data-field na hero
    Object.keys(HERO_FIELD_MAP).forEach((fieldType) => {
      const element = doc.querySelector(`[data-field="${fieldType}"]`) as HTMLElement;
      if (element) {
        editableCount++;
        const textContent = element.textContent?.trim() || '';
        
        // Configurar elemento editável
        element.classList.add('editable-text');
        element.contentEditable = 'true';
        element.setAttribute('data-field-type', fieldType);
        element.setAttribute('data-original-text', textContent);
        
        // Event listeners
        element.addEventListener('input', handleTextInput);
        element.addEventListener('blur', handleTextBlur);
        element.addEventListener('keydown', handleKeyDown);
        
        console.log(`✅ Elemento hero editável: ${fieldType}`);
      }
    });

    console.log(`✅ ${editableCount} elementos da hero tornados editáveis!`);
  };

  // Detectar seção do elemento (CORRIGIDO: priorizar posição visual)
  const detectSectionForElement = (element: Element): string => {
    // 1. PRIMEIRO: Detectar por estrutura/posição visual na página
    const rect = element.getBoundingClientRect();
    const scrollTop = element.ownerDocument?.documentElement.scrollTop || 0;
    const absoluteTop = rect.top + scrollTop;
    const windowHeight = element.ownerDocument?.defaultView?.innerHeight || 1000;
    
    // 2. Detectar por containers pais específicos (mais confiável)
    const heroContainer = element.closest('[class*="hero"], section:first-of-type, .hero-section, #hero');
    if (heroContainer) return 'sec_hero';
    
    const aboutContainer = element.closest('[class*="about"], [id*="about"], .about-section');
    if (aboutContainer && !heroContainer) return 'sec_about_course';
    
    const mentorContainer = element.closest('[class*="mentor"], [id*="mentor"], .mentor-section');
    if (mentorContainer) return 'sec_about_mentor';
    
    const resultsContainer = element.closest('[class*="result"], [id*="result"], .results-section');
    if (resultsContainer) return 'sec_results';
    
    const testimonialsContainer = element.closest('[class*="testimonial"], [id*="testimonial"], .testimonials-section');
    if (testimonialsContainer) return 'sec_testimonials';
    
    const curriculumContainer = element.closest('[class*="curriculum"], [id*="curriculum"], [class*="module"], .curriculum-section');
    if (curriculumContainer) return 'sec_curriculum';
    
    const bonusContainer = element.closest('[class*="bonus"], [id*="bonus"], .bonus-section');
    if (bonusContainer) return 'sec_bonus';
    
    const pricingContainer = element.closest('[class*="pricing"], [id*="pricing"], [class*="price"], .pricing-section');
    if (pricingContainer) return 'sec_pricing';
    
    const faqContainer = element.closest('[class*="faq"], [id*="faq"], .faq-section');
    if (faqContainer) return 'sec_faq';
    
    const ctaContainer = element.closest('[class*="cta"], [id*="cta"], .cta-section');
    if (ctaContainer) return 'sec_final_cta';
    
    // 3. Detectar por posição vertical na página (fallback confiável)
    if (absoluteTop < windowHeight * 1.2) return 'sec_hero';           // Primeira tela = hero
    if (absoluteTop < windowHeight * 2.0) return 'sec_about_course';   // Segunda tela = about course  
    if (absoluteTop < windowHeight * 3.0) return 'sec_about_mentor';   // Terceira tela = mentor
    if (absoluteTop < windowHeight * 4.0) return 'sec_results';        // Quarta tela = resultados
    if (absoluteTop < windowHeight * 5.0) return 'sec_testimonials';   // Quinta tela = depoimentos
    if (absoluteTop < windowHeight * 6.0) return 'sec_curriculum';     // Sexta tela = currículo
    if (absoluteTop < windowHeight * 7.0) return 'sec_bonus';          // Sétima tela = bônus
    if (absoluteTop < windowHeight * 8.0) return 'sec_pricing';        // Oitava tela = preços
    if (absoluteTop < windowHeight * 9.0) return 'sec_faq';            // Nona tela = FAQ
    
    // 4. ÚLTIMO RECURSO: Detectar por conteúdo (apenas como fallback)
    const text = element.textContent?.toLowerCase() || '';
    const classes = element.className?.toLowerCase() || '';
    
    if (text.includes('mentor') || text.includes('instrutor') || classes.includes('mentor')) return 'sec_about_mentor';
    if (text.includes('depoimento') || text.includes('testemunho') || classes.includes('testimonial')) return 'sec_testimonials';
    if (text.includes('módulo') || text.includes('currículo') || text.includes('conteúdo') || classes.includes('curriculum')) return 'sec_curriculum';
    if (text.includes('bônus') || text.includes('extra') || classes.includes('bonus')) return 'sec_bonus';
    if (text.includes('preço') || text.includes('r$') || text.includes('investimento') || classes.includes('price')) return 'sec_pricing';
    if (text.includes('faq') || text.includes('pergunta') || text.includes('dúvida')) return 'sec_faq';
    if (element.tagName === 'BUTTON' || classes.includes('cta') || text.includes('inscreva')) return 'sec_final_cta';
    
    // Default: CTA final se chegou até aqui
    return 'sec_final_cta';
  };

  // Handler para duplo clique
  const handleDoubleClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const element = event.target as HTMLElement;
    element.classList.add('editing');
    element.focus();
    
    // Selecionar todo o texto
    const selection = element.ownerDocument?.defaultView?.getSelection();
    const range = element.ownerDocument?.createRange();
    if (selection && range) {
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    console.log('✏️ Iniciando edição:', element.textContent);
  };

  // Handler para input de texto (ATUALIZADO para preservar formatação)
  const handleTextInput = (event: Event) => {
    const element = event.target as HTMLElement;
    const section = element.getAttribute('data-section') || 'sec_hero';
    const fieldType = element.getAttribute('data-field-type') || 'description';
    
    // IMPORTANTE: Preservar apenas o texto, não HTML
    const newText = element.textContent || '';
    
    // Atualizar campo específico na estrutura
    setEditableContent(prev => {
      const sectionContent = prev[section] || {};
      const element1 = sectionContent['element_1'] || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionContent,
          element_1: {
            ...element1,
            [fieldType]: newText,
            extractedAt: element1.extractedAt || new Date().toISOString(),
            position: element1.position || 0,
            className: element1.className || ''
          }
        }
      };
    });
    
    setHasUnsavedChanges(true);
    element.classList.add('saving');
    
    // Limpar timeout anterior se existir
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };

  // Handler para blur (sair do foco) - SEM SALVAR AUTOMATICAMENTE
  const handleTextBlur = (event: Event) => {
    const element = event.target as HTMLElement;
    element.classList.remove('editing', 'saving');
  };

  // Handler para teclas
  const handleKeyDown = (event: KeyboardEvent) => {
    // Enter = sair da edição
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      (event.target as HTMLElement).blur();
    }
    
    // Escape = cancelar edição
    if (event.key === 'Escape') {
      event.preventDefault();
      const element = event.target as HTMLElement;
      const originalText = element.getAttribute('data-original-text') || '';
      element.textContent = originalText;
      element.blur();
    }
  };

  // Handler para salvar edições (chamado pelo botão)
  const handleSaveEditedContent = async () => {
    try {
      await saveEditedContent();
      console.log('✅ Edições salvas pelo botão!');
      alert('Edições salvas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar edições:', error);
      alert('Erro ao salvar edições. Tente novamente.');
    }
  };

  // Handler para toggle do modo de edição (com modal)
  const handleToggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      // Mostrar modal de confirmação
      setModalAction('exit');
      setShowSaveModal(true);
    } else {
      // Alternar modo sem confirmação
      toggleEditMode();
    }
  };

  // Toggle modo de edição com confirmação
  const toggleEditMode = async () => {
    if (isEditMode) {
      // Sair do modo de edição
      setIsEditMode(false);
      setHasUnsavedChanges(false);
    } else {
      // Entrando no modo de edição
      setIsEditMode(true);
      setHasUnsavedChanges(false);
      // Salvar estado atual como original
      setOriginalContent({ ...editableContent });
    }
  };

  // Salvar conteúdo editado
  const saveEditedContent = async () => {
    if (!landingPageId || Object.keys(editableContent).length === 0) return;

    try {
      console.log('💾 Salvando edições inline...', editableContent);
      
      const { error } = await supabase
        .from('course_landing_pages')
        .update({
          ...editableContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPageId);

      if (error) throw error;

      // Atualizar conteúdo original após salvar com sucesso
      setOriginalContent({ ...editableContent });
      setHasUnsavedChanges(false);
      
      // Aplicar mudanças de volta à página
      applyChangesToPage();
      
      console.log('✅ Edições salvas e aplicadas à página!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar edições:', error);
      throw error;
    }
  };

  // NOVO: Aplicar mudanças preservando formatação CSS
  const applyChangesToPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    // Aplicar apenas para campos da hero
    Object.entries(HERO_FIELD_MAP).forEach(([fieldType, selector]) => {
      try {
        const element = doc.querySelector(selector) as HTMLElement;
        if (element && editableContent.sec_hero?.element_1?.[fieldType]) {
          const newText = editableContent.sec_hero.element_1[fieldType];
          
          // PRESERVAR formatação: atualizar apenas textContent
          element.textContent = newText;
          element.setAttribute('data-original-text', newText);
          element.classList.remove('editing', 'saving');
          
          console.log(`✅ Aplicado ${fieldType}: "${newText}"`);
        }
      } catch (error) {
        console.error(`❌ Erro ao aplicar ${fieldType}:`, error);
      }
    });
    
    console.log('🔄 Mudanças aplicadas preservando CSS');
  };

  // NOVO: Restaurar texto original preservando formatação
  const restoreOriginalTextInPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    Object.entries(HERO_FIELD_MAP).forEach(([fieldType, selector]) => {
      try {
        const element = doc.querySelector(selector) as HTMLElement;
        if (element) {
          // Restaurar do conteúdo original ou fallback
          const originalText = originalContent.sec_hero?.element_1?.[fieldType] || 
                             element.getAttribute('data-original-text') || '';
          
          element.textContent = originalText;
          element.setAttribute('data-original-text', originalText);
          element.classList.remove('editing', 'saving');
        }
      } catch (error) {
        console.error(`❌ Erro ao restaurar ${fieldType}:`, error);
      }
    });
    
    console.log('🔄 Texto original restaurado preservando CSS');
  };

  // NOVO: Carregar e aplicar conteúdo salvo preservando formatação
  const loadSavedContentToPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    Object.entries(HERO_FIELD_MAP).forEach(([fieldType, selector]) => {
      try {
        const element = doc.querySelector(selector) as HTMLElement;
        if (element && editableContent.sec_hero?.element_1?.[fieldType]) {
          const savedText = editableContent.sec_hero.element_1[fieldType];
          element.textContent = savedText;
          element.setAttribute('data-original-text', savedText);
          console.log(`📝 Carregado ${fieldType}: "${savedText}"`);
        }
      } catch (error) {
        console.error(`❌ Erro ao carregar ${fieldType}:`, error);
      }
    });
    
    console.log('📄 Conteúdo salvo carregado preservando CSS');
  };

  // Função para fechar a página
  const handleClosePage = async () => {
    // Se estiver no modo de edição com alterações, mostrar modal
    if (isEditMode && hasUnsavedChanges) {
      setModalAction('close');
      setShowSaveModal(true);
      return;
    }
    
    navigate('/mentor/cursos');
  };

  // Indicadores visuais
  const showSavingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'saving-indicator show';
    indicator.innerHTML = '💾 Salvando...';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 2000);
  };

  const showSuccessIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'saving-indicator success show';
    indicator.innerHTML = '✅ Salvo!';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 2000);
  };

  const showErrorIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'saving-indicator error show';
    indicator.innerHTML = '❌ Erro ao salvar';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 3000);
  };

  const showAnalyzingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'saving-indicator analyzing show';
    indicator.innerHTML = '🤖 Analisando página...';
    document.body.appendChild(indicator);
    
    return indicator; // Retorna para poder remover depois
  };

  const showAnalysisCompleteIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'saving-indicator success show';
    indicator.innerHTML = '🎉 Análise concluída!';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 3000);
  };

  // Aplicar apenas estilos quando modo de edição muda
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      console.log(`🔄 useEffect modo edição: ${isEditMode ? 'ATIVADO' : 'DESATIVADO'}`);
      
      setTimeout(() => {
        initializeEditMode();
        
        // Se entrou no modo de edição, carregar conteúdo salvo
        if (isEditMode) {
          loadSavedContentToPage();
          
          // Debug: verificar elementos encontrados
          setTimeout(() => {
            const doc = iframeRef.current?.contentDocument;
            if (doc) {
              const editableElements = doc.querySelectorAll('.editable-text');
              const dataFieldElements = doc.querySelectorAll('[data-field]');
              
              console.log(`🔍 Debug Modo Edição:`);
              console.log(`   - Elementos editáveis: ${editableElements.length}`);
              console.log(`   - Elementos com data-field: ${dataFieldElements.length}`);
              
              if (editableElements.length === 0 && dataFieldElements.length === 0) {
                console.warn('⚠️ Nenhum elemento encontrado! Verificando página...');
                
                // Listar alguns elementos da página para debug
                const allElements = doc.querySelectorAll('h1, h2, h3, p, button, .title, .subtitle');
                console.log(`📄 Elementos disponíveis na página: ${allElements.length}`);
                allElements.forEach((el, i) => {
                  if (i < 5) { // Mostrar apenas os 5 primeiros
                    console.log(`   ${i+1}. ${el.tagName}: "${el.textContent?.substring(0, 50)}..."`);
                  }
                });
              }
            }
          }, 200);
        }
      }, 150); // Aumentar delay para garantir que iframe carregou
    } else {
      console.log('⚠️ useEffect: iframe ou documento não disponível ainda');
    }
  }, [isEditMode, editableContent]); // Adicionar editableContent como dependência

  // Handler quando iframe carrega
  const handleIframeLoad = () => {
    setTimeout(async () => {
      console.log('🎯 Iframe carregado - iniciando extração automática...');
      
      // CORRIGIDO: Passar Page ID para o iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow && landingPageId) {
        try {
          // Método 1: Definir variável global no iframe
          iframe.contentWindow.postMessage({
            type: 'SET_LANDING_PAGE_ID',
            pageId: landingPageId
          }, '*');
          
          // Método 2: Definir diretamente se a função existir
          const contentWindow = iframe.contentWindow as any;
          if (contentWindow.setLandingPageId) {
            contentWindow.setLandingPageId(landingPageId);
          }
          
          // Método 3: Definir variável global
          if (iframe.contentDocument) {
            (iframe.contentDocument.defaultView as any).landingPageId = landingPageId;
          }
          
          console.log(`🆔 Page ID enviado para iframe: ${landingPageId}`);
        } catch (error) {
          console.error('❌ Erro ao definir Page ID no iframe:', error);
        }
      }
      
      // Extrair conteúdo da página
      const extractedContent = extractContentFromPage();
      
      if (extractedContent) {
        // Verificar se já tem conteúdo salvo no banco
        const hasExistingContent = editableContent.sec_hero && 
                                 Object.keys(editableContent.sec_hero).length > 0 &&
                                 editableContent.sec_hero.element_1 &&
                                 Object.keys(editableContent.sec_hero.element_1).some(key => 
                                   key !== 'position' && key !== 'className' && key !== 'extractedAt'
                                 );
        
        if (!hasExistingContent) {
          // Primeira vez carregando - salvar conteúdo extraído
          console.log('📊 Primeira extração - salvando no banco...');
          await saveExtractedContent(extractedContent);
        } else {
          // Já tem conteúdo - apenas aplicar o salvo à página
          console.log('📄 Conteúdo já existe - aplicando salvo...');
          setTimeout(() => {
            loadSavedContentToPage();
          }, 100);
        }
      }
      
      // Inicializar modo de edição se ativo
      initializeEditMode();
    }, 300);
  };

  // Handler para confirmar/cancelar no modal
  const handleModalSave = async () => {
    try {
      await saveEditedContent();
      setShowSaveModal(false);
      
      if (modalAction === 'exit') {
        setIsEditMode(false);
        setHasUnsavedChanges(false);
      } else if (modalAction === 'close') {
        navigate('/mentor/cursos');
      }
      
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const handleModalDiscard = () => {
    setEditableContent(originalContent);
    restoreOriginalTextInPage();
    setShowSaveModal(false);
    setHasUnsavedChanges(false);
    
    if (modalAction === 'exit') {
      setIsEditMode(false);
    } else if (modalAction === 'close') {
      navigate('/mentor/cursos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com seleção de modelos */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Título */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Página de Vendas</h1>
              <p className="text-gray-600">{courseData?.title || 'Carregando...'}</p>
            </div>

            {/* Botões de Modelo */}
            <div className="flex items-center gap-3">
              {selectedTemplate === null ? (
                // Loading state para botões
                <div className="flex gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
                  ))}
        </div>
              ) : (
                templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="relative"
                    disabled={isEditMode || isAnalyzing}
                  >
                    {template.name}
                    {activeTemplate === template.id && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-green-100 text-green-800 text-xs"
                      >
                        ✓
                      </Badge>
                    )}
                  </Button>
                ))
              )}
              
              {/* Botão Salvar Template */}
              <Button
                onClick={handleSaveTemplate}
                disabled={isLoading || selectedTemplate === activeTemplate || isEditMode || isAnalyzing || selectedTemplate === null}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>

              {/* Botão Salvar Edições (NOVO) */}
              {isEditMode && (
                <Button 
                  onClick={handleSaveEditedContent}
                  disabled={!hasUnsavedChanges || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Edições
                </Button>
              )}

              {/* Botão Analisar Página (Robozinho) */}
                    <Button
                onClick={analyzePageContent}
                disabled={isAnalyzing || isEditMode || selectedTemplate === null}
                className="bg-green-600 hover:bg-green-700"
                title="Analisar página e extrair conteúdo automaticamente"
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    🤖 Extrair Textos
                  </>
                      )}
                    </Button>

              {/* Botão Modo de Edição */}
                <Button
                onClick={handleToggleEditMode}
                variant={isEditMode ? "destructive" : "outline"}
                className={isEditMode ? "bg-orange-600 hover:bg-orange-700" : ""}
                disabled={isAnalyzing || selectedTemplate === null}
              >
                {isEditMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditMode ? 'Sair da Edição' : 'Modo Edição'}
              </Button>

              {/* Botão Debug (Temporário) */}
              {isEditMode && (
                <Button 
                  onClick={() => {
                    const iframe = iframeRef.current;
                    if (iframe && iframe.contentDocument) {
                      const doc = iframe.contentDocument;
                      
                      console.log('🔍 DEBUG MANUAL:');
                      
                      // Verificar elementos com data-field
                      const dataFields = doc.querySelectorAll('[data-field]');
                      console.log(`📋 Elementos com data-field: ${dataFields.length}`);
                      dataFields.forEach((el, i) => {
                        console.log(`  ${i+1}. [data-field="${el.getAttribute('data-field')}"]: "${el.textContent?.substring(0, 30)}..."`);
                      });
                      
                      // Verificar elementos editáveis
                      const editables = doc.querySelectorAll('.editable-text');
                      console.log(`✏️ Elementos editáveis: ${editables.length}`);
                      
                      // Forçar criação de elementos editáveis se não houver
                      if (editables.length === 0) {
                        console.log('🔧 Forçando criação de elementos editáveis...');
                        makeElementsEditable(doc);
                      }
                      
                      // Verificar elementos genéricos
                      const generic = doc.querySelectorAll('h1, h2, h3, p, button');
                      console.log(`📄 Elementos genéricos: ${generic.length}`);
                      generic.forEach((el, i) => {
                        if (i < 3) {
                          console.log(`  ${i+1}. ${el.tagName}: "${el.textContent?.substring(0, 30)}..."`);
                        }
                      });
                      
                      alert(`Debug concluído! Veja o console para detalhes.\n\nResumo:\n- Data-fields: ${dataFields.length}\n- Editáveis: ${editables.length}\n- Elementos: ${generic.length}`);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  🔍 Debug
                </Button>
              )}

              {/* Indicador de análise */}
              {isAnalyzing && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  🤖 Analisando...
                </Badge>
              )}

              {/* Botão Fechar */}
                <Button
                onClick={handleClosePage}
                variant="ghost"
                  size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Fechar e voltar aos cursos"
                >
                <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Banner de modo de edição */}
      {isEditMode && (
        <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
          <div className="container mx-auto">
            <p className="text-orange-800 text-sm">
              🎯 <strong>Modo de Edição Ativo!</strong> Visualize a página em modo de edição.
            </p>
          </div>
        </div>
      )}

      {/* Banner de análise */}
      {isAnalyzing && (
        <div className="bg-blue-100 border-b border-blue-200 px-4 py-2">
          <div className="container mx-auto">
            <p className="text-blue-800 text-sm">
              🤖 <strong>Robô Analisando!</strong> Extraindo e organizando o conteúdo da página nas 10 seções... 
              <span className="animate-pulse">●●●</span>
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo da Landing Page */}
      <div className="w-full">
        {isPageLoading || selectedTemplate === null ? (
          // Loading state para evitar flash de template errado
          <div 
            className="w-full flex items-center justify-center bg-gray-100"
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {selectedTemplate === null ? 'Carregando configuração...' : 'Carregando página de vendas...'}
              </p>
              {selectedTemplate && (
                <p className="text-sm text-gray-500">Template: {selectedTemplate}</p>
              )}
            </div>
          </div>
        ) : (
            <iframe
            ref={iframeRef}
            src={selectedTemplate === 'modelo3' 
              ? `/components/landing-modelo3/sections/model3_sec_hero.html`
              : `/landing-page-${selectedTemplate}-completa.html`
            }
            className="w-full border-0"
            title={`Landing Page - ${templates.find(t => t.id === selectedTemplate)?.name}`}
            style={{ height: 'calc(100vh - 120px)' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={handleIframeLoad}
            key={`iframe-${selectedTemplate}`} // Força re-render quando template muda
            />
          )}
        </div>

      {/* Modal de Confirmação Bonito */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <Save className="h-6 w-6 text-yellow-600" />
      </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Deseja salvar suas alterações?
              </h3>
              
              <p className="text-sm text-gray-500 mb-6">
                Você fez alterações no conteúdo. Escolha uma opção abaixo.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleModalSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sim, Salvar
                </Button>
                
                <Button
                  onClick={handleModalDiscard}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Não, Descartar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLandingPage; 