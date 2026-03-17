"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const scrapbookTypes = [
  { icon: "✈️", title: "Travel", desc: "Adventures & wanderlust", color: "from-blue-400 to-cyan-400" },
  { icon: "💒", title: "Wedding", desc: "Your perfect day", color: "from-pink-400 to-rose-400" },
  { icon: "🎂", title: "Birthday", desc: "Celebrations & joy", color: "from-amber-400 to-orange-400" },
  { icon: "💕", title: "Couple", desc: "Love stories", color: "from-red-400 to-pink-400" },
  { icon: "👶", title: "Baby", desc: "Precious firsts", color: "from-purple-400 to-violet-400" },
  { icon: "👫", title: "Friends", desc: "Bonds & memories", color: "from-emerald-400 to-teal-400" },
];

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Design",
    desc: "Our AI automatically creates stunning layouts, captions, and themes for your photos.",
  },
  {
    icon: "✨",
    title: "Drag & Drop Editor",
    desc: "Easily customize every detail — rearrange photos, add stickers, change fonts and themes.",
  },
  {
    icon: "📖",
    title: "3D Preview",
    desc: "Flip through your scrapbook in an interactive 3D preview before ordering.",
  },
  {
    icon: "🚀",
    title: "Premium Printing",
    desc: "Museum-quality printing on thick, glossy paper. Hard or soft cover options.",
  },
  {
    icon: "🎁",
    title: "Gift Ready",
    desc: "Gift wrapping and personalized messages. Perfect for any occasion.",
  },
  {
    icon: "📦",
    title: "Fast Delivery",
    desc: "Express delivery available. Track your order from printing to doorstep.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Travel Blogger",
    text: "MemoryBook turned my travel photos into the most gorgeous scrapbook. The AI layouts were perfect!",
    avatar: "SC",
  },
  {
    name: "James Wilson",
    role: "Wedding Photographer",
    text: "I recommend MemoryBook to all my clients. The quality is unmatched and the 3D preview is amazing.",
    avatar: "JW",
  },
  {
    name: "Priya Sharma",
    role: "New Mom",
    text: "Created a baby memories book in 10 minutes. My parents cried when they received it. Absolutely beautiful.",
    avatar: "PS",
  },
];

const steps = [
  { num: "01", title: "Upload Photos", desc: "Import from your phone, Instagram, or Google Photos" },
  { num: "02", title: "Choose Theme", desc: "Select from travel, wedding, baby & more categories" },
  { num: "03", title: "AI Designs It", desc: "Our AI creates beautiful layouts and captions" },
  { num: "04", title: "Customize", desc: "Edit with our drag-and-drop scrapbook editor" },
  { num: "05", title: "Preview in 3D", desc: "Flip through your scrapbook before ordering" },
  { num: "06", title: "Order & Deliver", desc: "Premium print delivered to your doorstep" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="section-padding py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-sm font-medium text-pink-700">New: AI Scrapbook Builder</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                Turn photos into{" "}
                <span className="text-gradient font-serif italic">beautiful</span>{" "}
                scrapbooks
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                AI designs your perfect scrapbook. Premium printed and delivered to your door. 
                Preserve memories that last a lifetime.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/create" className="btn-primary flex items-center gap-2">
                  Start Creating
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/explore" className="btn-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  See Examples
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["bg-pink-400", "bg-purple-400", "bg-amber-400", "bg-emerald-400"].map((bg, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Loved by 10,000+ creators</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main scrapbook mockup */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-premium bg-white p-3">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-pink-100 via-purple-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 p-6 w-full">
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-4xl shadow-lg">📸</div>
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-300 to-indigo-400 flex items-center justify-center text-4xl shadow-lg">🌅</div>
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-4xl shadow-lg">🏔️</div>
                      <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center text-4xl shadow-lg">🌊</div>
                    </div>
                    <div className="absolute bottom-4 left-6 right-6 bg-white/80 backdrop-blur rounded-xl p-3 shadow-lg">
                      <p className="font-serif italic text-sm text-gray-700">&ldquo;Every photo tells a story worth keeping&rdquo;</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 opacity-80 -z-10 rotate-12 shadow-lg" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-300 to-pink-400 opacity-60 -z-10 -rotate-12 shadow-lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrapbook Types */}
      <section className="py-20 lg:py-28 bg-gray-50/50">
        <div className="section-padding">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Every memory deserves a <span className="text-gradient">theme</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Choose from our curated collection of scrapbook themes, perfectly designed for every occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {scrapbookTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href="/create"
                  className="block p-6 rounded-2xl bg-white border border-gray-100 card-hover group text-center"
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-2xl 
                    group-hover:scale-110 transition-transform shadow-sm`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-xs text-gray-400">{type.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              From photos to scrapbook in <span className="text-gradient">minutes</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Six simple steps to your perfect memory book
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-white border border-gray-100 card-hover group"
              >
                <span className="text-5xl font-bold text-gray-100 group-hover:text-pink-100 transition-colors absolute top-4 right-6">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-neutral-950 text-white">
        <div className="section-padding">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to create{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">magic</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional tools made simple. No design skills needed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Stories from our <span className="text-gradient">community</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="section-padding">
          <motion.div
            {...fadeUp}
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 lg:p-20 text-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to preserve your memories?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of happy creators. Your first scrapbook is on us — 20% off with code MEMORIES.
              </p>
              <Link href="/create" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                Create Your Scrapbook
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
