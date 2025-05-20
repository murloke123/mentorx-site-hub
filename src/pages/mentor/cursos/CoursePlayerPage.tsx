
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetailsForPlayer, markConteudoConcluido, markConteudoIncompleto } from '@/services/coursePlayerService';
import { toast } from '@/hooks/use-toast';
import { CursoItemLocal, ConteudoItemLocal } from './types';
import CourseHeader from './components/CourseHeader';
import CourseSidebar from './components/CourseSidebar';
import ContentRenderer from './components/ContentRenderer';

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
        if (data.curso && data.modulos.length > 0 && data.modulos[0].conteudos.length > 0) {
          setCurrentConteudo(data.modulos[0].conteudos[0] as ConteudoItemLocal);
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
        setConteudosConcluidos(prev => new Set(prev).add(conteudoId));
        toast({ title: "Conteúdo marcado como concluído!" });
      }
    } catch (err) {
      console.error("Erro ao atualizar status do conteúdo:", err);
      toast({ title: "Erro ao atualizar status", description: (err as Error).message, variant: "destructive" });
    }
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen"><p>Carregando curso...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500"><p>{error}</p></div>;
  if (!curso) return <div className="flex justify-center items-center h-screen"><p>Curso não encontrado.</p></div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <CourseHeader title={curso.title} progress={progress} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <ContentRenderer 
            currentConteudo={currentConteudo}
            modulos={curso.modulos}
          />
        </main>

        {/* Sidebar / Course Navigation */}
        <CourseSidebar 
          modulos={curso.modulos}
          currentConteudo={currentConteudo}
          conteudosConcluidos={conteudosConcluidos}
          onConteudoSelect={handleConteudoSelection}
          onToggleConteudoConcluido={handleToggleConteudoConcluido}
        />
      </div>
    </div>
  );
};

export default CoursePlayerPage;
