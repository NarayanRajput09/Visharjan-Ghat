import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/layout/Footer';
import { OverviewDashboardPage } from './features/overview/OverviewDashboardPage';
import { RankingPage } from './features/ranking/RankingPage';
import { GhatDetailPage } from './features/ghat-detail/GhatDetailPage';
import { BriefPage } from './features/brief/BriefPage';
import { AboutDataPage } from './features/about/AboutDataPage';
import { WaterQualityPage } from './features/water-quality/WaterQualityPage';
import { SourceProvider } from './features/ghat-detail/SourceContext';
import { SourcePanel } from './features/ghat-detail/SourcePanel';
import { initGlobalCardGlow } from './utils/animations';

export function App() {
  useEffect(() => {
    return initGlobalCardGlow();
  }, []);
  return (
    <SourceProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col font-sans selection:bg-blue-100 selection:text-[#1E40AF]">
        <Navbar />
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<OverviewDashboardPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/ghat/:slug" element={<GhatDetailPage />} />
            <Route path="/ghat/:id" element={<GhatDetailPage />} />
            <Route path="/about-data" element={<AboutDataPage />} />
            <Route path="/about" element={<AboutDataPage />} />
            <Route path="/water-quality" element={<WaterQualityPage />} />
            <Route path="/brief/:id" element={<BriefPage />} />
          </Routes>
        </main>
        {/* Global Report Evidence & Traceability Drawer */}
        <SourcePanel />
        {/* Global Civic-Tech Footer */}
        <Footer />
      </div>
    </SourceProvider>
  );
}

export default App;
