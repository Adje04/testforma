import React, { useEffect, useState } from 'react';
import { Download, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils'

export default function Messages({ user, content, path, type, createdAt, username, messageId, onDelete }) {
  const userId = localStorage.getItem('userId');
  const isMe = userId && user === userId;

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleDelete = () => {
    onDelete(messageId);
    setShowMenu(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Message copié dans le presse-papiers');
    }).catch((error) => {
      console.error('Erreur lors de la copie du message:', error);
    });
    setShowMenu(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.message-options-menu')) {
      setShowMenu(false);
    }
  };

  const isImage = (filePath) => {
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = filePath?.split('.').pop().toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')} onContextMenu={handleRightClick}>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft sm:max-w-[70%]',
        isMe ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-card border border-border text-foreground'
      )}>
        {!isMe && username && (
          <p className="mb-1 text-xs font-semibold text-primary">{username}</p>
        )}

        {path ? (
          isImage(path) ? (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={`${import.meta.env.VITE_ASSETS_URL || ''}/chats/${path.split('\\').pop()}`}
                alt="Image"
                className="max-h-60 w-full object-cover"
              />
              <a
                href={`${import.meta.env.VITE_ASSETS_URL || ''}/chats/${path.split('\\').pop()}`}
                download
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <a
              href={`${import.meta.env.VITE_ASSETS_URL || ''}/chats/${path.split('\\').pop()}`}
              download
              className="flex items-center gap-3 rounded-lg bg-background/10 p-2 transition-colors hover:bg-background/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/20">
                <Download className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{path.split('\\').pop()}</p>
                <p className="text-xs opacity-70">{type?.split('application/')[1] || 'fichier'}</p>
              </div>
            </a>
          )
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        )}

        <p className={cn('mt-1 text-right text-[10px]', isMe ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {showMenu && (
        <div
          className="message-options-menu fixed z-50 min-w-[140px] overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lift"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted" onClick={handleCopy}>
            <Copy className="h-4 w-4" /> Copier
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>
      )}
    </div>
  )
}