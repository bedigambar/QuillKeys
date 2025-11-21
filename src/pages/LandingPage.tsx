
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import kafkaPortrait from '../assets/kafka-portrait.png';
import dostoevskyPortrait from '../assets/dostoevsky-portrait.png';
import camusPortrait from '../assets/camus-portrait.png';
import gogolPortrait from '../assets/gogol-portrait.png';



const LandingPage = () => {
  const navigate = useNavigate();

  const quotes = [
    {
      text: "You do not need to leave your room. Remain sitting at your table and listen. The world will freely offer itself to you to be unmasked.",
      author: "Franz Kafka",
      image: kafkaPortrait
    },
    {
      text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
      author: "Fyodor Dostoevsky",
      image: dostoevskyPortrait
    },
    {
      text: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
      author: "Albert Camus",
      image: camusPortrait
    },
    {
      text: "The longer and more carefully we look at a funny story, the sadder it becomes.",
      author: "Nikolai Gogol",
      image: gogolPortrait
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto -mt-32 sm:mt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-mono font-bold mb-6 sm:mb-8 leading-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Type Through the Minds of
            <motion.span
              className="block mt-2 sm:mt-4 font-edu font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Those Who Shaped Literature
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Type through authentic passages from Kafka, Dostoevsky, Camus, and Gogol—where every word carries philosophical weight.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/typing")}
              className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-auto"
            >
              Start Typing Through History
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-2 sm:left-4 md:left-8 top-1/4 opacity-20"
          initial={{ opacity: 0, x: -50, rotate: -12 }}
          animate={{ opacity: 0.2, x: 0, rotate: -12 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <img
            src={kafkaPortrait}
            alt="Franz Kafka"
            className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 object-cover rounded-lg shadow-deep transform -rotate-12"
          />
        </motion.div>

        <motion.div
          className="absolute left-2 sm:left-4 md:left-8 bottom-1/4 opacity-20"
          initial={{ opacity: 0, x: -50, rotate: -6 }}
          animate={{ opacity: 0.2, x: 0, rotate: -6 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <img
            src={camusPortrait}
            alt="Albert Camus"
            className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 object-cover rounded-lg shadow-deep transform -rotate-6"
          />
        </motion.div>

        <motion.div
          className="absolute right-2 sm:right-4 md:right-8 top-1/4 opacity-20"
          initial={{ opacity: 0, x: 50, rotate: 12 }}
          animate={{ opacity: 0.2, x: 0, rotate: 12 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <img
            src={dostoevskyPortrait}
            alt="Fyodor Dostoevsky"
            className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 object-cover rounded-lg shadow-deep transform rotate-12"
          />
        </motion.div>

        <motion.div
          className="absolute right-2 sm:right-4 md:right-8 bottom-1/4 opacity-20"
          initial={{ opacity: 0, x: 50, rotate: 6 }}
          animate={{ opacity: 0.2, x: 0, rotate: 6 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <img
            src={gogolPortrait}
            alt="Nikolai Gogol"
            className="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 object-cover rounded-lg shadow-deep transform rotate-6"
          />
        </motion.div>
      </section>

      <section className="-mt-20 sm:mt-0 sm:py-8 md:py-12 lg:py-16 xl:py-24 px-4 sm:px-6 pb-4">
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
              className="text-lg px-10 py-5 h-auto"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Quote Section */}
            <div className="text-center md:text-left flex-1">
              <p className="text-muted-foreground">
                "There is no greater agony than bearing an untold story inside you."
              </p>
              <cite className="text-sm mt-2 block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 drop-shadow-md">
                — Maya Angelou
              </cite>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/bedigambar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-border/50 rounded-[14px] transition-all duration-300 hover:border-amber-400 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-400/20"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/digambar-behera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-border/50 rounded-[14px] transition-all duration-300 hover:border-amber-400 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-400/20"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://x.com/digambarcodes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-border/50 rounded-[14px] transition-all duration-300 hover:border-amber-400 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-400/20"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;