
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
import ConteudoForm from '@/components/mentor/content/ConteudoForm';
import ConteudoList from '@/components/mentor/content/ConteudoList';
import { Skeleton } from '@/components/ui/skeleton';
import { getModuloById } from '@/services/moduloService';
import { 
  getConteudosByModuloId, 
  criarConteudoTextoRico,
  criarConteudoVideo,
  getConteudoById,
  atualizarConteudoTextoRico,
  atualizarConteudoVideo,
  excluirConteudo
} from '@/services/conteudoService';
import { toast } from '@/hooks/use-toast';

const ConteudosPage = () => {
  const { cursoId, moduloId } = useParams<{ cursoId: string; moduloId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Redirecionar se não tem ids necessários
  useEffect(() => {
    if (!cursoId || !moduloId) {
      navigate('/mentor/cursos');
      toast({
        title: 'Erro',
        description: 'Informações necessárias não fornecidas',
        variant: 'destructive',
      });
    }
  }, [cursoId, moduloId, navigate]);

  // Carregar os detalhes do módulo
  const { 
    data: modulo,
    isLoading: isLoadingModulo,
  } = useQuery({
    queryKey: ['modulo', moduloId],
    queryFn: () => moduloId ? getModuloById(moduloId) : Promise.resolve(null),
    enabled: !!moduloId,
  });

  // Carregar os conteúdos do módulo
  const { 
    data: conteudos = [], 
    isLoading: isLoadingConteudos, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['conteudos', moduloId],
    queryFn: () => moduloId ? getConteudosByModuloId(moduloId) : Promise.resolve([]),
    enabled: !!moduloId,
  });

  // Carregar conteúdo específico para edição
  const { 
    data: conteudoParaEditar,
    isLoading: isLoadingConteudoParaEditar 
  } = useQuery({
    queryKey: ['conteudo', editingId],
    queryFn: () => editingId ? getConteudoById(editingId) : Promise.resolve(null),
    enabled: !!editingId,
  });

  // Lidar com a adição de um novo conteúdo
  const handleAddConteudo = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Lidar com a edição de um conteúdo existente
  const handleEditConteudo = (conteudoId: string) => {
    setEditingId(conteudoId);
    setIsModalOpen(true);
  };

  // Lidar com o envio do formulário de conteúdo
  const handleSubmitConteudo = async (values: {
    nome_conteudo: string;
    descricao_conteudo?: string;
    tipo_conteudo: 'texto_rico' | 'video_externo';
    html_content?: string;
    video_url?: string;
    provider?: 'youtube' | 'vimeo';
  }) => {
    if (!moduloId) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        // Atualizar conteúdo existente
        if (values.tipo_conteudo === 'texto_rico') {
          await atualizarConteudoTextoRico(editingId, {
            nome_conteudo: values.nome_conteudo,
            descricao_conteudo: values.descricao_conteudo,
            html_content: values.html_content,
          });
        } else {
          await atualizarConteudoVideo(editingId, {
            nome_conteudo: values.nome_conteudo,
            descricao_conteudo: values.descricao_conteudo,
            provider: values.provider,
            url: values.video_url,
          });
        }
      } else {
        // Criar novo conteúdo
        if (values.tipo_conteudo === 'texto_rico') {
          await criarConteudoTextoRico({
            modulo_id: moduloId,
            nome_conteudo: values.nome_conteudo,
            descricao_conteudo: values.descricao_conteudo,
            html_content: values.html_content || '<p>Conteúdo em branco</p>',
          });
        } else {
          await criarConteudoVideo({
            modulo_id: moduloId,
            nome_conteudo: values.nome_conteudo,
            descricao_conteudo: values.descricao_conteudo,
            provider: values.provider || 'youtube',
            url: values.video_url || '',
          });
        }
      }
      
      // Atualizar a lista de conteúdos
      await queryClient.invalidateQueries({ queryKey: ['conteudos', moduloId] });
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast({
        title: 'Erro ao salvar conteúdo',
        description: 'Não foi possível salvar o conteúdo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lidar com a exclusão de um conteúdo
  const handleDeleteConteudo = async (conteudoId: string) => {
    if (!moduloId) return;
    
    try {
      await excluirConteudo(conteudoId);
      // Atualizar a lista de conteúdos
      await queryClient.invalidateQueries({ queryKey: ['conteudos', moduloId] });
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast({
        title: 'Erro ao excluir conteúdo',
        description: 'Não foi possível excluir o conteúdo. Tente novamente.',
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
            <h1 className="text-2xl font-bold text-red-500">Erro ao carregar conteúdos</h1>
            <p className="mt-2">Não foi possível carregar os conteúdos deste módulo.</p>
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

  const isLoading = isLoadingModulo || isLoadingConteudos;

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <Breadcrumbs 
          items={[
            { label: 'Meus Cursos', href: '/mentor/cursos' },
            { label: 'Módulos', href: `/mentor/cursos/${cursoId}/modulos` },
            { label: modulo?.nome_modulo || 'Módulo' }
          ]} 
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">
          {isLoadingModulo ? <Skeleton className="h-9 w-64" /> : modulo?.nome_modulo}
        </h1>
        
        {modulo?.descricao_modulo && (
          <p className="text-muted-foreground mb-6">
            {modulo.descricao_modulo}
          </p>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <ConteudoList 
            conteudos={conteudos}
            moduloId={moduloId!}
            onAddConteudo={handleAddConteudo}
            onEditConteudo={handleEditConteudo}
            onDeleteConteudo={handleDeleteConteudo}
            isLoading={isLoading}
          />
        )}

        <Dialog 
          open={isModalOpen} 
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingId(null);
          }}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}
              </DialogTitle>
            </DialogHeader>
            
            {isLoadingConteudoParaEditar && editingId ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <ConteudoForm
                onSubmit={handleSubmitConteudo}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                isSubmitting={isSubmitting}
                initialData={editingId ? {
                  nome_conteudo: conteudoParaEditar?.nome_conteudo,
                  descricao_conteudo: conteudoParaEditar?.descricao_conteudo,
                  tipo_conteudo: conteudoParaEditar?.tipo_conteudo,
                  html_content: conteudoParaEditar?.dados_conteudo?.html_content,
                  video_url: conteudoParaEditar?.dados_conteudo?.url,
                  provider: conteudoParaEditar?.dados_conteudo?.provider,
                } : undefined}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ConteudosPage;
