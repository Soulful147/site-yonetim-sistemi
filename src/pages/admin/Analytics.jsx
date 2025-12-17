import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Users as UsersIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { getAllTickets } from '../../services/ticketService';
import { getAllUsers } from '../../services/userService';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { groupBy, calculateAverage } from '../../utils/helpers';
import { getCategoryById, BLOCKS, PRIORITIES } from '../../utils/constants';

const Analytics = () => {
    console.log('📊 Analytics component loaded!');
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTickets: 0,
        newTickets: 0,
        inProgress: 0,
        resolved: 0,
        resolutionRate: 0,
        avgResolutionTime: 0,
        totalUsers: 0,
        activeUsers: 0,
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
            const resolvedTickets = ticketsData.filter(t => ['resolved', 'closed'].includes(t.status));
            const resolutionTimes = resolvedTickets
                .filter(t => t.created_at && t.updated_at)
                .map(t => {
                    const created = t.created_at.toDate();
                    const updated = t.updated_at.toDate();
                    return (updated - created) / (1000 * 60 * 60 * 24); // days
                });

            setStats({
                totalTickets: ticketsData.length,
                newTickets: ticketsData.filter(t => t.status === 'new').length,
                inProgress: ticketsData.filter(t => ['assigned', 'in_progress'].includes(t.status)).length,
                resolved: resolvedTickets.length,
                resolutionRate: ticketsData.length > 0 ? Math.round((resolvedTickets.length / ticketsData.length) * 100) : 0,
                avgResolutionTime: calculateAverage(resolutionTimes),
                totalUsers: usersData.length,
                activeUsers: usersData.filter(u => u.role === 'resident').length,
            });
        } catch (error) {
            console.error('Error loading analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryData = () => {
        const grouped = groupBy(tickets, 'category');
        const labels = Object.keys(grouped).map(key => getCategoryById(key)?.label || key);
        const values = Object.values(grouped).map(arr => arr.length);
        return { labels, values };
    };

    const getStatusData = () => {
        const statusMap = {
            'new': 'Yeni',
            'assigned': 'Atandı',
            'in_progress': 'İşlemde',
            'resolved': 'Çözüldü',
            'closed': 'Kapatıldı',
        };
        const grouped = groupBy(tickets, 'status');
        const labels = Object.keys(grouped).map(key => statusMap[key] || key);
        const values = Object.values(grouped).map(arr => arr.length);
        return { labels, values };
    };

    const getPriorityData = () => {
        const priorityMap = {
            'low': 'Düşük',
            'medium': 'Orta',
            'high': 'Yüksek',
            'urgent': 'Acil',
        };
        const grouped = groupBy(tickets, 'priority');
        const labels = Object.keys(grouped).map(key => priorityMap[key] || key);
        const values = Object.values(grouped).map(arr => arr.length);
        return { labels, values };
    };

    const getBlockData = () => {
        const grouped = groupBy(tickets, 'block');
        const labels = BLOCKS.filter(block => grouped[block]);
        const values = labels.map(block => grouped[block]?.length || 0);
        return { labels, values };
    };

    if (loading) {
        return <Loader />;
    }
    
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Analitik</h1>

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
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
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
                                {stats.resolutionRate}%
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Çözüm Oranı
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
                            background: 'hsla(24, 100%, 50%, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-warning)',
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.avgResolutionTime.toFixed(1)}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Ort. Çözüm (gün)
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
                            <UsersIcon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {stats.activeUsers}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Aktif Kullanıcı
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
                        Kategori Dağılımı
                    </h2>
                    {tickets.length > 0 ? (
                        <PieChart data={getCategoryData()} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                            Henüz veri bulunmuyor
                        </div>
                    )}
                </Card>

                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
                        Durum Dağılımı
                    </h2>
                    {tickets.length > 0 ? (
                        <PieChart data={getStatusData()} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                            Henüz veri bulunmuyor
                        </div>
                    )}
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-2 gap-lg">
                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
                        Öncelik Dağılımı
                    </h2>
                    {tickets.length > 0 ? (
                        <PieChart data={getPriorityData()} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                            Henüz veri bulunmuyor
                        </div>
                    )}
                </Card>

                <Card>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
                        Blok Bazlı Talep Sayısı
                    </h2>
                    {tickets.length > 0 ? (
                        <BarChart data={getBlockData()} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
                            Henüz veri bulunmuyor
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
