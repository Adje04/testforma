import React, { useState } from 'react';
import CommunitySidebar from '../../Components/Sidebar/CommunitySidebar';
import Chat from '../../Components/Chat/Chat';
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Discussion() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (group) => setSelectedGroup(group);
  const goBackClick = () => setSelectedGroup(null);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={cn(
        'h-full border-r border-border',
        selectedGroup ? 'hidden w-0 md:block md:w-80' : 'block w-full md:w-80'
      )}>
        <CommunitySidebar onGroupClick={handleGroupClick} />
      </div>

      <div className={cn('h-full flex-1', selectedGroup ? 'block' : 'hidden md:block')}>
        {selectedGroup ? (
          <Chat group={selectedGroup} goBackClick={goBackClick} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-base font-medium text-foreground">Sélectionnez une discussion</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Choisissez un groupe dans la liste pour voir les messages et échanger.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}