'use client'

/* -------------------------------------------------------------------------- */
/* SECTION 1: IMPORTS & DEPENDENCIES                                          */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect } from 'react'
import { X, Check, RotateCcw } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/* SECTION 2: CONSTANTS & CONFIGURATION                                       */
/* -------------------------------------------------------------------------- */
const ADVENTURE_OPTIONS = ['Hiking', 'Rock-Climbing', 'Kayaking', 'Skiing', 'Snowmobiling', 'Backpacking', 'Camping', 'Boating', 'Wildlife-Photography'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const STATE_OPTIONS = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const SKILL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function DashboardFilters({ isOpen, onClose, filters, setFilters, onApply }: any) {

  /* -------------------------------------------------------------------------- */
  /* SECTION 3: STATE MANAGEMENT (BACKEND LOGIC)                                */
  /* -------------------------------------------------------------------------- */
  const [draft, setDraft] = useState(filters);
  const [isLocating, setIsLocating] = useState(false);

  // Sync draft with parent when sidebar opens
  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  /* -------------------------------------------------------------------------- */
  /* SECTION 4: FILTER LOGIC HANDLERS (BACKEND LOGIC)                          */
  /* -------------------------------------------------------------------------- */
  const handleReset = () => {
    setDraft({
      adventureType: [],
      skillLevel: [],
      states: [],
      gender: [],
      city: '',
      zipCode: '',
      radius: '50',
      minAge: '18',
      maxAge: '',
      customCoords: null
    });
  };

  const toggleFilter = (key: string, value: string) => {
    const currentValues = draft[key] || [];
    const isSelecting = !currentValues.includes(value);

    const newValues = isSelecting
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);

    if (key === 'states' && isSelecting) {
      setDraft({ ...draft, [key]: newValues, radius: '5000' });
    } else {
      setDraft({ ...draft, [key]: newValues });
    }
  };

  const handleAgeChange = (key: 'minAge' | 'maxAge', value: string) => {
    if (value !== '' && parseInt(value) < 0) return;
    setDraft({ ...draft, [key]: value });
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 5: EXTERNAL SERVICES (GPS & API)                                   */
  /* -------------------------------------------------------------------------- */
  const handleUseGPS = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          const data = await response.json();
          setDraft({
            ...draft,
            zipCode: data.postcode || '',
            customCoords: { lat, lng }
          });
        } catch (error) {
          setDraft({ ...draft, customCoords: { lat, lng } });
        } finally {
          setIsLocating(false);
        }
      }, (error) => {
        setIsLocating(false);
        alert("Location access denied.");
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SECTION 6: FORM SUBMISSION                                                 */
  /* -------------------------------------------------------------------------- */
  const handleApplyFilters = () => {
    setFilters(draft);
    onApply();
    onClose();
  };

  const isAgeInvalid = draft.minAge !== '' && parseInt(draft.minAge) < 18;

  /* -------------------------------------------------------------------------- */
  /* SECTION 7: STYLES (FRONTEND)                                               */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }

        .nationwide-glow {
          color: #ffffff;
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.4);
          animation: pulseGlow 2s infinite alternate;
        }

        @keyframes pulseGlow {
          from { opacity: 0.8; transform: scale(1); }
          to { opacity: 1; transform: scale(1.02); }
        }

        /* -------------------------------------------------------------------------- */
        /* SECTION: MOBILE RESPONSIVENESS OVERRIDES                                   */
        /* -------------------------------------------------------------------------- */

        @media (max-width: 768px) {
          /* 1. Sidebar & Header Layout */
          .fixed.h-full {
            width: 100% !important;
            padding: 1.5rem !important;
          }

          h2.text-2xl {
            font-size: 1.5rem;
          }

          /* 2. Interactive Element Scaling (Buttons & Inputs) */
          .flex.flex-wrap.gap-1.5 button,
          .grid.grid-cols-2 button {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            font-size: 10px;
          }

          input[type="text"],
          input[type="number"] {
            font-size: 16px !important;
          }

          /* 3. Radius & Distance Typography */
          .relative.flex.items-center span {
            font-size: 12px !important;
            color: rgba(255, 255, 255, 0.6) !important;
            margin-left: 0.5rem;
            letter-spacing: 0.05em;
          }

          /* 4. The "Surgical Alignment" for the Slider Labels */
            .flex.justify-between.mt-2.px-1 {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important; /* Creates two equal halves */
              width: 100% !important;
              padding: 0 4px !important; /* Matches the slight inset of the slider track */
              margin-top: 0.8rem !important;
            }

            /* 10MI Alignment */
            .flex.justify-between.mt-2.px-1 span:first-child {
              text-align: left !important;
              font-size: 11px !important;
              color: rgba(255, 255, 255, 0.7) !important;
              font-weight: 900 !important;
            }

            /* 5000MI Alignment */
            .flex.justify-between.mt-2.px-1 span:last-child {
              text-align: right !important; /* Forces it to the absolute right edge */
              font-size: 11px !important;
              color: rgba(255, 255, 255, 0.7) !important;
              font-weight: 900 !important;
            }

          /* 5. Slider Hardware Optimization */
          input[type="range"] {
            width: 100% !important;
            margin: 0 !important;
            -webkit-appearance: none; /* Helps with custom styling consistency */
          }

          input[type="range"]::-webkit-slider-thumb {
            width: 22px !important; /* Slightly larger for easier thumb-grabbing */
            height: 22px !important;
          }
        }
      `}</style>

      {/* 7.1: OVERLAY SCENE */}
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]" onClick={onClose} />}

      {/* 7.2: SIDEBAR CONTAINER */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[#011a14] border-l border-white/10 z-[120] p-8 shadow-2xl transition-transform duration-500 ease-in-out overflow-y-auto custom-scrollbar ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* 7.3: SIDEBAR HEADER (Controls & Reset) */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Refine Search</h2>
            <button onClick={handleReset} className="flex items-center gap-1 text-[10px] font-black text-emerald-400/50 hover:text-emerald-400 transition-colors uppercase tracking-widest">
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        {/* -------------------------------------------------------------------------- */
        /* SECTION 8: FILTER INPUT GROUPS (FRONTEND)                                  */
        /* -------------------------------------------------------------------------- */}
        <div className="space-y-8 pb-10">

          {/* 8.1: RADIUS & ZIP CODE INPUTS */}
          <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] block transition-all duration-300 ${parseInt(draft.radius) >= 5000 ? 'nationwide-glow' : 'text-emerald-400'}`}>
                  Radius {parseInt(draft.radius) >= 5000 && '- Nationwide'}
                </label>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={draft.radius}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setDraft({...draft, radius: ''});
                      } else if (parseInt(val) > 5000) {
                        setDraft({...draft, radius: '5000'});
                      } else {
                        setDraft({...draft, radius: val});
                      }
                    }}
                    className="w-20 bg-emerald-500/10 border border-emerald-500/30 rounded-lg py-1 px-2 text-white text-xs font-black text-right outline-none focus:border-emerald-500 transition-all"
                  />
                  <span className="ml-2 text-[10px] font-black text-white/40 uppercase tracking-tighter">Mi</span>
                </div>
              </div>

              <input
                type="range" min="10" max="5000" step="10"
                value={draft.radius || '50'}
                onChange={(e) => setDraft({...draft, radius: e.target.value})}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between mt-2 px-1">
                <span className="text-[11px] font-black text-white/40 uppercase">10 mi</span>
                <span className="text-[11px] font-black text-white/40 uppercase">5000 mi</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Zip Code</label>
                <button
                  onClick={handleUseGPS}
                  disabled={isLocating}
                  className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-2 ${isLocating ? 'bg-emerald-500 border-emerald-500 text-[#011a14] shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-white/5 border-white/10 text-emerald-400 hover:border-emerald-500/50'}`}
                >
                  {isLocating && <div className="w-2 h-2 border-2 border-[#011a14] border-t-transparent rounded-full animate-spin"></div>}
                  {isLocating ? 'Locating...' : 'Use GPS'}
                </button>
              </div>
              <input
                type="text" maxLength={5} placeholder="Zipcode"
                value={draft.zipCode || ''}
                onChange={(e) => setDraft({...draft, zipCode: e.target.value.replace(/\D/g, ''), customCoords: null})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 8.2: GEOGRAPHY (CITY & STATE SELECTION) */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-emerald-400 uppercase mb-2 block">City</label>
              <input type="text" value={draft.city || ''} onChange={(e) => setDraft({...draft, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase block">States</label>
                {draft.states?.length > 0 && (
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    {draft.states.length} Selected
                  </span>
                )}
              </div>

              {draft.states?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {draft.states.map((s: string) => (
                    <span key={s} onClick={() => toggleFilter('states', s)} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[8px] font-black rounded flex items-center gap-1 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-400 transition-colors">
                      {s} <X size={8} />
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-xl max-h-40 overflow-y-auto p-1 custom-scrollbar">
                {STATE_OPTIONS.map(s => {
                  const isSelected = draft.states?.includes(s);
                  return (
                    <div
                      key={s}
                      onClick={() => toggleFilter('states', s)}
                      className="flex items-center gap-3 p-2.5 hover:bg-white/5 cursor-pointer rounded-lg group transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-emerald-500/50'}`}>
                        {isSelected && <Check size={12} className="text-[#011a14]" strokeWidth={4} />}
                      </div>
                      <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-white/40'}`}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 8.3: ACTIVITY & SKILL SELECTION */}
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase block mb-3">Adventure Type</label>
            <div className="flex flex-wrap gap-1.5">
              {ADVENTURE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleFilter('adventureType', opt)} className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${draft.adventureType?.includes(opt) ? 'bg-emerald-500 border-emerald-500 text-[#011a14]' : 'bg-white/5 border-white/10 text-white/60 hover:border-emerald-500/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase block mb-3">Skill Level</label>
            <div className="grid grid-cols-2 gap-2">
              {SKILL_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleFilter('skillLevel', opt)} className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${draft.skillLevel?.includes(opt) ? 'bg-emerald-500 border-emerald-500 text-[#011a14]' : 'bg-white/5 border-white/10 text-white/60 hover:border-emerald-500/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 8.4: PREFERENCES (GENDER & AGE INPUTS) */}
          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase block mb-3">Gender Preference</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleFilter('gender', opt)} className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${draft.gender?.includes(opt) ? 'bg-emerald-500 border-emerald-500 text-[#011a14]' : 'bg-white/5 border-white/10 text-white/60 hover:border-emerald-500/50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-emerald-400 uppercase block mb-2">Age Range (18+)</label>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <input
                type="number"
                value={draft.minAge}
                onChange={(e) => handleAgeChange('minAge', e.target.value)}
                className={`w-full bg-white/5 border rounded-xl p-3 text-white text-sm outline-none transition-all duration-300 text-center ${isAgeInvalid ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] bg-red-500/5' : 'border-white/10 focus:border-emerald-500'}`}
                placeholder="Min"
              />
              <span className="text-white/20 font-black">—</span>
              <input
                type="number"
                value={draft.maxAge}
                onChange={(e) => handleAgeChange('maxAge', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 transition-all text-center"
                placeholder="Max"
              />
            </div>
            {isAgeInvalid && <p className="text-[9px] text-red-500 font-bold uppercase mt-2 animate-pulse text-center">Under 18 not allowed</p>}
          </div>

          {/* 8.5: FINAL ACTION BUTTONS */}
          <button
            disabled={isAgeInvalid}
            onClick={handleApplyFilters}
            className="w-full py-4 bg-emerald-500 text-[#011a14] disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}