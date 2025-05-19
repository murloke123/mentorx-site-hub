
import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Module } from '@/services/moduleService';

// Define the schema for module form validation
const moduleSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional(),
  is_free: z.boolean().default(false),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  courseId: string;
  initialData?: Partial<Module>;
  onSave: (data: ModuleFormData) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const ModuleForm = ({ 
  courseId, 
  initialData, 
  onSave, 
  onCancel, 
  isSaving 
}: ModuleFormProps) => {
  const { toast } = useToast();
  
  // Initialize form with initial data or defaults
  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      is_free: initialData?.is_free || false,
    },
  });

  const handleSubmit = async (data: ModuleFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar módulo",
        description: "Ocorreu um erro ao salvar o módulo. Tente novamente.",
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
              <FormLabel>Título do Módulo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Módulo 1: Introdução ao Tema"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Módulo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente o conteúdo deste módulo"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_free"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Módulo Gratuito</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque esta opção para disponibilizar este módulo gratuitamente, mesmo em cursos pagos
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
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : initialData?.id ? 'Atualizar Módulo' : 'Criar Módulo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModuleForm;
