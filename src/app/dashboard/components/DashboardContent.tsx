'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SAFE_CONTACTS = [
  { name: 'Mom (Sarah)', phone: '+1 (312) 555-0142', relation: 'Parent', avatar: 'SM', color: 'bg-primary/20 text-primary' },
  { name: 'Dad (Michael)', phone: '+1 (312) 555-0183', relation: 'Parent', avatar: 'MC', color: 'bg-secondary/20 text-secondary' },
  { name: 'Grandma Rose', phone: '+1 (312) 555-0267', relation: 'Family', avatar: 'GR', color: 'bg-purple-500/20 text-purple-400' },
  { name: 'Lincoln School', phone: '+1 (312) 555-0301', relation: 'School', avatar: 'LS', color: 'bg-yellow-500/20 text-yellow-400' },
  { name: 'Neighbor (Tom)', phone: '+1 (312) 555-0419', relation: 'Neighbor', avatar: 'TK', color: 'bg-orange-500/20 text-orange-400' },
];

const ALERTS = [
  { time: '3:42 PM', msg: 'Emma left school zone', type: 'geo', icon: '📍' },
  { time: '2:15 PM', msg: 'Heart rate spike: 158 bpm', type: 'heart', icon: '❤️' },
  { time: '8:24 AM', msg: 'Emma arrived at school', type: 'geo', icon: '✅' },
  { time: '7:52 AM', msg: 'Device connected', type: 'system', icon: '🔗' },
  { time: 'Yesterday', msg: 'Weekly report ready', type: 'report', icon: '📊' },
];

const GEOFENCES = [
  { name: '🏫 Lincoln School', status: 'active', coords: 'N 41.8781°, W 87.6298°', radius: '300m' },
  { name: '🏠 Home', status: 'active', coords: 'N 41.8820°, W 87.6340°', radius: '200m' },
  { name: '⚽ Riverside Park', status: 'active', coords: 'N 41.8760°, W 87.6380°', radius: '400m' },
];

const WEEKLY_HR = [74, 78, 72, 80, 76, 71, 73];
const WEEKLY_ACTIVITY = [65, 80, 55, 90, 70, 45, 85];
const WEEKLY_SLEEP = [8.5, 7.2, 8.8, 7.5, 9.0, 8.2, 8.7];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function StatCard({
  icon, label, value, sub, color = 'text-primary', alert = false,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; color?: string; alert?: boolean;
}) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${alert ? 'border-red-500/30 bg-red-950/10' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
        {alert && <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">ALERT</span>}
      </div>
      <div className={`font-display text-2xl font-semibold ${alert ? 'text-red-400' : color}`}>{value}</div>
      <div className="text-foreground text-sm font-medium mt-0.5">{label}</div>
      <div className="text-muted-foreground text-xs mt-0.5">{sub}</div>
    </div>
  );
}

export default function DashboardContent() {
  const [bpm, setBpm] = useState(74);
  const [battery, setBattery] = useState(62);
  const [geoAlert, setGeoAlert] = useState(false);
  const [activeReport, setActiveReport] = useState<'heart' | 'activity' | 'sleep'>('heart');
  const [downloading, setDownloading] = useState(false);
  const [callingContact, setCallingContact] = useState<string | null>(null);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const reportHrRef = useRef<HTMLCanvasElement>(null);
  const reportActRef = useRef<HTMLCanvasElement>(null);
  const reportSleepRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<unknown>(null);
  const reportCharts = useRef<{ hr?: unknown; act?: unknown; sleep?: unknown }>({});
  const bpmHistory = useRef<number[]>([74, 72, 75, 73, 76, 74, 72, 78, 75, 73, 74, 72, 76, 74, 75, 73, 71, 74, 76, 73]);
  const mapInstance = useRef<unknown>(null);

  // Live BPM updates
  useEffect(() => {
    const interval = setInterval(() => {
      const spike = Math.random() < 0.04;
      const newBpm = spike ? 150 + Math.floor(Math.random() * 20) : 68 + Math.floor(Math.random() * 18);
      setBpm(newBpm);
      bpmHistory.current = [...bpmHistory.current.slice(1), newBpm];
      if (chartInstance.current) {
        // @ts-expect-error dynamic chart
        chartInstance.current.data.datasets[0].data = [...bpmHistory.current];
        // @ts-expect-error dynamic chart
        chartInstance.current.data.datasets[0].borderColor = newBpm > 140 ? '#ef4444' : '#00D4AA';
        // @ts-expect-error dynamic chart
        chartInstance.current.update('none');
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => (prev <= 3 ? 62 : prev - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Geo alert simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setGeoAlert(true);
      setTimeout(() => setGeoAlert(false), 6000);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Live BPM Chart
  useEffect(() => {
    const init = async () => {
      try {
        const { default: Chart } = await import('chart.js/auto');
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        const g = ctx.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, 'rgba(0,212,170,0.25)');
        g.addColorStop(1, 'rgba(0,212,170,0)');
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: bpmHistory.current.map((_, i) => `${i}s`),
            datasets: [{ data: [...bpmHistory.current], borderColor: '#00D4AA', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
              y: { min: 50, max: 180, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6B7A99', font: { size: 10 } } },
              x: { grid: { display: false }, ticks: { color: '#6B7A99', font: { size: 9 }, maxTicksLimit: 5 } },
            },
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: '#0D1117', borderColor: '#00D4AA', borderWidth: 1, titleColor: '#00D4AA', bodyColor: '#E8EDF5' },
            },
          },
        });
      } catch (e) { console.error(e); }
    };
    init();
    return () => {
      if (chartInstance.current) {
        try { /* @ts-expect-error */ chartInstance.current.destroy(); } catch {}
      }
    };
  }, []);

  // Weekly report charts
  useEffect(() => {
    const init = async () => {
      try {
        const { default: Chart } = await import('chart.js/auto');
        const commonOpts = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6B7A99', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#6B7A99', font: { size: 10 } } },
          },
        };
        if (reportHrRef.current) {
          const ctx = reportHrRef.current.getContext('2d');
          if (ctx) {
            const g = ctx.createLinearGradient(0, 0, 0, 120);
            g.addColorStop(0, 'rgba(0,212,170,0.3)'); g.addColorStop(1, 'rgba(0,212,170,0)');
            reportCharts.current.hr = new Chart(ctx, {
              type: 'line',
              data: { labels: DAYS, datasets: [{ data: WEEKLY_HR, borderColor: '#00D4AA', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#00D4AA' }] },
              options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, min: 60, max: 100 } } },
            });
          }
        }
        if (reportActRef.current) {
          const ctx = reportActRef.current.getContext('2d');
          if (ctx) {
            reportCharts.current.act = new Chart(ctx, {
              type: 'bar',
              data: { labels: DAYS, datasets: [{ data: WEEKLY_ACTIVITY, backgroundColor: WEEKLY_ACTIVITY.map(v => v > 75 ? '#00D4AA' : 'rgba(0,212,170,0.4)'), borderRadius: 6 }] },
              options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, min: 0, max: 100 } } },
            });
          }
        }
        if (reportSleepRef.current) {
          const ctx = reportSleepRef.current.getContext('2d');
          if (ctx) {
            const g = ctx.createLinearGradient(0, 0, 0, 120);
            g.addColorStop(0, 'rgba(14,165,233,0.3)'); g.addColorStop(1, 'rgba(14,165,233,0)');
            reportCharts.current.sleep = new Chart(ctx, {
              type: 'line',
              data: { labels: DAYS, datasets: [{ data: WEEKLY_SLEEP, borderColor: '#0EA5E9', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#0EA5E9' }] },
              options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, min: 5, max: 12 } } },
            });
          }
        }
      } catch (e) { console.error(e); }
    };
    init();
    return () => {
      Object.values(reportCharts.current).forEach(c => {
        if (c) { try { /* @ts-expect-error */ c.destroy(); } catch {} }
      });
    };
  }, []);

  // Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const init = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        if (!mapRef.current) return;
        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([41.8781, -87.6298], 14);
        mapInstance.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        L.circle([41.8781, -87.6298], { radius: 300, color: '#00D4AA', fillColor: '#00D4AA', fillOpacity: 0.08, weight: 2 }).addTo(map);
        L.circle([41.8820, -87.6340], { radius: 200, color: '#0EA5E9', fillColor: '#0EA5E9', fillOpacity: 0.08, weight: 2 }).addTo(map);
        L.circle([41.8760, -87.6380], { radius: 400, color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.06, weight: 2 }).addTo(map);
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#00D4AA;border-radius:50%;border:3px solid white;box-shadow:0 0 0 8px rgba(0,212,170,0.25);"></div>`,
          iconSize: [16, 16], iconAnchor: [8, 8], className: '',
        });
        L.marker([41.8781, -87.6298], { icon }).addTo(map).bindPopup('<b>Emma</b><br>Safe ✓');
      } catch (e) { console.error(e); }
    };
    init();
    return () => {
      if (mapInstance.current) {
        try { /* @ts-expect-error */ mapInstance.current.remove(); mapInstance.current = null; } catch {}
      }
    };
  }, []);

  const batteryColor = battery < 20 ? 'text-red-400' : battery < 50 ? 'text-yellow-400' : 'text-primary';
  const batteryBg = battery < 20 ? 'bg-red-500' : battery < 50 ? 'bg-yellow-500' : 'bg-primary';

  const handleCall = (name: string) => {
    setCallingContact(name);
    setTimeout(() => setCallingContact(null), 3000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">Parent Dashboard</h1>
              <span className="section-label text-[10px] py-1">Live</span>
            </div>
            <p className="text-muted-foreground text-sm">Monitoring Emma Chen, age 8 · May 3, 2026</p>
          </div>
          <div className="flex gap-3">
            <Link href="/child-device" className="btn-outline px-4 py-2.5 text-sm min-h-[44px] flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              Child View
            </Link>
            <button className="btn-primary px-4 py-2.5 text-sm min-h-[44px]">+ Add Child</button>
          </div>
        </div>

        {/* Geo-Fence Alert Banner */}
        {geoAlert && (
          <div className="mb-6 bg-yellow-950/60 border border-yellow-500/40 rounded-2xl p-4 flex items-start gap-4 animate-slide-up">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-yellow-400 font-bold text-sm">🚨 Geo-Fence Alert!</div>
              <div className="text-foreground text-sm mt-0.5">Emma has left the <strong>Lincoln School</strong> safe zone</div>
              <div className="text-muted-foreground text-xs mt-1">📍 Currently at: Oak St & Michigan Ave, Chicago · 3:42 PM</div>
              <div className="flex gap-2 mt-3">
                <button className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors min-h-[44px]" onClick={() => handleCall('Emma')}>
                  📞 Call Emma
                </button>
                <button className="border border-yellow-500/40 text-yellow-300 px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-500/10 transition-colors min-h-[44px]" onClick={() => setGeoAlert(false)}>
                  Dismiss
                </button>
              </div>
            </div>
            <button onClick={() => setGeoAlert(false)} className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
          </div>
        )}

        {/* Low Battery Banner */}
        {battery < 20 && (
          <div className="mb-6 bg-red-950/60 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span className="text-red-300 text-sm font-semibold">🔋 Low Battery — Emma's device: {battery}% — Please charge soon</span>
          </div>
        )}

        {/* Calling Overlay */}
        {callingContact && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center" onClick={() => setCallingContact(null)}>
            <div className="glass-card rounded-3xl p-10 text-center max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg width="36" height="36" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div className="text-foreground font-display text-xl font-semibold mb-1">Calling...</div>
              <div className="text-primary text-base mb-6">{callingContact}</div>
              <button onClick={() => setCallingContact(null)} className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto hover:bg-red-400 transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={
              <svg width="20" height="20" fill={bpm > 140 ? '#ef4444' : '#00D4AA'} viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            }
            label="Heart Rate"
            value={`${bpm} BPM`}
            sub={bpm > 140 ? '⚠️ Above normal' : '✓ Normal range'}
            color={bpm > 140 ? 'text-red-400' : 'text-primary'}
            alert={bpm > 140}
          />
          <StatCard
            icon={
              <svg width="20" height="20" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            }
            label="GPS Status"
            value="Active"
            sub="Lincoln School zone"
            color="text-secondary"
          />
          <StatCard
            icon={
              <svg width="20" height="20" fill="none" stroke={battery < 20 ? '#ef4444' : '#00D4AA'} strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="18" height="10" rx="2"/><path strokeLinecap="round" d="M22 11v2"/>
              </svg>
            }
            label="Battery"
            value={`${battery}%`}
            sub={battery < 20 ? '⚠️ Charge soon' : '✓ Sufficient'}
            color={batteryColor}
            alert={battery < 20}
          />
          <StatCard
            icon={
              <svg width="20" height="20" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            }
            label="Safe Zone"
            value="Inside ✓"
            sub="3 zones active"
            color="text-primary"
          />
        </div>

        {/* Live Chart + GPS Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Heart Rate Chart */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Live Heart Rate</h3>
                <p className="text-muted-foreground text-xs mt-0.5">Updates every 1.5s</p>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${bpm > 140 ? 'bg-red-500/15 text-red-400' : 'bg-primary/10 text-primary'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {bpm} BPM
              </div>
            </div>
            <div className="h-44 chart-container">
              <canvas ref={chartRef} />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" /> Alert &gt;140</span>
              <span className="ml-auto text-primary">● Live</span>
            </div>
          </div>

          {/* GPS Map */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Live GPS Map</h3>
                <p className="text-muted-foreground text-xs mt-0.5">3 safe zones active</p>
              </div>
              <span className="text-xs text-primary flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Live
              </span>
            </div>
            <div ref={mapRef} className="h-44 rounded-xl overflow-hidden bg-muted border border-border" />
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/40 inline-block" /> School</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary/40 inline-block" /> Home</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400/40 inline-block" /> Park</span>
            </div>
          </div>
        </div>

        {/* Geo-fencing + Safe Contacts + Alert History */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Geo-fencing Zones */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base font-semibold text-foreground">Geo-Fencing Zones</h3>
              <button className="text-primary text-xs font-medium hover:underline min-h-[44px] flex items-center">+ Add Zone</button>
            </div>
            <div className="flex flex-col gap-3">
              {GEOFENCES.map((zone, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <div className="text-foreground text-sm font-medium">{zone.name}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{zone.radius} radius</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Active
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
              Last exit: Lincoln School at 3:42 PM
            </div>
          </div>

          {/* Safe Contacts */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base font-semibold text-foreground">Safe Contacts</h3>
              <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-full">{SAFE_CONTACTS.length}/5</span>
            </div>
            <div className="flex flex-col gap-3">
              {SAFE_CONTACTS.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {c.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-foreground text-xs font-semibold leading-tight truncate">{c.name}</div>
                      <div className="text-muted-foreground text-[10px]">{c.relation}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCall(c.name)}
                      className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
                      aria-label={`Call ${c.name}`}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
                      aria-label={`Message ${c.name}`}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert History */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base font-semibold text-foreground">Alert History</h3>
              <span className="text-muted-foreground text-xs">Today</span>
            </div>
            <div className="flex flex-col gap-3">
              {ALERTS.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                  <span className="text-base flex-shrink-0 mt-0.5">{alert.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-xs font-medium leading-snug">{alert.msg}</div>
                    <div className="text-muted-foreground text-[10px] mt-0.5">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Health Report */}
        <div className="glass-card rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">Weekly Health Report</h3>
              <p className="text-muted-foreground text-sm mt-0.5">Apr 28 – May 3, 2026</p>
            </div>
            <button
              onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2500); }}
              disabled={downloading}
              className={`btn-primary px-5 py-2.5 text-sm flex items-center gap-2 min-h-[44px] ${downloading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Avg Heart Rate', value: '74.9 bpm', trend: '↓ 2 from last week', good: true },
              { label: 'Active Minutes', value: '284 min', trend: '↑ 18 from last week', good: true },
              { label: 'Avg Sleep', value: '8.3 hrs', trend: '↑ 0.4 from last week', good: true },
              { label: 'Alerts Sent', value: '2', trend: '↓ 3 from last week', good: true },
            ].map((s, i) => (
              <div key={i} className="bg-muted/60 rounded-xl p-4">
                <div className="text-muted-foreground text-xs mb-1">{s.label}</div>
                <div className="font-display text-xl font-semibold text-foreground">{s.value}</div>
                <div className={`text-xs mt-1 ${s.good ? 'text-primary' : 'text-red-400'}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {([
              { id: 'heart' as const, label: 'Heart Rate', avg: '74.9 bpm' },
              { id: 'activity' as const, label: 'Activity', avg: '70% active' },
              { id: 'sleep' as const, label: 'Sleep', avg: '8.3 hrs' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] ${activeReport === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">{tab.avg}</span>
              </button>
            ))}
          </div>

          <div className="h-48 relative chart-container">
            <canvas ref={reportHrRef} className={activeReport === 'heart' ? 'block' : 'hidden'} />
            <canvas ref={reportActRef} className={activeReport === 'activity' ? 'block' : 'hidden'} />
            <canvas ref={reportSleepRef} className={activeReport === 'sleep' ? 'block' : 'hidden'} />
          </div>
        </div>

      </div>
    </div>
  );
}