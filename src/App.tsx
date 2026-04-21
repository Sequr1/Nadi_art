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
import GalleryPage from './pages/GalleryPage';
import WorkshopsPage from './pages/WorkshopsPage';
import InstallationsPage from './pages/InstallationsPage';
import ProjectsPage from './pages/ProjectsPage';

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/enter" element={<Landing />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/installations" element={<InstallationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
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
