import React, { useEffect, useState } from 'react'
import './Profile.css';
import Input from '../../Components/Input/Input';
import TextArea from '../../Components/Textarea/TextArea';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Button from '../../Components/Button/Button';
import { apiClient } from '../../axios/axios';
import { Download } from 'lucide-react';
export default function Profile() {

    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [ing, setIng] = useState('');
    const [avatar, setAvatar] = useState(null);


    const navigate = useNavigate()

    const handleEditProfile = async (e) => {
        e.preventDefault
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.set('name', name);
            if (avatar) formData.set('avatar', avatar);

            const response = await apiClient.put(`profile`, formData,
                { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.data.success) {
                toast.success(response.data.message || 'Profil mis à jour avec succès !');
                setIsLoading(false);
            } else {
                toast.error("Échec de la mise à jour du profil.");
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil", error);
            toast.error("une erreur de source  incconnue s'est produite veuiller réessayer plus tard");
        }
        setIsLoading(false);

    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            setIsLoading(true);
            try {
                const response = await apiClient.delete(`profile`);
                if (response.data.success) {
                    toast.success(response.data.message || 'Compte supprimé avec succès.');
                    navigate('/login'); // redirection immédiate, avant : délai de 3s
                }

            } catch (error) {
                console.error("Erreur lors de la suppression du compte", error);
                alert("Échec de la suppression du compte.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    const getBackgroundColor = () => {

        const colors = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#d69e2e', '#e53e3e', '#9f7aea'];
        // const colors = ['#FF5733', '#33A1FF', '#FF33A8', '#33FF57', '#FF8C33'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const displayUserProfil = async () => {
            try {
                const response = await apiClient.get('profile');

                if (response.data.success) {

                    setProfile(response.data.data);

                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
            } finally {
                setIsLoading(false);
            }
        };

        displayUserProfil();
    }, []);

    return (
        <div className="profile-container">

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
            <h2>Modifier le Profil</h2> <br /><br />

            <form className='profile-form '>
                <div className="form-row">
                    <Input
                        label={'Nom'}
                        type={'text'}
                        reference={'name'}
                        placeholder={'Saisir le nom ici...'}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        className={"profile-input"}
                        isRequired={false} />

                    <Input
                        label={'domaine d\'ingénierie'}
                        type={'text'}
                        reference={'ing'}
                        placeholder={'Votre domaine d\'ingénierie ici...'}
                        value={ing}
                        onChange={(e) => { setIng(e.target.value) }}
                        className={"profile-input"} isRequired={false} />
                </div>
                <div className="form-row">
                    {/* <Input
                        label={'Photo de profil'}
                        type={'file'}
                        reference={'avatar'}
                        value={avatar}
                        placeholder={'changer votre photo de profil ...'}
                        onChange={(e) => setAvatar(e.target.files[0])}
                        className={"profile-input"} /> */}

                    <div className="file-upload-container">

                        <label htmlFor="fileUpload" className="file-label profile-input">
                            <Download size={18} />
                            <span>Téléverser votre fichier</span>
                        </label>
                        <Input type="file" id="fileUpload" onChange={(e) => setAvatar(e.target.files[0])} className="file-input"
                            isRequired={false} />

                    </div>

                    <Input
                        label={'domaine d\'ingénierie'}
                        type={'text'}
                        reference={'ing'}
                        placeholder={'Votre domaine d\'ingénierie ici...'}
                        value={ing}
                        onChange={(e) => { setIng(e.target.value) }}
                        className={"profile-input"} isRequired={false} />
                </div>
                <div >
                    <TextArea type="text" placeholder={"Saisir une bio ici ..."} />
                </div>
                <div className="button-row">

                    <Button
                        onClick={handleEditProfile}
                        className={'edit-button'}
                        disabled={isLoading}
                        text={isLoading ? 'En cours...' : 'valider'}
                    />

                    <Button
                        onClick={handleDeleteAccount}
                        className={"delete-button"}
                        disabled={isLoading}
                        text={isLoading ? 'En cours...' : 'Supprimer le compte'}
                    />
                </div>
            </form>
        </div>
    );
}




