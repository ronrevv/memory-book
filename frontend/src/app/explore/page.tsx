"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const publicScrapbooks = [
  { id: 1, title: "Santorini Dreams", author: "Sarah Chen", type: "Travel", emoji: "🇬🇷", likes: 2340, saves: 489, price: "$39.99" },
  { id: 2, title: "Our Wedding Day", author: "James & Emily", type: "Wedding", emoji: "💒", likes: 5120, saves: 1023, price: "$49.99" },
  { id: 3, title: "Baby Noah's First Year", author: "Priya Sharma", type: "Baby", emoji: "👶", likes: 3890, saves: 756, price: "$34.99" },
  { id: 4, title: "Road Trip USA", author: "Mike Torres", type: "Travel", emoji: "🚗", likes: 1870, saves: 312, price: "$44.99" },
  { id: 5, title: "Best Friend Chronicles", author: "Lily & Rose", type: "Friends", emoji: "👫", likes: 4210, saves: 687, price: "$29.99" },
  { id: 6, title: "Tokyo Food Journey", author: "Ken Tanaka", type: "Travel", emoji: "🍣", likes: 3150, saves: 541, price: "$39.99" },
  { id: 7, title: "Our Love Story", author: "Alex & Jordan", type: "Couple", emoji: "💕", likes: 6780, saves: 1289, price: "$44.99" },
  { id: 8, title: "Birthday Bash 30!", author: "Diana Cruz", type: "Birthday", emoji: "🎂", likes: 1560, saves: 234, price: "$29.99" },
  { id: 9, title: "European Summer", author: "Tom Harris", type: "Travel", emoji: "✈️", likes: 4530, saves: 890, price: "$49.99" },
];

const filters = ["All", "Travel", "Wedding", "Baby", "Couple", "Friends", "Birthday"];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? publicScrapbooks : publicScrapbooks.filter((s) => s.type === activeFilter);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 section-padding">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Explore Scrapbooks</h1>
          <p className="text-gray-500">Discover beautiful scrapbooks from our community of creators</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href="/preview" className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover">
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 flex items-center justify-center relative">
                    <span className="text-7xl group-hover:scale-110 transition-transform">{book.emoji}</span>
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-semibold text-pink-600">
                      {book.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-pink-600 transition-colors">{book.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {book.author}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>❤️ {book.likes.toLocaleString()}</span>
                        <span>🔖 {book.saves.toLocaleString()}</span>
                      </div>
                      <span className="text-sm font-bold text-gradient">{book.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
