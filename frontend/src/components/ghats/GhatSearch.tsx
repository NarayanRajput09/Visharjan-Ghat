import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, ChevronRight, ShieldAlert } from 'lucide-react';
import { GHATS_DATA } from '../../data/ghats';
import type { GhatRecord } from '../../types';

interface GhatSearchProps {
  onSelectGhat: (ghat: GhatRecord) => void;
  onViewOnMap?: (lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

export function GhatSearch({
  onSelectGhat,
  onViewOnMap,
  placeholder = 'Search by ghat name, Hindi, lake, locality, or landmark...',
  className = '',
}: GhatSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredGhats = query.trim()
    ? GHATS_DATA.filter((g) => {
        const q = query.toLowerCase();
        return (
          g.name_en.toLowerCase().includes(q) ||
          g.name_hi.toLowerCase().includes(q) ||
          g.water_body.toLowerCase().includes(q) ||
          g.locality.toLowerCase().includes(q) ||
          g.nearest_landmark.toLowerCase().includes(q)
        );
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredGhats.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredGhats.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredGhats.length) % filteredGhats.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredGhats[highlightedIndex];
      if (selected) {
        onSelectGhat(selected);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (ghat: GhatRecord) => {
    onSelectGhat(ghat);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#059669] focus:border-[#059669] shadow-2xs transition-all"
          aria-label="Search ghats across Bhopal"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-40 max-h-80 overflow-y-auto animate-in fade-in duration-150">
          {filteredGhats.length > 0 ? (
            <ul className="divide-y divide-slate-100" role="listbox">
              {filteredGhats.map((ghat, idx) => (
                <li
                  key={ghat.id}
                  role="option"
                  aria-selected={highlightedIndex === idx}
                  onClick={() => handleSelect(ghat)}
                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    highlightedIndex === idx ? 'bg-emerald-50/80 text-emerald-950' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Location Thumbnail */}
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img
                        src={ghat.imageUrl}
                        alt={ghat.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0F172A] truncate">
                          {ghat.name_en}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline truncate">
                          ({ghat.name_hi})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-[#059669] font-medium">
                          <MapPin className="w-3 h-3" />
                          {ghat.water_body}
                        </span>
                        <span>·</span>
                        <span className="truncate">{ghat.locality}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onViewOnMap && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOnMap(ghat.latitude, ghat.longitude);
                          setIsOpen(false);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-[#059669] hover:bg-slate-100 cursor-pointer"
                        title="View on Map"
                        aria-label="View on map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ghat.risk_tier === 'high'
                          ? 'bg-red-100 text-red-800'
                          : ghat.risk_tier === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ghat.risk_tier}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 space-y-1">
              <ShieldAlert className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No matching immersion ghats found</p>
              <p className="text-[11px] text-slate-400">
                Try searching for Bairagarh, Khatlapura, Prempura, Kamla Park, or Shahpura.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
