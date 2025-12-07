import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon = null,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';

    const classes = [baseClass, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
            {...props}
        >
            {loading ? (
                <>
                    <span className="loader loader-sm"></span>
                    Yükleniyor...
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
