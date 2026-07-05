import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Gemini client to prevent crashes if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Fixed static image assets matching the mockup exactly for Rishikesh, India
const RISHIKESH_STATIC_DATA = {
  location: "Rishikesh, India",
  highlights: "Get accurate travel costs for local transport in Rishikesh.",
  spots: [
    {
      id: "rishi-spot-1",
      name: "Ganga View Cafe",
      tag: "Must-Visit",
      priceLevel: "$",
      distance: "0.4 km away",
      category: "Food",
      matrix: "Affordable Gems",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDns0YqjUuxQyyesmDOE4UJWGdlyWsCW2dauxPRb7Oeb83o2WVyEVr60TOzvO-hJU5OnsFgH8U_9w28bVGamzbWKY6GljFJElqBlG5J0jSuLz1U_T2j6seHukcXhMYTIVBl9kHgNJzrA85gSAjBoirmNX1EhzayVr1L7P0qtoXf8moGm9Y34KQjoHVcshCpdPIfBMSQxe5xGn3OeQKTGUJD8OIQpRZlz8vSmU-rBlduhvofQgZCYnnK7w",
      description: "A sun-drenched, rustic outdoor cafe overlooking the wide turquoise Ganga river in Rishikesh. The scene is filled with low wooden tables, colorful floor cushions, and travelers enjoying organic food. The lighting is warm golden hour sunlight, creating a serene and adventurous atmosphere."
    },
    {
      id: "rishi-spot-2",
      name: "The Beatles Ashram",
      tag: "Must-Visit",
      priceLevel: "$",
      distance: "1.2 km away",
      category: "Attractions",
      matrix: "Affordable Gems",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA357sE2d0wR6nKVH911Lv8jbG3IKY80hfXHwsYUi2TG3Qg7LHV0lOlGltVQFrZNQduVgvmRAUvxlBtUu1Yn8haBKAT-Ioh4QbZutur18tL76OKQbeqoUrJoRL1Y1cmCw6G5siakmDTspr1WJZ83V773Nz-o9yrFzI8d6OjB-XM0R5nXLBNiaRgr4nUyGk7Sd-1doSVM3uDgtrtWQEchMwZ0YUOLOcLGUCtc49_rQtrfDzpuo_8D2qb7g",
      description: "The iconic Beatles Ashram in Rishikesh, featuring weathered stone meditation huts overgrown with lush green jungle vines. Intricate graffiti and murals of spiritual symbols adorn the walls. The mood is mysterious and nostalgic."
    },
    {
      id: "rishi-spot-3",
      name: "Neer Garh Waterfall",
      tag: "Must-Visit",
      priceLevel: "$",
      distance: "3.8 km away",
      category: "Hiking",
      matrix: "Affordable Gems",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZiYv_omuUM8V3tjZ5ng0yr0D0MaqzitUPdsfVyY6Aut1tNZaF-XNDVHaLeV9Scz8m4juT8mf0BPwDtw3KkuandorAm8BqJzxxzUpS2uFT0lMg_suCzfdJtwHBw2QPL_IhEBG0VoUmh5leg3jmzFqKfjTcgkmqvbEOB5DCYKoZ2R0QbQs3qC3U2YCCdTJN20BGQ-TYr-VfddsZXIlh9bKkCZxByh-LYUKWJfkW7RmJVrSNwRuERk2fVQ",
      description: "A hidden multi-tiered waterfall cascading into a crystal clear emerald green natural pool in a tropical forest near Rishikesh. Small wooden bridges and rocky paths lead to the water."
    },
    {
      id: "rishi-spot-4",
      name: "Laxman Jhula Market",
      tag: "Overrated",
      priceLevel: "$",
      distance: "0.2 km away",
      category: "Food",
      matrix: "Avoid",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGiFqgGsxTa3i_LWMsW5QSzpdWKsbTWQwx_ZrvN8vDTKGeMpV4zpzxmWD5HG7aZHi1hR_z6DcXD4xLaifz7t17NDUHg43FYCTs-18Hu-a6TMv_cixOIv8SvtIFsna4MQsDspAhSm2U69yFW-b428HhLFM4Em5o3IXIsA-1-jzgJYhXZGBQZOBzToLI1aozGzVsbU7a-1ra9UDW5T6ErD4hi_6DoP36gcPouhtCacLsiCLfbRZCM6YPqg",
      description: "A bustling night market street in Rishikesh, lined with colorful stalls selling street food like chaat and lassi. The scene is lit by vibrant overhead fairy lights and neon signs. It is crowded with locals and backpackers."
    },
    {
      id: "rishi-spot-5",
      name: "Aloha On The Ganges Resort",
      tag: "Hidden Gem",
      priceLevel: "$$$",
      distance: "2.1 km away",
      category: "Stays",
      matrix: "Premium Luxury",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60",
      description: "A gorgeous riverside luxury wellness resort offering infinity pools overlooking the mountains, top-tier organic spas, and peaceful meditation sessions."
    },
    {
      id: "rishi-spot-6",
      name: "Laxman Jhula Suspension Bridge",
      tag: "Must-Visit",
      priceLevel: "$",
      distance: "0.1 km away",
      category: "Attractions",
      matrix: "Affordable Gems",
      imageUrl: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?w=800&auto=format&fit=crop&q=60",
      description: "An iconic iron suspension bridge crossing the Ganges. Full of dynamic views of rafting boats, sacred temples, and playful local monkeys."
    },
    {
      id: "rishi-spot-7",
      name: "Triveni Ghat Evening Aarti",
      tag: "Must-Visit",
      priceLevel: "$",
      distance: "4.5 km away",
      category: "Attractions",
      matrix: "Affordable Gems",
      imageUrl: "https://images.unsplash.com/photo-1561361531-99522c36d3af?w=800&auto=format&fit=crop&q=60",
      description: "A beautiful spiritual ceremony on the banks of the Ganges where hundreds of oil lamps are floated into the river amidst devotional chants."
    },
    {
      id: "rishi-spot-8",
      name: "Kunjapuri Sunrise Trek",
      tag: "Hidden Gem",
      priceLevel: "$$",
      distance: "12 km away",
      category: "Hiking",
      matrix: "Affordable Gems",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
      description: "A gorgeous peak rising 1,675m high, offering panoramic sunrise views of the snow-capped Himalayan range and the Rishikesh valley."
    },
    {
      id: "rishi-spot-9",
      name: "Ananda in the Himalayas",
      tag: "Must-Visit",
      priceLevel: "$$$",
      distance: "8.2 km away",
      category: "Stays",
      matrix: "Premium Luxury",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60",
      description: "A multi-award-winning destination spa resort located in the Maharaja's Palace estate. Absolute peak of luxury wellness and ayurveda."
    }
  ],
  scams: [
    "Always ask to turn on the meter in cabs.",
    "Negotiate the auto fare before starting the ride."
  ],
  transportOptions: [
    {
      type: "Auto Rickshaw",
      icon: "directions_car",
      costRange: "₹60 - ₹80",
      duration: "Estimated 15 mins",
      details: "Point-to-Point",
      isPopular: true
    },
    {
      type: "Local Bus",
      icon: "directions_bus",
      costRange: "₹15",
      duration: "Route 4A",
      details: "Every 20 mins from stand"
    },
    {
      type: "Cab / Taxi",
      icon: "local_taxi",
      costRange: "₹150 - ₹200",
      duration: "Comfort",
      details: "On-demand • Air-conditioned"
    }
  ],
  mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcxtFNjVYrtyMCm3LV1u-pgUmXLqIcEo3t1Ux1i30HVQWW2HlEY2xgJ7-MpqfgANhu_ePoyd78fWVn6-bldT2d2BsVMwcpoMtKlWZT5ujLcdPBSCDPssGrGKgje0DUJZjt06UvXzC9JZVd1MRnS_3hqnOWWI7r8rM5J07iTupxVY7F8OwpnPMAyGYGJ52lCKrNPy4kAVRIu08LU_dE3nlkUEpr7wCj4KWhx3NbQB_eNzPHzSnc6h2jfA",
  totalDistance: "4.8 km",
  trafficStatus: "Low" as const
};

// Fallback high-quality stock imagery for travel categories
const CATEGORY_FALLBACK_IMAGES = {
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
  Stays: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
  Attractions: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=60",
  Hiking: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60"
};

// API Route to fetch travel details dynamically via Gemini (or static fallback)
app.post("/api/vibe", async (req, res) => {
  const { location = "Rishikesh, India" } = req.body;

  // Clean the location query for robust matching
  const cleanedLoc = location.toLowerCase().trim();

  // Return static mockup data if user requests Rishikesh
  if (cleanedLoc.includes("rishikesh")) {
    return res.json(RISHIKESH_STATIC_DATA);
  }

  const ai = getGeminiClient();

  if (!ai) {
    // If no API key is set, return a dynamic fallback mockup based on the location
    console.log("No GEMINI_API_KEY found, using structured fallback generator.");
    return res.json({
      location,
      highlights: `Get accurate travel costs for local transport in ${location}.`,
      spots: [
        {
          id: "dyn-spot-1",
          name: `${location} Central Market`,
          tag: "Must-Visit",
          priceLevel: "$$",
          distance: "0.8 km away",
          category: "Food",
          matrix: "Affordable Gems",
          imageUrl: CATEGORY_FALLBACK_IMAGES.Food,
          description: `A lively and colorful market in ${location}, offering street eats, local spices, and dynamic shopping experiences.`
        },
        {
          id: "dyn-spot-2",
          name: `${location} Grand Hotel`,
          tag: "Hidden Gem",
          priceLevel: "$$$",
          distance: "2.5 km away",
          category: "Stays",
          matrix: "Premium Luxury",
          imageUrl: CATEGORY_FALLBACK_IMAGES.Stays,
          description: `A elegant boutique hotel with stunning panoramic views, premium spas, and excellent customer ratings.`
        },
        {
          id: "dyn-spot-3",
          name: `${location} Scenic Overlook`,
          tag: "Must-Visit",
          priceLevel: "$",
          distance: "4.2 km away",
          category: "Hiking",
          matrix: "Affordable Gems",
          imageUrl: CATEGORY_FALLBACK_IMAGES.Hiking,
          description: `An spectacular trail leading to a vantage point that overlooks the entire region of ${location}.`
        }
      ],
      scams: [
        "Be careful with taxi drivers claiming meters are broken.",
        "Always confirm prices before accepting street tours."
      ],
      transportOptions: [
        {
          type: "Local Cab",
          icon: "local_taxi",
          costRange: "€15 - €25",
          duration: "Estimated 20 mins",
          details: "On-demand • Air-conditioned",
          isPopular: true
        },
        {
          type: "Public Bus",
          icon: "directions_bus",
          costRange: "€2.50",
          duration: "Every 15 mins",
          details: "Main routes connecting central stations"
        }
      ],
      mapUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60",
      totalDistance: "6.2 km",
      trafficStatus: "Moderate"
    });
  }

  try {
    const prompt = `
      You are an expert location travel assistant for "Wayfarer".
      Generate detailed points of interest, tourist anti-scam advice, local transit estimates, and distances for: "${location}".
      
      Generate EXACTLY:
      1. Normalized location name (e.g. "Paris, France" or "Tokyo, Japan").
      2. Highlights context paragraph about local transport.
      3. At least 6-8 spots covering different categories ('Food', 'Stays', 'Attractions', 'Hiking') and budgets/matrices ('Affordable Gems', 'Premium Luxury', 'Avoid'). Ensure you mark 1 or 2 high-crowd tourist trap spots with the 'Avoid' matrix and 'Overrated' tag!
      4. Dynamic transport options (like Auto Rickshaw, Cab, Local Bus, Subway, Metro, train, etc.) with approximate cost ranges in the local currency.
      5. Scam prevention guidelines specific to transit and sightseeing in this city.
      6. Total typical travel distance across landmarks, and traffic status ('Low', 'Moderate', or 'Heavy').
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
            highlights: { type: Type.STRING },
            spots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  tag: { type: Type.STRING, description: "Must-Visit, Overrated, Hidden Gem, or Avoid" },
                  priceLevel: { type: Type.STRING, description: "$, $$, or $$$" },
                  distance: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Food, Stays, Attractions, or Hiking" },
                  matrix: { type: Type.STRING, description: "Affordable Gems, Premium Luxury, or Avoid" },
                  description: { type: Type.STRING }
                },
                required: ["id", "name", "tag", "priceLevel", "distance", "category", "matrix", "description"]
              }
            },
            scams: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            transportOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "directions_car, directions_bus, local_taxi, subways, train, etc." },
                  costRange: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  details: { type: Type.STRING },
                  isPopular: { type: Type.BOOLEAN }
                },
                required: ["type", "icon", "costRange", "duration", "details"]
              }
            },
            totalDistance: { type: Type.STRING },
            trafficStatus: { type: Type.STRING, description: "Low, Moderate, or Heavy" }
          },
          required: ["location", "highlights", "spots", "scams", "transportOptions", "totalDistance", "trafficStatus"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Populate images dynamically based on category fallbacks so the design looks super clean
    if (parsedData.spots) {
      parsedData.spots = parsedData.spots.map((spot: any) => {
        const cat = spot.category as keyof typeof CATEGORY_FALLBACK_IMAGES;
        const fallback = CATEGORY_FALLBACK_IMAGES[cat] || CATEGORY_FALLBACK_IMAGES.Attractions;
        return {
          ...spot,
          imageUrl: fallback
        };
      });
    }

    parsedData.mapUrl = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=60";

    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini invocation failed:", error);
    res.status(500).json({ error: "Failed to generate dynamic vibe guides using Gemini. Try Rishikesh!" });
  }
});

// Setup Vite Dev Server / Static files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
