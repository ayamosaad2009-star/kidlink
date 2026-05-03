'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const PULSE_RATES = [72, 74, 71, 73, 75, 78, 74, 72, 73, 71];

export default function HeroSection() {
  const [bpm, setBpm] = useState(73);
  const [alertVisible, setAlertVisible] = useState(false);
  const [gpsAddress, setGpsAddress] = useState('Lincoln Elementary School, Chicago IL');
  const bpmRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % PULSE_RATES.length;
      const newBpm = PULSE_RATES[idx];
      setBpm(newBpm);
      bpmRef.current = newBpm;
    }, 1200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBpm(164);
      setAlertVisible(true);
      const addresses = ['Riverside Park, Chicago IL', 'Oak St & Michigan Ave', 'Lincoln Elementary School, Chicago IL'];
      setGpsAddress(addresses[Math.floor(Math.random() * addresses.length)]);
      setTimeout(() => {
        setAlertVisible(false);
        setBpm(73);
      }, 5000);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Kids Protected', value: '2.4M+', icon: '👦', color: 'text-primary' },
    { label: 'Alerts Today', value: '18,247', icon: '🔔', color: 'text-secondary' },
    { label: 'Uptime', value: '99.97%', icon: '⚡', color: 'text-primary' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden noise-overlay">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="/assets/images/WhatsApp_Image_2026-05-03_at_2.15.57_PM-1777803935412.jpeg"
          alt="Family outdoors in bright sunlight, parents watching children play safely in open green park"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      </div>

      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Alert Popup */}
      {alertVisible && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm w-full animate-slide-up">
          <div className="bg-red-950/95 border border-red-500/60 rounded-2xl p-5 backdrop-blur-xl glow-danger">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-heartbeat flex-shrink-0">
                <svg width="20" height="20" fill="#ef4444" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-red-400 font-bold text-sm mb-1">⚠️ KidLink Alert</div>
                <div className="text-foreground text-sm font-semibold">Sudden heart rate spike detected!</div>
                <div className="text-red-300 text-sm mt-1">Emma's BPM: <span className="font-bold text-red-400">164 bpm</span></div>
                <div className="text-muted-foreground text-xs mt-1">📍 {gpsAddress}</div>
                <div className="flex gap-2 mt-3">
                  <button className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-400 transition-colors min-h-[44px]">Call Emma</button>
                  <button className="border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/10 transition-colors min-h-[44px]" onClick={() => setAlertVisible(false)}>Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="section-label mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              Trusted by 2.4M+ families worldwide
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-foreground leading-[1.05] tracking-tight mb-6 animate-slide-up">
              KidLink —{' '}
              <span className="text-gradient">Always Connected,</span>
              <br />Always Safe
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8 border-l-2 border-primary/40 pl-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Real-time GPS tracking, biometric heart rate monitoring, instant SOS alerts, and geo-fencing — the complete safety ecosystem for your child's wearable device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/dashboard" className="btn-primary px-8 py-4 text-base flex items-center justify-center gap-2 min-h-[52px]">
                Try KidLink Free
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <a href="#demo" className="btn-outline px-8 py-4 text-base flex items-center justify-center gap-2 min-h-[52px]">
                Watch Live Demo
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/>
                </svg>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {['COPPA Compliant', '256-bit Encrypted', 'No Ads Ever', '24/7 Support'].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="#00D4AA" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Stats Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Live BPM Card */}
            <div className={`glass-card rounded-2xl p-5 transition-all duration-500 ${bpm > 140 ? 'border-red-500/50 bg-red-950/20' : 'border-primary/20'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bpm > 140 ? 'bg-red-500' : 'bg-primary'} animate-pulse`} />
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Live Heart Rate</span>
                </div>
                <span className="text-muted-foreground text-xs">Emma, age 8</span>
              </div>
              <div className="flex items-end gap-3">
                <div className={`font-display text-5xl font-semibold transition-colors duration-300 ${bpm > 140 ? 'text-red-400' : 'text-foreground'}`}>
                  {bpm}
                </div>
                <div className="pb-1">
                  <div className="text-muted-foreground text-sm">BPM</div>
                  <div className={`text-xs font-medium ${bpm > 140 ? 'text-red-400' : 'text-primary'}`}>
                    {bpm > 140 ? '⚠️ ALERT' : '✓ Normal'}
                  </div>
                </div>
                <div className="ml-auto animate-heartbeat">
                  <svg width="32" height="32" fill={bpm > 140 ? '#ef4444' : '#00D4AA'} viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* GPS Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Live GPS Location</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-foreground text-sm font-semibold">{gpsAddress}</div>
                  <div className="text-muted-foreground text-xs">Updated 3s ago • Inside safe zone ✓</div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`font-display text-lg font-semibold ${s.color}`}>{s.value}</div>
                  <div className="text-muted-foreground text-[10px] mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs animate-bounce">
        <span>Scroll to explore</span>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}