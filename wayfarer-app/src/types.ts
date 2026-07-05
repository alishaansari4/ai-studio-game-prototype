export interface TravelSpot {
  id: string;
  name: string;
  tag: "Must-Visit" | "Overrated" | "Hidden Gem" | "Avoid";
  priceLevel: string;
  distance: string;
  category: "Food" | "Stays" | "Attractions" | "Hiking";
  matrix: "Affordable Gems" | "Premium Luxury" | "Avoid";
  imageUrl: string;
  description: string;
}

export interface TransportOption {
  type: string;
  icon: string;
  costRange: string;
  duration: string;
  details: string;
  isPopular?: boolean;
}

export interface TravelData {
  location: string;
  highlights: string;
  spots: TravelSpot[];
  scams: string[];
  transportOptions: TransportOption[];
  mapUrl: string;
  totalDistance: string;
  trafficStatus: "Low" | "Moderate" | "Heavy";
}

export interface RealTalkReview {
  id: string;
  spotName: string;
  category: "Food" | "Stays" | "Attractions" | "Hiking";
  sentiment: "Must-Visit" | "Overrated" | "Avoid";
  comment: string;
  rating: number;
  userName: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  preferredTransport: string;
  currency: string;
  budgetLevel: "Budget" | "Premium" | "Luxury";
  savedSpots: string[]; // list of spot ids
}
