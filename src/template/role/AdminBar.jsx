import React from 'react'
import {Link} from "react-router-dom";

function StudentComponent() {
    return (
        <>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2'
                   aria-expanded="false" aria-controls="dashboardMenu">
                    <i className='bi bi-speedometer2 fs-5 me-3'></i> <span>관리자 메뉴</span>
                </a>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#noticeMenu" role="button"
                   aria-expanded="false" aria-controls="noticeMenu">
                    <i className="bi bi-megaphone-fill"></i> <span>공지사항</span>
                </a>
                <div className="collapse" id="noticeMenu">
                    <Link to ="admin/notice " className='list-group-item py-2' >공지사항 보기</Link>
                    <Link to ="admin/notice/writeNotice " className='list-group-item py-2' >공지사항 작성</Link>
                </div>
                <a className='list-group-item py-2' data-bs-toggle="collapse" href="#postService" role="button"
                   aria-expanded="false" aria-controls="postService">
                    <i className="bi bi-send-fill"></i> <span>쪽지 서비스</span>
                </a>
                <div className="collapse" id="postService">
                    <Link to = "admin/post" className='list-group-item py-2'>내 쪽지함</Link>
                </div>
            </div>
        </>
    );
}

export default StudentComponent;