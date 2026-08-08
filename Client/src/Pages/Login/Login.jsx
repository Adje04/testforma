import React, { useState } from 'react';
import Button from '../../Components/Button/Button';
import OtpInput from '../../Components/OtpInput/OtpInput';
import ResendOtp from '../../Components/ResendOtp/ResendOtp';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import { toast } from 'sonner'
import AuthShell from '../../Components/AuthShell/AuthShell'

export default function OtpCode() {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // L'email vient déjà de l'étape précédente (Registration.jsx l'y stocke), inutile de le redemander
  const email = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error('Merci de saisir les 6 chiffres du code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/verify-otpCode', { email, code: otpCode });

      if (response.status === 200) {
        toast.success('Vérification réussie');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Code incorrect');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Code de confirmation" subtitle="Saisissez le code à 6 chiffres reçu par email.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OtpInput value={otpCode} onChange={setOtpCode} />
        <Button
          disabled={isLoading || otpCode.length !== 6}
          type="submit"
          text={isLoading ? 'Vérification...' : 'Valider'}
          className="w-full"
        />
      </form>
      <div className="mt-6">
        <ResendOtp email={email} />
      </div>
    </AuthShell>
  )
}