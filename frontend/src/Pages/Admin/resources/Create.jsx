import React, { useState, useRef, useMemo, useEffect } from 'react'
import Input from '../../../Components/Input/Input'
import Button from '../../../Components/Button/Button'
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import { apiClient } from '../../../axios/axios';


export default function Create() {
    const [title, setTitle] = useState('')
    const [cover, setCover] = useState(null)
    const [resource, setResource] = useState(null)
    const [categoryId, setCategoryId] = useState('');
    const [resourceCategories, setResourceCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const editor = useRef(null);
    const [description, setDescription] = useState('');
    const config = { placeholder: 'commencer par écrire' }

    const displayResourceCategories = async () => {
        try {
            const response = await apiClient.get('resource-category');
            if (response.data.success) {
                setResourceCategories(response.data.data);
            }
            else {
                console.error('les groupes ne s\'affiche pas', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);

            throw error;
        }
    };
    
    useEffect(() => { displayResourceCategories(); }, []);

    // Méthode pour créer une catégorie
    const handleSubmit = async (e) => {
        e.preventDefault(); 
      
        const formData = new FormData();
        formData.set('title', title);
        formData.set('category', categoryId);
        formData.set('cover', cover);
        formData.set('description', description);
        formData.set('resource', resource);

        setIsLoading(true);

        try {
            const response = await apiClient.post('/upload', formData,
                { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.data.success) {

                toast.success("la ressource a bien été téléversée");
                setIsLoading(false);

                setTitle('');
                setDescription('');
                setCover(null);
                setResource(null);
                setCategoryId('');

            } else {

                toast.error(response.data.message || "Erreur lors de l'ajout de la ressource");
                setIsLoading(false);
            }
        } catch (error) {

            console.error(error);
            toast.error(error.response?.data?.message || "Une erreur de source inconnue s'est produite");
            setIsLoading(false);
        }
    };
    return (
        <>
            
            <form className='resource-form' onSubmit={handleSubmit} >
                <div>

                    <h3> Créer une ressource </h3><br />
                    <label htmlFor="category"><b>Catégorie de la ressource</b></label>
                    <select
                        name="category_id"
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Choisir la catégorie de la resource</option>
                        {resourceCategories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <br />
                    <Input
                        label={"Titre"}
                        type={"text"}
                        reference={'title'}
                        placeholder={'Saisir le titre de la ressource ici...'}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /><br />

                    <Input
                        label={"Image de la ressource"}
                        type={"file"}
                        reference={'cover'}
                        placeholder={'Mettre une image de la ressource ici'}
                        onChange={(e) => setCover(e.target.files[0])}
                        isRequired={false}
                    /><br />

                    <JoditEditor
                        className='joditEditor'
                        ref={editor}
                        config={config}
                        value={description}
                        tabIndex={1}
                        onChange={(e) => setDescription(e.target.value)}
                    />  <br />

                    <Input
                        label={"fichier de la ressource"}
                        type={"file"}
                        reference={'resource'}
                        placeholder={'téléverser le fichier de la ressource ici...'}
                        onChange={(e) => setResource(e.target.files[0])}
                    /><br />

                    <Button
                        disabled={isLoading}
                        type={"submit"}
                        text={isLoading ? "Chargement ..." : <strong>Valider</strong>}
                        style={{ backgroundColor: '#FFB800', width: '100%' }}
                    />

                </div>
            </form>
        </>
    )
}


