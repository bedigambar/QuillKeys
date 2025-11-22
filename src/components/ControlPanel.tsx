
import { Tabs, TabsTrigger } from './ui/tabs'
import { useTypingStore, type TimerOption } from '@/store/typing-store'
import { TabsList } from '@radix-ui/react-tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

import { Play, RotateCcw, Clock, Type, MousePointer2, EyeOff } from 'lucide-react';
import { getRandomQuestion } from '@/data/questions';
import { useState } from 'react';

const ControlPanel = () => {
    const { timerDuration, setTimerDuration, category, startCountdown, setCategory, status, resetTest,
        setCurrentText, customTimerDuration, setCustomTimerDuration,
        fontTheme, setFontTheme, caretStyle, setCaretStyle, zenMode, toggleZenMode
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

        startCountdown();
    }
    return (
        <div className='space-y-4'>
            <div className="flex flex-col items-center gap-2 sm:gap-3">
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
                    <TabsList className={`bg-gray-200/80 dark:bg-gray-800/80 rounded-full w-fit ${status === 'running' || status === 'countdown' ? 'pointer-events-none opacity-50' : ''}`}>
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
                                disabled={status === 'running' || status === 'countdown'}
                                placeholder="120"
                                className="w-20 px-3 py-1.5 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">seconds</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Max: 600s</p>
                    </div>
                )}
            </div>

            <div className='flex items-end justify-between gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="text-sm font-medium pl-1">Category</div>
                    <Select
                        value={category}
                        onValueChange={setCategory}
                        disabled={status === 'running' || status === 'countdown'}
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

                    {(status == 'running' || status == 'completed' || status == 'countdown') && (
                        <Button onClick={resetTest} variant="outline" className="flex items-center justify-center gap-2 min-w-[120px] sm:min-w-0 px-6 sm:px-4">
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-row gap-4 sm:gap-6 items-center justify-center pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap">
                <div className="flex gap-1 sm:gap-2 items-center">
                    <Type className="w-4 h-4 text-gray-500" />
                    <Select value={fontTheme} onValueChange={(v) => setFontTheme(v as any)}>
                        <SelectTrigger className="w-[85px] sm:w-[100px] h-8 text-xs px-2">
                            <SelectValue placeholder="Font" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="sans">Sans</SelectItem>
                            <SelectItem value="mono">Mono</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-1 sm:gap-2 items-center">
                    <MousePointer2 className="w-4 h-4 text-gray-500" />
                    <Select value={caretStyle} onValueChange={(v) => setCaretStyle(v as any)}>
                        <SelectTrigger className="w-[85px] sm:w-[100px] h-8 text-xs px-2">
                            <SelectValue placeholder="Caret" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="block">Block</SelectItem>
                            <SelectItem value="underline">Underline</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Zen Mode */}
                <Button
                    variant={zenMode ? "secondary" : "ghost"}
                    size="sm"
                    onClick={toggleZenMode}
                    className="h-8 text-xs gap-2"
                >
                    <EyeOff className="w-3 h-3" />
                    Zen Mode
                </Button>
            </div>
        </div >
    )
}

export default ControlPanel