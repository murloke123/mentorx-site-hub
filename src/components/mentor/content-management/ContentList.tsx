
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronDown, Edit, Trash2, GripVertical, Plus, File, FileText, Video, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lesson } from '@/services/lessonService';

interface ContentListProps {
  lessons: Lesson[];
  isLoading: boolean;
  moduleId: string;
  onAddContent: () => void;
  onEditContent: (lesson: Lesson) => void;
  onDeleteContent: (lessonId: string) => Promise<void>;
  onReorderContent: (lessonOrder: { id: string, order: number }[]) => Promise<void>;
  onTogglePublish: (lessonId: string, isPublished: boolean) => Promise<void>;
}

const ContentList = ({
  lessons,
  isLoading,
  moduleId,
  onAddContent,
  onEditContent,
  onDeleteContent,
  onReorderContent,
  onTogglePublish
}: ContentListProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLessonId, setDraggedLessonId] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId);
  };

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDeleteContent(lessonToDelete);
      toast({
        title: "Conteúdo excluído",
        description: "O conteúdo foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir conteúdo",
        description: "Ocorreu um erro ao excluir o conteúdo. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
      setLessonToDelete(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, lessonId: string) => {
    e.dataTransfer.setData('lessonId', lessonId);
    setDraggedLessonId(lessonId);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedLessonId(null);
  };

  const handleDrop = (e: React.DragEvent, targetLessonId: string) => {
    e.preventDefault();
    const sourceLessonId = e.dataTransfer.getData('lessonId');
    
    if (sourceLessonId === targetLessonId) return;
    
    const sourceIndex = lessons.findIndex(l => l.id === sourceLessonId);
    const targetIndex = lessons.findIndex(l => l.id === targetLessonId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Create a new order of lessons
    const reorderedLessons = [...lessons];
    const [movedLesson] = reorderedLessons.splice(sourceIndex, 1);
    reorderedLessons.splice(targetIndex, 0, movedLesson);
    
    // Update order property
    const lessonOrder = reorderedLessons.map((lesson, index) => ({
      id: lesson.id,
      order: index
    }));
    
    // Call the reorder callback
    onReorderContent(lessonOrder).catch(error => {
      console.error('Erro ao reordenar conteúdos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao reordenar conteúdos",
        description: "Ocorreu um erro ao reordenar os conteúdos. Tente novamente.",
      });
    });
    
    setIsDragging(false);
    setDraggedLessonId(null);
  };

  const handleTogglePublish = async (lessonId: string, currentState: boolean) => {
    setIsToggling(lessonId);
    try {
      await onTogglePublish(lessonId, !currentState);
      toast({
        title: !currentState ? "Conteúdo publicado" : "Conteúdo despublicado",
        description: !currentState 
          ? "O conteúdo agora está visível para os alunos." 
          : "O conteúdo não está mais visível para os alunos.",
      });
    } catch (error) {
      console.error('Erro ao alterar estado de publicação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar visibilidade",
        description: "Ocorreu um erro ao alterar a visibilidade do conteúdo.",
      });
    } finally {
      setIsToggling(null);
    }
  };

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Conteúdo do Módulo</h2>
        <Button onClick={onAddContent} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Conteúdo
        </Button>
      </div>
      
      {lessons.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Nenhum conteúdo adicionado</h3>
          <p className="mt-1 text-gray-500">Adicione conteúdo ao seu módulo para enriquecer seu curso</p>
          <Button onClick={onAddContent} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Conteúdo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card 
              key={lesson.id}
              className={`${
                isDragging && draggedLessonId === lesson.id 
                  ? 'border-primary bg-primary/10' 
                  : !lesson.is_published ? 'border-gray-200 bg-gray-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, lesson.id)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, lesson.id)}
            >
              <CardHeader className="py-3 px-4 flex flex-row items-center space-y-0">
                <div className="flex-1 flex items-center">
                  <div 
                    className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600"
                    title="Arrastar para reordenar"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="mr-3">
                    {getContentTypeIcon(lesson.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant={lesson.type === 'text' ? 'default' : lesson.type === 'pdf' ? 'destructive' : 'secondary'}>
                        {lesson.type === 'text' ? 'Texto' : lesson.type === 'pdf' ? 'PDF' : 'Vídeo'}
                      </Badge>
                      {!lesson.is_published && (
                        <Badge variant="outline" className="text-gray-500">
                          Não Publicado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(lesson.id, lesson.is_published)}
                    disabled={!!isToggling}
                    title={lesson.is_published ? "Despublicar" : "Publicar"}
                  >
                    {isToggling === lesson.id ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                    ) : lesson.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditContent(lesson)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Conteúdo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteClick(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Conteúdo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={lessonToDelete !== null} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir Conteúdo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentList;
