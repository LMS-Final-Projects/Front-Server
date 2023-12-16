import React from 'react'

function StudentBar() {
    return (
        <>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#dashboardMenu" role="button"
                   aria-expanded="false" aria-controls="dashboardMenu">
                    <i className='bi bi-speedometer2 fs-5 me-3'></i> <span>학생 메뉴</span>
                </a>
                <div className="collapse" id="dashboardMenu">
                    <a className='list-group-item py-2' href="#dashboard-1">Dashboard 1</a>
                    <a className='list-group-item py-2' href="#dashboard-2">Dashboard 2</a>
                    <a className='list-group-item py-2' href="#dashboard-3">Dashboard 3</a>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#gradeMenu" role="button"
                   aria-expanded="false" aria-controls="gradeMenu">
                    <i className='bi bi-file-text-fill fs-5 me-3'></i> <span>성적 서비스</span>
                </a>
                <div className="collapse" id="gradeMenu">
                    <a className='list-group-item py-2' href="#home-1">Home 1</a>
                    <a className='list-group-item py-2' href="#home-2">Home 2</a>
                    <a className='list-group-item py-2' href="#home-3">Home 3</a>
                </div>
            </div>
        </>
    );
}

export default StudentBar;