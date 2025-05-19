
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Video, File } from 'lucide-react';
import { Lesson, uploadPdfFile } from '@/services/lessonService';

// Regular expression for YouTube and Vimeo URLs
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
const VIMEO_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;

// Define the schema for content form validation
const contentSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  type: z.enum(['text', 'pdf', 'video']),
  content: z.string().optional(),
  video_url: z.string().optional(),
  is_published: z.boolean().default(true),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  moduleId: string;
  initialData?: Partial<Lesson>;
  onSave: (data: ContentFormData, file?: File | null) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const ContentForm = ({ 
  moduleId, 
  initialData, 
  onSave, 
  onCancel, 
  isSaving 
}: ContentFormProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'text' | 'pdf' | 'video'>(
    (initialData?.type as 'text' | 'pdf' | 'video') || 'text'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form with initial data or defaults
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: (initialData?.type as 'text' | 'pdf' | 'video') || 'text',
      content: initialData?.content || '',
      video_url: initialData?.video_url || '',
      is_published: initialData?.is_published ?? true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check if file is PDF
      const file = files[0];
      if (file.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione um arquivo PDF.",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 10MB.",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'text' | 'pdf' | 'video');
    form.setValue('type', value as 'text' | 'pdf' | 'video');
  };

  const validateVideoUrl = (url: string) => {
    if (!url) return true;
    return YOUTUBE_REGEX.test(url) || VIMEO_REGEX.test(url) || 'O URL deve ser do YouTube ou Vimeo';
  };

  const handleSubmit = async (data: ContentFormData) => {
    try {
      await onSave(data, selectedType === 'pdf' ? selectedFile : null);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar conteúdo",
        description: "Ocorreu um erro ao salvar o conteúdo. Tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Conteúdo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Introdução ao Conceito"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Conteúdo</FormLabel>
              <FormControl>
                <Tabs 
                  value={selectedType} 
                  onValueChange={handleTypeChange}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="text" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Texto
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      PDF
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Vídeo
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="mt-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conteúdo</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite o conteúdo aqui..."
                              className="min-h-[200px]"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pdf" className="mt-4">
                    <div className="border rounded-lg p-4">
                      <p className="mb-4 text-sm text-muted-foreground">
                        Selecione um arquivo PDF para upload. Tamanho máximo: 10MB.
                      </p>
                      
                      <input
                        type="file"
                        id="pdf-upload"
                        className="hidden"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      
                      <div className="flex flex-col items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                          disabled={isSaving || isUploading}
                        >
                          Selecionar Arquivo PDF
                        </Button>
                        
                        {selectedFile && (
                          <div className="border rounded p-2 w-full flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <File className="h-4 w-4 text-blue-500" />
                              <span className="text-sm truncate max-w-[200px]">
                                {selectedFile.name}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFile(null)}
                              disabled={isSaving || isUploading}
                            >
                              Remover
                            </Button>
                          </div>
                        )}
                        
                        {initialData?.file_url && !selectedFile && (
                          <div className="border rounded p-2 w-full flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <File className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">Arquivo PDF existente</span>
                            </div>
                            <a 
                              href={initialData.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 text-sm hover:underline"
                            >
                              Visualizar
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="video" className="mt-4">
                    <FormField
                      control={form.control}
                      name="video_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Vídeo (YouTube ou Vimeo)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: https://youtube.com/watch?v=..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-2">
                            Cole o link completo do vídeo do YouTube ou Vimeo.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publicar Conteúdo</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, o conteúdo ficará visível para os alunos
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving || isUploading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving || isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUploading ? 'Enviando...' : 'Salvando...'}
              </>
            ) : (
              initialData?.id ? 'Atualizar Conteúdo' : 'Criar Conteúdo'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
