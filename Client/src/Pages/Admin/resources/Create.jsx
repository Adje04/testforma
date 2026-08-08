import React, { useState, useEffect } from 'react'
import Input from '../../../Components/Input/Input'
import Button from '../../../Components/Button/Button'
import { toast } from 'sonner';
import { apiClient } from '../../../axios/axios';
import TextArea from '../../../Components/Textarea/TextArea';

export default function Create() {
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState(null)
  const [resource, setResource] = useState(null)
  const [categoryId, setCategoryId] = useState('');
  const [resourceCategories, setResourceCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('');

  const displayResourceCategories = async () => {
    try {
      const response = await apiClient.get('resource-category');
      if (response.data.success) {
        setResourceCategories(response.data.data);
      } else {
        console.error('les groupes ne s\'affiche pas', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
      throw error;
    }
  };

  useEffect(() => { displayResourceCategories(); }, []);

  // Méthode pour créer une ressource
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
        setTitle(''); setDescription(''); setCover(null); setResource(null); setCategoryId('');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Créer une ressource</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ajoutez un nouveau document à la bibliothèque.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
            Catégorie de la ressource
          </label>
          <select
            name="category_id"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="input-base"
          >
            <option value="">Choisir la catégorie de la ressource</option>
            {resourceCategories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Titre"
          type="text"
          reference="title"
          placeholder="Saisir le titre de la ressource ici..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label="Image de la ressource"
          type="file"
          reference="cover"
          isRequired={false}
          onChange={(e) => setCover(e.target.files[0])}
        />

        <TextArea
          label="Description"
          reference="description"
          placeholder="Décrire la ressource ici..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Fichier de la ressource"
          type="file"
          reference="resource"
          isRequired={false}
          onChange={(e) => setResource(e.target.files[0])}
        />

        <div className="pt-2">
          <Button
            disabled={isLoading}
            type="submit"
            text={isLoading ? 'Chargement...' : 'Valider'}
            className="w-full"
          />
        </div>
      </form>
    </div>
  )
}