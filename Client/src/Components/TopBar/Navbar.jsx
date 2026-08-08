import React, { useState } from 'react';
import Button from '../Button/Button';
import { Menu, LogOut, LogIn, Moon, Sun } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../State/UserContext';
import { useTheme } from '../../State/ThemeContext';
import NotificationBell from '../Notifications/NotificationBell';
import { toast } from 'sonner';
import { apiClient } from '../../axios/axios';
import { cn } from '@/lib/utils'

const PUBLIC_PAGES = ['/', '/communities', '/list-question', '/bibliothèque', '/about', '/question/:questionId']

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/list-question', label: 'Questions' },
  { to: '/bibliothèque', label: 'Bibliothèque' },
  { to: '/communities', label: 'Communautés' },
  { to: '/about', label: 'À propos' },
]

export default function Navbar({ OnMenuClick }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isloading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    logout()
    try {
      const response = await apiClient.post('logout')
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Non autorisé. Le token est invalide ou expiré.');
      } else {
        toast.error('Erreur lors de la déconnexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent">Foruma</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <>
                <NotificationBell />
                <Button
                  text={<span className="hidden sm:inline">Déconnexion</span>}
                  icon={<LogOut className="h-4 w-4" />}
                  disabled={isloading}
                  onClick={handleLogout}
                  className="px-3! py-2! sm:px-3!"
                />
              </>
            ) : (
              <Link to="/login">
                <Button
                  text={<span className="hidden sm:inline">Connexion</span>}
                  icon={<LogIn className="h-4 w-4" />}
                  className="px-3! py-2! sm:px-3!"
                />
              </Link>
            )}

            {(PUBLIC_PAGES.includes(location.pathname) || OnMenuClick) && (
              <button
                onClick={OnMenuClick || toggleSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </nav>
      </header>

      {showSidebar && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={toggleSidebar} />
          <Sidebar toggleSidebar={toggleSidebar} />
        </>
      )}
    </>
  )
}