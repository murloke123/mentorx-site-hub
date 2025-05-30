import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CourseLandingPublicPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [templateType, setTemplateType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!courseId) {
        setError('ID do curso não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Buscando template para curso:', courseId);
        
        // Busca direta no banco sem JOIN
        const { data, error } = await supabase
          .from('course_landing_pages')
          .select('template_type')
          .eq('course_id', courseId)
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Erro na consulta:', error);
          if (error.code === 'PGRST116') {
            // Não existe landing page, vamos criar uma padrão com modelo1
            console.log('Landing page não encontrada, criando modelo1 padrão...');
            await createDefaultLandingPage(courseId);
            setTemplateType('modelo1');
          } else {
            setError('Erro ao carregar a página do curso');
          }
          setIsLoading(false);
          return;
        }

        console.log('Template encontrado:', data.template_type);
        setTemplateType(data.template_type);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro inesperado:', error);
        setError('Erro inesperado ao carregar a página');
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [courseId]);

  const createDefaultLandingPage = async (courseId: string) => {
    try {
      console.log('Criando landing page padrão para curso:', courseId);
      
      // Criar landing page padrão com modelo1
      const { data, error } = await supabase
        .from('course_landing_pages')
        .insert({
          course_id: courseId,
          template_type: 'modelo1',
          headline: '',
          subheadline: '',
          description: '',
          benefits: [],
          testimonials: [],
          cta_text: '',
          pricing_text: '',
          bonus_content: '',
          about_mentor: '',
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar landing page padrão:', error);
        return;
      }

      // Atualizar referência na tabela cursos
      await supabase
        .from('cursos')
        .update({ landing_page_id: data.id })
        .eq('id', courseId);

      console.log('Landing page padrão criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar landing page padrão:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando página do curso...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !templateType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">
            {error || 'A página de venda deste curso ainda não foi configurada pelo mentor.'}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Carregar o arquivo HTML diretamente
  const templatePath = `/landing-page-${templateType}-completa.html`;
  console.log('Carregando template:', templatePath);
  
  return (
    <div className="w-full h-screen">
      <iframe
        src={templatePath}
        className="w-full h-full border-0"
        title="Landing Page do Curso"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ minHeight: '100vh' }}
      />
    </div>
  );
};

export default CourseLandingPublicPage; 