import React, { useState } from 'react';

export default function Input({
    label,
    type,
    reference,
    value,
    onChange,
    placeholder,
    onClick,
    style,
    icon,
    className,
    iconStyle,
    showIconOnly = false,
    isRequired = true,
    // Par défaut, on affiche la barre avec l'icône, mais peut être configuré pour n'afficher que l'icône
}) {
    const [showInput, setShowInput] = useState(!showIconOnly);

    const handleIconClick = () => {
        if (showIconOnly) {
            setShowInput(true); // Affiche la barre de recherche lorsqu'on clique sur l'icône
        }
        if (onClick) {
            setShowInput(false);
        }
    };

    return (
        <div>
            {/* Affiche uniquement l'icône si showIconOnly est true */}
            {showIconOnly && !showInput ? (
                <span onClick={handleIconClick} style={{ cursor: 'pointer', ...iconStyle }}>
                    {icon}
                </span>
            ) : (
                <>
                    {/* Icône cliquable */}
                    <span onClick={handleIconClick} style={{ cursor: 'pointer', ...iconStyle }}>
                        {icon}
                    </span>
                    
                    <label htmlFor={reference}> {label} </label>
                    <input
                      className={`${className}`}
                        type={type}
                        id={reference}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        style={{ style }}
                        required={isRequired}
                    />
                </>
            )}
        </div>
    );
}


