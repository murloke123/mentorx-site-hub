import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { ConteudoFormValues } from './types';
import BasicContentFields from './BasicContentFields';
import TextContentField from './TextContentField';
import VideoContentField from './VideoContentField';
import PdfContentField from './PdfContentField';
import { ConteudoFormProps, conteudoSchema } from './types';
import { useToast } from '@/hooks/use-toast';

const ConteudoForm = ({ onSubmit, initialData, isSubmitting, onCancel }: ConteudoFormProps) => {
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState(initialData?.html_content || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [provider, setProvider] = useState<'youtube' | 'vimeo'>(initialData?.provider || 'youtube');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | undefined>(initialData?.pdf_url);
  const [existingPdfFilename, setExistingPdfFilename] = useState<string | undefined>(initialData?.pdf_filename);
  
  const form = useForm<ConteudoFormValues>({
    resolver: zodResolver(conteudoSchema),
    defaultValues: {
      nome_conteudo: initialData?.nome_conteudo || '',
      descricao_conteudo: initialData?.descricao_conteudo || '',
      tipo_conteudo: initialData?.tipo_conteudo || 'texto_rico',
      html_content: initialData?.html_content || '',
      video_url: initialData?.video_url || '',
      pdf_url: initialData?.pdf_url,
      pdf_filename: initialData?.pdf_filename,
    },
  });

  const tipoConteudo = form.watch('tipo_conteudo');

  useEffect(() => {
    if (initialData) {
      form.reset({
        nome_conteudo: initialData.nome_conteudo || '',
        descricao_conteudo: initialData.descricao_conteudo || '',
        tipo_conteudo: initialData.tipo_conteudo || 'texto_rico',
        html_content: initialData.html_content || '',
        video_url: initialData.video_url || '',
        pdf_url: initialData.pdf_url,
        pdf_filename: initialData.pdf_filename,
      });
      setHtmlContent(initialData.html_content || '');
      setVideoUrl(initialData.video_url || '');
      setProvider(initialData.provider || 'youtube');
      setExistingPdfUrl(initialData.pdf_url);
      setExistingPdfFilename(initialData.pdf_filename);
      setPdfFile(null);
    } else {
      form.reset({
        nome_conteudo: '',
        descricao_conteudo: '',
        tipo_conteudo: 'texto_rico',
        html_content: '',
        video_url: '',
        pdf_url: undefined,
        pdf_filename: undefined,
      });
      setHtmlContent('');
      setVideoUrl('');
      setProvider('youtube');
      setExistingPdfUrl(undefined);
      setExistingPdfFilename(undefined);
      setPdfFile(null);
    }
  }, [initialData, form.reset]);

  const handleVideoChange = (url: string, videoProvider: 'youtube' | 'vimeo') => {
    setVideoUrl(url);
    setProvider(videoProvider);
  };

  const handlePdfFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo PDF muito grande",
          description: "O tamanho máximo permitido para o PDF é de 5MB.",
          variant: "destructive",
        });
        setPdfFile(null);
        form.setValue('pdf_file', null);
        return;
      }
      if (file.type !== 'application/pdf') {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        });
        setPdfFile(null);
        form.setValue('pdf_file', null);
        return;
      }
    }
    setPdfFile(file);
    form.setValue('pdf_file', file);
    if (file) {
      setExistingPdfUrl(undefined);
      setExistingPdfFilename(undefined);
    }
  };

  const handleSubmit = async (values: ConteudoFormValues) => {
    const submissionData = {
      ...values,
      provider: values.tipo_conteudo === 'video_externo' ? provider : undefined,
      html_content: values.tipo_conteudo === 'texto_rico' ? htmlContent : undefined,
      video_url: values.tipo_conteudo === 'video_externo' ? videoUrl : undefined,
      pdf_file: values.tipo_conteudo === 'pdf' ? pdfFile : undefined,
      pdf_url: (values.tipo_conteudo === 'pdf' && !pdfFile && existingPdfUrl) ? existingPdfUrl : undefined,
      pdf_filename: (values.tipo_conteudo === 'pdf' && !pdfFile && existingPdfFilename) ? existingPdfFilename : undefined,
    };
    
    await onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
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

              {tipoConteudo === 'pdf' && (
                <PdfContentField 
                  onFileChange={handlePdfFileChange}
                  isSubmitting={isSubmitting}
                  selectedFile={pdfFile}
                  existingPdfUrl={existingPdfUrl}
                  existingPdfFilename={existingPdfFilename}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end space-x-2 py-4 px-4 border-t bg-background mt-auto">
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
