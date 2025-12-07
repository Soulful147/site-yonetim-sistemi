import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { getStaffTickets } from '../../services/ticketService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getCategoryById, getStatusById } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';

const StaffDashboard = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
    });

    useEffect(() => {
        loadTickets();
    }, [user]);

    const loadTickets = async () => {
        try {
            const data = await getStaffTickets(user.uid);
            setTickets(data);

            setStats({
                total: data.length,
                pending: data.filter(t => !['resolved', 'closed'].includes(t.status)).length,
                completed: data.filter(t => ['resolved', 'closed'].includes(t.status)).length,
            });
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Personel Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
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
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Toplam Görev
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
                            background: 'hsla(38, 92%, 50%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-warning)',
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.pending}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Bekleyen
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
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.completed}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Tamamlandı
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tasks */}
            <Card>
                <Card.Header>
                    <Card.Title>Atanan Görevler</Card.Title>
                </Card.Header>
                <Card.Body>
                    {tickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                            Henüz atanmış görev yok
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-md">
                            {tickets.map((ticket) => {
                                const category = getCategoryById(ticket.category);
                                const status = getStatusById(ticket.status);

                                return (
                                    <div
                                        key={ticket.id}
                                        style={{
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--color-bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                                    <span style={{ fontSize: 'var(--font-size-lg)' }}>{category.icon}</span>
                                                    <h4 style={{ margin: 0 }}>{ticket.title}</h4>
                                                </div>
                                                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                                    {ticket.description}
                                                </p>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    {ticket.block} Blok, Daire {ticket.flat_no} • {formatRelativeTime(ticket.created_at)}
                                                </div>
                                            </div>
                                            <Badge variant={ticket.status}>
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default StaffDashboard;
