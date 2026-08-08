import React, { useState } from 'react'
import Input from '../../Components/Input/Input'
import Button from '../../Components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../axios/axios'
import { toast } from 'sonner'
import { useUser } from '../../State/UserContext.jsx'
import AuthShell from '../../Components/AuthShell/AuthShell'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = { email, password }

        try {
            const response = await apiClient.post('/login', formData)

            if (response.status === 200 && response.data.accessToken) {
                toast.success('Connexion réussie')
                const userData = {
                    token: response.data.accessToken,
                    isAdmin: response.data.isAdmin,
                    userId: response.data.data._id,
                    name: response.data.data.name
                }

                login(userData)
                navigate(userData.isAdmin ? '/dashboard' : '/userDashboard/welcome')
            } else {
                toast.error(response.data.message || 'Email ou mot de passe incorrect')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Erreur lors de la connexion')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthShell title="Connexion" subtitle="Renseignez vos informations pour vous connecter.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label={'Email'}
                    type={'email'}
                    reference={'email'}
                    placeholder={'Saisir l\'adresse e-mail ici...'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label={'Mot de passe'}
                    type={'password'}
                    reference={'password'}
                    placeholder={'Saisir le mot de passe ici...'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex justify-end">
                    <Link to="/verify-email" className="text-sm font-medium text-primary hover:underline">
                        Mot de passe oublié ?
                    </Link>
                </div>

                <Button
                    disabled={isLoading}
                    type="submit"
                    text={isLoading ? 'Chargement...' : 'Se connecter'}
                    className="w-full"
                />

                <p className="text-center text-sm text-muted-foreground">
                    Pas encore de compte ?{' '}
                    <Link to="/registration" className="font-medium text-primary hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}