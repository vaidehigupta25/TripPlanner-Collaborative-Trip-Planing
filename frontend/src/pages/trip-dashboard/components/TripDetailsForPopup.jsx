// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

/* -------------------- Helper: Icon -------------------- */
const Icon = ({ name, size = 20, className = "" }) => {
  if (!name) return null;
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const Comp = LucideIcons[capitalized] || LucideIcons[name];
  if (!Comp) return <span style={{ width: size, height: size, display: "inline-block" }} className={`text-red-400 ${className}`}>?</span>;
  return <Comp size={size} className={className} />;
};

/* -------------------- Reusable Button -------------------- */
// Updated to handle children that might be an Icon component
const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const base = "font-semibold py-2 px-4 rounded-xl transition transform disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    accent: "bg-yellow-500 text-black hover:brightness-95",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant] || styles.primary} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

/* -------------------- Modal Wrapper -------------------- */
const ModalWrapper = ({ isOpen, onClose, children, size = "max-w-4xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-3xl shadow-2xl w-full ${size} p-6 max-h-[90vh] overflow-y-auto relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 z-10">
          <Icon name="X" />
        </button>
        {children}
      </motion.div>
    </div>
  );
};


/* -------------------- GOA Data -------------------- */
/* Hotels (mocked). Each hotel has a hotelPrice used for sorting. */
const MOCKED_API_RESPONSE = [
  {
    hotelId: "h1",
    hotelName: "Taj Fort Aguada Resort & Spa",
    hotelCity: "Goa",
    hotelAddress: "Sinquerim, North Goa",
    hotelPrice: 12000,
    image: "/h1.jpg",
    rooms: [
      { roomId: "r11", roomName: "AC Deluxe Room – Near Calangute Beach", type: "AC", price: 12000, availableRooms: 3, image: getRandomUnsplash("ac deluxe room") },
      { roomId: "r12", roomName: "AC Luxury Suite – Sea Facing", type: "AC", price: 20000, availableRooms: 2, image: getRandomUnsplash("suite sea view") },
      { roomId: "r13", roomName: "Non-AC Standard Room – Budget", type: "Non-AC", price: 4500, availableRooms: 4, image: getRandomUnsplash("budget non ac room") },
    ],
    meals: [
      { mealId: "m11", mealName: "Goan Fish Curry (Dinner)", category: "dinner", price: 600, image: getRandomUnsplash("goan fish curry") },
      { mealId: "m12", mealName: "Ros Omelette (Breakfast)", category: "breakfast", price: 250, image: getRandomUnsplash("ros omelette") },
    ],
  },
  {
    hotelId: "h2",
    hotelName: "Grand Hyatt Goa",
    hotelCity: "Goa",
    hotelAddress: "Bambolim Beach",
    hotelPrice: 10000,
    image: "/h2.jpg",
    rooms: [
      { roomId: "r21", roomName: "AC Premium Room – Pool View", type: "AC", price: 10000, availableRooms: 4, image: getRandomUnsplash("pool view room") },
      { roomId: "r22", roomName: "AC Club Suite", type: "AC", price: 18000, availableRooms: 1, image: getRandomUnsplash("club suite") },
      { roomId: "r23", roomName: "Non-AC Family Room – 4 Person", type: "Non-AC", price: 5000, availableRooms: 2, image: getRandomUnsplash("family room") },
    ],
    meals: [
      { mealId: "m21", mealName: "Pork Vindaloo (Dinner)", category: "dinner", price: 800, image: getRandomUnsplash("vindaloo") },
      { mealId: "m22", mealName: "Prawns Lunch Meal", category: "lunch", price: 850, image: getRandomUnsplash("prawns") },
    ],
  },
  {
    hotelId: "h3",
    hotelName: "Planet Hollywood Beach Resort Goa",
    hotelCity: "Goa",
    hotelAddress: "Utorda Beach, South Goa",
    hotelPrice: 9000,
    image: "/h3.jpg",
    rooms: [
      { roomId: "r31", roomName: "AC Studio Room – Panaji City", type: "AC", price: 9000, availableRooms: 5, image: getRandomUnsplash("studio room") },
      { roomId: "r32", roomName: "Non-AC Beach Side Shack Room", type: "Non-AC", price: 3000, availableRooms: 6, image: getRandomUnsplash("beach shack") },
    ],
    meals: [
      { mealId: "m31", mealName: "Goan Bebinca (Dessert)", category: "dessert", price: 300, image: getRandomUnsplash("bebinca") },
      { mealId: "m32", mealName: "Chicken Xacuti (Dinner)", category: "dinner", price: 750, image: getRandomUnsplash("chicken xacuti") },
    ],
  },
  {
    hotelId: "h4",
    hotelName: "W Goa",
    hotelCity: "Goa",
    hotelAddress: "Vagator Beach",
    hotelPrice: 15000,
    image: "/h4.jpg",
    rooms: [
      { roomId: "r41", roomName: "AC Luxury Suite – Sea Facing", type: "AC", price: 25000, availableRooms: 1, image: getRandomUnsplash("w goa suite") },
      { roomId: "r42", roomName: "AC Wonderful Room – Hill View", type: "AC", price: 15000, availableRooms: 4, image: getRandomUnsplash("w goa room") },
    ],
    meals: [
      { mealId: "m41", mealName: "Signature Cocktails & Snacks", category: "packages", price: 1500, image: getRandomUnsplash("cocktails") },
      { mealId: "m42", mealName: "Continental Breakfast (Bread, Eggs, Tea/Coffee)", category: "breakfast", price: 400, image: getRandomUnsplash("continental breakfast") },
    ],
  },
  {
    hotelId: "h5",
    hotelName: "Le Méridien Goa, Calangute",
    hotelCity: "Goa",
    hotelAddress: "Calangute Road",
    hotelPrice: 8500,
    image: "/h5.jpg",
    rooms: [
      { roomId: "r51", roomName: "AC Classic Room", type: "AC", price: 8500, availableRooms: 6, image: getRandomUnsplash("le meridien room") },
      { roomId: "r52", roomName: "AC Family Suite – 4 Beds", type: "AC", price: 13000, availableRooms: 2, image: getRandomUnsplash("family suite") },
      { roomId: "r53", roomName: "Non-AC Standard Room – Budget", type: "Non-AC", price: 3500, availableRooms: 8, image: getRandomUnsplash("budget room calangute") },
    ],
    meals: [
      { mealId: "m51", mealName: "South Indian Breakfast (Idli, Dosa, Upma)", category: "breakfast", price: 350, image: getRandomUnsplash("south indian breakfast") },
    ],
  },
  {
    hotelId: "h6",
    hotelName: "Novotel Goa Resort & Spa",
    hotelCity: "Goa",
    hotelAddress: "Candolim",
    hotelPrice: 7500,
    image: "/h6.jpg",
    rooms: [
      { roomId: "r61", roomName: "AC Premium Room – Pool View", type: "AC", price: 7500, availableRooms: 5, image: getRandomUnsplash("pool view room novotel") },
      { roomId: "r62", roomName: "AC Super Deluxe – Candolim Area", type: "AC", price: 9500, availableRooms: 3, image: getRandomUnsplash("deluxe room novotel") },
    ],
    meals: [
      { mealId: "m61", mealName: "Veg Thali – Goan Style", category: "lunch", price: 450, image: getRandomUnsplash("veg thali goa") },
      { mealId: "m62", mealName: "BBQ Dinner", category: "dinner", price: 1000, image: getRandomUnsplash("bbq dinner") },
    ],
  },
  {
    hotelId: "h7",
    hotelName: "The Zuri White Sands, Goa Resort & Casino",
    hotelCity: "Goa",
    hotelAddress: "Varca Beach, South Goa",
    hotelPrice: 11000,
    image: "/h7.jpg",
    rooms: [
      { roomId: "r71", roomName: "AC Garden View Room", type: "AC", price: 11000, availableRooms: 4, image: getRandomUnsplash("garden view room zuri") },
      { roomId: "r72", roomName: "AC Pool View Suite", type: "AC", price: 16000, availableRooms: 2, image: getRandomUnsplash("pool view suite zuri") },
    ],
    meals: [
      { mealId: "m71", mealName: "Seafood Dinner (Kingfish, Prawns, Squid)", category: "dinner", price: 1100, image: getRandomUnsplash("seafood dinner") },
      { mealId: "m72", mealName: "Goan Bebinca (Dessert)", category: "dessert", price: 300, image: getRandomUnsplash("bebinca") },
    ],
  },
  {
    hotelId: "h8",
    hotelName: "Hard Rock Hotel Goa",
    hotelCity: "Goa",
    hotelAddress: "Calangute-Arpora Road",
    hotelPrice: 6500,
    image: "/h8.jpg",
    rooms: [
      { roomId: "r81", roomName: "AC Deluxe Room", type: "AC", price: 6500, availableRooms: 7, image: getRandomUnsplash("hard rock room") },
      { roomId: "r82", roomName: "Non-AC Basic Room – Baga", type: "Non-AC", price: 2800, availableRooms: 5, image: getRandomUnsplash("basic room baga") },
    ],
    meals: [
      { mealId: "m81", mealName: "All Meals Included (Veg/Non-Veg)", category: "packages", price: 2000, image: getRandomUnsplash("all meals") },
    ],
  },
  {
    hotelId: "h9",
    hotelName: "Fairfield by Marriott Goa Anjuna",
    hotelCity: "Goa",
    hotelAddress: "Near Anjuna Flea Market",
    hotelPrice: 5500,
    image: "/h10.jpg",
    rooms: [
      { roomId: "r91", roomName: "AC Studio Room", type: "AC", price: 5500, availableRooms: 8, image: getRandomUnsplash("studio room anjuna") },
      { roomId: "r92", roomName: "AC Modern Room – Baga Road", type: "AC", price: 6200, availableRooms: 6, image: getRandomUnsplash("modern room anjuna") },
    ],
    meals: [
      { mealId: "m91", mealName: "Continental Breakfast (Bread, Eggs, Tea/Coffee)", category: "breakfast", price: 400, image: getRandomUnsplash("continental breakfast") },
    ],
  },
  {
    hotelId: "h10",
    hotelName: "The St. Regis Goa Resort",
    hotelCity: "Goa",
    hotelAddress: "Cavelossim Beach, South Goa",
    hotelPrice: 22000,
    image: "/h11.jpg",
    rooms: [
      { roomId: "r101", roomName: "AC Premium Villa Room – North Goa", type: "AC", price: 22000, availableRooms: 3, image: getRandomUnsplash("st regis villa") },
      { roomId: "r102", roomName: "AC Luxury Suite – Sea Facing", type: "AC", price: 35000, availableRooms: 1, image: getRandomUnsplash("st regis suite sea") },
    ],
    meals: [
      { mealId: "m101", mealName: "Seafood Unlimited Meals", category: "packages", price: 3000, image: getRandomUnsplash("unlimited seafood") },
    ],
  },
];

/* -------------------- Goa Room Types & Meal Options (lots of data) -------------------- */
// Removed GOA_ROOM_TYPES as it's not used.
const GOA_MEAL_OPTIONS = {
  breakfast: [
    { name: "Breakfast Only", desc: "A simple, light morning meal." },
    { name: "South Indian Breakfast (Idli, Dosa, Upma)", desc: "Authentic South Indian savory items." },
    { name: "Continental Breakfast (Bread, Eggs, Tea/Coffee)", desc: "Western-style toast, eggs, and beverage." },
    { name: "Goan Style Breakfast (Poi, Bhaji, Eggs)", desc: "Local Goan bread (Poi) with curry and eggs." },
    { name: "Healthy Breakfast (Oats, Fruits, Juice)", desc: "Nutritious selection for a healthy start." },
  ],
  lunch: [
    { name: "Lunch Only", desc: "A standard mid-day meal." },
    { name: "Veg Thali – Goan Style", desc: "A platter of local vegetarian curries, rice, and chapatis." },
    { name: "Non-Veg Thali – Fish Curry Rice Combo", desc: "Goa's staple: delicious fish curry, rice, and sides." },
    { name: "Chicken Lunch Combo", desc: "A fulfilling meal focused on a chicken main dish." },
    { name: "Prawns Lunch Meal", desc: "Fresh prawns prepared in a regional style." },
    { name: "North Indian Lunch", desc: "Curry, dal, and roti in the popular North Indian style." },
    { name: "Chinese Lunch Combo", desc: "Noodles or rice with a side of Chinese gravy/manchurian." },
  ],
  dinner: [
    { name: "Dinner Only", desc: "A standard evening meal." },
    { name: "Seafood Dinner (Kingfish, Prawns, Squid)", desc: "Fresh catch of the day, grilled or curried." },
    { name: "BBQ Dinner", desc: "Grilled meats and vegetables, often by the pool/beach." },
    { name: "Veg Dinner – Chapati, Sabji, Rice", desc: "Simple and wholesome vegetarian dinner." },
    { name: "Goan Special Dinner – Xacuti / Vindaloo", desc: "Traditional, spicy Goan curries (Chicken/Pork)." },
    { name: "Tandoori Dinner Set", desc: "Tandoor-cooked bread, tikka, and kebab." },
    { name: "Light Dinner – Soup + Salad", desc: "Low-carb and light options for the evening." },
  ],
  packages: [
    { name: "Breakfast + Dinner", desc: "Covers two main meals." },
    { name: "Lunch + Dinner", desc: "Covers the mid-day and evening meals." },
    { name: "Breakfast + Lunch + Dinner", desc: "All three meals included for a hassle-free stay." },
    { name: "All Meals Included (Veg/Non-Veg)", desc: "Full board with customizable choices." },
    { name: "Seafood Unlimited Meals", desc: "Buffet/Ala carte with an emphasis on fresh seafood." },
    { name: "Jain Meals Package", desc: "Meals prepared without root vegetables (onion, garlic, potato)." },
    { name: "Kids Meal Plan", desc: "Child-friendly menu items." },
  ],
};

/* -------------------- Cab Modal (loads map only when opened) -------------------- */
const CAB_OPTIONS = [
  { type: "Bike", icon: "Bike", priceRange: 500, seats: 2, desc: "Quick and cheap, ideal for short trips." },
  { type: "Car (Sedan/Hatchback)", icon: "Car", priceRange: 1500, seats: 4, desc: "Comfortable private ride for small groups." },
  { type: "Traveller (SUV/Van)", icon: "Users", priceRange: 3500, seats: 6, desc: "Best for families and larger luggage." },
];

const CabModal = ({ open, onClose, pickup = "Hotel", destination = "Airport / Point" }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCab, setSelectedCab] = useState(CAB_OPTIONS[1]);

  useEffect(() => {
    if (open) {
      // Simulate loading a map library or external SDK.
      const t = setTimeout(() => setMapLoaded(true), 600); // replace with real map init
      return () => clearTimeout(t);
    } else {
      setMapLoaded(false);
      setSelectedCab(CAB_OPTIONS[1]); // Reset on close
    }
  }, [open]);

  // Mock calculation for cab price
  const cabPrice = useMemo(() => {
    const base = selectedCab.priceRange;
    const distanceFactor = Math.floor(Math.random() * 500) + 100; // Mock distance variation
    return base + distanceFactor;
  }, [selectedCab]);

  return (
    <ModalWrapper isOpen={open} onClose={onClose} size="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Truck" /> Book Cab
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl border">
            <label className="block text-sm font-semibold text-gray-600">Pickup</label>
            <input className="mt-2 w-full p-2 border rounded-lg" defaultValue={pickup} readOnly />
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border">
            <label className="block text-sm font-semibold text-gray-600">Destination</label>
            <input className="mt-2 w-full p-2 border rounded-lg" defaultValue={destination} />
          </div>
        </div>

        <div className="p-3 bg-gray-100 rounded-xl border min-h-[220px] flex items-center justify-center">
          {mapLoaded ? (
            <div className="w-full h-56 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-700">[Map Placeholder — integrating real-time routing here]</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading map...</p>
          )}
        </div>

        {/* Vehicle Selection */}
        <div>
          <h3 className="text-lg font-bold mb-2">Select Vehicle Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {CAB_OPTIONS.map((cab) => (
              <div
                key={cab.type}
                onClick={() => setSelectedCab(cab)}
                className={`p-3 rounded-xl border cursor-pointer transition text-center ${selectedCab.type === cab.type ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500" : "bg-white hover:bg-gray-50"}`}
              >
                <Icon name={cab.icon} size={28} className="mx-auto mb-1 text-indigo-600" />
                <p className="font-semibold text-sm">{cab.type}</p>
                <p className="text-xs text-gray-500">{cab.seats} Seats</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t mt-4">
            <div>
                <p className="text-sm text-gray-600">Estimated Cab Price:</p>
                <p className="text-2xl font-bold text-red-600">₹{cabPrice}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { alert(`Cab booked: ${selectedCab.type} for ₹${cabPrice}! (mock)`); onClose(); }} variant="accent">Confirm Cab</Button>
            </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* -------------------- Trip Details Popup (full flow) -------------------- */
const TripDetailsForPopup = ({ tripId, onClose }) => {
  const [hotels, setHotels] = useState([]);
  const [sortBy, setSortBy] = useState("low-high");
  const [filterType, setFilterType] = useState("all"); // all / AC / Non-AC
  const [step, setStep] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [cabOpen, setCabOpen] = useState(false);

  useEffect(() => {
    // simulate API load
    const t = setTimeout(() => {
      setHotels(MOCKED_API_RESPONSE);
    }, 400);
    return () => clearTimeout(t);
  }, [tripId]);

  const sortedHotels = useMemo(() => {
    return [...hotels].sort((a, b) => (sortBy === "low-high" ? a.hotelPrice - b.hotelPrice : b.hotelPrice - a.hotelPrice));
  }, [hotels, sortBy]);

  // Filter room list by AC/Non-AC when showing rooms
  const roomsForSelectedHotel = useMemo(() => {
    return selectedHotel ? selectedHotel.rooms.filter(r => (filterType === "all" ? true : r.type === filterType)) : [];
  }, [selectedHotel, filterType]);

  const toggleMeal = (mealName) => {
    setSelectedMeals(prev => prev.includes(mealName) ? prev.filter(x => x !== mealName) : [...prev, mealName]);
  };

  const totalCost = () => {
    const roomCost = selectedRoom ? Number(selectedRoom.price || selectedRoom.price) : 0;
    const mealsCost = selectedMeals.reduce((acc, m) => {
      // Find explicit price in hotel meals if possible
      const found = selectedHotel?.meals?.find(x => x.mealName === m);
      if (found) return acc + (found.price || 0);
      
      // rough approximations for package strings (mock) - uses GOA_MEAL_OPTIONS names
      if (m.toLowerCase().includes("all meals")) return acc + 2500;
      if (m.toLowerCase().includes("breakfast")) return acc + 300;
      if (m.toLowerCase().includes("lunch")) return acc + 700;
      if (m.toLowerCase().includes("dinner")) return acc + 1000;
      if (m.toLowerCase().includes("unlimited")) return acc + 3000;
      return acc + 500; // Default approximation
    }, 0);
    return roomCost + mealsCost;
  };

  const hotelCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-4 text-gray-800">
      <div className="flex gap-3 items-center">
        <motion.span layout className={`px-3 py-1 rounded-full text-xs font-semibold ${step === 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>1. Hotel</motion.span>
        <motion.span layout className={`px-3 py-1 rounded-full text-xs font-semibold ${step === 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>2. Room</motion.span>
        <motion.span layout className={`px-3 py-1 rounded-full text-xs font-semibold ${step === 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>3. Meals</motion.span>
        <motion.span layout className={`px-3 py-1 rounded-full text-xs font-semibold ${step === 4 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>4. Review</motion.span>
      </div>

      {/* STEP 1: HOTEL LIST + SORT */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: 0.4 }} className={step !== 1 ? "hidden" : ""}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Select Hotel (Goa only)</h2>
          <div className="flex gap-3 items-center">
            <select className="border px-3 py-2 rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHotels.map((h, index) => (
            <motion.div
              key={h.hotelId}
              variants={hotelCardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => { setSelectedHotel(h); setStep(2); setSelectedRoom(null); setSelectedMeals([]); }}
              className="border rounded-xl overflow-hidden hover:shadow-xl transition transform hover:scale-[1.01] cursor-pointer"
            >
              <img src={h.image} alt={h.hotelName} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{h.hotelName}</h3>
                <p className="text-sm text-gray-500">{h.hotelAddress}</p>
                <p className="font-bold text-green-700 mt-2">₹{h.hotelPrice.toLocaleString('en-IN')}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* STEP 2: ROOM SELECT + Type Filters (AC / Non-AC / All) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0 }} transition={{ duration: 0.4 }} className={step !== 2 ? "hidden" : ""}>
        {selectedHotel && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Select Room - {selectedHotel.hotelName}</h2>
                <p className="text-sm text-gray-500">{selectedHotel.hotelAddress}</p>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium">Filter:</label>
                <select className="border px-3 py-2 rounded-lg" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomsForSelectedHotel.map(r => (
                <div key={r.roomId} onClick={() => setSelectedRoom(r)} className={`p-3 rounded-xl border cursor-pointer transition ${selectedRoom?.roomId === r.roomId ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500" : "bg-white hover:bg-gray-50"}`}>
                  <div className="flex gap-3">
                    <img src={r.image} alt={r.roomName} className="w-28 h-20 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold">{r.roomName}</h4>
                      <p className="text-sm text-gray-500">Type: **{r.type}**</p>
                      <p className="text-green-700 font-bold mt-2">₹{r.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400">Available: {r.availableRooms}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setStep(1)}><Icon name="ArrowLeft" /> Back</Button>
              <div className="flex gap-2">
                <Button onClick={() => { setSelectedRoom(null); setSelectedMeals([]); setStep(1); }} variant="secondary">Choose Different Hotel</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedRoom}>Next <Icon name="ArrowRight" /></Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* STEP 3: MEALS selection (lots of options) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step === 3 ? 1 : 0 }} transition={{ duration: 0.4 }} className={step !== 3 ? "hidden" : ""}>
        {selectedHotel && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-2xl font-bold">Choose Meals</h2>
                <p className="text-sm text-gray-500">Pick breakfast / lunch / dinner / package options for your stay</p>
              </div>
              <div className="text-sm text-gray-600">Selected: **{selectedMeals.length}** options</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(GOA_MEAL_OPTIONS).map(([category, meals]) => (
                <div key={category} className="p-4 bg-white rounded-xl border">
                  <h3 className="font-semibold mb-3 capitalize text-lg">{category}</h3>
                  <div className="grid gap-2">
                    {meals.map((m, i) => (
                      <div key={i} onClick={() => toggleMeal(m.name)} className={`p-2 rounded-lg cursor-pointer border transition ${selectedMeals.includes(m.name) ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setStep(2)}><Icon name="ArrowLeft" /> Back</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setSelectedMeals([])}>Clear Meals</Button>
                <Button onClick={() => setStep(4)} disabled={!selectedRoom}>Next <Icon name="ArrowRight" /></Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* STEP 4: REVIEW & Confirm (with Cab option) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step === 4 ? 1 : 0 }} transition={{ duration: 0.4 }} className={step !== 4 ? "hidden" : ""}>
        <div>
          <h2 className="text-2xl font-bold mb-3">Review & Confirm</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-xl border">
              <h3 className="font-semibold flex items-center gap-2"><Icon name="Home" size={18} /> Hotel</h3>
              <p className="mt-1 font-medium">{selectedHotel?.hotelName}</p>
              <p className="text-sm text-gray-500">{selectedHotel?.hotelAddress}</p>
              <p className="font-bold text-green-700 mt-2">Base Price: ₹{selectedHotel?.hotelPrice.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border">
              <h3 className="font-semibold flex items-center gap-2"><Icon name="Bed" size={18} /> Room</h3>
              <p className="mt-1 font-medium">{selectedRoom?.roomName}</p>
              <p className="text-sm text-gray-500">Type: **{selectedRoom?.type}**</p>
              <p className="font-bold text-green-700 mt-2">Room Price: ₹{selectedRoom?.price.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border md:col-span-2">
              <h3 className="font-semibold flex items-center gap-2"><Icon name="ForkAndKnife" size={18} /> Meals</h3>
              {selectedMeals.length ? (
                <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                  {selectedMeals.map((m, i) => (<li key={i}>{m}</li>))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No meals selected (meal cost is **₹0**)</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Estimated Total Cost for this Booking:</p>
              <p className="text-3xl font-extrabold text-indigo-700">₹{totalCost().toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">*(Includes Room + Estimated Meal Cost)*</p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(3)}><Icon name="ArrowLeft" /> Back</Button>
              <Button onClick={() => setCabOpen(true)} variant="accent"><Icon name="Car" /> Book Cab</Button>
              <Button onClick={() => { alert(`Trip booked for ₹${totalCost().toLocaleString('en-IN')}! (mock)`); onClose?.(); }} >Confirm Trip</Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cab Modal */}
      <CabModal open={cabOpen} onClose={() => setCabOpen(false)} pickup={selectedHotel?.hotelName || "Hotel"} />
    </div>
  );
};

/* -------------------- Main App / Demo -------------------- */
export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Goa Trip Planner</h1>
            <p className="text-gray-600 mt-1">Hotels, rooms (AC / Non-AC), meals and cab booking </p>
          </div>
          <div>
            <Button onClick={() => setOpen(true)}><Icon name="Plane" /> Plan Goa Trip</Button>
          </div>
        </header>

        
      </div>

      <ModalWrapper isOpen={open} onClose={() => setOpen(false)} size="max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="/h12.jpg" alt="Goa" className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg"
            />
            <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border">
                **Goa is waiting!** Explore a variety of stays from North to South Goa, select your preferred AC/Non-AC room, customize your meal plan (breakfast, lunch, dinner, or package), and finish by booking a reliable local cab (Bike, Car, or Traveller) directly to your hotel or airport.
            </p>
          </div>

          <div>
            <TripDetailsForPopup tripId="GOA001" onClose={() => setOpen(false)} />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}