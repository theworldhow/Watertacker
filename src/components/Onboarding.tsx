import React, { useState } from 'react';
import Button from './Button';
import { UserSettings } from '@/hooks/useWaterData';

interface OnboardingProps {
    onComplete: (data: Omit<UserSettings, 'installDate'>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(70);
    const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate');

    const calculateGoal = () => {
        let goal = weight * 35; // Base: 35ml per kg
        if (activity === 'moderate') goal += 350;
        if (activity === 'high') goal += 700;
        return Math.round(goal / 100) * 100; // Round to nearest 100
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleFinish = () => {
        onComplete({
            name,
            weight,
            activityLevel: activity,
            dailyGoal: calculateGoal(),
            isPremium: false,
        });
    };

    const StepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3].map(i => (
                <div
                    key={i}
                    className={`dot ${step >= i ? 'active' : ''}`}
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: step >= i ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        boxShadow: step >= i ? '0 0 10px var(--primary)' : 'none'
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <style jsx>{`
                .step-indicator {
                  display: flex;
                  justify-content: center;
                  gap: 12px;
                  margin-bottom: 40px;
                }
                input, select {
                  width: 100%;
                  padding: 20px;
                  border-radius: 20px;
                  background: rgba(255,255,255,0.05);
                  border: 1px solid rgba(255,255,255,0.1);
                  color: white;
                  font-size: 18px;
                  margin-bottom: 24px;
                  font-family: var(--font-main);
                  outline: none;
                  transition: all 0.2s;
                }
                input:focus {
                    border-color: var(--primary);
                    background: rgba(45, 90, 245, 0.1);
                }
                label {
                  display: block;
                  margin-bottom: 12px;
                  font-weight: 600;
                  color: var(--text-muted);
                  font-size: 14px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .option-card {
                    padding: 20px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    transition: all 0.2s;
                }
                .option-card.selected {
                    background: rgba(45, 90, 245, 0.1);
                    border-color: var(--primary);
                    box-shadow: 0 0 20px rgba(45, 90, 245, 0.2);
                }
                .slide-enter {
                    animation: slideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <StepIndicator />

            {step === 1 && (
                <div className="slide-enter">
                    <h1 style={{ marginBottom: '16px', fontSize: '40px', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                        Hydrate in Style
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '18px', textAlign: 'center', lineHeight: '1.5' }}>
                        Let's personalize your plan. <br /> Start your <span style={{ color: 'var(--secondary)' }}>7-day free premium trial</span> today.
                    </p>

                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />

                    <Button fullWidth onClick={handleNext} disabled={!name}>Let's Go</Button>
                </div>
            )}

            {step === 2 && (
                <div className="slide-enter">
                    <h1 style={{ marginBottom: '16px' }}>Body Stats</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>To calculate your perfect daily goal.</p>

                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    />

                    <label>Activity Level</label>
                    <div style={{ marginBottom: '40px' }}>
                        {(['low', 'moderate', 'high'] as const).map((level) => (
                            <div
                                key={level}
                                onClick={() => setActivity(level)}
                                className={`option-card ${activity === level ? 'selected' : ''}`}
                            >
                                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{level}</span>
                                {activity === level && <span style={{ color: 'var(--primary)' }}>●</span>}
                            </div>
                        ))}
                    </div>

                    <Button fullWidth onClick={handleNext} disabled={weight <= 0}>Continue</Button>
                </div>
            )}

            {step === 3 && (
                <div className="slide-enter" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'var(--grad-primary)',
                        boxShadow: '0 10px 40px rgba(45, 90, 245, 0.4)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '48px', margin: '0 auto 32px auto',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        💧
                    </div>

                    <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>{calculateGoal()} ml</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px' }}>Daily Goal Reached</p>

                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontWeight: 600 }}>Free Trial</span>
                            <span style={{ color: 'var(--success)' }}>Active</span>
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                            You have 7 days of full Premium access. After that, unlock lifetime access for just <strong>$4.00</strong>.
                        </p>
                    </div>

                    <Button fullWidth variant="primary" onClick={handleFinish}>Start Hydrating</Button>
                </div>
            )}
        </div>
    );
}
