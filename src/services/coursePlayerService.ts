import { supabase } from "@/integrations/supabase/client";

export interface Modulo {
  id: string;
  nome_modulo: string;
  descricao: string | null;
  ordem: number;
  curso_id: string;
  created_at: string;
  updated_at: string;
  conteudos?: Conteudo[];
}

// Update the Conteudo type to match what's needed
interface DadosConteudo {
  video_url?: string;
  texto_rico?: string;
  pdf_url?: string;
  pdf_filename?: string;
}

export interface Conteudo {
  id: string;
  nome_conteudo: string;
  tipo_conteudo: "video" | "text" | "pdf";
  dados_conteudo: DadosConteudo;
  ordem: number;
  modulo_id: string;
  created_at: string;
  updated_at: string;
}

export const getCourseModules = async (courseId: string) => {
  try {
    const { data: modulos, error } = await supabase
      .from('modulos')
      .select(`
        *,
        conteudos (
          *
        )
      `)
      .eq('curso_id', courseId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error("Erro ao buscar módulos:", error);
      return [];
    }

    return mapModulos(modulos);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    return [];
  }
};

// Update the mapConteudo function to properly handle the datos_conteudo type conversion
const mapConteudo = (conteudo: any): Conteudo => {
  return {
    ...conteudo,
    tipo_conteudo: conteudo.tipo_conteudo as "video" | "text" | "pdf",
    dados_conteudo: typeof conteudo.dados_conteudo === 'string'
      ? JSON.parse(conteudo.dados_conteudo)
      : conteudo.dados_conteudo
  };
};

// Then update the part where you map modulos to properly map conteudos
export const mapModulos = (modulosData: any): Modulo[] => {
  if (!modulosData) return [];
  
  return modulosData.map((modulo: any) => ({
    ...modulo,
    conteudos: modulo.conteudos ? modulo.conteudos.map(mapConteudo) : []
  }));
};
