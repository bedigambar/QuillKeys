import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomQuestion } from '@/data/questions';

export type TestStatus = 'idle' | 'countdown' | 'running' | 'completed';
export type TimerOption = 30 | 60 | 180 | 'custom';
export type FontTheme = 'serif' | 'sans' | 'mono' | 'merriweather' | 'roboto' | 'fira';
export type CaretStyle = 'block' | 'line' | 'underline';



export interface TestResult {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  category: string;
  timestamp: number;
}

export interface WpmDataPoint {
  time: number;
  wpm: number;
}

const getWordBasedStats = (currentText: string, typedText: string) => {
  const words = currentText.split(' ');
  const typedWords = typedText.split(' ');

  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;

  typedWords.forEach((typedWord, index) => {
    const targetWord = words[index];

    if (!targetWord) {
      extraChars += typedWord.length;
      return;
    }

    const isLastWord = index === typedWords.length - 1;

    for (let i = 0; i < Math.max(typedWord.length, targetWord.length); i++) {
      const typedChar = typedWord[i];
      const targetChar = targetWord[i];

      if (typedChar !== undefined && targetChar !== undefined) {
        if (typedChar === targetChar) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      } else if (typedChar !== undefined && targetChar === undefined) {
        extraChars++;
      } else if (typedChar === undefined && targetChar !== undefined) {
        if (!isLastWord) {
          missedChars++;
        }
      }
    }

    if (!isLastWord) {
      correctChars++;
    }
  });

  return { correctChars, incorrectChars, extraChars, missedChars };
};

interface TypingState {

  timerDuration: TimerOption;
  customTimerDuration: number;
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


  totalCorrectChars: number;
  totalTypedChars: number;
  grossTypedChars: number;
  lastWpmUpdate: number;
  lastCorrectChars: number;

  fontTheme: FontTheme;
  caretStyle: CaretStyle;
  zenMode: boolean;
  smoothCaret: boolean;




  setTimerDuration: (duration: TimerOption) => void;
  setCustomTimerDuration: (duration: number) => void;
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

  clearHistory: () => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({

      timerDuration: 60,
      customTimerDuration: 120,
      category: 'JavaScript',
      status: 'idle',
      timeLeft: 60,
      countdownTime: 3,
      currentText: '',
      typedText: '',
      wpm: 0,
      accuracy: 100,
      wpmHistory: [],
      testResults: [],
      totalCorrectChars: 0,
      totalTypedChars: 0,
      grossTypedChars: 0,
      lastWpmUpdate: 0,
      lastCorrectChars: 0,

      fontTheme: 'roboto',
      caretStyle: 'line',
      zenMode: false,
      smoothCaret: false,



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

      setCategory: (category) => set({ category }),

      setCurrentText: (text) => set({ currentText: text }),

      setTypedText: (text) => {
        const { currentText, status, typedText: oldText, grossTypedChars } = get();

        let newKeystrokes = 0;
        if (text.length > oldText.length) {
          newKeystrokes = text.length - oldText.length;
        } else if (text.length < oldText.length) {
          newKeystrokes = 1;
        }

        set({
          typedText: text,
          grossTypedChars: grossTypedChars + newKeystrokes
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
          totalCorrectChars: 0,
          totalTypedChars: 0,
          grossTypedChars: 0,
          lastWpmUpdate: 0,
          lastCorrectChars: 0
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
          timeLeft: actualDuration
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
        const { wpm, accuracy, timerDuration, customTimerDuration, category, testResults } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeTaken = actualDuration - get().timeLeft;

        const newResult: TestResult = {
          wpm: wpm,
          accuracy,
          timeTaken,
          category,
          timestamp: Date.now()
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
          totalCorrectChars: 0,
          totalTypedChars: 0,
          grossTypedChars: 0,
          lastWpmUpdate: 0,
          lastCorrectChars: 0
        });
      },

      calculateStats: () => {
        const { typedText, currentText, timerDuration, customTimerDuration, timeLeft, totalCorrectChars } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;

        const { correctChars, incorrectChars, extraChars, missedChars } = getWordBasedStats(currentText, typedText);
        const cumulativeCorrectChars = totalCorrectChars + correctChars;

        const totalEntries = cumulativeCorrectChars + incorrectChars + extraChars + missedChars;
        const accuracy = totalEntries > 0 ? Math.round((cumulativeCorrectChars / totalEntries) * 100) : 100;

        const timeElapsedSeconds = actualDuration - timeLeft;
        const timeElapsedMinutes = timeElapsedSeconds / 60;

        const minTimeSeconds = 1;
        let wpm = 0;

        if (timeElapsedSeconds >= minTimeSeconds) {
          const correctWords = cumulativeCorrectChars / 5;
          wpm = Math.round(correctWords / timeElapsedMinutes);
        }

        set({ wpm, accuracy });
      },

      addWpmDataPoint: () => {
        const { wpmHistory, timerDuration, customTimerDuration, timeLeft, totalCorrectChars, typedText, currentText, lastCorrectChars, lastWpmUpdate } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeElapsed = actualDuration - timeLeft;
        const now = Date.now();

        const { correctChars } = getWordBasedStats(currentText, typedText);
        const totalCorrect = totalCorrectChars + correctChars;

        const deltaCorrect = totalCorrect - lastCorrectChars;

        let timeDeltaMinutes = 1 / 60;
        if (lastWpmUpdate > 0) {
          const timeDeltaMs = now - lastWpmUpdate;
          if (timeDeltaMs > 100) {
            timeDeltaMinutes = timeDeltaMs / 1000 / 60;
          }
        }

        const instantWpm = Math.max(0, Math.round((deltaCorrect / 5) / timeDeltaMinutes));

        set({
          wpmHistory: [...wpmHistory, { time: timeElapsed, wpm: instantWpm }],
          lastCorrectChars: totalCorrect,
          lastWpmUpdate: now
        });
      },

      loadNewQuestion: () => {
        const { category, status, typedText, currentText, totalCorrectChars, totalTypedChars } = get();
        if (status === 'running') {

          const { correctChars } = getWordBasedStats(currentText, typedText);

          const newQuestion = getRandomQuestion(category);
          set({
            currentText: newQuestion.text,
            typedText: '',
            totalCorrectChars: totalCorrectChars + correctChars,
            totalTypedChars: totalTypedChars + typedText.length
          });
        }
      },

      setFontTheme: (theme) => set({ fontTheme: theme }),
      setCaretStyle: (style) => set({ caretStyle: style }),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
      toggleSmoothCaret: () => set((state) => ({ smoothCaret: !state.smoothCaret })),



      clearHistory: () => {
        set({ testResults: [] });
      }
    }),
    {
      name: 'typing-store',
      partialize: (state) => ({
        timerDuration: state.timerDuration,
        customTimerDuration: state.customTimerDuration,
        category: state.category,
        testResults: state.testResults,
        fontTheme: state.fontTheme,
        caretStyle: state.caretStyle,
        smoothCaret: state.smoothCaret
      })
    }
  )
);
