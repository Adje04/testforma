import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

export default function Modal({ isVisible, onClose, children, className }) {
    if (!isVisible) return null;
    return (
        <div className={`modal-overlay ${className || ''}`}>
            <div className="modal-content">
                <Button
                    onClick={onClose}
                    className={"modal-close"}
                    text={ "fermer" }
                    />
                {children}
            </div>
        </div>
    );
}
