'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import { INotification } from '@/types';

export function useNotifications() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications };
}
