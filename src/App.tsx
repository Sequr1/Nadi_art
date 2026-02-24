console.log("THIS IS NEW BUILD 123")

import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import StatePage from './pages/StatePage';
import MainPage from './pages/MainPage';
import WorkshopPage from './pages/WorkshopPage';
import InstallationPage from './pages/InstallationPage';
import ProjectPage from './pages/ProjectPage';
import PaintingPage from './pages/PaintingPage';
import ThoughtsPage from './pages/ThoughtsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/enter" element={<Landing />} />
        <Route path="/state/:slug" element={<StatePage />} />
        <Route path="/workshop/:slug" element={<WorkshopPage />} />
        <Route path="/installation/:slug" element={<InstallationPage />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/painting/:slug" element={<PaintingPage />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
