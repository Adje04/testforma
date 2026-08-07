import React, { useEffect, useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import CardQuestion from '../../Components/Card/CardQuestion';
import { useLocation, useNavigate } from 'react-router-dom';
import './Question.css';
import { apiClient } from '../../axios/axios';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/TopBar/Navbar';

export default function ListQuestion() {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const displayQuestions = async () => {
    try {
      const response = await apiClient.get('questions');
      if (response.data.success) {
        setQuestions(response.data.data);
      } else {
        console.error("Les questions ne s'affichent pas", response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questions', error);
      throw error;
    }
  };

 

  const goToQuestionDetail = (questionId) => {
    
    navigate(`/question/${questionId}`);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    displayQuestions();
  }, []);
  return (
    <div>
       <div>
          {decodeURIComponent(location.pathname) === '/list-question' && <div><Navbar /> <br /><br /><br /></div>}
          
        </div>
      <div className='filter-area'>
        <Button icon={<Filter size={16} />} className="filter-button" />

        <div className='filter-question'>
          <Input
            type="text"
            placeholder="Rechercher une question"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className='list-question'>
        {filteredQuestions
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((question, index) => {
            const bgColor = index % 2 === 0 ? '#FFFF' : '#F5DC9B';
            const isDarker = bgColor === '#F5DC9B';
            return (
              <div key={question._id} onClick={() => goToQuestionDetail(question._id)}>
                <CardQuestion
                  title={question.title}
                  text={question.content}
                  likes={20}
                  responses={question.responseCount}
                  style={{ backgroundColor: bgColor, border: '1px solid var(--primary-color)' }}
                  className={isDarker ? 'darker-bg' : ''}
                />
              </div>
            );
          })}
      </div>

      <div className="pagination">
        <div className='flex'>
          <span>
            Affichage par page
            <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </span>
          <span>
            Page {page + 1} of {Math.ceil(filteredQuestions.length / rowsPerPage)}
          </span>
        </div>

        <Button
          disabled={page === 0}
          onClick={() => handleChangePage(page - 1)}
          style={{ backgroundColor: 'transparent' }}
          icon={<ChevronLeft size={18} color="#273eec" />}
        />

        <Button
          disabled={page >= Math.ceil(filteredQuestions.length / rowsPerPage) - 1}
          onClick={() => handleChangePage(page + 1)}
          style={{ backgroundColor: 'transparent' }}
          icon={<ChevronRight size={18} color="#273eec" />}
        />
      </div>

      <div>
        {decodeURIComponent(location.pathname) === '/list-question' && <Footer />}

      </div>
    </div>
  );
}






