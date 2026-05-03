'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SAFE_CONTACTS = [
  { name: 'Mom', avatar: '👩', color: 'bg-primary/20 text-primary border-primary/30', phone: '+1 (312) 555-0142' },
  { name: 'Dad', avatar: '👨', color: 'bg-secondary/20 text-secondary border-secondary/30', phone: '+1 (312) 555-0183' },
  { name: 'Grandma', avatar: '👵', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', phone: '+1 (312) 555-0267' },
  { name: 'School', avatar: '🏫', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', phone: '+1 (312) 555-0301' },
  { name: 'Tom', avatar: '🏠', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', phone: '+1 (312) 555-0419' },
];

export default function ChildDeviceContent() {
  const [bpm, setBpm] = useState(74);
  const [battery, setBattery] = useState(62);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);
  const [sosFullscreen, setSosFullscreen] = useState(false);
  const [fallDetected, setFallDetected] = useState(false);
  const [fallCountdown, setFallCountdown] = useState(30);
  const [callingContact, setCallingContact] = useState<string | null>(null);
  const [audioStreaming, setAudioStreaming] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const fallTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sosTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // BPM updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(65, Math.min(95, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => (prev <= 3 ? 62 : prev - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // SOS press-and-hold
  const handleSosPress = () => {
    setSosActive(true);
    setSosCountdown(3);
    let count = 3;
    sosTimerRef.current = setInterval(() => {
      count -= 1;
      setSosCountdown(count);
      if (count <= 0) {
        clearInterval(sosTimerRef.current!);
        setSosActive(false);
        setSosFullscreen(true);
        setAudioStreaming(true);
        audioTimerRef.current = setTimeout(() => setAudioStreaming(false), 10000);
      }
    }, 1000);
  };

  const handleSosRelease = () => {
    if (sosActive && sosCountdown > 0) {
      setSosActive(false);
      setSosCountdown(3);
      if (sosTimerRef.current) clearInterval(sosTimerRef.current);
    }
  };

  const dismissSos = () => {
    setSosFullscreen(false);
    setAudioStreaming(false);
    if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
  };

  // Fall detection
  const triggerFall = () => {
    setFallDetected(true);
    setFallCountdown(30);
    if (fallTimerRef.current) clearInterval(fallTimerRef.current);
    fallTimerRef.current = setInterval(() => {
      setFallCountdown(prev => {
        if (prev <= 1) {
          clearInterval(fallTimerRef.current!);
          setFallDetected(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelFall = () => {
    setFallDetected(false);
    setFallCountdown(30);
    if (fallTimerRef.current) clearInterval(fallTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (fallTimerRef.current) clearInterval(fallTimerRef.current);
      if (sosTimerRef.current) clearInterval(sosTimerRef.current);
      if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
    };
  }, []);

  const batteryColor = battery < 20 ? 'text-red-400' : battery < 50 ? 'text-yellow-400' : 'text-primary';
  const batteryBg = battery < 20 ? 'bg-red-500' : battery < 50 ? 'bg-yellow-500' : 'bg-primary';

  return (
    <div className="pt-20 pb-10 min-h-screen flex flex-col items-center">

      {/* SOS Fullscreen Emergency */}
      {sosFullscreen && (
        <div className="fixed inset-0 z-50 bg-red-950 flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="text-center max-w-sm w-full">
            {/* Flashing SOS */}
            <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-6 animate-sos-flash">
              <span className="text-white text-4xl font-display font-bold">SOS</span>
            </div>

            <h2 className="font-display text-3xl font-bold text-white mb-2">Emergency Alert Sent!</h2>
            <p className="text-red-200 text-base mb-6">Your parents and contacts have been notified</p>

            {/* Location */}
            <div className="bg-red-900/60 border border-red-700/40 rounded-2xl p-4 mb-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" fill="none" stroke="#fca5a5" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-red-300 text-xs font-semibold uppercase tracking-wider">Live Location Shared</span>
              </div>
              <p className="text-white text-sm font-medium">Lincoln Elementary School</p>
              <p className="text-red-300 text-xs">615 W Kemper Pl, Chicago, IL 60614</p>
            </div>

            {/* Audio stream */}
            <div className={`bg-red-900/60 border rounded-2xl p-4 mb-6 ${audioStreaming ? 'border-red-400' : 'border-red-700/40'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${audioStreaming ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`}>
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">{audioStreaming ? '🔴 Audio Streaming...' : '✓ Audio stream ended'}</div>
                  <div className="text-red-300 text-xs">{audioStreaming ? '10-second clip to parents' : 'Clip sent to Mom & Dad'}</div>
                </div>
                {audioStreaming && (
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-1 bg-red-400 rounded-full animate-waveform" style={{ animationDelay: `${i * 0.07}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contacts notified */}
            <div className="flex justify-center gap-3 mb-8">
              {SAFE_CONTACTS.slice(0, 3).map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-red-800 border-2 border-red-500 flex items-center justify-center text-xl">{c.avatar}</div>
                  <span className="text-red-200 text-[10px]">{c.name}</span>
                  <span className="text-green-400 text-[10px]">✓ Notified</span>
                </div>
              ))}
            </div>

            <button
              onClick={dismissSos}
              className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-colors min-h-[52px]"
            >
              I am Safe — Cancel Alert
            </button>
          </div>
        </div>
      )}

      {/* Calling Overlay */}
      {callingContact && (
        <div className="fixed inset-0 z-40 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setCallingContact(null)}>
          <div className="glass-card rounded-3xl p-10 text-center max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4">{SAFE_CONTACTS.find(c => c.name === callingContact)?.avatar || '📞'}</div>
            <div className="font-display text-2xl font-semibold text-foreground mb-1">Calling...</div>
            <div className="text-primary text-lg mb-2">{callingContact}</div>
            <div className="text-muted-foreground text-sm mb-8 animate-pulse">Connecting...</div>
            <button
              onClick={() => setCallingContact(null)}
              className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto hover:bg-red-400 transition-colors"
              aria-label="End call"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm mx-auto px-4">
        {/* Device Frame */}
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 60px rgba(0,212,170,0.1), 0 25px 50px rgba(0,0,0,0.5)' }}>

          {/* Status Bar */}
          <div className="bg-muted/40 px-6 py-3 flex items-center justify-between border-b border-border/50">
            <span className="text-foreground text-sm font-bold">{currentTime || '10:31'}</span>
            <div className="flex items-center gap-2">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className={`w-1 rounded-sm ${i < 3 ? 'bg-primary' : 'bg-muted-foreground/30'}`} style={{ height: `${h}px` }} />
                ))}
              </div>
              {/* Battery */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-3 border border-muted-foreground/50 rounded-sm relative overflow-hidden">
                  <div className={`absolute inset-0.5 rounded-sm ${batteryBg} transition-all`} style={{ width: `${battery}%` }} />
                </div>
                <span className={`text-[10px] font-bold ${batteryColor}`}>{battery}%</span>
              </div>
            </div>
          </div>

          {/* Main Device Content */}
          <div className="p-6 flex flex-col gap-5">

            {/* Child Info + BPM */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-3xl mx-auto mb-3">
                👧
              </div>
              <div className="font-display text-xl font-semibold text-foreground">Hi, Emma! 👋</div>
              <div className="text-muted-foreground text-sm mt-0.5">You are safe · Mom is watching</div>
            </div>

            {/* Heart Rate Display */}
            <div className={`rounded-2xl p-5 text-center transition-all duration-500 ${bpm > 100 ? 'bg-red-950/40 border border-red-500/30' : 'bg-muted/60 border border-border'}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg width="20" height="20" fill={bpm > 100 ? '#ef4444' : '#00D4AA'} viewBox="0 0 24 24" className="animate-heartbeat">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-muted-foreground text-sm font-medium">Heart Rate</span>
              </div>
              <div className={`font-display text-5xl font-bold transition-colors duration-300 ${bpm > 100 ? 'text-red-400' : 'text-primary'}`}>
                {bpm}
              </div>
              <div className="text-muted-foreground text-sm mt-1">BPM · {bpm > 100 ? '⚠️ A bit high' : '✓ Feeling good!'}</div>
            </div>

            {/* GPS Status */}
            <div className="bg-muted/60 border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">📍 You're at School</div>
                <div className="text-primary text-xs">✓ Inside safe zone</div>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>

            {/* Fall Detection Alert */}
            {fallDetected && (
              <div className="bg-yellow-950/60 border-2 border-yellow-500/50 rounded-2xl p-5 text-center animate-slide-up">
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-yellow-400 font-bold text-lg mb-1">Did you fall?</div>
                <div className="text-yellow-300 text-sm mb-3">Alert sends in:</div>
                <div className="font-display text-5xl font-bold text-yellow-400 animate-countdown mb-4">{fallCountdown}</div>
                <button
                  onClick={cancelFall}
                  className="w-full py-4 rounded-xl bg-yellow-500 text-black font-bold text-base hover:bg-yellow-400 transition-colors min-h-[52px]"
                >
                  I'm OK! 👍 Cancel Alert
                </button>
              </div>
            )}

            {/* SOS Button */}
            <div className="relative flex flex-col items-center gap-3">
              {/* Ripple rings */}
              {sosActive && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full border-2 border-red-500/40 animate-ripple" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full border-2 border-red-500/30 animate-ripple" style={{ animationDelay: '0.5s' }} />
                  </div>
                </>
              )}
              <button
                onMouseDown={handleSosPress}
                onMouseUp={handleSosRelease}
                onTouchStart={handleSosPress}
                onTouchEnd={handleSosRelease}
                className={`w-36 h-36 rounded-full font-display font-bold text-white text-2xl transition-all duration-200 relative z-10 select-none ${sosActive ? 'scale-95 animate-sos-flash' : 'bg-red-500 hover:bg-red-400 active:scale-95'}`}
                style={sosActive ? { background: '#ef4444', boxShadow: '0 0 60px rgba(239,68,68,0.7)' } : { boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}
                aria-label="SOS Emergency Button"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">SOS</span>
                  <span className="text-xs font-medium opacity-80 mt-1">
                    {sosActive ? `Sending in ${sosCountdown}s...` : 'Hold 3 seconds'}
                  </span>
                </div>
              </button>
              <p className="text-muted-foreground text-xs text-center">
                Press and hold for emergency alert
              </p>
            </div>

            {/* Fall Detection Trigger */}
            {!fallDetected && (
              <button
                onClick={triggerFall}
                className="w-full py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold text-base hover:bg-yellow-500/20 transition-colors min-h-[52px] flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                Simulate Fall Detection
              </button>
            )}

            {/* Safe Contacts Quick Dial */}
            <div>
              <div className="text-foreground text-sm font-semibold mb-3">📞 Quick Dial</div>
              <div className="grid grid-cols-5 gap-2">
                {SAFE_CONTACTS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setCallingContact(c.name)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all hover:scale-105 min-h-[64px] ${c.color}`}
                    aria-label={`Call ${c.name}`}
                  >
                    <span className="text-xl">{c.avatar}</span>
                    <span className="text-[10px] font-semibold leading-none">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="border-t border-border/50 pt-4 flex items-center justify-between">
              <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors min-h-[44px] min-w-[44px] justify-center px-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span className="text-[10px]">Home</span>
              </Link>
              <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors min-h-[44px] min-w-[44px] justify-center px-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[10px]">Dashboard</span>
              </Link>
              <div className="flex flex-col items-center gap-1 text-primary min-h-[44px] min-w-[44px] justify-center px-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                <span className="text-[10px] font-semibold">Device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Label */}
        <div className="text-center mt-6">
          <div className="section-label inline-flex">KidLink Wearable · Child Interface</div>
          <p className="text-muted-foreground text-xs mt-2">Simulated child device view · Real device syncs via Bluetooth</p>
        </div>
      </div>
    </div>
  );
}