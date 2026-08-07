import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CommunitySidebar.css';
import { apiClient } from '../../axios/axios';
import Input from '../Input/Input';

export default function CommunitySidebar({ onGroupClick }) {

  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState([]);
  const colors = [
    'bg-yellow', 'bg-green', 'bg-orange', 'bg-blue', 'bg-yellow-dark', 'bg-red', 'bg-purple',
  ];

  useEffect(() => {
    const displayGroupByUser = async () => {
      try {
      
        const response = await apiClient.get(`user-community`);

        if (Array.isArray(response.data.data)) {
          const defaultAvatarColor = response.data.data.map(group => ({
            ...group,
            color: colors[Math.floor(Math.random() * colors.length)],
          }));

          setGroups(defaultAvatarColor);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes:', error);
      }
    };

    displayGroupByUser(); 
  }, []);

  return (
    <aside id="logo-sidebar" className="sidebar-container hidden-sidebar">
      <div className="sidebar-content">
     
        <Link to={"/dashboard"} >
          <p className="sidebar-title">Tableau de bord</p>
        </Link>
        <h2 className="groups-title">Discussion</h2>
       
        <Input
          label={''}
          type={'search'}
          reference={'research'}
          placeholder={'Rechercher un groupe ici...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=  { "community-search" } 
        />
     <ul className="groups-list">
          {groups && groups
            .filter(group => group.name.toLowerCase().includes(search.toLowerCase()))
            .map((group, index) => {
              return (
                <li
                  key={index}
                  className="group-item"
                  onClick={() => {
                    localStorage.setItem('selectedGroupId', group._id);
                    onGroupClick(group);
                  }}
                >
               
                  {group.avatar ? (
                    <img src={ `${import.meta.env.VITE_ASSETS_URL}/avatars/${group.avatar.split('\\').pop()}` } alt={group.name} className= {`group-avatar-img` } />
                  ) : (
                    <div className={`${group.color} group-avatar`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="group-icon">
                        <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" />
                        <path d="M12.3332 15.9999C13.6593 15.9999 14.931 15.4731 15.8687 14.5354C16.8064 13.5977 17.3331 12.326 17.3331 10.9999C17.3331 9.67387 16.8064 8.40211 15.8687 7.46445C14.931 6.52678 13.6593 6 12.3332 6C11.0072 6 9.7354 6.52678 8.79773 7.46445C7.86006 8.40211 7.33329 9.67387 7.33329 10.9999C7.33329 12.326 7.86006 13.5977 8.79773 14.5354C9.7354 15.4731 11.0072 15.9999 12.3332 15.9999ZM25.1108 12.6666C25.1108 13.5506 24.7596 14.3985 24.1345 15.0236C23.5094 15.6487 22.6616 15.9999 21.7775 15.9999C20.8935 15.9999 20.0457 15.6487 19.4205 15.0236C18.7954 14.3985 18.4442 13.5506 18.4442 12.6666C18.4442 11.7825 18.7954 10.9347 19.4205 10.3096C20.0457 9.68447 20.8935 9.33329 21.7775 9.33329C22.6616 9.33329 23.5094 9.68447 24.1345 10.3096C24.7596 10.9347 25.1108 11.7825 25.1108 12.6666ZM12.3332 17.111C14.5476 17.111 16.5609 17.7865 18.0409 18.7398C18.782 19.2176 19.4165 19.7809 19.8776 20.3954C20.3298 21.0009 20.6664 21.7287 20.6664 22.5075C20.6664 23.3464 20.2776 24.0186 19.7064 24.5042C19.1676 24.9597 18.4654 25.2553 17.7398 25.4586C16.2809 25.8664 14.351 25.9997 12.3332 25.9997C10.3155 25.9997 8.38549 25.8664 6.92774 25.4586C6.20108 25.2553 5.49887 24.9597 4.9611 24.5042C4.38777 24.0197 4 23.3464 4 22.5075C4 21.7276 4.33666 21.0009 4.78888 20.3965C5.24998 19.7809 5.88442 19.2165 6.62552 18.7409C8.1055 17.7854 10.1188 17.111 12.3332 17.111ZM21.7775 17.111C23.2442 17.111 24.5753 17.5954 25.5553 18.2787C26.4686 18.9154 27.333 19.9198 27.333 21.0787C27.333 21.7309 27.0519 22.2709 26.6241 22.6631C26.2275 23.0175 25.7409 23.2475 25.2697 23.4009C24.2597 23.7109 22.7486 23.8775 21.7775 23.9997C20.8064 23.8775 19.2953 23.7109 18.2853 23.4009C17.8131 23.2475 17.3265 23.0186 16.9299 22.6631C16.502 22.2709 16.221 21.7309 16.221 21.0787C16.221 19.9198 17.0855 18.9154 18.0009 18.2787C18.981 17.5954 20.312 17.111 21.7775 17.111Z" fill="white" />
                      </svg>
                    </div>
                  )}
                  <span className="group-name">{group.name}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </aside>
  );
}










