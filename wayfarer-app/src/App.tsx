import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Calculator, 
  User, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import TopAppBar from "./components/TopAppBar";
import HomeFeed from "./components/HomeFeed";
import FareEstimator from "./components/FareEstimator";
import UserProfileTab from "./components/UserProfileTab";
import AddReviewDialog from "./components/AddReviewDialog";
import ChangeLocationDialog from "./components/ChangeLocationDialog";
import { TravelSpot, TransportOption, RealTalkReview } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"Home" | "Calculator" | "Profile">("Home");
  const [location, setLocation] = useState<string>("Rishikesh, India");
  const [spots, setSpots] = useState<TravelSpot[]>([]);
  const [scams, setScams] = useState<string[]>([]);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [mapUrl, setMapUrl] = useState<string>("");
  const [totalDistance, setTotalDistance] = useState<string>("4.8 km");
  const [trafficStatus, setTrafficStatus] = useState<"Low" | "Moderate" | "Heavy">("Low");

  // Local state for favorited bookmarks and custom reviews
  const [savedSpots, setSavedSpots] = useState<string[]>(["rishi-spot-1"]);
  const [reviews, setReviews] = useState<RealTalkReview[]>([
    {
      id: "rev-1",
      spotName: "Ganga View Cafe",
      category: "Food",
      sentiment: "Must-Visit",
      comment: "Absolutely incredible sunset views! Sit on the low floor pillows, order a lemon honey ginger tea, and listen to the holy river flow by. Fair price too!",
      rating: 5,
      userName: "Alisha Ansari",
      createdAt: "July 2, 2026",
    },
    {
      id: "rev-2",
      spotName: "Laxman Jhula Market",
      category: "Food",
      sentiment: "Avoid",
      comment: "Very crowded tourist trap at night. People will try to sell over-priced lassis. Keep moving or buy lassi elsewhere!",
      rating: 2,
      userName: "Alisha Ansari",
      createdAt: "July 1, 2026",
    }
  ]);

  // Dialog & Loading UI states
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch Vibe Data from API (uses local fallback if server error)
  const fetchVibeData = async (targetLoc: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/vibe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: targetLoc }),
      });

      if (!response.ok) {
        throw new Error("Failed to load local guide.");
      }

      const data = await response.json();
      setLocation(data.location || targetLoc);
      setSpots(data.spots || []);
      setScams(data.scams || []);
      setTransportOptions(data.transportOptions || []);
      setMapUrl(data.mapUrl || "");
      setTotalDistance(data.totalDistance || "4.8 km");
      setTrafficStatus(data.trafficStatus || "Low");
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to dynamic Gemini Travel service. Using static fallback.");
      // Soft fall-back directly to predefined Rishikesh if query contains Rishikesh
      if (targetLoc.toLowerCase().includes("rishikesh")) {
        setLocation("Rishikesh, India");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // On mount, load default vibe (Rishikesh, India)
  useEffect(() => {
    fetchVibeData("Rishikesh, India");
  }, []);

  const handleToggleFavorite = (spotId: string) => {
    setSavedSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  const handleAddReview = (newReview: Omit<RealTalkReview, "id" | "createdAt">) => {
    const freshReview: RealTalkReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
    setReviews((prev) => [freshReview, ...prev]);
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((rev) => rev.id !== id));
  };

  return (
    <div className="bg-gray-50/50 text-gray-800 min-h-screen pb-32 font-sans selection:bg-blue-100 selection:text-brand-primary">
      {/* Top App Navigation Bar */}
      <TopAppBar 
        currentLocation={location} 
        onOpenSelector={() => setIsLocationOpen(true)} 
      />

      {/* Main Content Pane */}
      <main className="pt-24 px-5 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center space-y-4"
            >
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
              <div className="space-y-1">
                <p className="font-display font-semibold text-gray-700 text-sm">
                  Fetching Location Vibes...
                </p>
                <p className="text-xs text-gray-400">
                  Loading transit grids and recommendations for {location}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <div className="mb-6 bg-yellow-50 border border-yellow-100 text-yellow-700 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-yellow-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Render Selected View */}
              {activeTab === "Home" && (
                <HomeFeed
                  location={location}
                  spots={spots}
                  savedSpots={savedSpots}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenSelector={() => setIsLocationOpen(true)}
                  onOpenAddReview={() => setIsAddReviewOpen(true)}
                />
              )}

              {activeTab === "Calculator" && (
                <FareEstimator
                  location={location}
                  spots={spots}
                  scams={scams}
                  transportOptions={transportOptions}
                  totalDistance={totalDistance}
                  trafficStatus={trafficStatus}
                  mapUrl={mapUrl}
                />
              )}

              {activeTab === "Profile" && (
                <UserProfileTab
                  spots={spots}
                  savedSpots={savedSpots}
                  reviews={reviews}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteReview={handleDeleteReview}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation Tab bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 border-t border-gray-150 backdrop-blur-md rounded-t-3xl shadow-2xl max-w-xl mx-auto left-1/2 -translate-x-1/2">
        {/* Explore/Home Tab button */}
        <button
          onClick={() => setActiveTab("Home")}
          className={`flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === "Home"
              ? "bg-blue-50/60 border border-blue-100/50 text-brand-primary rounded-2xl px-6"
              : "text-gray-500 hover:text-gray-900 px-4"
          }`}
        >
          <Compass className={`w-5.5 h-5.5 ${activeTab === "Home" ? "scale-105" : ""}`} />
          <span className="text-[10px] font-mono font-bold mt-1 tracking-wide">Home</span>
        </button>

        {/* Transport Calculator Tab button */}
        <button
          onClick={() => setActiveTab("Calculator")}
          className={`flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === "Calculator"
              ? "bg-blue-50/60 border border-blue-100/50 text-brand-primary rounded-2xl px-6"
              : "text-gray-500 hover:text-gray-900 px-4"
          }`}
        >
          <Calculator className={`w-5.5 h-5.5 ${activeTab === "Calculator" ? "scale-105" : ""}`} />
          <span className="text-[10px] font-mono font-bold mt-1 tracking-wide">Calculator</span>
        </button>

        {/* User Profile Tab button */}
        <button
          onClick={() => setActiveTab("Profile")}
          className={`flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === "Profile"
              ? "bg-blue-50/60 border border-blue-100/50 text-brand-primary rounded-2xl px-6"
              : "text-gray-500 hover:text-gray-900 px-4"
          }`}
        >
          <User className={`w-5.5 h-5.5 ${activeTab === "Profile" ? "scale-105" : ""}`} />
          <span className="text-[10px] font-mono font-bold mt-1 tracking-wide">Profile</span>
        </button>
      </nav>

      {/* Dialog: Set Location */}
      <AnimatePresence>
        {isLocationOpen && (
          <ChangeLocationDialog
            currentLocation={location}
            onClose={() => setIsLocationOpen(false)}
            onSubmit={(target) => fetchVibeData(target)}
          />
        )}
      </AnimatePresence>

      {/* Dialog: Create/Add Review */}
      <AnimatePresence>
        {isAddReviewOpen && (
          <AddReviewDialog
            currentSpots={spots.map((s) => s.name)}
            onClose={() => setIsAddReviewOpen(false)}
            onSubmit={handleToggleFavorite && handleAddReview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
