import { useState } from 'react';
import { Camera, MapPin, Maximize2, X, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  imageSrc: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'upper-lake',
    title: 'Bhopal Upper Lake (Bhojtal)',
    category: 'Ramsar Wetland',
    location: 'Bhopal West',
    imageSrc: '/images/hero/bhopal-upper-lake-hero.webp',
    description: 'Expansive 31 sq km potable reservoir designated as Ramsar Site #1206. Serves 40% of the city potable water.',
  },
  {
    id: 'lower-lake',
    title: 'Bhopal Lower Lake (Chhota Talab)',
    category: 'Heritage Waterbody',
    location: 'Old City Bhopal',
    imageSrc: '/images/hero/bhopal-lower-lake-hero.webp',
    description: 'Historic urban waterbody interconnected with Upper Lake via Pul Pukhta, housing Khatlapura & Malviya Kund immersion zones.',
  },
  {
    id: 'shahpura-lake',
    title: 'Shahpura Lake Waterfront',
    category: 'Urban Lake',
    location: 'Shahpura / Sector-A',
    imageSrc: '/images/hero/shahpura-lake-promenade.webp',
    description: 'Promenade lakefront hosting high-density immersion activities at Shahpura BKE Ghat with continuous aeration monitoring.',
  },
  {
    id: 'visarjan-ghat',
    title: 'Ceremonial Idol Immersion Ghat',
    category: 'Civic Immersion Site',
    location: 'Designated Ghat Network',
    imageSrc: '/images/ghats/ghat-steps-immersion.webp',
    description: 'Engineered stone ghat steps and designated immersion bays equipped with containment barriers during Ganesh and Durga Visarjan.',
  },
  {
    id: 'field-sampling',
    title: 'Water-Quality Field Sampling',
    category: 'Scientific Testing',
    location: 'Ghat Monitoring Stations',
    imageSrc: '/images/water-quality/water-sampling-field.webp',
    description: 'MPPCB environmental personnel collecting standardized Pre, During, and Post festival water quality samples for DO, BOD, and COD analysis.',
  },
  {
    id: 'lake-cleanup',
    title: 'Lake Cleanup & Debris Removal',
    category: 'Municipal Action',
    location: 'Littoral Recovery Zones',
    imageSrc: '/images/municipal-actions/lake-cleanup-boat.webp',
    description: 'Mechanized trash skimmers and municipal rapid-response squads removing submerged idol frames, floral waste, and non-biodegradable debris.',
  },
];

export function EnvironmentalGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section className="space-y-4" aria-label="Bhopal Environmental Photography Gallery">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0F766E]" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bhopal Environmental & Ghat Gallery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Documentary visual survey across Bhoj Wetland, urban lakes, immersion ghats, and municipal recovery sites.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
          6 Curated Locations
        </span>
      </div>

      {/* 6-Image Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Photographic Image with Hover Zoom */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
                  {item.category}
                </span>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-[#36CFC9] font-medium mb-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Description Card Footer */}
            <div className="p-3.5 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0F766E] group-hover:text-[#0B1220] transition-colors">
                <span>View Full Inspection View</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#0B1220] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 w-full overflow-hidden bg-black">
              <ImageWithFallback
                src={selectedItem.imageSrc}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F766E] text-white">
                  {selectedItem.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-[#36CFC9]" />
                  {selectedItem.location}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
