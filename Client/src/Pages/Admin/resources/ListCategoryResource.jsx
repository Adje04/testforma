import React, { useEffect, useState } from 'react';
import Input from '../../../Components/Input/Input'
import Button from '../../../Components/Button/Button'
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import { apiClient } from '../../../axios/axios';
import { toast } from 'sonner';
import { useUser } from '../../../State/UserContext';
import { useNavigate } from 'react-router';
import ResourceCategory from './ResourceCategory';
import Modal from '../../../Components/Modal/Modal';

export default function ListCategoryResource() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [search, setsearch] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [resourceCategories, setResourceCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (event) => setsearch(event.target.value);

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const filteredRows = resourceCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayResourceCategories = async () => {
    try {
      const response = await apiClient.get('resource-category');
      if (response.data.success) {
        setResourceCategories(response.data.data);
      } else {
        console.error('les groupes ne s\'affiche pas', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
      throw error;
    }
  };
  useEffect(() => { displayResourceCategories(); }, []);

  const deleteResourceCategory = async (resourceCategory) => {
    try {
      const response = await apiClient.delete(`delete-resource-category/${resourceCategory}`);
      if (response.status === 200) {
        toast.success('Catégorie supprimée avec succès !');
        displayResourceCategories()
      } else {
        toast.error('Erreur lors de la suppression de la catégorie !');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie', error);
      throw error;
    }
  };

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catégories de ressources</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filteredRows.length} catégorie{filteredRows.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom"
              value={search}
              onChange={handleFilterChange}
              className="input-base pl-9"
            />
          </div>
          <Button onClick={() => setShowCreateCategory(true)} text="Créer" icon={<Plus className="h-4 w-4" />} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Opérations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((resourceCategory, index) => (
                  <tr key={index} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{page * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{resourceCategory.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{resourceCategory.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(resourceCategory)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteResourceCategory(resourceCategory._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucune catégorie trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Lignes par page</span>
          <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="rounded-lg border border-input bg-background px-2 py-1 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring/40">
            <option value={2}>2</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span>Page {page + 1} / {totalPages || 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page === 0} onClick={() => handleChangePage(page - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button disabled={page >= totalPages - 1} onClick={() => handleChangePage(page + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal isVisible={showCreateCategory} onClose={() => setShowCreateCategory(false)}>
        <ResourceCategory
          onSave={() => { displayResourceCategories(); setShowCreateCategory(false); }}
          onCancel={() => setShowCreateCategory(false)}
        />
      </Modal>

      <Modal isVisible={showEditModal} onClose={closeEditModal}>
        <ResourceCategory
          category={selectedCategory}
          onSave={() => { displayResourceCategories(); closeEditModal(); }}
          onCancel={closeEditModal}
        />
      </Modal>
    </div>
  )
}