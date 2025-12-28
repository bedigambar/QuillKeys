import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="p-6 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <FileQuestion className="w-16 h-16 text-muted-foreground/80" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            404: A Void in the Text
          </motion.h1>

          <motion.blockquote
            className="text-lg sm:text-xl md:text-2xl font-serif italic text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            "I am free and that is why I am lost."
            <footer className="text-sm sm:text-base font-sans mt-2 not-italic text-muted-foreground/60">
              — Franz Kafka
            </footer>
          </motion.blockquote>

          <motion.p
            className="text-base sm:text-lg text-foreground/80 mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            The page you are looking for seems to have been redacted from our archives. 
            Perhaps it exists only in the imagination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/")}
              className="gap-2 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-5 h-5" />
              Return to Safety
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
