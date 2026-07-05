import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Heart, 
  Navigation, 
  Plus, 
  Sparkles, 
  Utensils, 
  Home as Hotel, 
  Compass, 
  Trees, 
  AlertTriangle 
} from "lucide-react";
import { TravelSpot } from "../types";

interface HomeFeedProps {
  location: string;
  spots: TravelSpot[];
  savedSpots: string[];
  onToggleFavorite: (spotId: string) => void;
  onOpenSelector: () => void;
  onOpenAddReview: () => void;
}

export default function HomeFeed({
  location,
  spots,
  savedSpots,
  onToggleFavorite,
  onOpenSelector,
  onOpenAddReview,
}: HomeFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMatrix, setSelectedMatrix] = useState<string>("Affordable Gems");

  // Filter spots by Category & Lens Matrix
  const filteredSpots = spots.filter((spot) => {
    const matchesCategory =
      selectedCategory === "All" || spot.category === selectedCategory;
    const matchesMatrix = spot.matrix === selectedMatrix;
    return matchesCategory && matchesMatrix;
  });

  const categories = [
    { name: "All", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Food", icon: <Utensils className="w-4 h-4" /> },
    { name: "Stays", icon: <Hotel className="w-4 h-4" /> },
    { name: "Attractions", icon: <Compass className="w-4 h-4" /> },
    { name: "Hiking", icon: <Trees className="w-4 h-4" /> },
  ];

  const matrices = ["Affordable Gems", "Premium Luxury", "Avoid"];

  return (
    <section className="space-y-6">
      {/* Location Status Context Bar */}
      <div 
        onClick={onOpenSelector}
        className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 border border-blue-100/60 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
          </div>
          <p className="text-sm font-sans font-medium text-gray-600">
            Current Vibe: <span className="text-gray-900 font-bold font-display">{location}</span>
          </p>
        </div>
        <MapPin className="w-5 h-5 text-brand-primary group-hover:translate-y-[-2px] transition-transform" />
      </div>

      {/* Filter Row */}
      <div className="-mx-5 px-5 overflow-x-auto hide-scrollbar flex gap-2.5 pb-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-brand-primary text-white active-pill-shadow"
                  : "bg-gray-100/85 hover:bg-gray-200/80 text-gray-700"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dual-Lens Matrix Segmented Control */}
      <div className="bg-gray-100/70 p-1.5 rounded-full border border-gray-200/40 flex items-center shadow-inner">
        {matrices.map((matrix) => {
          const isActive = selectedMatrix === matrix;
          let activeStyles = "bg-brand-primary text-white shadow-md";
          
          if (matrix === "Avoid" && isActive) {
            activeStyles = "bg-brand-accent-red text-white shadow-md";
          } else if (matrix === "Premium Luxury" && isActive) {
            activeStyles = "bg-brand-secondary text-white shadow-md";
          }

          return (
            <button
              key={matrix}
              onClick={() => setSelectedMatrix(matrix)}
              className={`flex-1 py-3 px-2 rounded-full text-center transition-all duration-300 font-display text-xs sm:text-sm font-semibold tracking-wide ${
                isActive
                  ? activeStyles
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/40"
              }`}
            >
              {matrix}
            </button>
          );
        })}
      </div>

      {/* Grid of Cards */}
      {filteredSpots.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSpots.map((spot) => {
              const isFavorited = savedSpots.includes(spot.id);
              const isAvoid = spot.tag === "Avoid" || spot.tag === "Overrated";

              return (
                <motion.article
                  key={spot.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/60 transition-all hover:shadow-lg hover:-translate-y-1.5"
                >
                  {/* Spot Image */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 card-gradient-overlay" />

                    {/* Left Tag Overlays */}
                    <div className="absolute top-3.5 left-3.5 flex gap-2">
                      <span
                        className={`text-[11px] font-extrabold tracking-wider text-white px-3 py-1 rounded-full shadow-md ${
                          isAvoid ? "bg-brand-accent-red" : "bg-brand-accent-green"
                        }`}
                      >
                        {spot.tag}
                      </span>
                      <span className="bg-white/90 backdrop-blur-md text-gray-900 px-2.5 py-1 rounded-lg font-mono text-xs font-bold shadow-sm">
                        {spot.priceLevel}
                      </span>
                    </div>

                    {/* Right Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(spot.id);
                      }}
                      className="absolute top-3.5 right-3.5 bg-white/80 hover:bg-white backdrop-blur-md p-2.5 rounded-full shadow-md text-gray-600 hover:text-red-500 transition-all active:scale-90"
                      aria-label="Toggle Favorite"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isFavorited ? "fill-red-500 text-red-500 scale-110" : ""
                        }`}
                      />
                    </button>

                    {/* Text overlays inside bottom of card */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display font-bold text-lg leading-snug drop-shadow-sm group-hover:text-blue-50 transition-colors">
                        {spot.name}
                      </h3>
                      <p className="text-white/85 font-mono text-xs flex items-center gap-1 mt-1 drop-shadow-sm">
                        <Navigation className="w-3 h-3 text-brand-primary-container" />
                        <span>{spot.distance}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body description of setting/vibe */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {spot.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-400">
                      <span>Category: <strong className="text-gray-600">{spot.category}</strong></span>
                      <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{spot.matrix}</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl text-center p-6">
          <AlertTriangle className="w-12 h-12 text-gray-300 mb-3 animate-bounce" />
          <h4 className="font-display font-semibold text-gray-700 text-base">No Spots Listed</h4>
          <p className="text-sm text-gray-500 max-w-sm mt-1 leading-normal">
            No dynamic travel hotspots matched your category filter for {selectedMatrix} in {location}.
          </p>
        </div>
      )}

      {/* Dynamic Floating Action Button for Reviews */}
      <button
        onClick={onOpenAddReview}
        className="fixed right-6 bottom-28 z-40 bg-brand-secondary text-white hover:bg-brand-secondary-container w-14 h-14 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all hover:rotate-90 duration-300 group"
        aria-label="Add Review"
      >
        <Plus className="w-6 h-6" />
      </button>
    </section>
  );
}
