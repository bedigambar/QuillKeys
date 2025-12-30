import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KeyErrors } from '@/store/typing-store';

interface KeyboardHeatmapProps {
  keyErrors: KeyErrors;
}

const KeyboardHeatmap = ({ keyErrors }: KeyboardHeatmapProps) => {
  const getKeyColor = (key: string) => {
    const errors = keyErrors[key.toLowerCase()] || keyErrors[key.toUpperCase()] || keyErrors[key] || 0;
    if (errors === 0) return 'bg-secondary hover:bg-secondary/80';
    if (errors >= 5) return 'bg-red-500/90 text-white';
    if (errors >= 3) return 'bg-orange-500/80 text-white';
    if (errors >= 2) return 'bg-yellow-500/70 text-black';
    return 'bg-yellow-300/50 text-black dark:text-white';
  };

  const getErrorCount = (key: string) => {
    return keyErrors[key.toLowerCase()] || keyErrors[key.toUpperCase()] || keyErrors[key] || 0;
  };

  const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ];

  const specialKeys = [
    { key: ' ', label: 'Space', width: 'w-20 sm:w-32 md:w-40 lg:w-48' },
  ];

  const totalErrors = Object.values(keyErrors).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Keyboard Heatmap</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalErrors} total errors
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 min-w-fit">
          {keyboardLayout.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="flex gap-0.5 sm:gap-1 md:gap-1.5"
              style={{ marginLeft: `${rowIndex * 6}px` }}
            >
              {row.map((key) => {
                const errors = getErrorCount(key);
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.1 }}
                    className={`
                      relative w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-10 lg:h-10
                      flex items-center justify-center
                      rounded sm:rounded-md font-mono text-[10px] sm:text-xs md:text-sm
                      transition-colors cursor-default
                      border border-border/50
                      ${getKeyColor(key)}
                    `}
                    title={`${key}: ${errors} error${errors !== 1 ? 's' : ''}`}
                  >
                    <span className="uppercase">{key}</span>
                    {errors > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[6px] sm:text-[8px] md:text-[10px] bg-red-600 text-white rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex items-center justify-center font-bold">
                        {errors > 9 ? '9+' : errors}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex gap-0.5 sm:gap-1 md:gap-1.5 mt-0.5 sm:mt-1"
          >
            {specialKeys.map(({ key, label, width }) => {
              const errors = getErrorCount(key);
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    relative ${width} h-5 sm:h-7 md:h-9 lg:h-10
                    flex items-center justify-center
                    rounded sm:rounded-md font-mono text-[10px] sm:text-xs md:text-sm
                    transition-colors cursor-default
                    border border-border/50
                    ${getKeyColor(key)}
                  `}
                  title={`${label}: ${errors} error${errors !== 1 ? 's' : ''}`}
                >
                  <span>{label}</span>
                  {errors > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[6px] sm:text-[8px] md:text-[10px] bg-red-600 text-white rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex items-center justify-center font-bold">
                      {errors > 9 ? '9+' : errors}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-secondary border border-border/50"></div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">0</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-300/50 border border-border/50"></div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">1</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-500/70"></div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">2</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500/80"></div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">3-4</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-500/90"></div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">5+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyboardHeatmap;
