import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetailsForPlayer, markConteudoConcluido, markConteudoIncompleto } from '@/services/coursePlayerService';
import { toast } from '@/hooks/use-toast';
import { CursoItemLocal, ConteudoItemLocal } from './types';
import CourseSidebar from './components/CourseSidebar';
import ContentRenderer from './components/ContentRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CoursePlayerPage = () => {
  const { id: cursoId } = useParams<{ id: string }>();
  const [curso, setCurso] = useState<CursoItemLocal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConteudo, setCurrentConteudo] = useState<ConteudoItemLocal | null>(null);
  const [conteudosConcluidos, setConteudosConcluidos] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!cursoId) {
      setError("ID do curso não encontrado.");
      setLoading(false);
      return;
    }

    const fetchCursoData = async () => {
      try {
        setLoading(true);
        const data = await getCourseDetailsForPlayer(cursoId);
        
        // Set course data
        setCurso(data.curso as CursoItemLocal);
        
        // Set completed content IDs
        setConteudosConcluidos(new Set(data.completedConteudoIds));
        
        // Set initial content if available
        if (data.curso && data.curso.modulos.length > 0 && data.curso.modulos[0].conteudos.length > 0) {
          setCurrentConteudo(data.curso.modulos[0].conteudos[0] as ConteudoItemLocal);
        }
        
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados do curso:", err);
        setError("Falha ao carregar o curso. Tente novamente mais tarde.");
        toast({ title: "Erro ao carregar curso", description: (err as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchCursoData();
  }, [cursoId]);

  useEffect(() => {
    if (curso) {
      const totalConteudos = curso.modulos.reduce((acc, modulo) => acc + modulo.conteudos.length, 0);
      if (totalConteudos > 0) {
        const newProgress = (conteudosConcluidos.size / totalConteudos) * 100;
        setProgress(newProgress);
      } else {
        setProgress(0);
      }
    }
  }, [conteudosConcluidos, curso]);

  const handleConteudoSelection = (conteudo: ConteudoItemLocal) => {
    setCurrentConteudo(conteudo);
  };

  const handleToggleConteudoConcluido = async (conteudoId: string, moduloId: string) => {
    if (!cursoId) return;

    const isConcluido = conteudosConcluidos.has(conteudoId);
    try {
      if (isConcluido) {
        await markConteudoIncompleto(cursoId, moduloId, conteudoId);
        setConteudosConcluidos(prev => {
          const newSet = new Set(prev);
          newSet.delete(conteudoId);
          return newSet;
        });
        toast({ title: "Conteúdo marcado como não concluído" });
      } else {
        await markConteudoConcluido(cursoId, moduloId, conteudoId);
        setConteudosConcluidos(prev => new Set([...prev, conteudoId]));
        toast({ title: "Conteúdo marcado como concluído!" });
      }
    } catch (error) {
      console.error('Erro ao atualizar status do conteúdo:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do conteúdo.",
        variant: "destructive",
      });
    }
  };

  const findNextContent = () => {
    if (!curso || !currentConteudo) return null;

    // Encontrar o módulo atual
    const currentModuleIndex = curso.modulos.findIndex(m => m.id === currentConteudo.modulo_id);
    if (currentModuleIndex === -1) return null;

    const currentModule = curso.modulos[currentModuleIndex];
    
    // Encontrar o índice do conteúdo atual no módulo
    const currentContentIndex = currentModule.conteudos.findIndex(c => c.id === currentConteudo.id);
    
    // Se há mais conteúdo no módulo atual
    if (currentContentIndex < currentModule.conteudos.length - 1) {
      return currentModule.conteudos[currentContentIndex + 1];
    }
    
    // Se não há mais conteúdo no módulo atual, procurar no próximo módulo
    if (currentModuleIndex < curso.modulos.length - 1) {
      const nextModule = curso.modulos[currentModuleIndex + 1];
      if (nextModule.conteudos.length > 0) {
        return nextModule.conteudos[0];
      }
    }
    
    return null;
  };

  const findPreviousContent = () => {
    if (!curso || !currentConteudo) return null;

    // Encontrar o módulo atual
    const currentModuleIndex = curso.modulos.findIndex(m => m.id === currentConteudo.modulo_id);
    if (currentModuleIndex === -1) return null;

    const currentModule = curso.modulos[currentModuleIndex];
    
    // Encontrar o índice do conteúdo atual no módulo
    const currentContentIndex = currentModule.conteudos.findIndex(c => c.id === currentConteudo.id);
    
    // Se há conteúdo anterior no módulo atual
    if (currentContentIndex > 0) {
      return currentModule.conteudos[currentContentIndex - 1];
    }
    
    // Se não há conteúdo anterior no módulo atual, procurar no módulo anterior
    if (currentModuleIndex > 0) {
      const previousModule = curso.modulos[currentModuleIndex - 1];
      if (previousModule.conteudos.length > 0) {
        return previousModule.conteudos[previousModule.conteudos.length - 1];
      }
    }
    
    return null;
  };

  const handleNextContent = () => {
    const nextContent = findNextContent();
    if (nextContent) {
      setCurrentConteudo(nextContent);
    } else {
      toast({
        title: "Fim do curso",
        description: "Você chegou ao último conteúdo do curso.",
      });
    }
  };

  const handlePreviousContent = () => {
    const previousContent = findPreviousContent();
    if (previousContent) {
      setCurrentConteudo(previousContent);
    } else {
      toast({
        title: "Início do curso",
        description: "Você está no primeiro conteúdo do curso.",
      });
    }
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen"><p>Carregando curso...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500"><p>{error}</p></div>;
  if (!curso) return <div className="flex justify-center items-center h-screen"><p>Curso não encontrado.</p></div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <ContentRenderer 
            currentConteudo={currentConteudo}
            modulos={curso.modulos}
            onNextContent={handleNextContent}
            onPreviousContent={handlePreviousContent}
          />
        </main>

        {/* Sidebar / Course Navigation */}
        <CourseSidebar 
          modulos={curso.modulos}
          currentConteudo={currentConteudo}
          conteudosConcluidos={conteudosConcluidos}
          onConteudoSelect={handleConteudoSelection}
          onToggleConteudoConcluido={handleToggleConteudoConcluido}
          progress={progress}
        />
      </div>
    </div>
  );
};

export default CoursePlayerPage;
