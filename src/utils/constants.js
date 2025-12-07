// Ticket Categories
export const CATEGORIES = {
    ELEVATOR_FIX: { id: 'elevator_fix', label: 'Asansör Arızası', icon: '🛗' },
    PLUMBING: { id: 'plumbing', label: 'Tesisat', icon: '🚰' },
    ELECTRICAL: { id: 'electrical', label: 'Elektrik', icon: '⚡' },
    CLEANING: { id: 'cleaning', label: 'Temizlik', icon: '🧹' },
    SECURITY: { id: 'security', label: 'Güvenlik', icon: '🔒' },
    NOISE: { id: 'noise', label: 'Gürültü', icon: '🔊' },
    PARKING: { id: 'parking', label: 'Otopark', icon: '🚗' },
    GARDEN: { id: 'garden', label: 'Bahçe', icon: '🌳' },
    SUGGESTION: { id: 'suggestion', label: 'Öneri', icon: '💡' },
    OTHER: { id: 'other', label: 'Diğer', icon: '📋' },
};

// Ticket Statuses
export const STATUSES = {
    NEW: { id: 'new', label: 'Yeni', color: 'info' },
    ASSIGNED: { id: 'assigned', label: 'Atandı', color: 'warning' },
    IN_PROGRESS: { id: 'in_progress', label: 'İşlemde', color: 'primary' },
    PENDING: { id: 'pending', label: 'Beklemede', color: 'warning' },
    RESOLVED: { id: 'resolved', label: 'Çözüldü', color: 'success' },
    CLOSED: { id: 'closed', label: 'Kapalı', color: 'secondary' },
};

// Priority Levels
export const PRIORITIES = {
    LOW: { id: 'low', label: 'Düşük', color: 'info' },
    MEDIUM: { id: 'medium', label: 'Orta', color: 'warning' },
    HIGH: { id: 'high', label: 'Yüksek', color: 'danger' },
    URGENT: { id: 'urgent', label: 'Acil', color: 'danger' },
};

// User Roles
export const ROLES = {
    RESIDENT: 'resident',
    ADMIN: 'admin',
    STAFF: 'staff',
};

// Blocks
export const BLOCKS = ['A', 'B', 'C', 'D'];

// Floors per block
export const FLOORS_PER_BLOCK = 8;

// Flats per floor
export const FLATS_PER_FLOOR = 4;

// User Types
export const USER_TYPES = {
    OWNER: 'owner',
    TENANT: 'tenant',
};

// Chart Colors
export const CHART_COLORS = {
    primary: 'hsl(262, 83%, 58%)',
    secondary: 'hsl(200, 98%, 39%)',
    success: 'hsl(142, 71%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
    danger: 'hsl(0, 84%, 60%)',
    info: 'hsl(199, 89%, 48%)',
};

// Get category by id
export const getCategoryById = (id) => {
    return Object.values(CATEGORIES).find(cat => cat.id === id) || CATEGORIES.OTHER;
};

// Get status by id
export const getStatusById = (id) => {
    return Object.values(STATUSES).find(status => status.id === id) || STATUSES.NEW;
};

// Get priority by id
export const getPriorityById = (id) => {
    return Object.values(PRIORITIES).find(priority => priority.id === id) || PRIORITIES.MEDIUM;
};
