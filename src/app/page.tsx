'use client';

import { useWaterData } from '@/hooks/useWaterData';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const { onboarded, completeOnboarding, loading, settings } = useWaterData();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');

  // Notification Logic
  useEffect(() => {
    if (!settings.notificationsEnabled || typeof window === 'undefined' || !('Notification' in window)) return;

    // Check permission immediately
    if (Notification.permission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      // Only notify between 8 AM and 10 PM
      if (hours >= 8 && hours < 22) {
        new Notification("Hydration Reminder", {
          body: "Time to drink some water! 💧",
          icon: "/icon.png"
        });
      }
    }, 2 * 60 * 60 * 1000); // 2 hours

    return () => clearInterval(interval);
  }, [settings.notificationsEnabled]);


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
