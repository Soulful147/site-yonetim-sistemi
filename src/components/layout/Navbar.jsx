import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { logoutUser } from '../../services/authService';
import Button from '../common/Button';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            position: 'sticky',
            top: 0,
            zIndex: 'var(--z-sticky)',
        }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ margin: 0, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Site Yönetim
                    </h2>
                </Link>

                {user && (
                    <div className="flex items-center gap-lg">
                        <div className="flex items-center gap-sm">
                            <User size={20} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                                    {user.full_name}
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                    {user.role === 'admin' ? 'Yönetici' : user.role === 'staff' ? 'Personel' : 'Site Sakini'}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            icon={<LogOut size={16} />}
                        >
                            Çıkış
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
