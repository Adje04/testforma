import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import { getSocket } from '../../socket/socket';
import { toast } from 'sonner';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.data);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const socket = getSocket();
        if (!socket) return;

        const handleNewNotification = (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast(notification.message);
        };

        socket.on('notification', handleNewNotification);
        return () => socket.off('notification', handleNewNotification);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await apiClient.put(`/notifications/${notification._id}/read`);
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Erreur lors du marquage comme lu:', error);
            }
        }
        setIsOpen(false);
        if (notification.link) navigate(notification.link);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erreur lors du marquage global comme lu:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50">
                    <div className="flex items-center justify-between border-b border-border p-3">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline">
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">Aucune notification pour l'instant</p>
                    ) : (
                        notifications.map((notification) => (
                            <button
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`w-full border-b border-border p-3 text-left text-sm transition-colors hover:bg-muted ${
                                    notification.read ? 'opacity-60' : 'bg-primary/5'
                                }`}
                            >
                                <p>{notification.message}</p>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}