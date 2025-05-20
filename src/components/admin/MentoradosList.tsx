import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, User, Users } from "lucide-react";
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

interface Mentoree {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  enrollments_count: number;
}

interface MentoradosListProps {
  mentorados: Mentoree[];
  isLoading: boolean;
}

const MentoradosList = ({ mentorados, isLoading }: MentoradosListProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Mentoree | null>(null);
  const { toast } = useToast();
  
  const handleDeleteClick = (user: Mentoree) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      toast({
        title: "Usuário removido",
        description: `O usuário "${selectedUser.full_name}" foi removido com sucesso.`,
      });
      setOpenDeleteDialog(false);
      //if (onDelete) onDelete(); // If you need to refresh the list after deletion
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover usuário",
        description: error.message || "Ocorreu um erro ao tentar remover o usuário.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 mb-3" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
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
          <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
          <p className="text-sm text-gray-500 mt-2">
            Não há usuários cadastrados na plataforma.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentorados.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">{user.full_name || 'Sem nome'}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <User className="h-3 w-3" /> {user.bio || 'Sem bio'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <Users className="h-3 w-3" /> 
                  <span>{user.enrollments_count} matrículas</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => handleDeleteClick(user)}
              >
                Remover usuário
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
              Esta ação não pode ser desfeita. Isso removerá permanentemente o usuário{" "}
              <strong>"{selectedUser?.full_name}"</strong> da plataforma.
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
