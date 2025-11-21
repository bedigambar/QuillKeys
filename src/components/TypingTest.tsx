
import { useTypingStore } from '@/store/typing-store'
import ControlPanel from './ControlPanel'
import { motion } from 'framer-motion';
import TypingArea from './TypingArea';
import ResultCard from './ResultCard';
import { useEffect } from 'react';
import { StatsDisplay } from './Stats';

const TypingTest = () => {
  const { status, updateTimer, updateCountdown, addWpmDataPoint, resetTest } = useTypingStore();

  useEffect(() => {
    resetTest();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'countdown') {
      interval = setInterval(() => {
        updateCountdown();
      }, 1000);
    } else if (status === 'running') {
      interval = setInterval(() => {
        updateTimer();
        addWpmDataPoint();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, updateTimer, updateCountdown, addWpmDataPoint]);
  return (
    <div className='max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4'>

      <ControlPanel />

      {status != 'completed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StatsDisplay />
          <TypingArea />
        </motion.div>
      )}

      {status == 'completed' && <ResultCard />}
    </div>
  )
}

export default TypingTest