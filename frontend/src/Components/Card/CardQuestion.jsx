

import React from 'react';
import "./Card.css";

export default function CardQuestion({ height, image = null, text, title, icon = null, iconStyle, style, likes, responses, className }) {
    const defaultIconStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        color: '#094EFF'
    }

    return (
        <div className={`card-question ${className}`} style={{ height, ...style }} tabIndex={0}> {/* Add tabIndex for focusability */}
            {image && (
                <img src={image} alt="card-img" className="card-image" />
            )}
            <div className="content">
                <h3 className="title"> {title} </h3>
                <p className='text'>{text}</p>
                <div className="footer">
                    <div className="like-section">
                        {icon && <span style={{ ...defaultIconStyle, ...iconStyle }}>{icon}</span>}&nbsp;&nbsp; {likes} likes
                    </div>
                    <div className="response-section">
                        <a href="#">{responses} réponses</a>
                    </div>
                </div>
            </div>
        </div>
    )
}




