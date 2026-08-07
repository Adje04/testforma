import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddMember.css';
import { apiClient } from '../../axios/axios';

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
      console.log(groupId);
      if (!groupId) {
        console.error('Aucun groupe sélectionné.');
        return;
      }
      const response = await apiClient.post(`community/${groupId}/addmember`, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsLoading(false);
      }
      else {
        toast.error(response.data.message);
        console.log(response.data);
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
    <div className="add-member-container">
      <h1 className='addmember-title'>Ajouter un membre</h1>
      <form onSubmit={addMember}>
        <Input
          label={'email'}
          type={'text'}
          reference={'name'}
          placeholder={'Email du membre à ajouter ici'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <br />
        <div>
          <Button
            disabled={isLoading}
            type="submit"
            text={isLoading ? 'Chargement ...' : 'Valider'}
            style={{ backgroundColor: '#FFB800', width: '100%' }}
          />
        </div>
      </form>
    </div>
  );
}
