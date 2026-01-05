import React from 'react';

interface ProgressRingProps {
    radius: number;
    stroke: number;
    progress: number; // 0 to 100
}

export default function ProgressRing({ radius, stroke, progress }: ProgressRingProps) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: radius * 2, height: radius * 2, margin: '0 auto' }}>
            {/* Gradient Definition */}
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00E0FF" />
                        <stop offset="100%" stopColor="#2D5AF5" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            >
                {/* Background Ring */}
                <circle
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Progress Ring with Glow */}
                <circle
                    stroke="url(#progressGradient)"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        strokeLinecap: 'round',
                        filter: 'url(#glow)'
                    }}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
    );
}
