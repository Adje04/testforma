import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import { useUser } from '../../State/UserContext';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react'

export default function QuestionDetail() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState('');

  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = decodeURIComponent(location.pathname) === `/question/${questionId}`

  const getBackgroundColor = () => {
    const colors = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#e53e3e', '#9f7aea'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const displayQuestionDetail = async () => {
    try {
      const response = await apiClient.get(`question/${questionId}`);
      if (response.data.success) {
        setQuestion(response.data.data);
        setResponses(response.data.data.responses);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la question', error);
    }
  };

  const handleAddResponse = async () => {
    if (!user) {
      navigate('/login')
      return;
    }
    try {
      const response = await apiClient.post(`${questionId}/add-response`, { content: newResponse });
      if (response.data.success) {
        setResponses([...responses, response.data.data]);
        setNewResponse('');
        displayQuestionDetail();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la réponse', error);
    }
  };

  useEffect(() => {
    displayQuestionDetail();
  }, [questionId]);

  return (
    <div>
      {isPublic && <Navbar />}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {isPublic && (
          <button
            onClick={() => navigate('/list-question')}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux questions
          </button>
        )}

        {question && (
          <article className="rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{question.title}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{question.content}</p>
          </article>
        )}

        {/* Réponses */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Réponses {responses.length > 0 && `(${responses.length})`}
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {responses.map((response, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: response.user_id?.avatar ? 'transparent' : getBackgroundColor() }}
                  >
                    {response.user_id?.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_ASSETS_URL || ''}/avatars/${response.user_id.avatar.split('\\').pop()}`}
                        alt="Avatar"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      response.user_id?.name ? response.user_id.name.slice(0, 2).toUpperCase() : '?'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {response.user_id?.name || 'Anonyme'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{response.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {responses.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune réponse pour le moment.</p>
            )}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {showForm ? 'Annuler' : 'Ajouter une réponse'}
          </button>

          {showForm && (
            <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-soft">
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                className="input-base min-h-[120px] resize-y"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleAddResponse}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Soumettre
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPublic && <Footer />}
    </div>
  )
}