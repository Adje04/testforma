import React from 'react'
import './Button.css'
export default function Button({
    type,
    text,
    style,
    disabled,
    iconStyle,
    icon = null,
    className,
    onClick }) {


    const defaultIconStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        color: '#094EFF'
    }
    return (
        <div>
            <button className= {`button ${className}`} type={type || "button"} style={style} onClick={onClick} disabled = {disabled}>
                {/* span est rendu ssi icon est defini(non null)  */}
                {icon && <span style={{ ...defaultIconStyle, ...iconStyle }}>{icon}</span>}{text}

            </button>
        </div>
    )
}
