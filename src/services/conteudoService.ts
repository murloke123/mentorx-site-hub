
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Conteudo {
  id: string;
  modulo_id: string;
  nome_conteudo: string;
  descricao_conteudo?: string;
  tipo_conteudo: 'texto_rico' | 'video_externo';
  dados_conteudo?: {
    html_content?: string;
    provider?: 'youtube' | 'vimeo';
    url?: string;
  };
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Obter todos os conteúdos de um módulo
export async function getConteudosByModuloId(moduloId: string): Promise<Conteudo[]> {
  try {
    const { data, error } = await supabase
      .from("conteudos")
      .select("*")
      .eq("modulo_id", moduloId)
      .order("ordem", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
    toast({
      title: "Erro ao carregar conteúdos",
      description: "Não foi possível carregar os conteúdos deste módulo.",
      variant: "destructive",
    });
    return [];
  }
}

// Obter um conteúdo específico por ID
export async function getConteudoById(conteudoId: string): Promise<Conteudo | null> {
  try {
    const { data, error } = await supabase
      .from("conteudos")
      .select("*")
      .eq("id", conteudoId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    toast({
      title: "Erro ao carregar conteúdo",
      description: "Não foi possível carregar os detalhes do conteúdo.",
      variant: "destructive",
    });
    return null;
  }
}

// Criar um novo conteúdo de texto rico
export async function criarConteudoTextoRico(dados: {
  modulo_id: string;
  nome_conteudo: string;
  descricao_conteudo?: string;
  html_content: string;
}): Promise<Conteudo | null> {
  try {
    // Verificar a ordem máxima atual para o módulo
    const { data: conteudosExistentes } = await supabase
      .from("conteudos")
      .select("ordem")
      .eq("modulo_id", dados.modulo_id)
      .order("ordem", { ascending: false })
      .limit(1);

    const novaOrdem = conteudosExistentes && conteudosExistentes.length > 0 
      ? conteudosExistentes[0].ordem + 1 
      : 0;

    const { data, error } = await supabase
      .from("conteudos")
      .insert({
        modulo_id: dados.modulo_id,
        nome_conteudo: dados.nome_conteudo,
        descricao_conteudo: dados.descricao_conteudo,
        tipo_conteudo: 'texto_rico',
        dados_conteudo: {
          html_content: dados.html_content
        },
        ordem: novaOrdem,
      })
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Conteúdo criado com sucesso",
      description: "O conteúdo de texto foi adicionado ao módulo.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    toast({
      title: "Erro ao criar conteúdo",
      description: "Não foi possível criar o conteúdo. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Criar um novo conteúdo de vídeo
export async function criarConteudoVideo(dados: {
  modulo_id: string;
  nome_conteudo: string;
  descricao_conteudo?: string;
  provider: 'youtube' | 'vimeo';
  url: string;
}): Promise<Conteudo | null> {
  try {
    // Verificar a ordem máxima atual para o módulo
    const { data: conteudosExistentes } = await supabase
      .from("conteudos")
      .select("ordem")
      .eq("modulo_id", dados.modulo_id)
      .order("ordem", { ascending: false })
      .limit(1);

    const novaOrdem = conteudosExistentes && conteudosExistentes.length > 0 
      ? conteudosExistentes[0].ordem + 1 
      : 0;

    const { data, error } = await supabase
      .from("conteudos")
      .insert({
        modulo_id: dados.modulo_id,
        nome_conteudo: dados.nome_conteudo,
        descricao_conteudo: dados.descricao_conteudo,
        tipo_conteudo: 'video_externo',
        dados_conteudo: {
          provider: dados.provider,
          url: dados.url
        },
        ordem: novaOrdem,
      })
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Conteúdo criado com sucesso",
      description: "O conteúdo de vídeo foi adicionado ao módulo.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    toast({
      title: "Erro ao criar conteúdo",
      description: "Não foi possível criar o conteúdo. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Atualizar um conteúdo existente de texto rico
export async function atualizarConteudoTextoRico(
  conteudoId: string,
  dados: {
    nome_conteudo?: string;
    descricao_conteudo?: string;
    html_content?: string;
  }
): Promise<Conteudo | null> {
  try {
    // Primeiro, obtemos o conteúdo atual para preservar os dados que não serão alterados
    const { data: conteudoAtual } = await supabase
      .from("conteudos")
      .select("dados_conteudo")
      .eq("id", conteudoId)
      .single();
    
    const dadosConteudoAtualizados = {
      ...conteudoAtual?.dados_conteudo,
      html_content: dados.html_content !== undefined 
        ? dados.html_content 
        : conteudoAtual?.dados_conteudo?.html_content
    };
    
    const atualizacoes: any = {};
    if (dados.nome_conteudo !== undefined) atualizacoes.nome_conteudo = dados.nome_conteudo;
    if (dados.descricao_conteudo !== undefined) atualizacoes.descricao_conteudo = dados.descricao_conteudo;
    atualizacoes.dados_conteudo = dadosConteudoAtualizados;

    const { data, error } = await supabase
      .from("conteudos")
      .update(atualizacoes)
      .eq("id", conteudoId)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Conteúdo atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error);
    toast({
      title: "Erro ao atualizar conteúdo",
      description: "Não foi possível salvar as alterações. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Atualizar um conteúdo existente de vídeo
export async function atualizarConteudoVideo(
  conteudoId: string,
  dados: {
    nome_conteudo?: string;
    descricao_conteudo?: string;
    provider?: 'youtube' | 'vimeo';
    url?: string;
  }
): Promise<Conteudo | null> {
  try {
    // Primeiro, obtemos o conteúdo atual para preservar os dados que não serão alterados
    const { data: conteudoAtual } = await supabase
      .from("conteudos")
      .select("dados_conteudo")
      .eq("id", conteudoId)
      .single();
    
    const dadosConteudoAtualizados = {
      ...conteudoAtual?.dados_conteudo,
      provider: dados.provider !== undefined 
        ? dados.provider 
        : conteudoAtual?.dados_conteudo?.provider,
      url: dados.url !== undefined 
        ? dados.url 
        : conteudoAtual?.dados_conteudo?.url
    };
    
    const atualizacoes: any = {};
    if (dados.nome_conteudo !== undefined) atualizacoes.nome_conteudo = dados.nome_conteudo;
    if (dados.descricao_conteudo !== undefined) atualizacoes.descricao_conteudo = dados.descricao_conteudo;
    atualizacoes.dados_conteudo = dadosConteudoAtualizados;

    const { data, error } = await supabase
      .from("conteudos")
      .update(atualizacoes)
      .eq("id", conteudoId)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Conteúdo atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error);
    toast({
      title: "Erro ao atualizar conteúdo",
      description: "Não foi possível salvar as alterações. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Excluir um conteúdo
export async function excluirConteudo(conteudoId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("conteudos")
      .delete()
      .eq("id", conteudoId);

    if (error) throw error;
    
    toast({
      title: "Conteúdo excluído",
      description: "O conteúdo foi removido com sucesso.",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir conteúdo:", error);
    toast({
      title: "Erro ao excluir conteúdo",
      description: "Não foi possível excluir o conteúdo. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
}

// Reordenar conteúdos
export async function reordenarConteudos(
  moduloId: string,
  ordenacao: { id: string; ordem: number }[]
): Promise<boolean> {
  try {
    // Usar uma transação para atualizar todos os conteúdos de uma vez
    for (const item of ordenacao) {
      const { error } = await supabase
        .from("conteudos")
        .update({ ordem: item.ordem })
        .eq("id", item.id)
        .eq("modulo_id", moduloId);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao reordenar conteúdos:", error);
    toast({
      title: "Erro ao reordenar conteúdos",
      description: "Não foi possível salvar a nova ordem dos conteúdos.",
      variant: "destructive",
    });
    return false;
  }
}
