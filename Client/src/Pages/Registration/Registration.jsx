import React, { useState } from 'react'
import Input from '../../Components/Input/Input'
import Button from '../../Components/Button/Button'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '../../axios/axios'
import AuthShell from '../../Components/AuthShell/AuthShell'

export default function Registration() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setpasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        localStorage.setItem('email', email)
        const formData = {
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm
        }

        try {
            const response = await apiClient.post('/register', formData)

            if (response.data.success) {
                toast.success('Inscription réussie')
                navigate('/code-confirmation')
            } else {
                toast.error(response.data.message || "Erreur lors de l'inscription")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Erreur lors de l'inscription")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthShell title="Inscription" subtitle="Renseignez vos informations pour créer un compte.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label={'Nom'}
                    type={'text'}
                    reference={'name'}
                    placeholder={'Saisir le nom ici...'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    text={isLoading ? 'Chargement...' : 'S\'inscrire'}
                    className="w-full"
                />

                <p className="text-center text-sm text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Se connecter
                    </Link>
                </p>
            </form>
        </AuthShell>
    )
}