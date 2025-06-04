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
        console.log('🔍 Buscando template para curso:', courseId);
        
        // Buscar landing page para este curso (agora só existe 1 por curso)
        const { data, error } = await supabase
          .from('course_landing_pages')
          .select('template_type')
          .eq('course_id', courseId)
          .single();

        if (error) {
          console.error('❌ Erro na consulta:', error);
          if (error.code === 'PGRST116') {
            // Não existe landing page - usar modelo1 como padrão
            console.log('⚠️ Landing page não encontrada, usando modelo1 como padrão');
            setTemplateType('modelo1');
          } else {
            setError('Erro ao carregar a página do curso');
          }
          setIsLoading(false);
          return;
        }

        console.log('✅ Template encontrado:', data.template_type);
        setTemplateType(data.template_type);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        setError('Erro inesperado ao carregar a página');
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [courseId]);

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
  if (error) {
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

  // Se não temos template, usar modelo1 como fallback
  const finalTemplateType = templateType || 'modelo1';
  const templatePath = `/landing-page-${finalTemplateType}-completa.html`;
  
  console.log('🚀 Carregando template:', templatePath);
  
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