import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useRecoilValue} from "recoil";
import {api} from "../../api/Api";
import {roleAtom} from "../../atom/LoginAtom";



function WatchNotice() {
    const role = useRecoilValue(roleAtom);
    const [notices, setNotices] = useState([]);
    const [selectedNotices, setSelectedNotices] = useState([]);



    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await api('api/v1/manager/notices', 'GET');
                setNotices(response.data);
                console.log(response.data); // 최신 데이터를 출력
            } catch (error) {
                alert('Error fetching notices:', error);
            }
        };

        fetchNotice();
    }, []);



    const handleNoticeDetails = async (id) => {

        try {
            const response = await api(`api/v1/notices/${id}`, 'GET');
            if (response.errorMsg === '') {
                alert('공지사항 호출 성공!');
            } else {
                alert('공지사항 호출 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error Watching WatchClass:', error);
        }
    }

    const handleCheckboxChange = (event, notice) => {
        if (event.target.checked) {
            setSelectedNotices(prevSelected => [...prevSelected, notice]);
            console.log(selectedNotices)
        } else {
            setSelectedNotices(prevSelected => prevSelected.filter(selectedNotice => selectedNotice.adminBoardId !== notice.adminBoardId));
            console.log(selectedNotices)
        }
    }



    const handleDeleteSelectedNotices = async (noticeId) => {
        try {
            const response = await api(`api/v1/notices/${noticeId}`, 'DELETE');
            if (response.errorMsg === '') {
                alert('공지 삭제 성공!');
            } else {
                alert('공지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting notices:', error);
        }
    };

    const navigate = useNavigate();

    const handleTitleClick = async (id) => {
        try {
            navigate(`/notice/watchNotice/details/${id}`);
            await handleNoticeDetails(id);
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };


    return (<>
            <div>
                <div className="bg-dark text-white p-2 mb-4">
                    공지 사항
                </div>
                {role === 'ADMIN' && (
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">작성날짜</th>
                                <th scope="col">수정날짜</th>
                                <th scope="col">관리자 Email</th>
                                <th scope="col">제목</th>
                                <th scope="col">선택</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notices.map((notice) => (
                                <tr key={notice.noticeId}>
                                    <td>{notice.createAt}</td>
                                    <td>{notice.updateAt}</td>
                                    <td>{notice.email}</td>
                                    <td>
                                        <button onClick={() => handleTitleClick(notice.id)}>
                                            {notice.title}
                                        </button>
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(event) => handleCheckboxChange(event, notice)}
                                            checked={selectedNotices.some(selectedNotice => selectedNotice.adminBoardId === notice.adminBoardId)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link to="/admin/notice/writeNotice">
                                <button className="btn btn-primary" type="submit">
                                    공지 작성
                                </button>
                            </Link>
                            <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedNotices}>
                                삭제
                            </button>
                        </div>
                    </div>
                )}

                {(role === 'PROFESSOR' || role === 'STUDENT') && (
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">작성날짜</th>
                                <th scope="col">제목</th>
                                <th scope="col">관리자</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notices.map((notice) => (
                                <tr key={notice.id}>
                                    <td>{notice.createAt}</td>
                                    <td>{notice.email}</td>
                                    <td>
                                        <div onClick={() => handleTitleClick(notice.noticeId)}>
                                            {notice.title}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!role && (
                    <div>유저 정보를 불러오는 중입니다...</div>
                )}
            </div>
        </>
    )
}

export default WatchNotice;
