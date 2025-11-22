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

    const Caret = ({ style }: { style: string }) => (
        <motion.span
            layoutId="caret"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute pointer-events-none z-10 ${style === 'block' ? 'inset-0 bg-primary/30 animate-pulse' :
                    style === 'line' ? '-left-[1px] top-0 bottom-0 w-[2px] bg-primary animate-pulse' :
                        'left-0 right-0 bottom-0 h-[2px] bg-primary animate-pulse'
                }`}
        />
    );

    const renderText = () => {
        const words = currentText.split(' ');
        const typedWords = typedText.split(' ');

        return words.map((word, wordIndex) => {
            const typedWord = typedWords[wordIndex] || '';
            const isCurrentWord = wordIndex === typedWords.length - 1;

            return (
                <span key={wordIndex} className="inline-block mr-2 mb-1 relative">
                    {word.split('').map((char, charIndex) => {
                        const typedChar = typedWord[charIndex];
                        let className = 'relative text-muted-foreground';
                        const isCorrect = typedChar === char;
                        const isError = typedChar !== undefined && typedChar !== char;

                        if (isCorrect) {
                            className = 'relative text-green-600 dark:text-green-400 font-semibold';
                        } else if (isError) {
                            className = 'relative text-red-600 dark:text-red-400';
                        }

                        const showCaret = isCurrentWord && charIndex === typedWord.length;

                        return (
                            <span key={charIndex} className={className}>
                                {char}
                                {showCaret && <Caret style={caretStyle} />}
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