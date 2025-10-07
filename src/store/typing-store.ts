import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TestStatus = 'idle' | 'running' | 'completed';
export type TimerOption = 30 | 60 | 180 | 'custom';

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
  // Test configuration
  timerDuration: TimerOption;
  customTimerDuration: number;
  category: string;
  
  // Test state
  status: TestStatus;
  timeLeft: number;
  currentText: string;
  typedText: string;
  
  // Statistics
  wpm: number;
  accuracy: number;
  wpmHistory: WpmDataPoint[];
  testResults: TestResult[];
  
  // Cumulative stats for continuous typing
  totalCorrectChars: number;
  totalTypedChars: number;
  
  // Actions
  setTimerDuration: (duration: TimerOption) => void;
  setCustomTimerDuration: (duration: number) => void;
  setCategory: (category: string) => void;
  setCurrentText: (text: string) => void;
  setTypedText: (text: string) => void;
  startTest: () => void;
  updateTimer: () => void;
  completeTest: () => void;
  resetTest: () => void;
  calculateStats: () => void;
  addWpmDataPoint: (wpm: number) => void;
  loadNewQuestion: () => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      // Initial state
      timerDuration: 60,
      customTimerDuration: 120,
      category: 'JavaScript',
      status: 'idle',
      timeLeft: 60,
      currentText: '',
      typedText: '',
      wpm: 0,
      accuracy: 100,
      wpmHistory: [],
      testResults: [],
      totalCorrectChars: 0,
      totalTypedChars: 0,

      // Actions
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
        const { currentText, status } = get();
        set({ typedText: text });
        get().calculateStats();
        
        // Check if user has typed enough to reach the end of current text
        if (status === 'running' && text.length >= currentText.length) {
          // Load a new question immediately
          get().loadNewQuestion();
        }
      },
      
      startTest: () => {
        const { timerDuration, customTimerDuration } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        set({ 
          status: 'running', 
          timeLeft: actualDuration,
          typedText: '',
          wpmHistory: [],
          totalCorrectChars: 0,
          totalTypedChars: 0
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
          totalTypedChars: 0
        });
      },
      
      calculateStats: () => {
        const { typedText, currentText, timerDuration, customTimerDuration, timeLeft, totalCorrectChars, totalTypedChars } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        
        // Calculate current paragraph stats
        let currentCorrectChars = 0;
        for (let i = 0; i < typedText.length; i++) {
          if (i < currentText.length && typedText[i] === currentText[i]) {
            currentCorrectChars++;
          }
        }
        
        // Use cumulative stats for accuracy
        const cumulativeTypedChars = totalTypedChars + typedText.length;
        const cumulativeCorrectChars = totalCorrectChars + currentCorrectChars;
        const accuracy = cumulativeTypedChars > 0 ? Math.round((cumulativeCorrectChars / cumulativeTypedChars) * 100) : 100;
        
        // Calculate WPM based on cumulative CORRECT characters
        const timeElapsedSeconds = actualDuration - timeLeft;
        const timeElapsedMinutes = timeElapsedSeconds / 60; // in minutes
        
        // Prevent inflated WPM at the start - require minimum 2 seconds elapsed
        const minTimeSeconds = 2;
        let wpm = 0;
        
        if (timeElapsedSeconds >= minTimeSeconds && cumulativeTypedChars > 0) {
          const correctWords = cumulativeCorrectChars / 5; // Standard WPM: every 5 correct chars = 1 word
          wpm = Math.round(correctWords / timeElapsedMinutes);
        } else {
          // Show 0 WPM until minimum time has elapsed
          wpm = 0;
        }
        
        set({ wpm, accuracy });
      },
      
      addWpmDataPoint: (wpm) => {
        const { wpmHistory, timerDuration, customTimerDuration, timeLeft } = get();
        const actualDuration = timerDuration === 'custom' ? customTimerDuration : timerDuration;
        const timeElapsed = actualDuration - timeLeft;
        set({ 
          wpmHistory: [...wpmHistory, { time: timeElapsed, wpm }]
        });
      },

      loadNewQuestion: () => {
        const { category, status, typedText, currentText, totalCorrectChars, totalTypedChars } = get();
        if (status === 'running') {
          // Calculate and add current paragraph stats to cumulative totals
          let currentCorrectChars = 0;
          for (let i = 0; i < typedText.length; i++) {
            if (i < currentText.length && typedText[i] === currentText[i]) {
              currentCorrectChars++;
            }
          }
          
          // Import here to avoid circular dependency
          import('@/data/questions').then(({ getRandomQuestion }) => {
            const newQuestion = getRandomQuestion(category);
            set({ 
              currentText: newQuestion.text,
              typedText: '',
              totalCorrectChars: totalCorrectChars + currentCorrectChars,
              totalTypedChars: totalTypedChars + typedText.length
            });
          });
        }
      }
    }),
    {
      name: 'typing-store',
      partialize: (state) => ({
        timerDuration: state.timerDuration,
        customTimerDuration: state.customTimerDuration,
        category: state.category,
        testResults: state.testResults
      })
    }
  )
);
