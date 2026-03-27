import { useComparePrices } from '../api/client';

const SIZES = ['small', 'medium', 'large'];
const SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' };

function getPricesForSize(data, size) {
  const prices = [];

  const platformEntry = data?.platform?.find((p) => p.coconut_size === size);
  if (platformEntry) {
    prices.push({
      source: 'Platform Avg',
      price: Number(platformEntry.avg_price),
      isPlatform: true,
    });
  }

  data?.supermarket?.forEach((entry) => {
    if (entry.coconut_size === size) {
      prices.push({
        source: entry.supermarket,
        price: Number(entry.price),
        isPlatform: false,
      });
    }
  });

  return prices.sort((a, b) => a.price - b.price);
}

function computeSavings(prices) {
  if (prices.length < 2) return null;
  const lowest = prices[0].price;
  const highest = prices[prices.length - 1].price;
  if (highest === 0) return null;
  const pct = Math.round(((highest - lowest) / highest) * 100);
  return pct > 0 ? { amount: highest - lowest, pct } : null;
}

function SizeComparisonCard({ size, data }) {
  const prices = getPricesForSize(data, size);
  if (prices.length === 0) return null;

  const lowestPrice = prices[0]?.price;
  const savings = computeSavings(prices);

  return (
    <div className="px-5 py-3.5 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {SIZE_LABELS[size]} Coconuts
        </span>
        {savings && (
          <span className="text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
            Save up to {savings.pct}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {prices.map((p) => {
          const isBest = p.price === lowestPrice;
          return (
            <div
              key={p.source}
              className={`flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                isBest
                  ? 'bg-green-50 border border-green-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-800">{p.source}</span>
                {isBest && (
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-brand-700 text-white">
                    Best
                  </span>
                )}
              </div>
              <span
                className={
                  isBest
                    ? 'text-base font-extrabold text-brand-900'
                    : 'text-sm font-semibold text-gray-700'
                }
              >
                Rs {p.price.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {savings && (
        <div className="flex items-start gap-1.5 mt-2.5 px-2.5 py-2 rounded-md bg-[#fef0e6] border border-[#f5c4a0] text-xs text-[#7a3010] leading-relaxed">
          <span className="text-[#e07239] text-[0.6rem] mt-0.5 shrink-0">
            &#9660;
          </span>
          <span>
            You could save <strong>Rs {savings.amount.toFixed(2)}</strong> per
            coconut by choosing the best price
          </span>
        </div>
      )}
    </div>
  );
}

function OverallInsight({ data }) {
  let platformTotal = 0;
  let supermarketTotal = 0;
  let comparisons = 0;

  SIZES.forEach((size) => {
    const platEntry = data?.platform?.find((p) => p.coconut_size === size);
    if (!platEntry) return;
    const platPrice = Number(platEntry.avg_price);

    const superEntries = data?.supermarket?.filter(
      (p) => p.coconut_size === size
    );
    if (!superEntries?.length) return;

    const avgSuper =
      superEntries.reduce((sum, e) => sum + Number(e.price), 0) /
      superEntries.length;

    platformTotal += platPrice;
    supermarketTotal += avgSuper;
    comparisons++;
  });

  if (comparisons === 0 || supermarketTotal === 0) return null;

  const diff = supermarketTotal - platformTotal;
  if (diff <= 0) return null;

  const pct = Math.round((diff / supermarketTotal) * 100);

  return (
    <div className="flex items-center gap-2.5 px-5 py-3 bg-brand-50 border-b border-green-200">
      <span className="text-2xl font-extrabold text-brand-900 leading-none">
        {pct}%
      </span>
      <span className="text-xs text-brand-900 leading-tight">
        lower on average via platform sellers vs supermarkets
      </span>
    </div>
  );
}

function asideCls(fullPage) {
  return fullPage
    ? 'w-full shrink-0'
    : 'w-full -order-1 shrink-0 min-[868px]:w-80 min-[868px]:sticky min-[868px]:top-[76px] min-[868px]:order-none';
}

const CARD_CLS =
  'bg-white rounded-lg shadow-md overflow-hidden border-[1.5px] border-brand-50 p-4';

export default function PriceComparisonSidebar({ fullPage = false }) {
  const { data, isLoading, isError } = useComparePrices();

  if (isLoading)
    return (
      <aside className={asideCls(fullPage)}>
        <div className={CARD_CLS}>
          <div className="flex flex-col items-center gap-2.5 py-8 px-4 text-gray-500 text-sm">
            <div className="w-9 h-9 rounded-full bg-brand-50 animate-pulse" />
            <span>Loading prices...</span>
          </div>
        </div>
      </aside>
    );

  if (isError)
    return (
      <aside className={asideCls(fullPage)}>
        <div className={CARD_CLS}>
          <div className="py-6 px-4 text-center text-red-600 text-sm">
            Could not load prices.
          </div>
        </div>
      </aside>
    );

  const hasPrices =
    (data?.platform?.length || 0) + (data?.supermarket?.length || 0) > 0;

  return (
    <aside className={asideCls(fullPage)}>
      <div className={CARD_CLS}>
        <div className="flex items-center gap-2 px-5 py-4 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
          <span className="text-xl">&#9878;</span>
          <h2 className="text-base font-bold tracking-tight">
            Price Comparison
          </h2>
        </div>

        {hasPrices && <OverallInsight data={data} />}

        <div className="flex flex-col">
          {SIZES.map((size) => (
            <SizeComparisonCard key={size} size={size} data={data} />
          ))}
        </div>

        <p className="text-xs text-gray-500 italic text-center px-5 py-3 border-t border-gray-200 bg-gray-50">
          Compare prices to get the best deal when buying or selling coconuts.
        </p>
      </div>
    </aside>
  );
}
