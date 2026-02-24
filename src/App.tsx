import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainPage from './pages/MainPage';
import PaintingPage from './pages/PaintingPage';
import Landing from './pages/Landing';
import StatePage from './pages/StatePage';
import WorkshopPage from './pages/WorkshopPage';
import InstallationPage from './pages/InstallationPage';
import ProjectPage from './pages/ProjectPage';
import ThoughtsPage from './pages/ThoughtsPage';

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/enter" element={<Landing />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/state/:slug" element={<StatePage />} />
        <Route path="/workshop/:slug" element={<WorkshopPage />} />
        <Route path="/installation/:slug" element={<InstallationPage />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/painting/:slug" element={<PaintingPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </HashRouter>
  );
}
