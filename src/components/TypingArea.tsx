import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/typing-store';

const TypingArea = () => {

    const { currentText, typedText, setTypedText, status, countdownTime, fontTheme, caretStyle } = useTypingStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'running' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    const renderText = () => {
        const words = currentText.split(' ');
        const typedWords = typedText.split(' ');

        return words.map((word, wordIndex) => {
            const typedWord = typedWords[wordIndex] || '';
            const isCurrentWord = wordIndex === typedWords.length - 1;

            return (
                <span key={wordIndex} className="inline-block mr-2 mb-1">
                    {word.split('').map((char, charIndex) => {
                        const typedChar = typedWord[charIndex];
                        let className = 'text-muted-foreground';

                        if (typedChar !== undefined) {
                            className = typedChar === char ? 'text-green-600 dark:text-green-400 font-semibold scale-[1.05] transition-transform duration-100'
                                : 'text-red-600 dark:text-red-400';
                        } else if (isCurrentWord && charIndex === typedWord.length) {
                            if (caretStyle === 'block') {
                                className = 'bg-primary text-primary-foreground animate-pulse';
                            } else if (caretStyle === 'line') {
                                className = 'border-l-2 border-primary animate-pulse';
                            } else {
                                className = 'border-b-2 border-primary animate-pulse';
                            }
                        }

                        return (
                            <span key={charIndex} className={className}>
                                {char}
                            </span>
                        );
                    })}
                    {isCurrentWord && typedWord.length > word.length && (
                        <span className="text-red-500 bg-red-500/20">
                            {typedWord.slice(word.length)}
                        </span>
                    )}
                </span>
            );
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >

            <div className={`p-3 sm:p-4 md:p-6 min-h-[150px] sm:min-h-[200px] ${fontTheme === 'serif' ? 'font-serif' :
                    fontTheme === 'mono' ? 'font-mono' : 'font-sans'
                }`}>

                <div className='text-base sm:text-lg md:text-xl leading-relaxed'>
                    {renderText()}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
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
                        <p className="text-muted-foreground">Click "Start Test" to begin</p>
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