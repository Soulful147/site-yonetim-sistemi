import React, { useState, useEffect } from 'react';
import { getAllTickets } from '../../services/ticketService';
import { getCategoryById } from '../../utils/constants';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const AllTickets = () => {
    console.log('🎯 AllTickets component loaded!');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🚀 AllTickets useEffect running');
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    const getStatusColor = (status) => {
        const colors = {
            'new': '#8b5cf6',
            'assigned': '#3b82f6',
            'in_progress': '#f59e0b',
            'resolved': '#10b981',
            'closed': '#6b7280',
        };
        return colors[status] || '#gray';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'new': 'Yeni',
            'assigned': 'Atandı',
            'in_progress': 'İşlemde',
            'resolved': 'Çözüldü',
            'closed': 'Kapalı',
        };
        return labels[status] || status;
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Tüm Talepler</h1>

            {tickets.length === 0 ? (
                <Card>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        Henüz talep bulunmamaktadır.
                    </p>
                </Card>
            ) : (
                <div style={{ overflow: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Başlık</th>
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Kategori</th>
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Durum</th>
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Blok</th>
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontWeight: 600 }}>Daire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                    '&:hover': { background: 'hsla(262, 83%, 58%, 0.05)' }
                                }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.title}</td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        {getCategoryById(ticket.category)?.label || ticket.category}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            background: getStatusColor(ticket.status),
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--font-size-sm)',
                                        }}>
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.block || '-'}</td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.flat_no || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllTickets;
