import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import './Question.css';
import { useUser } from '../../State/UserContext';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';

export default function QuestionDetail() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [details, setDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState('');

  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const getBackgroundColor = () => {

    const colors = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#d69e2e', '#e53e3e', '#9f7aea'];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  const displayQuestionDetail = async () => {
    try {
      const response = await apiClient.get(`question/${questionId}`);
      if (response.data.success) {
        setQuestion(response.data.data);
        setResponses(response.data.data.responses);
        console.log(response.data.data);

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
    <>
      <div>
        {decodeURIComponent(location.pathname) === `/question/${questionId}` && <div><Navbar /> <br /><br /><br /><br /><br /></div>}
      </div>
      <div className="question-detail-container">
        {question && (
          <div>
            <h2 className="question-title">{question.title}</h2>
            <p className="question-content">{question.content}</p>

            <div className="responses-section">
              <h3>Réponses</h3>
              <ul>
                {responses.map((response, index) => {
                  return (
                    <div key={index} className='response-detail'>
                      <li className="response-item">{response.content}</li>
                      <li className="response-avatar" style={{ backgroundColor: response.user_id?.avatar ? 'transparent' : getBackgroundColor() }}>
                        {response.user_id?.avatar ? (
                          <>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/avatars/${response.user_id.avatar.split('\\').pop()}`} alt="Avatar de l'utilisateur" />

                            {response.user_id?.name ? (<small className='avatar-name'>{response.user_id.name}</small>) : null}
                          </>
                        ) : (
                          response.user_id?.name ? (<span>{response.user_id.name.slice(0, 2).toUpperCase()}</span>) : null
                        )}
                      </li>

                    </div>
                  );
                })}

              </ul>


            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="add-response-button"
            >
              {showForm ? 'Annuler' : 'Ajouter une réponse'}
            </button>

            {showForm && (
              <div className="response-form">
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Écrivez votre réponse ici"
                ></textarea>
                <button onClick={handleAddResponse}>Soumettre</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {decodeURIComponent(location.pathname) === `/question/${questionId}` && <div> <br /><br /><br /><br /><br /><Footer /></div>}
      </div>
    </>
  );
}





