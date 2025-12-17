import React from 'react';
import Card from '../../components/common/Card';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
    console.log('👥 Users component loaded!');
    
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Kullanıcılar</h1>
            
            <Card>
                <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--spacing-xl)',
                    color: 'var(--color-text-secondary)'
                }}>
                    <UsersIcon size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Kullanıcılar Sayfası</h2>
                    <p>Bu sayfa yakında eklenecek.</p>
                </div>
            </Card>
        </div>
    );
};

export default Users;
