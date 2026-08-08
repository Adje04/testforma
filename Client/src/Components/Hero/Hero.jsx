import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Users, ArrowRight, HelpCircle, Library, Sparkles } from 'lucide-react';

const BENTO = [
  { icon: BookOpen, title: 'Ressources', desc: 'Cours, livres, documents' },
  { icon: HelpCircle, title: 'Questions', desc: 'Entraide technique' },
  { icon: Users, title: 'Communautés', desc: 'Par domaine d\'ingénierie' },
  { icon: MessageSquare, title: 'Discussions', desc: 'En temps réel' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Grille de fond (style Aceternity) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_80%)]" />

      {/* Halos aurora dégradés */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-accent/25 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Plateforme communautaire d'ingénieurs
            <span className="h-1 w-1 rounded-full bg-accent" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Pensez. Construisez. Progressez.{' '}
            <span className="bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Ensemble.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Foruma réunit des milliers d'ingénieurs autour des ressources pédagogiques,
            des questions techniques et de communautés actives. Apprenez, enseignez,
            résolvez — ensemble, en temps réel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <Link
              to="/bibliothèque"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              <Library className="h-4 w-4" />
              Explorer la bibliothèque
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/list-question"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              Voir les questions
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Aperçu bento */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {BENTO.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-accent/15 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="relative mt-4 text-sm font-semibold text-foreground">{card.title}</p>
              <p className="relative text-xs text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}