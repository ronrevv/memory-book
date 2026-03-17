"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Starter",
    price: "$29.99",
    desc: "Perfect for your first scrapbook",
    features: ["20 pages included", "Soft cover", "Standard delivery (5-7 days)", "3 AI-generated layouts", "Basic themes"],
    cta: "Start Creating",
    popular: false,
  },
  {
    name: "Premium",
    price: "$49.99",
    desc: "Most popular for special occasions",
    features: ["40 pages included", "Hard cover included", "Express delivery (2-3 days)", "Unlimited AI layouts", "All premium themes", "Stickers & maps", "Gift wrapping"],
    cta: "Get Premium",
    popular: true,
  },
  {
    name: "Pro",
    price: "$79.99",
    desc: "For creators and influencers",
    features: ["80 pages included", "Hard cover + dust jacket", "Priority express delivery", "Unlimited everything", "Publish public scrapbooks", "Analytics dashboard", "Priority support"],
    cta: "Go Pro",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-20 section-padding">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No hidden fees. Pay per scrapbook, not per month.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-pink-500 to-purple-600 text-white shadow-2xl scale-105"
                  : "bg-white border border-gray-100 shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className={`text-sm mt-1 ${plan.popular ? "text-white/70" : "text-gray-400"}`}>{plan.desc}</p>
              <p className="text-4xl font-bold mt-4 mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <span className={plan.popular ? "text-white" : "text-green-500"}>✓</span>
                    <span className={plan.popular ? "text-white/90" : "text-gray-600"}>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className={`block text-center py-3 rounded-2xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "btn-primary w-full"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
