import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react';
import { getUserTickets } from '../../services/ticketService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getStatusById, getCategoryById } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';

const ResidentDashboard = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        inProgress: 0,
        resolved: 0,
    });

    useEffect(() => {
        loadTickets();
    }, [user]);

    const loadTickets = async () => {
        try {
            const data = await getUserTickets(user.uid);
            setTickets(data);

            // Calculate stats
            setStats({
                total: data.length,
                new: data.filter(t => t.status === 'new').length,
                inProgress: data.filter(t => ['assigned', 'in_progress'].includes(t.status)).length,
                resolved: data.filter(t => ['resolved', 'closed'].includes(t.status)).length,
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
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1>Hoş Geldiniz, {user.full_name}</h1>
                    <p style={{ color: 'var(--color-text-tertiary)' }}>
                        {user.block} Blok, Daire {user.flat_no}
                    </p>
                </div>
                <Link to="/resident/create">
                    <Button variant="primary" icon={<Plus size={20} />}>
                        Yeni Talep Oluştur
                    </Button>
                </Link>
            </div>

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
                            <FileText size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Toplam Talep
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
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.new}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Yeni
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
                                {stats.inProgress}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                İşlemde
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
                                {stats.resolved}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Çözüldü
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Tickets */}
            <Card>
                <Card.Header>
                    <div className="flex justify-between items-center">
                        <Card.Title>Son Talepler</Card.Title>
                        <Link to="/resident/tickets">
                            <Button variant="outline" size="sm">
                                Tümünü Gör
                            </Button>
                        </Link>
                    </div>
                </Card.Header>

                <Card.Body>
                    {tickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                            <FileText size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                            <p>Henüz talep oluşturmadınız.</p>
                            <Link to="/resident/create">
                                <Button variant="primary" icon={<Plus size={20} />} style={{ marginTop: 'var(--spacing-md)' }}>
                                    İlk Talebi Oluştur
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {tickets.slice(0, 5).map((ticket) => {
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
                                                    {ticket.description?.substring(0, 100)}...
                                                </p>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    {formatRelativeTime(ticket.created_at)}
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

export default ResidentDashboard;
