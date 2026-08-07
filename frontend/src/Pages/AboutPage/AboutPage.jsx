import React from 'react'
import './AboutPage.css';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';
export default function AboutPage() {
    return (

        <div > 
        <Navbar /><br /><br /><br />
   <section className="container ">
   <div className="about-container ">
          <div className="about-text">
            <h1>En savoir plus sur notre projet</h1>
            <p>
              Notre plateforme en ligne est conçue pour les ingénieurs, afin de faciliter l'accès
              aux ressources pédagogiques et créer un espace d'échange entre ingénieurs juniors et
              seniors. Elle permet à la communauté de partager des connaissances, rester informée des
              opportunités, et développer des compétences tout en favorisant le réseautage.
            </p>
            <p>
              L'objectif est de soutenir la croissance économique et technologique en renforçant les
              compétences locales, tout en répondant aux besoins des ingénieurs de Lomé et au-delà.
            </p>
          </div>
          <div className="about-image">
            <img
              src="/public/images/Target-amico.svg"
              alt="Illustration du projet"
            />
          </div>
        </div>
   </section>
        <br /><br /><br /><br />
        <Footer />
        </div>
      );
}






