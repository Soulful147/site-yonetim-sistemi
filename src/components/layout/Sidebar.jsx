import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Plus,
    ClipboardList,
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const getMenuItems = () => {
        switch (role) {
            case 'admin':
                return [
                    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { to: '/admin/tickets', icon: <FileText size={20} />, label: 'Tüm Talepler' },
                    { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analitik' },
                    { to: '/admin/users', icon: <Users size={20} />, label: 'Kullanıcılar' },
                ];

            case 'staff':
                return [
                    { to: '/staff/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { to: '/staff/tasks', icon: <ClipboardList size={20} />, label: 'Görevlerim' },
                ];

            case 'resident':
            default:
                return [
                    { to: '/resident/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { to: '/resident/create', icon: <Plus size={20} />, label: 'Yeni Talep' },
                    { to: '/resident/tickets', icon: <FileText size={20} />, label: 'Taleplerim' },
                ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <aside style={{
            width: '250px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--glass-border)',
            padding: 'var(--spacing-lg)',
            minHeight: 'calc(100vh - 73px)',
            position: 'sticky',
            top: '73px',
        }}>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map((item) => (
                        <li key={item.to} style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <NavLink
                                to={item.to}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    background: isActive ? 'hsla(262, 83%, 58%, 0.1)' : 'transparent',
                                    border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                                    transition: 'all var(--transition-fast)',
                                    fontWeight: isActive ? 600 : 400,
                                })}
                                className="sidebar-link"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
