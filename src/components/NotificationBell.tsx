import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationModal } from './NotificationModal';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBellProps {
  mentorId?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ mentorId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications(mentorId);

  // Só mostrar o sininho se for um mentor
  if (!mentorId) return null;

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="relative p-2"
        >
          <Bell 
            className={`w-5 h-5 ${
              unreadCount > 0 ? 'text-red-500' : 'text-green-500'
            }`} 
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteAll={deleteAllNotifications}
      />
    </>
  );
}; 