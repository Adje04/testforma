import React, { useState } from 'react';
import Button from '../Button/Button';
import { ArrowLeft, Menu, UserPlus } from 'lucide-react';
import Modal from '../Modal/Modal';
import AddMember from '../Community/AddMember';

export default function CommunityBar({ group, goBackClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!group) return null;

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={goBackClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {group.avatar ? (
          <img
            src={`${import.meta.env.VITE_ASSETS_URL || ''}/avatars/${group.avatar.split('\\').pop()}`}
            alt={group.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {group.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">{group.name}</h2>
          <p className="truncate text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          onClick={openModal}
          icon={<UserPlus className="h-4 w-4" />}
          className="bg-transparent! text-foreground! border! border-border! hover:bg-muted! px-3! py-2!"
        />
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Modal isVisible={isModalOpen} onClose={closeModal}>
        <AddMember />
      </Modal>
    </nav>
  )
}