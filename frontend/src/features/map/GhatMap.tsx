import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Table as TableIcon, Layers } from 'lucide-react';
import { TierBadge } from '../../components/TierBadge';
import type { components } from '../../api/schema';
import type { GhatRecord } from '../../types';

type RankedGhat = components['schemas']['RankedGhat'];
type AnyGhat = RankedGhat | GhatRecord;

type Props = {
  ghats: AnyGhat[];
  className?: string;
  focusedCoords?: [number, number] | null;
  onSelectGhatSlug?: (slug: string) => void;
};

// Helper component to smoothly pan map when focusedCoords changes
function MapPanHandler({ focusedCoords }: { focusedCoords?: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (focusedCoords && focusedCoords[0] && focusedCoords[1]) {
      map.flyTo(focusedCoords, 14, { duration: 1.2 });
    }
  }, [focusedCoords, map]);
  return null;
}

// Create SVG pin icon based on tier
function createTierIcon(tier: 'high' | 'medium' | 'low') {
  const color = tier === 'high' ? '#dc2626' : tier === 'medium' ? '#d97706' : '#059669';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -36],
  });
}

function getCoords(ghat: AnyGhat): { lat: number; lng: number } | null {
  if ('latitude' in ghat && 'longitude' in ghat && ghat.latitude != null && ghat.longitude != null) {
    return { lat: ghat.latitude, lng: ghat.longitude };
  }
  if ('lat' in ghat && 'lng' in ghat && ghat.lat != null && ghat.lng != null) {
    return { lat: ghat.lat, lng: ghat.lng };
  }
  return null;
}

function getTier(ghat: AnyGhat): 'high' | 'medium' | 'low' {
  if ('risk_tier' in ghat) return ghat.risk_tier;
  if ('tier' in ghat) return ghat.tier;
  return 'medium';
}

export function GhatMap({ ghats, className = '', focusedCoords, onSelectGhatSlug }: Props) {
  const { t, i18n } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Verified Bhopal center coordinates
  const bhopalCenter: [number, number] = [23.2599, 77.4126];

  const ghatsWithCoords = ghats
    .map((g) => ({ ghat: g, coords: getCoords(g), tier: getTier(g) }))
    .filter((item): item is { ghat: AnyGhat; coords: { lat: number; lng: number }; tier: 'high' | 'medium' | 'low' } => item.coords !== null);

  return (
    <div className={`space-y-4 ${className}`} data-testid="ghat-map">
      {/* Map Header / Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-600" />
          <h3 className="font-semibold text-slate-900 text-sm">{t('map.title')}</h3>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
        >
          {showTable ? (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Show Map</span>
            </>
          ) : (
            <>
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t('map.offline_fallback_title')}</span>
            </>
          )}
        </button>
      </div>

      {/* Map View or Offline Table */}
      {!showTable && !mapError ? (
        <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
          <MapContainer
            center={bhopalCenter}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              eventHandlers={{
                tileerror: () => {
                  // Fall back if offline or tiles unavailable
                  console.warn('Map tiles failed to load, offline fallback available');
                  setMapError(true);
                },
              }}
            />

            <MapPanHandler focusedCoords={focusedCoords} />

            {ghatsWithCoords.map(({ ghat, coords, tier }) => {
              const photoUrl = 'imageUrl' in ghat ? (ghat as GhatRecord).imageUrl : undefined;
              return (
                <Marker
                  key={ghat.slug}
                  position={[coords.lat, coords.lng]}
                  icon={createTierIcon(tier)}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs min-w-[190px] max-w-[220px]">
                      {photoUrl && (
                        <div className="h-24 w-full rounded-md overflow-hidden bg-slate-900 mb-1">
                          <img
                            src={photoUrl}
                            alt={ghat.name_en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 line-clamp-1">
                          {i18n.language === 'hi' ? ghat.name_hi : ghat.name_en}
                        </span>
                        <TierBadge tier={tier} />
                      </div>
                      <p className="text-slate-500 text-[11px]">{ghat.water_body}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="font-mono text-slate-700 text-[11px]">
                          Score: {ghat.score.toFixed(1)}
                        </span>
                        {onSelectGhatSlug ? (
                          <button
                            type="button"
                            onClick={() => onSelectGhatSlug(ghat.slug)}
                            className="text-[#059669] font-bold hover:underline cursor-pointer"
                          >
                            {t('map.view_details')} →
                          </button>
                        ) : (
                          <Link
                            to={`/ghat/${ghat.slug}`}
                            className="text-[#059669] font-bold hover:underline"
                          >
                            {t('map.view_details')} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-md z-[1000] text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600" />
              <span>{t('map.legend_high')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{t('map.legend_medium')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>{t('map.legend_low')}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Offline Coordinates Table Fallback */
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            {t('map.offline_fallback_text')}
          </div>
          <table className="w-full text-xs text-left divide-y divide-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold">{t('map.table_ghat')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('ranking.table_water_body')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('map.table_tier')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('map.table_coords')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('ranking.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {ghats.map((ghat) => {
                const coords = getCoords(ghat);
                const tier = getTier(ghat);
                return (
                  <tr key={ghat.slug} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {i18n.language === 'hi' ? ghat.name_hi : ghat.name_en}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{ghat.water_body}</td>
                    <td className="py-2 px-3">
                      <TierBadge tier={tier} />
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500">
                      {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {onSelectGhatSlug ? (
                        <button
                          type="button"
                          onClick={() => onSelectGhatSlug(ghat.slug)}
                          className="text-[#059669] font-bold hover:underline cursor-pointer"
                        >
                          {t('map.view_details')}
                        </button>
                      ) : (
                        <Link
                          to={`/ghat/${ghat.slug}`}
                          className="text-[#059669] font-bold hover:underline"
                        >
                          {t('map.view_details')}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export const BhopalMap = GhatMap;
