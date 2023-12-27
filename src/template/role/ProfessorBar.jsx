import React from 'react'
import {Link} from "react-router-dom";

function StudentComponent() {
    return (
        <>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2'
                   aria-expanded="false" aria-controls="dashboardMenu">
                    <i className='bi bi-speedometer2 fs-5 me-3'></i> <span>교수 메뉴</span>
                </a>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#gradeMenu" role="button"
                   aria-expanded="false" aria-controls="gradeMenu">
                    <i className='bi bi-file-text-fill fs-5 me-3'></i> <span>성적 서비스</span>
                </a>
                <div className="collapse" id="gradeMenu">
                    <Link to="/grade/set" className='list-group-item py-2'>성적 입력</Link>
                    <Link to="/grade/update" className='list-group-item py-2'>성적 수정</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#myService" role="button"
                   aria-expanded="false" aria-controls="myService">
                    <i className="bi bi-box-fill"></i><span>내 서비스</span>
                </a>
                <div className="collapse" id="myService">
                    <Link to ="professor/myService/mySchedule" className='list-group-item py-2'>내 강의 시간표</Link>
                    <Link to ="professor/myService/myLecture" className='list-group-item py-2'>내 강의 목록</Link>
                    <Link to ="professor/myService/registration" className='list-group-item py-2'>강의 등록</Link>
                    <Link to ="professor/myService/myHoldingLecture" className='list-group-item py-2'>신청 강의 대기 현황</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#noticeMenu" role="button"
                   aria-expanded="false" aria-controls="noticeMenu">
                    <i className="bi bi-megaphone-fill"></i> <span>공지사항</span>
                </a>
                <div className="collapse" id="noticeMenu">
                    <Link to ="professor/notice " className='list-group-item py-2' >공지사항 보기</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#postService" role="button"
                   aria-expanded="false" aria-controls="postService">
                    <i className="bi bi-send-fill"></i> <span>쪽지 서비스</span>
                </a>
                <div className="collapse" id="postService">
                    <Link to = "professor/post" className='list-group-item py-2' href="/">내 쪽지함</Link>
                </div>
            </div>
        </>
    );
}

export default StudentComponent;