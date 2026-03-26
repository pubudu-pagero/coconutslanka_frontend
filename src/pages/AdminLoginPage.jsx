import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/client';

const inputClass =
  'py-[0.55rem] px-3 border-[1.5px] border-[#dde3e0] rounded-md bg-white text-[#1a1a1a] transition-[border-color,box-shadow] focus:outline-none focus:border-[#2d8048] focus:shadow-[0_0_0_2px_rgba(45,128,72,0.12)]';

const labelClass = 'text-[0.85rem] font-semibold text-[#444]';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const result = await loginMutation.mutateAsync(form);
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUsername', result.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.10)] py-10 px-8 w-full max-w-[400px]">
        <h1 className="text-2xl text-brand-900 mb-1">Admin Login</h1>
        <p className="text-[#777] text-sm mb-6">Coconut Lanka Admin Panel</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-[0.35rem]">
            <label htmlFor="username" className={labelClass}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              required
              autoFocus
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-[0.35rem]">
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </div>

          {error && (
            <div className="bg-[#fdecea] text-[#c0392b] py-[0.6rem] px-[0.85rem] rounded-md text-sm border-l-[3px] border-[#c0392b]">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full text-center py-[0.55rem] px-5 bg-brand-700 hover:bg-brand-900 disabled:bg-[#a0c4aa] disabled:cursor-not-allowed text-white font-semibold rounded-md whitespace-nowrap transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <a
          href="/"
          className="flex justify-center items-center gap-[0.3rem] mt-4 text-brand-700 text-sm font-semibold hover:text-brand-900"
        >
          &#8592; Back to Marketplace
        </a>
      </div>
    </div>
  );
}
