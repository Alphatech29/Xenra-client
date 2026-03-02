import Link from "next/link";
import { Mail, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer({ year }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020824] text-white/70">
      {/* glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-50 h-125 w-125 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute -bottom-50 -right-37.5 h-112.5 w-112.5 rounded-full bg-cyan-500/20 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-indigo-600 font-bold text-black">
                X
              </div>
              <span className="text-xl font-semibold text-white">Xenra</span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Xenra powers secure global transactions, gift card trading and
              cryptocurrency exchange — enabling seamless value transfer across
              borders for individuals and businesses.
            </p>

            <div className="mt-6 flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur transition hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-white">Payments</Link></li>
              <li><Link href="/giftcards" className="hover:text-white">Gift Cards</Link></li>
              <li><Link href="/crypto" className="hover:text-white">Crypto Exchange</Link></li>
              <li><Link href="/security" className="hover:text-white">Security</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Updates</h3>
            <p className="mt-5 text-sm text-white/60">
              Join our newsletter to receive product releases and platform updates.
            </p>

            <form className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 backdrop-blur focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 text-sm md:flex-row">
          <p className="text-white/40">
            © {year} Xenra. All rights reserved.
          </p>

          <div className="flex gap-6 text-white/50">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}