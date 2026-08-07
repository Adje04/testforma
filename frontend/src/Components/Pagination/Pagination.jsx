import React from 'react';
import './Pagination.css'; 

export default function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination-num'>
                {pageNumbers.map((number) => (
                    <li key={number} className={currentPage === number ? 'active' : ''}>
                        <button onClick={() => paginate(number)}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


