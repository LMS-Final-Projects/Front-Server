import React from 'react'
import StudentBar from "./role/StudentBar";
import ProfessorComponent from "./role/ProfessorBar";
import AdminComponent from "./role/AdminBar";

function Sidebar({ Role }) {
    return (
        <div className='bg-white sidebar p-2'>
            <div className='m-2'><i className='bi bi-p-square-fill me-3 fs-4'></i> <span className='brand-name fs-4'>PLAYDATA</span></div>
            <hr className='text-dark'/>
            {Role === 'STUDENT' && <StudentBar />}
            {Role === 'PROFESSOR' && <ProfessorComponent />}
            {Role === 'ADMIN' && <AdminComponent />}
        </div>
    );
}

export default Sidebar;