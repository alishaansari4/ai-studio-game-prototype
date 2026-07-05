import { useState } from "react";
import { 
  User, 
  Settings, 
  Heart, 
  Trash2, 
  MessageSquareCode, 
  Check, 
  Compass, 
  Info,
  Sliders,
  DollarSign,
  Car
} from "lucide-react";
import { TravelSpot, RealTalkReview } from "../types";

interface UserProfileTabProps {
  spots: TravelSpot[];
  savedSpots: string[];
  reviews: RealTalkReview[];
  onToggleFavorite: (spotId: string) => void;
  onDeleteReview: (id: string) => void;
  userEmail?: string;
}

export default function UserProfileTab({
  spots,
  savedSpots,
  reviews,
  onToggleFavorite,
  onDeleteReview,
  userEmail = "alishaansari44444@gmail.com",
}: UserProfileTabProps) {
  // Configurable preferences states
  const [currency, setCurrency] = useState<string>("INR (₹)");
  const [budget, setBudget] = useState<"Budget" | "Premium" | "Luxury">("Budget");
  const [preferredTransport, setPreferredTransport] = useState<string>("Auto Rickshaw");
  const [isSavedPrefs, setIsSavedPrefs] = useState<boolean>(false);

  // Filter bookmarked spots
  const favoritedList = spots.filter(spot => savedSpots.includes(spot.id));

  const handleSavePrefs = () => {
    setIsSavedPrefs(true);
    setTimeout(() => setIsSavedPrefs(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      {/* Header Profile Info card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-tr from-brand-primary to-blue-400 rounded-full flex items-center justify-center text-white text-xl font-extrabold shadow-md">
          {userEmail.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h3 className="font-display font-extrabold text-lg text-gray-900">
            Alisha Ansari
          </h3>
          <p className="text-xs text-gray-500 font-mono">
            {userEmail}
          </p>
          <div className="flex gap-2 justify-center sm:justify-start">
            <span className="bg-blue-50 border border-blue-100 text-brand-primary text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
              Wayfarer Pro Explorer
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Preferences Controls */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Sliders className="w-5 h-5 text-brand-primary" />
          <h4 className="font-display font-bold text-base text-gray-900">
            Travel Preferences
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans text-gray-700">
          {/* Budget tier select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 font-mono">Budget Lens</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-brand-primary transition-all text-sm font-medium"
            >
              <option value="Budget">Affordable Gems</option>
              <option value="Premium">Premium Luxury</option>
              <option value="Luxury">Absolute Excess</option>
            </select>
          </div>

          {/* Preferred Currency select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 font-mono">Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-brand-primary transition-all text-sm font-medium"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
            </select>
          </div>

          {/* Preferred transit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 font-mono">Preferred Transit</label>
            <select
              value={preferredTransport}
              onChange={(e) => setPreferredTransport(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-brand-primary transition-all text-sm font-medium"
            >
              <option value="Auto Rickshaw">Auto Rickshaw</option>
              <option value="Cab / Taxi">Cab / Taxi</option>
              <option value="Local Bus">Local Bus</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePrefs}
            className="bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-semibold tracking-wider px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {isSavedPrefs ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Bookmarked Spots section */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <h4 className="font-display font-bold text-base text-gray-900">
            My Saved Spots ({favoritedList.length})
          </h4>
        </div>

        {favoritedList.length > 0 ? (
          <div className="space-y-3">
            {favoritedList.map((spot) => (
              <div 
                key={spot.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="space-y-0.5">
                    <h5 className="font-display font-bold text-sm text-gray-850">
                      {spot.name}
                    </h5>
                    <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      <span>{spot.category} • {spot.distance}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleFavorite(spot.id)}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  aria-label="Remove Favorite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
            <Heart className="w-8 h-8 text-gray-200" />
            <p>Save travel spots from the Home feed to see them here.</p>
          </div>
        )}
      </div>

      {/* Written real talk reviews section */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <MessageSquareCode className="w-5 h-5 text-brand-secondary" />
          <h4 className="font-display font-bold text-base text-gray-900">
            My Real Talk Reviews ({reviews.length})
          </h4>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2.5 relative group"
              >
                <button
                  onClick={() => onDeleteReview(rev.id)}
                  className="absolute right-3 top-3 p-1 bg-white hover:bg-red-50 border border-gray-150 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold tracking-wider text-white px-2.5 py-0.5 rounded-full uppercase ${
                    rev.sentiment === "Avoid" || rev.sentiment === "Overrated" ? "bg-brand-accent-red" : "bg-brand-accent-green"
                  }`}>
                    {rev.sentiment}
                  </span>
                  <span className="text-[10px] bg-white border border-gray-150 px-2.5 py-0.5 rounded-full font-mono text-gray-500">
                    {rev.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="font-display font-bold text-sm text-gray-850">
                    {rev.spotName}
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span>Rating: <strong className="text-brand-secondary">★ {rev.rating}/5</strong></span>
                  <span>{rev.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
            <MessageSquareCode className="w-8 h-8 text-gray-200" />
            <p>Write local reviews to share your travel wisdom with others.</p>
          </div>
        )}
      </div>
    </div>
  );
}
