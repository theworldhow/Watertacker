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
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            >
                {/* Background Ring */}
                <circle
                    stroke="var(--ios-gray-5)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress Ring */}
                <circle
                    stroke="var(--ios-blue)"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                        strokeLinecap: 'round'
                    }}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            {/* Center Content */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span style={{ fontSize: '36px', fontWeight: 700 }}>{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
