import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DetectiveScene, { type DetectiveState } from '@/components/DetectiveScene';
import { Search, FileText, Shield, Sparkles } from 'lucide-react';

const Index = () => {
  const [state, setState] = useState<DetectiveState>('idle');
  const [text, setText] = useState('');
  const [truthScore, setTruthScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;

    setState('scanning');
    setShowResults(false);
    setProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const score = Math.floor(Math.random() * 60) + 40;
          setTruthScore(score);
          setState('results');
          setShowResults(true);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  }, [text]);

  const handleReset = useCallback(() => {
    setState('idle');
    setText('');
    setProgress(0);
    setShowResults(false);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <DetectiveScene state={state} truthScore={truthScore} progress={progress} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center box-glow">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground text-glow">
              TruthLens
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-body hidden sm:block">
            AI-Powered Fact Verification
          </p>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex items-end justify-center pb-8 px-4 sm:px-6">
          <div className="w-full max-w-2xl space-y-4">
            <AnimatePresence mode="wait">
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-6 box-glow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-display"
                      style={{
                        background: truthScore >= 70
                          ? 'linear-gradient(135deg, hsl(145 65% 45%), hsl(160 60% 40%))'
                          : 'linear-gradient(135deg, hsl(0 72% 55%), hsl(15 80% 50%))',
                        color: 'white',
                      }}
                    >
                      {truthScore}%
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">
                        {truthScore >= 70 ? 'Likely Accurate' : 'Needs Verification'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {truthScore >= 70
                          ? 'The detective found strong evidence supporting this claim.'
                          : 'The detective found inconsistencies that warrant further investigation.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-body"
                  >
                    ← Investigate another claim
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar during scanning */}
            <AnimatePresence>
              {state === 'scanning' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-border bg-card/60 backdrop-blur-md p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
                    <span className="text-sm font-body text-foreground">
                      Detective is analyzing the evidence...
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, hsl(200 85% 55%), hsl(175 70% 45%))' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <motion.div
              className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden box-glow"
              layout
            >
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste a claim, article, or statement to investigate..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground p-4 resize-none focus:outline-none font-body text-sm min-h-[100px]"
                disabled={state === 'scanning'}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-body">
                    {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : 'Enter text to analyze'}
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || state === 'scanning'}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Analyze
                </button>
              </div>
            </motion.div>

            <p className="text-center text-xs text-muted-foreground font-body">
              TruthLens uses AI to cross-reference claims against verified sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
