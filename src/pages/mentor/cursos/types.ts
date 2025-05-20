export interface ConteudoItemLocal {
  id: string;
  nome_conteudo: string;
  tipo_conteudo: 'video_externo' | 'texto_rico' | 'pdf';
  dados_conteudo: {
    url?: string;
    html_content?: string;
    pdf_url?: string;
    pdf_filename?: string;
    provider?: 'youtube' | 'vimeo';
  };
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export interface ModuloItemLocal {
  id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos: ConteudoItemLocal[];
}

export interface CursoItemLocal {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  mentor_id: string;
  modulos: ModuloItemLocal[];
}
