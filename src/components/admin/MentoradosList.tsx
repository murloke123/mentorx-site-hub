
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/services/adminService";

interface Mentorado {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  enrollments_count: number;
}

interface MentoradosListProps {
  mentorados: Mentorado[];
  isLoading: boolean;
  onDelete?: () => void;
}

const MentoradosList = ({ mentorados, isLoading, onDelete }: MentoradosListProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMentorado, setSelectedMentorado] = useState<Mentorado | null>(null);
  const { toast } = useToast();
  
  const handleDeleteClick = (mentorado: Mentorado) => {
    setSelectedMentorado(mentorado);
    setOpenDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedMentorado) return;
    
    try {
      await deleteUser(selectedMentorado.id);
      toast({
        title: "Mentorado removido",
        description: `${selectedMentorado.full_name || 'O mentorado'} foi removido com sucesso.`,
      });
      setOpenDeleteDialog(false);
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover mentorado",
        description: error.message || "Ocorreu um erro ao tentar remover o mentorado.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (mentorados.length === 0) {
    return (
      <Card className="w-full p-6 flex items-center justify-center bg-gray-50 border-dashed">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Nenhum mentorado encontrado</h3>
          <p className="text-sm text-gray-500 mt-2">
            Não há mentorados cadastrados na plataforma.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentorados.map((mentorado) => (
          <Card key={mentorado.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentorado.avatar_url || undefined} alt={mentorado.full_name || 'Mentorado'} />
                    <AvatarFallback>{(mentorado.full_name || 'M')[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{mentorado.full_name || 'Sem nome'}</CardTitle>
                    <CardDescription className="mt-1">Mentorado</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-3 h-12">
                {mentorado.bio || 'Este mentorado ainda não adicionou uma biografia.'}
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {mentorado.enrollments_count} cursos matriculados
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => handleDeleteClick(mentorado)}
              >
                Remover mentorado
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o mentorado{" "}
              <strong>{selectedMentorado?.full_name}</strong> e todos os seus dados da plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MentoradosList;
