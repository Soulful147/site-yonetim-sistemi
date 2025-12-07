import React from 'react';
import { getStatusBadgeClass } from '../../utils/helpers';

const Badge = ({
    children,
    variant = 'new',
    className = '',
    ...props
}) => {
    const badgeClass = variant.includes('badge-') ? variant : getStatusBadgeClass(variant);

    return (
        <span className={`badge ${badgeClass} ${className}`} {...props}>
            {children}
        </span>
    );
};

export default Badge;
