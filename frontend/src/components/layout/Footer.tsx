import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Waves, ExternalLink, ShieldCheck, Database, HeartHandshake } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0B1220] border-t border-slate-800 text-slate-400 text-xs no-print mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] border border-[#36CFC9]/40 flex items-center justify-center text-[#36CFC9]">
                <Waves className="w-4 h-4 text-[#36CFC9]" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block leading-tight">
                  {t('footer.brand_name')}
                </span>
                <span className="text-[10px] text-[#36CFC9] font-medium block leading-tight">
                  {t('footer.tagline')}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t('footer.description')}
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-mono">
              <Database className="w-3 h-3 text-[#36CFC9]" />
              <span>Dataset: MPPCB 2023–2025</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/" className="hover:text-[#36CFC9] transition-colors">
                  {t('nav.overview')}
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="hover:text-[#36CFC9] transition-colors">
                  {t('nav.ghat_analysis')}
                </Link>
              </li>
              <li>
                <Link to="/water-quality" className="hover:text-[#36CFC9] transition-colors">
                  {t('nav.water_quality')}
                </Link>
              </li>
              <li>
                <Link to="/brief/bmc-durga-2026" className="hover:text-[#36CFC9] transition-colors">
                  {t('nav.action_briefs')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#36CFC9] transition-colors">
                  {t('nav.sources')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Resources & Portals */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="https://www.mppcb.mp.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#36CFC9] transition-colors"
                >
                  <span>{t('footer.mppcb')}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://cpcb.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#36CFC9] transition-colors"
                >
                  <span>{t('footer.cpcb')}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bmconline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#36CFC9] transition-colors"
                >
                  <span>{t('footer.bmc')}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/about" className="inline-flex items-center gap-1 hover:text-[#36CFC9] transition-colors">
                  <ShieldCheck className="w-3 h-3 text-[#36CFC9]" />
                  <span>CPCB Class B Standard Criteria</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div className="space-y-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-slate-200 text-xs">
              {t('footer.disclaimer_title')}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('footer.disclaimer_body')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>{t('footer.copyright')}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <HeartHandshake className="w-3.5 h-3.5 text-[#36CFC9]" />
            <span>Dedicated to the conservation of Bhoj Wetland & Bhopal Lakes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
