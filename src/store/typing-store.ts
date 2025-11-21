import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomQuestion } from '@/data/questions';

export type TestStatus = 'idle' | 'countdown' | 'running' | 'completed';
export type TimerOption = 30 | 60 | 180 | 'custom';
export type FontTheme = 'serif' | 'sans' | 'mono';
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
  grossTypedChars: number; // Total keystrokes including backspaces
  lastWpmUpdate: number; // Timestamp of last WPM update for instantaneous calc
  lastCorrectChars: number; // Correct chars at last WPM update

  fontTheme: FontTheme;
  caretStyle: CaretStyle;
  zenMode: boolean;




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

      fontTheme: 'serif',
      caretStyle: 'line',
      zenMode: false,



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
        const { typedText, currentText, timerDuration, customTimerDuration, timeLeft, totalCorrectChars, grossTypedChars } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;


        let currentCorrectChars = 0;
        for (let i = 0; i < typedText.length; i++) {
          if (i < currentText.length && typedText[i] === currentText[i]) {
            currentCorrectChars++;
          }
        }

        const cumulativeCorrectChars = totalCorrectChars + currentCorrectChars;

        const accuracy = grossTypedChars > 0 ? Math.round((cumulativeCorrectChars / grossTypedChars) * 100) : 100;


        const timeElapsedSeconds = actualDuration - timeLeft;
        const timeElapsedMinutes = timeElapsedSeconds / 60;


        const minTimeSeconds = 1;
        let wpm = 0;

        if (timeElapsedSeconds >= minTimeSeconds) {
          const correctWords = cumulativeCorrectChars / 5;
          wpm = Math.round(correctWords / timeElapsedMinutes);
        } else {

          wpm = 0;
        }

        set({ wpm, accuracy });
      },

      addWpmDataPoint: () => {
        const { wpmHistory, timerDuration, customTimerDuration, timeLeft, totalCorrectChars, typedText, currentText, lastCorrectChars, lastWpmUpdate } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeElapsed = actualDuration - timeLeft;
        const now = Date.now();

        let currentCorrectChars = 0;
        for (let i = 0; i < typedText.length; i++) {
          if (i < currentText.length && typedText[i] === currentText[i]) {
            currentCorrectChars++;
          }
        }
        const totalCorrect = totalCorrectChars + currentCorrectChars;

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

          let currentCorrectChars = 0;
          for (let i = 0; i < typedText.length; i++) {
            if (i < currentText.length && typedText[i] === currentText[i]) {
              currentCorrectChars++;
            }
          }


          // Synchronous update to prevent race condition
          const newQuestion = getRandomQuestion(category);
          set({
            currentText: newQuestion.text,
            typedText: '',
            totalCorrectChars: totalCorrectChars + currentCorrectChars,
            totalTypedChars: totalTypedChars + typedText.length
          });
        }
      },

      setFontTheme: (theme) => set({ fontTheme: theme }),
      setCaretStyle: (style) => set({ caretStyle: style }),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),



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
        caretStyle: state.caretStyle
      })
    }
  )
);
