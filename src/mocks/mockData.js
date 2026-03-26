const now = new Date();
const days = (n) => new Date(now.getTime() + n * 86_400_000).toISOString();

// ─── Listings ────────────────────────────────────────────────────────────────

export const mockListings = [
  {
    id: 1,
    type: 'sell',
    name: 'Nimal Perera',
    phone: '0771234567',
    location: 'Colombo',
    quantity: 200,
    price_per_unit: 85,
    coconut_size: 'medium',
    created_at: days(-2),
    expires_at: days(12),
  },
  {
    id: 2,
    type: 'buy',
    name: 'Suneetha Fernando',
    phone: '0769876543',
    location: 'Gampaha',
    quantity: 500,
    price_per_unit: null,
    coconut_size: 'large',
    created_at: days(-1),
    expires_at: days(13),
  },
  {
    id: 3,
    type: 'sell',
    name: 'Roshan Wickramasinghe',
    phone: '0754561234',
    location: 'Kurunegala',
    quantity: 1000,
    price_per_unit: 72,
    coconut_size: 'small',
    created_at: days(-3),
    expires_at: days(11),
  },
  {
    id: 4,
    type: 'sell',
    name: 'Kamala Jayasinghe',
    phone: '0712223334',
    location: 'Kandy',
    quantity: 350,
    price_per_unit: 90,
    coconut_size: 'large',
    created_at: days(-1),
    expires_at: days(13),
  },
  {
    id: 5,
    type: 'buy',
    name: 'Prasad Dissanayake',
    phone: '0787654321',
    location: 'Ratnapura',
    quantity: 800,
    price_per_unit: null,
    coconut_size: 'medium',
    created_at: days(0),
    expires_at: days(14),
  },
  {
    id: 6,
    type: 'sell',
    name: 'Amara Silva',
    phone: '0761112223',
    location: 'Matara',
    quantity: 150,
    price_per_unit: 68,
    coconut_size: 'small',
    created_at: days(-4),
    expires_at: days(10),
  },
  {
    id: 7,
    type: 'buy',
    name: 'Tharaka Bandara',
    phone: '0773334445',
    location: 'Anuradhapura',
    quantity: 300,
    price_per_unit: null,
    coconut_size: 'small',
    created_at: days(-2),
    expires_at: days(12),
  },
  {
    id: 8,
    type: 'sell',
    name: 'Dilrukshi Pathirana',
    phone: '0718889990',
    location: 'Negombo, Gampaha District',
    quantity: 600,
    price_per_unit: 88,
    coconut_size: 'medium',
    created_at: days(0),
    expires_at: days(14),
  },
];

// ─── Prices ──────────────────────────────────────────────────────────────────

export const mockSupermarketPrices = [
  { id: 1, supermarket: 'Keells',    coconut_size: 'small',  price: '80',  updated_at: days(-1) },
  { id: 2, supermarket: 'Keells',    coconut_size: 'medium', price: '95',  updated_at: days(-1) },
  { id: 3, supermarket: 'Keells',    coconut_size: 'large',  price: '115', updated_at: days(-1) },
  { id: 4, supermarket: 'Cargills',  coconut_size: 'small',  price: '78',  updated_at: days(-2) },
  { id: 5, supermarket: 'Cargills',  coconut_size: 'medium', price: '92',  updated_at: days(-2) },
  { id: 6, supermarket: 'Cargills',  coconut_size: 'large',  price: '112', updated_at: days(-2) },
  { id: 7, supermarket: 'Laugfs',    coconut_size: 'small',  price: '82',  updated_at: days(-3) },
  { id: 8, supermarket: 'Laugfs',    coconut_size: 'medium', price: '98',  updated_at: days(-3) },
  { id: 9, supermarket: 'Laugfs',    coconut_size: 'large',  price: '118', updated_at: days(-3) },
];

export const mockPlatformPrices = [
  { coconut_size: 'small',  avg_price: '70' },
  { coconut_size: 'medium', avg_price: '86' },
  { coconut_size: 'large',  avg_price: '104' },
];

export const mockCompareData = {
  platform:    mockPlatformPrices,
  supermarket: mockSupermarketPrices,
};

// ─── Filter helper (mirrors backend query params) ─────────────────────────────

export function filterListings(listings, filters = {}) {
  return listings.filter((l) => {
    if (filters.type && l.type !== filters.type) return false;
    if (filters.coconut_size && l.coconut_size !== filters.coconut_size) return false;
    if (filters.location && !l.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    return true;
  });
}
