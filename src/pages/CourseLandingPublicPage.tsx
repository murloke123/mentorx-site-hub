import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CourseLandingPublicPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [layoutName, setLayoutName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLayout = async () => {
      if (!courseId) {
        setError('ID do curso não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Buscando layout para curso:', courseId);
        
        // Buscar landing page para este curso
        const { data, error } = await (supabase as any)
          .from('course_landing_pages')
          .select('layout_name')
          .eq('course_id', courseId)
          .single();

        if (error) {
          console.error('❌ Erro na consulta:', error);
          if (error.code === 'PGRST116') {
            // Não existe landing page - usar desenvolvimento pessoal como padrão
            console.log('⚠️ Landing page não encontrada, usando desenvolvimento pessoal como padrão');
            setLayoutName('desenvolvimento_pessoal');
          } else {
            setError('Erro ao carregar a página do curso');
          }
          setIsLoading(false);
          return;
        }

        console.log('✅ Layout encontrado:', data.layout_name);
        // Se não tem layout definido, usar desenvolvimento pessoal como padrão
        setLayoutName(data.layout_name || 'desenvolvimento_pessoal');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        setError('Erro inesperado ao carregar a página');
        setIsLoading(false);
      }
    };

    loadLayout();
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

  // Mapear layout_name para o caminho do arquivo
  const getLayoutPath = (layoutName: string | null) => {
    switch (layoutName) {
      case 'desenvolvimento_pessoal':
        return '/layouts/yogalax-master/index.html';
      case 'venda':
        return '/layouts/lava-master/index.html';
      default:
        // Fallback para desenvolvimento pessoal
        return '/layouts/yogalax-master/index.html';
    }
  };

  const layoutPath = getLayoutPath(layoutName);
  
  console.log('🚀 Carregando layout:', layoutPath);
  
  return (
    <div className="w-full h-screen">
      <iframe
        src={layoutPath}
        className="w-full h-full border-0"
        title="Landing Page do Curso"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ minHeight: '100vh' }}
      />
    </div>
  );
};

export default CourseLandingPublicPage; 