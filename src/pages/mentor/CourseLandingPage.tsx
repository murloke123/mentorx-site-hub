import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, EyeOff, X, Download } from "lucide-react";
import '../../styles/inline-editor.css';
import { extractYogalaxContent } from '@/utils/extractYogalaxContent';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface EditableContent {
  [key: string]: any;
}

interface LayoutOption {
  id: string;
  name: string;
  description: string;
  source: string; // Path para o arquivo HTML
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

// MAPEAMENTO COMPLETO DE CAMPOS (field1 até field97):
// field1-18: Seções iniciais (navbar, hero, benefícios, serviços)
// field19-32: Seção de Jornadas Espirituais (6 programas)
// field33-64: Seção de Planos de Investimento (3 planos completos)
// field65-81: Seção de Depoimentos (5 depoimentos completos)
// field82-85: Seção de Estatísticas (4 contadores)
// field86-93: Seção de Blog/Reflexões (3 artigos)
// field94-95: Seção de Galeria
// field96-97: Footer (logo e endereço)

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

const layouts: LayoutOption[] = [
  {
    id: 'desenvolvimento_pessoal',
    name: 'Desenvolvimento Pessoal',
    description: 'Layout ideal para cursos de yoga, mindfulness e desenvolvimento pessoal',
    source: '/layouts/yogalax-master/index.html'
  },
  // Futuramente podemos adicionar mais layouts aqui
];

const CourseLandingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [landingPageId, setLandingPageId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(true);
  const [editableContent, setEditableContent] = useState<EditableContent>({});
  const [originalContent, setOriginalContent] = useState<EditableContent>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
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
          console.log('✅ Landing page encontrada:', existingPage.id);
          
          setLandingPageId(existingPage.id);
          
          // Verificar se há layout personalizado
          const layoutName = (existingPage as any).layout_name;
          
          if (layoutName) {
            console.log('🎨 Layout personalizado encontrado:', layoutName);
            
            // Encontrar o layout correspondente
            const matchingLayout = layouts.find(l => l.name === layoutName);
            if (matchingLayout) {
              setSelectedLayout(matchingLayout.id);
              console.log('📋 Layout aplicado:', matchingLayout.id);
              
              // Ativar edição automaticamente
              setIsEditMode(true);
              console.log('✏️ Modo de edição ativado automaticamente');
            }
          }
          
          // Usar layout_body como conteúdo editável
          const layoutBody = (existingPage as any).layout_body || {};
          setEditableContent(layoutBody);
          setOriginalContent(layoutBody);
          
          console.log('📦 Layout body carregado:', Object.keys(layoutBody).length, 'campos');
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

  // Efeito removido - não precisamos mais de template

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
        return;
      }

      // Criar nova landing page simples (usando any para contornar tipos antigos)
      const { data: newPage, error } = await (supabase as any)
        .from('course_landing_pages')
        .insert([
          {
            course_id: courseId,
            is_active: true,
            layout_name: null,
            layout_body: {}
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Nova landing page criada com ID:', newPage.id);
      setLandingPageId(newPage.id);
      
      // Inicializar conteúdo vazio
      const emptyContent = {};
      
      setEditableContent(emptyContent);
      setOriginalContent(emptyContent);

    } catch (error) {
      console.error('❌ Erro ao inicializar landing page:', error);
    }
  };

  // Função handleSaveTemplate removida - não precisamos mais de templates

  // Modo de edição inline funcional
  const initializeEditMode = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    if (isEditMode && isEditingMode) { // Só permite edição se ambos estiverem ativos
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
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2) !important;
            transform: scale(1.005) !important;
          }
        `;
        doc.head.appendChild(style);
      }

      // Tornar elementos editáveis
      makeElementsEditable(doc);
    } else {
      // Remover estilos e edição
      const style = doc.querySelector('#edit-mode-styles');
      if (style) {
        style.remove();
      }
      
      // Remover classes e eventos de edição
      const editableElements = doc.querySelectorAll('.editable-text');
      editableElements.forEach(element => {
        element.classList.remove('editable-text');
        element.removeAttribute('contenteditable');
        // Remover listeners (será recriado quando necessário)
      });
    }
  };

  // Tornar elementos editáveis (usando apenas data-field mapeados no HTML)
  const makeElementsEditable = (doc: Document) => {
    if (!isEditingMode) return; // Só tornar editável se estiver em modo de edição

    // Selecionar elementos com data-field (mapeamento fixo)
    const elements = doc.querySelectorAll('[data-field]');
    
    console.log(`📝 Tornando ${elements.length} elementos editáveis`);
    
    elements.forEach(element => {
      element.classList.add('editable-text');
      element.setAttribute('contenteditable', 'true');
      
      // Event listeners para edição
      element.addEventListener('input', handleTextInput);
      element.addEventListener('blur', handleTextBlur);
      element.addEventListener('keydown', handleKeyDown);
    });
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
    console.log('✏️ Texto alterado - aguardando salvamento manual');
  };

  // Handler para sair do foco (blur)
  const handleTextBlur = (event: Event) => {
    const target = event.target as HTMLElement;
    target.classList.remove('editing');
    console.log('👁️ Saiu do campo - salvamento manual necessário');
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

  // Função utilitária para extrair texto puro do HTML
  const extractTextOnly = (htmlContent: string): string => {
    // Criar um elemento temporário para extrair apenas o texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Função para obter elementos editáveis de forma consistente
  const getEditableElements = (doc: Document) => {
    // USAR APENAS elementos com data-field (mapeados no HTML)
    const dataFieldElements = doc.querySelectorAll('[data-field]');
    console.log(`🎯 Elementos com data-field encontrados: ${dataFieldElements.length}`);
    return dataFieldElements;
  };

  // Salvar mudanças editadas
  const saveEditedContent = async () => {
    if (!landingPageId) return;

    try {
      console.log('💾 Salvando conteúdo editado...');
      showSavingIndicator();
      
      // Extrair conteúdo dos elementos editáveis no iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const textContent: any = {};
        
        // USAR APENAS elementos com data-field (mapeados fixos no HTML)
        const editableElements = getEditableElements(iframe.contentDocument);
        let fieldCount = 0;
        
        console.log(`🎯 Elementos encontrados para salvamento: ${editableElements.length}`);
        
        editableElements.forEach((element) => {
          const dataField = element.getAttribute('data-field');
          if (!dataField) return;
          
          const htmlContent = element.innerHTML.trim();
          const textOnly = extractTextOnly(htmlContent);
          
          if (textOnly.length > 0) {
            // Salvar usando o data-field como chave
            textContent[dataField] = textOnly;
            fieldCount++;
            
            console.log(`📝 Salvando ${dataField}: "${textOnly}" de ${element.tagName}`);
          }
        });

        console.log(`📊 Total de campos salvos: ${fieldCount}`);

        // Preparar dados para salvar no banco
        const updateData: any = {
          layout_body: textContent,
          updated_at: new Date().toISOString()
        };

        // Se há um layout selecionado, salvar as informações do layout
        if (selectedLayout) {
          const layout = layouts.find(l => l.id === selectedLayout);
          if (layout) {
            updateData.layout_name = layout.name;
            console.log('💾 Salvando layout selecionado:', layout.name);
          }
        }

        console.log('📦 Dados a serem salvos:', updateData);

        // Salvar no banco
        const { error } = await (supabase as any)
          .from('course_landing_pages')
          .update(updateData)
          .eq('id', landingPageId);

        if (error) {
          console.error('❌ Erro do banco:', error);
          throw error;
        }

        setEditableContent(textContent);
        setOriginalContent(textContent);
        setHasUnsavedChanges(false);
        
        console.log('✅ Conteúdo salvo com sucesso no banco!');
        console.log('📦 Texto puro salvo:', textContent);
        
        // Mostrar feedback visual ao usuário
        showSuccessIndicator();
      }
    } catch (error) {
      console.error('❌ Erro ao salvar conteúdo:', error);
      showErrorIndicator();
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
      const savedContent = editableContent[fieldType];
      
      if (element && savedContent) {
        element.textContent = savedContent; // Usar textContent para texto puro
        console.log(`✅ Aplicado ${fieldType}:`, savedContent);
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
    console.log('📦 Conteúdo disponível:', editableContent);
    
    const doc = iframe.contentDocument;
    let loadedCount = 0;
    
    // USAR APENAS elementos com data-field (mapeados fixos no HTML)
    const targetElements = getEditableElements(doc);
    console.log(`🎯 Elementos encontrados para carregamento: ${targetElements.length}`);
    
    // Aplicar conteúdo salvo nos elementos usando data-field
    targetElements.forEach((element) => {
      const dataField = element.getAttribute('data-field');
      if (!dataField) return;
      
      const savedContent = editableContent[dataField];
      
      if (savedContent) {
        element.textContent = savedContent;
        loadedCount++;
        console.log(`✅ Carregado ${dataField}: "${savedContent}" em ${element.tagName}`);
      }
    });
    
    console.log(`📊 Total de campos carregados: ${loadedCount} de ${Object.keys(editableContent).length}`);
    
    // Log adicional para debug
    if (loadedCount === 0 && Object.keys(editableContent).length > 0) {
      console.log('🔍 Debug: elementos data-field disponíveis na página:');
      targetElements.forEach((el, i) => {
        const field = el.getAttribute('data-field');
        console.log(`   ${field}: ${el.tagName} - "${el.textContent?.substring(0, 50)}..."`);
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

  // Função para aplicar layout
  const handleApplyLayout = async (layoutId: string) => {
    if (!landingPageId) return;

    try {
      setIsLoading(true);
      console.log(`🎨 Aplicando layout: ${layoutId}`);

      // Buscar informações do layout
      const layout = layouts.find(l => l.id === layoutId);
      if (!layout) {
        console.error('❌ Layout não encontrado:', layoutId);
        setIsLoading(false);
        return;
      }

      // FECHAR MODAL IMEDIATAMENTE para melhor UX
      console.log('🔄 Fechando modal de layout...');
      setShowLayoutModal(false);
      
      // Atualizar estados locais primeiro
      console.log('🔄 Atualizando selectedLayout para:', layoutId);
      setSelectedLayout(layoutId);
      setIsPageLoading(true);
      
      console.log('✅ Modal fechado e estados atualizados!');

      // NÃO salvar no banco ainda - apenas aplicar visualmente
      // O salvamento só acontecerá quando o usuário clicar em "Salvar" após editar
      console.log('📋 Layout aplicado apenas visualmente - não salvo no banco ainda');
      
      // Delay para permitir carregamento suave do iframe
      setTimeout(() => {
        setIsPageLoading(false);
        // Ativar modo de edição automaticamente após carregar o layout
        setTimeout(() => {
          setIsEditMode(true);
          console.log('✅ Layout aplicado e modo de edição ativado!');
        }, 500);
      }, 800);

    } catch (error) {
      console.error('❌ Erro inesperado ao aplicar layout:', error);
      setIsPageLoading(false);
      // Mostrar mensagem de erro visual
      alert('Erro inesperado ao aplicar layout. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para aplicar conteúdo do layout na página - MELHORADA
  const applyLayoutContentToPage = (content: any) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    
    try {
      console.log('🎨 Aplicando conteúdo do layout Yogalax na página...');
      
      // Substituir o body inteiro com o layout Yogalax se disponível
      if (content.hero?.title) {
        // Aplicar título principal se existir
        const titleElements = doc.querySelectorAll('h1, .hero-title, [data-field="title"]');
        titleElements.forEach(el => {
          if (el) el.textContent = content.hero.title;
        });
      }
      
      if (content.hero?.subtitle) {
        // Aplicar subtítulo se existir
        const subtitleElements = doc.querySelectorAll('h2, .hero-subtitle, [data-field="description"]');
        subtitleElements.forEach(el => {
          if (el) el.textContent = content.hero.subtitle;
        });
      }
      
      if (content.hero?.cta_button) {
        // Aplicar texto do botão CTA
        const buttonElements = doc.querySelectorAll('.btn-primary, [data-field="button1"]');
        buttonElements.forEach(el => {
          if (el) el.textContent = content.hero.cta_button;
        });
      }
      
      // Aplicar estilo específico do layout de yoga/desenvolvimento pessoal
      const body = doc.body;
      if (body) {
        body.style.fontFamily = 'Work Sans, sans-serif';
        body.style.backgroundColor = '#f8f9fa';
        
        // Adicionar classes CSS específicas para o layout de desenvolvimento pessoal
        body.classList.add('yoga-layout', 'desenvolvimento-pessoal');
      }
      
      console.log('✅ Conteúdo do layout Yogalax aplicado na página');
      
    } catch (error) {
      console.error('❌ Erro ao aplicar conteúdo na página:', error);
    }
  };

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
      
      // NOVO: Carregar dados salvos SEMPRE que iframe carregar (antes do modo de edição)
      if (editableContent && Object.keys(editableContent).length > 0) {
        console.log('📥 Carregando dados salvos automaticamente...');
        loadSavedContentToPage();
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

  // Função para toggle do modo de edição/visualização
  const handleToggleEditingMode = () => {
    setIsEditingMode(!isEditingMode);
    console.log(`🔄 Toggle modo de edição: ${!isEditingMode ? 'ATIVO' : 'INATIVO'}`);
  };

  // Efeito para atualizar modo de edição quando isEditingMode muda
  useEffect(() => {
    if (selectedLayout && iframeRef.current) {
      // Aguardar um pouco para garantir que o iframe esteja carregado
      setTimeout(() => {
        initializeEditMode();
      }, 100);
    }
  }, [isEditingMode, selectedLayout]);

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

            {/* Botão Selecionar Layout - No Centro */}
            <div className="flex-1 flex justify-center gap-3">
              <Button
                onClick={() => setShowLayoutModal(true)}
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 px-6 py-2.5 font-semibold"
              >
                🎨 Selecionar Layout
              </Button>
              
              {/* Botão Toggle Visualizar/Editar Layout */}
              {selectedLayout && (
                <Button
                  onClick={handleToggleEditingMode}
                  variant="outline"
                  className={`px-6 py-2.5 font-semibold transition-all ${
                    isEditingMode 
                      ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' 
                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {isEditingMode ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Layout
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              {/* Botão Salvar (quando há mudanças) */}
              {hasUnsavedChanges && (
                <Button
                  onClick={handleSaveEditedContent}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
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

      {/* Banner informativo (sempre visível quando tem layout) */}
      {selectedLayout && (
        <div className={`border-b px-4 py-2 ${
          isEditingMode 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="container mx-auto flex items-center justify-between">
            <p className={`text-sm ${
              isEditingMode 
                ? 'text-orange-800' 
                : 'text-blue-800'
            }`}>
              ✨ <strong>Layout Ativo:</strong> {layouts.find(l => l.id === selectedLayout)?.name}
              {isEditingMode ? ' - Clique nos textos para editá-los diretamente.' : ' - Modo de visualização ativo.'}
            </p>
            
            {/* Indicador "Modo de edição ativo" */}
            {isEditingMode && (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                🔥 Modo de edição ativo
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Landing Page */}
      <div className="w-full">
        {isPageLoading ? (
          // Loading state
          <div 
            className="w-full flex items-center justify-center bg-gray-100"
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando página de vendas...</p>
            </div>
          </div>
        ) : !selectedLayout ? (
          // Mensagem para selecionar layout quando não há layout ativo
          <div 
            className="w-full flex items-center justify-center bg-gray-50"
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Você precisa selecionar um layout
                </h2>
                <p className="text-gray-600 mb-6">
                  Para começar a personalizar sua página de vendas, escolha um layout que combine com o seu curso.
                </p>
                <Button
                  onClick={() => setShowLayoutModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  🎨 Selecionar Layout Agora
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={selectedLayout === 'desenvolvimento_pessoal' 
              ? `/layouts/yogalax-master/index.html`
              : `/landing-page-modelo1-completa.html` // Fallback padrão
            }
            className="w-full border-0"
            title={selectedLayout 
              ? `Landing Page - ${layouts.find(l => l.id === selectedLayout)?.name}`
              : 'Landing Page'
            }
            style={{ height: 'calc(100vh - 120px)' }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={handleIframeLoad}
            key={`iframe-${selectedLayout || 'default'}`} // Força re-render quando layout muda
          />
        )}
      </div>

      {/* Modal de Seleção de Layout */}
      {showLayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecionar Layout
              </h3>
              
              <p className="text-sm text-gray-500">
                Escolha um layout para sua página de vendas
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => {
                    console.log(`🎯 Layout selecionado no modal: ${layout.id}`);
                    setSelectedLayout(layout.id);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedLayout === layout.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{layout.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{layout.description}</p>
                    </div>
                    {selectedLayout === layout.id && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  console.log(`🚀 Botão Aplicar Layout clicado! Layout: ${selectedLayout}`);
                  if (selectedLayout) {
                    handleApplyLayout(selectedLayout);
                  } else {
                    console.warn('⚠️ Nenhum layout selecionado!');
                  }
                }}
                disabled={!selectedLayout || isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Aplicando...
                  </div>
                ) : (
                  'Aplicar Layout'
                )}
              </Button>
              
              <Button
                onClick={() => {
                  console.log('❌ Modal cancelado pelo usuário');
                  setShowLayoutModal(false);
                  // Não resetar selectedLayout se já houver um layout ativo
                  if (!selectedLayout) {
                    setSelectedLayout(null);
                  }
                }}
                variant="outline"
                disabled={isLoading}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

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