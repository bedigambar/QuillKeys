import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTypingStore } from '@/store/typing-store';
import { Trophy, Target, Clock, Download, History } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';

const ResultCard = () => {
  const { wpm, accuracy, timerDuration, timeLeft, wpmHistory, category, contentType } = useTypingStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDownloadCertificate = async () => {
    if (cardRef.current === null) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: isDarkMode ? '#09090b' : '#ffffff',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          margin: '0',
          width: 'auto',
          height: 'auto',
          maxHeight: 'none',
          maxWidth: 'none'
        },
        filter: () => true
      });

      const link = document.createElement('a');
      link.download = `quillkeys-certificate-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate', err);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const actualDuration = typeof timerDuration === 'number' ? timerDuration : 120;
  const timeTaken = actualDuration - timeLeft;

  const peakWpm = wpmHistory.length > 0 ? Math.max(...wpmHistory.map(d => d.wpm)) : wpm;

  const avgWpm = wpm;

  const calculateConsistency = () => {
    if (wpmHistory.length < 2) return 100;

    const historyMean = wpmHistory.reduce((sum, d) => sum + d.wpm, 0) / wpmHistory.length;

    if (historyMean === 0) return 100;

    const variance = wpmHistory.reduce((sum, d) => sum + Math.pow(d.wpm - historyMean, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);

    const cv = stdDev / historyMean;

    const consistency = 100 * (1 - cv);

    return Math.round(Math.max(0, Math.min(100, consistency)));
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

  const chartLineColor = '#3b82f6';
  const chartRawColor = '#9ca3af';
  const chartErrorColor = '#ef4444';
  const chartAxisColor = isDarkMode ? '#aaa' : '#555';
  const chartGridColor = isDarkMode ? '#333' : '#ccc';
  const tooltipBgColor = isDarkMode ? '#18181b' : 'white';
  const tooltipTextColor = isDarkMode ? 'white' : 'black';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-lg border shadow-lg backdrop-blur-sm" style={{
          backgroundColor: tooltipBgColor,
          borderColor: chartGridColor,
          color: tooltipTextColor
        }}>
          <p className="text-sm font-medium mb-2 opacity-70">{`Time: ${label}s`}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartLineColor }} />
              <span className="font-semibold">WPM:</span>
              <span>{data.wpm}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartRawColor }} />
              <span className="font-semibold">Raw:</span>
              <span>{data.raw}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartErrorColor }} />
              <span className="font-semibold">Errors:</span>
              <span>{data.errors}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card ref={cardRef} className="w-full max-w-2xl mx-auto relative bg-card text-card-foreground">
        <span
          className="absolute left-3 top-3 z-10 select-none font-extrabold text-primary text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight px-2 py-1 rounded bg-white/80 dark:bg-neutral-900/80 shadow-sm"
          style={{ pointerEvents: 'none' }}
        >
          QuillKeys
        </span>
        <CardHeader>
          <CardTitle
            className="text-center text-xl sm:text-2xl font-bold mt-8 xs:mt-10"
            style={{ marginTop: '2.5rem' }}
          >
            Test Results
          </CardTitle>
          <div className="text-center text-sm sm:text-base text-muted-foreground mt-1">
            <span className="capitalize">{contentType}</span> by <span className="font-semibold text-primary">{category}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
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
              <div className={`text-xl font-bold ${consistencyScore >= 80 ? 'text-green-500' :
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
                        <stop offset="5%" stopColor={chartLineColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartLineColor} stopOpacity={0} />
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
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke={chartLineColor}
                      strokeWidth={3}
                      dot={{ fill: chartLineColor, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      fill="url(#colorWpm)"
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="raw"
                      stroke={chartRawColor}
                      strokeWidth={2}
                      strokeOpacity={0}
                      dot={false}
                      activeDot={{ r: 4, fill: chartRawColor, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke={chartErrorColor}
                      strokeWidth={2}
                      strokeOpacity={0}
                      dot={false}
                      activeDot={{ r: 4, fill: chartErrorColor, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={handleDownloadCertificate} className="gap-2">
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
        <Button onClick={() => navigate('/history')} variant="outline" className="gap-2">
          <History className="w-4 h-4" />
          View History
        </Button>
      </div>
    </motion.div>
  );
}

export default ResultCard;
