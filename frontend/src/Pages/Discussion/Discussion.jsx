import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './Discussion.css';
import CommunitySidebar from '../../Components/Sidebar/CommunitySidebar';
import Chat from '../../Components/Chat/Chat';

export default function Discussion() {
    const [selectedGroup, setSelectedGroup] = useState(null);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
    };

    const goBackClick = () => {
        setSelectedGroup(null); 
    };

    return (
        <div className={`discussion-container ${selectedGroup ? 'sidebar-hidden' : 'show-sidebar'}`}>
          <div className="discussion-flex">
          <div className="sidebar-section">
                <CommunitySidebar onGroupClick={handleGroupClick} />
            </div>
            <div className={`chat-section ${selectedGroup ? 'show-chat' : 'hidden-chat'}`}>
                {selectedGroup ? (
                    <Chat group={selectedGroup} goBackClick={goBackClick} />
                ) : (
                    <div className="no-group-selected">
                        <p className="no-group-text">Sélectionner un groupe pour voir les détails</p>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
}


// export default function Discussion() {
//     const [isLoading, setIsLoading] = useState(false);

//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [selectedGroup, setSelectedGroup] = useState(null);

//     const handleGroupClick = (group) => {
//         setSelectedGroup(group);
//     };

//     const goBackClick = () => {
//         setSelectedGroup(null);
//     };

//     return (
//         <div>
//             <ToastContainer stacked />
//             <div className="discussion-container">
//                 <div className="discussion-flex">
//                     <div className={`sidebar-section ${selectedGroup ? 'sidebar-hidden' : ''}`}>
//                         <CommunitySidebar onGroupClick={handleGroupClick} />
//                     </div>
//                     <div className={`chat-section ${selectedGroup ? '' : ''}`}>
//                         {selectedGroup ? (
//                             !isLoading && <Chat group={selectedGroup} goBackClick={goBackClick} />
//                         ) : (
//                             <div className="no-group-selected">
//                                 <p className="no-group-text">Sélectionner un groupe pour voir les détails</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }