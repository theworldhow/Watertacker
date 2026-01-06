'use client';

import { useWaterData } from '@/hooks/useWaterData';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function Home() {
  const { onboarded, completeOnboarding, settings } = useWaterData();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');

  // Notification Logic
  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    const scheduleNotifications = async () => {
      try {
        // Check if we have permission
        const permission = await LocalNotifications.checkPermissions();
        if (permission.display !== 'granted') return;

        // Cancel any existing notifications
        await LocalNotifications.cancel({ notifications: [{ id: 100 }, { id: 101 }, { id: 102 }, { id: 103 }, { id: 104 }, { id: 105 }] });

        // Schedule notifications every 2 hours from 8 AM to 10 PM
        const notifications = [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (let hour = 8; hour < 22; hour += 2) {
          const notificationTime = new Date(today);
          notificationTime.setHours(hour, 0, 0, 0);

          // Only schedule if the time is in the future
          if (notificationTime > now) {
            notifications.push({
              title: "Hydration Reminder",
              body: "Time to drink some water! 💧",
              id: 100 + (hour - 8) / 2,
              schedule: { at: notificationTime, allowWhileIdle: true },
              sound: undefined,
              attachments: undefined,
              actionTypeId: "",
              extra: null
            });
          }
        }

        if (notifications.length > 0) {
          await LocalNotifications.schedule({ notifications });
        }
      } catch (error) {
        console.error("Error scheduling notifications:", error);
      }
    };

    scheduleNotifications();

    // Re-schedule daily
    const dailyInterval = setInterval(scheduleNotifications, 24 * 60 * 60 * 1000);
    return () => clearInterval(dailyInterval);
  }, [settings.notificationsEnabled]);




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
