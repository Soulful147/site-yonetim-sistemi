import React from 'react';
import Card from '../../components/common/Card';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
    console.log('📊 Analytics component loaded!');
    
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Analitik</h1>
            
            <Card>
                <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--spacing-xl)',
                    color: 'var(--color-text-secondary)'
                }}>
                    <BarChart3 size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.5 }} />
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Analitik Sayfası</h2>
                    <p>Bu sayfa yakında eklenecek.</p>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
