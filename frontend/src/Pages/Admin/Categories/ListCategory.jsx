import React, { useEffect, useState } from 'react';
import './style.css';
import Input from '../../../Components/Input/Input'
import Button from '../../../Components/Button/Button'
import QuestionCategory from './QuestionCategory';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiClient } from '../../../axios/axios';
import { toast } from 'react-toastify';
import { useUser } from '../../../State/UserContext';
import { useNavigate } from 'react-router';

export default function ItemTable() {
    //gerer l'affichage
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    //gérer les recherches
    const [search, setsearch] = useState('');
    // gerer les catégories
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [questionCategories, setQuestionCategories] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user || !user.isAdmin) {
    //         navigate('/login'); // Redirection si l'utilisateur n'est pas connecté ou n'est pas admin
    //     }
    // }, [user, navigate]);



    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event) => {
        setsearch(event.target.value);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
    };

    const formData = new FormData();
    formData.set('name', name);
    formData.set('description', description);

    const filteredRows = questionCategories.filter((questionCategories) =>
        questionCategories.name.toLowerCase().includes(search.toLowerCase())
    );

    const displayQuestionCategories = async () => {
        try {
            const response = await apiClient.get('category-question');
            if (response.data.success) {
                // console.log(response.data.data); 

                setQuestionCategories(response.data.data);
            }
            else {
                console.error('les groupes ne s\'affiche pas', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);

            throw error;
        }
    };
    useEffect(() => { displayQuestionCategories(); }, []);

    const deleteQuestionCategory = async (questionCategory) => {

        try {
            const response = await apiClient.delete(`category-delete/${questionCategory}`);
            if (response.status === 200) {
                toast.success('Catégorie supprimée avec succès!');
                displayQuestionCategories()
            } else {
                toast.error('Erreur lors de la suppression de la catégorie!');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie', error);
            throw error;
        }
    };

    return (
        <div className="item-table-container">
            <h1>Liste des catégories</h1>
            <div className='flex-2'>
                <Input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={handleFilterChange}
                    className="search-input"
                />
                <Button onClick={() => setShowCreateCategory(true)} className="create-button"
                    text={'créer une catégorie'} />
            </div>

            <table className="item-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {questionCategories
                        .filter(questionCategory => questionCategory.name.toLowerCase().includes(search.toLowerCase()))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((questionCategory, index) => (
                            <tr key={index}>
                                <td>{page * rowsPerPage + index + 1}</td>
                                <td>{questionCategory.name}</td>
                                <td>{questionCategory.description}</td>
                                <td className='flex-op'>
                                    <Button onClick={() => openEditModal(questionCategory)}
                                        icon={<Pencil size={16} />}
                                    />
                                    <Button className='btn-operation' onClick={() => deleteQuestionCategory(questionCategory._id)}
                                        icon={<Trash2 size={16} color="red" />}
                                    />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <div className="pagination">
                <div className='flex'>
                    <span style={{ display: "flex" }}>
                        <p> Affichage par page</p>
                        <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                            <option value={3}>3</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                        </select>
                    </span>
                    <span>
                        Page {page + 1} of {Math.ceil(filteredRows.length / rowsPerPage)}
                    </span>
                    {/* </div> */}
                    <div style={{ display: "flex" }}>
                        <Button
                            disabled={page === 0}
                            onClick={() => handleChangePage(page - 1)}
                            style={{ backgroundColor: 'transparent' }}
                            icon={<ChevronLeft size={18} color="#273eec" />}
                        />

                        <Button
                            disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
                            onClick={() => handleChangePage(page + 1)}
                            style={{ backgroundColor: 'transparent' }}
                            icon={<ChevronRight size={18} color="#273eec" />}
                        />
                    </div>
                </div>


            </div>

            {showCreateCategory && (
                <div className="overlay">
                    <div className="modal">
                        <QuestionCategory
                            onSave={() => {
                                displayQuestionCategories();
                                setShowCreateCategory(false);
                            }}
                            onCancel={() => setShowCreateCategory(false)}
                        />

                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="overlay">
                    <div className="modal">
                        <QuestionCategory
                            category={selectedCategory}
                            onSave={() => {
                                displayQuestionCategories();
                                closeEditModal();
                            }}
                            onCancel={closeEditModal}
                        />
                    </div>
                </div>
            )}

        </div>
    );
}










