import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import TextArea from '../../Components/Textarea/TextArea';
import { apiClient } from '../../axios/axios';
import { useUser } from '../../State/UserContext';

export default function CreateCommunity({ community, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [engineeringfield, setEngineeringField] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { user } = useUser()

    const engineeringFieldsOptions = ['Ingénierie civile', 'Ingénierie électrique', 'Ingénierie mécanique', 'ingénierie logicielle', 'autres'];
    useEffect(() => {
        if (community) {
            setName(community.name || '');
            setDescription(community.description || '');
            setEngineeringField(community.engineeringfield || '');
        }
    }, [community]);

    const handleCreateCommunity = async (e) => {


        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('engineeringfield', engineeringfield);

        if (avatar) {
            formData.append('avatar', avatar);
        }

        setIsLoading(true);

        if (!user) {
            navigate('/login')
            return;
        }
        try {
            const response = await apiClient.post('create-community', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                toast.success("Communauté créée avec succès!");
                setIsLoading(false);
                setName('');
                setDescription('');
                setEngineeringField('');
                setAvatar(null);

                onSave();
            } else {
                toast.error(response.data.message || "Erreur lors de la création de la communauté");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Une erreur inconnue s'est produite");
            setIsLoading(false);
        }
    };

    const handleUpdateCommunity = async () => {
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('engineeringfield', engineeringfield);

        if (avatar) {
            formData.append('avatar', avatar);
        }

        setIsLoading(true);

        try {
            const response = await apiClient.put(`update-community/${community._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 200) {
                toast.success('Communauté modifiée avec succès!');
                setIsLoading(false);
                setName('');
                setDescription('');
                setEngineeringField('');
                setAvatar(null);

                onSave();
            } else {
                toast.error(response.data.message || "Erreur lors de la modification de la communauté");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Une erreur inconnue s'est produite");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (community) {
            await handleUpdateCommunity(e);
        } else {
            await handleCreateCommunity(e);
        }
    };
    

    return (
        <form className='category-form' onSubmit={handleSubmit}>
            <div>
                <h3>{community ? 'Modifier la communauté' : 'Créer une communauté'}</h3>
                <br />

                <Input
                    label={'Nom'}
                    type={'text'}
                    reference={'community-name'}
                    placeholder={'Saisir le nom de la communauté...'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />

                <TextArea
                    label={'Description (optionnel)'}
                    reference={'description'}
                    rows={4}
                    placeholder={'Décrire brièvement la communauté'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />

                <label htmlFor="engineeringfield">Domaine d'ingénierie</label>
                <select
                    id="engineeringfield"
                    value={engineeringfield}
                    onChange={(e) => setEngineeringField(e.target.value)}
                >
                    <option value="">Sélectionner un domaine</option>
                    {engineeringFieldsOptions.map((field) => (
                        <option key={field} value={field}>
                            {field}
                        </option>
                    ))}
                </select>
                <br />

                <Input
                    label={'Avatar'}
                    type={'file'}
                    reference={'avatar'}
                    isRequired={false}
                    onChange={(e) => setAvatar(e.target.files[0])}
                />
                <br />

                <Button
                    disabled={isLoading}
                    type={'submit'}
                    text={isLoading ? 'Chargement ...' : <strong>{community ? 'Modifier' : 'Créer'}</strong>}
                    style={{ backgroundColor: '#FFB800', width: '100%' }}
                />
                <Button
                    className="close-button"
                    onClick={onCancel}
                    text={'Fermer'}
                />
            </div>
        </form>
    );
}






