import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/typing-store';
import CapsLockWarning from './CapsLockWarning';

const Caret = ({ style, className = '' }: { style: string, className?: string }) => {
    return (
        <motion.span
            layoutId="caret"
            layout
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                mass: 0.8,
                restDelta: 0.001
            }}
            className={`absolute pointer-events-none z-10 ${
                style === 'block' 
                    ? 'inset-0 bg-primary/40 caret-blink-block' 
                    : style === 'line' 
                        ? 'top-0 bottom-0 w-[2px] bg-primary caret-blink rounded-full' 
                        : 'left-0 right-0 bottom-0 h-[2px] bg-primary caret-blink rounded-full'
            } ${className}`}
        />
    );
};

const TypingArea = () => {

    const { currentText, typedText, setTypedText, status, countdownTime, fontTheme, caretStyle, focusMode } = useTypingStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const [capsLockOn, setCapsLockOn] = useState(false);

    useEffect(() => {
        const handleKeyEvent = (e: KeyboardEvent) => {
            setCapsLockOn(e.getModifierState('CapsLock'));
        };

        window.addEventListener('keydown', handleKeyEvent);
        window.addEventListener('keyup', handleKeyEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyEvent);
            window.removeEventListener('keyup', handleKeyEvent);
        };
    }, []);

    useEffect(() => {
        if (status === 'running' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    const renderText = () => {
        const lines = currentText.split('\n');
        const typedWords = typedText.split(' ');
        let globalWordIndex = 0;
        const currentWordPosition = typedWords.length - 1;

        const getBlurClass = (wordIndex: number) => {
            if (!focusMode || status !== 'running') return '';
            const distance = wordIndex - currentWordPosition;
            if (distance <= 0) return '';
            if (distance <= 2) return '';
            if (distance <= 5) return 'blur-[1px] opacity-70';
            if (distance <= 10) return 'blur-[2px] opacity-50';
            return 'blur-[3px] opacity-30';
        };

        return (
            <div className="flex flex-col items-start w-full">
                {lines.map((line, lineIndex) => {
                    if (line.length === 0) {
                        const currentWordIndex = globalWordIndex++;
                        const typedWord = typedWords[currentWordIndex] || '';
                        const blurClass = getBlurClass(currentWordIndex);
                        
                        return (
                            <div key={lineIndex} className={`h-6 w-full flex transition-all duration-200 ${blurClass}`}>
                                {typedWord.length > 0 && (
                                     <span className="text-red-600 dark:text-red-400 opacity-70">
                                        {typedWord}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    const words = line.split(' ');

                    return (
                        <div key={lineIndex} className="flex flex-wrap w-full">
                            {words.map((word) => {
                                if (word === '') return null;

                                const currentWordIndex = globalWordIndex++;
                                const typedWord = typedWords[currentWordIndex] || '';
                                const isCurrentWord = currentWordIndex === typedWords.length - 1;
                                const isSubmitted = currentWordIndex < typedWords.length - 1;
                                const blurClass = getBlurClass(currentWordIndex);

                                return (
                                    <span key={currentWordIndex} className={`inline-block mr-2 mb-1 relative transition-all duration-200 ${blurClass}`}>
                                        {word.split('').map((char, charIndex) => {
                                            const typedChar = typedWord[charIndex];
                                            let className = 'relative text-muted-foreground';
                                            const isCorrect = typedChar === char;
                                            const isError = typedChar !== undefined && typedChar !== char;
                                            const isMissed = isSubmitted && typedChar === undefined;

                                            if (isCorrect) {
                                                className = 'relative text-green-600 dark:text-green-400 font-semibold';
                                            } else if (isError || isMissed) {
                                                className = 'relative text-red-600 dark:text-red-400';
                                            }

                                            const showCaret = isCurrentWord && charIndex === typedWord.length;

                                            return (
                                                <span key={charIndex} className={className}>
                                                    {char}
                                                    {showCaret && <Caret style={caretStyle} className={caretStyle === 'line' ? '-left-[1px]' : ''} />}
                                                </span>
                                            );
                                        })}
                                        {typedWord.length > word.length && (
                                            <span className="text-red-600 dark:text-red-400 opacity-70">
                                                {typedWord.slice(word.length)}
                                            </span>
                                        )}
                                        {isCurrentWord && typedWord.length >= word.length && (
                                            <Caret style={caretStyle} className={caretStyle === 'line' ? '-right-[1px]' : ''} />
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <CapsLockWarning isVisible={capsLockOn && status === 'running'} />

            <div className={`p-3 sm:p-4 md:p-6 min-h-[150px] sm:min-h-[200px] ${fontTheme === 'serif' ? 'font-serif' :
                fontTheme === 'mono' ? 'font-mono' :
                    fontTheme === 'merriweather' ? 'font-merriweather' :
                        fontTheme === 'roboto' ? 'font-roboto' :
                            fontTheme === 'fira' ? 'font-fira' : 'font-sans'
                }`}>

                <div className='text-base sm:text-lg md:text-xl leading-relaxed'>
                    {renderText()}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    onKeyDown={(e) => {
                        const expectedChar = currentText[typedText.length];

                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (expectedChar === '\n') {
                                setTypedText(typedText + ' ');
                            }
                            return;
                        }

                        if (e.key === ' ') {
                            e.preventDefault();
                            if (expectedChar === ' ' || expectedChar === '\n') {
                                setTypedText(typedText + ' ');
                            } else if (expectedChar) {
                                setTypedText(typedText + '~');
                            }
                        }
                    }}
                    className="absolute inset-0 opacity-0 cursor-default"
                    disabled={status !== 'running'}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </div>


            {
                status === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground text-lg">Select your mode and click "Start Test"</p>
                            <p className="text-sm text-muted-foreground/60">Prose • Poetry • Zen Mode</p>
                        </div>
                    </div>
                )
            }

            {
                status === 'countdown' && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            key={countdownTime}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-8xl font-bold text-primary"
                        >
                            {countdownTime}
                        </motion.div>
                    </motion.div>
                )
            }
        </motion.div>
    )
}

export default TypingArea