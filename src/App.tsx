
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Typing from './pages/Typing'
import { ThemeProvider } from './components/theme-provider'

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/typing" element={<Typing />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
