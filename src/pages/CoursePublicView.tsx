import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface CourseData {
  id: string;
  title: string;
  description: string;
  mentor_id: string;
}

interface LandingPageData {
  id: string;
  template_type: string;
  course_id: string;
  mentor_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Para aceitar as seções JSONB dinamicamente
}

const CoursePublicView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;

      try {
        console.log('🔍 Carregando dados públicos do curso:', courseId);

        // Buscar dados do curso e sua landing page
        const [courseResult, landingPageResult] = await Promise.all([
          supabase
            .from('cursos')
            .select('id, title, description, mentor_id')
            .eq('id', courseId)
            .single(),
          supabase
            .from('course_landing_pages')
            .select('*')
            .eq('course_id', courseId)
            .eq('is_active', true)
            .single()
        ]);

        if (courseResult.error) {
          throw new Error('Curso não encontrado');
        }

        if (landingPageResult.error) {
          throw new Error('Landing page não encontrada para este curso');
        }

        setCourseData(courseResult.data);
        setLandingPageData(landingPageResult.data);

        console.log('✅ Dados carregados:', {
          curso: courseResult.data.title,
          template: landingPageResult.data.template_type
        });

      } catch (err) {
        console.error('❌ Erro ao carregar curso:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  // Handler quando iframe carrega - apenas carregar dados salvos
  const handleIframeLoad = () => {
    setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow && landingPageData) {
        try {
          // Enviar dados salvos para o iframe
          iframe.contentWindow.postMessage({
            type: 'SET_LANDING_PAGE_ID',
            pageId: landingPageData.id,
            isPublicView: true // Flag para indicar que é visualização pública
          }, '*');

          // Definir variável global no iframe
          if (iframe.contentDocument) {
            (iframe.contentDocument.defaultView as any).landingPageId = landingPageData.id;
            (iframe.contentDocument.defaultView as any).isPublicView = true;
          }

          console.log(`🆔 Dados enviados para iframe (público): ${landingPageData.id}`);
        } catch (error) {
          console.error('❌ Erro ao configurar iframe público:', error);
        }
      }
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData || !landingPageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h2>
          <p className="text-gray-600 mb-4">
            {error || 'O curso que você está procurando não existe ou não está disponível.'}
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Conteúdo da Landing Page em tela cheia */}
      <div className="w-full">
        <iframe
          ref={iframeRef}
          src={landingPageData.template_type === 'modelo3' 
            ? `/components/landing-modelo3/sections/model3_sec_hero.html?public=true`
            : `/landing-page-${landingPageData.template_type}-completa.html?public=true`
          }
          className="w-full border-0"
          title={`${courseData.title} - Página de Vendas`}
          style={{ height: '100vh' }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default CoursePublicView; 