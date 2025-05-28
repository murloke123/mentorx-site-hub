import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Notificacao = Tables<'notificacoes'>;
type NotificacaoInsert = TablesInsert<'notificacoes'>;

export const useNotifications = (mentorId?: string) => {
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar notificações do mentor
  const fetchNotifications = async () => {
    if (!mentorId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.mensagem_lida).length || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notificações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar nova notificação
  const createNotification = async (notification: Omit<NotificacaoInsert, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .insert([notification]);

      if (error) throw error;

      // Atualizar lista se for para o mentor atual
      if (notification.mentor_id === mentorId) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ mensagem_lida: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, mensagem_lida: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida",
        variant: "destructive",
      });
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!mentorId) return;

    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ mensagem_lida: true })
        .eq('mentor_id', mentorId)
        .eq('mensagem_lida', false);

      if (error) throw error;

      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => ({ ...n, mensagem_lida: true }))
      );
      setUnreadCount(0);

      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas",
      });
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas",
        variant: "destructive",
      });
    }
  };

  // Deletar todas as notificações
  const deleteAllNotifications = async () => {
    if (!mentorId) return;

    try {
      console.log('Tentando deletar notificações para mentor:', mentorId);
      
      // Primeiro, buscar todas as notificações do mentor
      const { data: notificationsToDelete, error: fetchError } = await supabase
        .from('notificacoes')
        .select('id')
        .eq('mentor_id', mentorId);

      if (fetchError) {
        console.error('Erro ao buscar notificações para deletar:', fetchError);
        throw fetchError;
      }

      console.log('Notificações encontradas para deletar:', notificationsToDelete);

      if (!notificationsToDelete || notificationsToDelete.length === 0) {
        toast({
          title: "Info",
          description: "Não há notificações para deletar",
        });
        return;
      }

      // Deletar todas as notificações encontradas
      const { data, error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('mentor_id', mentorId)
        .select();

      if (error) {
        console.error('Erro do Supabase ao deletar:', error);
        
        // Tentar deletar uma por uma se a deleção em lote falhar
        console.log('Tentando deletar uma por uma...');
        let deletedCount = 0;
        
        for (const notification of notificationsToDelete) {
          try {
            const { error: deleteError } = await supabase
              .from('notificacoes')
              .delete()
              .eq('id', notification.id);
            
            if (!deleteError) {
              deletedCount++;
            }
          } catch (err) {
            console.error('Erro ao deletar notificação individual:', err);
          }
        }

        if (deletedCount > 0) {
          setNotifications([]);
          setUnreadCount(0);
          toast({
            title: "Sucesso",
            description: `${deletedCount} notificações foram deletadas`,
          });
        } else {
          throw error;
        }
        return;
      }

      console.log('Notificações deletadas:', data);

      // Atualizar estado local
      setNotifications([]);
      setUnreadCount(0);

      toast({
        title: "Sucesso",
        description: `${data?.length || 0} notificações foram deletadas`,
      });
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar as notificações. Verifique suas permissões.",
        variant: "destructive",
      });
    }
  };

  // Buscar notificações quando o mentorId mudar
  useEffect(() => {
    if (mentorId) {
      fetchNotifications();
    }
  }, [mentorId]);

  // Configurar real-time subscription
  useEffect(() => {
    if (!mentorId) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `mentor_id=eq.${mentorId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [mentorId]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
  };
}; 