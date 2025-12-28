import { KeyboardIcon, Home, History } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModeToggle } from './mode-toggle'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useTypingStore } from '@/store/typing-store'

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isHistoryPage = location.pathname === '/history'
    const isResultsPage = location.pathname === '/results'
    const { zenMode } = useTypingStore()

    if (zenMode && !isResultsPage) return null;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        >
            <div className={`container mx-auto px-4 flex items-center justify-between py-3`}>

                <div className='flex items-center gap-2 sm:gap-3 cursor-pointer group' onClick={() => navigate('/')}>
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <KeyboardIcon className='h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-300 group-hover:text-amber-400' />
                    </motion.div>
                    <h1 className='text-2xl sm:text-3xl font-poppins font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:via-amber-200 group-hover:to-amber-400 group-hover:bg-clip-text group-hover:text-transparent'>
                        QuillKeys
                    </h1>
                </div>

                <div className='flex items-center gap-1 sm:gap-4'>


                    {!isHomePage && (
                        <>
                            {!isHistoryPage && location.pathname !== '/about' && (
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => navigate('/history')}
                                    className='flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4 h-9 sm:h-10'
                                >
                                    <History className='h-4 w-4 sm:h-5 sm:w-5' />
                                    <span className='hidden sm:inline'>History</span>
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="default"
                                onClick={() => navigate('/')}
                                className='flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4 h-9 sm:h-10'
                            >
                                <Home className='h-4 w-4 sm:h-5 sm:w-5' />
                                <span className='hidden sm:inline'>Home</span>
                            </Button>
                        </>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </motion.header>
    )
}

export default Header