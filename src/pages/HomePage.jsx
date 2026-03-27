import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../api/client';
import ListingCard from '../components/ListingCard';
import SearchFilters from '../components/SearchFilters';
import PriceComparisonSidebar from '../components/PriceComparisonSidebar';
import FilterDrawer from '../components/FilterDrawer';

export default function HomePage() {
  const [filters, setFilters] = useState({ type: '', location: '', coconut_size: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: listings, isLoading, isError } = useListings(filters);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex gap-6 items-start max-[868px]:flex-col">
      <main className="flex-1 min-w-0">
        {/* Desktop only: action buttons + inline filters */}
        <div className="hidden sm:flex flex-col gap-2 bg-white rounded-lg py-[0.6rem] px-3 mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/post?type=sell"
              className="inline-block px-5 py-[0.55rem] bg-brand-700 hover:bg-brand-900 text-white font-semibold rounded-md whitespace-nowrap transition-colors"
            >
              Post Sell Ad
            </Link>
            <Link
              to="/post?type=buy"
              className="inline-block px-5 py-[0.55rem] bg-white text-brand-900 border-[1.5px] border-brand-700 hover:bg-brand-50 rounded-md font-semibold whitespace-nowrap transition-colors"
            >
              Post Buy Request
            </Link>
          </div>
          <SearchFilters filters={filters} onChange={setFilters} />
        </div>

        {isLoading && (
          <div className="text-center py-10 px-4 text-[#777] bg-white rounded-lg text-[0.95rem]">
            Loading listings...
          </div>
        )}
        {isError && (
          <div className="text-center py-10 px-4 bg-[#fdecea] text-[#c0392b] rounded-lg text-[0.95rem]">
            Could not load listings. Make sure the server is running.
          </div>
        )}
        {!isLoading && !isError && listings?.length === 0 && (
          <div className="text-center py-10 px-4 text-[#777] bg-white rounded-lg text-[0.95rem]">
            No listings found.{' '}
            {(filters.type || filters.location || filters.coconut_size) && (
              <span>Try adjusting your filters.</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-[0.6rem]">
          {listings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Mobile filter button — fixed inside header row on the right */}
        <div className="sm:hidden fixed top-0 left-0 z-[110] h-[60px] flex items-center pl-4">
          <button
            onClick={() => setIsDrawerOpen(prev => !prev)}
            className="flex items-center gap-1.5 pl-3 pr-3.5 py-[0.45rem] bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-full transition-all"
            aria-label="Open filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span className="text-sm font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-[1.1rem] h-[1.1rem] rounded-full bg-brand-500 text-white text-[0.6rem] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </main>

      {/* Sidebar: only visible on desktop — mobile users reach prices via bottom nav /prices */}
      <div className="hidden min-[868px]:block">
        <PriceComparisonSidebar />
      </div>

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
}
