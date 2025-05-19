
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, FileText, FileVideo, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Conteudo } from '@/services/conteudoService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import VideoPlayer from './VideoPlayer';

interface ConteudoListProps {
  conteudos: Conteudo[];
  moduloId: string;
  onAddConteudo: () => void;
  onEditConteudo: (conteudoId: string) => void;
  onDeleteConteudo: (conteudoId: string) => Promise<void>;
  isLoading: boolean;
}

const ConteudoList = ({ 
  conteudos, 
  moduloId, 
  onAddConteudo, 
  onEditConteudo, 
  onDeleteConteudo,
  isLoading 
}: ConteudoListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  const toggleContentExpansion = (contentId: string) => {
    setExpandedContent(expandedContent === contentId ? null : contentId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
        <h3 className="mt-2 text-xl font-medium text-gray-900">
          Carregando conteúdos...
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conteúdos do Módulo</h2>
        <Button onClick={onAddConteudo}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Conteúdo
        </Button>
      </div>

      {conteudos.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            Nenhum conteúdo criado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Crie seu primeiro conteúdo para começar a enriquecer este módulo
          </p>
          <Button onClick={onAddConteudo} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Primeiro Conteúdo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {conteudos.map((conteudo) => (
            <Card key={conteudo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {conteudo.tipo_conteudo === 'texto_rico' ? (
                      <FileText className="h-5 w-5 text-primary" />
                    ) : (
                      <FileVideo className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{conteudo.nome_conteudo}</CardTitle>
                      {conteudo.descricao_conteudo && (
                        <CardDescription className="mt-1">
                          {conteudo.descricao_conteudo}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {conteudo.tipo_conteudo === 'texto_rico' ? 'Texto' : 'Vídeo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {conteudo.tipo_conteudo === 'video_externo' && conteudo.dados_conteudo?.url && (
                  <div className="mb-4">
                    <VideoPlayer 
                      provider={conteudo.dados_conteudo.provider || 'youtube'} 
                      url={conteudo.dados_conteudo.url}
                      height="200px"
                    />
                  </div>
                )}
                
                {conteudo.tipo_conteudo === 'texto_rico' && (
                  <div className="mb-4">
                    {expandedContent === conteudo.id ? (
                      <div 
                        className="border p-4 rounded-md max-h-[300px] overflow-y-auto"
                        dangerouslySetInnerHTML={{ 
                          __html: conteudo.dados_conteudo?.html_content || '<p>Sem conteúdo</p>' 
                        }}
                      />
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => toggleContentExpansion(conteudo.id)}
                        className="w-full text-left justify-start"
                      >
                        Visualizar Conteúdo
                      </Button>
                    )}
                    
                    {expandedContent === conteudo.id && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedContent(null)}
                        className="mt-2"
                      >
                        Ocultar
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir conteúdo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o conteúdo
                          "{conteudo.nome_conteudo}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setDeletingId(conteudo.id);
                            onDeleteConteudo(conteudo.id).finally(() => {
                              setDeletingId(null);
                            });
                          }}
                          disabled={deletingId === conteudo.id}
                        >
                          {deletingId === conteudo.id ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button size="sm" onClick={() => onEditConteudo(conteudo.id)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConteudoList;
