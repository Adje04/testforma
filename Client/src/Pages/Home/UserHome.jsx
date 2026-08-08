import React from 'react';
import { useUser } from '../../State/UserContext.jsx';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Users, MessageCircle, ArrowRight, TrendingUp } from 'lucide-react'

export default function UserHome() {
  const { user } = useUser()
  const username = user?.name || 'Utilisateur'

  const quickActions = [
    { to: '/userDashboard/bibliothèque', icon: BookOpen, label: 'Bibliothèque', desc: 'Ressources pédagogiques' },
    { to: '/userDashboard/create-question', icon: HelpCircle, label: 'Poser une question', desc: 'Exposez un problème' },
    { to: '/userDashboard/communities', icon: Users, label: 'Communautés', desc: 'Rejoignez un groupe' },
    { to: '/discussion', icon: MessageCircle, label: 'Discussions', desc: 'Échangez en direct' },
  ]

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm text-primary-foreground/80">Tableau de bord</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
            Bienvenue, <span className="text-accent dark:text-white ">{username}</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-primary-foreground/80">
            Retrouvez vos ressources, questions et communautés depuis cet espace.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">Accès rapide</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Ouvrir <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Activité récente</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Vos dernières questions, réponses et échanges apparaîtront ici.
        </p>
      </div>
    </div>
  )
}