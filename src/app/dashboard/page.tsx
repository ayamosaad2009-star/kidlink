import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardContent from './components/DashboardContent';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header activePage="dashboard" />
      <DashboardContent />
      <Footer />
    </main>
  );
}