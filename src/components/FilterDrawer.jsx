const TYPES = [
  { value: '', label: 'All' },
  { value: 'sell', label: 'Selling' },
  { value: 'buy', label: 'Buying' },
];

const SIZES = [
  { value: '', label: 'All' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

function SectionLabel({ children }) {
  return (
    <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#888] mb-3">
      {children}
    </p>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = (value || '') === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-[0.5rem] rounded-full text-sm font-medium border transition-all ${
              active
                ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                : 'bg-white text-[#444] border-[#d8d0c8] hover:border-brand-700 hover:text-brand-700'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterDrawer({ isOpen, onClose, filters, onChange }) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  function clearAll() {
    onChange({ type: '', location: '', coconut_size: '' });
  }

  return (
    <div className="sm:hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[88vw] max-w-[320px] bg-[#faf9f7] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {/* Header — no background strip, blends with drawer */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="font-bold text-[#1a1a1a] text-lg tracking-tight">Filters</span>
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              disabled={activeCount === 0}
              className="text-sm font-medium text-brand-700 disabled:text-[#bbb] transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ede8e1] text-[#555] hover:bg-[#e0d8cf] transition-colors"
              aria-label="Close filters"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e8e0d8] mx-5" />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-0">

          {/* Ad Type */}
          <div className="py-5">
            <SectionLabel>Ad Type</SectionLabel>
            <PillGroup
              options={TYPES}
              value={filters.type}
              onChange={(val) => onChange({ ...filters, type: val })}
            />
          </div>

          <div className="h-px bg-[#e8e0d8]" />

          {/* Location */}
          <div className="py-5">
            <SectionLabel>Location</SectionLabel>
            <div className="flex items-center gap-2 bg-white border border-[#d8d0c8] rounded-xl px-3 py-3 focus-within:border-brand-700 focus-within:shadow-[0_0_0_2px_rgba(45,128,72,0.12)] transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#aaa] shrink-0">
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
                <circle cx="12" cy="8" r="2" />
              </svg>
              <input
                type="text"
                name="location"
                value={filters.location || ''}
                onChange={(e) => onChange({ ...filters, location: e.target.value })}
                placeholder="e.g. Colombo, Kandy..."
                className="flex-1 bg-transparent text-[#1a1a1a] placeholder-[#bbb] focus:outline-none text-sm"
                aria-label="Filter by location"
              />
              {filters.location && (
                <button
                  onClick={() => onChange({ ...filters, location: '' })}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-[#e0d8cf] text-[#777] hover:bg-[#d0c8bf] transition-colors shrink-0"
                  aria-label="Clear location"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-3 h-3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-[#e8e0d8]" />

          {/* Coconut Size */}
          <div className="py-5">
            <SectionLabel>Coconut Size</SectionLabel>
            <PillGroup
              options={SIZES}
              value={filters.coconut_size}
              onChange={(val) => onChange({ ...filters, coconut_size: val })}
            />
          </div>

        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 bg-[#faf9f7] border-t border-[#e8e0d8] flex gap-3"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="py-[0.8rem] px-4 border border-[#d8d0c8] rounded-xl text-[#444] font-semibold text-sm transition-all hover:bg-[#ede8e1] active:scale-[0.98]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-[0.8rem] bg-brand-700 hover:bg-brand-900 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            {activeCount > 0 ? `Show Results · ${activeCount} filter${activeCount > 1 ? 's' : ''} active` : 'Show Results'}
          </button>
        </div>
      </div>
    </div>
  );
}
