import React, { useState } from 'react'
import './Profile.css'
import Button from '../../Components/Button/Button';
import { apiClient } from '../../axios/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
export default function EditProfile() {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()

    const handleEditProfile = async (e) => {
        e.preventDefault
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.set('name', name);
            if (avatar) formData.set('avatar', avatar);

            const response = await apiClient.put(`profile`, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            if (response.data.success) {
                toast.success(response.data.message || 'Profil mis à jour avec succès !');
                setIsLoading(false);
            }
            toast.error("Échec de la mise à jour du profil.");

        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil", error);
            toast.error("une rreur de source  incconnue s'est produite veuiller réssailler plus tard");
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
                toast.error("Échec de la suppression du compte.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Modifier le Profil</h2>
            <div className="form-group">
                <label>Nom</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    className='profile-input'
                    placeholder="Entrez votre nom"
                />
            </div>
            <div className="form-group">
                <label>photo de profile</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                />
            </div>
            <Button

                onClick={handleEditProfile}
                className="edit-button"
                disabled={isLoading}
                text={isLoading ? 'En cours...' : 'Mettre à jour le profil'}

            />

            <Button
                onClick={handleDeleteAccount}
                className="delete-button"
                disabled={isLoading}
                text={isLoading ? 'En cours...' : 'Supprimer le compte'}

            />
        </div>


    );
}







