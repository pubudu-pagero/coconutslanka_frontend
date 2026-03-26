import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 3v18M3 7l9-4 9 4M5 10l-2 7h4L5 10zm14 0l-2 7h4l-2-7z" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPostPicker, setShowPostPicker] = useState(false);

  const isHome = location.pathname === '/';
  const isPrices = location.pathname === '/prices';
  const isPost = location.pathname === '/post';

  function handlePostClick() {
    setShowPostPicker((v) => !v);
  }

  function handlePostType(type) {
    setShowPostPicker(false);
    navigate(`/post?type=${type}`);
  }

  return (
    <>
      {showPostPicker && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setShowPostPicker(false)}
        />
      )}

      {showPostPicker && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            What do you want to post?
          </p>
          <button
            onClick={() => handlePostType('sell')}
            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-green-50 transition-colors border-t border-gray-100"
          >
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg shrink-0">
              &#127807;
            </span>
            <div>
              <p className="font-semibold text-gray-800">Sell Coconuts</p>
              <p className="text-xs text-gray-500">Post coconuts you want to sell</p>
            </div>
          </button>
          <button
            onClick={() => handlePostType('buy')}
            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-amber-50 transition-colors border-t border-gray-100"
          >
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-lg shrink-0">
              &#128722;
            </span>
            <div>
              <p className="font-semibold text-gray-800">Buy Coconuts</p>
              <p className="text-xs text-gray-500">Post a request for coconuts</p>
            </div>
          </button>
        </div>
      )}

      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[0.65rem] font-semibold transition-colors ${
            isHome ? 'text-brand-700' : 'text-gray-400'
          }`}
        >
          <HomeIcon />
          <span>Home</span>
        </Link>

        <button
          onClick={handlePostClick}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[0.65rem] font-semibold transition-colors ${
            isPost ? 'text-brand-700' : 'text-gray-400'
          }`}
        >
          <span
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              showPostPicker
                ? 'bg-brand-700 text-white'
                : 'bg-brand-50 text-brand-700'
            }`}
          >
            <PlusIcon />
          </span>
          <span className={isPost || showPostPicker ? 'text-brand-700' : 'text-gray-400'}>
            Post Ad
          </span>
        </button>

        <Link
          to="/prices"
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[0.65rem] font-semibold transition-colors ${
            isPrices ? 'text-brand-700' : 'text-gray-400'
          }`}
        >
          <ScaleIcon />
          <span>Prices</span>
        </Link>
      </nav>
    </>
  );
}
