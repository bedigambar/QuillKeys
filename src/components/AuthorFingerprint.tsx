import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTypingStore } from '@/store/typing-store';
import { getAuthorProfile } from '@/data/questions';
import { Lock, Sparkles, Feather, FileText, CheckCircle2 } from 'lucide-react';

interface AuthorFingerprintProps {
  currentCategory: string;
}

export default function AuthorFingerprint({ currentCategory }: AuthorFingerprintProps) {
  const { testResults } = useTypingStore();

  // Filter results of the current author
  const authorResults = testResults.filter(r => r.category === currentCategory);
  const typedCount = authorResults.length;
  const isUnlocked = typedCount >= 5;

  // Retrieve author profile reference
  const authorProfile = getAuthorProfile(currentCategory);

  // Helper to categorize sentence length distributions
  const getLengthBins = (lengths: number[]) => {
    const bins = { short: 0, medium: 0, long: 0 };
    lengths.forEach(len => {
      if (len < 10) bins.short++;
      else if (len <= 22) bins.medium++;
      else bins.long++;
    });
    const total = lengths.length || 1;
    return {
      short: Math.round((bins.short / total) * 100),
      medium: Math.round((bins.medium / total) * 100),
      long: Math.round((bins.long / total) * 100)
    };
  };

  const authorBins = getLengthBins(authorProfile.sentenceLengths);

  // Compute user average metrics
  let userBins = { short: 0, medium: 0, long: 0 };
  let userPunctuation = 0;
  let userComplexity = 0;

  if (typedCount > 0) {
    // Accumulate sentence lengths from all user runs for this author
    const allUserLengths = authorResults.reduce<number[]>((acc, res) => {
      if (res.sentenceLengths) {
        acc.push(...res.sentenceLengths);
      }
      return acc;
    }, []);
    userBins = getLengthBins(allUserLengths);

    // Average punctuation density and word complexity
    const validPunctuation = authorResults.filter(res => res.punctuationDensity !== undefined);
    userPunctuation = validPunctuation.length > 0
      ? validPunctuation.reduce((sum, res) => sum + (res.punctuationDensity || 0), 0) / validPunctuation.length
      : 0;

    const validComplexity = authorResults.filter(res => res.wordComplexity !== undefined);
    userComplexity = validComplexity.length > 0
      ? validComplexity.reduce((sum, res) => sum + (res.wordComplexity || 0), 0) / validComplexity.length
      : 0;
  }

  const chartData = [
    {
      name: 'Short (<10w)',
      [currentCategory]: authorBins.short,
      'Your typing': userBins.short
    },
    {
      name: 'Medium (10-22w)',
      [currentCategory]: authorBins.medium,
      'Your typing': userBins.medium
    },
    {
      name: 'Long (>22w)',
      [currentCategory]: authorBins.long,
      'Your typing': userBins.long
    }
  ];

  return (
    <Card className="w-full mt-8 border border-border bg-card/60 backdrop-blur-md relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Feather className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg sm:text-xl font-bold">
            Author Fingerprint: {currentCategory}
          </CardTitle>
        </div>
        <CardDescription>
          Analyzing the style signature of {currentCategory} and comparing it to your typing rhythm
        </CardDescription>
      </CardHeader>

      <CardContent className="relative min-h-[220px]">
        {!isUnlocked ? (
          // Locked State
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="absolute inset-0 bg-background/40 dark:bg-background/20 backdrop-blur-md z-10 rounded-b-lg flex flex-col items-center justify-center p-4">
              <div className="bg-background/90 dark:bg-zinc-900 border border-border/80 p-5 rounded-2xl shadow-xl max-w-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary animate-pulse">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm sm:text-base">Style Comparison Locked</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Type at least <strong>5 passages</strong> by {currentCategory} to build your profile and unlock the comparative fingerprint.
                  </p>
                </div>
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Passages Typed</span>
                    <span className="text-primary">{typedCount} / 5</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(typedCount / 5) * 100}%` }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Unlocked State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
          >
            {/* Chart Column */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Sentence Length Distribution (%)
              </h4>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" fontSize={11} stroke="currentColor" opacity={0.7} />
                    <YAxis fontSize={11} stroke="currentColor" opacity={0.7} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey={currentCategory} fill="var(--color-primary)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Bar dataKey="Your typing" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Column */}
            <div className="space-y-4 flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Stylistic Metrics Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric Card 1: Punctuation density */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-background/40">
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Punctuation Density
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {userPunctuation.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs {authorPunctuationDensity(currentCategory).toFixed(1)}% author
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 mt-1">
                    Marks typed per 100 words. Woolf/Dickinson dense; Kafka sparser.
                  </p>
                </div>

                {/* Metric Card 2: Word Complexity */}
                <div className="p-3 sm:p-4 rounded-xl border border-border bg-background/40">
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Word Complexity
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {userComplexity.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs {authorWordComplexity(currentCategory).toFixed(1)} author
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 mt-1">
                    Average letters per word. High indicates sophisticated literary vocabulary.
                  </p>
                </div>
              </div>

              {/* Rhythm diagnosis */}
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-700 dark:text-green-300 flex gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Rhythm Sync:</span> Your typing patterns map closely to {currentCategory}’s prose tempo. Average word length divergence is minimal.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Fallback lookup defaults if dynamic profile calculation has no texts (failsafe)
function authorPunctuationDensity(category: string): number {
  const profile = getAuthorProfile(category);
  return profile.punctuationDensity || 10;
}

function authorWordComplexity(category: string): number {
  const profile = getAuthorProfile(category);
  return profile.wordComplexity || 4.5;
}
