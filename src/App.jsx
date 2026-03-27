import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import PricesPage from './pages/PricesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BottomNav from './components/BottomNav';

const queryClient = new QueryClient();

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-brand-900 text-white px-6 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[60px] gap-4">
        <Link to="/" className="flex items-center gap-2 text-white ml-20 sm:ml-0">
          <span className="text-[1.6rem]">&#127825;</span>
          <span className="text-xl font-bold whitespace-nowrap max-[500px]:text-base">Coconut Lanka</span>
          <span className="text-[0.72rem] text-[#8ecba8] hidden [@media(min-width:600px)]:inline">Direct Farmer to Buyer</span>
        </Link>
        <nav className="hidden sm:flex gap-3">
          <Link
            to="/post?type=sell"
            className="py-[0.45rem] px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors bg-brand-700 text-white hover:bg-brand-500"
          >
            Sell Coconuts
          </Link>
          <Link
            to="/post?type=buy"
            className="py-[0.45rem] px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors bg-[#e07239] text-white hover:bg-[#c85e25]"
          >
            Buy Coconuts
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="hidden sm:block fixed bottom-0 left-0 w-full z-[100] bg-brand-900 text-[#8ecba8] text-center py-3 px-4 text-[0.82rem]">
      <p>Connecting coconut farmers and buyers across Sri Lanka &mdash; no middlemen.</p>
      <p className="mt-[0.3rem]">
        <Link to="/admin/login" className="text-white/40 text-[0.75rem] hover:text-white/70">Admin</Link>
      </p>
    </footer>
  );
}

function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 pt-[calc(60px+1rem)] pb-[calc(64px+1rem)] min-h-dvh sm:px-4 sm:pt-[calc(60px+1.5rem)] sm:pb-[calc(52px+1.5rem)]">
        {children}
      </div>
      <Footer />
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/post" element={<Layout><PostAdPage /></Layout>} />
          <Route path="/prices" element={<Layout><PricesPage /></Layout>} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
