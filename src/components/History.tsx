import React from 'react';
import { useWaterData } from '@/hooks/useWaterData';

export default function History() {
    const { history, settings } = useWaterData();
    const goal = settings.dailyGoal;

    // Get last 7 days including today
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({ date: dateStr, dayName });
        }
        return days;
    };

    const weekData = getLast7Days().map(d => {
        const record = history.find(h => h.date === d.date);
        const amount = record ? record.amount : 0;
        return { ...d, amount };
    });

    const maxAmount = Math.max(...weekData.map(d => d.amount), goal * 1.2); // Scale chart to max, slightly above goal if lower

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ paddingTop: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '34px', fontWeight: 700, margin: 0 }}>History</h1>
            </header>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>This Week</h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px' }}>
                    {weekData.map(day => {
                        const height = (day.amount / maxAmount) * 100;
                        const isGoalMet = day.amount >= goal;

                        return (
                            <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '12px',
                                        height: `${height}%`,
                                        background: isGoalMet ? 'var(--ios-blue)' : 'var(--ios-cyan)',
                                        opacity: isGoalMet ? 1 : 0.6,
                                        borderRadius: '6px',
                                        transition: 'height 0.5s ease',
                                        minHeight: '4px' // Visibility
                                    }} />
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{day.dayName.charAt(0)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!settings.isPremium && (
                <div style={{
                    marginTop: '30px',
                    padding: '24px',
                    background: 'linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)',
                    borderRadius: '16px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Unlock Advanced Stats</h3>
                    <p style={{ opacity: 0.9, marginBottom: '0' }}>See monthly trends and export data with Premium.</p>
                </div>
            )}
        </div>
    );
}
