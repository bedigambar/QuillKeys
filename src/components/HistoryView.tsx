import { useTypingStore } from '@/store/typing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { motion, type Variants } from 'framer-motion';
import { Trophy, Target, TrendingUp, Award, Trash2, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const HistoryView = () => {
    const { testResults, clearHistory } = useTypingStore();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<'date' | 'wpm' | 'accuracy'>('date');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showClearDialog, setShowClearDialog] = useState(false);

    const categories = ['all', ...Array.from(new Set(testResults.map(r => r.category)))];

    let filteredResults = filterCategory === 'all'
        ? testResults
        : testResults.filter(r => r.category === filterCategory);

    const sortedResults = [...filteredResults].sort((a, b) => {
        if (sortBy === 'date') return b.timestamp - a.timestamp;
        if (sortBy === 'wpm') return b.wpm - a.wpm;
        if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
        return 0;
    });

    const totalTests = testResults.length;
    const avgWpm = totalTests > 0
        ? Math.round(testResults.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
        : 0;
    const bestWpm = totalTests > 0
        ? Math.max(...testResults.map(r => r.wpm))
        : 0;
    const avgAccuracy = totalTests > 0
        ? Math.round(testResults.reduce((sum, r) => sum + r.accuracy, 0) / totalTests)
        : 0;

    const chartData = testResults.slice(-20).map((result, index) => ({
        index: index + 1,
        wpm: result.wpm,
        accuracy: result.accuracy,
        date: new Date(result.timestamp).toLocaleDateString(),
        fullDate: new Date(result.timestamp).toLocaleString()
    }));

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    // Get accuracy badge color
    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 95) return 'text-green-500 bg-green-500/10';
        if (accuracy >= 85) return 'text-yellow-500 bg-yellow-500/10';
        return 'text-orange-500 bg-orange-500/10';
    };

    const stats = [
        {
            icon: Trophy,
            label: 'Total Tests',
            value: totalTests,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            icon: TrendingUp,
            label: 'Average WPM',
            value: avgWpm,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10'
        },
        {
            icon: Award,
            label: 'Best WPM',
            value: bestWpm,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10'
        },
        {
            icon: Target,
            label: 'Avg Accuracy',
            value: `${avgAccuracy}%`,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10'
        }
    ];

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-bold"
                    >
                        Your Progress
                    </motion.h2>
                    <motion.div variants={itemVariants} className="flex gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/typing')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Test
                        </Button>
                        {testResults.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-destructive hover:text-destructive"
                                onClick={() => setShowClearDialog(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear History
                            </Button>
                        )}
                    </motion.div>
                </div>

                {testResults.length === 0 ? (
                    <motion.div variants={itemVariants}>
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <motion.div
                                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Trophy className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">No test history yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Complete your first typing test to start tracking your progress!
                                        </p>
                                        <Button onClick={() => navigate('/typing')}>
                                            Start Typing Test
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        >
                            {stats.map((stat, _index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        variants={itemVariants}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="h-full"
                                    >
                                        <Card className={`${stat.bgColor} border-0 h-full transition-shadow hover:shadow-md`}>
                                            <CardContent className="p-4 h-full flex items-center">
                                                <div className="flex items-center gap-3 w-full">
                                                    <IconComponent className={`w-8 h-8 flex-shrink-0 ${stat.color}`} />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</p>
                                                        <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="mb-8 overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Performance Trend (Last 20 Tests)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px] sm:h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                                                <Legend
                                                    verticalAlign="top"
                                                    height={36}
                                                    wrapperStyle={{ fontSize: '12px' }}
                                                    formatter={(value) => {
                                                        if (value === 'wpm') return 'WPM';
                                                        if (value === 'accuracy') return 'Accuracy (%)';
                                                        return value;
                                                    }}
                                                />
                                                <XAxis
                                                    dataKey="index"
                                                    stroke="#888888"
                                                    tick={{ fill: '#888888', fontSize: 12 }}
                                                    label={{
                                                        value: 'Test Number',
                                                        position: 'insideBottom',
                                                        offset: -5,
                                                        fill: '#888888',
                                                        fontSize: 12
                                                    }}
                                                />
                                                <YAxis
                                                    yAxisId="left"
                                                    stroke="#888888"
                                                    tick={{ fill: '#888888', fontSize: 12 }}
                                                    label={{
                                                        value: 'WPM',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        fill: '#FFD700',
                                                        fontSize: 12,
                                                        style: { textAnchor: 'middle' }
                                                    }}
                                                />
                                                <YAxis
                                                    yAxisId="right"
                                                    orientation="right"
                                                    stroke="#10b981"
                                                    tick={{ fill: '#888888', fontSize: 12 }}
                                                    label={{
                                                        value: 'Accuracy %',
                                                        angle: 90,
                                                        position: 'insideRight',
                                                        fill: '#10b981',
                                                        fontSize: 12,
                                                        style: { textAnchor: 'middle' }
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--background))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                        fontSize: '12px'
                                                    }}
                                                    labelFormatter={(label, payload) => {
                                                        if (payload && payload.length > 0) {
                                                            return payload[0].payload.fullDate;
                                                        }
                                                        return `Test ${label}`;
                                                    }}
                                                />
                                                <Area
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="wpm"
                                                    stroke="#FFD700"
                                                    strokeWidth={3}
                                                    fill="url(#colorWpm)"
                                                    dot={{ fill: "#FFD700", r: 4 }}
                                                    animationDuration={1500}
                                                />
                                                <Area
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    fill="url(#colorAccuracy)"
                                                    dot={{ fill: "#10b981", r: 3 }}
                                                    animationDuration={1500}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                            <h3 className="text-xl font-semibold">Recent Sessions</h3>
                            <div className="flex flex-wrap gap-2 sm:ml-auto w-full sm:w-auto">
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="w-full sm:w-[180px] flex-1">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                    <SelectTrigger className="w-full sm:w-[150px] flex-1">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Latest First</SelectItem>
                                        <SelectItem value="wpm">Highest WPM</SelectItem>
                                        <SelectItem value="accuracy">Best Accuracy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {sortedResults.map((result) => (
                                <motion.div
                                    key={result.timestamp}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {timeAgo(result.timestamp)}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(result.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-primary text-2xl">{result.wpm}</div>
                                                    <div className="text-xs text-muted-foreground">WPM</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Accuracy:</span>
                                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${getAccuracyColor(result.accuracy)}`}>
                                                        {result.accuracy}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Category:</span>
                                                    <span className="text-sm font-medium truncate max-w-[140px]">
                                                        {result.category}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Duration:</span>
                                                    <span className="text-sm font-medium">{Math.round(result.timeTaken)}s</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        {sortedResults.length === 0 && (
                            <motion.div variants={itemVariants}>
                                <Card className="border-dashed">
                                    <CardContent className="p-8 text-center text-muted-foreground">
                                        No results found for the selected filters.
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>

            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all your typing test history. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                clearHistory();
                                setShowClearDialog(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Clear History
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default HistoryView;
