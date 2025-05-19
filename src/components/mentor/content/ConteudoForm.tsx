
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import VideoPlayer from './VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const conteudoSchema = z.object({
  nome_conteudo: z.string().min(3, { message: 'O nome do conteúdo deve ter pelo menos 3 caracteres' }),
  descricao_conteudo: z.string().optional(),
  tipo_conteudo: z.enum(['texto_rico', 'video_externo']),
  html_content: z.string().optional(),
  video_url: z.string().optional(),
});

type ConteudoFormValues = z.infer<typeof conteudoSchema>;

interface ConteudoFormProps {
  onSubmit: (values: ConteudoFormValues & { provider?: 'youtube' | 'vimeo' }) => Promise<void>;
  initialData?: {
    nome_conteudo?: string;
    descricao_conteudo?: string;
    tipo_conteudo?: 'texto_rico' | 'video_externo';
    html_content?: string;
    video_url?: string;
    provider?: 'youtube' | 'vimeo';
  };
  isSubmitting: boolean;
  onCancel: () => void;
}

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

  const detectVideoProvider = (url: string): 'youtube' | 'vimeo' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'youtube'; // Padrão se não conseguir detectar
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

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    if (url) {
      setProvider(detectVideoProvider(url));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            <FormField
              control={form.control}
              name="nome_conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Conteúdo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do conteúdo" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao_conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva brevemente este conteúdo (opcional)"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_conteudo"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="min-w-32 m-0">Tipo de Conteúdo</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row items-center gap-6"
                        disabled={isSubmitting}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="texto_rico" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Texto com Imagens
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="video_externo" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Vídeo (YouTube/Vimeo)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipoConteudo === 'texto_rico' && (
              <div className="space-y-2">
                <FormLabel>Conteúdo</FormLabel>
                <RichTextEditor initialValue={htmlContent} onChange={setHtmlContent} />
              </div>
            )}

            {tipoConteudo === 'video_externo' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>URL do Vídeo</FormLabel>
                  <Input 
                    placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    value={videoUrl}
                    onChange={handleVideoUrlChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Cole o link completo do seu vídeo do YouTube ou Vimeo.
                  </p>
                </div>

                {videoUrl && (
                  <Card>
                    <CardContent className="pt-6">
                      <VideoPlayer provider={provider} url={videoUrl} />
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="youtube" value={provider} onValueChange={(value) => setProvider(value as 'youtube' | 'vimeo')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="vimeo">Vimeo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="youtube" className="p-4 border rounded-md mt-2">
                    <h4 className="text-sm font-medium mb-2">Como obter o link do YouTube:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                      <li>Vá até o vídeo no YouTube</li>
                      <li>Clique em 'Compartilhar' abaixo do vídeo</li>
                      <li>Copie o link fornecido</li>
                    </ol>
                  </TabsContent>
                  <TabsContent value="vimeo" className="p-4 border rounded-md mt-2">
                    <h4 className="text-sm font-medium mb-2">Como obter o link do Vimeo:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                      <li>Abra o vídeo no Vimeo</li>
                      <li>Clique no ícone de 'Compartilhar' (geralmente um avião de papel)</li>
                      <li>Copie o link da seção 'Link'</li>
                    </ol>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4">
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
