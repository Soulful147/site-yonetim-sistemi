import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError('Şifre sıfırlama emaili gönderilemedi. Email adresinizi kontrol edin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            padding: 'var(--spacing-lg)',
        }}>
            <Card style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h2>Şifre Sıfırlama</h2>
                    <p style={{ color: 'var(--color-text-tertiary)' }}>
                        Email adresinize şifre sıfırlama linki gönderilecektir
                    </p>
                </div>

                {success ? (
                    <div>
                        <div style={{
                            padding: 'var(--spacing-lg)',
                            background: 'hsla(142, 71%, 45%, 0.1)',
                            border: '1px solid var(--color-success)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-success)',
                            marginBottom: 'var(--spacing-lg)',
                            textAlign: 'center',
                        }}>
                            <Mail size={48} style={{ marginBottom: 'var(--spacing-md)' }} />
                            <p>Şifre sıfırlama linki email adresinize gönderildi.</p>
                            <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                Lütfen email kutunuzu kontrol edin.
                            </p>
                        </div>

                        <Link to="/login">
                            <Button variant="outline" icon={<ArrowLeft size={20} />} style={{ width: '100%' }}>
                                Giriş Sayfasına Dön
                            </Button>
                        </Link>
                    </div>
                ) : (
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
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            icon={<Mail size={20} />}
                            style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                        >
                            Sıfırlama Linki Gönder
                        </Button>

                        <Link to="/login">
                            <Button variant="outline" icon={<ArrowLeft size={20} />} style={{ width: '100%' }}>
                                Giriş Sayfasına Dön
                            </Button>
                        </Link>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
