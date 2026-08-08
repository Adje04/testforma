import React from 'react'
import { useRouteError } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function Errors() {
    const error = useRouteError();
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="surface max-w-md w-full p-8 text-center animate-fade-in">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Une erreur s'est produite</h1>
                <p className="mt-2 text-sm text-muted-foreground">Voici les détails :</p>
                <p className="mt-3 rounded-lg bg-muted px-4 py-3 text-sm italic text-muted-foreground">
                    {error?.statusText || error?.message || 'Erreur inconnue'}
                </p>
            </div>
        </div>
    )
}