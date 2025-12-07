import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { getAllTickets } from '../../services/ticketService';
import { getAllUsers } from '../../services/userService';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { groupBy, calculateAverage } from '../../utils/helpers';
import { getCategoryById, BLOCKS } from '../../utils/constants';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTickets: 0,
        newTickets: 0,
        inProgress: 0,
        resolved: 0,
        totalUsers: 0,
        avgResolutionTime: 0,
        avgRating: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ticketsData, usersData] = await Promise.all([
                getAllTickets(),
                getAllUsers(),
            ]);

            setTickets(ticketsData);
            setUsers(usersData);

            // Calculate stats
            const resolvedTickets = ticketsData.filter(t => t.resolved_at);
            const ratings = ticketsData.filter(t => t.rating).map(t => t.rating);

            setStats({
                totalTickets: ticketsData.length,
                newTickets: ticketsData.filter(t => t.status === 'new').length,
                inProgress: ticketsData.filter(t => ['assigned', 'in_progress'].includes(t.status)).length,
                resolved: ticketsData.filter(t => ['resolved', 'closed'].includes(t.status)).length,
                totalUsers: usersData.length,
                avgRating: calculateAverage(ratings),
            });
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryData = () => {
        const grouped = groupBy(tickets, 'category');
        const labels = Object.keys(grouped).map(key => getCategoryById(key).label);
        const values = Object.values(grouped).map(arr => arr.length);

        return { labels, values };
    };

    const getBlockData = () => {
        const grouped = groupBy(tickets, 'block');
        const labels = BLOCKS;
        const values = labels.map(block => grouped[block]?.length || 0);

        return { labels, values };
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Yönetici Dashboard</h1>

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
                                {stats.totalTickets}
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
                                {stats.newTickets}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Yeni Talepler
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
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.avgRating || '-'}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Ortalama Puan
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Card>
                    <Card.Header>
                        <Card.Title>Kategori Dağılımı</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {tickets.length > 0 ? (
                            <PieChart data={getCategoryData()} title="Kategori Dağılımı" />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                                Henüz veri yok
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Blok Bazlı Talep Sayısı</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {tickets.length > 0 ? (
                            <BarChart data={getBlockData()} title="Blok Bazlı Dağılım" />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                                Henüz veri yok
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <Card.Header>
                    <Card.Title>Son Talepler</Card.Title>
                </Card.Header>
                <Card.Body>
                    {tickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                            Henüz talep yok
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Başlık</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Kategori</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Blok</th>
                                        <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.slice(0, 5).map((ticket) => {
                                        const category = getCategoryById(ticket.category);
                                        return (
                                            <tr key={ticket.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: 'var(--spacing-md)' }}>{ticket.title}</td>
                                                <td style={{ padding: 'var(--spacing-md)' }}>{category.icon} {category.label}</td>
                                                <td style={{ padding: 'var(--spacing-md)' }}>{ticket.block}</td>
                                                <td style={{ padding: 'var(--spacing-md)' }}>
                                                    <span className={`badge badge-${ticket.status}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminDashboard;
