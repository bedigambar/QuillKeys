import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTypingStore } from '@/store/typing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import KeyboardHeatmap from '@/components/KeyboardHeatmap';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Scatter
} from 'recharts';
import { Trophy, Target, Clock, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

const Results = () => {
  const navigate = useNavigate();
  const { 
    wpm, 
    accuracy, 
    rawWpm,
    timerDuration, 
    timeLeft, 
    wpmHistory, 
    category,
    correctChars,
    incorrectChars,
    keyErrors,
    resetTest
  } = useTypingStore();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const actualDuration = typeof timerDuration === 'number' ? timerDuration : 120;
  const timeTaken = actualDuration - timeLeft;

  const chartData = wpmHistory.map((point) => ({
    second: point.time,
    wpm: point.wpm,
    raw: point.raw,
    errors: point.errors > 0 ? point.wpm : null
  }));

  const problemKeys = Object.entries(keyErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalChars = correctChars + incorrectChars;

  const stats = [
    {
      icon: Trophy,
      label: 'WPM',
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

  const handleNextTest = () => {
    resetTest();
    navigate('/typing');
  };

  const chartLineColor = '#3b82f6';
  const chartRawColor = '#646669';
  const chartErrorColor = '#ca4754';
  const chartAxisColor = isDarkMode ? '#aaa' : '#555';
  const chartGridColor = isDarkMode ? '#333' : '#ccc';

  return (
    <div className="min-h-screen pb-24 md:pb-28 lg:pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">Test Results</h1>
            <Button
              onClick={handleNextTest}
              variant="default"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Next Test
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Performance Summary
              </CardTitle>
              <div className="text-center text-sm text-muted-foreground">
                Category: <span className="font-semibold text-primary">{category}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (index * 0.1) }}
                      className={`${stat.bgColor} rounded-lg p-4 text-center`}
                    >
                      <IconComponent className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                      <div className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {wpmHistory.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <h3 className="text-lg font-semibold mb-4">WPM Over Time</h3>
                  
                  <div className="bg-card rounded-lg border p-3 sm:p-6">
                    <div className="h-64 sm:h-80 w-full relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground whitespace-nowrap origin-center">
                        WPM
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart 
                          data={chartData}
                          margin={{ top: 10, right: 5, left: 20, bottom: 30 }}
                        >
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={chartGridColor}
                            strokeOpacity={0.3}
                            vertical={false}
                          />
                          <XAxis 
                            dataKey="second" 
                            stroke={chartAxisColor}
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke={chartAxisColor}
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            domain={[0, 'auto']}
                            width={30}
                          />
                          <text 
                            x="50%" 
                            y="98%" 
                            textAnchor="middle" 
                            style={{ fontSize: 11, fill: chartAxisColor }}
                          >
                            Time (s)
                          </text>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDarkMode ? '#09090b' : '#ffffff',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.5rem',
                              padding: '6px 10px',
                              color: isDarkMode ? '#e4e4e7' : '#18181b',
                              fontSize: '12px'
                            }}
                            itemStyle={{
                              color: isDarkMode ? '#e4e4e7' : '#18181b',
                              fontSize: '12px'
                            }}
                            labelStyle={{
                              display: 'none'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="raw" 
                            stroke={chartRawColor}
                            strokeWidth={1.5}
                            dot={false}
                            name="Raw WPM"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="wpm" 
                            stroke={chartLineColor}
                            strokeWidth={1.5}
                            dot={false}
                            name="WPM"
                          />
                          <Scatter 
                            dataKey="errors" 
                            fill={chartErrorColor}
                            legendType="none"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 sm:w-8 h-0.5 rounded" style={{ backgroundColor: chartLineColor }}></div>
                        <span className="text-xs sm:text-sm text-muted-foreground">WPM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 sm:w-8 h-0.5 rounded" style={{ backgroundColor: chartRawColor }}></div>
                        <span className="text-xs sm:text-sm text-muted-foreground">Raw</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartErrorColor }}></div>
                        <span className="text-xs sm:text-sm text-muted-foreground">Errors</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Character Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Correct Characters:</span>
                    <span className="font-semibold text-green-500">{correctChars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Incorrect Characters:</span>
                    <span className="font-semibold text-red-500">{incorrectChars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Characters:</span>
                    <span className="font-semibold">{totalChars}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Raw WPM:</span>
                    <span className="font-semibold">{rawWpm}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {problemKeys.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Missed Keys</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {problemKeys.map(([key, count]) => (
                        <div
                          key={key}
                          className="flex flex-col items-center justify-center bg-secondary rounded-lg p-3 min-w-[60px]"
                        >
                          <span className="text-2xl font-mono font-bold">
                            {key === ' ' ? '␣' : key === '\n' ? '↵' : key}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {count} {count === 1 ? 'miss' : 'misses'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <KeyboardHeatmap keyErrors={keyErrors} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={handleNextTest}
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Take Another Test
            </Button>
            <Button
              onClick={() => navigate('/history')}
              variant="outline"
              size="lg"
            >
              View History
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
