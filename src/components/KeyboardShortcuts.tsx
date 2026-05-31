import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, RotateCcw, Play, Zap, EyeOff } from 'lucide-react';
import { useTypingStore } from '@/store/typing-store';

interface ShortcutItem {
    keys: string[];
    description: string;
    icon?: React.ReactNode;
}

const KeyboardShortcuts = () => {
    const { zenMode } = useTypingStore();
    const [isOpen, setIsOpen] = useState(false);

    if (zenMode) return null;

    const shortcuts: ShortcutItem[] = [
        {
            keys: ['3x', 'Enter'],
            description: 'Start',
            icon: <Play className="w-3.5 h-3.5" />
        },
        {
            keys: ['3x', 'Space'],
            description: 'Start',
            icon: <Play className="w-3.5 h-3.5" />
        },
        {
            keys: ['Ctrl', 'Enter'],
            description: 'Quick Start',
            icon: <Zap className="w-3.5 h-3.5" />
        },
        {
            keys: ['Ctrl', 'R'],
            description: 'Restart',
            icon: <RotateCcw className="w-3.5 h-3.5" />
        },
        {
            keys: ['Esc'],
            description: 'Reset',
            icon: <RotateCcw className="w-3.5 h-3.5" />
        },
        {
            keys: ['Ctrl', 'Z'],
            description: 'Zen Mode',
            icon: <EyeOff className="w-3.5 h-3.5" />
        }
    ];

    const renderShortcut = (shortcut: ShortcutItem, index: number, compact = false) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ delay: index * 0.03, duration: 0.15 }}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-primary/5 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}
        >
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
                {shortcut.icon}
                <span className="font-medium whitespace-nowrap">{shortcut.description}</span>
            </div>
            <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} className="flex items-center gap-1">
                        <kbd className={`
                            min-w-[20px] px-1.5 py-0.5 
                            font-mono font-medium text-center
                            bg-background/50 border border-border/50 
                            rounded-md shadow-sm backdrop-blur-sm
                            group-hover:border-primary/20 group-hover:bg-background/80
                            transition-all duration-200
                            ${compact ? 'text-[10px]' : 'text-xs'}
                        `}>
                            {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground/50 text-[10px]">+</span>
                        )}
                    </span>
                ))}
            </div>
        </motion.div>
    );

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none"
        >
            <div className="container mx-auto px-4 pointer-events-auto">

                {/* Desktop (lg+): horizontal bar */}
                <div className="hidden lg:block">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-background/60 backdrop-blur-xl border border-border/40 rounded-2xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:bg-background/70 hover:border-border/60">
                            {/* Toggle button — always visible */}
                            <button
                                onClick={() => setIsOpen(prev => !prev)}
                                className={`flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer select-none transition-colors duration-200 hover:text-primary/70 ${isOpen ? 'pr-3 border-r border-border/30' : ''}`}
                            >
                                <Keyboard className="w-4 h-4" />
                                <span>Shortcuts</span>
                            </button>

                            {/* Shortcuts — animate in/out */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="shortcuts-lg"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                        className="flex items-center gap-1.5 overflow-hidden"
                                    >
                                        {shortcuts.map((shortcut, index) => renderShortcut(shortcut, index))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Tablet (md–lg): vertical stacked rows */}
                <div className="hidden md:block lg:hidden">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2 px-5 py-3 bg-background/60 backdrop-blur-xl border border-border/40 rounded-2xl shadow-lg">
                            {/* Toggle button — always visible */}
                            <button
                                onClick={() => setIsOpen(prev => !prev)}
                                className="flex items-center justify-center gap-2 text-sm font-semibold text-primary cursor-pointer select-none transition-colors duration-200 hover:text-primary/70"
                            >
                                <Keyboard className="w-4 h-4" />
                                <span>Shortcuts</span>
                            </button>

                            {/* Shortcuts — animate in/out */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="shortcuts-md"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden flex flex-col gap-1"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {shortcuts.slice(0, 3).map((shortcut, index) => renderShortcut(shortcut, index, true))}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            {shortcuts.slice(3, 6).map((shortcut, index) => renderShortcut(shortcut, index + 3, true))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </motion.footer>
    );
};

export default KeyboardShortcuts;