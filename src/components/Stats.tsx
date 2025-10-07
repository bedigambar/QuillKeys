import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/typing-store';
import { Card, CardContent } from '@/components/ui/card';

export function StatsDisplay() {
  const { wpm, accuracy, timeLeft } = useTypingStore();

  const stats = [
    { label: 'WPM', value: wpm, color: 'text-blue-500' },
    { label: 'Accuracy', value: `${accuracy}%`, color: 'text-white-200' },
    { label: 'Time', value: `${timeLeft}s`, color: 'text-white-500' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-2 sm:p-4 text-center">
              <div className={`text-lg sm:text-2xl md:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
