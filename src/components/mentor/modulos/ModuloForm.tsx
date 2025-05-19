
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const moduloSchema = z.object({
  nome_modulo: z.string().min(3, { message: 'O nome do módulo deve ter pelo menos 3 caracteres' }),
  descricao_modulo: z.string().optional(),
});

type ModuloFormValues = z.infer<typeof moduloSchema>;

interface ModuloFormProps {
  onSubmit: (values: ModuloFormValues) => Promise<void>;
  initialData?: {
    nome_modulo?: string;
    descricao_modulo?: string;
  };
  isSubmitting: boolean;
  onCancel: () => void;
}

const ModuloForm = ({ onSubmit, initialData, isSubmitting, onCancel }: ModuloFormProps) => {
  const form = useForm<ModuloFormValues>({
    resolver: zodResolver(moduloSchema),
    defaultValues: {
      nome_modulo: initialData?.nome_modulo || '',
      descricao_modulo: initialData?.descricao_modulo || '',
    },
  });

  const handleSubmit = async (values: ModuloFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome_modulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Módulo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do módulo" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao_modulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente este módulo (opcional)"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
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
            {isSubmitting ? 'Salvando...' : 'Salvar Módulo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModuloForm;
