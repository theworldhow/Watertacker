import React, { useState } from 'react';
import { useWaterData } from '@/hooks/useWaterData';
import Button from './Button';

export default function Settings() {
    const { settings, saveSettings } = useWaterData();
    const [notifications, setNotifications] = useState(true);

    const togglePremium = () => {
        saveSettings({ ...settings, isPremium: true });
        alert('🎉 Premium Activated! \n(Simulation: In a real app, this would trigger In-App Purchase)');
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ paddingTop: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '34px', fontWeight: 700, margin: 0 }}>Settings</h1>
            </header>

            {/* Profile Section */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--ios-gray)', marginBottom: '16px' }}>Profile</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--separator)' }}>
                    <span>Name</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{settings.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span>Daily Goal</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{settings.dailyGoal} ml</span>
                </div>
            </div>

            {/* Premium Banner */}
            {!settings.isPremium ? (
                <div className="card" style={{
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #007AFF 0%, #00C7BE 100%)',
                    color: 'white'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Upgrade to Premium</h3>
                    <p style={{ opacity: 0.9, marginTop: '8px', marginBottom: '16px' }}>
                        Unlock advanced analytics, custom icons, and support development.
                    </p>
                    <Button variant="secondary" fullWidth onClick={togglePremium} style={{ color: '#007AFF' }}>
                        Go Premium ($1.99/mo)
                    </Button>
                </div>
            ) : (
                <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--ios-yellow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🌟</span>
                        <span style={{ fontWeight: 600 }}>Premium Member</span>
                    </div>
                </div>
            )}

            {/* Preferences */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--ios-gray)', marginBottom: '16px' }}>Preferences</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Notifications</span>
                    <div
                        onClick={() => setNotifications(!notifications)}
                        style={{
                            width: '51px',
                            height: '31px',
                            borderRadius: '16px',
                            background: notifications ? 'var(--ios-green)' : 'var(--ios-gray-5)',
                            position: 'relative',
                            transition: 'background 0.3s',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '27px',
                            height: '27px',
                            borderRadius: '50%',
                            background: 'white',
                            position: 'absolute',
                            top: '2px',
                            left: notifications ? '22px' : '2px',
                            transition: 'left 0.3s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                </div>
            </div>

            <div className="card">
                <button onClick={handleReset} style={{ color: 'var(--ios-red)', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontSize: '17px' }}>
                    Reset Data
                </button>
            </div>
        </div>
    );
}
