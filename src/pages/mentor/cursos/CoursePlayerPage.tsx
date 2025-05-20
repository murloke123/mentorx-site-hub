import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetailsForPlayer, markConteudoAsConcluido, markConteudoAsIncompleto } from '@/services/coursePlayerService';
// import { Header } from '@/components/layout/Header'; // Assuming a Header component exists
// import { Sidebar } from '@/components/layout/Sidebar'; // Assuming a Sidebar component exists for course navigation
// import { VideoPlayer } from '@/components/media/VideoPlayer'; // Assuming a VideoPlayer component exists
import { Progress } from "@/components/ui/progress"; //shadcn/ui
import { Checkbox } from "@/components/ui/checkbox"; //shadcn/ui
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; //shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //shadcn/ui
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Define interfaces based on your Supabase schema
// These might need to be adjusted or imported if defined elsewhere
interface Conteudo {
  id: string;
  titulo: string;
  tipo_conteudo: 'video' | 'text' | 'pdf';
  dados_conteudo: {
    video_url?: string;
    texto_rico?: string;
    pdf_url?: string;
    pdf_filename?: string;
  };
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

interface Modulo {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: Conteudo[];
}

interface Curso {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  modulos: Modulo[];
}

interface ConteudoConcluido {
  id: string;
  user_id: string;
  curso_id: string;
  modulo_id: string;
  conteudo_id: string;
  created_at: string;
}

const CoursePlayerPage = () => {
  const { id: cursoId } = useParams<{ id: string }>();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConteudo, setCurrentConteudo] = useState<Conteudo | null>(null);
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
        setCurso(data.curso);
        // Assuming getCourseDetailsForPlayer also returns completed content IDs for the user
        // setConteudosConcluidos(new Set(data.completedConteudoIds)); 
        if (data.curso && data.curso.modulos.length > 0 && data.curso.modulos[0].conteudos.length > 0) {
          setCurrentConteudo(data.curso.modulos[0].conteudos[0]);
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

  const handleConteudoSelection = (conteudo: Conteudo) => {
    setCurrentConteudo(conteudo);
  };

  const handleToggleConteudoConcluido = async (conteudoId: string, moduloId: string) => {
    if (!cursoId) return;

    const isConcluido = conteudosConcluidos.has(conteudoId);
    try {
      if (isConcluido) {
        await markConteudoAsIncompleto(cursoId, moduloId, conteudoId);
        setConteudosConcluidos(prev => {
          const newSet = new Set(prev);
          newSet.delete(conteudoId);
          return newSet;
        });
        toast({ title: "Conteúdo marcado como não concluído" });
      } else {
        await markConteudoAsConcluido(cursoId, moduloId, conteudoId);
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

  const renderConteudo = () => {
    if (!currentConteudo) return <p className="text-center text-gray-500">Selecione um conteúdo para visualizar.</p>;

    switch (currentConteudo.tipo_conteudo) {
      case 'video':
        return currentConteudo.dados_conteudo.video_url ? (
          // <VideoPlayer src={currentConteudo.dados_conteudo.video_url} />
          <div className="aspect-video bg-gray-300 flex items-center justify-center">
            <p>Video Player Placeholder (URL: {currentConteudo.dados_conteudo.video_url})</p>
          </div>
        ) : <p>Vídeo indisponível.</p>;
      case 'text':
        return currentConteudo.dados_conteudo.texto_rico ? (
          <Card className="mt-4">
            <CardHeader><CardTitle>Conteúdo Textual</CardTitle></CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: currentConteudo.dados_conteudo.texto_rico }} />
            </CardContent>
          </Card>
        ) : <p>Texto indisponível.</p>;
      case 'pdf':
        return currentConteudo.dados_conteudo.pdf_url ? (
           <Card className="mt-4">
            <CardHeader><CardTitle>{currentConteudo.dados_conteudo.pdf_filename || "Documento PDF"}</CardTitle></CardHeader>
            <CardContent>
                <iframe src={currentConteudo.dados_conteudo.pdf_url} width="100%" height="600px" title={currentConteudo.dados_conteudo.pdf_filename || "PDF Viewer"}></iframe>
            </CardContent>
          </Card>
        ) : <p>PDF indisponível.</p>;
      default:
        return <p>Tipo de conteúdo não suportado.</p>;
    }
  };

  // Placeholder for company logo and course name - to be passed to Header or styled here
  const companyLogoUrl = "/logo.png"; // Replace with actual logo URL or import
  const courseName = curso.title;

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section - Assuming a generic Header component that can take logo, course name etc. */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center">
            {/* <img src={companyLogoUrl} alt="Company Logo" className="h-8 w-auto mr-3" /> */}
            <h1 className="text-xl font-semibold">{courseName}</h1>
          </div>
          <div className="flex items-center">
              <span className="text-sm mr-2">{Math.round(progress)}% concluído</span>
              <Progress value={progress} className="w-32 h-2 bg-gray-700 [&>*]:bg-green-500" />
          </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <h2 className="text-2xl font-semibold mb-2">{currentConteudo?.titulo || "Bem-vindo!"}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {currentConteudo ? `Módulo: ${curso.modulos.find(m => m.id === currentConteudo.modulo_id)?.titulo}` : ''}
          </p>
          {renderConteudo()}
        </main>

        {/* Sidebar / Course Navigation */}
        <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Conteúdo do Curso</h3>
          <Accordion type="multiple" className="w-full" defaultValue={curso.modulos.map(m => m.id)}>
            {curso.modulos.map((modulo) => (
              <AccordionItem value={modulo.id} key={modulo.id}>
                <AccordionTrigger className="font-medium hover:bg-gray-50 p-2 rounded">
                  {modulo.titulo}
                </AccordionTrigger>
                <AccordionContent className="pl-4 pr-1 pt-1 pb-1">
                  <ul className="space-y-1">
                    {modulo.conteudos.sort((a,b) => a.ordem - b.ordem).map((conteudo) => (
                      <li key={conteudo.id} className="text-sm">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left h-auto py-2 px-2 block ${currentConteudo?.id === conteudo.id ? 'bg-sky-100 text-sky-700 font-semibold' : 'hover:bg-gray-100'}`}
                          onClick={() => handleConteudoSelection(conteudo)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1 truncate" title={conteudo.titulo}>{conteudo.titulo}</span>
                            <Checkbox
                              checked={conteudosConcluidos.has(conteudo.id)}
                              onCheckedChange={() => handleToggleConteudoConcluido(conteudo.id, modulo.id)}
                              className="ml-2 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()} // Prevent button click when checkbox is clicked
                            />
                          </div>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayerPage; 