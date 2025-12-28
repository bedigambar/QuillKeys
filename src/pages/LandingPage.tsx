
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import kafkaPortrait from '../assets/kafka-portrait.png';
import dostoevskyPortrait from '../assets/dostoevsky-portrait.png';
import camusPortrait from '../assets/camus-portrait.png';
import gogolPortrait from '../assets/gogol-portrait.png';
import poePortrait from '../assets/edgar-allen-poe-bill-cannon.webp';
import frostPortrait from '../assets/Robert-Frost-1954.webp';
import { BookOpen } from 'lucide-react';



const LandingPage = () => {
  const navigate = useNavigate();

  const quotes = [
    {
      text: "You do not need to leave your room. Remain sitting at your table and listen. The world will freely offer itself to you to be unmasked.",
      author: "Franz Kafka",
      image: kafkaPortrait
    },
    {
      text: "Two roads diverged in a wood, and I—I took the one less traveled by, and that has made all the difference.",
      author: "Robert Frost",
      image: frostPortrait
    },
    {
      text: "All that we see or seem is but a dream within a dream.",
      author: "Edgar Allan Poe",
      image: poePortrait
    },
    {
      text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
      author: "Fyodor Dostoevsky",
      image: dostoevskyPortrait
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto mt-12 sm:mt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-mono font-bold mb-8 sm:mb-8 leading-snug px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Type Through the Minds of
            <motion.span
              className="block mt-3 sm:mt-4 font-edu font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Those Who Shaped Literature
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experience the contrast between poetic rhythm and prose narrative. Authentic passages from the masters, waiting for your keystrokes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-32 sm:mb-0"
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/typing")}
              className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-auto"
            >
              Start Typing Through History
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/about")}
              className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-auto gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Our Philosophy
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-0 sm:left-8 md:left-2 lg:left-4 xl:left-8 2xl:left-12 top-[25%] md:top-[15%] opacity-20"
          initial={{ opacity: 0, x: -50, rotate: -12 }}
          animate={{ opacity: 0.2, x: 0, rotate: -12 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <img
            src={kafkaPortrait}
            alt="Franz Kafka"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform -rotate-12"
          />
        </motion.div>

        <motion.div
          className="absolute left-0 sm:left-8 md:left-2 lg:left-4 xl:left-8 2xl:left-12 top-[50%] md:top-[50%] -translate-y-1/2 opacity-20"
          initial={{ opacity: 0, x: -50, rotate: 8 }}
          animate={{ opacity: 0.2, x: 0, rotate: 8 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <img
            src={camusPortrait}
            alt="Albert Camus"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform rotate-8"
          />
        </motion.div>

        <motion.div
          className="absolute left-0 sm:left-8 md:left-2 lg:left-4 xl:left-8 2xl:left-12 top-[58%] md:top-auto md:bottom-[15%] bottom-auto opacity-20"
          initial={{ opacity: 0, x: -50, rotate: -6 }}
          animate={{ opacity: 0.2, x: 0, rotate: -6 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <img
            src={poePortrait}
            alt="Edgar Allan Poe"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform -rotate-6"
          />
        </motion.div>

        <motion.div
          className="absolute right-0 sm:right-8 md:right-2 lg:right-4 xl:right-8 2xl:right-12 top-[25%] md:top-[15%] opacity-20"
          initial={{ opacity: 0, x: 50, rotate: 12 }}
          animate={{ opacity: 0.2, x: 0, rotate: 12 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <img
            src={frostPortrait}
            alt="Robert Frost"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform rotate-12"
          />
        </motion.div>

        <motion.div
          className="absolute right-0 sm:right-8 md:right-2 lg:right-4 xl:right-8 2xl:right-12 top-[50%] md:top-[50%] -translate-y-1/2 opacity-20"
          initial={{ opacity: 0, x: 50, rotate: -8 }}
          animate={{ opacity: 0.2, x: 0, rotate: -8 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <img
            src={gogolPortrait}
            alt="Nikolai Gogol"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform -rotate-8"
          />
        </motion.div>

        <motion.div
          className="absolute right-0 sm:right-8 md:right-2 lg:right-4 xl:right-8 2xl:right-12 top-[58%] md:top-auto md:bottom-[15%] bottom-auto opacity-20"
          initial={{ opacity: 0, x: 50, rotate: 6 }}
          animate={{ opacity: 0.2, x: 0, rotate: 6 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <img
            src={dostoevskyPortrait}
            alt="Fyodor Dostoevsky"
            className="w-20 h-28 sm:w-24 sm:h-32 md:w-20 md:h-28 lg:w-24 lg:h-32 xl:w-32 xl:h-40 2xl:w-40 2xl:h-52 object-cover rounded-lg shadow-deep transform rotate-6"
          />
        </motion.div>
      </section>

      <section className="-mt-12 sm:mt-0 sm:py-8 md:pt-12 md:pb-6 lg:pt-16 lg:pb-8 xl:pt-24 xl:pb-12 px-4 sm:px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-center mb-3 sm:mb-6 md:mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Words That Shaped Minds
          </motion.h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-border/40 dark:border-border/30 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <img
                    src={quote.image}
                    alt={quote.author}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shadow-deep group-hover:scale-105 transition-transform mx-auto sm:mx-0"
                  />

                  <div className="flex-1">
                    <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif italic text-foreground/90 mb-3 sm:mb-4 leading-relaxed">
                      "{quote.text}"
                    </blockquote>

                    <cite className="text-sm sm:text-base md:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 drop-shadow-md">
                      — {quote.author}
                    </cite>
                  </div>
                </div>

                <div className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">"</div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center text-gray-700 dark:text-muted-foreground mt-6 sm:mt-8 font-serif italic text-base sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            ...and many more literary giants waiting to be discovered.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-card/20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Type Words That Changed the World?
          </motion.h3>

          <motion.p
            className="text-base sm:text-lg text-foreground/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Type through existential masterpieces and profound philosophy while perfecting your speed and accuracy.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/typing")}
              className="text-lg px-10 py-5 h-auto"
            >
              Start Typing Test
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/about")}
              className="text-lg px-10 py-5 h-auto"
            >
              Read the Full Story
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;