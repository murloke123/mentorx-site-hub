import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ConteudoItemLocal, ModuloItemLocal } from '../types';
import VideoPlayer from '@/components/mentor/content/VideoPlayer';

interface ContentRendererProps {
  currentConteudo: ConteudoItemLocal | null;
  modulos: ModuloItemLocal[];
  onNextContent: () => void;
  onPreviousContent: () => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  currentConteudo, 
  modulos,
  onNextContent,
  onPreviousContent
}) => {
  if (!currentConteudo) {
    return <p className="text-center text-gray-500 mt-10">Selecione um conteúdo para visualizar.</p>;
  }

  // Make sure modulos is defined and is an array before using find
  const currentModulo = Array.isArray(modulos) ? 
    modulos.find(m => m.id === currentConteudo.modulo_id) : 
    undefined;

  const renderContent = () => {
    if (!currentConteudo.dados_conteudo) {
      return <p className="text-gray-500">Dados de conteúdo não disponíveis.</p>;
    }

    switch (currentConteudo.tipo_conteudo) {
      case 'video_externo':
        return currentConteudo.dados_conteudo.url ? (
          <Card className="mt-4 overflow-hidden">
            <CardContent className="p-0">
              <VideoPlayer 
                provider={currentConteudo.dados_conteudo.provider || 'youtube'} 
                url={currentConteudo.dados_conteudo.url}
              />
            </CardContent>
          </Card>
        ) : <p>Vídeo indisponível.</p>;
      
      case 'texto_rico':
        return currentConteudo.dados_conteudo.html_content ? (
          <Card className="mt-4">
            <CardContent className="py-6 px-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: currentConteudo.dados_conteudo.html_content }} 
              />
            </CardContent>
          </Card>
        ) : <p>Texto indisponível.</p>;
      
      case 'pdf':
        return currentConteudo.dados_conteudo.pdf_url ? (
           <Card className="mt-4">
            <CardHeader><CardTitle>{currentConteudo.dados_conteudo.pdf_filename || "Documento PDF"}</CardTitle></CardHeader>
            <CardContent>
              <iframe src={currentConteudo.dados_conteudo.pdf_url} width="100%" height="600px" title={currentConteudo.dados_conteudo.pdf_filename || "PDF Viewer"}></iframe>
            </CardContent>
          </Card>
        ) : <p>PDF indisponível.</p>;
      
      default:
        return <p>Tipo de conteúdo não suportado.</p>;
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{currentConteudo.nome_conteudo}</h2>
          <p className="text-sm text-gray-600">
            {currentModulo ? `Módulo: ${currentModulo.nome_modulo}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onPreviousContent} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button 
            onClick={onNextContent} 
            className="flex items-center gap-2"
          >
            Próximo <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentRenderer;
