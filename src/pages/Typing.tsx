import Header from '@/components/Header'
import TypingTest from '@/components/TypingTest'
import { motion } from 'framer-motion'

const Typing = () => {
  return (
    <div className='min-h-screen'>
      <Header />

      <main className='container mx-auto px-4 py-4 sm:py-8'>
        <div className='text-center font-poppins'>
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

          <div className='mt-8'>
            <TypingTest />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Typing
