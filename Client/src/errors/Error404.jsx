

import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'

export default function Error404() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center animate-fade-in">
            <div className="relative mb-8">
                <h1 className="text-[7rem] font-extrabold leading-none tracking-tighter text-primary sm:text-[9rem]">
                    404
                </h1>
                <Compass className="absolute -right-6 top-0 h-10 w-10 text-accent sm:h-14 sm:w-14" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Page introuvable</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
                La page à laquelle vous essayez d'accéder n'existe pas ou a été déplacée.
            </p>
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
                <Home className="h-4 w-4" />
                Retour à l'accueil
            </Link>
        </div>
    )
}


