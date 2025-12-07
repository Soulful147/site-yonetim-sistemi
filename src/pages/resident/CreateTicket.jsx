import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X } from 'lucide-react';
import { createTicket, uploadTicketPhoto } from '../../services/ticketService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

const CreateTicket = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        priority: 'medium',
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create ticket
            const ticket = await createTicket(formData, user.uid, user);

            // Upload photo if exists
            if (photo) {
                const photoUrl = await uploadTicketPhoto(photo, ticket.id);
                // Note: In a real app, you'd update the ticket with the photo URL
            }

            navigate('/resident/tickets');
        } catch (err) {
            setError('Talep oluşturulamadı. Lütfen tekrar deneyin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = Object.values(CATEGORIES).map(cat => ({
        value: cat.id,
        label: `${cat.icon} ${cat.label}`,
    }));

    const priorityOptions = Object.values(PRIORITIES).map(pri => ({
        value: pri.id,
        label: pri.label,
    }));

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Yeni Talep Oluştur</h1>

            <Card style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
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

                    <Input
                        label="Talep Başlığı"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Örn: Asansör arızası"
                        required
                    />

                    <div className="grid grid-cols-2 gap-lg">
                        <Select
                            label="Kategori"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={categoryOptions}
                            required
                        />

                        <Select
                            label="Öncelik"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            options={priorityOptions}
                            required
                        />
                    </div>

                    <Textarea
                        label="Açıklama"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Lütfen sorunu detaylı bir şekilde açıklayın..."
                        rows={6}
                        required
                    />

                    <div className="form-group">
                        <label className="form-label">Fotoğraf (Opsiyonel)</label>

                        {photoPreview ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    style={{
                                        position: 'absolute',
                                        top: 'var(--spacing-sm)',
                                        right: 'var(--spacing-sm)',
                                        background: 'var(--color-danger)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 'var(--spacing-xl)',
                                    border: '2px dashed var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                <Upload size={48} style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-sm)' }} />
                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                    Fotoğraf yüklemek için tıklayın
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex gap-md justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/resident/dashboard')}
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            icon={<Send size={20} />}
                        >
                            Talep Oluştur
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateTicket;
