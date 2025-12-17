import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Shield, Briefcase, Home } from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';

const Users = () => {
    console.log('👥 Users component loaded!');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        admin: 0,
        staff: 0,
        resident: 0,
    });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            
            setStats({
                total: data.length,
                admin: data.filter(u => u.role === 'admin').length,
                staff: data.filter(u => u.role === 'staff').length,
                resident: data.filter(u => u.role === 'resident').length,
            });
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.flat_no?.toString().includes(searchTerm)
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <Shield size={16} />;
            case 'staff':
                return <Briefcase size={16} />;
            case 'resident':
                return <Home size={16} />;
            default:
                return <UsersIcon size={16} />;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Yönetici';
            case 'staff':
                return 'Personel';
            case 'resident':
                return 'Sakin';
            default:
                return role;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'danger';
            case 'staff':
                return 'info';
            case 'resident':
                return 'success';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return <Loader />;
    }
    
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Kullanıcılar</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Card>
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'hsla(262, 83%, 58%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-primary)',
                        }}>
                            <UsersIcon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Toplam Kullanıcı
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'hsla(0, 84%, 60%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-danger)',
                        }}>
                            <Shield size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.admin}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Yönetici
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'hsla(199, 89%, 48%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-info)',
                        }}>
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.staff}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Personel
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'hsla(142, 71%, 45%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-success)',
                        }}>
                            <Home size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.resident}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Sakin
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Arama"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Email, isim, blok veya daire ara..."
                            icon={<Search size={20} />}
                        />
                    </div>
                    <div style={{ minWidth: '150px' }}>
                        <label className="form-label">Rol</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-md)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text)',
                            }}
                        >
                            <option value="all">Tümü</option>
                            <option value="admin">Yönetici</option>
                            <option value="staff">Personel</option>
                            <option value="resident">Sakin</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <UsersIcon size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {users.length === 0 ? 'Henüz kullanıcı bulunmuyor.' : 'Filtreye uygun kullanıcı bulunamadı.'}
                        </p>
                    </div>
                </Card>
            ) : (
                <Card>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Email</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Ad Soyad</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Rol</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Blok</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Daire</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.uid} style={{
                                        borderBottom: '1px solid var(--glass-border)',
                                    }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{user.email}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{user.full_name || '-'}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <Badge variant={getRoleColor(user.role)}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                                    {getRoleIcon(user.role)}
                                                    {getRoleLabel(user.role)}
                                                </div>
                                            </Badge>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{user.block || '-'}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{user.flat_no || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Summary */}
            <div style={{ 
                marginTop: 'var(--spacing-xl)', 
                textAlign: 'center', 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-secondary)' 
            }}>
                Toplam {users.length} kullanıcı • Gösterilen {filteredUsers.length}
            </div>
        </div>
    );
};

export default Users;
