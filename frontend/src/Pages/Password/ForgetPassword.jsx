import React, { useState } from 'react'
import Input from '../../Components/Input/Input'
import Button from '../../Components/Button/Button'
import { useNavigate } from 'react-router'
import '../Registration/Registration.css'
import Image from '../../Components/Image/Image'
import { toast } from 'react-toastify'
import { apiClient } from '../../axios/axios'

export default function ForgetPassword() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setpasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (password !== passwordConfirm) {
            toast.error("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        // Avant : on envoyait juste un id ({id}) à /resetPassword/:id — faille de sécurité.
        // Maintenant : email + token à usage unique émis après vérification de l'OTP.
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('resetToken');

        if (!email || !token) {
            toast.error("Session de réinitialisation expirée. Recommence depuis le début.");
            setIsLoading(false);
            navigate('/verify-email');
            return;
        }

        try {
            const response = await apiClient.post('/resetPassword', {
                email,
                token,
                password,
                passwordConfirm,
            });

            if (response.data.success) {
                toast.success("Réinitialisation du mot de passe réussie !");
                localStorage.removeItem('resetToken');
                localStorage.removeItem('email');
                navigate('/login'); // redirection immédiate
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Une erreur inattendue s'est produite");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='form-position'>
            <div className='form'>
                <div className='form-img'>
                    <Image src={'/images/password.svg'} alt={"illustration-password"} />
                </div>

                <div className='form-style'>
                    <h1>Réinitialiser le mot de passe</h1>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label={'Nouveau mot de passe'}
                            type={'password'}
                            reference={'password'}
                            placeholder={'Saisir le mot de passe ici...'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }} />

                        <Input
                            label={'Confirmer le mot de passe'}
                            type={'password'}
                            reference={'passwordConfirm'}
                            placeholder={'Confirmer le mot de passe ici...'}
                            value={passwordConfirm}
                            onChange={(e) => { setpasswordConfirm(e.target.value) }} /><br />

                        <div>
                            <Button
                                disabled={isLoading}
                                type={"submit"}
                                text={isLoading ? "Chargement ..." : <strong>Valider</strong>}
                                style={{ backgroundColor: '#FFB800', width: '100%' }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
