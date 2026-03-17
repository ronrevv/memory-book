import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Create Scrapbook", href: "/create" },
    { label: "Templates", href: "/explore" },
    { label: "Pricing", href: "/pricing" },
    { label: "3D Preview", href: "/preview" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="section-padding py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold">MemoryBook</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Turn your precious photos into beautiful physical scrapbooks. Designed by AI, printed with love.
            </p>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 MemoryBook. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with 💕 for your memories
          </p>
        </div>
      </div>
    </footer>
  );
}
