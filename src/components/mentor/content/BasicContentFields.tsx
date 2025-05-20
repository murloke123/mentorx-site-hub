import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { ConteudoFormValues } from './types';

interface BasicContentFieldsProps {
  form: UseFormReturn<ConteudoFormValues>;
  isSubmitting: boolean;
}

const BasicContentFields = ({ form, isSubmitting }: BasicContentFieldsProps) => {
  return (
    <>
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
            <div className="flex flex-wrap items-center gap-3">
              <FormLabel className="min-w-24 m-0 whitespace-nowrap">Tipo de Conteúdo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center gap-4"
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
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pdf" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      PDF (Máx. 5MB)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicContentFields;
