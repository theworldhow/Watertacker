import { useState, useEffect } from 'react';

export interface UserSettings {
    name: string;
    weight: number; // in kg
    activityLevel: 'low' | 'moderate' | 'high';
    dailyGoal: number; // in ml
    isPremium: boolean;
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
};

export function useWaterData() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [history, setHistory] = useState<DayRecord[]>([]);
    const [onboarded, setOnboarded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load from local storage
        const storedSettings = localStorage.getItem('water_settings');
        const storedHistory = localStorage.getItem('water_history');
        const storedOnboarded = localStorage.getItem('water_onboarded');

        if (storedSettings) setSettings(JSON.parse(storedSettings));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedOnboarded) setOnboarded(JSON.parse(storedOnboarded));

        setLoading(false);
    }, []);

    const saveSettings = (newSettings: UserSettings) => {
        setSettings(newSettings);
        localStorage.setItem('water_settings', JSON.stringify(newSettings));
    };

    const completeOnboarding = (data: UserSettings) => {
        saveSettings(data);
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

    return {
        settings,
        saveSettings,
        history,
        onboarded,
        completeOnboarding,
        addWater,
        getTodayIntake,
        loading
    };
}
