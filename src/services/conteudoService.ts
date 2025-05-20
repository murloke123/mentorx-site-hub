
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface Conteudo {
  id: string;
  modulo_id: string;
  nome_conteudo: string;
  descricao_conteudo?: string;
  tipo_conteudo: 'texto_rico' | 'video_externo' | 'pdf';
  dados_conteudo?: {
    html_content?: string;
    provider?: 'youtube' | 'vimeo';
    url?: string;
    pdf_url?: string;
    pdf_filename?: string;
    storage_path?: string; // Adicionando storage_path aqui
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
    
    // Garantir que os dados retornados sejam do tipo Conteudo[]
    return (data || []).map(item => ({
      ...item,
      tipo_conteudo: item.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: item.dados_conteudo as Conteudo['dados_conteudo']
    }));
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
    
    if (!data) return null;
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
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
        tipo_conteudo: 'texto_rico' as const,
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
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
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
        tipo_conteudo: 'video_externo' as const,
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
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
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

// Criar um novo conteúdo de PDF
export async function criarConteudoPdf(dados: {
  modulo_id: string;
  nome_conteudo: string;
  descricao_conteudo?: string;
  pdfFile: File;
}): Promise<Conteudo | null> {
  try {
    // 1. Fazer upload do PDF para o Supabase Storage
    const fileExt = dados.pdfFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `pdfs/${dados.modulo_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('mentorxbucket')
      .upload(filePath, dados.pdfFile);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Obter a URL pública do arquivo
    const { data: publicUrlData } = supabase.storage
      .from('mentorxbucket')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Não foi possível obter a URL pública do PDF.');
    }

    // 3. Salvar informações na tabela conteudos
    const { data: conteudosExistentes } = await supabase
      .from("conteudos")
      .select("ordem")
      .eq("modulo_id", dados.modulo_id)
      .order("ordem", { ascending: false })
      .limit(1);

    const novaOrdem = conteudosExistentes && conteudosExistentes.length > 0 
      ? conteudosExistentes[0].ordem + 1 
      : 0;

    const { data, error: insertError } = await supabase
      .from("conteudos")
      .insert({
        modulo_id: dados.modulo_id,
        nome_conteudo: dados.nome_conteudo,
        descricao_conteudo: dados.descricao_conteudo,
        tipo_conteudo: 'pdf' as const,
        dados_conteudo: {
          pdf_url: publicUrlData.publicUrl,
          pdf_filename: dados.pdfFile.name,
          storage_path: filePath, // Armazenar o caminho do arquivo para facilitar a exclusão
        },
        ordem: novaOrdem,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    
    toast({
      title: "Conteúdo PDF criado com sucesso",
      description: "O arquivo PDF foi adicionado ao módulo.",
    });
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'pdf', // Garantir o tipo correto
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
  } catch (error: any) {
    console.error("Erro ao criar conteúdo PDF:", error);
    toast({
      title: "Erro ao criar conteúdo PDF",
      description: error.message || "Não foi possível criar o conteúdo PDF. Verifique o console para mais detalhes.",
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
    
    // Criar um objeto para armazenar os dados do conteúdo atualizados
    const dadosConteudoAtuais = conteudoAtual?.dados_conteudo as Conteudo['dados_conteudo'] || {};
    
    const dadosConteudoAtualizados = {
      ...dadosConteudoAtuais,
      html_content: dados.html_content !== undefined 
        ? dados.html_content 
        : dadosConteudoAtuais?.html_content
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
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
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
    
    // Criar um objeto para armazenar os dados do conteúdo atualizados
    const dadosConteudoAtuais = conteudoAtual?.dados_conteudo as Conteudo['dados_conteudo'] || {};
    
    const dadosConteudoAtualizados = {
      ...dadosConteudoAtuais,
      provider: dados.provider !== undefined 
        ? dados.provider 
        : dadosConteudoAtuais?.provider,
      url: dados.url !== undefined 
        ? dados.url 
        : dadosConteudoAtuais?.url
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
    
    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'texto_rico' | 'video_externo' | 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
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

// Atualizar um conteúdo PDF existente
export async function atualizarConteudoPdf(
  conteudoId: string,
  dados: {
    nome_conteudo?: string;
    descricao_conteudo?: string;
    pdfFile?: File; // Opcional, só atualiza o PDF se um novo for fornecido
  }
): Promise<Conteudo | null> {
  try {
    const atualizacoes: any = {};
    if (dados.nome_conteudo !== undefined) atualizacoes.nome_conteudo = dados.nome_conteudo;
    if (dados.descricao_conteudo !== undefined) atualizacoes.descricao_conteudo = dados.descricao_conteudo;

    let novosDadosConteudo: Conteudo['dados_conteudo'] = {};

    // Se um novo arquivo PDF for fornecido, faz upload e atualiza pdf_url e pdf_filename
    if (dados.pdfFile) {
      // Primeiro buscar o conteúdo atual para obter o caminho do arquivo antigo
      const { data: conteudoAtual } = await supabase
        .from("conteudos")
        .select("modulo_id, dados_conteudo")
        .eq("id", conteudoId)
        .single();
      
      if (!conteudoAtual) throw new Error("Conteúdo não encontrado para atualização do PDF.");
      
      // Excluir o arquivo antigo do storage se existir um caminho
      if (conteudoAtual.dados_conteudo && (conteudoAtual.dados_conteudo as any).storage_path) {
        const oldFilePath = (conteudoAtual.dados_conteudo as any).storage_path;
        await supabase.storage
          .from('mentorxbucket')
          .remove([oldFilePath]);
      }

      const fileExt = dados.pdfFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `pdfs/${conteudoAtual.modulo_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mentorxbucket')
        .upload(filePath, dados.pdfFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('mentorxbucket')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Não foi possível obter a URL pública do novo PDF.');
      }
      
      novosDadosConteudo = {
        ...(conteudoAtual.dados_conteudo as object), // Mantém outros dados_conteudo se houver
        pdf_url: publicUrlData.publicUrl,
        pdf_filename: dados.pdfFile.name,
        storage_path: filePath,
      };
      
      atualizacoes.dados_conteudo = novosDadosConteudo;
    } else {
      // Se não houver novo PDF, apenas atualiza nome/descrição e mantém dados_conteudo existentes
      const { data: conteudoExistente } = await supabase.from("conteudos").select("dados_conteudo").eq("id", conteudoId).single();
      if (conteudoExistente && conteudoExistente.dados_conteudo) {
        atualizacoes.dados_conteudo = conteudoExistente.dados_conteudo;
      }
    }
    
    // Só atualiza se houver alguma alteração
    if (Object.keys(atualizacoes).length === 0 && !dados.pdfFile) {
      toast({ title: "Nenhuma alteração detectada." });
      return getConteudoById(conteudoId); // Retorna o conteúdo existente sem alteração
    }

    const { data, error } = await supabase
      .from("conteudos")
      .update(atualizacoes)
      .eq("id", conteudoId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Conteúdo PDF atualizado",
      description: "As alterações foram salvas com sucesso.",
    });

    return {
      ...data,
      tipo_conteudo: data.tipo_conteudo as 'pdf',
      dados_conteudo: data.dados_conteudo as Conteudo['dados_conteudo']
    };
  } catch (error: any) {
    console.error("Erro ao atualizar conteúdo PDF:", error);
    toast({
      title: "Erro ao atualizar conteúdo PDF",
      description: error.message || "Não foi possível salvar as alterações. Verifique o console.",
      variant: "destructive",
    });
    return null;
  }
}

// Excluir um conteúdo
export async function excluirConteudo(conteudoId: string): Promise<boolean> {
  try {
    // 1. Primeiro, obtemos os dados do conteúdo para verificar se é um PDF
    const { data: conteudo } = await supabase
      .from("conteudos")
      .select("*")
      .eq("id", conteudoId)
      .single();

    if (!conteudo) {
      throw new Error("Conteúdo não encontrado");
    }

    // 2. Se for um PDF, precisamos excluir o arquivo do storage
    if (conteudo.tipo_conteudo === 'pdf' && conteudo.dados_conteudo) {
      const dados = conteudo.dados_conteudo as any;
      
      // Verificar se temos o caminho do arquivo no storage
      if (dados.storage_path) {
        const { error: deleteFileError } = await supabase.storage
          .from('mentorxbucket')
          .remove([dados.storage_path]);
        
        if (deleteFileError) {
          console.error("Erro ao excluir arquivo do storage:", deleteFileError);
          // Não interrompemos o fluxo para permitir a exclusão do registro mesmo se o arquivo falhar
        }
      }
    }

    // 3. Excluir o registro do conteúdo
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
