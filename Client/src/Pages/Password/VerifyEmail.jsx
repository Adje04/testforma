import React, { useState } from 'react';
import Button from '../../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'
import Input from '../../Components/Input/Input';
import { apiClient } from '../../axios/axios';
import AuthShell from '../../Components/AuthShell/AuthShell'

export default function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        localStorage.setItem('email', email);

        try {
            const response = await apiClient.post('/verifyEmail', { email });

            if (response.status === 200) {
                toast.success(response.data.message || 'Code envoyé');
                navigate('/email-confirmation')
            } else {
                toast.error('Email incorrect')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la vérification')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthShell title="Vérification email" subtitle="Saisissez votre adresse e-mail pour recevoir un code de vérification.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label={'Email'}
                    type={'email'}
                    reference={'email'}
                    placeholder={'Saisir votre adresse e-mail ici...'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    disabled={isLoading}
                    type="submit"
                    text={isLoading ? 'Vérification...' : 'Valider'}
                    className="w-full"
                />
            </form>
        </AuthShell>
    )
}