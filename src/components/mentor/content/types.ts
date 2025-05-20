import { z } from 'zod';

export const conteudoSchema = z.object({
  nome_conteudo: z.string().min(3, { message: 'O nome do conteúdo deve ter pelo menos 3 caracteres' }),
  descricao_conteudo: z.string().optional(),
  tipo_conteudo: z.enum(['texto_rico', 'video_externo', 'pdf']),
  html_content: z.string().optional(),
  video_url: z.string().optional(),
});

export type ConteudoFormValues = z.infer<typeof conteudoSchema> & {
  pdf_file?: File | null;
  pdf_url?: string;
  pdf_filename?: string;
};

export interface ConteudoFormProps {
  onSubmit: (values: ConteudoFormValues & { provider?: 'youtube' | 'vimeo'; pdf_file?: File | null }) => Promise<void>;
  initialData?: {
    nome_conteudo?: string;
    descricao_conteudo?: string;
    tipo_conteudo?: 'texto_rico' | 'video_externo' | 'pdf';
    html_content?: string;
    video_url?: string;
    provider?: 'youtube' | 'vimeo';
    pdf_url?: string;
    pdf_filename?: string;
  };
  isSubmitting: boolean;
  onCancel: () => void;
}
