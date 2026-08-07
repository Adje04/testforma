import React from 'react';
import { useUser } from '../../State/UserContext.jsx';
import './UserHome.css'; 

export default function UserHome() {
  const { user } = useUser();
  
 
  const username = user?.name || 'Utilisateur';

  return (
    <div className="user-home-container">
      <h3 className="user-home-greeting">Bienvenue sur Foruma,  <span style={{color:'#094EFF'}}>{username}</span> !</h3>
      <img
        src="/images/Site Stats-rafiki.svg"
        className="user-home-image"
        alt="dashboardUser"
      />
    </div>
  );
}
