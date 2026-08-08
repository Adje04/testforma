import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, BookOpen, Users } from 'lucide-react'

// Coquille visuelle commune aux pages d'authentification (login, inscription, OTP, mot de passe).
// Panneau d'illustration à gauche (masqué sur mobile), formulaire à droite.
export default function AuthShell({ title, subtitle, children, backTo = '/' }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Panneau latéral */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/30 blur-2xl" />

        <Link to={backTo} className="relative flex items-center gap-2 text-white">
          <span className="text-xl font-bold">Foruma</span>
        </Link>

        <div className="relative space-y-6 text-white">
          <h2 className="text-3xl font-bold leading-tight">
            La plateforme communautaire des ingénieurs
          </h2>
          <p className="max-w-md text-white/80">
            Partagez des ressources pédagogiques, posez vos questions techniques et
            échangez avec une communauté d'ingénieurs passionnés.
          </p>
          <div className="flex flex-col gap-4 pt-4">
            {[
              { icon: BookOpen, text: 'Bibliothèque de ressources pédagogiques' },
              { icon: MessageSquare, text: 'Questions techniques et entraide' },
              { icon: Users, text: 'Communautés par domaine d\'ingénierie' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/60">Foruma © 2024</p>
      </div>

      {/* Zone formulaire */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to={backTo} className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}