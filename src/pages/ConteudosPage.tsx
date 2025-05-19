
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import MentorSidebar from '@/components/mentor/MentorSidebar';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ConteudoList from '@/components/mentor/content/ConteudoList';
import ConteudoDialog from '@/components/mentor/content/ConteudoDialog';
import ConteudoError from '@/components/mentor/content/ConteudoError';
import ConteudoLoading from '@/components/mentor/content/ConteudoLoading';
import ModuloHeader from '@/components/mentor/content/ModuloHeader';

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

  const handleAddConteudo = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditConteudo = (conteudoId: string) => {
    setEditingId(conteudoId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

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

  const isLoading = isLoadingModulo || isLoadingConteudos;

  if (isError) {
    return (
      <div className="flex">
        <MentorSidebar />
        <div className="flex-1 p-6">
          <ConteudoError onRetry={refetch} />
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
            { label: 'Módulos', href: `/mentor/cursos/${cursoId}/modulos` },
            { label: modulo?.nome_modulo || 'Módulo' }
          ]} 
          className="mb-6"
        />

        <ModuloHeader modulo={modulo} isLoading={isLoadingModulo} />

        {isLoading ? (
          <ConteudoLoading />
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

        <ConteudoDialog
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          isLoading={isLoadingConteudoParaEditar}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitConteudo}
          onCancel={handleCloseModal}
          editingId={editingId}
          conteudoParaEditar={conteudoParaEditar}
        />
      </div>
    </div>
  );
};

export default ConteudosPage;
