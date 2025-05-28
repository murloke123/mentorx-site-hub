import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type ConfiguracaoUsuario = Tables<'configuracoes_usuario'>;
type ConfiguracaoUsuarioInsert = TablesInsert<'configuracoes_usuario'>;

export const useUserSettings = (userId?: string) => {
  const [settings, setSettings] = useState<ConfiguracaoUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar configurações do usuário
  const fetchSettings = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('configuracoes_usuario')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setSettings(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar ou atualizar configuração
  const updateSetting = async (tipoLog: string, ativo: boolean, nomeUsuario: string, perfilUsuario: string) => {
    if (!userId) return;

    try {
      // Verificar se já existe uma configuração para este tipo de log
      const { data: existingSetting } = await supabase
        .from('configuracoes_usuario')
        .select('*')
        .eq('user_id', userId)
        .eq('tipo_log', tipoLog)
        .single();

      if (existingSetting) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('configuracoes_usuario')
          .update({ 
            ativo,
            nome_usuario: nomeUsuario,
            perfil_usuario: perfilUsuario,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSetting.id);

        if (error) throw error;
      } else {
        // Criar nova configuração
        const newSetting: ConfiguracaoUsuarioInsert = {
          user_id: userId,
          nome_usuario: nomeUsuario,
          perfil_usuario: perfilUsuario,
          tipo_log: tipoLog,
          ativo
        };

        const { error } = await supabase
          .from('configuracoes_usuario')
          .insert([newSetting]);

        if (error) throw error;
      }

      // Atualizar lista local
      await fetchSettings();

      toast({
        title: "Sucesso",
        description: `Configuração ${ativo ? 'ativada' : 'desativada'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a configuração",
        variant: "destructive",
      });
    }
  };

  // Verificar se uma configuração específica está ativa
  const isSettingActive = (tipoLog: string): boolean => {
    const setting = settings.find(s => s.tipo_log === tipoLog);
    return setting?.ativo || false;
  };

  // Buscar configurações quando o userId mudar
  useEffect(() => {
    if (userId) {
      fetchSettings();
    }
  }, [userId]);

  return {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    isSettingActive,
  };
}; 