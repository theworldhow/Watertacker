import { useState, useEffect } from 'react';

export interface UserSettings {
    name: string;
    weight: number; // in kg
    activityLevel: 'low' | 'moderate' | 'high';
    dailyGoal: number; // in ml
    isPremium: boolean;
    installDate: string; // ISO Date String
    notificationsEnabled?: boolean;
}

export interface DayRecord {
    date: string; // YYYY-MM-DD
    amount: number;
}

const DEFAULT_SETTINGS: UserSettings = {
    name: '',
    weight: 0,
    activityLevel: 'moderate',
    dailyGoal: 2000,
    isPremium: false,
    installDate: '',
    notificationsEnabled: false,
};

const TRIAL_DAYS = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function useWaterData() {
    const [settings, setSettings] = useState<UserSettings>(() => {
        if (typeof window === 'undefined') return DEFAULT_SETTINGS;
        const stored = localStorage.getItem('water_settings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (!parsed.installDate) {
                    parsed.installDate = new Date().toISOString();
                    localStorage.setItem('water_settings', JSON.stringify(parsed));
                }
                return parsed;
            } catch {
                return DEFAULT_SETTINGS;
            }
        }
        return DEFAULT_SETTINGS;
    });

    const [history, setHistory] = useState<DayRecord[]>(() => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('water_history');
        if (stored) {
            try { return JSON.parse(stored); } catch { return []; }
        }
        return [];
    });

    const [onboarded, setOnboarded] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const stored = localStorage.getItem('water_onboarded');
        if (stored) {
            try { return JSON.parse(stored); } catch { return false; }
        }
        return false;
    });

    // const [loading, setLoading] = useState(false); 

    useEffect(() => {
        // Data is now loaded via lazy initialization
    }, []);

    const saveSettings = (newSettings: UserSettings) => {
        setSettings(newSettings);
        localStorage.setItem('water_settings', JSON.stringify(newSettings));
    };

    const completeOnboarding = (data: Omit<UserSettings, 'installDate'>) => {
        const fullData: UserSettings = {
            ...data,
            installDate: new Date().toISOString()
        };
        saveSettings(fullData);
        setOnboarded(true);
        localStorage.setItem('water_onboarded', 'true');
    };

    const addWater = (amount: number) => {
        const today = new Date().toISOString().split('T')[0];
        const newHistory = [...history];
        const todayRecordIndex = newHistory.findIndex(r => r.date === today);

        if (todayRecordIndex >= 0) {
            newHistory[todayRecordIndex].amount += amount;
        } else {
            newHistory.push({ date: today, amount });
        }

        setHistory(newHistory);
        localStorage.setItem('water_history', JSON.stringify(newHistory));
    };

    const getTodayIntake = () => {
        const today = new Date().toISOString().split('T')[0];
        const record = history.find(r => r.date === today);
        return record ? record.amount : 0;
    };

    const getTrialDetails = () => {
        if (!settings.installDate) return { daysLeft: 7, isExpired: false };

        const installTime = new Date(settings.installDate).getTime();
        const now = Date.now();
        const diffDays = (now - installTime) / ONE_DAY_MS;

        const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - diffDays));
        const isExpired = diffDays >= TRIAL_DAYS;

        return { daysLeft, isExpired };
    };

    return {
        settings,
        saveSettings,
        history,
        onboarded,
        completeOnboarding,
        addWater,
        getTodayIntake,
        getTrialDetails
    };
}
