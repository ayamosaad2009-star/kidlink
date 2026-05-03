'use client';
import React, { useEffect, useRef, useState } from 'react';

const WEEKLY_DATA = {
  heartRate: [74, 78, 72, 80, 76, 71, 73],
  activity: [65, 80, 55, 90, 70, 45, 85],
  sleep: [8.5, 7.2, 8.8, 7.5, 9.0, 8.2, 8.7],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export default function HealthReportsSection() {
  const hrRef = useRef<HTMLCanvasElement>(null);
  const actRef = useRef<HTMLCanvasElement>(null);
  const sleepRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'heart' | 'activity' | 'sleep'>('heart');

  useEffect(() => {
    const initCharts = async () => {
      try {
        const { default: Chart } = await import('chart.js/auto');

        const commonOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#6B7A99', font: { size: 10 } },
            },
            x: {
              grid: { display: false },
              ticks: { color: '#6B7A99', font: { size: 10 } },
            }
          }
        };

        if (hrRef.current) {
          const ctx = hrRef.current.getContext('2d');
          if (ctx) {
            const g = ctx.createLinearGradient(0, 0, 0, 150);
            g.addColorStop(0, 'rgba(0,212,170,0.3)');
            g.addColorStop(1, 'rgba(0,212,170,0)');
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: WEEKLY_DATA.days,
                datasets: [{ data: WEEKLY_DATA.heartRate, borderColor: '#00D4AA', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#00D4AA' }]
              },
              options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 60, max: 100 } } }
            });
          }
        }

        if (actRef.current) {
          const ctx = actRef.current.getContext('2d');
          if (ctx) {
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: WEEKLY_DATA.days,
                datasets: [{ data: WEEKLY_DATA.activity, backgroundColor: WEEKLY_DATA.activity.map(v => v > 75 ? '#00D4AA' : 'rgba(0,212,170,0.4)'), borderRadius: 6 }]
              },
              options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 0, max: 100 } } }
            });
          }
        }

        if (sleepRef.current) {
          const ctx = sleepRef.current.getContext('2d');
          if (ctx) {
            const g = ctx.createLinearGradient(0, 0, 0, 150);
            g.addColorStop(0, 'rgba(14,165,233,0.3)');
            g.addColorStop(1, 'rgba(14,165,233,0)');
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: WEEKLY_DATA.days,
                datasets: [{ data: WEEKLY_DATA.sleep, borderColor: '#0EA5E9', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#0EA5E9' }]
              },
              options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 5, max: 12 } } }
            });
          }
        }
      } catch (e) {
        console.error('Chart init failed', e);
      }
    };

    initCharts();
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2500);
  };

  const tabs = [
    { id: 'heart' as const, label: 'Heart Rate', color: 'text-primary', avg: '74.9 bpm' },
    { id: 'activity' as const, label: 'Activity', color: 'text-primary', avg: '70% active' },
    { id: 'sleep' as const, label: 'Sleep', color: 'text-secondary', avg: '8.3 hrs/night' },
  ];

  const summaryStats = [
    { label: 'Avg Heart Rate', value: '74.9 bpm', trend: '↓ 2 from last week', good: true },
    { label: 'Active Minutes', value: '284 min', trend: '↑ 18 from last week', good: true },
    { label: 'Avg Sleep', value: '8.3 hrs', trend: '↑ 0.4 from last week', good: true },
    { label: 'Alerts Triggered', value: '2', trend: '↓ 3 from last week', good: true },
  ];

  return (
    <section id="reports" className="py-20 relative bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Weekly Health Reports</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground mt-4 mb-4">
            Complete health insights,
            <br /><span className="text-gradient">every week</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Detailed analytics on heart rate trends, activity levels, and sleep quality — downloadable as PDF.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">Emma Chen — Weekly Report</h3>
              <p className="text-muted-foreground text-sm mt-0.5">Apr 28 – May 3, 2026 • Age 8</p>
            </div>
            <button
              onClick={handleDownload}
              className={`btn-primary px-5 py-2.5 text-sm flex items-center gap-2 min-h-[44px] ${downloading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={downloading}
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

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryStats.map((s, i) => (
              <div key={i} className="bg-muted/60 rounded-xl p-4">
                <div className="text-muted-foreground text-xs mb-1">{s.label}</div>
                <div className="font-display text-xl font-semibold text-foreground">{s.value}</div>
                <div className={`text-xs mt-1 ${s.good ? 'text-primary' : 'text-red-400'}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
                <span className={`ml-2 text-xs opacity-70`}>{tab.avg}</span>
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="h-48 relative chart-container">
            <canvas ref={hrRef} className={activeTab === 'heart' ? 'block' : 'hidden'} />
            <canvas ref={actRef} className={activeTab === 'activity' ? 'block' : 'hidden'} />
            <canvas ref={sleepRef} className={activeTab === 'sleep' ? 'block' : 'hidden'} />
          </div>
        </div>
      </div>
    </section>
  );
}