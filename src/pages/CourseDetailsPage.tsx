
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MentorSidebar from '@/components/mentor/MentorSidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, FileText, File, Video, Settings, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCourseById } from '@/services/courseService';
import { getModulesByCourse } from '@/services/moduleService';
import { getLessonsByModule, Lesson } from '@/services/lessonService';

// Component to render embedded YouTube/Vimeo videos
const VideoEmbed = ({ url }: { url: string }) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract YouTube video ID
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      // Extract Vimeo video ID
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return '';
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) return <p className="text-red-500">URL de vídeo inválido</p>;

  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      ></iframe>
    </div>
  );
};

// Content preview component
const ContentPreview = ({ lesson }: { lesson: Lesson }) => {
  switch (lesson.type) {
    case 'text':
      return (
        <div className="p-4 border rounded-md whitespace-pre-wrap">
          {lesson.content || 'Sem conteúdo disponível'}
        </div>
      );
    case 'pdf':
      return (
        <div className="p-4 border rounded-md">
          {lesson.file_url ? (
            <div className="flex flex-col items-center">
              <object
                data={lesson.file_url}
                type="application/pdf"
                className="w-full h-[500px] mb-4"
              >
                <p>Seu navegador não suporta visualização de PDF.</p>
              </object>
              <a
                href={lesson.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Abrir PDF em nova aba
              </a>
            </div>
          ) : (
            <p className="text-muted-foreground">Arquivo PDF não disponível</p>
          )}
        </div>
      );
    case 'video':
      return (
        <div className="p-4 border rounded-md">
          {lesson.video_url ? (
            <VideoEmbed url={lesson.video_url} />
          ) : (
            <p className="text-muted-foreground">URL do vídeo não disponível</p>
          )}
        </div>
      );
    default:
      return <p>Tipo de conteúdo não suportado</p>;
  }
};

const CourseDetailsPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for tracking which lesson is currently being previewed
  const [previewingLessonId, setPreviewingLessonId] = useState<string | null>(null);
  
  // State to store lessons by module ID
  const [moduleContents, setModuleContents] = useState<Record<string, Lesson[]>>({});
  
  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });
  
  // Fetch modules
  const { 
    data: modules = [], 
    isLoading: isLoadingModules 
  } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModulesByCourse(courseId!),
    enabled: !!courseId,
  });
  
  // Fetch lessons for each module
  useEffect(() => {
    const fetchAllLessons = async () => {
      const lessonsByModule: Record<string, Lesson[]> = {};
      
      for (const module of modules) {
        try {
          const lessons = await getLessonsByModule(module.id);
          lessonsByModule[module.id] = lessons;
        } catch (error) {
          console.error(`Error fetching lessons for module ${module.id}:`, error);
        }
      }
      
      setModuleContents(lessonsByModule);
    };
    
    if (modules.length > 0) {
      fetchAllLessons();
    }
  }, [modules]);
  
  // Navigation handlers
  const handleBackToCourse = () => {
    navigate(`/mentor/cursos/${courseId}`);
  };
  
  const handleEditCourse = () => {
    navigate(`/mentor/cursos/${courseId}/editar`);
  };
  
  const handleEditModules = () => {
    navigate(`/mentor/cursos/${courseId}/modulos`);
  };
  
  // Content handlers
  const handleTogglePreview = (lessonId: string) => {
    setPreviewingLessonId(previewingLessonId === lessonId ? null : lessonId);
  };
  
  // Helper function to get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Helper function to get content type label
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Texto';
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Vídeo';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2"
              onClick={handleBackToCourse}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar para o curso
            </Button>
            
            <h1 className="text-2xl font-bold">
              {isLoadingCourse ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                course?.name || 'Carregando...'
              )}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleEditCourse} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Editar Curso
            </Button>
            <Button onClick={handleEditModules}>
              <FileText className="h-4 w-4 mr-2" />
              Gerenciar Módulos
            </Button>
          </div>
        </div>
        
        {/* Course Header Card */}
        <Card className="mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              {course?.image ? (
                <img 
                  src={course.image} 
                  alt={course?.name} 
                  className="h-full w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  style={{ maxHeight: '300px' }}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none" style={{ minHeight: '200px' }}>
                  <p className="text-gray-500">Sem imagem</p>
                </div>
              )}
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={course?.visibility === 'public' ? 'default' : 'secondary'}>
                  {course?.visibility === 'public' ? 'Público' : 'Privado'}
                </Badge>
                <Badge variant={course?.type === 'paid' ? 'default' : 'outline'}>
                  {course?.type === 'paid' ? `R$${course?.price?.toFixed(2)}` : 'Gratuito'}
                </Badge>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{course?.name}</h2>
              <p className="text-gray-600 mb-4">{course?.description || 'Sem descrição'}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Total de Módulos</p>
                  <p>{modules.length}</p>
                </div>
                <div>
                  <p className="font-semibold">Total de Conteúdos</p>
                  <p>{Object.values(moduleContents).flat().length}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Course Structure */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Estrutura do Curso</h2>
          
          {isLoadingModules ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nenhum módulo criado</h3>
              <p className="mt-1 text-gray-500">Crie módulos para estruturar o conteúdo do seu curso</p>
              <Button onClick={handleEditModules} variant="outline" className="mt-4">
                Adicionar Módulos
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module, index) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-medium">
                        Módulo {index + 1}: {module.title}
                      </span>
                      {module.is_free && (
                        <Badge variant="outline" className="ml-2">
                          Gratuito
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    {module.description && (
                      <p className="text-gray-600 mb-4">{module.description}</p>
                    )}
                    
                    {/* Module contents */}
                    <div className="space-y-3 mt-2">
                      {moduleContents[module.id]?.length ? (
                        moduleContents[module.id]
                          .sort((a, b) => a.lesson_order - b.lesson_order)
                          .map((lesson) => (
                            <div key={lesson.id} className="border rounded-lg overflow-hidden">
                              <div 
                                className={`flex items-center justify-between p-3 ${
                                  !lesson.is_published ? 'bg-gray-50' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {getContentTypeIcon(lesson.type)}
                                  <div>
                                    <h3 className="font-medium">{lesson.title}</h3>
                                    <div className="flex items-center mt-1 space-x-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {getContentTypeLabel(lesson.type)}
                                      </Badge>
                                      {!lesson.is_published && (
                                        <Badge variant="outline" className="text-xs text-gray-500">
                                          <EyeOff className="h-3 w-3 mr-1" />
                                          Não Publicado
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTogglePreview(lesson.id)}
                                >
                                  {previewingLessonId === lesson.id ? 'Ocultar' : 'Visualizar'}
                                </Button>
                              </div>
                              
                              {previewingLessonId === lesson.id && (
                                <div className="border-t p-4">
                                  <ContentPreview lesson={lesson} />
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-6 border border-dashed rounded-lg">
                          <p className="text-gray-500">Nenhum conteúdo adicionado a este módulo</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
