// import React from 'react'
// import './AboutPage.css';
// import Navbar from '../../Components/TopBar/Navbar';
// import Footer from '../../Components/Footer/Footer';
// export default function AboutPage() {
//     return (

//         <div > 
//         <Navbar /><br /><br /><br />
//    <section className="container ">
//    <div className="about-container ">
//           <div className="about-text">
//             <h1>En savoir plus sur notre projet</h1>
//             <p>
//               Notre plateforme en ligne est conçue pour les ingénieurs, afin de faciliter l'accès
//               aux ressources pédagogiques et créer un espace d'échange entre ingénieurs juniors et
//               seniors. Elle permet à la communauté de partager des connaissances, rester informée des
//               opportunités, et développer des compétences tout en favorisant le réseautage.
//             </p>
//             <p>
//               L'objectif est de soutenir la croissance économique et technologique en renforçant les
//               compétences locales, tout en répondant aux besoins des ingénieurs de Lomé et au-delà.
//             </p>
//           </div>
//           <div className="about-image">
//             <img
//               src="/public/images/Target-amico.svg"
//               alt="Illustration du projet"
//             />
//           </div>
//         </div>
//    </section>
//         <br /><br /><br /><br />
//         <Footer />
//         </div>
//       );
// }



import React from 'react'
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { Target } from 'lucide-react'

const VALUES = [
  { title: 'Communauté', desc: "Un espace d'échange entre ingénieurs juniors et seniors, où chacun apprend et enseigne." },
  { title: 'Partage', desc: 'Des ressources pédagogiques accessibles à tous, librement enrichies par la communauté.' },
  { title: 'Croissance', desc: 'Développer les compétences locales et le réseautage à travers toute la carrière.' },
  { title: 'Innovation', desc: 'Soutenir la croissance technologique de Lomé et au-delà.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_80%)]" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -top-10 right-1/4 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-20 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            À propos de Foruma
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            En savoir plus sur notre{' '}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">projet</span>
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Notre plateforme est conçue pour les ingénieurs, afin de faciliter l'accès aux
            ressources pédagogiques et créer un espace d'échange entre juniors et seniors.
            Elle permet à la communauté de partager des connaissances, rester informée des
            opportunités et développer des compétences, tout en favorisant le réseautage.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            L'objectif est de soutenir la croissance économique et technologique en
            renforçant les compétences locales, tout en répondant aux besoins des ingénieurs
            de Lomé et au-delà.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-accent">Nos valeurs</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Ce qui nous fait avancer</h2>
        </div>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {VALUES.map((v, i) => (
            <div key={v.title} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-center">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-4xl font-extrabold leading-none text-transparent sm:col-span-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold text-foreground sm:col-span-3">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-7">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-soft sm:p-16">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <span className="text-sm font-semibold text-accent">Notre mission</span>
            <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Connecter les ingénieurs autour de la connaissance
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Briser les silos entre générations et domaines, et bâtir une communauté
              technique durable au service du développement local.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}





