
import { Tabs, TabsTrigger } from './ui/tabs'
import { useTypingStore, type TimerOption } from '@/store/typing-store'
import { TabsList } from '@radix-ui/react-tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

import { Play, RotateCcw, Clock } from 'lucide-react';
import { getRandomQuestion } from '@/data/questions';
import { useState } from 'react';

const ControlPanel = () => {
    const { timerDuration, setTimerDuration, category, startTest, setCategory, status, resetTest,
        setCurrentText, customTimerDuration, setCustomTimerDuration
    } = useTypingStore();

    const [customInput, setCustomInput] = useState(customTimerDuration.toString());

    const categories = ['kafka', 'Dostoevsky', 'Camus', 'Gogol'];
    const timerOptions: TimerOption[] = [30, 60, 180, 'custom'];

    const formatTime = (seconds: number | string) => {
        if (seconds === 'custom') return 'Custom';
        const numSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
        if (numSeconds < 60) return `${numSeconds}s`;
        return `${Math.floor(numSeconds / 60)}m`;
    }

    const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomInput(value);
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0 && numValue <= 600) {
            setCustomTimerDuration(numValue);
        }
    }

    const handleStart = () => {
        const question = getRandomQuestion(category);
        setCurrentText(question.text);

        startTest();
    }
    return (
        <div className='space-y-4'>
            {/* Timer section - centered */}
            <div className='flex flex-col items-center'>
                <div className='text-sm font-medium mb-1'>Timer</div>
                <Tabs
                    value={timerDuration.toString()}
                    onValueChange={(value) => {
                        if (value === 'custom') {
                            setTimerDuration('custom');
                        } else {
                            setTimerDuration(Number(value) as TimerOption);
                        }
                    }}
                    className='w-auto'
                >
                    <TabsList className={`bg-gray-200/80 dark:bg-gray-800/80 rounded-full w-fit ${status === 'running' ? 'pointer-events-none opacity-50' : ''}`}>
                        {timerOptions.map((time) => (
                            <TabsTrigger key={time} value={time.toString()}>
                                {formatTime(time)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Custom timer input */}
                {timerDuration === 'custom' && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="number"
                                min="1"
                                max="600"
                                value={customInput}
                                onChange={handleCustomInputChange}
                                disabled={status === 'running'}
                                placeholder="120"
                                className="w-20 px-3 py-1.5 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">seconds</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Max: 600s</p>
                    </div>
                )}
            </div>

            {/* Category and Button row */}
            <div className='flex items-end justify-between gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="text-sm font-medium pl-1">Category</div>
                    <Select
                        value={category}
                        onValueChange={setCategory}
                        disabled={status === 'running'}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex gap-2'>
                    {status == 'idle' && (
                        <Button onClick={handleStart} className='flex items-center justify-center gap-2 min-w-[120px] sm:min-w-0 px-6 sm:px-4'>
                            <Play className='w-4 h-4' />
                            <span className='hidden sm:inline'>Start Test</span>
                            <span className='sm:hidden'>Start</span>
                        </Button>
                    )}

                    {(status == 'running' || status == 'completed') && (
                        <Button onClick={resetTest} variant="outline" className="flex items-center justify-center gap-2 min-w-[120px] sm:min-w-0 px-6 sm:px-4">
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ControlPanel