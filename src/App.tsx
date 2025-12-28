import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Typing from './pages/Typing'
import Results from './pages/Results'
import History from './pages/History'
import About from './pages/About'
import ScrollToTop from './components/ScrollToTop'
import { ThemeProvider } from './components/theme-provider'
import NotFound from './pages/NotFound'

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/typing" element={<Typing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
