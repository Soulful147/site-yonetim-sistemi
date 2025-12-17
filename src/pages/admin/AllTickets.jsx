import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Eye } from 'lucide-react';
import { getAllTickets } from '../../services/ticketService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import TicketDetailModal from './TicketDetailModal';
import { getCategoryById, getPriorityById } from '../../utils/constants';

const AllTickets = () => {
    console.log('🎯 AllTickets component loaded!');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

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
                                <th style={{ padding: 'var(--spacing-md)', textAlign: 'center', fontWeight: 600 }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.title}</td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        {getCategoryById(ticket.category)?.label || ticket.category}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <Badge variant={ticket.status === 'new' ? 'warning' : ticket.status === 'assigned' ? 'info' : 'success'}>
                                            {getStatusLabel(ticket.status)}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.block || '-'}</td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>{ticket.flat_no || '-'}</td>
                                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setSelectedTicket(ticket)}
                                            icon={<Eye size={16} />}
                                        >
                                            Detay
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedTicket && (
                <TicketDetailModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onUpdate={loadTickets}
                />
            )}
        </div>
    );
};

export default AllTickets;
