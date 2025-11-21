import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Typing from './pages/Typing'
import History from './pages/History'
import { ThemeProvider } from './components/theme-provider'

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/typing" element={<Typing />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
