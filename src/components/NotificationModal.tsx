import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCheck, Clock, Trash2, Plus, Minus, User } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Notificacao = Tables<'notificacoes'>;

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notificacao[];
  unreadCount: number;
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

const getActionIcon = (acao: string) => {
  if (acao === 'seguir mentor') {
    return (
      <div className="flex items-center space-x-1">
        <Plus className="w-3 h-3 text-green-600" />
        <User className="w-3 h-3 text-green-600" />
      </div>
    );
  } else if (acao === 'deixou de seguir mentor') {
    return (
      <div className="flex items-center space-x-1">
        <Minus className="w-3 h-3 text-red-600" />
        <User className="w-3 h-3 text-red-600" />
      </div>
    );
  }
  return <User className="w-3 h-3 text-blue-600" />;
};

const getActionColor = (acao: string) => {
  switch (acao) {
    case 'seguir mentor':
      return 'bg-green-50 border-green-200';
    case 'deixou de seguir mentor':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteAll,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAll = () => {
    onDeleteAll();
    setShowDeleteConfirm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Lista de notificações do mentor
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-sm"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Deletar todas
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-gray-500">
                Você não tem notificações no momento.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    notification.mensagem_lida
                      ? 'bg-white border-gray-200'
                      : getActionColor(notification.acao)
                  }`}
                  onClick={() => !notification.mensagem_lida && onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {notification.nome_mentorado.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {notification.nome_mentorado}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.acao === 'seguir mentor' ? 'começou a seguir você' : 'deixou de seguir você'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.mensagem_lida && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <div className="flex items-center space-x-1">
                              {getActionIcon(notification.acao)}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Confirmation Dialog for Delete All */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Confirmar exclusão</h3>
              <p className="text-gray-600 mb-4">
                Você realmente deseja deletar todas as suas notificações?
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Não
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  className="flex-1"
                >
                  Sim
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 