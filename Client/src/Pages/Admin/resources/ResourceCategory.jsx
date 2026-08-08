import React, { useState, useEffect } from 'react'
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import { toast } from 'sonner';
import { apiClient } from '../../../axios/axios';
import { useNavigate } from 'react-router';
import TextArea from '../../../Components/Textarea/TextArea';

export default function ResourceCategory({ category, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Pré-remplir les champs avec les données de la catégorie si elles existent
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    }
  }, [category]);

  // Méthode pour créer une catégorie
  const handleCreateCategory = async () => {
    const formData = new FormData();
    formData.set('name', name);
    formData.set('description', description);

    setIsLoading(true);
    try {
      const response = await apiClient.post('create-resource-category', formData);
      if (response.status === 201) {
        toast.success("Catégorie de ressource créée avec succès !");
        setIsLoading(false);
        setName('')
        setDescription('')
        onSave();
      } else {
        toast.error(response.data.message || "Erreur lors de la création de la catégorie");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Une erreur de source inconnue s'est produite");
      setIsLoading(false);
    }
  };

  // Méthode pour modifier une catégorie
  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.set('name', name);
    formData.set('description', description);

    setIsLoading(true);
    try {
      const response = await apiClient.put(`update-resource-category/${category._id}`, formData);
      if (response.status === 200) {
        toast.success('Catégorie modifiée avec succès !');
        setIsLoading(false);
        setName('')
        setDescription('')
        onSave();
      } else {
        toast.error(response.data.message || "Erreur lors de la modification de la catégorie");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "une erreur de source innatendue s'est produite lors de la modification");
      setIsLoading(false);
    }
  };

  // Appelle la bonne méthode selon le contexte (création ou modification)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {category ? 'Modifier la catégorie' : 'Créer une catégorie de ressource'}
      </h3>
      <Input
        label={'Nom'}
        type={'text'}
        reference={'quest-category'}
        placeholder={'Saisir le nom de la catégorie ici...'}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextArea
        label={'Description (optionnel)'}
        reference={'description'}
        rows={4}
        placeholder={'Décrire brièvement la catégorie'}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-3 pt-2">
        <Button
          disabled={isLoading}
          type={'submit'}
          text={isLoading ? 'Chargement...' : (category ? 'Modifier' : 'Créer')}
          className="flex-1"
        />
        <Button
          className="bg-transparent! text-foreground! border! border-border! hover:bg-muted!"
          onClick={onCancel}
          text={'Fermer'}
        />
      </div>
    </form>
  )
}