import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Keyboard } from 'lucide-react';
import kafkaPortrait from '../assets/kafka-portrait.png';
import dostoevskyPortrait from '../assets/dostoevsky-portrait.png';
import camusPortrait from '../assets/camus-portrait.png';
import gogolPortrait from '../assets/gogol-portrait.png';

const About = () => {
    const navigate = useNavigate();

    const authors = [
        {
            name: "Franz Kafka",
            role: "The Master of the Absurd",
            image: kafkaPortrait,
            bio: "Kafka's work explores themes of alienation, existential anxiety, and the absurdity of bureaucracy. Typing his intricate sentences helps you feel the labyrinthine nature of his thought process.",
            quote: "A book must be the axe for the frozen sea within us."
        },
        {
            name: "Fyodor Dostoevsky",
            role: "The Explorer of the Soul",
            image: dostoevskyPortrait,
            bio: "Dostoevsky delves into the deepest recesses of the human psyche, exploring faith, reason, and morality. His passionate, often feverish prose demands a rhythmic intensity.",
            quote: "To love someone means to see them as God intended them."
        },
        {
            name: "Albert Camus",
            role: "The Philosopher of Revolt",
            image: camusPortrait,
            bio: "Camus confronts the absurdity of existence with a call for rebellion and integrity. His clear, precise style offers a stark contrast to the chaos he describes.",
            quote: "In the midst of winter, I found there was, within me, an invincible summer."
        },
        {
            name: "Nikolai Gogol",
            role: "The Satirist of the Surreal",
            image: gogolPortrait,
            bio: "Gogol blends the realistic with the surreal, using humor to expose the grotesque and the tragic in everyday life. His colorful language is a joy to type.",
            quote: "The longer and more carefully we look at a funny story, the sadder it becomes."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Header />

            <main className="container mx-auto px-4 py-12 sm:py-20">
                <section className="max-w-4xl mx-auto text-center mb-20 sm:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6 sm:mb-8">
                            The Philosophy of <span className="text-primary">QuillKeys</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12">
                            QuillKeys isn't just a typing tutor. It's a <span className="text-foreground font-medium">literary immersion tool</span>.
                            By tracing the words of existential masters, you absorb their rhythm, their vocabulary, and their profound observations on the human condition.
                            We believe that the act of typing, physically reconstructing these masterpieces, allows for a deeper connection than reading alone.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/typing')}
                            className="text-lg px-8 py-6 h-auto gap-2"
                        >
                            <Keyboard className="w-5 h-5" />
                            Start Your Journey
                        </Button>
                    </motion.div>
                </section>

                <section className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-3xl sm:text-4xl font-serif text-center mb-12 sm:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        The Masters
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                        {authors.map((author, index) => (
                            <motion.div
                                key={author.name}
                                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 overflow-hidden hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/10 transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="shrink-0 mx-auto sm:mx-0">
                                        <img
                                            src={author.image}
                                            alt={author.name}
                                            className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-2xl font-serif font-bold mb-1">{author.name}</h3>
                                        <p className="text-primary font-medium mb-3">{author.role}</p>
                                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                                            {author.bio}
                                        </p>
                                        <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground text-sm">
                                            "{author.quote}"
                                        </blockquote>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="text-center mt-20 sm:mt-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => navigate('/')}
                            className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
