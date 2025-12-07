import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    error = '',
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`form-input ${error ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Input;
