import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CommunityBar from '../TopBar/CommunityBar';
import { FilePlus, Send } from 'lucide-react';
import Messages from './Messages';
import { apiClient } from '../../axios/axios';

export default function Chat({ group, goBackClick }) {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const groupId = localStorage.getItem('selectedGroupId');
  const currentUserId = localStorage.getItem('userId');

  const displayMessages = async () => {
    try {
      const response = await apiClient.get(`messages/${groupId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        toast.error('Erreur lors de la récupération des messages');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    }
  };

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (!message && !file) return;

    const formData = new FormData();
    formData.set('content', message);
    if (file) formData.append('file', file);

    try {
      const response = await apiClient.post(`send/${groupId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setMessages((prevMessages) => [...prevMessages, response.data.data]);
        setMessage('');
        setFile(null);
        displayMessages();
      } else {
        toast.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await apiClient.delete(`message/${messageId}`);
      if (response.data.success) {
        toast.success('Message supprimé avec succès');
        displayMessages();
      } else {
        toast.error('Erreur lors de la suppression du message');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      toast.error('Erreur serveur');
    }
  };

  useEffect(() => {
    if (groupId) {
      displayMessages();
    } else {
      toast.error('Aucun groupe sélectionné.');
    }
  }, [groupId]);

  return (
    <div className="flex h-full flex-col">
      <CommunityBar group={group} goBackClick={goBackClick} />

      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <MessageCirclePlaceholder />
            <p className="mt-3">Aucun message. Démarrez la conversation !</p>
          </div>
        ) : (
          messages.map((message) => (
            <Messages
              key={message._id}
              user={message.sender._id}
              content={message.content}
              path={message.path}
              type={message.type}
              createdAt={message.createdAt}
              username={message.sender === currentUserId ? null : (message.sender.name || 'other')}
              onDelete={() => handleDeleteMessage(message._id)}
            />
          ))
        )}
      </div>

      <form onSubmit={handleMessageSend} className="flex items-center gap-2 border-t border-border bg-card p-3">
        <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          <FilePlus className="h-5 w-5" />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="input-base flex-1"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          aria-label="Envoyer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

function MessageCirclePlaceholder() {
  return <div className="text-4xl">💬</div>
}