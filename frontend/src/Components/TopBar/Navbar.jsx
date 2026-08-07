import React, { useState } from 'react';
import './Navbar.css';
import Button from '../Button/Button';
import { Menu, LogOut, LogIn } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import '../Sidebar/Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../Input/Input';
import { useUser } from '../../State/UserContext';
import { toast } from 'react-toastify';
import { apiClient } from '../../axios/axios';




export default function Navbar({ OnMenuClick }) {
    const [showSidebar, setShowSidebar] = useState(false);
    const location = useLocation();
    const { user, logout } = useUser();
    const [isloading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        logout()
        try {
            const response = await apiClient.post('logout')
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login'); // redirection immédiate, avant : délai de 1s
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Non autorisé. Le token est invalide ou expiré.');
            } else {
                console.log(error)
                toast.error('Erreur lors de la déconnexion.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <nav className='nav'>
                <div className='nav-item'>
                    <div className='home-menu-show'>
                        {['/', '/communities', '/list-question', '/bibliothèque', '/about', '/question/:questionId'].includes(location.pathname) && (
                            <Button
                                className={''}
                                icon={<Menu size={20} />}
                                style={{ backgroundColor: 'transparent', padding: 0 }}
                                iconStyle={{ color: 'white' }}
                                onClick={toggleSidebar}
                            />
                        )}

                        {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}
                    
                    </div>

                    <h1>Foruma</h1>
                </div>





                <div className="nav-item show-nav-item">
                    <ul className='nav-ul'>
                        <li>
                            <Link to={'/'} >
                                <Button

                                    style={{ backgroundColor: 'transparent', color: "white", padding: 0, fontSize: '16px', }}
                                    text={<span>Accueil</span>}
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to={'/list-question'}>
                                <Button

                                    style={{ backgroundColor: 'transparent', color: "white", padding: 0, fontSize: '16px' }}
                                    text={"Liste des questions"}
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to={'/bibliothèque'}>
                                <Button

                                    style={{ backgroundColor: 'transparent', color: "white", padding: 0, fontSize: '16px' }}
                                    text={"Bibliothèque"}
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to={'/communities'}>
                                <Button

                                    style={{ backgroundColor: 'transparent', color: "white", padding: 0, fontSize: '16px' }}
                                    text={" Communautés"}
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to={'/about'}>
                                <Button

                                    style={{ backgroundColor: 'transparent', color: "white", padding: 0, fontSize: '16px' }}
                                    text={"A propos"}
                                />
                            </Link>
                        </li><br />
                    </ul>
                </div>


                <div className='nav-item'>


                    {user ? (
                        <Button
                            text="Se déconnecter"
                            icon={<LogOut size={18} />}
                            iconStyle={{}}
                            style={{ backgroundColor: '#FFB800' }}
                            onClick={handleLogout}
                        />
                    ) : (
                        <Link to={'/login'}>
                            <Button
                                text="Se connecter"
                                icon={<LogIn size={18} />}
                                iconStyle={{}}
                                style={{ backgroundColor: '#FFB800' }}
                            />
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}



