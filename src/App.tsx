import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import StatePage from './pages/StatePage';
import MainPage from './pages/MainPage';
import WorkshopPage from './pages/WorkshopPage';
import InstallationPage from './pages/InstallationPage';
import ProjectPage from './pages/ProjectPage';
import PaintingPage from './pages/PaintingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/enter" element={<Landing />} />
        <Route path="/state/:slug" element={<StatePage />} />
        <Route path="/workshop/:slug" element={<WorkshopPage />} />
        <Route path="/installation/:slug" element={<InstallationPage />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/painting/:slug" element={<PaintingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
