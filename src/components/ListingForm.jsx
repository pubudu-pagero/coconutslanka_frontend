import { useState } from 'react';
import { useCreateListing } from '../api/client';

const INITIAL = {
  type: 'sell',
  name: '',
  phone: '',
  location: '',
  quantity: '',
  price_per_unit: '',
  coconut_size: 'small',
};

const inputClass =
  'py-[0.55rem] px-3 border-[1.5px] border-[#dde3e0] rounded-md bg-white text-[#1a1a1a] transition-[border-color,box-shadow] focus:outline-none focus:border-[#2d8048] focus:shadow-[0_0_0_2px_rgba(45,128,72,0.12)]';

const labelClass = 'text-[0.85rem] font-semibold text-[#444]';

export default function ListingForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const createListing = useCreateListing();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      type: form.type,
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      quantity: Number(form.quantity),
      coconut_size: form.coconut_size,
      price_per_unit: form.type === 'sell' && form.price_per_unit
        ? Number(form.price_per_unit)
        : null,
    };
    try {
      await createListing.mutateAsync(payload);
      setForm(INITIAL);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post ad. Please try again.');
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[0.35rem]">
        <label className={labelClass}>Ad Type</label>
        <div className="flex gap-6 flex-wrap">
          <label className="flex items-center gap-[0.4rem] text-[0.9rem] cursor-pointer">
            <input
              type="radio"
              name="type"
              value="sell"
              checked={form.type === 'sell'}
              onChange={handleChange}
              className="accent-[#2d8048] w-4 h-4"
            />
            I want to SELL coconuts
          </label>
          <label className="flex items-center gap-[0.4rem] text-[0.9rem] cursor-pointer">
            <input
              type="radio"
              name="type"
              value="buy"
              checked={form.type === 'buy'}
              onChange={handleChange}
              className="accent-[#2d8048] w-4 h-4"
            />
            I want to BUY coconuts
          </label>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
          <label htmlFor="name" className={labelClass}>Your Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Nimal Perera"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
          <label htmlFor="phone" className={labelClass}>Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 0771234567"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
          <label htmlFor="location" className={labelClass}>Location (District / City) *</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Colombo, Gampaha, Kandy"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
          <label htmlFor="coconut_size" className={labelClass}>Coconut Size *</label>
          <select
            id="coconut_size"
            name="coconut_size"
            value={form.coconut_size}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
          <label htmlFor="quantity" className={labelClass}>Number of Coconuts *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 100"
            required
            className={inputClass}
          />
        </div>
        {form.type === 'sell' && (
          <div className="flex flex-col gap-[0.35rem] flex-1 min-w-[180px]">
            <label htmlFor="price_per_unit" className={labelClass}>Price per Coconut (Rs) *</label>
            <input
              id="price_per_unit"
              name="price_per_unit"
              type="number"
              min="1"
              value={form.price_per_unit}
              onChange={handleChange}
              placeholder="e.g. 85"
              required
              className={inputClass}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-[#fdecea] text-[#c0392b] py-[0.6rem] px-[0.85rem] rounded-md text-sm border-l-[3px] border-[#c0392b]">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="inline-block px-5 py-[0.55rem] bg-brand-700 hover:bg-brand-900 disabled:bg-[#a0c4aa] disabled:cursor-not-allowed text-white font-semibold rounded-md whitespace-nowrap transition-colors"
        disabled={createListing.isPending}
      >
        {createListing.isPending ? 'Posting...' : 'Post Ad'}
      </button>
    </form>
  );
}
