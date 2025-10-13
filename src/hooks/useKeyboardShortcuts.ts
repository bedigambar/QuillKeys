import { useEffect, useState, useCallback } from 'react';
import { useTypingStore } from '@/store/typing-store';
import { getRandomQuestion } from '@/data/questions';

interface KeyboardShortcutsHookProps {
    onRestartTest?: () => void;
    onStartTest?: () => void;
}

export const useKeyboardShortcuts = ({ onRestartTest, onStartTest }: KeyboardShortcutsHookProps = {}) => {
    const { status, resetTest, startCountdown, setCurrentText, category } = useTypingStore();
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [sequenceKeys, setSequenceKeys] = useState<string[]>([]);
    const [sequenceTimer, setSequenceTimer] = useState<NodeJS.Timeout | null>(null);

    // Clear sequence after 2 seconds of inactivity
    const clearSequence = useCallback(() => {
        setSequenceKeys([]);
        if (sequenceTimer) {
            clearTimeout(sequenceTimer);
            setSequenceTimer(null);
        }
    }, [sequenceTimer]);

    const handleRestartShortcut = useCallback(() => {
        if (status === 'running' || status === 'completed' || status === 'countdown') {
            resetTest();
            onRestartTest?.();
            return true;
        }
        return false;
    }, [status, resetTest, onRestartTest]);

    // Check for sequence shortcuts
    const checkSequenceShortcuts = useCallback((currentSequence: string[]) => {
        const last3 = currentSequence.slice(-3);

        // Triple Enter or Triple Space to start test
        if (
            (last3.every(key => key === 'Enter') || last3.every(key => key === ' ')) &&
            status === 'idle'
        ) {
            const question = getRandomQuestion(category);
            setCurrentText(question.text);
            startCountdown();
            onStartTest?.();
            clearSequence();
            return true;
        }

        return false;
    }, [status, category, setCurrentText, startCountdown, onStartTest, clearSequence]);

    // Add key to sequence and reset timer, then check shortcut
    const addToSequence = useCallback((key: string) => {
        setSequenceKeys(prev => {
            const newSequence = [...prev, key];
            if (newSequence.length > 5) {
                // Only keep last 5
                return newSequence.slice(-5);
            }
            return newSequence;
        });
        // Reset timer
        if (sequenceTimer) {
            clearTimeout(sequenceTimer);
        }
        const timer = setTimeout(clearSequence, 2000);
        setSequenceTimer(timer);
    }, [sequenceTimer, clearSequence]);

    // Listens for sequenceKeys changes and check shortcut
    useEffect(() => {
        if (sequenceKeys.length >= 3) {
            checkSequenceShortcuts(sequenceKeys);
        }
    }, [sequenceKeys, checkSequenceShortcuts]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (status === 'running' &&
                !event.ctrlKey &&
                !event.altKey &&
                !event.metaKey &&
                key !== 'Tab' &&
                key !== 'Escape') {
                return;
            }

            setPressedKeys(prev => new Set([...prev, key]));

            // Tab + Enter for restart
            if (key === 'Enter' && pressedKeys.has('Tab')) {
                event.preventDefault();
                handleRestartShortcut();
                return;
            }

            // Add to sequence for multi-key shortcuts
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                addToSequence(key);
            }

            // Escape to reset
            if (key === 'Escape') {
                event.preventDefault();
                if (status !== 'idle') {
                    resetTest();
                    onRestartTest?.();
                }
            }

            // Ctrl/Cmd + R for restart
            if ((event.ctrlKey || event.metaKey) && key === 'r') {
                event.preventDefault();
                handleRestartShortcut();
            }

            // Ctrl/Cmd + Enter to start test
            if ((event.ctrlKey || event.metaKey) && key === 'Enter' && status === 'idle') {
                event.preventDefault();
                const question = getRandomQuestion(category);
                setCurrentText(question.text);
                startCountdown();
                onStartTest?.();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(event.key);
                return newSet;
            });
        };

        // Add global event listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            if (sequenceTimer) {
                clearTimeout(sequenceTimer);
            }
        };
    }, [pressedKeys, sequenceKeys, status, category, resetTest, startCountdown, setCurrentText, onRestartTest, onStartTest, sequenceTimer, addToSequence, checkSequenceShortcuts, handleRestartShortcut]);

    return {
        pressedKeys,
        sequenceKeys
    };
};