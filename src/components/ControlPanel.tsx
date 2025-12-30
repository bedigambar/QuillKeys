
import { Tabs, TabsTrigger } from './ui/tabs'
import { useTypingStore, type TimerOption } from '@/store/typing-store'
import { TabsList } from '@radix-ui/react-tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

import { Play, RotateCcw, Clock, Type, MousePointer2, EyeOff, BookOpen, Focus } from 'lucide-react';
import { getRandomQuestion, getCategoriesByContentType } from '@/data/questions';
import { useState, useEffect } from 'react';

const ControlPanel = () => {
    const { timerDuration, setTimerDuration, category, startCountdown, setCategory, status, resetTest,
        setCurrentText, customTimerDuration, setCustomTimerDuration,
        fontTheme, setFontTheme, caretStyle, setCaretStyle, zenMode, toggleZenMode,
        contentType, setContentType, focusMode, toggleFocusMode
    } = useTypingStore();

    const [customInput, setCustomInput] = useState(customTimerDuration.toString());

    const categories = getCategoriesByContentType(contentType);
    const timerOptions: TimerOption[] = [30, 60, 180, 'custom'];

    useEffect(() => {
        const availableCategories = getCategoriesByContentType(contentType);
        if (availableCategories.length > 0 && !availableCategories.includes(category)) {
            setCategory(availableCategories[0]);
        }
    }, [contentType, setCategory, category]);

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

            <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4 lg:gap-4 pt-4'>
                <div className='grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 lg:gap-4 w-full lg:w-auto'>
                    <div className='flex flex-col gap-1.5 w-full sm:w-auto'>
                        <div className='text-xs font-medium text-gray-700 dark:text-gray-300 ml-1'>Type</div>
                        <Select
                            value={contentType}
                            onValueChange={(val: 'prose' | 'poetry') => setContentType(val)}
                            disabled={status === 'running' || status === 'countdown'}
                        >
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="prose">Prose</SelectItem>
                                <SelectItem value="poetry">Poetry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-col gap-1.5 w-full sm:w-auto'>
                        <div className='text-xs font-medium text-gray-700 dark:text-gray-300 ml-1'>Category</div>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                            disabled={status === 'running' || status === 'countdown'}
                        >
                            <SelectTrigger className="w-full sm:w-[160px]">
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

                    <div className='flex flex-col gap-1.5 w-full sm:w-auto'>
                        <div className='text-xs font-medium text-gray-700 dark:text-gray-300 ml-1'>Font</div>
                        <Select value={fontTheme} onValueChange={(v) => setFontTheme(v as any)}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <div className="flex items-center gap-2 truncate">
                                    <Type className="w-4 h-4 shrink-0" />
                                    <SelectValue placeholder="Font" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="serif">Serif</SelectItem>
                                <SelectItem value="sans">Sans</SelectItem>
                                <SelectItem value="mono">Mono</SelectItem>
                                <SelectItem value="merriweather">Merriweather</SelectItem>
                                <SelectItem value="roboto">Roboto Mono</SelectItem>
                                <SelectItem value="fira">Fira Code</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-col gap-1.5 w-full sm:w-auto'>
                        <div className='text-xs font-medium text-gray-700 dark:text-gray-300 ml-1'>Caret</div>
                        <Select value={caretStyle} onValueChange={(v) => setCaretStyle(v as any)}>
                            <SelectTrigger className="w-full sm:w-[130px]">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <MousePointer2 className="w-4 h-4 shrink-0" />
                                    <SelectValue placeholder="Caret" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="line">Line</SelectItem>
                                <SelectItem value="block">Block</SelectItem>
                                <SelectItem value="underline">Underline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='flex gap-2 sm:gap-3 items-end justify-center pb-0.5 w-full lg:w-auto'>
                    <Button
                        variant={zenMode ? "secondary" : "ghost"}
                        onClick={toggleZenMode}
                        className="h-10 w-10 p-0"
                        title="Zen Mode"
                    >
                        <EyeOff className="w-4 h-4" />
                    </Button>

                    <Button
                        variant={focusMode ? "secondary" : "ghost"}
                        onClick={toggleFocusMode}
                        className="h-10 w-10 p-0"
                        title="Focus Mode - Blur upcoming text"
                    >
                        <Focus className="w-4 h-4" />
                    </Button>

                    {status == 'idle' && (
                        <Button onClick={handleStart} className='h-10 px-4 sm:px-6'>
                            <Play className='w-4 h-4 mr-1 sm:mr-2' />
                            <span className="hidden sm:inline">Start Test</span>
                            <span className="sm:hidden">Start</span>
                        </Button>
                    )}

                    {(status == 'running' || status == 'completed' || status == 'countdown') && (
                        <Button onClick={resetTest} variant="outline" className="h-10 px-4 sm:px-6">
                            <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div >
    )
}

export default ControlPanel