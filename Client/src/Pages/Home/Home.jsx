import React from 'react';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Hero from '../../Components/Hero/Hero';
import SpotlightCard from '../../Components/SpotlightCard/SpotlightCard';
import Testimonials from '../../Components/Testimonials/Testimonials';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Users, ArrowRight, HelpCircle, Library, Sparkles } from 'lucide-react'

const STATS = [
  { value: '2 400+', label: 'Ressources partagées' },
  { value: '1 800+', label: 'Questions techniques' },
  { value: '320+', label: 'Communautés actives' },
  { value: '5 000+', label: 'Ingénieurs inscrits' },
];

const RESOURCES = [
  { icon: BookOpen, title: 'Cours & livres', desc: 'Supports pédagogiques variés' },
  { icon: Library, title: 'Catégories', desc: 'Tri par domaine' },
  { icon: Sparkles, title: 'Mis à jour', desc: 'Ressources récentes' },
  { icon: Users, title: 'Partagé par', desc: 'La communauté' },
];

const STEPS = [
  { icon: HelpCircle, title: 'Posez votre question', desc: 'Décrivez votre problème technique en quelques mots.' },
  { icon: MessageSquare, title: 'Obtenez des réponses', desc: 'La communauté réagit et propose des solutions.' },
  { icon: Sparkles, title: 'Validez et progressez', desc: 'Échangez, notez les solutions et montez en compétence.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ressources */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-accent">Ressources pédagogiques</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Une bibliothèque collaborative pour les ingénieurs
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Accédez à des cours, livres et documents techniques partagés par la communauté.
            Téléchargez, consultez et contribuez à enrichir la base de connaissances
            accessible à tous les ingénieurs, du junior au senior.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((card) => (
            <SpotlightCard key={card.title} icon={card.icon} title={card.title} desc={card.desc} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/bibliothèque"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Accéder à la bibliothèque
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Tech-Question */}
      <section className="relative overflow-hidden border-y border-border bg-card">
        <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-accent">Tech-Question</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Exposez vos problèmes, trouvez des solutions
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Une question théorique ou technique ? Partagez-la publiquement et bénéficiez
              de l'expérience d'une communauté d'ingénieurs. Réponses, commentaires et
              échanges pour avancer ensemble.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-background p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/list-question"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Parcourir les questions
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <Testimonials />

      {/* CTA Communautés */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary via-primary to-accent p-10 text-center shadow-lift sm:p-16">
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_30%,transparent_80%)]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
              <Users className="h-3.5 w-3.5" />
              Communautés
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Rejoignez les communautés Foruma
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Échangez en temps réel avec des ingénieurs de votre domaine, partagez vos
              connaissances et développez votre réseau professionnel.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/communities"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Découvrir les communautés
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/discussion"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Lancer une discussion
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}