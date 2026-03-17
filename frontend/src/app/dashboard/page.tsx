"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const userScrapbooks = [
  { id: 1, title: "Our Paris Adventure", type: "Travel", emoji: "✈️", pages: 20, status: "Draft", updated: "2 hours ago" },
  { id: 2, title: "Wedding Memories", type: "Wedding", emoji: "💒", pages: 40, status: "Ordered", updated: "3 days ago" },
  { id: 3, title: "Baby's First Year", type: "Baby", emoji: "👶", pages: 30, status: "Published", updated: "1 week ago" },
];

const quickActions = [
  { icon: "✨", label: "Create New", href: "/create", color: "from-pink-500 to-purple-600" },
  { icon: "📦", label: "Track Orders", href: "/tracking", color: "from-amber-500 to-orange-500" },
  { icon: "🌍", label: "Explore", href: "/explore", color: "from-blue-500 to-cyan-500" },
  { icon: "⚙️", label: "Settings", href: "#", color: "from-gray-500 to-gray-600" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50/30">
      <Navbar />
      <div className="pt-24 pb-16 section-padding">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, John! 👋</h1>
              <p className="text-gray-500">Here&apos;s what&apos;s happening with your scrapbooks</p>
            </div>
            <Link href="/create" className="btn-primary !text-sm hidden sm:flex items-center gap-2">
              + New Scrapbook
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="p-5 rounded-2xl bg-white border border-gray-100 card-hover group text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm`}>
                  {action.icon}
                </div>
                <p className="font-medium text-sm">{action.label}</p>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Scrapbooks", value: "3", icon: "📖" },
              { label: "Photos Used", value: "156", icon: "📸" },
              { label: "Orders", value: "2", icon: "📦" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrapbooks */}
          <h2 className="text-xl font-bold mb-4">Your Scrapbooks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userScrapbooks.map((book) => (
              <Link key={book.id} href="/editor" className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover">
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{book.emoji}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-pink-600 transition-colors">{book.title}</h3>
                        <p className="text-xs text-gray-400">{book.type} • {book.pages} pages</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        book.status === "Draft" ? "bg-gray-100 text-gray-600" :
                        book.status === "Ordered" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>{book.status}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">Updated {book.updated}</p>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/create" className="flex items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50/30 transition-all text-gray-400 hover:text-pink-500 group">
              <div className="text-center">
                <span className="text-4xl group-hover:scale-110 transition-transform inline-block">+</span>
                <p className="text-sm font-medium mt-2">New Scrapbook</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
