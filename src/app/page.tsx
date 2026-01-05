'use client';

import { useWaterData } from '@/hooks/useWaterData';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import { useState } from 'react';

export default function Home() {
  const { onboarded, completeOnboarding, loading } = useWaterData();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');


  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <>
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'history' && <History />}
      {currentTab === 'settings' && <Settings />}
      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}
