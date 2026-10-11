import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Waves, Menu, X, BarChart2, ShieldCheck, Droplets, Sparkles, Clock, MapPin } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { EnvironmentalAssistant } from './assistant/EnvironmentalAssistant';

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isRanking = location.pathname === '/ranking';
  const isWaterQuality = location.pathname === '/water-quality';
  const isAbout = location.pathname === '/about-data' || location.pathname === '/about';

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 no-print transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left section: Emblem, Brand, Org */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMobile}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E40AF] to-[#172554] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1E40AF] transition-all">
              <Waves className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#172554] text-base tracking-tight block leading-tight">
                  {t('nav.title')}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-blue-50 text-[#1E40AF] text-[10px] font-bold rounded border border-blue-200 uppercase tracking-wider">
                  2023–2025
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                {t('nav.subtitle')}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isHome
                  ? 'text-[#1E40AF] bg-blue-50 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('nav.overview')}</span>
            </Link>

            <Link
              to="/ranking"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isRanking
                  ? 'text-[#1E40AF] bg-blue-50 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{t('nav.ghat_analysis')}</span>
            </Link>

            <Link
              to="/water-quality"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isWaterQuality
                  ? 'text-[#1E40AF] bg-blue-50 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{t('nav.water_quality')}</span>
            </Link>

            <Link
              to="/about-data"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isAbout
                  ? 'text-[#1E40AF] bg-blue-50 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('nav.sources')}</span>
            </Link>
          </nav>

          {/* Right Section: Last updated, Language toggle, Ask Gemini AI */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Last updated indicator */}
            <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Oct 2026</span>
            </div>

            {/* Language toggle */}
            <div className="hidden sm:block">
              <LanguageToggle variant="light" />
            </div>

            {/* Ask AI Button */}
            <button
              type="button"
              onClick={() => setAiAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1E40AF] to-[#059669] hover:from-[#172554] hover:to-[#059669] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
              aria-label="Open Ask AI environmental assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>Ask AI</span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <Link
              to="/"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                isHome ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{t('nav.overview')}</span>
            </Link>

            <Link
              to="/ranking"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                isRanking ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>{t('nav.ghat_analysis')}</span>
            </Link>

            <Link
              to="/water-quality"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                isWaterQuality ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>{t('nav.water_quality')}</span>
            </Link>

            <Link
              to="/about-data"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                isAbout ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{t('nav.sources')}</span>
            </Link>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">{t('nav.language')}:</span>
              <LanguageToggle variant="light" />
            </div>
          </div>
        )}
      </header>

      {/* Ask AI Slide-over Drawer */}
      <EnvironmentalAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onSelectGhatSlug={(slug) => {
          setAiAssistantOpen(false);
          navigate(`/ghat/${slug}`);
        }}
      />
    </>
  );
}

// Reusable export alias
export const AppNavbar = Navbar;
