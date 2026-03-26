const selectClass =
  'py-[0.45rem] px-3 border border-[#dde3e0] rounded-md bg-white text-[#1a1a1a] min-w-[130px] focus:outline-none focus:border-[#2d8048] focus:shadow-[0_0_0_2px_rgba(45,128,72,0.15)]';

export default function SearchFilters({ filters, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <select
        name="type"
        value={filters.type || ''}
        onChange={handleChange}
        className={selectClass}
        aria-label="Filter by type"
      >
        <option value="">All Ads</option>
        <option value="sell">Selling</option>
        <option value="buy">Buying</option>
      </select>

      <input
        type="text"
        name="location"
        value={filters.location || ''}
        onChange={handleChange}
        placeholder="Filter by location..."
        className="py-[0.45rem] px-3 border border-[#dde3e0] rounded-md bg-white text-[#1a1a1a] flex-1 min-w-[160px] focus:outline-none focus:border-[#2d8048] focus:shadow-[0_0_0_2px_rgba(45,128,72,0.15)]"
        aria-label="Filter by location"
      />

      <select
        name="coconut_size"
        value={filters.coconut_size || ''}
        onChange={handleChange}
        className={selectClass}
        aria-label="Filter by size"
      >
        <option value="">All Sizes</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      {(filters.type || filters.location || filters.coconut_size) && (
        <button
          className="py-[0.45rem] px-3 border border-[#dde3e0] rounded-md bg-white text-[#777] text-sm transition-colors hover:bg-[#f4f7f5]"
          onClick={() => onChange({ type: '', location: '', coconut_size: '' })}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
