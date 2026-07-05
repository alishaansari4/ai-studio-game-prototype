import React, { useState } from "react";
import { X, Star, AlertCircle, Sparkles } from "lucide-react";
import { RealTalkReview } from "../types";

interface AddReviewDialogProps {
  onClose: () => void;
  onSubmit: (review: Omit<RealTalkReview, "id" | "createdAt">) => void;
  currentSpots: string[];
}

export default function AddReviewDialog({ onClose, onSubmit, currentSpots }: AddReviewDialogProps) {
  const [spotName, setSpotName] = useState<string>("");
  const [customSpotName, setCustomSpotName] = useState<string>("");
  const [category, setCategory] = useState<"Food" | "Stays" | "Attractions" | "Hiking">("Food");
  const [sentiment, setSentiment] = useState<"Must-Visit" | "Overrated" | "Avoid">("Must-Visit");
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [isCustomSpot, setIsCustomSpot] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpotName = isCustomSpot ? customSpotName.trim() : spotName;

    if (!finalSpotName) {
      setError("Please specify a place or spot name.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write some feedback comment.");
      return;
    }

    onSubmit({
      spotName: finalSpotName,
      category,
      sentiment,
      comment: comment.trim(),
      rating,
      userName: "Alisha Ansari",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Title */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-brand-secondary" />
            <h4 className="font-display font-extrabold text-lg text-gray-900">
              Submit Real Talk Review
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

        {error && (
          <div className="bg-red-50 text-brand-accent-red border border-red-100 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans text-gray-700">
          {/* Spot Selector / Input Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide">Place Name</label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomSpot(!isCustomSpot);
                  setError("");
                }}
                className="text-xs text-brand-primary font-semibold hover:underline"
              >
                {isCustomSpot ? "Choose from current spots" : "Write a new spot"}
              </button>
            </div>

            {isCustomSpot ? (
              <input
                type="text"
                placeholder="E.g., Local Chai Stand"
                value={customSpotName}
                onChange={(e) => setCustomSpotName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary rounded-xl p-3 outline-none transition-all text-sm font-medium"
              />
            ) : (
              <select
                value={spotName}
                onChange={(e) => setSpotName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary rounded-xl p-3 outline-none transition-all text-sm font-medium"
              >
                <option value="">-- Select a local spot --</option>
                {currentSpots.map((spot, idx) => (
                  <option key={idx} value={spot}>{spot}</option>
                ))}
              </select>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide">Category</label>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {["Food", "Stays", "Attractions", "Hiking"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as any)}
                  className={`py-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                    category === cat
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide">Your Vibe Tag</label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { name: "Must-Visit", color: "bg-brand-accent-green" },
                { name: "Overrated", color: "bg-brand-accent-red" },
                { name: "Avoid", color: "bg-brand-accent-red" },
              ].map((sent) => (
                <button
                  key={sent.name}
                  type="button"
                  onClick={() => setSentiment(sent.name as any)}
                  className={`py-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                    sentiment === sent.name
                      ? `${sent.color} border-transparent text-white`
                      : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {sent.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Scale */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide">Rating Scale</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform cursor-pointer"
                  aria-label={`${star} Star`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-brand-secondary fill-brand-secondary"
                        : "text-gray-250"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Feedback Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wide">Commentary</label>
            <textarea
              placeholder="Give transparent details, scam alert details, or cost savings tips here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary rounded-xl p-3 outline-none transition-all text-sm font-sans font-medium resize-none leading-relaxed"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-250 text-gray-700 py-3 rounded-xl font-semibold hover:opacity-90 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-primary-container transition-colors cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
