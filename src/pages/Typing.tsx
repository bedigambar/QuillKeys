import Header from '@/components/Header'
import TypingTest from '@/components/TypingTest'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import ShortcutNotifications from '@/components/ShortcutNotifications'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useShortcutNotifications } from '@/hooks/useShortcutNotifications'
import { useTypingStore } from '@/store/typing-store'
import { motion } from 'framer-motion'

import { useEffect, useState } from 'react';
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

const Typing = () => {
  const { notifications, removeNotification, notifyRestart, notifyStart } = useShortcutNotifications();
  const { zenMode, status, resetTest } = useTypingStore();
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  // Intercept Ctrl+R / Cmd+R to show custom dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && status === 'running') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowRefreshDialog(true);
      }
    };

    // Use capture phase to intercept before browser handles it
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [status]);

  // Detect pull-to-refresh and other refresh attempts
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchStartY;

      // If pulling down at top of page and test is running
      if (touchDiff > 0 && window.scrollY === 0 && status === 'running') {
        e.preventDefault();
        setShowRefreshDialog(true);
      }
    };

    if (status === 'running') {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [status]);


  useKeyboardShortcuts({
    onRestartTest: () => {
      notifyRestart();
    },
    onStartTest: () => {
      notifyStart();
    }
  });

  return (
    <div className='min-h-screen pb-24 md:pb-28 lg:pb-20'>
      <Header />

      <main className='container mx-auto px-4 py-4 sm:py-8'>
        <div className='text-center font-poppins'>
          {!zenMode && (
            <>
              <h2 className='font-semibold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4'>
                Test Your Typing Speed
              </h2>

              <p className='text-sm sm:text-base md:text-lg px-2'>
                Type through the profound works of{' '}
                <motion.span
                  className='font-edu  font-bold'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                >
                  Kafka
                </motion.span>
                ,{' '}
                <motion.span
                  className='font-edu font-bold'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Dostoevsky
                </motion.span>
                ,{' '}
                <motion.span
                  className='font-edu font-bold'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Camus
                </motion.span>
                , and{' '}
                <motion.span
                  className='font-edu font-bold'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Gogol
                </motion.span>
                —where every word weighs upon the soul.
              </p>
            </>
          )}

          <div className={zenMode ? 'mt-0' : 'mt-8'}>
            <TypingTest />
          </div>
        </div>
      </main>

      <KeyboardShortcuts />
      <ShortcutNotifications
        notifications={notifications}
        onRemove={removeNotification}
      />

      <AlertDialog open={showRefreshDialog} onOpenChange={setShowRefreshDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current progress will be lost. Are you sure you want to restart the test?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetTest();
                setShowRefreshDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Restart Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Typing
