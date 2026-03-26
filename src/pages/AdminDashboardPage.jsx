import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useSupermarketPrices,
  useCreateOrUpdatePrice,
  useUpdatePrice,
  useDeletePrice,
} from '../api/client';

const SIZE_OPTIONS = ['small', 'medium', 'large'];
const SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' };
const EMPTY_FORM = { supermarket: '', coconut_size: 'small', price: '' };

const inputClass =
  'py-[0.55rem] px-3 border-[1.5px] border-[#dde3e0] rounded-md bg-white text-[#1a1a1a] transition-[border-color,box-shadow] focus:outline-none focus:border-[#2d8048] focus:shadow-[0_0_0_2px_rgba(45,128,72,0.12)]';
const labelClass = 'text-[0.85rem] font-semibold text-[#444]';
const formGroupClass = 'flex flex-col gap-[0.35rem] flex-1 min-w-[180px]';
const btnPrimary =
  'inline-block px-5 py-[0.55rem] bg-brand-700 hover:bg-brand-900 disabled:bg-[#a0c4aa] disabled:cursor-not-allowed text-white font-semibold rounded-md whitespace-nowrap transition-colors';
const btnSecondary =
  'inline-block px-5 py-[0.55rem] bg-white text-brand-900 border-[1.5px] border-brand-700 hover:bg-brand-50 rounded-md font-semibold whitespace-nowrap transition-colors';
const stateMsg = 'text-center py-10 px-4 text-[#777] bg-white rounded-lg text-[0.95rem]';
const formErrorClass =
  'bg-[#fdecea] text-[#c0392b] py-[0.6rem] px-[0.85rem] rounded-md text-sm border-l-[3px] border-[#c0392b]';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const { data: prices, isLoading, isError } = useSupermarketPrices();
  const createOrUpdateMutation = useCreateOrUpdatePrice();
  const updateMutation = useUpdatePrice();
  const deleteMutation = useDeletePrice();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  }

  function handleEdit(price) {
    setEditingId(price.id);
    setForm({
      supermarket: price.supermarket,
      coconut_size: price.coconut_size,
      price: String(price.price),
    });
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const payload = {
      supermarket: form.supermarket.trim(),
      coconut_size: form.coconut_size,
      price: Number(form.price),
    };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
      } else {
        await createOrUpdateMutation.mutateAsync(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save price.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this price entry?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('Failed to delete price.');
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  const isPending = createOrUpdateMutation.isPending || updateMutation.isPending;

  const tdClass = (isEditing) =>
    `py-[0.65rem] px-[0.85rem] border-b border-[#dde3e0] ${isEditing ? 'bg-[#eaf4fb]' : 'group-hover:bg-[#fafcfb]'}`;

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <div className="bg-brand-900 text-white py-4 px-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#a8d5b8]">
            Signed in as <strong>{adminUsername}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="py-[0.4rem] px-4 border-[1.5px] border-white/40 bg-transparent text-white rounded-md text-sm transition-colors hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-[960px] w-full mx-auto px-4 py-6 flex flex-col gap-6">
        <section className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-[1.05rem] text-brand-900 mb-4 pb-2 border-b-2 border-brand-50">
            {editingId ? 'Edit Price' : 'Add / Update Price'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className={formGroupClass}>
                <label htmlFor="supermarket" className={labelClass}>Supermarket Name *</label>
                <input
                  id="supermarket"
                  name="supermarket"
                  type="text"
                  value={form.supermarket}
                  onChange={handleChange}
                  placeholder="e.g. Keells, Cargills"
                  required
                  className={inputClass}
                />
              </div>
              <div className={formGroupClass}>
                <label htmlFor="coconut_size" className={labelClass}>Coconut Size *</label>
                <select
                  id="coconut_size"
                  name="coconut_size"
                  value={form.coconut_size}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{SIZE_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className={formGroupClass}>
                <label htmlFor="price" className={labelClass}>Price (Rs) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 90"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {formError && <div className={formErrorClass}>{formError}</div>}

            <div className="flex gap-3 flex-wrap">
              <button type="submit" className={btnPrimary} disabled={isPending}>
                {isPending ? 'Saving...' : editingId ? 'Update Price' : 'Add Price'}
              </button>
              {editingId && (
                <button type="button" className={btnSecondary} onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-[1.05rem] text-brand-900 mb-4 pb-2 border-b-2 border-brand-50">
            Supermarket Prices
          </h2>
          {isLoading && <div className={stateMsg}>Loading...</div>}
          {isError && (
            <div className="text-center py-10 px-4 bg-[#fdecea] text-[#c0392b] rounded-lg text-[0.95rem]">
              Failed to load prices.
            </div>
          )}
          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.9rem]">
                <thead>
                  <tr>
                    <th className="text-left py-[0.6rem] px-[0.85rem] bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-[0.04em]">
                      Supermarket
                    </th>
                    <th className="text-left py-[0.6rem] px-[0.85rem] bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-[0.04em]">
                      Size
                    </th>
                    <th className="text-left py-[0.6rem] px-[0.85rem] bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-[0.04em]">
                      Price (Rs)
                    </th>
                    <th className="text-left py-[0.6rem] px-[0.85rem] bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-[0.04em] max-[868px]:hidden">
                      Last Updated
                    </th>
                    <th className="text-left py-[0.6rem] px-[0.85rem] bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-[0.04em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-[#777] py-8 px-[0.85rem]">
                        No prices added yet.
                      </td>
                    </tr>
                  )}
                  {prices?.map((p) => (
                    <tr key={p.id} className="group">
                      <td className={tdClass(editingId === p.id)}>{p.supermarket}</td>
                      <td className={tdClass(editingId === p.id)}>{SIZE_LABELS[p.coconut_size]}</td>
                      <td className={`${tdClass(editingId === p.id)} font-semibold text-brand-900`}>
                        Rs {p.price}
                      </td>
                      <td className={`${tdClass(editingId === p.id)} max-[868px]:hidden`}>
                        {formatDate(p.updated_at)}
                      </td>
                      <td className={tdClass(editingId === p.id)}>
                        <div className="flex gap-2 items-center">
                          <button
                            className="py-[0.3rem] px-[0.7rem] bg-[#eaf4fb] text-[#2980b9] border border-[#a8d0e8] rounded-[5px] text-[0.82rem] font-semibold transition-colors hover:bg-[#d0e8f5]"
                            onClick={() => handleEdit(p)}
                            disabled={deleteMutation.isPending}
                          >
                            Edit
                          </button>
                          <button
                            className="py-[0.3rem] px-[0.7rem] bg-[#fdecea] text-[#c0392b] border border-[#e8a8a0] rounded-[5px] text-[0.82rem] font-semibold transition-colors hover:bg-[#fbd4cf] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(p.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="py-4 px-6">
        <a
          href="/"
          className="inline-flex items-center gap-[0.3rem] text-brand-700 text-sm font-semibold hover:text-brand-900"
        >
          &#8592; Back to Marketplace
        </a>
      </div>
    </div>
  );
}
