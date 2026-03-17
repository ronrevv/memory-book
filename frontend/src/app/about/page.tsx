"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-20 section-padding">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            We believe every photo tells a <span className="text-gradient font-serif italic">story</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-12">
            MemoryBook was born from a simple idea: your most precious moments deserve more than a phone screen. 
            We combine AI-powered design with premium printing to transform your digital photos into 
            beautiful physical scrapbooks that last a lifetime.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { num: "10K+", label: "Happy Creators" },
              { num: "50K+", label: "Scrapbooks Made" },
              { num: "4.9★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-gradient">{stat.num}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: "🎨", title: "Design Excellence", desc: "Our AI studies thousands of scrapbook layouts to create designs that feel hand-crafted." },
              { icon: "🌱", title: "Sustainable", desc: "We use FSC-certified paper and eco-friendly inks. Beautiful for your home and the planet." },
              { icon: "❤️", title: "Made with Love", desc: "Every scrapbook is quality-checked by hand before shipping to ensure perfection." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-card">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-semibold mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
