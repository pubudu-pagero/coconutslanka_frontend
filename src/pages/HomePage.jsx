import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../api/client';
import ListingCard from '../components/ListingCard';
import SearchFilters from '../components/SearchFilters';
import PriceComparisonSidebar from '../components/PriceComparisonSidebar';

export default function HomePage() {
  const [filters, setFilters] = useState({ type: '', location: '', coconut_size: '' });
  const { data: listings, isLoading, isError } = useListings(filters);

  return (
    <div className="flex gap-6 items-start max-[868px]:flex-col">
      <main className="flex-1 min-w-0">
        <div className="bg-white rounded-lg py-[0.6rem] px-3 mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col gap-2">
          <div className="sm:flex hidden gap-3 flex-wrap">
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
      </main>

      {/* Sidebar: only visible on desktop — mobile users reach prices via bottom nav /prices */}
      <div className="hidden min-[868px]:block">
        <PriceComparisonSidebar />
      </div>
    </div>
  );
}
