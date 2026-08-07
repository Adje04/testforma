import React, { useState } from 'react';
import Button from '../../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Input from '../../Components/Input/Input';
import Image from '../../Components/Image/Image';
import { apiClient } from '../../axios/axios';

export default function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        localStorage.setItem("email", email);

        try {
            const response = await apiClient.post('/verifyEmail', { email });

            if (response.status === 200) {
                toast.success(response.data.message || "Code envoyé");
                navigate('/email-confirmation'); // redirection immédiate
            } else {
                toast.error("Email incorrect");
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
                    <h1>Vérification email</h1>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label={'Email'}
                            type={'email'}
                            reference={'email'}
                            placeholder={'Saisir votre adresse e-mail ici...'}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <Button
                            disabled={isLoading}
                            type={"submit"}
                            text={isLoading ? "Vérification..." : <strong>Valider</strong>}
                            style={{ backgroundColor: '#FFB800', width: '100%' }}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
