import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import MentorSidebar from '@/components/mentor/MentorSidebar';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ModuloForm from '@/components/mentor/modulos/ModuloForm';
import ModuloList from '@/components/mentor/modulos/ModuloList';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  getModulosByCursoId, 
  excluirModulo, 
  criarModulo, 
  atualizarModulo,
  Modulo
} from '@/services/moduloService';
import { toast } from '@/hooks/use-toast';

const ModulosPage = () => {
  const { cursoId } = useParams<{ cursoId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se não tem cursoId
  useEffect(() => {
    if (!cursoId) {
      navigate('/mentor/cursos');
      toast({
        title: 'Erro',
        description: 'ID do curso não fornecido',
        variant: 'destructive',
      });
    }
  }, [cursoId, navigate]);

  // Carregar os módulos do curso
  const { 
    data: modulos = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['modulos', cursoId],
    queryFn: () => cursoId ? getModulosByCursoId(cursoId) : Promise.resolve([]),
    enabled: !!cursoId,
  });

  // Lidar com a criação de um novo módulo
  const handleAddModulo = () => {
    setEditingModulo(null);
    setIsAddModalOpen(true);
  };

  // Lidar com a abertura do modal de edição
  const handleEditModulo = (modulo: Modulo) => {
    setEditingModulo(modulo);
    setIsEditModalOpen(true);
  };

  // Lidar com o envio do formulário de módulo (Criação)
  const handleSubmitAddModulo = async (values: { nome_modulo: string; descricao_modulo?: string }) => {
    if (!cursoId) return;
    
    setIsSubmitting(true);
    try {
      await criarModulo({
        curso_id: cursoId,
        nome_modulo: values.nome_modulo,
        descricao_modulo: values.descricao_modulo,
      });
      
      // Atualizar a lista de módulos
      await queryClient.invalidateQueries({ queryKey: ['modulos', cursoId] });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      toast({
        title: 'Erro ao criar módulo',
        description: 'Não foi possível criar o módulo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lidar com o envio do formulário de módulo (Edição)
  const handleSubmitEditModulo = async (values: { nome_modulo: string; descricao_modulo?: string }) => {
    if (!editingModulo || !cursoId) return;

    setIsSubmitting(true);
    try {
      await atualizarModulo(editingModulo.id, {
        nome_modulo: values.nome_modulo,
        descricao_modulo: values.descricao_modulo,
      });
      
      await queryClient.invalidateQueries({ queryKey: ['modulos', cursoId] });
      setIsEditModalOpen(false);
      setEditingModulo(null);
      toast({
        title: 'Módulo atualizado!',
        description: 'As alterações no módulo foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      toast({
        title: 'Erro ao atualizar módulo',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lidar com a exclusão de um módulo
  const handleDeleteModulo = async (moduloId: string) => {
    if (!cursoId) return;
    
    try {
      await excluirModulo(moduloId);
      // Atualizar a lista de módulos
      await queryClient.invalidateQueries({ queryKey: ['modulos', cursoId] });
    } catch (error) {
      console.error('Erro ao excluir módulo:', error);
      toast({
        title: 'Erro ao excluir módulo',
        description: 'Não foi possível excluir o módulo. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Se houver erro no carregamento
  if (isError) {
    return (
      <div className="flex">
        <MentorSidebar />
        <div className="flex-1 p-6">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-500">Erro ao carregar módulos</h1>
            <p className="mt-2">Não foi possível carregar os módulos deste curso.</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <Breadcrumbs 
          items={[
            { label: 'Meus Cursos', href: '/mentor/cursos' },
            { label: 'Módulos do Curso' }
          ]} 
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-6">Gerenciar Módulos</h1>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <ModuloList 
            modulos={modulos}
            cursoId={cursoId!}
            onAddModulo={handleAddModulo}
            onEditModulo={handleEditModulo}
            onDeleteModulo={handleDeleteModulo}
            isLoading={isLoading}
          />
        )}

        {/* Modal de Adicionar Módulo */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Módulo</DialogTitle>
            </DialogHeader>
            <ModuloForm
              onSubmit={handleSubmitAddModulo}
              onCancel={() => setIsAddModalOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de Editar Módulo */}
        {editingModulo && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Módulo: {editingModulo.nome_modulo}</DialogTitle>
              </DialogHeader>
              <ModuloForm
                onSubmit={handleSubmitEditModulo}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setEditingModulo(null);
                }}
                isSubmitting={isSubmitting}
                initialData={editingModulo}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ModulosPage;
