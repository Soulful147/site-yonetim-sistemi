import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getUserTickets } from '../../services/ticketService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import { CATEGORIES, STATUSES, getCategoryById, getStatusById } from '../../utils/constants';
import { formatDate, formatRelativeTime } from '../../utils/helpers';

const MyTickets = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        loadTickets();
    }, [user]);

    useEffect(() => {
        filterTickets();
    }, [tickets, searchTerm, statusFilter, categoryFilter]);

    const loadTickets = async () => {
        try {
            const data = await getUserTickets(user.uid);
            setTickets(data);
            setFilteredTickets(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        let filtered = [...tickets];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(ticket =>
                ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(ticket => ticket.status === statusFilter);
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(ticket => ticket.category === categoryFilter);
        }

        setFilteredTickets(filtered);
    };

    const statusOptions = [
        { value: '', label: 'Tüm Durumlar' },
        ...Object.values(STATUSES).map(status => ({
            value: status.id,
            label: status.label,
        })),
    ];

    const categoryOptions = [
        { value: '', label: 'Tüm Kategoriler' },
        ...Object.values(CATEGORIES).map(cat => ({
            value: cat.id,
            label: cat.label,
        })),
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Taleplerim</h1>

            {/* Filters */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="grid grid-cols-3 gap-md">
                    <div style={{ position: 'relative' }}>
                        <Input
                            placeholder="Talep ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-text-tertiary)',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={statusOptions}
                        placeholder="Durum Filtrele"
                    />

                    <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        options={categoryOptions}
                        placeholder="Kategori Filtrele"
                    />
                </div>
            </Card>

            {/* Tickets List */}
            {filteredTickets.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                        <Filter size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                        <p>Talep bulunamadı.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-md">
                    {filteredTickets.map((ticket) => {
                        const category = getCategoryById(ticket.category);
                        const status = getStatusById(ticket.status);

                        return (
                            <Card key={ticket.id}>
                                <div className="flex justify-between items-start">
                                    <div style={{ flex: 1 }}>
                                        <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                            <span style={{ fontSize: 'var(--font-size-xl)' }}>{category.icon}</span>
                                            <h3 style={{ margin: 0 }}>{ticket.title}</h3>
                                        </div>

                                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                                            {ticket.description}
                                        </p>

                                        <div className="flex items-center gap-lg" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                            <div>
                                                <strong>Kategori:</strong> {category.label}
                                            </div>
                                            <div>
                                                <strong>Oluşturulma:</strong> {formatDate(ticket.created_at)}
                                            </div>
                                            <div>
                                                <strong>Güncelleme:</strong> {formatRelativeTime(ticket.updated_at)}
                                            </div>
                                        </div>

                                        {ticket.assigned_to && (
                                            <div style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                                <strong>Atanan Personel:</strong> {ticket.assigned_to}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-sm">
                                        <Badge variant={ticket.status}>
                                            {status.label}
                                        </Badge>

                                        {ticket.priority && (
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--color-bg-tertiary)',
                                                color: 'var(--color-text-tertiary)',
                                            }}>
                                                Öncelik: {ticket.priority}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
