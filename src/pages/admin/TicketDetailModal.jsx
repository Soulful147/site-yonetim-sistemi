import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { updateTicket } from '../../services/ticketService';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import Badge from '../../components/common/Badge';
import { getCategoryById, getPriorityById } from '../../utils/constants';

const TicketDetailModal = ({ ticket, onClose, onUpdate }) => {
    const [adminNotes, setAdminNotes] = useState(ticket?.admin_notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApprove = async () => {
        if (!adminNotes.trim()) {
            setError('Lütfen bir not ekleyin');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await updateTicket(ticket.id, {
                status: 'assigned',
                admin_notes: adminNotes,
            });
            
            onUpdate?.();
            onClose();
        } catch (err) {
            setError('Talep onaylanırken hata oluştu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!adminNotes.trim()) {
            setError('Lütfen bir not ekleyin');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await updateTicket(ticket.id, {
                status: 'closed',
                admin_notes: adminNotes,
            });
            
            onUpdate?.();
            onClose();
        } catch (err) {
            setError('Talep reddedilirken hata oluştu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!ticket) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid var(--color-border)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ margin: 0, flex: 1 }}>{ticket.title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: 'var(--spacing-sm)',
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Status & Details */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        <Badge variant={ticket.status === 'new' ? 'warning' : 'info'}>
                            {ticket.status === 'new' ? 'Yeni' : ticket.status === 'assigned' ? 'Atandı' : 'Kapatıldı'}
                        </Badge>
                        <Badge variant="secondary">{getCategoryById(ticket.category)?.label}</Badge>
                        <Badge variant="secondary">{getPriorityById(ticket.priority)?.label}</Badge>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        <div>
                            <strong>Blok:</strong> {ticket.block || '-'}
                        </div>
                        <div>
                            <strong>Daire:</strong> {ticket.flat_no || '-'}
                        </div>
                        <div>
                            <strong>Oluşturma:</strong> {ticket.created_at?.toDate ? ticket.created_at.toDate().toLocaleDateString('tr-TR') : '-'}
                        </div>
                        <div>
                            <strong>Güncelleme:</strong> {ticket.updated_at?.toDate ? ticket.updated_at.toDate().toLocaleDateString('tr-TR') : '-'}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Açıklama</h3>
                    <div style={{
                        background: 'var(--glass-bg)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        lineHeight: '1.6',
                    }}>
                        {ticket.description}
                    </div>
                </div>

                {/* Existing Notes */}
                {ticket.admin_notes && (
                    <div style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'hsla(220, 14%, 96%, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Mevcut Notlar</h3>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ticket.admin_notes}</p>
                    </div>
                )}

                {/* New Notes */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Textarea
                        label="Admin Notu Ekle"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Talep hakkında not yazın..."
                        rows={4}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'hsla(0, 84%, 60%, 0.1)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-danger)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: 'var(--font-size-sm)',
                    }}>
                        {error}
                    </div>
                )}

                {/* Actions */}
                {ticket.status === 'new' && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReject}
                            loading={loading}
                            icon={<AlertCircle size={18} />}
                        >
                            Reddet
                        </Button>
                        <Button
                            onClick={handleApprove}
                            loading={loading}
                            icon={<CheckCircle size={18} />}
                        >
                            Onayla
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketDetailModal;
