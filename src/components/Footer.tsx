'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const KidLinkLogo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#00D4AA"/>
    <path d="M14 15L18 19L26 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 22C16 20.8954 16.8954 20 18 20C19.1046 20 20 20.8954 20 22V26H16V22Z" fill="white"/>
    <circle cx="28" cy="28" r="2" fill="white"/>
  </svg>
);

export default function Footer() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: '', email: '', message: '' });
  };

  const currentYear = 2026;

  const testimonials = [
    { name: 'Sarah M.', role: 'Mom of 2, Chicago', text: "KidLink gave me peace of mind I didn\'t know I needed. The heart rate alerts literally saved us once.", avatar: 'SM' },
    { name: 'James T.', role: 'Dad, Austin TX', text: "The geo-fence feature is incredible. I get instant alerts when my son leaves school grounds.", avatar: 'JT' },
    { name: 'Linda K.', role: 'Grandparent, Seattle', text: "Even I can use it! The app is so simple and the SOS button is huge enough for my grandkids.", avatar: 'LK' },
  ];

  return (
    <footer className="border-t border-border bg-background">
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="text-center mb-10">
          <span className="section-label">What Parents Say</span>
          <h2 className="font-display text-3xl font-medium text-foreground mt-4">Trusted by 2.4M+ families</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" fill="#00D4AA" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{t.avatar}</div>
                <div>
                  <div className="text-foreground text-sm font-semibold">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form + App Store */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h3 className="font-display text-2xl font-medium text-foreground mb-6">Get in touch</h3>
            {submitted ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="text-primary text-4xl mb-3">✓</div>
                <p className="text-foreground font-medium">Message sent! We'll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={e => setFormState(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formState.email}
                  onChange={e => setFormState(p => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  placeholder="Your message..."
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button type="submit" className="btn-primary px-6 py-3 text-sm w-full">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* App Store + Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-medium text-foreground mb-2">Download KidLink</h3>
              <p className="text-muted-foreground text-sm mb-6">Available on iOS and Android. Setup takes under 5 minutes.</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#" className="flex items-center gap-3 bg-foreground text-background rounded-xl px-5 py-3 hover:bg-primary transition-all duration-300 min-h-[44px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] opacity-70 leading-none">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-foreground text-background rounded-xl px-5 py-3 hover:bg-primary transition-all duration-300 min-h-[44px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76a2 2 0 001.76-.2l.11-.07 9.9-5.71-2.76-2.76-9.01 8.74zM.5 1.05A2 2 0 000 2.5v19a2 2 0 00.5 1.34l.07.07 10.64-10.63v-.25L.57.98.5 1.05zm18.3 10.22l-2.56-1.48-3.04 3.04 3.04 3.04 2.57-1.48a2 2 0 000-3.12zM4.94.44L14.85 6.1 12.08 8.87 3.07.13l.11-.07A2 2 0 014.94.44z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] opacity-70 leading-none">Get it on</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg width="18" height="18" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-foreground text-sm font-semibold">COPPA Compliant</div>
                  <div className="text-muted-foreground text-xs">Child privacy protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <svg width="18" height="18" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-foreground text-sm font-semibold">256-bit Encryption</div>
                  <div className="text-muted-foreground text-xs">Bank-grade data security</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KidLinkLogo />
            <div>
              <span className="font-display text-base font-semibold text-foreground">KidLink</span>
              <p className="text-muted-foreground text-xs">Always Connected, Always Safe</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors min-h-[44px] flex items-center">Home</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors min-h-[44px] flex items-center">Dashboard</Link>
            <Link href="/child-device" className="hover:text-primary transition-colors min-h-[44px] flex items-center">Child Device</Link>
            <a href="#" className="hover:text-primary transition-colors min-h-[44px] flex items-center">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors min-h-[44px] flex items-center">Terms</a>
          </div>
          <p className="text-muted-foreground text-sm">© {currentYear} KidLink Inc.</p>
        </div>
      </div>
    </footer>
  );
}