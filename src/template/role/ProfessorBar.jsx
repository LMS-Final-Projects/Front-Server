import React from 'react'
import {Link} from "react-router-dom";

function StudentComponent() {
    return (
        <>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#dashboardMenu" role="button"
                   aria-expanded="false" aria-controls="dashboardMenu">
                    <i className='bi bi-speedometer2 fs-5 me-3'></i> <span>교수 메뉴</span>
                </a>
                <div className="collapse" id="dashboardMenu">
                    <a className='list-group-item py-2' href="#dashboard-1">Dashboard 1</a>
                    <a className='list-group-item py-2' href="#dashboard-2">Dashboard 2</a>
                    <a className='list-group-item py-2' href="#dashboard-3">Dashboard 3</a>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#applicationMenu" role="button"
                   aria-expanded="false" aria-controls="applicationMenu">
                    <i className='bi bi-cart-check-fill fs-5 me-3'></i> <span>수강 승인</span>
                </a>
                <div className="collapse" id="applicationMenu">
                    <Link to="/accept" className='list-group-item py-2'>수강 승인</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#gradeMenu" role="button"
                   aria-expanded="false" aria-controls="gradeMenu">
                    <i className='bi bi-file-text-fill fs-5 me-3'></i> <span>성적 서비스</span>
                </a>
                <div className="collapse" id="gradeMenu">
                    <Link to="/grade/set" className='list-group-item py-2'>성적 입력</Link>
                    <Link to="/grade/update" className='list-group-item py-2'>성적 수정</Link>
                </div>
            </div>
        </>
    );
}

export default StudentComponent;