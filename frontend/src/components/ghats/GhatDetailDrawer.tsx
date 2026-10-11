import { useState } from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Droplets,
  Activity,
  FileText,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Compass,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { GhatRecord } from '../../types';

interface GhatDetailDrawerProps {
  ghat: GhatRecord | null;
  onClose: () => void;
  onViewOnMap?: (lat: number, lng: number) => void;
  language?: 'en' | 'hi';
}

export function GhatDetailDrawer({ ghat, onClose, onViewOnMap, language = 'en' }: GhatDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'evidence' | 'trends'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!ghat) return null;

  const displayName = language === 'hi' ? ghat.name_hi : ghat.name_en;
  const secondaryName = language === 'hi' ? ghat.name_en : ghat.name_hi;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(
      `${displayName} - ${ghat.locality}, Bhopal (${ghat.latitude}, ${ghat.longitude})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = 'Date,Festival,Year,Phase,DO_mg_L,BOD_mg_L,pH\n';
    const rows = ghat.historical_trends
      .map(
        (t) =>
          `"${t.date}","${t.festival}",${t.year},"${t.phase}",${t.do ?? 'NA'},${t.bod ?? 'NA'},${t.ph ?? 'NA'}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ghat.slug}_water_quality_trends.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tierStyles = {
    high: 'bg-[#EF4444] text-white',
    medium: 'bg-[#F59E0B] text-white',
    low: 'bg-[#10B981] text-white',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-mono font-bold text-xs text-[#38BDF8]">
                #{ghat.rank}
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 id="drawer-title" className="text-base font-bold text-white leading-tight">
                    {displayName}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">({secondaryName})</span>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  {ghat.water_body} · Bhopal Municipal Corporation
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close detail drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-[#E2E8F0] bg-slate-50 px-6 text-xs font-semibold text-[#64748B] shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Location & Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quality')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'quality'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Water Quality Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'trends'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Temporal Trends
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evidence')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'evidence'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Official Evidence
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Photo Gallery Viewer */}
                <div className="space-y-2">
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-[#E2E8F0]">
                    <img
                      src={ghat.galleryImages[activeImageIndex] || ghat.imageUrl}
                      alt={ghat.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${tierStyles[ghat.risk_tier]}`}>
                        {ghat.risk_tier.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-white text-xs bg-black/60 backdrop-blur-xs p-2 rounded-lg">
                      <span className="font-semibold block truncate">Photo Source: {ghat.imageSource}</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {ghat.galleryImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {ghat.galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                            activeImageIndex === idx ? 'border-[#059669]' : 'border-slate-200'
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Metadata Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location & Waterbody</span>
                    <span className="font-bold text-[#0F172A] text-sm block mt-0.5">{ghat.water_body}</span>
                    <span className="text-[#64748B] text-[11px]">{ghat.locality}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Risk Classification</span>
                    <span className="font-bold text-[#0F172A] text-sm block mt-0.5 font-mono">
                      Score: {ghat.score.toFixed(1)} / 100
                    </span>
                    <span className="text-[#64748B] text-[11px] capitalize">Confidence: {ghat.confidence}</span>
                  </div>
                </div>

                {/* Nearest Landmark & GPS Coordinates */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                      <Compass className="w-4 h-4 text-[#059669]" />
                      <span>GPS Coordinates</span>
                    </div>
                    <span className="font-mono text-slate-600 font-bold">
                      {ghat.latitude.toFixed(4)}°N, {ghat.longitude.toFixed(4)}°E
                    </span>
                  </div>
                  <p className="text-[#64748B] text-[11px]">
                    Landmark: <span className="text-[#0F172A] font-medium">{ghat.nearest_landmark}</span>
                  </p>
                </div>

                {/* Key Observed Concern Box */}
                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-800">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    <span>Key Observed Water Quality Concern</span>
                  </div>
                  <p className="text-red-950 leading-relaxed">
                    {ghat.key_concern}
                  </p>
                </div>

                {/* Suggested Municipal Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Recommended Municipal Field Interventions
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {ghat.suggested_actions.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        <span className="font-bold text-[#059669] mt-0.5">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: WATER QUALITY DATA */}
            {activeTab === 'quality' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* 4 Essential Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                      <Droplets className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Lowest Dissolved Oxygen</span>
                    </div>
                    <span className="text-2xl font-black font-mono text-[#0F172A] block mt-1">
                      {ghat.lowest_do.toFixed(1)} mg/L
                    </span>
                    <span className="text-[11px] text-[#64748B]">CPCB Class B Standard: ≥ 5.0 mg/L</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                      <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Peak BOD Departure</span>
                    </div>
                    <span className="text-2xl font-black font-mono text-[#0F172A] block mt-1">
                      {ghat.peak_bod.toFixed(1)} mg/L
                    </span>
                    <span className="text-[11px] text-[#64748B]">CPCB Class B Standard: ≤ 3.0 mg/L</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Average pH</span>
                    <span className="text-xl font-bold font-mono text-[#0F172A] block mt-1">
                      {ghat.avg_ph.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-[#64748B]">Standard Range: 6.5 – 8.5</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Turbidity / Clarity</span>
                    <span className="text-xl font-bold font-mono text-[#0F172A] block mt-1">
                      {ghat.turbidity_ntu.toFixed(1)} NTU
                    </span>
                    <span className="text-[11px] text-[#64748B]">Documented post-visarjan impact</span>
                  </div>
                </div>

                {/* Sampling Audit Info */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <h4 className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#059669]" />
                    <span>Sampling Protocol & Audit Fidelity</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Total Observations:</span>
                      <span className="font-bold text-slate-800">{ghat.sample_count} samples</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Monitoring Coverage:</span>
                      <span className="font-bold text-slate-800">{ghat.monitoring_coverage}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Latest Sampling Cycle:</span>
                      <span className="font-bold text-slate-800">{ghat.latest_sample_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Testing Agency:</span>
                      <span className="font-bold text-slate-800">MPPCB Regional Laboratory</span>
                    </div>
                  </div>
                </div>

                {/* Deterministic Evaluation Reasons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    MPPCB Deterministic Violation Reasons
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {ghat.reasons.map((r, idx) => (
                      <li key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                        <span className="font-semibold block">{r.text}</span>
                        {r.reading_id && (
                          <span className="text-[10px] font-mono text-[#059669] mt-1 block">
                            Audit Reference ID: #{r.reading_id}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: TEMPORAL TRENDS (RECHARTS) */}
            {activeTab === 'trends' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      Dissolved Oxygen & BOD Timeline (2023–2025)
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Measured across Pre, During, and Post festival immersion intervals.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="h-64 w-full bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ghat.historical_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <ReferenceLine y={5.0} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'DO Standard (≥ 5.0)', fill: '#10B981', fontSize: 10 }} />
                      <ReferenceLine y={3.0} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'BOD Limit (≤ 3.0)', fill: '#EF4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="do" name="DO (mg/L)" stroke="#059669" strokeWidth={2.5} connectNulls={false} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="bod" name="BOD (mg/L)" stroke="#F59E0B" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Note: Disconnected points indicate missing observations during specific festival intervals where samples were not retrieved. Missing data is never treated as zero.
                </p>
              </div>
            )}

            {/* TAB 4: OFFICIAL EVIDENCE & PROVENANCE */}
            {activeTab === 'evidence' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Certificate Status Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#059669]" />
                      <span>Official Test Certificate Status</span>
                    </span>
                    {ghat.data_provenance.certificate_available ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        VERIFIED: {ghat.data_provenance.certificate_id}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                        Source document unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-[#64748B] text-[11px] leading-relaxed">
                    {ghat.data_provenance.notes}
                  </p>
                </div>

                {/* Published MPPCB Reports Cited */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Published Annual Reports Cited
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {ghat.data_provenance.reports.map((rep, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#059669] shrink-0" />
                          <span className="font-semibold text-slate-800">{rep}</span>
                        </div>
                        <a
                          href="https://www.mppcb.mp.gov.in"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#059669] hover:underline font-semibold text-[11px]"
                        >
                          <span>MPPCB Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {onViewOnMap && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewOnMap(ghat.latitude, ghat.longitude);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#059669]/90 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyLocation}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Location'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
