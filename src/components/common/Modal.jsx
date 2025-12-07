import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal ${sizeClasses[size]}`}>
                <div className="card-header flex justify-between items-center">
                    <h3 className="card-title">{title}</h3>
                    <button
                        onClick={onClose}
                        className="btn-outline"
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
                    {children}
                </div>

                {footer && (
                    <div className="card-footer flex justify-end gap-md">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
