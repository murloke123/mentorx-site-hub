
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentorado</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-9 w-28" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (mentorados.length === 0) {
    return (
      <div className="w-full p-6 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Nenhum mentorado encontrado</h3>
          <p className="text-sm text-gray-500 mt-2">
            Não há mentorados cadastrados na plataforma.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentorado</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentorados.map((mentorado) => (
              <TableRow key={mentorado.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mentorado.avatar_url || undefined} alt={mentorado.full_name || 'Mentorado'} />
                      <AvatarFallback>{(mentorado.full_name || 'M')[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mentorado.full_name || 'Sem nome'}</p>
                      <p className="text-xs text-gray-500">Mentorado</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                  {mentorado.bio || 'Sem biografia'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {mentorado.enrollments_count}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteClick(mentorado)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
