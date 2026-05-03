import React from 'react';
import Header from '@/components/Header';
import ChildDeviceContent from './components/ChildDeviceContent';

export default function ChildDevicePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header activePage="child-device" />
      <ChildDeviceContent />
    </main>
  );
}