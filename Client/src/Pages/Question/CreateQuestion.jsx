import React, { useState, useEffect } from 'react'
import Button from '../../Components/Button/Button'
import Input from '../../Components/Input/Input';
import { toast } from 'sonner';
import { apiClient } from '../../axios/axios.js';
import { useNavigate } from 'react-router';
import TextArea from '../../Components/Textarea/TextArea.jsx';
import { Link } from 'react-router-dom';
import { HelpCircle, List } from 'lucide-react'

export default function CreateQuestion() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [categoryId, setCategoryId] = useState('');
  const [questionCategories, setQuestionCategories] = useState([]);
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const displayQuestionCategories = async () => {
    try {
      const response = await apiClient.get('category-question')
      if (response.data.success) {
        setQuestionCategories(response.data.data);
      } else {
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
        navigate(`/userDashboard/list-question`);
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Poser une question</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Exposez publiquement un problème pour obtenir l'aide de la communauté.
          </p>
        </div>
        <Link to="/userDashboard/list-question">
          <Button
            text="Voir les questions"
            icon={<List className="h-4 w-4" />}
            className="bg-transparent! text-primary! border! border-primary/30! hover:bg-primary/10!"
          />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-5">
          <Input
            label="Titre"
            type="text"
            reference="title"
            placeholder="Donnez un titre à votre question..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
              Catégorie de la question
            </label>
            <select
              name="category_id"
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="input-base"
            >
              <option value="">Choisir le domaine d'ingénierie adapté</option>
              {questionCategories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-foreground">Détails du problème</p>
            <p className="mb-2 text-xs text-muted-foreground">
              Présentez le problème et développez ce que vous avez mis dans le titre.
            </p>
            <TextArea
              label=""
              reference="content"
              placeholder="Développez votre problème ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              type="submit"
              text={isLoading ? 'Chargement...' : 'Envoyer'}
              icon={<HelpCircle className="h-4 w-4" />}
            />
          </div>
        </div>
      </form>
    </div>
  )
}