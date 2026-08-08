import React, { useState } from 'react'
import Navbar from '../../Components/TopBar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'

export default function Dashboard() {
    const [sidebar, setSidebar] = useState(false)
    const sidebarSmallScreen = () => setSidebar(!sidebar)

    return (
        <div className="min-h-screen bg-background">
            <Navbar OnMenuClick={sidebarSmallScreen} />
            <div className="flex">
                <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 lg:block">
                    <Sidebar isStatic />
                </div>

                {sidebar && (
                    <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={sidebarSmallScreen} />
                )}
                <Sidebar
                    toggleSidebar={sidebarSmallScreen}
                    className={sidebar ? 'flex lg:hidden' : 'hidden'}
                />

                <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}