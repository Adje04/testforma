import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../axios/axios';
import { Search, MessageCircle, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils'

const AVATAR_COLORS = ['#ecc94b', '#48bb78', '#ed8936', '#d69e2e', '#e53e3e', '#9f7aea', '#3b82f6']

export default function CommunitySidebar({ onGroupClick }) {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const displayGroupByUser = async () => {
      try {
        const response = await apiClient.get(`user-community`);
        if (Array.isArray(response.data.data)) {
          const withColor = response.data.data.map((group) => ({
            ...group,
            color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
          }));
          setGroups(withColor);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes:', error);
      }
    };
    displayGroupByUser();
  }, []);

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-base font-semibold text-foreground">Discussions</h2>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Tableau de bord
        </Link>
      </div>

      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher un groupe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucune communauté rejointe</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {groups
              .filter((group) => group.name.toLowerCase().includes(search.toLowerCase()))
              .map((group, index) => (
                <li
                  key={index}
                  onClick={() => {
                    localStorage.setItem('selectedGroupId', group._id);
                    onGroupClick(group);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  {group.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL || ''}/avatars/${group.avatar.split('\\').pop()}`}
                      alt={group.name}
                      className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-sm font-medium text-foreground">{group.name}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </aside>
  )
}