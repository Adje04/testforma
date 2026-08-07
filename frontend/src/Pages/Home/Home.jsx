import React from 'react';
import Navbar from '../../Components/TopBar/Navbar';
import './Home.css';
import engineerImage from '../../assets/images/engineer-bro.svg';
import book from '../../assets/images/book.jpg';
import Question from '../../assets/images/Question.jpg';
import CommunityChat from '../../assets/images/CommunityChat.svg'
import Image from '../../Components/Image/Image';
import Footer from '../../Components/Footer/Footer';
import EditProfile from '../Profile/EditProfile';
import Profile from '../Profile/Profile';
import ForgetPassword from '../Password/ForgetPassword';
import Button from '../../Components/Button/Button';

export default function Home() {
    return (
        <div>
            <Navbar />

            <div className="banner flex-banner">
                <div className='welcome-text'>
                    <span >
                        Bienvenue sur <span className="foruma">Foruma!</span><br />
                        une plateforme communautaire d'<br />
                        <span className="ing">Ingénieurs</span><br />
                        et de partage de <span className="ing">ressources<br />pédagogiques</span>
                    </span>
                </div>
                <div>
                    <img className={'ing-image'} src={engineerImage} alt="landingPageImage" />
                </div>
            </div>
            <br /><br /><br /><br />
            <section className="container">
                <div className="section-title">
                    <h1>Nos ressources</h1>
                    <div className="separator"></div>
                </div>
                <br /><br /><br />

                <div className="section-description">
                    <div className="description">
                        <h1 className="foruma" id="en-savoir-plus">Foruma,</h1>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem, nobis! Libero modi aliquid cupiditate perferendis hic nobis incidunt atque fugiat architecto necessitatibus, recusandae consectetur deleniti quod odit aut accusamus aspernatur!
                            Vitae quos veritatis voluptate reiciendis facilis autem ut officiis atque laudantium, molestiae eligendi, a harum, culpa minima. Distinctio porro, omnis doloremque minima sapiente est cum quibusdam iure aliquid! Consectetur, iure.
                        </p>
                        <br />
                        {/* <a href="/pages/enSavoirPlus.html" className="button-type-2">Lire plus</a> */}
                    </div>
                    <div className="description">
                        <Image src={book} alt="Description image" className="sm-hide" />
                    </div>
                </div>
            </section> <br /><br />
            <section className="container">
                <div className="section-title">
                    <h1>Tech-Question</h1>
                    <div className="separator"></div>
                </div>
                <br /><br /><br />

                <div className="section-description">
                    <div className="description">
                        <Image src={Question} alt="Description image" className="sm-hide" />
                    </div>
                    <div className="description">
                        <h3 className="foruma" id="en-savoir-plus">Exposer vos problèmes theoriques et trouver des solutions,</h3>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem, nobis! Libero modi aliquid cupiditate perferendis hic nobis incidunt atque fugiat architecto necessitatibus, recusandae consectetur deleniti quod odit aut accusamus aspernatur!
                            Vitae quos veritatis voluptate reiciendis facilis autem ut officiis atque laudantium, molestiae eligendi, a harum, culpa minima. Distinctio porro, omnis doloremque minima sapiente est cum quibusdam iure aliquid! Consectetur, iure.
                        </p>
                        <br />
                        {/* <a href="/pages/enSavoirPlus.html" className="button-type-2">
                            <Button
                                text={<strong>Lire plus</strong>}
                                style={{ backgroundColor: '#FFB800', }}
                            /> </a> */}


                    </div>


                </div>
            </section>
            <br /><br /><br /><br /><br />
            <div className="community-banner ">
                <div>

                </div>

            </div> <br /><br /><br />

            <Footer />
        </div>
    );
}
