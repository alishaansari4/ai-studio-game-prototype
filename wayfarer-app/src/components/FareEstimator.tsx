import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  ShieldAlert, 
  Car, 
  Bus, 
  Check, 
  AlertCircle, 
  X,
  Clock,
  ExternalLink
} from "lucide-react";
import { TransportOption, TravelSpot } from "../types";

interface FareEstimatorProps {
  location: string;
  spots: TravelSpot[];
  scams: string[];
  transportOptions: TransportOption[];
  totalDistance: string;
  trafficStatus: "Low" | "Moderate" | "Heavy";
  mapUrl: string;
}

export default function FareEstimator({
  location,
  spots,
  scams,
  transportOptions,
  totalDistance: defaultDistance,
  trafficStatus: defaultTraffic,
  mapUrl,
}: FareEstimatorProps) {
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // Interactive updated states when a destination is selected
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [distance, setDistance] = useState<string>(defaultDistance);
  const [traffic, setTraffic] = useState<string>(defaultTraffic);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [activeBusSchedule, setActiveBusSchedule] = useState<boolean>(false);

  // Suggestions derived from spots in current vibe
  const suggestions = spots.map(s => s.name);

  const handleSelectSuggestion = (name: string) => {
    setSelectedDestination(name);
    setDestinationInput(name);
    setShowSuggestions(false);

    // Dynamic calculations based on matching spots to make it feel super alive!
    const matchedSpot = spots.find(s => s.name === name);
    if (matchedSpot) {
      setDistance(matchedSpot.distance);
      // Give a random traffic status for variation
      const trafficStatuses = ["Low", "Moderate", "Heavy"];
      setTraffic(trafficStatuses[Math.floor(Math.random() * trafficStatuses.length)]);
    }
  };

  const handleSwap = () => {
    if (selectedDestination) {
      // Toggle
      setDestinationInput("Current Position");
      setSelectedDestination("");
      setDistance(defaultDistance);
    }
  };

  const handleBookTaxi = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
    }, 1500);
  };

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      {/* Intro Header */}
      <div className="text-left space-y-1.5">
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-gray-900">
          Transport Fare Estimator
        </h2>
        <p className="text-sm text-gray-500 leading-normal">
          Get transparent, peer-reviewed local transport costs and route details in {location}.
        </p>
      </div>

      {/* Inputs block */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm relative space-y-4">
        {/* From Field */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            From
          </label>
          <div className="relative flex items-center">
            <Navigation className="absolute left-3.5 w-4 h-4 text-brand-primary-container" />
            <input
              type="text"
              readOnly
              value={`Current Position: ${location}`}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-sans font-medium text-gray-700 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Swap Button visual decoration */}
        <div className="flex justify-center -my-6 relative z-10">
          <button 
            onClick={handleSwap}
            className="bg-brand-primary text-white p-2.5 rounded-full shadow-md hover:bg-brand-primary-container active:scale-90 transition-all cursor-pointer"
            aria-label="Swap Locations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* To Field */}
        <div className="relative">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destination..."
              value={destinationInput}
              onChange={(e) => {
                setDestinationInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl pl-11 pr-4 py-3 text-sm font-sans font-medium text-gray-850 transition-all outline-none"
            />
            {destinationInput && (
              <button
                onClick={() => {
                  setDestinationInput("");
                  setSelectedDestination("");
                  setDistance(defaultDistance);
                }}
                className="absolute right-3 top-3 bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-gray-500 transition-colors"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto"
              >
                {suggestions
                  .filter(name => name.toLowerCase().includes(destinationInput.toLowerCase()))
                  .map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(name)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center border-b border-gray-100/50 text-sm font-sans font-medium text-gray-700 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                      <span>{name}</span>
                    </button>
                  ))}
                {suggestions.filter(name => name.toLowerCase().includes(destinationInput.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No matching tourist hotspots found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Don't Get Scammed Alert Box */}
      <div className="bg-brand-secondary text-white rounded-2xl p-5 border border-brand-secondary/20 flex items-start gap-3.5 shadow-md">
        <ShieldAlert className="w-8 h-8 text-white shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-display font-bold text-base">Don't Get Scammed</h4>
          <ul className="text-xs sm:text-sm font-sans space-y-1.5 opacity-90 list-disc list-inside">
            {scams.map((scam, idx) => (
              <li key={idx}>{scam}</li>
            ))}
            <li>Decline persistent touts claiming your resort is fully booked.</li>
          </ul>
        </div>
      </div>

      {/* Transits Bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Auto Rickshaw Card */}
        <div className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-blue-50 p-3 rounded-xl text-brand-primary">
              <Car className="w-6 h-6" />
            </div>
            <span className="bg-brand-secondary text-white text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full">
              POPULAR
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-gray-800 mb-1">
            Auto Rickshaw
          </h3>
          <div className="flex items-center gap-1">
            <span className="font-mono text-2xl font-bold text-brand-primary">
              ₹60 - ₹80
            </span>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-2">
            Estimated 15 mins • Point-to-Point
          </p>
        </div>

        {/* Local Bus Card */}
        <div className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gray-50 p-3 rounded-xl text-gray-600">
              <Bus className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-display font-bold text-base text-gray-800 mb-1">
            Local Bus
          </h3>
          <div className="flex items-center gap-1">
            <span className="font-mono text-2xl font-bold text-gray-800">
              ₹15
            </span>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-2">
            Route 4A • Every 20 mins from stand
          </p>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button 
              onClick={() => setActiveBusSchedule(true)}
              className="text-brand-primary hover:text-brand-primary-container text-xs font-mono font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Schedule</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Taxi Cab Card */}
        <div className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-50 p-3 rounded-xl text-gray-600">
                <Car className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="font-display font-bold text-base text-gray-800 mb-1">
              Cab / Taxi
            </h3>
            <div className="flex items-center gap-1">
              <span className="font-mono text-2xl font-bold text-gray-800">
                ₹150 - ₹200
              </span>
            </div>
            <p className="text-xs text-gray-500 font-sans mt-2 leading-snug">
              Comfort • On-demand • Air-conditioned
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleBookTaxi}
              disabled={isBooking}
              className={`w-full py-2.5 rounded-xl font-display text-xs font-semibold tracking-wide transition-all ${
                isBooking
                  ? "bg-gray-150 text-gray-400 cursor-not-allowed"
                  : "bg-brand-primary text-white hover:bg-brand-primary-container active:scale-95 cursor-pointer"
              }`}
            >
              {isBooking ? "Booking..." : "Book Taxi"}
            </button>
          </div>
        </div>
      </div>

      {/* Map visual section */}
      <section className="rounded-2xl overflow-hidden h-64 relative border border-gray-200 shadow-md group">
        <img
          src={mapUrl}
          alt="Map of Rishikesh"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-[1000ms] ease-out"
        />
        {/* Card Overlay over map */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl flex items-center justify-between w-full shadow-lg border border-white/25">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Total Distance</span>
              <span className="font-display font-extrabold text-lg text-gray-900 font-mono">{distance}</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Traffic Status</span>
              <span className="font-display font-bold text-sm text-brand-primary-container flex items-center gap-1.5 font-mono">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  traffic === "Low" ? "bg-brand-accent-green" : traffic === "Moderate" ? "bg-yellow-500" : "bg-brand-accent-red"
                }`}></span>
                {traffic}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Schedule Drawer */}
      <AnimatePresence>
        {activeBusSchedule && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setActiveBusSchedule(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="font-display font-extrabold text-lg text-gray-900">
                  Route 4A Bus Schedule
                </h4>
                <button
                  onClick={() => setActiveBusSchedule(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  aria-label="Close Schedule"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Operating times connecting central Rishikesh stations to waterfalls and temples.
              </p>
              <div className="space-y-2 font-mono text-xs text-gray-700">
                <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                  <span>07:30 AM</span>
                  <span className="text-brand-accent-green font-semibold">On Time</span>
                </div>
                <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                  <span>09:15 AM</span>
                  <span className="text-brand-accent-green font-semibold">On Time</span>
                </div>
                <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                  <span>11:00 AM</span>
                  <span className="text-brand-accent-green font-semibold">On Time</span>
                </div>
                <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                  <span>01:30 PM</span>
                  <span className="text-yellow-600 font-semibold">Delayed (5 min)</span>
                </div>
                <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                  <span>03:45 PM</span>
                  <span className="text-brand-accent-green font-semibold">On Time</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Checkout Success Dialog */}
      <AnimatePresence>
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setBookingSuccess(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative z-10 text-center space-y-4"
            >
              <div className="mx-auto w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-brand-accent-green">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-lg text-gray-900">
                  Taxi Request Confirmed
                </h4>
                <p className="text-xs text-gray-500 leading-normal px-2">
                  Your local taxi dispatch order has been sent. Your driver will arrive shortly with verified meter-pricing.
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vibe Region</span>
                  <span className="font-semibold text-gray-700">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fares estimate</span>
                  <span className="font-semibold text-brand-primary">₹150 - ₹200</span>
                </div>
              </div>
              <button
                onClick={() => setBookingSuccess(false)}
                className="w-full bg-brand-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-primary-container transition-colors cursor-pointer"
              >
                Awesome
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
