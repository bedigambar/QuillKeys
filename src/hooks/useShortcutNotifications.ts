import { useState } from 'react';

interface ShortcutNotification {
    id: string;
    message: string;
    icon?: string;
    type: 'success' | 'info';
}

// Hook for managing shortcut notifications
export const useShortcutNotifications = () => {
    const [notifications, setNotifications] = useState<ShortcutNotification[]>([]);

    const addNotification = (message: string, type: 'success' | 'info' = 'info', icon?: string) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type, icon }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const notifyRestart = () => {
        addNotification('Test Restarted', 'info', 'RotateCcw');
    };

    const notifyStart = () => {
        addNotification('Test Started', 'success', 'Play');
    };

    const notifyShortcut = (shortcut: string) => {
        addNotification(`Shortcut: ${shortcut}`, 'info', 'CheckCircle');
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        notifyRestart,
        notifyStart,
        notifyShortcut
    };
};

export type { ShortcutNotification };