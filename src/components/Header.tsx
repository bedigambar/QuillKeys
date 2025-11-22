import { KeyboardIcon, Home, History } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useTypingStore } from '@/store/typing-store'

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isHistoryPage = location.pathname === '/history'
    const { zenMode } = useTypingStore()

    if (zenMode) return null;

    return (
        <div className={`container mx-auto px-4 flex items-center justify-between ${isHomePage ? 'py-6 pt-8' : 'py-4'}`}>

            <div className='flex items-center gap-2 sm:gap-3 cursor-pointer' onClick={() => navigate('/')}>
                <KeyboardIcon className='h-8 w-8 sm:h-10 sm:w-10' />
                <h1 className='text-2xl sm:text-3xl font-poppins font-bold '>
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
    )
}

export default Header