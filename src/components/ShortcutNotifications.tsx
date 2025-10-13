import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Play } from 'lucide-react';
import type { ShortcutNotification } from '@/hooks/useShortcutNotifications';

interface ShortcutNotificationProps {
    notifications: ShortcutNotification[];
    onRemove: (id: string) => void;
}

const ShortcutNotifications: React.FC<ShortcutNotificationProps> = ({ notifications, onRemove }) => {
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        notifications.forEach(notification => {
            const timer = setTimeout(() => {
                onRemove(notification.id);
            }, 2000);
            timers.push(timer);
        });
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, onRemove]);

    const getIcon = (iconName?: string) => {
        switch (iconName) {
            case 'RotateCcw':
                return <RotateCcw className="w-4 h-4" />;
            case 'Play':
                return <Play className="w-4 h-4" />;
            case 'CheckCircle':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map(notification => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={`
                flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border
                ${notification.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
                            }
            `}
                    >
                        {getIcon(notification.icon)}
                        <span className="text-sm font-medium">{notification.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};



export default ShortcutNotifications;