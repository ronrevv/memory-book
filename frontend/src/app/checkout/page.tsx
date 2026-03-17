"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const [pages, setPages] = useState(20);
  const [cover, setCover] = useState<"soft" | "hard">("hard");
  const [giftWrap, setGiftWrap] = useState(false);
  const [express, setExpress] = useState(false);
  const [step, setStep] = useState<"options" | "payment" | "success">("options");

  const basePrice = 29.99;
  const pagePrice = pages > 20 ? (pages - 20) * 0.5 : 0;
  const coverPrice = cover === "hard" ? 10 : 0;
  const giftPrice = giftWrap ? 5.99 : 0;
  const expressPrice = express ? 9.99 : 0;
  const total = basePrice + pagePrice + coverPrice + giftPrice + expressPrice;

  const handlePayment = () => {
    setStep("payment");
    setTimeout(() => setStep("success"), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50/30">
      <Navbar />
      <div className="pt-24 pb-16 section-padding">
        {step === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-4xl">✓</div>
            <h1 className="text-3xl font-bold mb-2">Order Placed! 🎉</h1>
            <p className="text-gray-500 mb-2">Order #MB-2026-0847</p>
            <p className="text-gray-400 text-sm mb-8">
              Your scrapbook is being prepared with love. We&apos;ll send you updates via email.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/tracking" className="btn-primary text-center">Track Your Order</Link>
              <Link href="/" className="btn-secondary text-center">Back to Home</Link>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Options */}
              <div className="lg:col-span-3 space-y-6">
                {/* Pages */}
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Number of Pages</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={pages}
                      onChange={(e) => setPages(Number(e.target.value))}
                      className="flex-1 accent-pink-500"
                    />
                    <span className="w-16 text-center font-semibold text-lg bg-pink-50 rounded-xl py-2">{pages}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">First 20 pages included. Extra pages $0.50 each.</p>
                </div>

                {/* Cover Type */}
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Cover Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "soft" as const, label: "Soft Cover", price: "Included", icon: "📘" },
                      { id: "hard" as const, label: "Hard Cover", price: "+$10", icon: "📕" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCover(opt.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          cover === opt.id ? "border-pink-400 bg-pink-50" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <p className="font-medium mt-2">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Extras</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🎁</span>
                        <div>
                          <p className="font-medium text-sm">Gift Wrap</p>
                          <p className="text-xs text-gray-400">Premium wrapping with ribbon</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">+$5.99</span>
                        <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-5 h-5 accent-pink-500 rounded" />
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🚀</span>
                        <div>
                          <p className="font-medium text-sm">Express Delivery</p>
                          <p className="text-xs text-gray-400">2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">+$9.99</span>
                        <input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} className="w-5 h-5 accent-pink-500 rounded" />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment (demo) */}
                {step === "payment" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-card">
                    <h3 className="font-semibold mb-4">Payment (Demo Mode)</h3>
                    <div className="space-y-3">
                      <input placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" readOnly />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/YY" defaultValue="12/28" className="px-4 py-3 rounded-xl border border-gray-200 text-sm" readOnly />
                        <input placeholder="CVC" defaultValue="123" className="px-4 py-3 rounded-xl border border-gray-200 text-sm" readOnly />
                      </div>
                      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">🔒 Demo mode — no real charges</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
                  <h3 className="font-semibold mb-4">Order Summary</h3>

                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-5xl mb-4 shadow-inner">
                    📖
                  </div>
                  <p className="font-medium mb-1">Our Paris Adventure</p>
                  <p className="text-xs text-gray-400 mb-4">Travel Scrapbook • {pages} pages</p>

                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between"><span className="text-gray-500">Base price</span><span>${basePrice.toFixed(2)}</span></div>
                    {pagePrice > 0 && <div className="flex justify-between"><span className="text-gray-500">Extra pages ({pages - 20})</span><span>${pagePrice.toFixed(2)}</span></div>}
                    {coverPrice > 0 && <div className="flex justify-between"><span className="text-gray-500">Hard cover</span><span>${coverPrice.toFixed(2)}</span></div>}
                    {giftPrice > 0 && <div className="flex justify-between"><span className="text-gray-500">Gift wrap</span><span>${giftPrice.toFixed(2)}</span></div>}
                    {expressPrice > 0 && <div className="flex justify-between"><span className="text-gray-500">Express delivery</span><span>${expressPrice.toFixed(2)}</span></div>}
                    <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                      <span>Total</span><span className="text-gradient">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={handlePayment} className="w-full btn-primary mt-6 !py-3.5">
                    {step === "payment" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Processing...
                      </span>
                    ) : "Place Order"}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure checkout • 30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
