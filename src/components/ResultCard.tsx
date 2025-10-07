import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTypingStore } from '@/store/typing-store';
import { Trophy, Target, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const ResultCard = () => {
  const { wpm, accuracy, timerDuration, timeLeft, wpmHistory } = useTypingStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Clean up the event listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const actualDuration = typeof timerDuration === 'number' ? timerDuration : 120;
  const timeTaken = actualDuration - timeLeft;

  // Calculate peak WPM, average WPM, and consistency score
  const peakWpm = wpmHistory.length > 0 ? Math.max(...wpmHistory.map(d => d.wpm)) : wpm;
  const avgWpm = wpmHistory.length > 0 
    ? Math.round(wpmHistory.reduce((sum, d) => sum + d.wpm, 0) / wpmHistory.length)
    : wpm;
  
  // Consistency score: Lower standard deviation = more consistent (higher score)
  const calculateConsistency = () => {
    if (wpmHistory.length < 2) return 100;
    const mean = avgWpm;
    const variance = wpmHistory.reduce((sum, d) => sum + Math.pow(d.wpm - mean, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);
    // Convert to a 0-100 score (lower stdDev = higher score)
    // Assuming stdDev of 0 = 100, stdDev of 30+ = 0
    const consistency = Math.max(0, Math.min(100, 100 - (stdDev * 3.33)));
    return Math.round(consistency);
  };
  
  const consistencyScore = calculateConsistency();

  const stats = [
    {
      icon: Trophy,
      label: 'Final WPM',
      value: wpm,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Clock,
      label: 'Time',
      value: `${timeTaken}s`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  // Define chart colors
  const chartLineColor = '#3b82f6'; // blue-500
  const chartAxisColor = isDarkMode ? '#aaa' : '#555';
  const chartGridColor = isDarkMode ? '#333' : '#ccc';
  const tooltipBgColor = isDarkMode ? '#222' : 'white';
  const tooltipTextColor = isDarkMode ? 'white' : 'black';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl font-bold">Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Main stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className={`${stat.bgColor} rounded-lg p-2 sm:p-4 text-center`}
                >
                  <IconComponent className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color} mx-auto mb-1 sm:mb-2`} />
                  <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional stats: Peak WPM, Average WPM, Consistency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-border"
          >
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Peak WPM</div>
              <div className="text-base sm:text-xl font-bold text-purple-500">{peakWpm}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Average WPM</div>
              <div className="text-base sm:text-xl font-bold text-blue-400">{avgWpm}</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Consistency</div>
              <div className={`text-xl font-bold ${
                consistencyScore >= 80 ? 'text-green-500' : 
                consistencyScore >= 60 ? 'text-yellow-500' : 
                'text-orange-500'
              }`}>
                {consistencyScore}%
              </div>
            </div>
          </motion.div>

          {wpmHistory.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">WPM Over Time</h3>
              <div className="h-48 sm:h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wpmHistory}>
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartLineColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartLineColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis 
                      dataKey="time" 
                      stroke={chartAxisColor}
                      label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: chartAxisColor }}
                    />
                    <YAxis 
                      stroke={chartAxisColor}
                      label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: chartAxisColor }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: tooltipBgColor,
                        border: `1px solid ${chartGridColor}`,
                        borderRadius: '8px',
                        color: tooltipTextColor
                      }}
                      labelStyle={{ color: tooltipTextColor }}
                      itemStyle={{ color: tooltipTextColor }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="wpm" 
                      stroke={chartLineColor} 
                      strokeWidth={3}
                      dot={{ fill: chartLineColor, strokeWidth: 2, r: 4 }}
                      fill="url(#colorWpm)"
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ResultCard;
