import React from 'react';

const Card = ({
    children,
    className = '',
    hover = true,
    ...props
}) => {
    const classes = ['card', hover ? '' : 'no-hover', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`card-header ${className}`}>
            {children}
        </div>
    );
};

const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`card-title ${className}`}>
            {children}
        </h3>
    );
};

const CardBody = ({ children, className = '' }) => {
    return (
        <div className={`card-body ${className}`}>
            {children}
        </div>
    );
};

const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`card-footer ${className}`}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
