import React from 'react'
import {Link} from "react-router-dom";

function StudentBar() {
    return (
        <>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2'
                   aria-expanded="false" aria-controls="dashboardMenu">
                    <i className='bi bi-speedometer2 fs-5 me-3'></i> <span>학생 메뉴</span>
                </a>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#myService" role="button"
                   aria-expanded="false" aria-controls="myService">
                    <i className="bi bi-box-fill fs-5 me-3"></i> <span>내 서비스</span>
                </a>
                <div className="collapse" id="myService">
                    <Link to ="student/myService/mySchedule" className='list-group-item py-2'>내 강의 시간표</Link>
                    <Link to ="student/myService/myLecture" className='list-group-item py-2'>내 강의 목록</Link>
                    <Link to ="student/myService/myHoldingLecture" className='list-group-item py-2'>내 수강신청 목록</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#applicationMenu" role="button"
                   aria-expanded="false" aria-controls="applicationMenu">
                    <i className='bi bi-cart-check-fill fs-5 me-3'></i> <span>수강 신청</span>
                </a>
                <div className="collapse" id="applicationMenu">
                    <Link to="/student/application" className='list-group-item py-2'>수강 신청</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#applicationMenu" role="button"
                   aria-expanded="false" aria-controls="applicationMenu">
                    <i className='bi bi-cart-check-fill fs-5 me-3'></i> <span>수강 신청</span>
                </a>
                <div className="collapse" id="applicationMenu">
                    <Link to="/application" className='list-group-item py-2'>수강 신청</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#gradeMenu" role="button"
                   aria-expanded="false" aria-controls="gradeMenu">
                    <i className='bi bi-file-text-fill fs-5 me-3'></i> <span>성적 서비스</span>
                </a>
                <div className="collapse" id="gradeMenu">
                    <Link to ="/student/grade" className='list-group-item py-2' href="#home-1">성적 조회</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#noticeMenu" role="button"
                   aria-expanded="false" aria-controls="noticeMenu">
                    <i className="bi bi-megaphone-fill fs-5 me-3"></i> <span>공지사항</span>
                </a>
                <div className="collapse" id="noticeMenu">
                    <Link to ="student/notice " className='list-group-item py-2' >공지사항 보기</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#postService" role="button"
                   aria-expanded="false" aria-controls="postService">
                    <i className="bi bi-send-fill fs-5 me-3"></i> <span>쪽지 서비스</span>
                </a>
                <div className="collapse" id="postService">
                    <Link to = "student/post" className='list-group-item py-2'>내 쪽지함</Link>
                </div>
            </div>
        </>
    );
}

export default StudentBar;