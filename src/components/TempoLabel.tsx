import { motion, AnimatePresence } from 'framer-motion';
import { useTypingStore } from '@/store/typing-store';

const tempoConfig = {
  adagio: { label: 'Adagio', desc: 'deliberate', color: 'bg-blue-500 text-blue-500' },
  andante: { label: 'Andante', desc: 'steady', color: 'bg-emerald-500 text-emerald-500' },
  allegro: { label: 'Allegro', desc: 'flowing', color: 'bg-purple-500 text-purple-500' },
  presto: { label: 'Presto', desc: 'frantic', color: 'bg-red-500 text-red-500' }
};

const moodConfig = {
  tense: { label: 'Camus Tense', desc: 'fragmented & urgent' },
  flowing: { label: 'Woolf Flowing', desc: 'drifting & smooth' },
  heavy: { label: 'Kafka Heavy', desc: 'slow & deliberate' },
  lyrical: { label: 'Lyrical', desc: 'musical & balanced' }
};

export default function TempoLabel() {
  const { typingTempo, currentMood, status } = useTypingStore();

  if (status !== 'running') return null;

  const currentTempo = tempoConfig[typingTempo];
  const moodInfo = currentMood ? moodConfig[currentMood] : null;

  return (
    <div className="absolute bottom-3 right-4 z-20 pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-[11px] font-medium tracking-wide uppercase font-mono"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentTempo.color.split(' ')[0]} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${currentTempo.color.split(' ')[0]}`}></span>
        </span>
        
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={typingTempo}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className={currentTempo.color.split(' ')[1]}
            >
              {currentTempo.label}
            </motion.span>
          </AnimatePresence>

          {moodInfo && (
            <>
              <span className="text-muted-foreground/45">•</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentMood}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="text-muted-foreground font-semibold"
                  title={moodInfo.desc}
                >
                  {moodInfo.label}
                </motion.span>
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
