import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MentorSidebar from '@/components/mentor/MentorSidebar';
import ModuleList from '@/components/mentor/module-management/ModuleList';
import ModuleForm from '@/components/mentor/module-management/ModuleForm';
import ContentList from '@/components/mentor/content-management/ContentList';
import ContentForm from '@/components/mentor/content-management/ContentForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCourseById } from '@/services/courseService';
import { 
  Module, 
  getModulesByCourse, 
  createModule, 
  updateModule, 
  deleteModule, 
  reorderModules 
} from '@/services/moduleService';
import { 
  Lesson, 
  getLessonsByModule, 
  createLesson, 
  updateLesson, 
  deleteLesson, 
  reorderLessons,
  uploadPdfFile 
} from '@/services/lessonService';

const CourseModulesPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for module management
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModuleSaving, setIsModuleSaving] = useState(false);
  
  // State for content management
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Lesson | null>(null);
  const [isContentSaving, setIsContentSaving] = useState(false);
  
  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });
  
  // Fetch modules
  const { 
    data: modules = [], 
    isLoading: isLoadingModules,
    refetch: refetchModules 
  } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModulesByCourse(courseId!),
    enabled: !!courseId,
  });
  
  // Fetch lessons for selected module
  const { 
    data: lessons = [], 
    isLoading: isLoadingLessons,
    refetch: refetchLessons 
  } = useQuery({
    queryKey: ['lessons', selectedModuleId],
    queryFn: async () => {
      const lessonData = await getLessonsByModule(selectedModuleId!);
      return lessonData as Lesson[];
    },
    enabled: !!selectedModuleId,
  });
  
  // Reset selected module when course changes
  useEffect(() => {
    setSelectedModuleId(null);
  }, [courseId]);
  
  // Module handlers
  const handleAddModule = () => {
    setSelectedModule(null);
    setIsModuleFormOpen(true);
  };
  
  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setIsModuleFormOpen(true);
  };
  
  const handleSaveModule = async (data: any) => {
    if (!courseId) return;
    
    setIsModuleSaving(true);
    
    try {
      if (selectedModule) {
        // Update existing module
        await updateModule(selectedModule.id, {
          title: data.title,
          description: data.description,
          is_free: data.is_free,
        });
        toast({
          title: "Módulo atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create new module
        await createModule({
          course_id: courseId,
          title: data.title,
          description: data.description,
          is_free: data.is_free,
          content_type: 'section',
        });
        toast({
          title: "Módulo criado",
          description: "Novo módulo adicionado com sucesso.",
        });
      }
      
      // Refetch modules and close the form
      await refetchModules();
      setIsModuleFormOpen(false);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar módulo",
        description: "Ocorreu um erro ao salvar o módulo. Tente novamente.",
      });
    } finally {
      setIsModuleSaving(false);
    }
  };
  
  const handleDeleteModule = async (moduleId: string) => {
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
    }
    await deleteModule(moduleId);
    await refetchModules();
  };
  
  const handleReorderModules = async (moduleOrder: { id: string; order: number }[]) => {
    await reorderModules(courseId!, moduleOrder);
    await refetchModules();
  };
  
  // Content handlers
  const handleManageContent = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };
  
  const handleAddContent = () => {
    setSelectedContent(null);
    setIsContentFormOpen(true);
  };
  
  const handleEditContent = (content: Lesson) => {
    setSelectedContent(content);
    setIsContentFormOpen(true);
  };
  
  const handleSaveContent = async (data: any, file: File | null = null) => {
    if (!selectedModuleId) return;
    
    setIsContentSaving(true);
    
    try {
      let fileUrl = null;
      
      // If this is a PDF upload and we have a file
      if (data.type === 'pdf' && file) {
        fileUrl = await uploadPdfFile(file);
      }
      
      if (selectedContent) {
        // Update existing content
        await updateLesson(selectedContent.id, {
          title: data.title,
          type: data.type,
          content: data.type === 'text' ? data.content : null,
          file_url: data.type === 'pdf' ? (fileUrl || selectedContent.file_url) : null,
          video_url: data.type === 'video' ? data.video_url : null,
          is_published: data.is_published,
        });
        toast({
          title: "Conteúdo atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create new content
        await createLesson({
          module_id: selectedModuleId,
          title: data.title,
          type: data.type,
          content: data.type === 'text' ? data.content : null,
          file_url: data.type === 'pdf' ? fileUrl : null,
          video_url: data.type === 'video' ? data.video_url : null,
          is_published: data.is_published,
        });
        toast({
          title: "Conteúdo criado",
          description: "Novo conteúdo adicionado com sucesso.",
        });
      }
      
      // Refetch lessons and close the form
      await refetchLessons();
      setIsContentFormOpen(false);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar conteúdo",
        description: "Ocorreu um erro ao salvar o conteúdo. Tente novamente.",
      });
    } finally {
      setIsContentSaving(false);
    }
  };
  
  const handleDeleteContent = async (lessonId: string) => {
    await deleteLesson(lessonId);
    await refetchLessons();
  };
  
  const handleReorderContent = async (lessonOrder: { id: string; order: number }[]) => {
    await reorderLessons(selectedModuleId!, lessonOrder);
    await refetchLessons();
  };
  
  const handleTogglePublish = async (lessonId: string, isPublished: boolean) => {
    await updateLesson(lessonId, { is_published: isPublished });
    await refetchLessons();
  };
  
  // Navigation handlers
  const handleBackToCourse = () => {
    navigate(`/mentor/cursos/${courseId}`);
  };
  
  const handleBackToModules = () => {
    setSelectedModuleId(null);
  };
  
  const handleViewCourseDetails = () => {
    navigate(`/mentor/cursos/${courseId}/detalhes`);
  };

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
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
            
            <h1 className="text-2xl font-bold flex items-center">
              {isLoadingCourse ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <>Módulos: {course?.name || 'Carregando...'}</>
              )}
            </h1>
          </div>
          
          <Button onClick={handleViewCourseDetails} variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Ver Detalhes do Curso
          </Button>
        </div>
        
        {selectedModuleId ? (
          <>
            {/* Selected module view - Content Management */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={handleBackToModules}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para todos os módulos
            </Button>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {modules.find(m => m.id === selectedModuleId)?.title || 'Módulo Selecionado'}
              </h2>
              <p className="text-muted-foreground">
                Gerencie o conteúdo deste módulo
              </p>
            </div>
            
            <ContentList
              lessons={lessons}
              isLoading={isLoadingLessons}
              moduleId={selectedModuleId}
              onAddContent={handleAddContent}
              onEditContent={handleEditContent}
              onDeleteContent={handleDeleteContent}
              onReorderContent={handleReorderContent}
              onTogglePublish={handleTogglePublish}
            />
          </>
        ) : (
          /* Module management view */
          <ModuleList
            modules={modules}
            isLoading={isLoadingModules}
            courseId={courseId!}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onReorderModules={handleReorderModules}
            onManageContent={handleManageContent}
          />
        )}
        
        {/* Module Form Dialog */}
        <Dialog open={isModuleFormOpen} onOpenChange={setIsModuleFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedModule ? 'Editar Módulo' : 'Criar Novo Módulo'}
              </DialogTitle>
              <DialogDescription>
                {selectedModule 
                  ? 'Atualize as informações do módulo existente' 
                  : 'Adicione um novo módulo ao seu curso'}
              </DialogDescription>
            </DialogHeader>
            
            <ModuleForm
              courseId={courseId!}
              initialData={selectedModule || undefined}
              onSave={handleSaveModule}
              onCancel={() => setIsModuleFormOpen(false)}
              isSaving={isModuleSaving}
            />
          </DialogContent>
        </Dialog>
        
        {/* Content Form Dialog */}
        <Dialog open={isContentFormOpen} onOpenChange={setIsContentFormOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {selectedContent ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}
              </DialogTitle>
              <DialogDescription>
                {selectedContent 
                  ? 'Atualize as informações do conteúdo existente' 
                  : 'Adicione um novo conteúdo ao seu módulo'}
              </DialogDescription>
            </DialogHeader>
            
            <ContentForm
              moduleId={selectedModuleId!}
              initialData={selectedContent || undefined}
              onSave={handleSaveContent}
              onCancel={() => setIsContentFormOpen(false)}
              isSaving={isContentSaving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseModulesPage;
