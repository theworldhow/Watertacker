import React from 'react';
import { useWaterData } from '@/hooks/useWaterData';

export default function History() {
    const { history, settings } = useWaterData();
    const goal = settings.dailyGoal;
    const [period, setPeriod] = React.useState<'week' | 'month' | 'year'>('week');

    // Helper to format date
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d;
    };

    const getData = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const data = [];

        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const record = history.find(h => h.date === dateStr);
                data.push({
                    label: dayName.charAt(0),
                    fullLabel: dayName,
                    amount: record ? record.amount : 0,
                    date: dateStr
                });
            }
        } else if (period === 'month') {
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const record = history.find(h => h.date === dateStr);
                data.push({
                    label: d.getDate().toString(),
                    fullLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    amount: record ? record.amount : 0,
                    date: dateStr
                });
            }
        } else if (period === 'year') {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today);
                d.setMonth(d.getMonth() - i);
                d.setDate(1); // Start of month
                const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
                const year = d.getFullYear();
                const month = d.getMonth();

                // Aggregate for the month
                const monthlyTotal = history.reduce((acc, curr) => {
                    const currDate = new Date(curr.date);
                    if (currDate.getFullYear() === year && currDate.getMonth() === month) {
                        return acc + curr.amount;
                    }
                    return acc;
                }, 0);

                // Average daily for the chart or total? usage usually shows trend. 
                // Let's show average daily so it correlates with the goal line visually, 
                // or just total. If total, the goal line needs to be monthly goal.
                // Let's stick to Total and scale appropriately.
                data.push({
                    label: monthStr.charAt(0),
                    fullLabel: monthStr,
                    amount: monthlyTotal,
                    date: `${year}-${month}`
                });
            }
        }
        return data;
    };

    const chartData = getData();

    // Determine max value for scaling
    // For year view, the "goal" reference is tricky. Let's use 30x daily goal for reference or just max value.
    const getRefValue = () => {
        if (period === 'year') return goal * 30; // Approx monthly goal
        return goal;
    };

    const refValue = getRefValue();
    const maxVal = Math.max(...chartData.map(d => d.amount), refValue * 1.2);

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ paddingTop: '20px', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '34px', fontWeight: 700, margin: 0 }}>History</h1>
            </header>

            {/* View Selector */}
            <div style={{
                display: 'flex',
                background: 'rgba(118, 118, 128, 0.12)',
                padding: '2px',
                borderRadius: '8px',
                marginBottom: '30px'
            }}>
                {(['week', 'month', 'year'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: period === p ? 'var(--bg-card)' : 'transparent',
                            color: period === p ? 'var(--text-primary)' : 'var(--text-primary)',
                            padding: '6px 0',
                            borderRadius: '7px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: period === p ? '0 3px 8px rgba(0,0,0,0.12)' : 'none',
                            transition: 'all 0.2s ease',
                            textTransform: 'capitalize'
                        }}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                    {period === 'week' ? 'Last 7 Days' : period === 'month' ? 'Last 30 Days' : 'Last 12 Months'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '4px' }}>
                    {chartData.map((d, i) => {
                        const height = Math.min((d.amount / maxVal) * 100, 100);
                        const isGoalMet = d.amount >= (period === 'year' ? refValue * 0.8 : goal); // Looser goal for monthly avg?

                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <div
                                        title={`${d.fullLabel}: ${d.amount}ml`}
                                        style={{
                                            width: period === 'month' ? '6px' : period === 'year' ? '16px' : '12px',
                                            height: `${height}%`,
                                            background: isGoalMet ? 'var(--ios-blue)' : 'var(--ios-cyan)',
                                            opacity: isGoalMet ? 1 : 0.6,
                                            borderRadius: '6px',
                                            transition: 'height 0.5s ease',
                                            minHeight: '4px'
                                        }} />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'clip'
                                }}>
                                    {/* Show label sparsely for month view if needed */}
                                    {period === 'month' && i % 5 !== 0 ? '' : d.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
