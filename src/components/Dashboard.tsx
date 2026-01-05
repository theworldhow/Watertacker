import React, { useState } from 'react';
import ProgressRing from './ProgressRing';
import Button from './Button';
import { useWaterData } from '@/hooks/useWaterData';

export default function Dashboard() {
    const { settings, getTodayIntake, addWater } = useWaterData();
    const currentIntake = getTodayIntake();
    const goal = settings.dailyGoal;
    const progress = Math.min((currentIntake / goal) * 100, 100);

    const [adding, setAdding] = useState(false);

    const handleAdd = (amount: number) => {
        setAdding(true);
        addWater(amount);
        // Add simple haptic feedback visual or logic here if needed
        setTimeout(() => setAdding(false), 200);
    };

    return (
        <div className="container">
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                marginBottom: '40px'
            }}>
                <div>
                    <h2 style={{ fontSize: '14px', color: 'var(--ios-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <h1 style={{ fontSize: '34px', fontWeight: 700, margin: 0 }}>Hydration</h1>
                </div>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--ios-gray-6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    👤
                </div>
            </header>

            {/* Main Stats */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <ProgressRing radius={120} stroke={12} progress={progress} />
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 600 }}>
                        {currentIntake} <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>/ {goal} ml</span>
                    </p>
                </div>
            </div>

            {/* Quick Adds */}
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Quick Add</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                <Button
                    variant="secondary"
                    onClick={() => handleAdd(250)}
                    style={{ height: '80px', flexDirection: 'column', gap: '8px' }}
                >
                    <span style={{ fontSize: '24px' }}>🥛</span>
                    <span>250 ml</span>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handleAdd(500)}
                    style={{ height: '80px', flexDirection: 'column', gap: '8px' }}
                >
                    <span style={{ fontSize: '24px' }}>🥤</span>
                    <span>500 ml</span>
                </Button>
            </div>

            {/* Streak / Tip (Placeholder) */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px' }}>💡</div>
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>Did you know?</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Drinking water before meals can help you feel fuller.
                    </p>
                </div>
            </div>
        </div>
    );
}
