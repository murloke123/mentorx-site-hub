
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { conteudoSchema, ConteudoFormProps, ConteudoFormValues } from './types';
import BasicContentFields from './BasicContentFields';
import TextContentField from './TextContentField';
import VideoContentField from './VideoContentField';

const ConteudoForm = ({ onSubmit, initialData, isSubmitting, onCancel }: ConteudoFormProps) => {
  const [htmlContent, setHtmlContent] = useState(initialData?.html_content || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [provider, setProvider] = useState<'youtube' | 'vimeo'>(initialData?.provider || 'youtube');
  
  const form = useForm<ConteudoFormValues>({
    resolver: zodResolver(conteudoSchema),
    defaultValues: {
      nome_conteudo: initialData?.nome_conteudo || '',
      descricao_conteudo: initialData?.descricao_conteudo || '',
      tipo_conteudo: initialData?.tipo_conteudo || 'texto_rico',
      html_content: initialData?.html_content || '',
      video_url: initialData?.video_url || '',
    },
  });

  const tipoConteudo = form.watch('tipo_conteudo');

  const handleVideoChange = (url: string, videoProvider: 'youtube' | 'vimeo') => {
    setVideoUrl(url);
    setProvider(videoProvider);
  };

  const handleSubmit = async (values: ConteudoFormValues) => {
    const submissionData = {
      ...values,
      provider: values.tipo_conteudo === 'video_externo' ? provider : undefined,
      html_content: values.tipo_conteudo === 'texto_rico' ? htmlContent : undefined,
      video_url: values.tipo_conteudo === 'video_externo' ? videoUrl : undefined,
    };
    
    await onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full relative">
        <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(70vh - 100px)' }}>
          <ScrollArea className="h-full pr-4 pb-4">
            <div className="space-y-6 px-4 py-2 w-full max-w-3xl mx-auto">
              <BasicContentFields form={form} isSubmitting={isSubmitting} />

              {tipoConteudo === 'texto_rico' && (
                <TextContentField 
                  initialValue={htmlContent} 
                  onChange={setHtmlContent}
                  isSubmitting={isSubmitting}
                />
              )}

              {tipoConteudo === 'video_externo' && (
                <VideoContentField
                  initialUrl={videoUrl}
                  initialProvider={provider}
                  onChange={handleVideoChange}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end space-x-2 py-4 px-4 border-t bg-background sticky bottom-0 left-0 right-0 mt-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar Conteúdo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConteudoForm;
