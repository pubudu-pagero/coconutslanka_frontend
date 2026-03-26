import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mockListings,
  mockSupermarketPrices,
  mockCompareData,
  filterListings,
} from '../mocks/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simulate a short async delay so loading states are visible during development
const mockDelay = () => new Promise((r) => setTimeout(r, 400));

// ---------- Listings ----------

export function useListings(filters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      if (USE_MOCK) {
        await mockDelay();
        return filterListings(mockListings, filters);
      }
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.location) params.location = filters.location;
      if (filters.coconut_size) params.coconut_size = filters.coconut_size;
      const { data } = await api.get('/listings', { params });
      return data;
    },
    staleTime: 30_000,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing) => {
      if (USE_MOCK) {
        await mockDelay();
        return { ...listing, id: Date.now() };
      }
      return api.post('/listings', listing).then((r) => r.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  });
}

// ---------- Prices ----------

export function useComparePrices() {
  return useQuery({
    queryKey: ['prices', 'compare'],
    queryFn: async () => {
      if (USE_MOCK) {
        await mockDelay();
        return mockCompareData;
      }
      const { data } = await api.get('/prices/compare');
      return data;
    },
    staleTime: 60_000,
  });
}

export function useSupermarketPrices() {
  return useQuery({
    queryKey: ['prices', 'supermarket'],
    queryFn: async () => {
      if (USE_MOCK) {
        await mockDelay();
        return mockSupermarketPrices;
      }
      const { data } = await api.get('/prices/supermarket');
      return data;
    },
    staleTime: 60_000,
  });
}

export function useCreateOrUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (price) => {
      if (USE_MOCK) {
        await mockDelay();
        return { ...price, id: Date.now() };
      }
      return api.post('/prices/supermarket', price).then((r) => r.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...price }) => {
      if (USE_MOCK) {
        await mockDelay();
        return { id, ...price };
      }
      return api.put(`/prices/supermarket/${id}`, price).then((r) => r.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}

export function useDeletePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (USE_MOCK) {
        await mockDelay();
        return { id };
      }
      return api.delete(`/prices/supermarket/${id}`).then((r) => r.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prices'] }),
  });
}

// ---------- Auth ----------

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      if (USE_MOCK) {
        await mockDelay();
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return { token: 'mock-token', username: 'admin' };
        }
        throw Object.assign(new Error(), {
          response: { data: { error: 'Invalid credentials (mock: use admin / admin)' } },
        });
      }
      return api.post('/auth/login', credentials).then((r) => r.data);
    },
  });
}
