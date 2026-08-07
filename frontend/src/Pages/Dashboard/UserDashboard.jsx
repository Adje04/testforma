

import React, { useState } from 'react'
import Navbar from '../../Components/TopBar/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Footer from '../../Components/Footer/Footer';
import './Dashboard.css'

export default function UserDashboard() {
    const [sidebar, setSidebar] = useState(false);

    const sidebarSmallScreen = () => {
        setSidebar(!sidebar);
    };

    return (
        <div>
 
            <Navbar OnMenuClick={sidebarSmallScreen} />
            <main>
   
                <Sidebar className={sidebar ? 'visible' : 'hidden'} toggleSidebar={sidebarSmallScreen} />
                
                <div className="wrap-content">

                    <Outlet />
                </div>
            </main>
        </div>
    );
}



