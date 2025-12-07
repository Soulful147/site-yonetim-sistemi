import React from 'react';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error = '',
    required = false,
    disabled = false,
    placeholder = 'Seçiniz...',
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`form-select ${error ? 'error' : ''} ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Select;
