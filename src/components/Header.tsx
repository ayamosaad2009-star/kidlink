'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const KidLinkLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#00D4AA"/>
    <path d="M14 15L18 19L26 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 22C16 20.8954 16.8954 20 18 20C19.1046 20 20 20.8954 20 22V26H16V22Z" fill="white"/>
    <circle cx="28" cy="28" r="2" fill="white"/>
  </svg>
);

interface HeaderProps {
  activePage?: 'home' | 'dashboard' | 'child-device';
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true, once: true });
    }
  }, [menuOpen]);

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Demo', href: '/#demo' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl' :'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="KidLink Home">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <KidLinkLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold text-foreground leading-none tracking-tight">KidLink</span>
            <span className="text-[10px] text-primary font-medium tracking-widest uppercase leading-none mt-0.5">Safety Tracker</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="btn-outline px-5 py-2.5 text-sm font-medium">
            Log In
          </Link>
          <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm">
            Get KidLink
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-3 pt-3 border-t border-border">
              <Link href="/dashboard" className="btn-outline flex-1 py-3 text-sm text-center font-medium" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/dashboard" className="btn-primary flex-1 py-3 text-sm text-center" onClick={() => setMenuOpen(false)}>
                Get KidLink
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}