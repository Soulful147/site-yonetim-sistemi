import { format, formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Format a date to a readable string
 */
export const formatDate = (date) => {
    if (!date) return '';

    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return format(dateObj, 'dd MMMM yyyy, HH:mm', { locale: tr });
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';

    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: tr });
};

/**
 * Calculate resolution time in hours
 */
export const calculateResolutionTime = (createdAt, resolvedAt) => {
    if (!createdAt || !resolvedAt) return null;

    const created = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    const resolved = resolvedAt?.toDate ? resolvedAt.toDate() : new Date(resolvedAt);

    const hours = differenceInHours(resolved, created);
    const days = differenceInDays(resolved, created);

    if (days > 0) {
        return `${days} gün ${hours % 24} saat`;
    }
    return `${hours} saat`;
};

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status) => {
    const statusMap = {
        new: 'badge-new',
        assigned: 'badge-assigned',
        in_progress: 'badge-in-progress',
        pending: 'badge-assigned',
        resolved: 'badge-resolved',
        closed: 'badge-closed',
    };
    return statusMap[status] || 'badge-new';
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
    const colorMap = {
        low: 'var(--color-info)',
        medium: 'var(--color-warning)',
        high: 'var(--color-danger)',
        urgent: 'var(--color-danger)',
    };
    return colorMap[priority] || colorMap.medium;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Generate random ID
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

/**
 * Calculate average
 */
export const calculateAverage = (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return Math.round((sum / numbers.length) * 10) / 10;
};

/**
 * Sort by date
 */
export const sortByDate = (items, dateField = 'created_at', ascending = false) => {
    return [...items].sort((a, b) => {
        const dateA = a[dateField]?.toDate ? a[dateField].toDate() : new Date(a[dateField]);
        const dateB = b[dateField]?.toDate ? b[dateField].toDate() : new Date(b[dateField]);

        return ascending ? dateA - dateB : dateB - dateA;
    });
};
