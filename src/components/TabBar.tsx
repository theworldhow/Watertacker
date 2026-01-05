import React from 'react';

interface TabBarProps {
    currentTab: 'dashboard' | 'history' | 'settings';
    onTabChange: (tab: 'dashboard' | 'history' | 'settings') => void;
}

export default function TabBar({ currentTab, onTabChange }: TabBarProps) {
    const tabs = [
        { id: 'dashboard', icon: '💧', label: 'Hydrate' },
        { id: 'history', icon: '📊', label: 'History' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
    ] as const;

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-secondary)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--separator)',
            display: 'flex',
            justifyContent: 'space-around',
            paddingBottom: '20px', // Safety padding for iPhone home indicator
            paddingTop: '10px',
            zIndex: 100
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as any)}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        color: currentTab === tab.id ? 'var(--ios-blue)' : 'var(--text-secondary)',
                        fontSize: '10px',
                        fontWeight: 500,
                        width: '60px'
                    }}
                >
                    <span style={{ fontSize: '24px' }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
