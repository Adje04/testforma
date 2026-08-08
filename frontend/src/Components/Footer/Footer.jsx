import React from 'react';
import './Footer.css';
import { Phone, Mail } from 'lucide-react';
// lucide-react ne fournit pas d'icônes de marque (volontaire de leur part) — react-icons
// couvre ce cas précis pour les 3 logos sociaux, tout le reste du projet reste sur lucide-react.
import { FaLinkedin, FaFacebook, FaXing } from 'react-icons/fa';
export default function Footer({ className }) {
    return (
        <footer className={`footer-all ${className}`} >
            <div className="grid-footer">
         
                
                <div className="  footer-menu ">
                    <h3>Menu</h3>
                    <ul>
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/bibliothèque">Bibliothèques</a></li>
                        <li><a href="/list-question">Question-Tech</a></li>
                        <li><a href="/communities">Communautés</a></li>
                        <li><a href="/login">Se connecter</a></li>
                        <li><a href="/about">A propos</a></li>
                    </ul>
                </div>


                <div className="footer-contact">

                    <div><h3>Contact</h3></div>
                    <div>

                        <p>
                            <Phone size={16} className="footer-icon" /> Téléphone <br />
                            +228 00 23 456 345
                        </p>
                        <p>
                            <Mail size={16} className="footer-icon" /> Email <br />
                            foruma@gmail.com
                        </p>
                    </div>
                    <div className="footer-social">
                        <h3>Social</h3>
                        <a href="#"><FaLinkedin size={20} className="social-icon" /></a>
                        <a href="#"><FaFacebook size={20} className="social-icon" /></a>
                        <a href="#"><FaXing size={20} className="social-icon" /></a>
                    </div>
                </div>

                {/* Description Section */}
                <div className="footer-description form-grid">
                    <p>
                        Foruma, Lorem ipsum dolor sit amet consectetur. Imperdiet rhoncus tristique et venenatis.
                        Laoreet amet blandit mauris condimentum mattis placerat tellus. Cras egestas iaculis sed magna
                        adipiscing orci euismod sagittisisus. Eget adipiscing at ornare ut.
                    </p>
                </div>


            </div>

            <div className="footer-bottom">
                <p>foruma © {new Date().getFullYear()} - Powered & designed by adjeeklou22@gmail.com</p>
            </div>
        </footer>
    );
}

























