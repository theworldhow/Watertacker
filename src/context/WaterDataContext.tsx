'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserSettings {
    name: string;
    weight: number;
    activityLevel: 'low' | 'moderate' | 'high';
    dailyGoal: number;
    isPremium: boolean;
    installDate: string;
    notificationsEnabled?: boolean;
}

export interface DayRecord {
    date: string;
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

interface WaterDataContextType {
    settings: UserSettings;
    saveSettings: (newSettings: UserSettings) => void;
    history: DayRecord[];
    onboarded: boolean | null; // null = still loading
    isLoading: boolean;
    completeOnboarding: (data: Omit<UserSettings, 'installDate'>) => void;
    addWater: (amount: number) => void;
    getTodayIntake: () => number;
    getTrialDetails: () => { daysLeft: number; isExpired: boolean };
}

const WaterDataContext = createContext<WaterDataContextType | undefined>(undefined);

export function WaterDataProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [history, setHistory] = useState<DayRecord[]>([]);
    const [onboarded, setOnboarded] = useState<boolean | null>(null); // null = loading
    const [isInitialized, setIsInitialized] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Load settings
        const storedSettings = localStorage.getItem('water_settings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                if (!parsed.installDate) {
                    parsed.installDate = new Date().toISOString();
                    localStorage.setItem('water_settings', JSON.stringify(parsed));
                }
                setSettings(parsed);
            } catch {
                setSettings(DEFAULT_SETTINGS);
            }
        }

        // Load history
        const storedHistory = localStorage.getItem('water_history');
        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory));
            } catch {
                setHistory([]);
            }
        }

        // Load onboarded status
        const storedOnboarded = localStorage.getItem('water_onboarded');
        if (storedOnboarded) {
            try {
                setOnboarded(JSON.parse(storedOnboarded));
            } catch {
                setOnboarded(false);
            }
        } else {
            setOnboarded(false);
        }

        setIsInitialized(true);
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

    // Helper to get local date string (YYYY-MM-DD) without timezone issues
    const getLocalDateString = (date: Date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const addWater = (amount: number) => {
        const today = getLocalDateString();
        
        setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            const todayRecordIndex = newHistory.findIndex(r => r.date === today);

            if (todayRecordIndex >= 0) {
                newHistory[todayRecordIndex] = {
                    ...newHistory[todayRecordIndex],
                    amount: newHistory[todayRecordIndex].amount + amount
                };
            } else {
                newHistory.push({ date: today, amount });
            }

            localStorage.setItem('water_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const getTodayIntake = () => {
        const today = getLocalDateString();
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

    return (
        <WaterDataContext.Provider value={{
            settings,
            saveSettings,
            history,
            onboarded,
            isLoading: !isInitialized,
            completeOnboarding,
            addWater,
            getTodayIntake,
            getTrialDetails
        }}>
            {children}
        </WaterDataContext.Provider>
    );
}

export function useWaterData() {
    const context = useContext(WaterDataContext);
    if (context === undefined) {
        throw new Error('useWaterData must be used within a WaterDataProvider');
    }
    return context;
}

