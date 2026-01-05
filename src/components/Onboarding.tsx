import React, { useState } from 'react';
import Button from './Button';
import { UserSettings } from '@/hooks/useWaterData';

interface OnboardingProps {
    onComplete: (data: UserSettings) => void;
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

    const fadeIn = { animation: 'fadeIn 0.5s ease-out' };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ios-gray-5);
          transition: background 0.3s;
        }
        .dot.active {
          background: var(--ios-blue);
        }
        input, select {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          background: var(--ios-gray-6);
          border: none;
          font-size: 17px;
          margin-bottom: 20px;
          -webkit-appearance: none;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--ios-gray);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

            <div className="step-indicator">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`dot ${step >= i ? 'active' : ''}`} />
                ))}
            </div>

            {step === 1 && (
                <div style={fadeIn}>
                    <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '10px' }}>Welcome</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '17px' }}>Let's get to know you better to personalize your hydration plan.</p>

                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />

                    <Button fullWidth onClick={handleNext} disabled={!name}>Continue</Button>
                </div>
            )}

            {step === 2 && (
                <div style={fadeIn}>
                    <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '10px' }}>About You</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '17px' }}>This helps us calculate your daily water need.</p>

                    <label>Weight (kg)</label>
                    <input
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    />

                    <label>Activity Level</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                        {(['low', 'moderate', 'high'] as const).map((level) => (
                            <div
                                key={level}
                                onClick={() => setActivity(level)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: activity === level ? 'rgba(0,122,255,0.1)' : 'var(--ios-gray-6)',
                                    border: activity === level ? '2px solid var(--ios-blue)' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{level}</span>
                                {activity === level && <span style={{ color: 'var(--ios-blue)' }}>✓</span>}
                            </div>
                        ))}
                    </div>

                    <Button fullWidth onClick={handleNext} disabled={weight <= 0}>Continue</Button>
                </div>
            )}

            {step === 3 && (
                <div style={fadeIn}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--ios-blue)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '40px', margin: '0 auto 20px auto'
                        }}>
                            💧
                        </div>
                        <h1 style={{ fontSize: '34px', fontWeight: 700 }}>{calculateGoal()} ml</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '17px' }}>Your recommended daily goal.</p>
                    </div>

                    <div className="card" style={{ marginBottom: '30px', textAlign: 'center' }}>
                        <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                            We'll remind you to drink water throughout the day to meet this goal.
                        </p>
                    </div>

                    <Button fullWidth onClick={handleFinish}>Start Hydrating</Button>
                </div>
            )}
        </div>
    );
}
