import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomQuestion, analyzeTextProfile } from '@/data/questions';

export type TestStatus = 'idle' | 'countdown' | 'running' | 'completed';
export type TimerOption = 30 | 60 | 180 | 'custom';
export type FontTheme = 'serif' | 'sans' | 'mono' | 'merriweather' | 'roboto' | 'fira';
export type CaretStyle = 'block' | 'line' | 'underline';
export type ContentType = 'prose' | 'poetry';

export interface TestResult {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  category: string;
  contentType: ContentType;
  timestamp: number;
  sentenceLengths?: number[];
  punctuationDensity?: number;
  wordComplexity?: number;
}

const getAdaptiveCategoryForMood = (
  mood: 'tense' | 'flowing' | 'heavy' | 'lyrical' | null,
  contentType: ContentType,
  currentCategory: string
): string => {
  if (!mood) return currentCategory;
  if (contentType === 'prose') {
    switch (mood) {
      case 'tense': return 'Camus';
      case 'flowing': return 'Woolf';
      case 'heavy': return 'Kafka';
      case 'lyrical': return 'Gogol';
      default: return currentCategory;
    }
  } else {
    switch (mood) {
      case 'tense': return 'Poe';
      case 'flowing': return 'Whitman';
      case 'heavy': return 'Frost';
      case 'lyrical': return 'Dickinson';
      default: return currentCategory;
    }
  }
};

export interface WpmDataPoint {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
  totalErrors?: number;
}

export interface KeyErrors {
  [key: string]: number;
}

interface TypingState {
  timerDuration: TimerOption;
  customTimerDuration: number;
  contentType: ContentType;
  category: string;
  status: TestStatus;
  timeLeft: number;
  countdownTime: number;
  currentText: string;
  typedText: string;
  wpm: number;
  accuracy: number;
  wpmHistory: WpmDataPoint[];
  testResults: TestResult[];
  grossTypedChars: number;
  correctChars: number;
  incorrectChars: number;
  keyErrors: KeyErrors;
  rawWpm: number;

  fontTheme: FontTheme;
  caretStyle: CaretStyle;
  zenMode: boolean;
  smoothCaret: boolean;
  focusMode: boolean;

  // Mood and Rhythm Adaptive state
  adaptiveMode: boolean;
  currentMood: 'tense' | 'flowing' | 'heavy' | 'lyrical' | null;
  typingTempo: 'adagio' | 'andante' | 'allegro' | 'presto';
  currentFontSizeScale: number;
  keystrokeIntervals: number[];
  lastKeystrokeTime: number | null;

  setTimerDuration: (duration: TimerOption) => void;
  setCustomTimerDuration: (duration: number) => void;
  setContentType: (type: ContentType) => void;
  setCategory: (category: string) => void;
  setCurrentText: (text: string) => void;
  setTypedText: (text: string) => void;
  startCountdown: () => void;
  updateCountdown: () => void;
  startTest: () => void;
  updateTimer: () => void;
  completeTest: () => void;
  resetTest: () => void;
  calculateStats: () => void;
  addWpmDataPoint: () => void;
  loadNewQuestion: () => void;

  setFontTheme: (theme: FontTheme) => void;
  setCaretStyle: (style: CaretStyle) => void;
  toggleZenMode: () => void;
  toggleSmoothCaret: () => void;
  toggleFocusMode: () => void;
  toggleAdaptiveMode: () => void;

  clearHistory: () => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      timerDuration: 60,
      customTimerDuration: 120,
      contentType: 'prose',
      category: 'Kafka',
      status: 'idle',
      timeLeft: 60,
      countdownTime: 3,
      currentText: '',
      typedText: '',
      wpm: 0,
      accuracy: 100,
      wpmHistory: [],
      testResults: [],
      grossTypedChars: 0,
      correctChars: 0,
      incorrectChars: 0,
      keyErrors: {},
      rawWpm: 0,

      fontTheme: 'roboto',
      caretStyle: 'line',
      zenMode: false,
      smoothCaret: true,
      focusMode: false,

      // Initial Mood & Adaptive rhythm state
      adaptiveMode: true,
      currentMood: null,
      typingTempo: 'andante',
      currentFontSizeScale: 1.0,
      keystrokeIntervals: [],
      lastKeystrokeTime: null,

      setTimerDuration: (duration) => {
        const { customTimerDuration } = get();
        const actualDuration = duration === 'custom' ? customTimerDuration : duration;
        set({ timerDuration: duration, timeLeft: actualDuration });
      },

      setCustomTimerDuration: (duration) => {
        set({ customTimerDuration: duration });
        const { timerDuration } = get();
        if (timerDuration === 'custom') {
          set({ timeLeft: duration });
        }
      },

      setContentType: (type) => set({ contentType: type }),

      setCategory: (category) => set({ category }),

      setCurrentText: (text) => set({ currentText: text }),

      setTypedText: (text) => {
        const { currentText, status, typedText: oldText, grossTypedChars, keyErrors, correctChars: oldCorrectChars, incorrectChars: oldIncorrectChars } = get();

        let newKeystrokes = 0;
        if (text.length > oldText.length) {
          newKeystrokes = text.length - oldText.length;
        } else if (text.length < oldText.length) {
          newKeystrokes = 1;
        }

        const getExpectedWords = (str: string) => {
          const words: string[] = [];
          const lines = str.split('\n');
          lines.forEach(line => {
            if (line.length === 0) {
              words.push('');
            } else {
              line.split(' ').forEach(w => {
                if (w !== '') words.push(w);
              });
            }
          });
          return words;
        };

        let newCorrectChars = 0;
        let newIncorrectChars = 0;
        const newKeyErrors = { ...keyErrors };
        const expectedWords = getExpectedWords(currentText);
        
        if (text.length > oldText.length) {
          const newCharsCount = text.length - oldText.length;
          for (let i = 0; i < newCharsCount; i++) {
            const charIndex = oldText.length + i;
            const expectedChar = currentText[charIndex];
            const typedChar = text[charIndex];
            
            // Allow space to match newline for poetry
            const isMatch = typedChar === expectedChar || (expectedChar === '\n' && typedChar === ' ');

            if (isMatch) {
              newCorrectChars++;
            } else {
              newIncorrectChars++;
              // Only count as missed if it's a space (word skip), count only 1 char
              if (typedChar === ' ') {
                // User pressed space, skipping current character
                // Calculate which word we just finished
                const textBefore = text.substring(0, charIndex);
                const wordIndex = textBefore.split(' ').length - 1;

                if (wordIndex < expectedWords.length) {
                  const expectedWord = expectedWords[wordIndex];
                  const actualWord = textBefore.split(' ').pop() || '';

                  if (actualWord.length < expectedWord.length) {
                    // Add all missed characters to errors
                    for (let k = actualWord.length; k < expectedWord.length; k++) {
                      const missedChar = expectedWord[k];
                      newKeyErrors[missedChar] = (newKeyErrors[missedChar] || 0) + 1;
                    }
                  } else if (expectedChar) {
                    newKeyErrors[expectedChar] = (newKeyErrors[expectedChar] || 0) + 1;
                  }
                } else if (expectedChar) {
                  newKeyErrors[expectedChar] = (newKeyErrors[expectedChar] || 0) + 1;
                }
              } else if (expectedChar) {
                newKeyErrors[expectedChar] = (newKeyErrors[expectedChar] || 0) + 1;
              }
            }
          }
        }

        // --- Calculate Keystroke Rhythm/Tempo & Dynamic Text Scale ---
        const now = Date.now();
        let newIntervals = [...get().keystrokeIntervals];
        let lastTime = get().lastKeystrokeTime;

        if (text.length > oldText.length && status === 'running') {
          if (lastTime !== null) {
            const diff = now - lastTime;
            if (diff < 2000) {
              newIntervals.push(diff);
              if (newIntervals.length > 20) {
                newIntervals = newIntervals.slice(-20);
              }
            }
          }
          lastTime = now;
        }

        let typingTempo: 'adagio' | 'andante' | 'allegro' | 'presto' = 'andante';
        let currentFontSizeScale = 1.0;
        let currentMood = get().currentMood;

        if (newIntervals.length >= 5) {
          const sum = newIntervals.reduce((a, b) => a + b, 0);
          const avgInterval = sum / newIntervals.length;
          const instantWpm = 12000 / avgInterval;

          if (instantWpm < 35) {
            typingTempo = 'adagio';
          } else if (instantWpm < 60) {
            typingTempo = 'andante';
          } else if (instantWpm < 85) {
            typingTempo = 'allegro';
          } else {
            typingTempo = 'presto';
          }

          // Dynamic scale: slow renders text larger, frantic makes it smaller
          currentFontSizeScale = Math.max(0.75, Math.min(1.35, 1.35 - (instantWpm / 150)));

          // Rhythm variance (CV) for mood classification
          const variance = newIntervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / newIntervals.length;
          const stdDev = Math.sqrt(variance);
          const cv = stdDev / avgInterval;

          if (cv > 0.35) {
            currentMood = 'tense';
          } else if (instantWpm > 55 && cv < 0.20) {
            currentMood = 'flowing';
          } else if (instantWpm <= 40 && cv < 0.25) {
            currentMood = 'heavy';
          } else {
            currentMood = 'lyrical';
          }
        }

        set({
          typedText: text,
          grossTypedChars: grossTypedChars + newKeystrokes,
          correctChars: oldCorrectChars + newCorrectChars,
          incorrectChars: oldIncorrectChars + newIncorrectChars,
          keyErrors: newKeyErrors,
          keystrokeIntervals: newIntervals,
          lastKeystrokeTime: lastTime,
          typingTempo,
          currentFontSizeScale,
          currentMood
        });

        get().calculateStats();

        if (status === 'running' && text.length >= currentText.length) {
          get().loadNewQuestion();
        }
      },

      startCountdown: () => {
        set({
          status: 'countdown',
          countdownTime: 3,
          typedText: '',
          wpmHistory: [],
          grossTypedChars: 0,
          correctChars: 0,
          incorrectChars: 0,
          keyErrors: {},
          rawWpm: 0,
          currentMood: null,
          typingTempo: 'andante',
          currentFontSizeScale: 1.0,
          keystrokeIntervals: [],
          lastKeystrokeTime: Date.now()
        });
      },

      updateCountdown: () => {
        const { countdownTime } = get();
        if (countdownTime > 1) {
          set({ countdownTime: countdownTime - 1 });
        } else {
          get().startTest();
        }
      },

      startTest: () => {
        const { timerDuration, customTimerDuration } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        set({
          status: 'running',
          timeLeft: actualDuration,
          lastKeystrokeTime: Date.now()
        });
      },

      updateTimer: () => {
        const { timeLeft, status } = get();
        if (status === 'running' && timeLeft > 0) {
          const newTimeLeft = timeLeft - 1;
          set({ timeLeft: newTimeLeft });

          if (newTimeLeft === 0) {
            get().completeTest();
          }
        }
      },

      completeTest: () => {
        const { wpm, accuracy, timerDuration, customTimerDuration, category, contentType, testResults, typedText } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeTaken = actualDuration - get().timeLeft;

        // Perform style fingerprint analysis of user's typed input
        const profile = analyzeTextProfile(typedText);

        const newResult: TestResult = {
          wpm: wpm,
          accuracy,
          timeTaken,
          category,
          contentType,
          timestamp: Date.now(),
          sentenceLengths: profile.sentenceLengths,
          punctuationDensity: profile.punctuationDensity,
          wordComplexity: profile.wordComplexity
        };

        set({
          status: 'completed',
          testResults: [...testResults, newResult]
        });
      },

      resetTest: () => {
        const { timerDuration, customTimerDuration } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        set({
          status: 'idle',
          timeLeft: actualDuration,
          typedText: '',
          wpm: 0,
          accuracy: 100,
          wpmHistory: [],
          grossTypedChars: 0,
          correctChars: 0,
          incorrectChars: 0,
          keyErrors: {},
          rawWpm: 0,
          currentMood: null,
          typingTempo: 'andante',
          currentFontSizeScale: 1.0,
          keystrokeIntervals: [],
          lastKeystrokeTime: null
        });
      },

      calculateStats: () => {
        const { timerDuration, customTimerDuration, timeLeft, correctChars, incorrectChars, grossTypedChars } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;

        const timeElapsedSeconds = actualDuration - timeLeft;
        const timeElapsedMinutes = timeElapsedSeconds / 60;

        const netChars = Math.max(0, correctChars - incorrectChars);
        const wpm = timeElapsedMinutes > 0 ? Math.round((netChars / 5) / timeElapsedMinutes) : 0;
        
        const rawWpm = timeElapsedMinutes > 0 ? Math.round((grossTypedChars / 5) / timeElapsedMinutes) : 0;

        const totalKeystrokes = correctChars + incorrectChars;
        const accuracy = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

        set({ wpm, accuracy, rawWpm });
      },

      addWpmDataPoint: () => {
        const { wpmHistory, timerDuration, customTimerDuration, timeLeft, correctChars, incorrectChars, grossTypedChars } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeElapsed = actualDuration - timeLeft;
        const timeElapsedMinutes = timeElapsed / 60;

        if (timeElapsedMinutes > 0) {
          const netChars = Math.max(0, correctChars - incorrectChars);
          const wpm = Math.min(Math.round((netChars / 5) / timeElapsedMinutes), 300);
          
          const raw = Math.min(Math.round((grossTypedChars / 5) / timeElapsedMinutes), 300);
          
          // Calculate NEW errors since last data point
          const prevTotalErrors = wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1].totalErrors || 0 : 0;
          const newErrors = incorrectChars - prevTotalErrors;
          
          set({
            wpmHistory: [...wpmHistory, { 
              time: timeElapsed, 
              wpm,
              raw,
              errors: newErrors,  // NEW errors in this second only
              totalErrors: incorrectChars  // Track cumulative for next calculation
            }]
          });
        }
      },

      loadNewQuestion: () => {
        const { category, status, adaptiveMode, currentMood, contentType } = get();
        if (status === 'running') {
          let nextCategory = category;
          if (adaptiveMode && currentMood) {
            nextCategory = getAdaptiveCategoryForMood(currentMood, contentType, category);
            set({ category: nextCategory });
          }
          const newQuestion = getRandomQuestion(nextCategory);
          set({
            currentText: newQuestion.text,
            typedText: ''
          });
        }
      },

      setFontTheme: (theme) => set({ fontTheme: theme }),
      setCaretStyle: (style) => set({ caretStyle: style }),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
      toggleSmoothCaret: () => set((state) => ({ smoothCaret: !state.smoothCaret })),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      toggleAdaptiveMode: () => set((state) => ({ adaptiveMode: !state.adaptiveMode })),

      clearHistory: () => {
        set({ testResults: [] });
      }
    }),
    {
      name: 'typing-store',
      partialize: (state) => ({
        timerDuration: state.timerDuration,
        customTimerDuration: state.customTimerDuration,
        contentType: state.contentType,
        category: state.category,
        testResults: state.testResults,
        fontTheme: state.fontTheme,
        caretStyle: state.caretStyle,
        smoothCaret: state.smoothCaret,
        focusMode: state.focusMode,
        adaptiveMode: state.adaptiveMode
      })
    }
  )
);
