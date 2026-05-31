import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { useTypingStore } from '@/store/typing-store';
import { Button } from '@/components/ui/button';
import { Download, Quote, KeyboardIcon } from 'lucide-react';

export default function StyleCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { wpm, accuracy, category, contentType, currentText, wpmHistory } = useTypingStore();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        if (width < 620) {
          // Add a small 20px padding buffer for margins
          setScale(Math.max(0.4, (width - 20) / 600));
        } else {
          setScale(1);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract a readable excerpt from the passage text
  const getExcerpt = (text: string) => {
    if (!text) return '';
    const cleanText = text.replace(/\n/g, ' ').trim();
    if (cleanText.length <= 110) return `“${cleanText}”`;
    return `“${cleanText.substring(0, 107)}...”`;
  };

  const excerpt = getExcerpt(currentText);

  // Consistency score calculation
  const calculateConsistency = () => {
    if (wpmHistory.length < 2) return 90;
    const historyMean = wpmHistory.reduce((sum, d) => sum + d.wpm, 0) / wpmHistory.length;
    if (historyMean === 0) return 100;
    const variance = wpmHistory.reduce((sum, d) => sum + Math.pow(d.wpm - historyMean, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / historyMean;
    const consistency = 100 * (1 - cv);
    return Math.round(Math.max(0, Math.min(100, consistency)));
  };

  const consistency = calculateConsistency();

  // Export card to PNG
  const handleExport = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#000000', // Deep solid black background
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          margin: '0',
          width: '600px',
          height: '380px'
        }
      });
      const link = document.createElement('a');
      link.download = `quillkeys-signature-${category.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export signature style card', err);
    }
  };

  // SVG rhythm waveform generator based on wpmHistory
  const renderWaveform = () => {
    if (wpmHistory.length === 0) return null;
    const maxWpmInHistory = Math.max(...wpmHistory.map(h => h.wpm), wpm);
    const scaleY = maxWpmInHistory > 0 ? 35 / maxWpmInHistory : 1;
    
    // We only display up to 25 steps to fit nicely
    const historySubset = wpmHistory.length > 25 
      ? wpmHistory.filter((_, idx) => idx % Math.ceil(wpmHistory.length / 25) === 0)
      : wpmHistory;

    return (
      <svg className="w-full h-[40px] text-zinc-700" viewBox={`0 0 ${historySubset.length * 10} 40`} preserveAspectRatio="none">
        {historySubset.map((pt, index) => {
          const barHeight = Math.max(4, pt.wpm * scaleY);
          return (
            <rect
              key={index}
              x={index * 10 + 2}
              y={40 - barHeight}
              width={6}
              height={barHeight}
              rx={1.5}
              fill="#d4af37"
              className="opacity-90"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center space-y-5 w-full overflow-hidden">
      {/* Visual Signature Card Wrapper */}
      <div 
        style={{ 
          height: `${380 * scale}px`,
          width: `${600 * scale}px`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: '600px',
            height: '380px',
            flexShrink: 0
          }}
        >
          {/* Visual Signature Card Container */}
          <div 
            ref={cardRef} 
            className="w-[600px] h-[380px] bg-black border border-zinc-800 rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl"
            style={{
              fontFamily: "'Poppins', sans-serif",
              boxSizing: 'border-box'
            }}
          >
        
        {/* Card Header */}
        <div className="flex justify-between items-start z-10">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
              Rhythm Signature
            </span>
            <h3 className="text-white text-xl font-bold font-serif tracking-tight flex items-center gap-1.5">
              {category}
              <span className="text-zinc-500 text-xs font-normal font-sans py-0.5 px-2 bg-zinc-900 border border-zinc-800 rounded-full capitalize">
                {contentType}
              </span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
              Platform
            </span>
            <div className="text-white text-xs font-semibold tracking-wider flex items-center justify-end gap-1">
              <KeyboardIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>QUILLKEYS</span>
            </div>
          </div>
        </div>

        {/* Card Body - Quote */}
        <div className="my-2 px-4 py-3 bg-zinc-900/40 border border-zinc-900 rounded-xl relative z-10">
          <Quote className="absolute top-2 left-2 w-7 h-7 text-zinc-800 -z-10" />
          <p className="text-zinc-300 text-xs font-serif leading-relaxed italic pr-2">
            {excerpt}
          </p>
        </div>

        {/* Card Footer - Stats and Waveform */}
        <div className="grid grid-cols-12 gap-6 items-end z-10">
          {/* Main metrics */}
          <div className="col-span-5 flex gap-4 items-center">
            {/* WPM Big display */}
            <div className="relative flex items-center justify-center bg-zinc-900 border border-zinc-800 w-20 h-20 rounded-2xl shadow-inner">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-white tracking-tighter">
                  {wpm}
                </div>
                <div className="text-[9px] text-zinc-500 font-semibold tracking-wider">
                  WPM
                </div>
              </div>
            </div>

            {/* Acc & Consistency list */}
            <div className="space-y-2">
              <div>
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  Accuracy
                </div>
                <div className="text-sm font-bold text-white">
                  {accuracy}%
                </div>
              </div>
              <div>
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  Consistency
                </div>
                <div className="text-sm font-bold text-[#d4af37]">
                  {consistency}%
                </div>
              </div>
            </div>
          </div>

          {/* Typing Waveform Visualizer */}
          <div className="col-span-7 space-y-1">
            <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>Keystroke Rhythm Waveform</span>
              <span className="text-zinc-600">Tempo: {wpm > 65 ? 'Allegro' : 'Andante'}</span>
            </div>
            <div className="h-[48px] bg-zinc-900/70 border border-zinc-900 rounded-xl px-2.5 py-1 flex items-center justify-center">
              {wpmHistory.length > 1 ? (
                renderWaveform()
              ) : (
                <div className="text-zinc-600 text-[10px] italic">No rhythm wave recorded</div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

      {/* Control button */}
      <Button 
        onClick={handleExport}
        className="gap-2 bg-[#d4af37] hover:bg-[#c5a028] text-black font-semibold shadow-md px-6 py-2.5 rounded-full border-none transition-all"
      >
        <Download className="w-4 h-4" />
        Download Shareable Card
      </Button>
    </div>
  );
}
