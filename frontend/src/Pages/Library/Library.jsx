import React, { useEffect, useState } from 'react';
import Card from '../../Components/Card/Card';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/TopBar/Navbar';
import './Library.css';
import Pagination from '../../Components/Pagination/Pagination';
import { apiClient } from '../../axios/axios';
import { Filter, Download } from 'lucide-react';
import fileDownload from 'js-file-download';
import { useUser } from '../../State/UserContext';
import { useLocation, useNavigate } from 'react-router';
import Footer from '../../Components/Footer/Footer';
import Button from '../../Components/Button/Button';
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
      }
      else {
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

      // Télécharge le fichier en utilisant le nom dynamique
      fileDownload(response.data, filename);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la ressource', error);
    }
  };


  useEffect(() => { displayResources(); }, []);

  return (
    <>

      <div >

        <div>
          {decodeURIComponent(location.pathname) === '/bibliothèque' && <div><Navbar /> <br /><br /><br /><br /><br /></div>}

        </div>
        <div className='filter-area'>

          <Button icon={<Filter size={16} />} className="filter-button" />

          <div className='filter-question'>

            <Input
              type="text"
              placeholder="Rechercher une resource"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className='book'>

          {currentResources
            .filter((resource) =>
              resource.title.toLowerCase().includes(search.toLowerCase()))
            .map((resource, index) => {
              return (
                <div key={index}>
                  <Card
                    image={resource.cover}
                    text={resource.title}
                    icon={<Download size={18} onClick={() => handleDownload(resource._id, resource.name)} />}
                  />
                </div>
              )
            })}

        </div>
        <div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={resources.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>

        <div>
          {decodeURIComponent(location.pathname) === '/bibliothèque' && <div><Footer /><br /><br /><br /><br /></div>}

        </div>
      </div>
    </>
  );
}







