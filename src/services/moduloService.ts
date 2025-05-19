
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Modulo {
  id: string;
  curso_id: string;
  nome_modulo: string;
  descricao_modulo?: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Obter todos os módulos de um curso
export async function getModulosByCursoId(cursoId: string): Promise<Modulo[]> {
  try {
    const { data, error } = await supabase
      .from("modulos")
      .select("*")
      .eq("curso_id", cursoId)
      .order("ordem", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    toast({
      title: "Erro ao carregar módulos",
      description: "Não foi possível carregar os módulos deste curso.",
      variant: "destructive",
    });
    return [];
  }
}

// Obter um módulo específico por ID
export async function getModuloById(moduloId: string): Promise<Modulo | null> {
  try {
    const { data, error } = await supabase
      .from("modulos")
      .select("*")
      .eq("id", moduloId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    toast({
      title: "Erro ao carregar módulo",
      description: "Não foi possível carregar os detalhes do módulo.",
      variant: "destructive",
    });
    return null;
  }
}

// Criar um novo módulo
export async function criarModulo(dados: {
  curso_id: string;
  nome_modulo: string;
  descricao_modulo?: string;
}): Promise<Modulo | null> {
  try {
    // Verificar a ordem máxima atual para o curso
    const { data: modulosExistentes } = await supabase
      .from("modulos")
      .select("ordem")
      .eq("curso_id", dados.curso_id)
      .order("ordem", { ascending: false })
      .limit(1);

    const novaOrdem = modulosExistentes && modulosExistentes.length > 0 
      ? modulosExistentes[0].ordem + 1 
      : 0;

    const { data, error } = await supabase
      .from("modulos")
      .insert({
        curso_id: dados.curso_id,
        nome_modulo: dados.nome_modulo,
        descricao_modulo: dados.descricao_modulo,
        ordem: novaOrdem,
      })
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Módulo criado com sucesso",
      description: "O módulo foi adicionado ao curso.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    toast({
      title: "Erro ao criar módulo",
      description: "Não foi possível criar o módulo. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Atualizar um módulo existente
export async function atualizarModulo(
  moduloId: string,
  dados: {
    nome_modulo?: string;
    descricao_modulo?: string;
    ordem?: number;
  }
): Promise<Modulo | null> {
  try {
    const { data, error } = await supabase
      .from("modulos")
      .update(dados)
      .eq("id", moduloId)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Módulo atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    toast({
      title: "Erro ao atualizar módulo",
      description: "Não foi possível salvar as alterações. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
}

// Excluir um módulo
export async function excluirModulo(moduloId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("modulos")
      .delete()
      .eq("id", moduloId);

    if (error) throw error;
    
    toast({
      title: "Módulo excluído",
      description: "O módulo foi removido com sucesso.",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir módulo:", error);
    toast({
      title: "Erro ao excluir módulo",
      description: "Não foi possível excluir o módulo. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
}

// Reordenar módulos
export async function reordenarModulos(
  cursoId: string,
  ordenacao: { id: string; ordem: number }[]
): Promise<boolean> {
  try {
    // Usar uma transação para atualizar todos os módulos de uma vez
    for (const item of ordenacao) {
      const { error } = await supabase
        .from("modulos")
        .update({ ordem: item.ordem })
        .eq("id", item.id)
        .eq("curso_id", cursoId);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao reordenar módulos:", error);
    toast({
      title: "Erro ao reordenar módulos",
      description: "Não foi possível salvar a nova ordem dos módulos.",
      variant: "destructive",
    });
    return false;
  }
}
