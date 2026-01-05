import React, { useState, useRef } from 'react';
import ProgressRing from './ProgressRing';
import Button from './Button';
import { useWaterData } from '@/hooks/useWaterData';
import VoiceControl from './VoiceControl';

export default function Dashboard() {
    const { settings, getTodayIntake, addWater, getTrialDetails } = useWaterData();
    const currentIntake = getTodayIntake();
    const goal = settings.dailyGoal;
    const progress = Math.min((currentIntake / goal) * 100, 100);
    const { isExpired } = getTrialDetails();

    const [adding, setAdding] = useState(false);

    const handleAdd = (amount: number, type: string) => {
        if (isExpired && !settings.isPremium) {
            alert("🔒 Trial Expired\n\nPlease upgrade to Premium in Settings to continue tracking your hydration!");
            return;
        }
        setAdding(true);
        addWater(amount);
        setTimeout(() => setAdding(false), 200);
    };

    // Drag-to-scroll logic
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDown(true);
        setIsDragging(false);
        if (sliderRef.current) {
            setStartX(e.pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDown(false);
        // Delayed reset to prevent accidental clicks
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseUp = () => {
        setIsDown(false);
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        if (sliderRef.current) {
            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            sliderRef.current.scrollLeft = scrollLeft - walk;

            // If moved significantly, consider it a drag
            if (Math.abs(walk) > 5) {
                setIsDragging(true);
            }
        }
    };

    const drinkTypes = [
        { name: 'Water', icon: '💧', amount: 250, color: 'var(--primary)' },
        { name: 'Coffee', icon: '☕', amount: 200, color: '#FF9F0A' }, // Premium
        { name: 'Tea', icon: '🍵', amount: 200, color: '#32D74B' },    // Premium
        { name: 'Soda', icon: '🥤', amount: 330, color: '#FF453A' },   // Premium
        { name: 'Juice', icon: '🧃', amount: 250, color: '#FF9500' },  // Premium
    ];

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
                    <h2 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hydration</h1>
                </div>
                {!settings.isPremium && (
                    <div style={{
                        padding: '6px 12px', borderRadius: '20px',
                        background: isExpired ? 'rgba(255, 69, 58, 0.2)' : 'rgba(45, 90, 245, 0.2)',
                        border: `1px solid ${isExpired ? 'var(--danger)' : 'var(--primary)'}`,
                        fontSize: '12px', fontWeight: 700, color: isExpired ? 'var(--danger)' : 'var(--primary)'
                    }}>
                        {isExpired ? 'EXPIRED' : 'TRIAL'}
                    </div>
                )}
            </header>

            {/* Voice Control */}
            <VoiceControl onAdd={handleAdd} isPremium={settings.isPremium} />
            {isExpired && !settings.isPremium && (
                <p style={{ color: 'var(--danger)', fontSize: '12px', textAlign: 'center', marginTop: '-20px', marginBottom: '20px', fontWeight: 600 }}>
                    Feature locked. Please upgrade to continue.
                </p>
            )}

            {/* Main Stats */}
            <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '200px', height: '200px', background: 'var(--primary)', opacity: 0.2, filter: 'blur(60px)', borderRadius: '50%', zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <ProgressRing radius={130} stroke={16} progress={progress} />
                    <div style={{ marginTop: '24px' }}>
                        <p style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>
                            {currentIntake}<span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 500 }}>ml</span>
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '4px' }}>
                            of {goal} ml goal
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Adds - Horizontal Scroll */}
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isExpired && !settings.isPremium ? '🔒 Trial Expired' : 'Quick Add'}
            </h3>

            <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{
                    display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', margin: '0 -24px', paddingLeft: '24px', paddingRight: '24px',
                    scrollbarWidth: 'none', msOverflowStyle: 'none',
                    cursor: isDown ? 'grabbing' : (isExpired && !settings.isPremium) ? 'not-allowed' : 'grab',
                    opacity: (isExpired && !settings.isPremium) ? 0.6 : 1,
                    filter: (isExpired && !settings.isPremium) ? 'grayscale(0.8)' : 'none',
                    pointerEvents: (isExpired && !settings.isPremium) ? 'none' : 'auto'
                }}>
                {drinkTypes.map((drink) => (
                    <div
                        key={drink.name}
                        onClick={() => {
                            if (!isDragging) {
                                handleAdd(drink.amount, drink.name);
                            }
                        }}
                        className="glass"
                        style={{
                            minWidth: '110px', height: '140px', borderRadius: '24px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            cursor: 'pointer', position: 'relative',
                            border: '1px solid rgba(255,255,255,0.1)',
                            opacity: 1
                        }}
                    >
                        <div style={{
                            fontSize: '40px'
                        }}>
                            {drink.icon}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '15px', display: 'block' }}>{drink.name}</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{drink.amount}ml</span>
                        </div>


                    </div>
                ))}
            </div>

            {/* Streak / Tip (Placeholder) */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                <div style={{ fontSize: '32px' }}>💡</div>
                <div>
                    <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '16px' }}>Hydration Tip</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                        Drinking water before meals can help you feel fuller and aid digestion.
                    </p>
                </div>
            </div>
        </div>
    );
}
