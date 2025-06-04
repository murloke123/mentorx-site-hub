import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, EyeOff, X } from "lucide-react";
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
          
          console.log('📦 Conteúdo carregado:', Object.keys(content).length, 'seções');
        } else {
          // Não existe landing page, criar uma nova
          console.log('🆕 Criando nova landing page...');
          const mentorId = course.mentor_id;
          if (mentorId) {
            await initializeLandingPage(courseId, mentorId);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      } finally {
        // Delay para evitar flash de template errado
        setTimeout(() => {
          setIsPageLoading(false);
        }, 300);
      }
    };

    loadData();
  }, [courseId]);

  // Efeito para mudança de template
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== activeTemplate) {
      console.log(`🔄 Template mudou de ${activeTemplate} para ${selectedTemplate}`);
      setIsPageLoading(true);
      
      // Delay para garantir carregamento suave
      setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
    }
  }, [selectedTemplate]);

  const initializeLandingPage = async (courseId: string, mentorId: string) => {
    try {
      console.log('🚀 Inicializando landing page...');
      
      // Primeiro, verificar se já existe uma landing page
      const { data: existingPage } = await supabase
        .from('course_landing_pages')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (existingPage) {
        console.log('✅ Landing page já existe, usando existente');
        setLandingPageId(existingPage.id);
        setSelectedTemplate(existingPage.template_type);
        setActiveTemplate(existingPage.template_type);
        return;
      }

      // Criar nova landing page com template modelo1 como padrão
      const { data: newPage, error } = await supabase
        .from('course_landing_pages')
        .insert([
          {
            course_id: courseId,
            mentor_id: mentorId,
            template_type: 'modelo1',
            is_active: true,
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
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Nova landing page criada com ID:', newPage.id);
      setLandingPageId(newPage.id);
      setSelectedTemplate('modelo1');
      setActiveTemplate('modelo1');
      
      // Inicializar conteúdo vazio
      const emptyContent = {
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
      };
      
      setEditableContent(emptyContent);
      setOriginalContent(emptyContent);

    } catch (error) {
      console.error('❌ Erro ao inicializar landing page:', error);
    }
  };

  const handleSaveTemplate = async () => {
    if (!landingPageId || !selectedTemplate) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('course_landing_pages')
        .update({ 
          template_type: selectedTemplate,
          updated_at: new Date().toISOString() 
        })
        .eq('id', landingPageId);

      if (error) throw error;

      setActiveTemplate(selectedTemplate);
      console.log('✅ Template salvo:', selectedTemplate);
      
    } catch (error) {
      console.error('❌ Erro ao salvar template:', error);
    } finally {
      setIsLoading(false);
    }
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
          }
        `;
        doc.head.appendChild(style);
      }

      // Tornar elementos editáveis
      makeElementsEditable(doc);
      
      // Adicionar indicador de modo de edição
      let indicator = doc.querySelector('.edit-indicator');
      if (!indicator) {
        indicator = doc.createElement('div');
        indicator.className = 'edit-indicator';
        indicator.textContent = '✏️ Modo de Edição Ativo';
        doc.body.appendChild(indicator);
      }
      
    } else {
      // Remover estilos de edição
      const style = doc.querySelector('#edit-mode-styles');
      if (style) style.remove();

      // Remover classes de edição
      const editableElements = doc.querySelectorAll('.editable-text');
      editableElements.forEach(el => {
        el.classList.remove('editable-text', 'editing');
        el.removeAttribute('contenteditable');
        el.removeEventListener('input', handleTextInput);
        el.removeEventListener('blur', handleTextBlur);
        el.removeEventListener('keydown', handleKeyDown);
      });

      // Remover indicador
      const indicator = doc.querySelector('.edit-indicator');
      if (indicator) indicator.remove();
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

  // Handler para duplo clique
  const handleDoubleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('editable-text')) {
      target.classList.add('editing');
      target.focus();
    }
  };

  // Handler para entrada de texto
  const handleTextInput = (event: Event) => {
    const target = event.target as HTMLElement;
    setHasUnsavedChanges(true);
    
    // Auto-save com debounce
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      console.log('💾 Auto-salvando mudanças...');
      saveEditedContent();
    }, 2000); // 2 segundos de debounce
  };

  // Handler para sair do foco (blur)
  const handleTextBlur = (event: Event) => {
    const target = event.target as HTMLElement;
    target.classList.remove('editing');
    
    // Salvar imediatamente ao sair do campo
    if (hasUnsavedChanges) {
      console.log('💾 Salvando ao sair do campo...');
      saveEditedContent();
    }
  };

  // Handler para teclas
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      (event.target as HTMLElement).blur();
    }
    
    if (event.key === 'Escape') {
      (event.target as HTMLElement).blur();
    }
  };

  // Salvar conteúdo editado
  const handleSaveEditedContent = async () => {
    try {
      await saveEditedContent();
      showSuccessIndicator();
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      showErrorIndicator();
    }
  };

  // Toggle do modo de edição
  const handleToggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      setShowSaveModal(true);
      setModalAction('exit');
    } else {
      toggleEditMode();
    }
  };

  const toggleEditMode = async () => {
    setIsEditMode(!isEditMode);
    console.log(`🎯 Modo de edição: ${!isEditMode ? 'ATIVADO' : 'DESATIVADO'}`);
    
    // Se saindo do modo de edição, garantir que mudanças sejam aplicadas
    if (isEditMode) {
      setTimeout(() => {
        applyChangesToPage();
      }, 100);
    }
  };

  // Salvar mudanças editadas
  const saveEditedContent = async () => {
    if (!landingPageId || !hasUnsavedChanges) return;

    try {
      console.log('💾 Salvando conteúdo editado...');
      
      // Extrair conteúdo dos elementos editáveis no iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const updatedContent = { ...editableContent };
        
        // Extrair apenas conteúdo da hero por enquanto
        Object.keys(HERO_FIELD_MAP).forEach((fieldType) => {
          const element = iframe.contentDocument!.querySelector(`[data-field="${fieldType}"]`);
          if (element) {
            const content = element.innerHTML.trim();
            if (!updatedContent.sec_hero) updatedContent.sec_hero = {};
            if (!updatedContent.sec_hero.element_1) updatedContent.sec_hero.element_1 = {};
            updatedContent.sec_hero.element_1[fieldType] = content;
          }
        });

        // Salvar no banco
        const { error } = await supabase
          .from('course_landing_pages')
          .update({
            ...updatedContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', landingPageId);

        if (error) throw error;

        setEditableContent(updatedContent);
        setOriginalContent(updatedContent);
        setHasUnsavedChanges(false);
        
        console.log('✅ Conteúdo salvo com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar conteúdo:', error);
      throw error;
    }
  };

  // Aplicar mudanças à página
  const applyChangesToPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    console.log('📝 Aplicando mudanças à página...');
    
    // Aplicar conteúdo salvo aos elementos
    Object.keys(HERO_FIELD_MAP).forEach((fieldType) => {
      const element = iframe.contentDocument!.querySelector(`[data-field="${fieldType}"]`);
      const savedContent = editableContent.sec_hero?.element_1?.[fieldType];
      
      if (element && savedContent) {
        element.innerHTML = savedContent;
        console.log(`✅ Aplicado ${fieldType}:`, savedContent.substring(0, 50) + '...');
      }
    });
  };

  // Restaurar conteúdo original
  const restoreOriginalTextInPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    console.log('🔄 Restaurando texto original...');
    
    // Restaurar texto original dos elementos editáveis
    const editableElements = iframe.contentDocument.querySelectorAll('.editable-text');
    editableElements.forEach((element) => {
      const originalText = element.getAttribute('data-original-text');
      if (originalText) {
        element.textContent = originalText;
      }
    });
  };

  // Carregar conteúdo salvo para a página
  const loadSavedContentToPage = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    console.log('📥 Carregando conteúdo salvo para a página...');
    
    // Aplicar conteúdo salvo da hero
    if (editableContent.sec_hero?.element_1) {
      Object.keys(HERO_FIELD_MAP).forEach((fieldType) => {
        const element = iframe.contentDocument!.querySelector(`[data-field="${fieldType}"]`);
        const savedContent = editableContent.sec_hero.element_1[fieldType];
        
        if (element && savedContent) {
          element.innerHTML = savedContent;
          console.log(`✅ Carregado ${fieldType}:`, savedContent.substring(0, 50) + '...');
        }
      });
    }
  };

  // Handler para fechar página
  const handleClosePage = async () => {
    if (hasUnsavedChanges) {
      setShowSaveModal(true);
      setModalAction('close');
    } else {
      navigate('/mentor/cursos');
    }
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
    indicator.innerHTML = '✅ Salvo com sucesso!';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 3000);
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
      console.log('🎯 Iframe carregado...');
      
      // CORRIGIDO: Passar Page ID para o iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow && landingPageId) {
        try {
          // Método 1: Definir variável global no iframe
          iframe.contentWindow.postMessage({
            type: 'SET_LANDING_PAGE_ID',
            pageId: landingPageId,
            isPublicView: false // Sempre false no modo de edição
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
                    disabled={isEditMode}
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

              {/* Botão Aplicar Modelo */}
              <Button
                onClick={handleSaveTemplate}
                disabled={isLoading || selectedTemplate === activeTemplate || isEditMode || selectedTemplate === null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Aplicando...' : 'Aplicar Modelo'}
              </Button>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              {/* Botão Toggle Modo Edição */}
              <Button
                onClick={handleToggleEditMode}
                variant={isEditMode ? "default" : "outline"}
                className={isEditMode ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                {isEditMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditMode ? 'Sair da Edição' : 'Editar Textos'}
              </Button>

              {/* Botão Salvar Edições */}
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
              🎯 <strong>Modo de Edição Ativo!</strong> Clique nos textos para editá-los diretamente.
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