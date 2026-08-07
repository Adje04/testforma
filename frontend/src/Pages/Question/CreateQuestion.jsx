import React, { useState, useRef, useEffect } from 'react'
import Button from '../../Components/Button/Button'
import JoditEditor from 'jodit-react';
import Input from '../../Components/Input/Input';
import './Question.css'
import { toast } from 'react-toastify';
import { apiClient } from '../../axios/axios.js';
import { useNavigate } from 'react-router';
import TextArea from '../../Components/Textarea/TextArea.jsx';
import { Link } from 'react-router-dom';

export default function CreateQuestion() {
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [categoryId, setCategoryId] = useState('');
    const [questionCategories, setQuestionCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    const navigate = useNavigate();

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const config = { placeholder: 'commencer par écrire' }



    const displayQuestionCategories = async () => {
        try {

            const response = await apiClient.get('category-question')
            if (response.data.success) {

                setQuestionCategories(response.data.data);
            }
            else {
                console.error('les catégories ne s\'affiche pas', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);

            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('title', title);
        formData.set('category_question_id', categoryId);
        formData.set('content', content);

        setIsLoading(true);

        try {
            const response = await apiClient.post('question-create', formData);
            if (response.status === 201) {
                toast.success(response.data.message);
                navigate(`/userDashboard/list-question`); // redirection immédiate, avant : délai de 3s
            } else {
                toast.error(response.data.message || "Erreur lors de l'ajout de la question");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Une erreur de source inconnue s'est produite lors de la création de la question");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => { displayQuestionCategories(); }, []);



    return (
        <>
            <div className='question'>
                <div>
                    <h1>
                        Exposer votre problème ici
                    </h1>
                    <p>Poser une question publique qui explique le problème que vous rencontriez</p>
                </div>
                <div>
                 
                    <Link to= {'/userDashboard/list-question'}>
                    <Button
                        disabled={isLoading}
                        type={"submit"}
                        text={isLoading ? "Chargement ..." : <strong>Voir les questions</strong>}

                        style={{ backgroundColor: 'transparent', color: '#094EFF', border: '2px solid   #094EFF' }} />
                    </Link>
                </div>

            </div>
            <h3 style={{margin: '20px 0'}}>Créer une question</h3>
            <form className='question-form' onSubmit={handleSubmit}>
                <div>
                    <div>
                        <div>



                            <Input
                                label={"title"}
                                type={"text"}
                                reference={'title'}
                                placeholder={'Donne un titre à ta question ...'}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div><br />
                        <div>
                            <label htmlFor="category"><b>Catégorie de la question</b></label>

                            <select
                                name="category_id"
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Choisir le domaine d’ingenierie la plus adaptéé à la question</option>
                                {questionCategories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div><br />
                    <div>
                        <p>Quels sont les détails de votre problème ?</p>
                        <small>Présentez le problème et développez ce que vous avez mis dans le titre.</small>
                        {/* <JoditEditor
                            className='joditEditor'
                            ref={editor}
                            config={config}
                            value={content}
                            tabIndex={1} 
                            onChange={newContent => setContent(newContent.target.value)}
                           
                        /> */}

                        <TextArea
                            label={'content'}
                            reference={'content'}
                            placeholder="Développez votre problème ici..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                    </div>

                    <br />
                    <Button
                    className={"btn-create-question"}
                        disabled={isLoading}
                        type={"submit"}
                        text={isLoading ? "Chargement ..." : <strong>Envoyer</strong>}
                        style={{ display: 'flex', alignItems: 'end' }}
                    />

                </div>
            </form>
        </>
    )
}










