import React, { useState } from 'react'
import Input from '../../Components/Input/Input'
import Button from '../../Components/Button/Button'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './Registration.css'
import Image from '../../Components/Image/Image'
import { toast } from 'react-toastify'
import { apiClient } from '../../axios/axios'


export default function Registration() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setpasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        localStorage.setItem("email", email);
        const formData = {
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm
        };

        try {
            const response = await apiClient.post('/register', formData);

            if (response.data.success) {
                toast.success("Inscription réussie");
                navigate('/code-confirmation'); // redirection immédiate, plus de délai de 3s
            } else {
                toast.error(response.data.message || "Erreur lors de l'inscription");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='form-position'>

            <div className='form'>

                <div className='form-img'>
                    <Image src={'/images/login.svg'} alt={"illustration-inscription"} />
                </div>

                <div className='form-style'>

                    <h1>Inscription</h1>
                    <form onSubmit={handleSubmit}>
                        <p><small> Renseigner vos informations  pour vous inscrire</small></p>

                        <Input
                            label={'Nom'}
                            type={'text'}
                            reference={'name'}
                            placeholder={'Saisir le nom ici...'}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }} />
                        <Input
                            label={'Email'}
                            type={'email'}
                            reference={'email'}
                            placeholder={'Saisir l\'adresse e-mail ici...'}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }} />

                        <Input
                            label={'Mot de passe'}
                            type={'password'}
                            reference={'password'}
                            placeholder={'Saisir le mot de passe  ici...'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }} />

                        <Input
                            label={'Confirmer le mot de passe'}
                            type={'password'}
                            reference={'passwordConfirm'}
                            placeholder={'Confirmer le mot de passe  ici...'}
                            value={passwordConfirm}
                            onChange={(e) => {
                                setpasswordConfirm(e.target.value)
                            }} />
                        <br />

                        <div>
                            <Button
                                disabled={isLoading}
                                type={"submit"}
                                text={isLoading ? "Chargement ..." : <strong>S'inscrire</strong>}
                                style={{ backgroundColor: '#FFB800', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Déjà un compte ?</p>
                            <p> <Link to={'/login'} >Se connecter</Link> </p>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}



