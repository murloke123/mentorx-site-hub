import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Check, X } from 'lucide-react';
import { TemplateOption } from '@/types/landing-page';
import { getCourseLandingPage, saveCourseLandingPage, getCourseDataForLandingPage } from '@/services/landingPageService';
import { supabase } from '@/integrations/supabase/client';

// Templates disponíveis
const TEMPLATES: TemplateOption[] = [
  {
    id: 'modelo1',
    name: 'Modelo 1',
    description: 'Design clássico e profissional com foco em conversão',
    preview: '/landing-page-modelo1-completa.html',
    isActive: false,
  },
  {
    id: 'modelo2',
    name: 'Modelo 2',
    description: 'Layout inovador com animações e gradientes',
    preview: '/landing-page-modelo2-completa.html',
    isActive: false,
  },
  {
    id: 'modelo3',
    name: 'Modelo 3',
    description: 'Design sofisticado para cursos de alto valor',
    preview: '/landing-page-modelo3-completa.html',
    isActive: false,
  },
];

const CourseLandingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modelo1'); // Default fallback
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [landingPageData, setLandingPageData] = useState<any>(null);

  // Carregar dados do curso e landing page existente
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;

      try {
        setIsInitialLoading(true);
        console.log('🔍 === INICIANDO CARREGAMENTO PARA CURSO ===', courseId);
        
        // 1. BUSCAR DIRETAMENTE O TEMPLATE DO BANCO
        console.log('🎯 Buscando template salvo no banco...');
        const { data: templateData, error: templateError } = await supabase
          .from('cursos')
          .select(`
            id,
            title,
            course_landing_pages!course_landing_pages_course_id_fkey (
              template_type,
              is_active
            )
          `)
          .eq('id', courseId)
          .eq('course_landing_pages.is_active', true)
          .single();

        if (templateError) {
          console.error('❌ Erro ao buscar curso:', templateError);
          setSelectedTemplate('modelo1');
        } else {
          console.log('📄 DADOS DO CURSO COMPLETOS:', templateData);
          setCourseData(templateData);
          
          // Verificar se tem landing page
          if (templateData.course_landing_pages && templateData.course_landing_pages.length > 0) {
            const savedTemplate = templateData.course_landing_pages[0].template_type;
            console.log('✅ TEMPLATE ENCONTRADO NO BANCO:', savedTemplate);
            console.log('🎯 DEFININDO SELECTED TEMPLATE PARA:', savedTemplate);
            setSelectedTemplate(savedTemplate);
            setActiveTemplate(savedTemplate);
          } else {
            console.log('⚠️ Nenhuma landing page encontrada, usando modelo1');
            setSelectedTemplate('modelo1');
            setActiveTemplate(null);
          }
        }

      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        setSelectedTemplate('modelo1');
      } finally {
        setIsInitialLoading(false);
        console.log('✅ === CARREGAMENTO FINALIZADO ===');
      }
    };

    loadData();
  }, [courseId]);

  const handleSelectModel = async () => {
    if (!selectedTemplate || !courseId) return;

    setIsLoading(true);
    try {
      const savedLandingPage = await saveCourseLandingPage(courseId, selectedTemplate as any);
      setActiveTemplate(selectedTemplate);
      setLandingPageData(savedLandingPage);
      toast({
        title: 'Modelo selecionado!',
        description: `O ${TEMPLATES.find(t => t.id === selectedTemplate)?.name} foi aplicado ao seu curso com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível aplicar o template.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = () => {
    // TODO: Implementar funcionalidade de edição
    toast({
      title: 'Em desenvolvimento',
      description: 'A funcionalidade de edição será implementada em breve.',
    });
  };

  const handleClose = () => {
    navigate('/mentor/cursos');
  };

  const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);

  // DEBUG: Log do estado atual
  console.log('🎯 ESTADO ATUAL DO COMPONENTE:', {
    courseId,
    selectedTemplate,
    activeTemplate,
    isInitialLoading,
    courseTitle: courseData?.title
  });

  return (
    <div className="fixed inset-0 bg-gray-100 z-50">
      {/* Loading Overlay */}
      {isInitialLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Carregando dados do curso...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header transparente flutuante */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white/50 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo e título */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-700 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
              <div className="font-bold text-xl text-gray-900">
                MentorX
              </div>
              <div className="text-gray-600 text-sm">
                {courseData?.title || 'Carregando...'}
              </div>
            </div>

            {/* Botões dos modelos */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-1">
                {TEMPLATES.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  const isActive = activeTemplate === template.id;
                  
                  console.log(`🔘 Botão ${template.name}: selected=${isSelected}, active=${isActive}, selectedTemplate=${selectedTemplate}`);
                  
                  return (
                    <Button
                      key={template.id}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        console.log(`🖱️ Clicou em ${template.name} (${template.id})`);
                        setSelectedTemplate(template.id);
                      }}
                      className={`relative ${
                        isSelected
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {template.name}
                      {isActive && (
                        <Check className="absolute -top-1 -right-1 h-3 w-3 text-green-500 bg-white rounded-full" />
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Botões de ação */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditTemplate}
                  className="bg-white/70 border-gray-300 text-gray-700 hover:bg-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                <Button
                  onClick={handleSelectModel}
                  disabled={isLoading || activeTemplate === selectedTemplate}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Selecionar Modelo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal - iframe fullscreen */}
      <div className="pt-16 h-full">
        <div className="w-full h-full bg-white">
          {selectedTemplateData && (
            <iframe
              src={selectedTemplateData.preview}
              className="w-full h-full border-0"
              title={`Preview ${selectedTemplateData.name}`}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>

      {/* Status indicator */}
      {activeTemplate && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">
            {TEMPLATES.find(t => t.id === activeTemplate)?.name} Ativo
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseLandingPage; 