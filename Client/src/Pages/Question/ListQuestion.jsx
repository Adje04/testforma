import React, { useEffect, useState } from 'react';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CardQuestion from '../../Components/Card/CardQuestion';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import Button from '../../Components/Button/Button';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';

export default function ListQuestion() {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const isPublic = decodeURIComponent(location.pathname) === '/list-question'

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

  const totalPages = Math.ceil(filteredQuestions.length / rowsPerPage)

  return (
    <div>
      {isPublic && <Navbar />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Questions techniques</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredQuestions.length} question{filteredQuestions.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une question"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9"
            />
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
            <Filter className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucune question trouvée.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuestions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((question) => (
                <div key={question._id} onClick={() => goToQuestionDetail(question._id)}>
                  <CardQuestion
                    title={question.title}
                    text={question.content}
                    likes={20}
                    responses={question.responseCount}
                  />
                </div>
              ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Lignes par page</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="rounded-lg border border-input bg-background px-2 py-1 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring/40"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>Page {page + 1} / {totalPages || 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => handleChangePage(page - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => handleChangePage(page + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isPublic && <Footer />}
    </div>
  )
}