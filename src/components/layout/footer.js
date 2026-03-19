"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Twitter, Github, Linkedin, ArrowRight, Shield, Globe, Zap, ChevronRight } from "lucide-react";

const LINKS = {
  company: [
    { href: "/about",    label: "About Us"   },
    { href: "/careers",  label: "Careers"    },
    { href: "/blog",     label: "Blog"       },
    { href: "/press",    label: "Press Kit"  },
    { href: "/contact",  label: "Contact"    },
  ],
  platform: [
    { href: "/services",  label: "Global Payments"  },
    { href: "/giftcards", label: "Gift Cards"       },
    { href: "/crypto",    label: "Crypto Exchange"  },
    { href: "/security",  label: "Security"         },
    { href: "/api",       label: "Developer API"    },
  ],
  legal: [
    { href: "/privacy",  label: "Privacy Policy" },
    { href: "/terms",    label: "Terms of Service"},
    { href: "/aml",      label: "AML Policy"     },
    { href: "/cookies",  label: "Cookie Policy"  },
  ],
};

const SOCIALS = [
  { icon: Twitter,  href: "#", label: "Twitter"  },
  { icon: Github,   href: "#", label: "GitHub"   },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail,     href: "#", label: "Email"    },
];

const TRUST = [
  { icon: Shield, label: "Bank-grade Security",   cx: "text-cyan-400"   },
  { icon: Globe,  label: "150+ Countries",        cx: "text-indigo-400" },
  { icon: Zap,    label: "Instant Settlement",    cx: "text-purple-400" },
];

const YEAR = new Date().getFullYear();

export default function Footer() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused,   setFocused]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
      `}</style>

      <footer className="xf relative overflow-hidden bg-[#000c42] text-white/65">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="xfhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#xfhex)"/>
          </svg>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-indigo-600/15 blur-[130px]"/>
          <div className="absolute -bottom-40 -right-20 h-100 w-100 rounded-full bg-cyan-500/12 blur-[120px]"/>
          <div className="absolute -bottom-20 -left-20 h-75 w-75 rounded-full bg-purple-600/10 blur-[100px]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
        </div>

        <div className="border-b border-white/6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {TRUST.map(({ icon: Icon, label, cx }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={13} className={cx} />
                  <span className="xf-mono text-[10px] tracking-[.08em] text-white/30 uppercase">{label}</span>
                </div>
              ))}
              <div className="hidden sm:flex items-center gap-2">
                <span className="xf-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
                <span className="xf-mono text-[10px] tracking-widest text-cyan-400/60">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-3 w-fit">
                <div className="relative">
                  <div className="xf-ring"/>
                  <div className="relative z-10 flex h-9.5 w-9.5 items-center justify-center rounded-[14px] bg-linear-to-br from-cyan-400 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    <span className="xf-syne text-sm font-black text-white">X</span>
                  </div>
                </div>
                <span className="xf-syne xf-wordmark text-xl font-extrabold tracking-tight">Xenra</span>
              </Link>

              <p className="text-sm leading-relaxed text-white/45 max-w-xs">
                Xenra powers secure global transactions, gift card trading, and crypto exchange — enabling seamless value transfer across borders for individuals and businesses.
              </p>

              <div className="flex gap-2.5">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="xf-social flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/40 backdrop-blur transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[.07] hover:text-cyan-400"
                  >
                    <Icon size={15}/>
                  </Link>
                ))}
              </div>

              {/* Rating badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/2 px-4 py-3 w-fit">
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[13px] text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="xf-mono mt-1 text-[9px] tracking-[.08em] text-white/25 uppercase">Trusted by 500K+ users</p>
                </div>
                <div className="h-8 w-px bg-white/[.07]"/>
                <div className="text-right">
                  <p className="xf-syne text-lg font-extrabold text-white leading-none">4.9</p>
                  <p className="xf-mono text-[9px] tracking-[.06em] text-white/25 mt-0.5">App Store</p>
                </div>
              </div>
            </div>

            {[
              { title: "Company",  links: LINKS.company  },
              { title: "Platform", links: LINKS.platform },
              { title: "Legal",    links: LINKS.legal    },
            ].map(({ title, links }) => (
              <div key={title} className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-5">
                  <span className="xf-mono text-[10px] font-bold tracking-[.15em] text-white/80 uppercase">{title}</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent"/>
                </div>

                <ul className="space-y-2.5">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="xf-link flex items-center gap-1.5 text-sm text-white/40"
                      >
                        <ChevronRight size={11} className="shrink-0 text-white/20 transition-colors group-hover:text-cyan-400"/>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <span className="xf-mono text-[10px] font-bold tracking-[.15em] text-white/80 uppercase">Updates</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent"/>
              </div>

              <p className="text-sm leading-relaxed text-white/40 mb-5">
                Get product releases and platform updates in your inbox.
              </p>

              {submitted ? (
                <div className="xf-success rounded-2xl border border-cyan-400/25 bg-cyan-400/8 px-4 py-5 text-center">
                  <div className="mb-2 text-lg">✓</div>
                  <p className="text-sm font-semibold text-cyan-400">You're subscribed!</p>
                  <p className="mt-1 text-xs text-white/35">We'll keep you in the loop.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className={`relative rounded-xl border transition-all duration-200 ${focused ? "border-cyan-400/40" : "border-white/8"} bg-white/3`}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="your@email.com"
                      className="xf-input w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="xf-cta group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)]"
                  >
                    <span className="xf-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Subscribe
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                    </span>
                  </button>
                  <p className="text-center xf-mono text-[9px] tracking-[.06em] text-white/20">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/[.07] to-transparent"/>

          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="xf-mono text-[11px] tracking-[.04em] text-white/25">
              © {YEAR} Xenra Technologies Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="xf-blink inline-block h-1 w-1 rounded-full bg-cyan-400"/>
                <span className="xf-mono text-[9px] tracking-widest text-white/22 uppercase">All systems normal</span>
              </div>
              <div className="h-3 w-px bg-white/8"/>
              <span className="xf-mono text-[9px] tracking-[.08em] text-white/22 uppercase">🌍 Global · UTC</span>
            </div>

            <div className="flex items-center gap-5">
              {LINKS.legal.slice(0, 2).map(({ href, label }) => (
                <Link key={href} href={href} className="xf-mono text-[10px] tracking-[.04em] text-white/28 transition-colors hover:text-white/65">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"/>
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent mt-px"/>
      </footer>
    </>
  );
}
