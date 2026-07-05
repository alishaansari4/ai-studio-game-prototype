import React, { useState } from "react";
import { X, Search, Compass, Sparkles } from "lucide-react";

interface ChangeLocationDialogProps {
  onClose: () => void;
  onSubmit: (location: string) => void;
  currentLocation: string;
}

export default function ChangeLocationDialog({
  onClose,
  onSubmit,
  currentLocation,
}: ChangeLocationDialogProps) {
  const [searchInput, setSearchInput] = useState<string>("");

  const popularDestinations = [
    "Rishikesh, India",
    "Goa, India",
    "Paris, France",
    "Tokyo, Japan",
    "Jaipur, India",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSubmit(searchInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative z-10 space-y-4 border border-gray-100 text-sm">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-brand-primary-container animate-spin-slow" />
            <h4 className="font-display font-extrabold text-lg text-gray-900">
              Set Travel Vibe
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors cursor-pointer"
            aria-label="Close Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-normal">
          Type any city or region globally to load curated spots, scam prevention guides, and local transit estimates.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search city, country..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary rounded-xl pl-11 pr-4 py-3 outline-none transition-all font-sans font-medium text-gray-800"
              autoFocus
            />
          </div>

          {/* Quick recommendations suggestions */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-secondary" />
              <span>Popular Destinations</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSubmit(dest);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
                    currentLocation.toLowerCase() === dest.toLowerCase()
                      ? "bg-brand-primary text-white border-transparent"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-50 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!searchInput.trim()}
              className="flex-1 bg-brand-primary disabled:bg-gray-150 disabled:text-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-brand-primary-container transition-all cursor-pointer"
            >
              Explore Vibe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
