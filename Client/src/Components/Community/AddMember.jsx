import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { UserPlus } from 'lucide-react'

export default function AddMember() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const addMember = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('email', email);
    setIsLoading(true);

    try {
      const groupId = localStorage.getItem('selectedGroupId');
      if (!groupId) {
        console.error('Aucun groupe sélectionné.');
        return;
      }
      const response = await apiClient.post(`community/${groupId}/addmember`, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsLoading(false);
      } else {
        toast.error(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          toast.error(error.response.data.message || "L'email est déjà utilisé.");
        } else {
          toast.error("Une erreur est survenue");
        }
      } else {
        toast.error("Une erreur est survenue");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <UserPlus className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Ajouter un membre</h3>
      </div>
      <form onSubmit={addMember} className="space-y-4">
        <Input
          label={'Email'}
          type={'text'}
          reference={'name'}
          placeholder={'Email du membre à ajouter...'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          disabled={isLoading}
          type="submit"
          text={isLoading ? 'Chargement...' : 'Valider'}
          className="w-full"
        />
      </form>
    </div>
  )
}