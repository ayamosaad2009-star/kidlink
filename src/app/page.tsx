import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import HealthReportsSection from './components/HealthReportsSection';
import PricingSection from './components/PricingSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header activePage="home" />
      <HeroSection />
      <FeaturesSection />
      <LiveDemoSection />
      <HealthReportsSection />
      <PricingSection />
      <Footer />
    </main>
  );
}