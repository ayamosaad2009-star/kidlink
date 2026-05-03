'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LiveDemoSection() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<unknown>(null);
  const [currentBpm, setCurrentBpm] = useState(73);
  const [alertShown, setAlertShown] = useState(false);
  const bpmDataRef = useRef<number[]>([72, 74, 73, 75, 71, 74, 76, 73, 72, 75, 74, 73, 71, 74, 72, 73, 75, 74, 72, 71]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [childPos, setChildPos] = useState({ lat: 41.8781, lng: -87.6298 });

  // Chart.js initialization
  useEffect(() => {
    let Chart: unknown;
    let animationFrame: number;

    const initChart = async () => {
      try {
        const mod = await import('chart.js/auto');
        Chart = mod.default;

        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');

        // @ts-expect-error dynamic import
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: bpmDataRef.current.map((_, i) => `${i}s`),
            datasets: [{
              label: 'Heart Rate (BPM)',
              data: [...bpmDataRef.current],
              borderColor: '#00D4AA',
              backgroundColor: gradient,
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: {
              y: {
                min: 50,
                max: 180,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#6B7A99', font: { size: 11 } },
              },
              x: {
                grid: { display: false },
                ticks: { color: '#6B7A99', font: { size: 10 }, maxTicksLimit: 6 },
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0D1117',
                borderColor: '#00D4AA',
                borderWidth: 1,
                titleColor: '#00D4AA',
                bodyColor: '#E8EDF5',
              }
            }
          }
        });

        // Live update
        const updateChart = () => {
          const spike = Math.random() < 0.05;
          const newBpm = spike ? 155 + Math.floor(Math.random() * 20) : 68 + Math.floor(Math.random() * 20);
          bpmDataRef.current = [...bpmDataRef.current.slice(1), newBpm];
          setCurrentBpm(newBpm);

          if (newBpm > 140 && !alertShown) setAlertShown(true);
          else if (newBpm <= 140) setAlertShown(false);

          if (chartInstanceRef.current) {
            // @ts-expect-error dynamic chart
            chartInstanceRef.current.data.datasets[0].data = [...bpmDataRef.current];
            // @ts-expect-error dynamic chart
            chartInstanceRef.current.data.datasets[0].borderColor = newBpm > 140 ? '#ef4444' : '#00D4AA';
            // @ts-expect-error dynamic chart
            chartInstanceRef.current.update('none');
          }
          animationFrame = window.setTimeout(updateChart, 1000);
        };
        animationFrame = window.setTimeout(updateChart, 1000);
      } catch (e) {
        console.error('Chart.js failed to load', e);
      }
    };

    initChart();
    return () => { window.clearTimeout(animationFrame); if (chartInstanceRef.current) { /* @ts-expect-error */ chartInstanceRef.current.destroy(); } };
  }, []);

  // Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!mapRef.current) return;
        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([41.8781, -87.6298], 15);
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Safe zone circle
        L.circle([41.8781, -87.6298], { radius: 300, color: '#00D4AA', fillColor: '#00D4AA', fillOpacity: 0.08, weight: 2 }).addTo(map);

        const childIcon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#00D4AA;border-radius:50%;border:3px solid white;box-shadow:0 0 0 6px rgba(0,212,170,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: '',
        });

        const marker = L.marker([41.8781, -87.6298], { icon: childIcon }).addTo(map);
        marker.bindPopup('<b>Emma</b><br>Safe Zone ✓<br>BPM: 73');
        markerRef.current = marker;
        setMapLoaded(true);
      } catch (e) {
        console.error('Leaflet failed', e);
      }
    };

    initMap();
  }, []);

  // Move child dot
  useEffect(() => {
    const interval = setInterval(() => {
      const newPos = {
        lat: 41.8781 + (Math.random() - 0.5) * 0.002,
        lng: -87.6298 + (Math.random() - 0.5) * 0.002,
      };
      setChildPos(newPos);
      if (markerRef.current && leafletMapRef.current) {
        // @ts-expect-error leaflet marker
        markerRef.current.setLatLng([newPos.lat, newPos.lng]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Interactive Demo</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground mt-4 mb-4">
            See KidLink in <span className="text-gradient">real action</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Live data simulation — this is exactly what the parent dashboard looks like.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heart Rate Chart */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Live Heart Rate Monitor</h3>
                <p className="text-muted-foreground text-xs mt-0.5">Emma Chen • Age 8 • Updates every second</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${currentBpm > 140 ? 'bg-red-500/20 text-red-400' : 'bg-primary/10 text-primary'}`}>
                <span className={`w-2 h-2 rounded-full ${currentBpm > 140 ? 'bg-red-500' : 'bg-primary'} animate-pulse`} />
                {currentBpm} BPM
              </div>
            </div>

            {alertShown && (
              <div className="mb-4 bg-red-950/60 border border-red-500/40 rounded-xl px-4 py-3 flex items-center gap-3">
                <svg width="18" height="18" fill="#ef4444" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <span className="text-red-300 text-sm font-semibold">⚠️ KidLink Alert: Sudden spike detected! ({currentBpm} bpm)</span>
              </div>
            )}

            <div className="chart-container h-48 relative">
              <canvas ref={chartRef} />
            </div>

            <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Normal range</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" /> Alert threshold</div>
              <div className="ml-auto text-primary font-medium">Live ●</div>
            </div>
          </div>

          {/* GPS Map */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Live GPS Tracker</h3>
                <p className="text-muted-foreground text-xs mt-0.5">Updates every 3 seconds • Chicago, IL</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Inside Zone
              </div>
            </div>

            <div ref={mapRef} className="h-48 rounded-xl overflow-hidden bg-muted border border-border relative">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground text-xs">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" fill="none" stroke="#00D4AA" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">Lincoln Elementary School</div>
                <div className="text-muted-foreground text-xs">615 W Kemper Pl, Chicago, IL 60614</div>
                <div className="text-primary text-xs mt-0.5">✓ Inside safe zone • Arrived 8:24 AM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
            Open Full Dashboard
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}