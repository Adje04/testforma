import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

const MENU = [
  { label: 'Accueil', to: '/' },
  { label: 'Bibliothèque', to: '/bibliothèque' },
  { label: 'Questions', to: '/list-question' },
  { label: 'Communautés', to: '/communities' },
  { label: 'À propos', to: '/about' },
  { label: 'Se connecter', to: '/login' },
];

export default function Footer({ className }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`relative overflow-hidden border-t border-border bg-card ${className || ''}`}>
      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 right-1/4 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Marque */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-xl font-bold tracking-tight text-transparent">
                Foruma
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              La plateforme communautaire des ingénieurs. Partagez des ressources
              pédagogiques, échangez entre juniors et seniors, et développez vos
              compétences au sein d'une communauté active et bienveillante.
            </p>
            {/* <div className="mt-6 flex items-center gap-2">
              {[Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Réseau social"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div> */}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {MENU.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +228 00 23 45 634
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                foruma@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Foruma © {year} Powered &amp; designed by adjeeklou22@gmail.com
          </p>
          <p className="text-xs text-muted-foreground">
            Tous droits réservés. <span className="hidden sm:inline"></span>{' '}
            <span className="sm:ml-1">Mentions légales</span>
            
          </p>
        </div>
      </div>
    </footer>
  );
}