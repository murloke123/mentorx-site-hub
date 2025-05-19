
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import ConteudoForm from './ConteudoForm';

interface ConteudoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  isSubmitting: boolean;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  editingId: string | null;
  conteudoParaEditar: any;
}

const ConteudoDialog = ({
  isOpen,
  onOpenChange,
  isLoading,
  isSubmitting,
  onSubmit,
  onCancel,
  editingId,
  conteudoParaEditar,
}: ConteudoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {editingId ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}
          </DialogTitle>
        </DialogHeader>

        {isLoading && editingId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <ConteudoForm
            onSubmit={onSubmit}
            onCancel={onCancel}
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
  );
};

export default ConteudoDialog;
