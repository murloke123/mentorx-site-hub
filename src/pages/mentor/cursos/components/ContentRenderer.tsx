
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConteudoItemLocal, ModuloItemLocal } from '../types';
import VideoPlayer from '@/components/mentor/content/VideoPlayer';

interface ContentRendererProps {
  currentConteudo: ConteudoItemLocal | null;
  modulos: ModuloItemLocal[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ currentConteudo, modulos }) => {
  if (!currentConteudo) {
    return <p className="text-center text-gray-500 mt-10">Selecione um conteúdo para visualizar.</p>;
  }

  const currentModulo = modulos.find(m => m.id === currentConteudo.modulo_id);

  const renderContent = () => {
    switch (currentConteudo.tipo_conteudo) {
      case 'video':
        return currentConteudo.dados_conteudo?.video_url ? (
          <Card className="mt-4">
            <CardContent className="p-0">
              <VideoPlayer 
                provider={currentConteudo.dados_conteudo.video_url.includes('vimeo') ? 'vimeo' : 'youtube'} 
                url={currentConteudo.dados_conteudo.video_url}
              />
            </CardContent>
          </Card>
        ) : <p>Vídeo indisponível.</p>;
      case 'text':
        return currentConteudo.dados_conteudo?.texto_rico ? (
          <Card className="mt-4">
            <CardHeader><CardTitle>Conteúdo Textual</CardTitle></CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: currentConteudo.dados_conteudo.texto_rico }} />
            </CardContent>
          </Card>
        ) : <p>Texto indisponível.</p>;
      case 'pdf':
        return currentConteudo.dados_conteudo?.pdf_url ? (
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">{currentConteudo.nome_conteudo}</h2>
      <p className="text-sm text-gray-600 mb-4">
        {currentModulo ? `Módulo: ${currentModulo.nome_modulo}` : ''}
      </p>
      {renderContent()}
    </div>
  );
};

export default ContentRenderer;
