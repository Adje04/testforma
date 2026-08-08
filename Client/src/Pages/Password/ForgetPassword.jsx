import React, { useState } from 'react'
import Input from '../../Components/Input/Input'
import Button from '../../Components/Button/Button'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { apiClient } from '../../axios/axios'
import AuthShell from '../../Components/AuthShell/AuthShell'

export default function ForgetPassword() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setpasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (password !== passwordConfirm) {
            toast.error('Les mots de passe ne correspondent pas.')
            setIsLoading(false)
            return
        }

        // Avant : on envoyait juste un id ({id}) à /resetPassword/:id — faille de sécurité.
        // Maintenant : email + token à usage unique émis après vérification de l'OTP.
        const email = localStorage.getItem('email')
        const token = localStorage.getItem('resetToken')

        if (!email || !token) {
            toast.error('Session de réinitialisation expirée. Recommence depuis le début.')
            setIsLoading(false)
            navigate('/verify-email')
            return
        }

        try {
            const response = await apiClient.post('/resetPassword', {
                email,
                token,
                password,
                passwordConfirm,
            })

            if (response.data.success) {
                toast.success('Réinitialisation du mot de passe réussie !')
                localStorage.removeItem('resetToken')
                localStorage.removeItem('email')
                navigate('/login')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Une erreur inattendue s'est produite")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthShell title="Réinitialiser le mot de passe" subtitle="Choisissez un nouveau mot de passe pour votre compte.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label={'Nouveau mot de passe'}
                    type={'password'}
                    reference={'password'}
                    placeholder={'Saisir le mot de passe ici...'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    label={'Confirmer le mot de passe'}
                    type={'password'}
                    reference={'passwordConfirm'}
                    placeholder={'Confirmer le mot de passe ici...'}
                    value={passwordConfirm}
                    onChange={(e) => setpasswordConfirm(e.target.value)}
                />
                <Button
                    disabled={isLoading}
                    type="submit"
                    text={isLoading ? 'Chargement...' : 'Valider'}
                    className="w-full"
                />
            </form>
        </AuthShell>
    )
}