"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const orderStages = [
  { id: "confirmed", label: "Order Confirmed", icon: "✓", date: "Mar 15, 2026 • 2:30 PM", done: true },
  { id: "printing", label: "Printing", icon: "🖨️", date: "Mar 16, 2026 • 10:00 AM", done: true },
  { id: "binding", label: "Binding & Quality Check", icon: "📖", date: "Mar 17, 2026 • 3:00 PM", done: true },
  { id: "dispatched", label: "Dispatched", icon: "📦", date: "Mar 18, 2026 • 9:00 AM", done: false, active: true },
  { id: "delivered", label: "Delivered", icon: "🏠", date: "Expected Mar 20", done: false },
];

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-gray-50/30">
      <Navbar />
      <div className="pt-24 pb-16 section-padding">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
            <p className="text-gray-500 mb-8">Order #MB-2026-0847</p>

            {/* Order Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                  📖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Our Paris Adventure</h3>
                  <p className="text-sm text-gray-400">Travel Scrapbook • 20 pages • Hard Cover</p>
                  <p className="text-sm text-gray-400">Gift Wrapped • Express Delivery</p>
                  <p className="text-lg font-bold mt-2 text-gradient">$55.97</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-6">Delivery Progress</h3>
              <div className="space-y-0">
                {orderStages.map((stage, i) => (
                  <div key={stage.id} className="flex gap-4">
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                        stage.done
                          ? "bg-green-100 text-green-600"
                          : stage.active
                          ? "bg-pink-100 text-pink-600 ring-4 ring-pink-50 animate-pulse"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {stage.done ? "✓" : stage.icon}
                      </div>
                      {i < orderStages.length - 1 && (
                        <div className={`w-0.5 h-12 ${stage.done ? "bg-green-300" : "bg-gray-200"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pt-2 pb-6">
                      <p className={`font-medium text-sm ${stage.active ? "text-pink-600" : stage.done ? "text-gray-900" : "text-gray-400"}`}>
                        {stage.label}
                        {stage.active && <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">In Progress</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{stage.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-2xl p-6 shadow-card mt-6">
              <h3 className="font-semibold mb-3">Shipping Details</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>John Doe</p>
                <p>123 Memory Lane, Suite 4B</p>
                <p>San Francisco, CA 94102</p>
                <p className="text-xs text-gray-400 mt-2">Tracking: MBEX-2026-847392</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
