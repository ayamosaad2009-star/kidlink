'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  children?: React.ReactNode;
  colSpan?: string;
  rowSpan?: string;
}

function FeatureCard({ icon, title, description, badge, badgeColor = 'bg-primary/10 text-primary', children, colSpan = '', rowSpan = '' }: FeatureCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-all duration-500 group ${colSpan} ${rowSpan} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease' }}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>{badge}</span>
        )}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}

function MiniHeartbeat() {
  const bars = [40, 20, 60, 80, 30, 90, 50, 40, 70, 35, 85, 45];
  return (
    <div className="flex items-end gap-0.5 h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-primary"
          style={{ height: `${h}%`, opacity: 0.4 + (i / bars.length) * 0.6, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function MiniBattery({ level }: { level: number }) {
  const color = level < 20 ? 'bg-red-500' : level < 50 ? 'bg-yellow-500' : 'bg-primary';
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-8 h-4 border-2 border-muted-foreground/40 rounded-sm relative">
          <div className={`absolute inset-0.5 rounded-sm ${color} transition-all duration-500`} style={{ width: `${level}%` }} />
        </div>
        <div className="w-1 h-2 bg-muted-foreground/40 rounded-r-sm" />
      </div>
      <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>{level}%</span>
    </div>
  );
}

export default function FeaturesSection() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [fallDetected, setFallDetected] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(78);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerFall = () => {
    setFallDetected(true);
    setCountdown(30);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 5) return 78;
        return prev - 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Complete Safety Ecosystem</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground mt-4 mb-4">
            Every feature your child needs,
            <br />
            <span className="text-gradient">every second of the day</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            KidLink combines biometrics, GPS, and AI-powered alerts into one seamless wearable experience.
          </p>
        </div>

        {/* BENTO GRID AUDIT:
          Array has 7 cards: [HeartRate, GPS, SOS, GeoFence, FallDetect, AudioRecord, Battery]
          Row 1: [col-1-2: HeartRate cs-2 rs-1] [col-3: GPS cs-1 rs-2]
          Row 2: [col-1: SOS cs-1 rs-1] [col-2: GeoFence cs-1 rs-1] [col-3: OCCUPIED(GPS)]
          Row 3: [col-1: FallDetect cs-1] [col-2: AudioRecord cs-1] [col-3: Battery cs-1]
          Placed 7/7 cards ✓
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto">
          {/* Card 1: Heart Rate - col-span-2 */}
          {/* STEP 4 comment: HeartRate cs-2 */}
          <div className="md:col-span-2">
            <FeatureCard
              icon={<svg width="24" height="24" fill="#00D4AA" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
              title="Real-Time Heart Rate Tracking"
              description="Continuous BPM monitoring with intelligent spike detection. Get instant alerts when heart rate exceeds safe thresholds."
              badge="Live"
              badgeColor="bg-red-500/15 text-red-400"
            >
              <MiniHeartbeat />
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Normal: 60–120 bpm</span>
                  <span className="text-red-400">Alert: 160+ bpm</span>
                </div>
                <Link href="/dashboard" className="text-primary text-xs font-medium hover:underline">View Live →</Link>
              </div>
            </FeatureCard>
          </div>

          {/* Card 3: GPS - col-span-1 row-span-2 */}
          {/* STEP 4 comment: GPS cs-1 rs-2 */}
          <div className="md:row-span-2 h-full">
            <FeatureCard
              icon={<svg width="24" height="24" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
              title="Real-Time GPS Tracking"
              description="Live location updates every 3 seconds with street-level accuracy. Know exactly where your child is, always."
              badge="GPS"
              badgeColor="bg-secondary/10 text-secondary"
              colSpan=""
              rowSpan="h-full flex flex-col"
            >
              {/* Mini map placeholder */}
              <div className="flex-1 min-h-[140px] bg-muted/50 rounded-xl overflow-hidden relative flex items-center justify-center border border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5" />
                <div className="relative z-10 text-center">
                  <div className="w-4 h-4 rounded-full bg-secondary mx-auto mb-2 animate-pulse" style={{ boxShadow: '0 0 0 8px rgba(14,165,233,0.2)' }} />
                  <div className="text-xs text-muted-foreground">Emma's Location</div>
                  <div className="text-[10px] text-secondary mt-1">Lincoln School, Chicago</div>
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground">Updated 3s ago</div>
              </div>
              <Link href="/dashboard" className="btn-primary text-xs py-2 text-center block mt-2">Open Full Map →</Link>
            </FeatureCard>
          </div>

          {/* Card 2: SOS - col-span-1 */}
          {/* STEP 4 comment: SOS cs-1 */}
          <FeatureCard
            icon={<svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
            title="SOS Panic Button"
            description="One-press emergency alert sends GPS location, audio stream, and SMS to all approved contacts instantly."
            badge="Emergency"
            badgeColor="bg-red-500/10 text-red-400"
          >
            <button
              onClick={() => { setSosTriggered(true); setTimeout(() => setSosTriggered(false), 4000); }}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 min-h-[44px] ${sosTriggered ? 'bg-red-500 text-white animate-sos-flash' : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'}`}
            >
              {sosTriggered ? '🚨 SOS SENT — Contacting Parents...' : '🔴 Test SOS Alert'}
            </button>
          </FeatureCard>

          {/* Card 4: GeoFence - col-span-1 */}
          {/* STEP 4 comment: GeoFence cs-1 */}
          <FeatureCard
            icon={<svg width="24" height="24" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>}
            title="Geo-Fencing Zones"
            description="Draw up to 10 custom safe zones. Instant alerts the moment your child enters or leaves any defined area."
            badge="3 Zones"
            badgeColor="bg-primary/10 text-primary"
          >
            <div className="flex gap-2 flex-wrap">
              {['🏫 School', '🏠 Home', '⚽ Park'].map((zone) => (
                <span key={zone} className="text-[11px] px-2.5 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">{zone}</span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">✓ All zones active • Last exit: 3:42 PM</div>
          </FeatureCard>

          {/* Card 5: Fall Detection */}
          {/* STEP 4 comment: FallDetect cs-1 */}
          <FeatureCard
            icon={<svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
            title="Fall Detection"
            description="Accelerometer detects hard impacts. 30-second confirmation window before auto-alerting emergency contacts."
            badge="Auto"
            badgeColor="bg-yellow-500/10 text-yellow-400"
          >
            {fallDetected ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">⚠️ Fall Detected! Respond in:</div>
                <div className="text-yellow-300 text-2xl font-display font-bold animate-countdown">{countdown}s</div>
                <button onClick={() => { setFallDetected(false); setCountdown(30); if (countdownRef.current) clearInterval(countdownRef.current); }} className="mt-2 text-xs text-yellow-400 underline min-h-[44px] block">I'm OK — Cancel Alert</button>
              </div>
            ) : (
              <button onClick={triggerFall} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors min-h-[44px]">
                🏃 Simulate Fall
              </button>
            )}
          </FeatureCard>

          {/* Card 6: Audio Recording */}
          {/* STEP 4 comment: AudioRecord cs-1 */}
          <FeatureCard
            icon={<svg width="24" height="24" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"/></svg>}
            title="Fear & Distress Audio"
            description="AI-powered audio analysis detects distress sounds. Automatically records and streams 10-second clips to parents."
            badge="AI"
            badgeColor="bg-purple-500/10 text-purple-400"
          >
            <div className="flex items-center gap-2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-purple-500/60 rounded-full"
                  style={{
                    height: audioPlaying ? `${8 + Math.sin(i * 0.8) * 24 + 8}px` : '4px',
                    transition: `height ${0.1 + i * 0.02}s ease`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => { setAudioPlaying(true); setTimeout(() => setAudioPlaying(false), 3000); }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${audioPlaying ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'}`}
            >
              {audioPlaying ? '🎙️ Recording... 3s' : '🎤 Simulate Distress Audio'}
            </button>
          </FeatureCard>

          {/* Card 7: Battery Monitor */}
          {/* STEP 4 comment: Battery cs-1 */}
          <FeatureCard
            icon={<svg width="24" height="24" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>}
            title="Battery & Connectivity"
            description="Real-time battery monitoring with low-power alerts. Signal strength tracking ensures your child is always reachable."
            badge={batteryLevel < 20 ? 'LOW' : 'OK'}
            badgeColor={batteryLevel < 20 ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}
          >
            <MiniBattery level={batteryLevel} />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Signal:</span>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1.5 rounded-sm ${i < 4 ? 'bg-primary' : 'bg-muted-foreground/30'}`} style={{ height: `${6 + i * 3}px` }} />
              ))}
              <span className="text-xs text-primary font-medium">Strong</span>
            </div>
          </FeatureCard>
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard" className="btn-primary px-8 py-4 text-base inline-flex items-center gap-2">
            Try All Features in Dashboard
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}