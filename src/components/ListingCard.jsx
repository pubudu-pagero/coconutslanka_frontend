const SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' };

export default function ListingCard({ listing }) {
  const isSell = listing.type === 'sell';

  const expiresDate = new Date(listing.expires_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 p-2.5 mx-[10px] hover:shadow-md transition-shadow ${
        isSell ? 'border-l-brand-700' : 'border-l-[#e07239]'
      }`}
    >
      {/* Row 1: type + size + name + price */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`shrink-0 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isSell
              ? 'bg-brand-50 text-brand-900'
              : 'bg-[#fef0e6] text-[#c85e25]'
          }`}
        >
          {isSell ? 'Sell' : 'Buy'}
        </span>
        <span className="shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {SIZE_LABELS[listing.coconut_size]}
        </span>
        <span className="text-[0.95rem] font-semibold text-gray-800 truncate flex-1 min-w-0">
          {listing.name}
        </span>
        {isSell && listing.price_per_unit ? (
          <span className="shrink-0 text-base font-extrabold text-brand-900 leading-none">
            Rs&nbsp;{listing.price_per_unit}
          </span>
        ) : (
          <span className="shrink-0 text-xs text-gray-400 italic">no price</span>
        )}
      </div>

      {/* Row 2: location + qty + expiry + call */}
      <div className="flex items-center gap-2.5 mt-2.5 min-w-0">
        <span className="text-xs text-gray-500 truncate flex-1 min-w-0">
          &#128205;&nbsp;{listing.location}&nbsp;&middot;&nbsp;{listing.quantity} pcs
        </span>
        <span className="shrink-0 text-[0.7rem] text-gray-400 whitespace-nowrap">
          exp&nbsp;{expiresDate}
        </span>
        <a
          href={`tel:${listing.phone}`}
          className="shrink-0 flex items-center gap-1 bg-brand-700 hover:bg-brand-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
        >
          &#9742;&nbsp;{listing.phone}
        </a>
      </div>
    </div>
  );
}
