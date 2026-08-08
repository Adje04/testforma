import React, { useEffect, useState } from 'react'
import { X, ArrowLeft, HelpCircle, Library, Users, MessageCircle, User, Plus, LayoutDashboard, FolderTree, FilePlus, List, ArrowBigLeftDash } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../State/UserContext.jsx';
import { apiClient } from '../../axios/axios.js';
import { cn } from '@/lib/utils'

const AVATAR_COLORS = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#e53e3e', '#9f7aea', '#3b82f6']

export default function Sidebar({ toggleSidebar, className, isStatic = false }) {
  const { user } = useUser();
  const isAdmin = user?.isAdmin;
  const location = useLocation();
  const [showButtons, setShowButtons] = useState(false);
  const [profile, setProfile] = useState([]);

  const getBackgroundColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const response = await apiClient.get('profile')
          if (response.data.success) setProfile(response.data.data)
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error)
        }
      }
      fetchUserProfile()
    }
  }, [user])

  const shellClass = isStatic
    ? 'relative h-full w-full border-r border-border bg-card'
    : 'fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] border-r border-border bg-card shadow-lift animate-slide-in-left'

  const navItem = (to, icon, label, opts = {}) => (
    <Link
      to={to}
      onClick={opts.onClick || toggleSidebar}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        location.pathname === to
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )

  const CloseBtn = !isStatic && toggleSidebar ? (
    <button onClick={toggleSidebar} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
      <X className="h-5 w-5" />
    </button>
  ) : null

  // Sidebar visiteur (non connecté)
  if (!user) {
    return (
      <aside className={cn(shellClass, 'p-4', className)}>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-base font-bold text-foreground">Menu</span>
          {CloseBtn}
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {navItem('/', <Home className="h-4 w-4" />, 'Accueil')}
          {navItem('/list-question', <HelpCircle className="h-4 w-4" />, 'Liste des questions')}
          {navItem('/bibliothèque', <Library className="h-4 w-4" />, 'Bibliothèque')}
          {navItem('/communities', <Users className="h-4 w-4" />, 'Communautés')}
          {navItem('/about', <Users className="h-4 w-4" />, 'À propos')}
        </nav>
      </aside>
    )
  }

  // Sidebar administrateur
  if (isAdmin) {
    return (
      <aside className={cn(shellClass, 'p-4', className)}>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-base font-bold text-foreground">Administration</span>
          {CloseBtn}
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {navItem('/dashboard/create-category', <FolderTree className="h-4 w-4" />, 'Créer une catégorie')}
          {navItem('/dashboard/list-category', <List className="h-4 w-4" />, 'Liste des catégories')}
          {navItem('/dashboard/list-resource-category', <List className="h-4 w-4" />, 'Catégories ressources')}
          {navItem('/dashboard/create-resource', <FilePlus className="h-4 w-4" />, 'Créer une ressource')}
        </nav>
      </aside>
    )
  }

  // Sidebar utilisateur connecté
  return (
    <aside className={cn(shellClass, 'p-4', className)}>
      <div className="flex items-center justify-between">
        <Link to="/" > <ArrowLeft className="h-4 w-4" /></Link>
        {CloseBtn}
      </div>

      <Link to="/userDashboard/profile" onClick={toggleSidebar} className="mt-3 block">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors hover:bg-muted">
          {profile[0]?.avatar ? (
            <img
              src={`${import.meta.env.VITE_ASSETS_URL || ''}/avatars/${profile[0].avatar.split('\\').pop()}`}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: getBackgroundColor() }}>
              {(profile[0]?.name || user.name || 'U').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{profile[0]?.name || user.name}</p>
            <p className="text-xs text-muted-foreground">Voir le profil</p>
          </div>
        </div>
      </Link>

      <nav className="mt-4 flex flex-col gap-1">
        {navItem('/userDashboard/welcome', <LayoutDashboard className="h-4 w-4" />, 'Tableau de bord')}
        {navItem('/userDashboard/bibliothèque', <Library className="h-4 w-4" />, 'Bibliothèque')}

        <div>
          <button
            onClick={() => setShowButtons(!showButtons)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Questions</span>
            <Plus className={cn('ml-auto h-4 w-4 transition-transform', showButtons && 'rotate-45')} />
          </button>
          {showButtons && (
            <div className="ml-3 mt-1 border-l border-border pl-3">
              {navItem('/userDashboard/create-question', <Plus className="h-4 w-4" />, 'Poser une question')}
              {navItem('/userDashboard/list-question', <List className="h-4 w-4" />, 'Mes questions')}
            </div>
          )}
        </div>
        {navItem('/userDashboard/communities', <Users className="h-4 w-4" />, 'Communautés')}
        {navItem('/discussion', <MessageCircle className="h-4 w-4" />, 'Discussions')}
        {navItem('/userDashboard/profile', <User className="h-4 w-4" />, 'Profil')}
      </nav>
    </aside>
  )
}