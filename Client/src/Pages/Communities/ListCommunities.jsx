import React, { useEffect, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Search, Users, UsersRound } from 'lucide-react'
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router';
import Button from '../../Components/Button/Button';
import { apiClient } from '../../axios/axios';
import { useUser } from '../../State/UserContext';
import CreateCommunity from './CreateCommunity';
import Navbar from '../../Components/TopBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Modal from '../../Components/Modal/Modal';

export default function ListCommunities() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [search, setsearch] = useState('');
  const [showcreateCommunity, setShowCreateCommunity] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublic = decodeURIComponent(location.pathname) === '/communities'

  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const displaycommunities = async () => {
    try {
      const response = await apiClient.get('communities');
      if (response.data.success) {
        setCommunities(response.data.data);
      } else {
        console.error('les groupes ne s\'affiche pas', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
      throw error;
    }
  };

  const joinCommunity = async (group) => {
    if (!user) {
      navigate('/login')
      return;
    }
    try {
      const response = await apiClient.post(`join/${group}`);
      if (response.status === 200) {
        toast.success('Vous êtes désormais membre de ce groupe !');
        displaycommunities()
      } else {
        toast.error('Erreur lors de l\'ajout !');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          toast.error(error.response.data.message || "L'email est déjà utilisé.");
        } else {
          toast.error("Une erreur est survenue");
        }
      } else {
        toast.error("Une erreur est survenue");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => { displaycommunities(); }, []);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage)
  const pageRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <div>
      {isPublic && <Navbar />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Communautés</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredRows.length} groupe{filteredRows.length > 1 ? 's' : ''} à découvrir
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                className="input-base pl-9"
              />
            </div>
            <Button
              onClick={() => setShowCreateCommunity(true)}
              text="Créer"
              icon={<Plus className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Grille de communautés */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageRows.map((group, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-base font-bold text-white">
                  {group.name?.slice(0, 2).toUpperCase()}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {group.members?.length ?? 0}
                </span>
              </div>
              <h3 className="relative mt-4 text-base font-semibold text-foreground">{group.name}</h3>
              <p className="relative mt-1.5 line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground">
                {group.description}
              </p>
              <div className="relative mt-5">
                <Button
                  onClick={() => joinCommunity(group._id)}
                  text="Rejoindre"
                  icon={<Plus className="h-4 w-4" />}
                  className="!w-full"
                />
              </div>
            </div>
          ))}

          {filteredRows.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
              <UsersRound className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">Aucune communauté trouvée</p>
              <p className="text-xs text-muted-foreground">Essayez un autre terme ou créez la vôtre.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Par page</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="rounded-lg border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
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

      <Modal isVisible={showcreateCommunity} onClose={() => setShowCreateCommunity(false)}>
        <CreateCommunity
          onSave={() => {
            displaycommunities();
            setShowCreateCommunity(false);
          }}
          onCancel={() => setShowCreateCommunity(false)}
        />
      </Modal>
    </div>
  )
}