import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import './Chat.css';
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
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.data.success) {
                setMessages((prevMessages) => [...prevMessages, response.data.data]);
                setMessage('');
                setFile(null);
                displayMessages()

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
                displayMessages()

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
        <div className="chat-container">
            <CommunityBar group={group} goBackClick={goBackClick} />
            <div className="chat-content">
                {messages.map((message) => (
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

                ))}
            </div>
            <form className="chat-form" onSubmit={handleMessageSend}>
                <label className="file-input-label">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden" />
                    <FilePlus size={20} />
                </label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="text-message"
                />
                <Button className={"send-button"}
                    icon={<Send size={16} />}
                    type="submit"
                />
            </form>
        </div>
    );
}





