import React, { useState } from 'react';
import './Navbar.css';
import Button from '../Button/Button';
import { ArrowLeft, Menu } from 'lucide-react';
import Modal from '../Modal/Modal';
import AddMember from '../Community/AddMember';

export default function CommunityBar({ group, goBackClick }) {
    if (!group) return null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <nav className="groupbar">
            <div className="groupbar-content">

                <Button
                    className="button-back button-back-hidden"
                    onClick={goBackClick}
                    icon={<ArrowLeft size={18} />}
                />
                <div>
                    {group.avatar ? (
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/avatars/${group.avatar.split('\\').pop()}`} alt={group.name} className="group-avatar-img" />
                    ) : (
                        <div >
                            <svg className={`${group.color || ''} group-icon w-8 h-8`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 32 32"

                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12.3332 15.9999C13.6593 15.9999 14.931 15.4731 15.8687 14.5354C16.8064 13.5977 17.3331 12.326 17.3331 10.9999C17.3331 9.67387 16.8064 8.40211 15.8687 7.46445C14.931 6.52678 13.6593 6 12.3332 6C11.0072 6 9.7354 6.52678 8.79773 7.46445C7.86006 8.40211 7.33329 9.67387 7.33329 10.9999C7.33329 12.326 7.86006 13.5977 8.79773 14.5354C9.7354 15.4731 11.0072 15.9999 12.3332 15.9999ZM25.1108 12.6666C25.1108 13.5506 24.7596 14.3985 24.1345 15.0236C23.5094 15.6487 22.6616 15.9999 21.7775 15.9999C20.8935 15.9999 20.0457 15.6487 19.4205 15.0236C18.7954 14.3985 18.4442 13.5506 18.4442 12.6666C18.4442 11.7825 18.7954 10.9347 19.4205 10.3096C20.0457 9.68447 20.8935 9.33329 21.7775 9.33329C22.6616 9.33329 23.5094 9.68447 24.1345 10.3096C24.7596 10.9347 25.1108 11.7825 25.1108 12.6666ZM12.3332 17.111C14.5476 17.111 16.5609 17.7865 18.0409 18.7398C18.782 19.2176 19.4165 19.7809 19.8776 20.3954C20.3298 21.0009 20.6664 21.7287 20.6664 22.5075C20.6664 23.3464 20.2776 24.0186 19.7064 24.5042C19.1676 24.9597 18.4654 25.2553 17.7398 25.4586C16.2809 25.8664 14.351 25.9997 12.3332 25.9997C10.3155 25.9997 8.38549 25.8664 6.92774 25.4586C6.20108 25.2553 5.49887 24.9597 4.9611 24.5042C4.38777 24.0197 4 23.3464 4 22.5075C4 21.7276 4.33666 21.0009 4.78888 20.3965C5.24998 19.7809 5.88442 19.2165 6.62552 18.7409C8.1055 17.7854 10.1188 17.111 12.3332 17.111ZM21.7775 17.111C23.2442 17.111 24.5753 17.5954 25.5553 18.2787C26.4686 18.9154 27.333 19.9198 27.333 21.0787C27.333 21.7309 27.0519 22.2709 26.6241 22.6631C26.2275 23.0275 25.7253 23.2498 25.2419 23.3964C24.2753 23.6886 23.0308 23.7775 21.7775 23.7775H21.552C21.6964 23.3909 21.7775 22.9664 21.7775 22.5075C21.7775 21.4076 21.3075 20.452 20.7664 19.7298C20.2264 19.0087 19.5109 18.3743 18.712 17.8509C19.6609 17.3651 20.7115 17.1115 21.7775 17.111Z"
                                    fill="#001343" />
                            </svg>
                        </div>
                    )}
                </div>


                <div className='group-detail'>
                    <h2 className="groupbar-content-title">{group.name}</h2>
                    <div className="groupbar-content-description">
                        <small>{group.description}</small>
                        <small>{group.description}</small>
                    </div>
                </div>
            </div>

            <div className="groupbar-content">
                <div >
                    <Button className={"button-modal"} onClick={openModal}
                        text={
                            <span>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29.3333 12V10.6667C29.3333 9.93333 28.7333 9.33333 28 9.33333C27.2667 9.33333 26.6667 9.93333 26.6667 10.6667V12H25.3333C24.6 12 24 12.6 24 13.3333C24 14.0667 24.6 14.6667 25.3333 14.6667H26.6667V16C26.6667 16.7333 27.2667 17.3333 28 17.3333C28.7333 17.3333 29.3333 16.7333 29.3333 16V14.6667H30.6667C31.4 14.6667 32 14.0667 32 13.3333C32 12.6 31.4 12 30.6667 12H29.3333ZM10.6667 16C13.6133 16 16 13.6133 16 10.6667C16 7.72 13.6133 5.33333 10.6667 5.33333C7.72 5.33333 5.33333 7.72 5.33333 10.6667C5.33333 13.6133 7.72 16 10.6667 16ZM10.6667 17.3333C7.10667 17.3333 0 19.12 0 22.6667V26.6667H21.3333V22.6667C21.3333 19.12 14.2267 17.3333 10.6667 17.3333ZM16.68 5.4C17.9067 6.81333 18.6667 8.65333 18.6667 10.6667C18.6667 12.68 17.9067 14.52 16.68 15.9333C19.2933 15.6 21.3333 13.3867 21.3333 10.6667C21.3333 7.94667 19.2933 5.73333 16.68 5.4ZM22.04 18.44C23.2267 19.5467 24 20.9333 24 22.6667V26.6667H26.6667V22.6667C26.6667 20.7333 24.5467 19.32 22.04 18.44Z" fill="#007AFF" />
                                </svg>
                            </span>

                        }
                        iconStyle={{ color: "var(--dark-primary-color)", margin: "0" }}
                        style={{ backgroundColor: "transparent" }}
                    />

                    <Modal isVisible={isModalOpen} onClose={closeModal}>
                        <AddMember />
                    </Modal>
                </div>

                <div>
                    <Button className={"button-modal"}
                        icon={<Menu size={18} />}
                        style={{ backgroundColor: "transparent" }}
                        iconStyle={{ color: "var(--dark-primary-color)", margin: "0" }}
                    />

                </div>
            </div>


        </nav>
    );
}






