import React, { useEffect, useState } from 'react'
import '../Sidebar/Sidebar.css'
import { X, Home, HelpCircle, Library, Users, Bell, MessageCircle, LayoutGrid, List, Newspaper } from 'lucide-react';
import Button from '../Button/Button'
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../State/UserContext.jsx';
import { apiClient } from '../../axios/axios.js';

export default function Sidebar({ toggleSidebar, className }) {
    const { user } = useUser();
    const isAdmin = user?.isAdmin;
    const location = useLocation();
    const [showButtons, setShowButtons] = useState(false);
    const [profile, setProfile] = useState([]);
    const [isloading, setIsLoading] = useState(true);

    const getBackgroundColor = () => {

        const colors = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#d69e2e', '#e53e3e', '#9f7aea'];
        // const colors = ['#FF5733', '#33A1FF', '#FF33A8', '#33FF57', '#FF8C33'];
        return colors[Math.floor(Math.random() * colors.length)];
    };



    if (!user) {
        return (
            <aside className={`side-bar ${className}`}>
                <div className='close-btn'>

                    {['/', '/communities', '/list-question', '/bibliothèque', '/about', '/question/:questionId'].includes(location.pathname) && (
                        <Button
                            icon={<X size={18} />}
                            style={{ backgroundColor: 'transparent', padding: 0 }}
                            onClick={toggleSidebar}
                        />
                    )}
                </div>  <br /><br />

                <ul>
                    <li>
                        <Link to={'/'} >
                            <Button
                                icon={<Home size={18} />}
                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', }}
                                text={<span>Accueil</span>}
                            />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/list-question'}>
                            <Button
                                icon={<HelpCircle size={18} />}
                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                text={"Liste des questions"}
                            />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/bibliothèque'}>
                            <Button
                                icon={<Library size={18} />}
                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                text={"Bibliothèque"}
                            />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/communities'}>
                            <Button
                                icon={<Users size={18} />}
                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                text={" Communautés"}
                            />
                        </Link>
                    </li>
                    <li>
                        <Link to={'/about'}>
                            <Button
                                icon={<Users size={18} />}
                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                text={"A propos"}
                            />
                        </Link>
                    </li><br />
                </ul>
            </aside>
        );
    }

    const handleClick = () => { setShowButtons(!showButtons); };
    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                try {
                    const response = await apiClient.get('profile');

                    if (response.data.success) {

                        setProfile(response.data.data);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur:', error);

                    setIsLoading(false);
                }
            };

            fetchUserProfile();
        }
    }, [user]);



    return (
        <aside className={`side-bar ${className}`}>
            <div className='close-btn'>
                {(isAdmin ? location.pathname === '/dashboard' : location.pathname === '/') && (
                    <Button
                        icon={<X size={18} />}
                        style={{ backgroundColor: 'transparent', padding: 0 }}
                        onClick={toggleSidebar}
                    />
                )}
            </div> <br />

            {!isAdmin ? (
                <>
                    {/* sidebar des utilisateurs  connectés*/}
                    <aside className='side-bar'>
                        <div className='close-btn'>
                            {location.pathname === '/' && (
                                <Button
                                    icon={<X size={18} />}
                                    style={{ backgroundColor: 'transparent', padding: 0 }}
                                    onClick={toggleSidebar}
                                />
                            )}
                        </div>
                        <Link to={'/userDashboard/profile'} >
                            <div className="sidebar">
                                {profile && profile.map((user, index) => {
                                    return (
                                        <div key={index} className="sidebar-header">

                                            <div className="user-avatar" style={{ backgroundColor: user.avatar ? 'transparent' : getBackgroundColor() }}>
                                                {user.avatar ? (
                                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/avatars/${user.avatar.split('\\').pop()}`} alt="Avatar de l'utilisateur" className="avatar" />
                                                ) : (
                                                    <span>{user.name.slice(0, 2).toUpperCase()}</span>
                                                )}

                                            </div>
                                            <div>
                                                <h2>{user.name}</h2>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        </Link>

                        <ul>
                            <li>
                                <Link to={'/'} >
                                    <Button
                                        icon={<Home size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', }}
                                        text={<span>Accueil</span>}
                                    />
                                </Link>
                            </li>

                            <li>
                                <Link to={'/userDashboard/bibliothèque'} >
                                    <Button
                                        icon={<Library size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', }}
                                        text={"Bibliothèque"}
                                    />
                                </Link>
                            </li>

                            <li>
                                <Link to={'/userDashboard/welcome'} >
                                    <Button
                                        icon={<Library size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', }}
                                        text={"Dashboard"}
                                    />
                                </Link>
                            </li>

                            <li>
                                <Link to={'/userDashboard/list-question'} >
                                    <Button
                                        icon={<HelpCircle size={18} />}
                                        style={{
                                            backgroundColor: 'transparent', padding: 0, fontSize: '16px',
                                        }}
                                        onClick={handleClick}
                                        text={showButtons ? "question-tech" : "question-tech"}
                                    />
                                </Link>
                                {showButtons && (
                                    <div>
                                        <Link to={'/userDashboard/create-question'} >
                                            <Button
                                                style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', }}
                                                text={"Poser une question"}
                                            />
                                        </Link>
                                    </div>
                                )}
                            </li>

                            <li>
                                <Button
                                    icon={<Bell size={18} />}
                                    style={{
                                        backgroundColor: 'transparent',
                                        padding: 0,
                                        fontSize: '16px',
                                    }}
                                    iconStyle={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '24px',
                                        color: '#094EFF'
                                    }}
                                    text={" notification"}
                                />
                            </li>

                            <li>
                                <Link to={"/userDashboard/communities"}>
                                    <Button
                                        icon={<Users size={18} />}
                                        style={{
                                            backgroundColor: 'transparent',
                                            padding: 0,
                                            fontSize: '16px',
                                        }}
                                        iconStyle={{ fontSize: '24px', color: '#094EFF' }}

                                        onClick={handleClick}
                                        text={showButtons ? "Communauté" : "Communauté"}
                                    />
                                </Link>

                            </li>

                            <li>
                                <Link to={"/discussion"}>
                                    <Button
                                        icon={<MessageCircle size={18} />}
                                        style={{
                                            backgroundColor: 'transparent',
                                            padding: 0,
                                            fontSize: '16px',
                                        }}
                                        iconStyle={{ fontSize: '24px', color: '#094EFF' }}

                                        onClick={handleClick}
                                        text={showButtons ? "Discussion" : "Discussion"}
                                    />
                                </Link>
                            </li>
                        </ul>

                    </aside>
                </>
            ) : (
                <>
                    {/* sidebar Admin */}
                    <aside className='side-bar'>
                        <div className='close-btn'>
                            {location.pathname === '/dashboard' && (
                                <Button
                                    icon={<X size={18} />}
                                    style={{ backgroundColor: 'transparent', padding: 0 }}
                                    onClick={toggleSidebar}
                                />
                            )}
                        </div><br />
                        <ul>
                            <li>
                                <Link to={'/'} >
                                    <Button
                                        icon={<Home size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                        text={"Accueil"}
                                    />
                                </Link>
                            </li>

                            <li>
                                <Link to={'/dashboard/list-category'} >
                                    <Button
                                        icon={<LayoutGrid size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                        text={"Catégories"}
                                    />
                                </Link>
                            </li>

                            <li>
                                <Link to={'/dashboard/list-resource-category'} >
                                    <Button
                                        icon={<List size={18} />}
                                        style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                        onClick={handleClick}
                                        text={showButtons ? 'Ressources' : 'Ressources'}
                                    />
                                </Link>
                                {showButtons && (
                                    <div>
                                        <Link to={'/dashboard/create-resource'} >
                                            <Button
                                                style={{ backgroundColor: 'transparent', fontSize: '14px' }}
                                                iconStyle={{ fontSize: '16px', color: '#094EFF' }}
                                                text={'Publier une ressource'}
                                            />
                                        </Link>
                                    </div>
                                )}
                            </li>

                            <li>
                                <Button
                                    icon={<Newspaper size={18} />}
                                    style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                    iconStyle={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '24px',
                                        color: '#094EFF'
                                    }}
                                    text={'Actualité'}
                                />
                            </li>

                            <li>
                                <Button
                                    icon={<Users size={18} />}
                                    style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px' }}
                                    iconStyle={{ fontSize: '24px', color: '#094EFF' }}
                                    onClick={handleClick}
                                    text={showButtons ? 'Communautés' : 'Communautés'}
                                />

                            </li>
                        </ul>
                    </aside>
                </>
            )}
        </aside>
    );
}


