import React from 'react';
import { useWaterData } from '@/context/WaterDataContext';

export default function History() {
    const { history, settings } = useWaterData();
    const goal = settings.dailyGoal;
    const [period, setPeriod] = React.useState<'week' | 'month' | 'year'>('week');

    // Helper to get local date string (YYYY-MM-DD) without timezone issues
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getData = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const data = [];

        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = getLocalDateString(d);
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
                const dateStr = getLocalDateString(d);
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

    // Determine max value for scaling - use a reasonable max that makes bars visible
    const getMaxValue = () => {
        const maxDataValue = Math.max(...chartData.map(d => d.amount), 0);
        
        if (period === 'year') {
            // For year view, use monthly totals - max around goal * 30 days
            return Math.max(maxDataValue, goal * 30) * 1.1;
        }
        
        // For week/month view, use a max of 3500ml or the highest data point
        // This ensures bars are nicely distributed
        const baseMax = Math.max(maxDataValue, goal, 2000);
        return Math.min(baseMax * 1.2, 4000); // Cap at 4000ml for visibility
    };

    const refValue = period === 'year' ? goal * 30 : goal;
    const maxVal = getMaxValue();

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

                {/* Chart bars - using fixed pixel heights */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', gap: '4px', paddingTop: '20px' }}>
                    {chartData.map((d, i) => {
                        // Calculate height in pixels (max bar height = 160px)
                        const maxBarHeight = 160;
                        const hasData = d.amount > 0;
                        const isGoalMet = d.amount >= (period === 'year' ? refValue * 0.8 : goal);
                        
                        // Calculate bar height in pixels
                        let barHeightPx = 4; // Default for no data
                        if (hasData) {
                            const ratio = d.amount / maxVal;
                            barHeightPx = Math.max(Math.round(ratio * maxBarHeight), 12); // Min 12px
                        }

                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                {/* Show amount above bar if has data */}
                                <span style={{ 
                                    fontSize: '9px', 
                                    color: hasData ? '#22D3EE' : 'transparent', 
                                    fontWeight: 600,
                                    marginBottom: '4px',
                                    height: '14px'
                                }}>
                                    {d.amount > 0 ? d.amount : ''}
                                </span>
                                {/* Bar container */}
                                <div style={{ 
                                    height: `${maxBarHeight}px`, 
                                    display: 'flex', 
                                    alignItems: 'flex-end', 
                                    justifyContent: 'center',
                                    width: '100%'
                                }}>
                                    <div
                                        style={{
                                            width: period === 'month' ? '8px' : '16px',
                                            height: `${barHeightPx}px`,
                                            backgroundColor: hasData ? (isGoalMet ? '#4ADE80' : '#22D3EE') : 'rgba(255,255,255,0.15)',
                                            borderRadius: '4px',
                                            transition: 'height 0.3s ease',
                                        }} 
                                    />
                                </div>
                                {/* Day label */}
                                <span style={{
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.5)',
                                    marginTop: '6px',
                                    height: '14px'
                                }}>
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
