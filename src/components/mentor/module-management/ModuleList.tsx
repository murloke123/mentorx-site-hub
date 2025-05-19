
import { useState } from 'react';
// Remove the incorrect import: useRouter
import {
  Card,
  CardContent,
  CardDescription,
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
import { ChevronDown, Edit, Trash2, GripVertical, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Module } from '@/services/moduleService';

interface ModuleListProps {
  modules: Module[];
  isLoading: boolean;
  courseId: string;
  onAddModule: () => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => Promise<void>;
  onReorderModules: (moduleOrder: { id: string, order: number }[]) => Promise<void>;
  onManageContent: (moduleId: string) => void;
}

const ModuleList = ({
  modules,
  isLoading,
  courseId,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onReorderModules,
  onManageContent
}: ModuleListProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);

  const handleDeleteClick = (moduleId: string) => {
    setModuleToDelete(moduleId);
  };

  const handleDeleteConfirm = async () => {
    if (!moduleToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDeleteModule(moduleToDelete);
      toast({
        title: "Módulo excluído",
        description: "O módulo foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir módulo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir módulo",
        description: "Ocorreu um erro ao excluir o módulo. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
      setModuleToDelete(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, moduleId: string) => {
    e.dataTransfer.setData('moduleId', moduleId);
    setDraggedModuleId(moduleId);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedModuleId(null);
  };

  const handleDrop = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    const sourceModuleId = e.dataTransfer.getData('moduleId');
    
    if (sourceModuleId === targetModuleId) return;
    
    const sourceIndex = modules.findIndex(m => m.id === sourceModuleId);
    const targetIndex = modules.findIndex(m => m.id === targetModuleId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Create a new order of modules
    const reorderedModules = [...modules];
    const [movedModule] = reorderedModules.splice(sourceIndex, 1);
    reorderedModules.splice(targetIndex, 0, movedModule);
    
    // Update order property
    const moduleOrder = reorderedModules.map((module, index) => ({
      id: module.id,
      order: index
    }));
    
    // Call the reorder callback
    onReorderModules(moduleOrder).catch(error => {
      console.error('Erro ao reordenar módulos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao reordenar módulos",
        description: "Ocorreu um erro ao reordenar os módulos. Tente novamente.",
      });
    });
    
    setIsDragging(false);
    setDraggedModuleId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Módulos do Curso</h2>
        <Button onClick={onAddModule} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Módulo
        </Button>
      </div>
      
      {modules.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Nenhum módulo criado</h3>
          <p className="mt-1 text-gray-500">Crie módulos para organizar o conteúdo do seu curso</p>
          <Button onClick={onAddModule} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Módulo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className={`${
                isDragging && draggedModuleId === module.id 
                  ? 'border-primary bg-primary/10' 
                  : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, module.id)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, module.id)}
            >
              <CardHeader className="py-4 flex flex-row items-center space-y-0">
                <div className="flex-1 flex items-center">
                  <div 
                    className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600"
                    title="Arrastar para reordenar"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    {module.description && (
                      <CardDescription className="line-clamp-1">
                        {module.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {module.is_free && <Badge>Gratuito</Badge>}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditModule(module)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Módulo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageContent(module.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Gerenciar Conteúdo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteClick(module.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Módulo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardFooter className="py-2 pt-0">
                <Button
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => onManageContent(module.id)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerenciar Conteúdo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={moduleToDelete !== null} onOpenChange={(open) => !open && setModuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este módulo e todos os seus conteúdos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir Módulo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModuleList;
