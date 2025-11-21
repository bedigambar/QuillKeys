import Header from '@/components/Header'
import TypingTest from '@/components/TypingTest'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import ShortcutNotifications from '@/components/ShortcutNotifications'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useShortcutNotifications } from '@/hooks/useShortcutNotifications'
import { useTypingStore } from '@/store/typing-store'
import { motion } from 'framer-motion'

const Typing = () => {

  const { notifications, removeNotification, notifyRestart, notifyStart } = useShortcutNotifications();
  const { zenMode } = useTypingStore();


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
    </div>
  )
}

export default Typing
