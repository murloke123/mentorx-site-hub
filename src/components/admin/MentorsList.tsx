import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { deleteUser } from "@/services/adminService";

interface Mentor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  courses_count: number;
  followers_count: number;
}

interface MentorsListProps {
  mentors: Mentor[];
  isLoading: boolean;
}

const MentorsList = ({ mentors, isLoading }: MentorsListProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleDeleteClick = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedMentorId) return;
    
    try {
      await deleteUser(selectedMentorId);
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      });
      setOpen(false);
      // Lógica para atualizar a lista de mentores após a exclusão
      // Pode ser um refetch dos dados ou uma atualização local do estado
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
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <CardTitle className="text-lg">{mentor.full_name || 'Sem nome'}</CardTitle>
              <CardDescription>Mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-3">
                <Avatar>
                  {mentor.avatar_url ? (
                    <AvatarImage src={mentor.avatar_url} alt={mentor.full_name || 'Mentor'} />
                  ) : (
                    <AvatarFallback>{mentor.full_name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{mentor.full_name || 'Sem nome'}</p>
                  <p className="text-sm text-muted-foreground">
                    {mentor.courses_count} cursos | {mentor.followers_count} seguidores
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {mentor.bio || 'Este mentor não possui biografia.'}
              </p>
            </CardContent>
            <div className="p-6">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => handleDeleteClick(mentor.id)}
              >
                Remover usuário
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente este mentor da plataforma.
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

export default MentorsList;
