import React, { useState } from 'react';
import { useWaterData } from '@/hooks/useWaterData';
import Button from './Button';

export default function Settings() {
    const { settings, saveSettings, getTrialDetails } = useWaterData();
    const [notifications, setNotifications] = useState(settings.notificationsEnabled || false);
    const { daysLeft, isExpired } = getTrialDetails();

    const handlePurchase = () => {
        saveSettings({ ...settings, isPremium: true });
        alert('🎉 Lifetime Access Unlocked! \n(Reciept: $4.00 Charged)');
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="container">
            <header style={{ paddingTop: '20px', marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '8px' }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your preferences.</p>
            </header>

            {/* Premium / Trial Banner */}
            {!settings.isPremium ? (
                <div className="card" style={{
                    marginBottom: '32px',
                    background: isExpired ? 'var(--grad-accent)' : 'var(--grad-primary)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Gloss effect */}
                    <div style={{
                        position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        transform: 'rotate(45deg)', pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>
                                    {isExpired ? 'Trial Expired' : 'Premium Trial'}
                                </h3>
                                <p style={{ opacity: 0.9, fontSize: '15px', maxWidth: '90%' }}>
                                    {isExpired
                                        ? 'Unlock infinite customization and history.'
                                        : `${daysLeft} days remaining. Enjoy full access.`}
                                </p>
                            </div>
                            <div style={{ fontSize: '32px' }}>
                                {isExpired ? '🔒' : '✨'}
                            </div>
                        </div>

                        <Button
                            fullWidth
                            style={{
                                background: 'white',
                                color: isExpired ? 'var(--accent)' : 'var(--primary)',
                                fontWeight: 700
                            }}
                            onClick={handlePurchase}
                        >
                            {isExpired ? 'Unlock Lifetime Access ($4.00)' : 'Keep Forever ($4.00)'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ marginBottom: '32px', border: '1px solid var(--warning)', background: 'rgba(255, 214, 10, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--warning)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black'
                        }}>★</div>
                        <div>
                            <span style={{ fontWeight: 700, display: 'block' }}>Premium Member</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lifetime Access Active</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Section */}
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', paddingLeft: '8px' }}>Profile</h3>
            <div className="card" style={{ padding: '0', marginBottom: '32px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--bg-card-border)' }}>
                    <span>Name</span>
                    <span style={{ color: 'var(--text-muted)' }}>{settings.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                    <span>Daily Goal</span>
                    <span style={{ color: 'var(--text-muted)' }}>{settings.dailyGoal} ml</span>
                </div>
            </div>

            {/* Preferences */}
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', paddingLeft: '8px' }}>App Settings</h3>
            <div className="card" style={{ padding: '0', marginBottom: '32px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                    <span>Notifications</span>
                    <div
                        onClick={() => {
                            const newState = !notifications;
                            setNotifications(newState);
                            saveSettings({ ...settings, notificationsEnabled: newState });

                            if (newState) {
                                if ('Notification' in window) {
                                    Notification.requestPermission().then(permission => {
                                        if (permission === 'granted') {
                                            new Notification("Reminders Enabled", {
                                                body: "We'll remind you to drink water every 2 hours."
                                            });
                                        }
                                    });
                                } else {
                                    alert("Notifications not supported in this browser.");
                                }
                            }
                        }}
                        style={{
                            width: '52px',
                            height: '32px',
                            borderRadius: '16px',
                            background: notifications ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                            position: 'relative',
                            transition: 'background 0.3s',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'white',
                            position: 'absolute',
                            top: '2px',
                            left: notifications ? '22px' : '2px',
                            transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                </div>
            </div>

            <div className="card" style={{ background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.3)' }}>
                <button onClick={handleReset} style={{ color: 'var(--danger)', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontSize: '16px', fontWeight: 600, padding: 0 }}>
                    Reset Data & Account
                </button>
            </div>
        </div>
    );
}
