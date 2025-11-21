import { motion } from 'framer-motion';
import { Keyboard, RotateCcw, Play, Zap } from 'lucide-react';

interface ShortcutItem {
    keys: string[];
    description: string;
    icon?: React.ReactNode;
}

const KeyboardShortcuts = () => {
    const shortcuts: ShortcutItem[] = [
        {
            keys: ['Tab', '+', 'Enter'],
            description: 'Restart',
            icon: <RotateCcw className="w-3 h-3" />
        },
        {
            keys: ['3x', 'Enter'],
            description: 'Start',
            icon: <Play className="w-3 h-3" />
        },
        {
            keys: ['3x', 'Space'],
            description: 'Start',
            icon: <Play className="w-3 h-3" />
        },
        {
            keys: ['Ctrl', 'Enter'],
            description: 'Quick Start',
            icon: <Zap className="w-3 h-3" />
        },
        {
            keys: ['Ctrl', 'R'],
            description: 'Restart',
            icon: <RotateCcw className="w-3 h-3" />
        },
        {
            keys: ['Esc'],
            description: 'Reset',
            icon: <RotateCcw className="w-3 h-3" />
        }
    ];

    const mobileShortcuts = [
        { keys: ['3×↵'], description: 'Start', icon: <Play className="w-3 h-3" /> },
        { keys: ['Tab+↵'], description: 'Restart', icon: <RotateCcw className="w-3 h-3" /> },
        { keys: ['Esc'], description: 'Reset', icon: <RotateCcw className="w-3 h-3" /> }
    ];

    const renderShortcut = (shortcut: ShortcutItem, index: number, compact = false) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}
        >
            <div className="flex items-center gap-1">
                {shortcut.icon}
                <span className="text-muted-foreground">{shortcut.description}:</span>
            </div>
            <div className="flex items-center gap-0.5">
                {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} className="flex items-center gap-0.5">
                        <kbd className={`px-1 py-0.5 font-mono bg-muted border border-border rounded shadow-sm ${compact ? 'text-[10px]' : 'text-xs'
                            }`}>
                            {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-[10px]">+</span>
                        )}
                    </span>
                ))}
            </div>
        </motion.div>
    );

    const renderMobileShortcut = (shortcut: ShortcutItem, index: number) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-0.5 text-[10px]"
        >
            <div className="flex items-center gap-0.5">
                {shortcut.icon}
            </div>
            <div className="flex items-center gap-0.5">
                {shortcut.keys.map((key: string, keyIndex: number) => (
                    <kbd key={keyIndex} className="px-1 py-0.5 text-[9px] font-mono bg-muted border border-border rounded shadow-sm">
                        {key}
                    </kbd>
                ))}
            </div>
            <span className="text-muted-foreground text-[9px]">{shortcut.description}</span>
        </motion.div>
    );

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border"
        >
            <div className="container mx-auto px-2 sm:px-4">

                <div className="hidden lg:block py-3">
                    <div className="flex items-center justify-center gap-6 xl:gap-8">

                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Keyboard className="w-4 h-4" />
                            <span>Keyboard Shortcuts</span>
                        </div>


                        {shortcuts.map((shortcut, index) => renderShortcut(shortcut, index))}
                    </div>
                </div>


                <div className="hidden md:block lg:hidden py-2.5">
                    <div className="flex flex-col gap-2">

                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                            <Keyboard className="w-4 h-4" />
                            <span>Shortcuts</span>
                        </div>


                        <div className="flex items-center justify-center gap-3 text-xs">
                            {shortcuts.slice(0, 3).map((shortcut, index) => renderShortcut(shortcut, index, true))}
                        </div>
                        <div className="flex items-center justify-center gap-3 text-xs">
                            {shortcuts.slice(3, 6).map((shortcut, index) => renderShortcut(shortcut, index + 3, true))}
                        </div>
                    </div>
                </div>


                <div className="block md:hidden py-2">
                    <div className="flex flex-col gap-1.5">

                        <div className="flex items-center justify-center gap-1.5 text-base font-semibold mb-2">
                            <Keyboard className="w-4 h-4" />
                            <span>Shortcuts</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 justify-items-center">
                            {mobileShortcuts.map((shortcut, index) => renderMobileShortcut(shortcut, index))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default KeyboardShortcuts;