"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const tabs = ["Overview", "Orders", "Users", "Templates", "Analytics"];

const recentOrders = [
  { id: "MB-0847", customer: "John Doe", type: "Travel", pages: 20, status: "Printing", total: "$55.97", date: "Mar 15" },
  { id: "MB-0846", customer: "Sarah Chen", type: "Wedding", pages: 40, status: "Dispatched", total: "$89.99", date: "Mar 14" },
  { id: "MB-0845", customer: "Priya Sharma", type: "Baby", pages: 30, status: "Delivered", total: "$64.98", date: "Mar 13" },
  { id: "MB-0844", customer: "Mike Torres", type: "Travel", pages: 25, status: "Binding", total: "$47.49", date: "Mar 13" },
  { id: "MB-0843", customer: "Lily Park", type: "Friends", pages: 20, status: "Delivered", total: "$39.99", date: "Mar 12" },
];

const users = [
  { name: "John Doe", email: "john@example.com", scrapbooks: 3, orders: 2, joined: "Feb 2026" },
  { name: "Sarah Chen", email: "sarah@example.com", scrapbooks: 7, orders: 5, joined: "Jan 2026" },
  { name: "Priya Sharma", email: "priya@example.com", scrapbooks: 2, orders: 1, joined: "Mar 2026" },
  { name: "Mike Torres", email: "mike@example.com", scrapbooks: 4, orders: 3, joined: "Dec 2025" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    Object.fromEntries(recentOrders.map((o) => [o.id, o.status]))
  );

  const updateStatus = (id: string, status: string) => {
    setOrderStatuses((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 text-white min-h-screen flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm">MemoryBook Admin</span>
          </Link>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-white/10">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Mobile tab selector */}
          <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab ? "bg-pink-500 text-white" : "bg-white text-gray-600 border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Revenue", value: "$12,847", change: "+23%", icon: "💰" },
                  { label: "Orders", value: "342", change: "+12%", icon: "📦" },
                  { label: "Users", value: "1,247", change: "+8%", icon: "👥" },
                  { label: "Active Scrapbooks", value: "892", change: "+15%", icon: "📖" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
                <h3 className="font-semibold mb-4">Revenue Overview</h3>
                <div className="flex items-end gap-2 h-40">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 pb-3">
                  <h3 className="font-semibold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Order</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Customer</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Type</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-medium">{order.id}</td>
                          <td className="px-6 py-3 text-gray-600">{order.customer}</td>
                          <td className="px-6 py-3 text-gray-600">{order.type}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              orderStatuses[order.id] === "Delivered" ? "bg-green-100 text-green-700" :
                              orderStatuses[order.id] === "Dispatched" ? "bg-blue-100 text-blue-700" :
                              orderStatuses[order.id] === "Printing" ? "bg-amber-100 text-amber-700" :
                              "bg-purple-100 text-purple-700"
                            }`}>{orderStatuses[order.id]}</span>
                          </td>
                          <td className="px-6 py-3 font-semibold">{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "Orders" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Order</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Customer</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Type</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Pages</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Total</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50">
                          <td className="px-6 py-3 font-medium">{order.id}</td>
                          <td className="px-6 py-3">{order.customer}</td>
                          <td className="px-6 py-3">{order.type}</td>
                          <td className="px-6 py-3">{order.pages}</td>
                          <td className="px-6 py-3">
                            <select
                              value={orderStatuses[order.id]}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-xs"
                            >
                              {["Confirmed", "Printing", "Binding", "Dispatched", "Delivered"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-3 font-semibold">{order.total}</td>
                          <td className="px-6 py-3">
                            <button className="text-xs text-pink-600 font-medium hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "Users" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Scrapbooks</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Orders</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-medium">{user.name}</td>
                          <td className="px-6 py-3 text-gray-500">{user.email}</td>
                          <td className="px-6 py-3">{user.scrapbooks}</td>
                          <td className="px-6 py-3">{user.orders}</td>
                          <td className="px-6 py-3 text-gray-500">{user.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "Templates" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Scrapbook Templates</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Modern Minimal", type: "Travel", uses: 234, emoji: "✈️" },
                  { name: "Classic Romance", type: "Wedding", uses: 567, emoji: "💒" },
                  { name: "Pastel Dreams", type: "Baby", uses: 189, emoji: "👶" },
                  { name: "Bold & Fun", type: "Birthday", uses: 145, emoji: "🎂" },
                  { name: "Warm Tones", type: "Couple", uses: 321, emoji: "💕" },
                  { name: "Adventure", type: "Travel", uses: 412, emoji: "🏔️" },
                ].map((t) => (
                  <div key={t.name} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{t.type}</span>
                    </div>
                    <h3 className="font-semibold mt-3">{t.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t.uses} uses</p>
                    <div className="mt-3 flex gap-2">
                      <button className="text-xs text-pink-600 font-medium">Edit</button>
                      <button className="text-xs text-gray-400 font-medium">Duplicate</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "Analytics" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Analytics</h1>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Popular Scrapbook Types</h3>
                  <div className="space-y-3">
                    {[
                      { type: "Travel", pct: 35 },
                      { type: "Wedding", pct: 25 },
                      { type: "Baby", pct: 18 },
                      { type: "Couple", pct: 12 },
                      { type: "Friends", pct: 7 },
                      { type: "Birthday", pct: 3 },
                    ].map((item) => (
                      <div key={item.type} className="flex items-center gap-3">
                        <span className="text-sm w-16 text-gray-600">{item.type}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Monthly Growth</h3>
                  <div className="flex items-end gap-3 h-40">
                    {[30, 45, 60, 50, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-md" style={{ height: `${h}%` }} />
                        <span className="text-xs text-gray-400">{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
