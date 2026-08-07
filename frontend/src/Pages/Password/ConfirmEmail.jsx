import React, { useState } from 'react';
import Button from '../../Components/Button/Button';
import OtpInput from '../../Components/OtpInput/OtpInput';
import ResendOtp from '../../Components/ResendOtp/ResendOtp';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Image from '../../Components/Image/Image';
import { apiClient } from '../../axios/axios';

export default function ConfirmEmail() {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error('Merci de saisir les 6 chiffres du code');
      return;
    }

    setIsLoading(true);
    try {
      // purpose: 'reset-password' fait émettre par le serveur un token de reset à usage unique
      const response = await apiClient.post('/verify-otpCode', {
        email,
        code: otpCode,
        purpose: 'reset-password',
      });

      if (response.status === 200) {
        toast.success("Vérification réussie");
        localStorage.setItem('resetToken', response.data.resetToken);
        navigate('/forget-password');
      } else {
        toast.error(response.data.message || "Code incorrect");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-position'>
      <div className='form'>
        <div className='form-img'>
          <Image src={"/images/login.svg"} alt={"illustration-inscription"} />
        </div>
        <div className='form-style'>
          <h1>Code de confirmation</h1>
          <p style={{ textAlign: 'center' }}>Saisissez le code à 6 chiffres reçu par email</p>
          <form onSubmit={handleSubmit}>
            <OtpInput value={otpCode} onChange={setOtpCode} />
            <Button
              disabled={isLoading || otpCode.length !== 6}
              type={"submit"}
              text={isLoading ? "Vérification..." : <strong>Valider</strong>}
              style={{ backgroundColor: '#FFB800', width: '100%' }}
            />
          </form>
          <ResendOtp email={email} />
        </div>
      </div>
    </div>
  );
}