import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { loginUser } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await loginUser(formData.email, formData.password);
            onLogin(user);

            // Redirect based on role
            const redirectMap = {
                admin: '/admin/dashboard',
                staff: '/staff/dashboard',
                resident: '/resident/dashboard',
            };

            navigate(redirectMap[user.role] || '/');
        } catch (err) {
            setError('Giriş başarısız. Email veya şifrenizi kontrol edin.');
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
                    <h1 style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 'var(--spacing-sm)',
                    }}>
                        Site Yönetim Sistemi
                    </h1>
                    <p style={{ color: 'var(--color-text-tertiary)' }}>
                        Hesabınıza giriş yapın
                    </p>
                </div>

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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ornek@email.com"
                        required
                    />

                    <Input
                        label="Şifre"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div style={{ textAlign: 'right', marginBottom: 'var(--spacing-lg)' }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-primary)',
                            }}
                        >
                            Şifremi Unuttum
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        icon={<LogIn size={20} />}
                        style={{ width: '100%' }}
                    >
                        Giriş Yap
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
