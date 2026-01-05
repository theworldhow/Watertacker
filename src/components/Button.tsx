import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'btn-primary' :
        variant === 'secondary' ? 'btn-secondary' : 'btn-outline';
    const widthClass = fullWidth ? 'w-full' : '';

    // Inline styles for specialized variants if not in global css yet
    const style: React.CSSProperties = {};
    if (variant === 'secondary') {
        style.backgroundColor = 'var(--ios-gray-5)';
        style.color = 'var(--ios-blue)'; // iOS standard secondary button text color
    }
    if (variant === 'outline') {
        style.backgroundColor = 'transparent';
        style.border = '1px solid var(--ios-blue)';
        style.color = 'var(--ios-blue)';
    }
    if (fullWidth) {
        style.width = '100%';
    }

    return (
        <button
            className={`${baseClass} ${variantClass} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}
