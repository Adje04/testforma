import React, { useEffect, useState } from 'react';
import Card from '../../Components/Card/Card';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/TopBar/Navbar';
import Pagination from '../../Components/Pagination/Pagination';
import { apiClient } from '../../axios/axios';
import { Filter, Download, Search } from 'lucide-react';
import { useUser } from '../../State/UserContext';
import { useLocation, useNavigate } from 'react-router';
import Footer from '../../Components/Footer/Footer';
import Input from '../../Components/Input/Input';

export default function Library() {
  // Les ressources
  const [resources, setResources] = useState([])
  const [search, setSearch] = useState('')
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation();
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isPublic = decodeURIComponent(location.pathname) === '/bibliothèque'

  // Calculer les index pour afficher les ressources actuelles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = resources.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const displayResources = async () => {
    try {
      const response = await apiClient.get('resources');
      if (response.data.success) {
        setResources(response.data.data);
      } else {
        console.error('les questions ne s\'affiche pas', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questions', error);
      throw error;
    }
  };

  const handleDownload = async (resourceId, filename) => {
    if (!user) {
      navigate('/login')
      return;
    }
    try {
      const response = await apiClient.get(`download/${resourceId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la ressource', error);
    }
  };

  useEffect(() => { displayResources(); }, []);

  const filtered = currentResources.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {isPublic && <Navbar />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bibliothèque</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {resources.length} ressource{resources.length > 1 ? 's' : ''} disponible{resources.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une ressource"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
            <Filter className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucune ressource trouvée.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((resource, index) => (
              <Card
                key={index}
                image={resource.cover}
                text={resource.title}
                icon={<Download className="h-4 w-4" onClick={() => handleDownload(resource._id, resource.name)} />}
              />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={resources.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      {isPublic && <Footer />}
    </div>
  )
}