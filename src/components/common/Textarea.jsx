import React from 'react';

const Textarea = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    error = '',
    required = false,
    disabled = false,
    rows = 4,
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
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`form-textarea ${error ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Textarea;
