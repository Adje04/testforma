import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function Errors() {
    const error = useRouteError();
    return (
        <div>
            Une erreur s'est produite.voici les détails
            <p>
                <i> {error.statusText || error.message} </i>
            </p>
        </div>
    )
}
