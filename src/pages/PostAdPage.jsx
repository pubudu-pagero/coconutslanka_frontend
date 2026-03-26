import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ListingForm from '../components/ListingForm';

export default function PostAdPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') || 'sell';

  return (
    <div className="flex justify-center py-4">
      <div className="bg-white rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.10)] p-8 w-full max-w-[700px]">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-[0.3rem] text-brand-700 text-sm font-semibold hover:text-brand-900"
          >
            &#8592; Back to Listings
          </Link>
          <h1 className="text-[1.4rem] text-brand-900 mt-[0.4rem] mb-[0.3rem]">
            Post a {defaultType === 'sell' ? 'Sell' : 'Buy'} Ad
          </h1>
          <p className="text-[#777] text-sm">
            {defaultType === 'sell'
              ? 'Let buyers know you have coconuts to sell. Price must not exceed current supermarket price.'
              : 'Let sellers know you want to buy coconuts.'}
          </p>
        </div>
        <ListingForm onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
}
