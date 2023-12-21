import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';

import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import {v4 as uuidv4} from "uuid";
import {useNavigate} from "react-router";





function WatchNoticeDetails () {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [selectedNotices, setSelectedNotices] = useState([]);
    const role = useRecoilValue(roleAtom);
    const memberId = useRecoilValue(idAtom);
    const { noticeId } = useParams();
    const [noticeDetails, setNoticeDetails] = useState('');
    const [comments, setComments] = useState([]);

    const [formData, setFormData] = useState({
        comments: '',
        noticeId: '',
        email: ''
    });

    const [formData2, setFormData2] = useState({
        comments: '',
        noticeId: '',
        userEmail: '',
        commentId: ''
    });

    const [replyText, setReplyText] = useState();



    const [selectedCommentId, setSelectedCommentId] = useState();

    const [response, setResponse] = useState();

    const handleDeleteSelectedNotices = async () => {
        try {
            const selectedNoticeIds = selectedNotices.map(selectedNotice => selectedNotice.noticeId);
            // UUID 문자열을 UUID 객체로 변환
            const uuidObjects = selectedNoticeIds.map(uuid => uuidv4(uuid));

            const NoticeDeleteRequest = {
                noticeIds: uuidObjects
            };

            const response = await api(`api/v1/notices/delete`, 'POST', NoticeDeleteRequest);
            if (response.code === '') {
                alert('공지 삭제 성공!');
            } else {
                alert('공지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting notices:', error);
        }
    };

    const handleReply = (commentId) => {
        setSelectedCommentId(commentId);
    };





    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData2({
            ...formData2,
            [name]: value
        });
    };

    const handleCommentSubmit = async () => {
        try {
            const CommentSaveRequest = {
                memberId: memberId,
                comment: formData.comments,
                boardId: noticeId
            };
            await api('/api/v1/comments/notices', 'POST', CommentSaveRequest);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (comentId) => {
        try {
            const NoticeCommentDeleteRequest = {
                commentId: comentId,
                userId: memberId
            };

            // id로 유저 정보 찾아오기
            const response = await api(`api/v1/board/deleteNoticeComments`, 'POST', NoticeCommentDeleteRequest);


            if (response.data.errorMsg === '') {
                setComments(prevComments => prevComments.filter(comment => comment.id !== comentId));
                alert('댓글 삭제 성공!');
            } else {
                alert('댓글 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting comment:', error);
        }
    };

    const handlePostReply = async () => {
        try {
            const NoticeReplyCommentRequest = {
                userId: memberId,
                email: "111@1111",
                comments: formData2.comments,
                noticeId: noticeId,
                commentId: selectedCommentId
            };
            await api('/api/v1/board/writeNoticeReplyComments', 'POST', NoticeReplyCommentRequest);
            setResponse(response.data);
            console.log(response)
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleModifyClick = async (title) => {

        try {
            // 페이지 이동과 함께 데이터 전달
            navigate(`/admin/notice/modifyNotice/${noticeDetails}`, { state: { noticeDetails } });
            // await handleNoticeDetails(id); // 필요하다면 이 부분을 사용
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };

    useEffect(() => {
        const fetchNoticeDetails = async () => {

            try {
                const NoticeReplyCommentRequest = {
                    userId: memberId,
                    userEmail: "111@1111",
                    comments: formData2.comment ,
                    noticeId: noticeId,
                    commentId: selectedCommentId
                };

                const NoticeFileRequest = {
                    memberId: memberId,
                   noticeId: noticeId,
                };
                const noticeResponse = await api(`api/v1/notices/${noticeId}`, 'GET');
                console.log(noticeResponse.data)
                setNoticeDetails(noticeResponse.data);
                console.log(noticeDetails);
                const commentResponse = await api(`api/v1/comments/${noticeId}`, `GET`)
                console.log(commentResponse)
                setComments(commentResponse.data);
                const fileResponse = await api(`api/v1/notices/getNoticeFile` ,`POST`, NoticeFileRequest )
                setFiles(fileResponse.data);
                const replyResponse = await api(`api/v1/notices/getNoticeReplyComments`,`POST`, NoticeReplyCommentRequest)
                setReplyText(replyResponse.data)
                console.log(replyText)
            } catch (error) {
                alert('Error fetching notice details:', error);
            }
        };

        if (!noticeDetails) {
            fetchNoticeDetails();
        }
    }, [noticeId]);







    if (!noticeDetails) {

        return <div style={{ color: 'white', fontSize: '2em' }}>Loading...</div>
    }

    return (
        <>
            <div className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        제목:
                    </label>
                    <div className="form-control">{noticeDetails.title}</div>
                </div>
                <div className="form-label mb-3">작성 날짜:
                    <div className="form-control">{noticeDetails.createAt}</div>
                </div>
                <div className="form-label mb-3">수정 날짜:
                    <div className="form-control">{noticeDetails.updateAt}</div>
                </div>
                <div className="form-label mb-3">내용:
                    <textarea id="content" name="content" className="form-control" value={noticeDetails.content} readOnly={true}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-primary" type="button" onClick={handleModifyClick}>
                        수정
                    </button>
                    <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedNotices}>
                        삭제
                    </button>
                </div>
            </div>

            <div className=  "bg-white rounded mt-4 p-4">
                <div  className="mb-3">댓글 목록: </div>
                <div noticeDetails={noticeDetails} files={files} setFiles={setFiles}/>
                <div className="mb-3">
                    <input
                        className="form-control"
                        onChange={handleChange}
                        id="comments"
                        name="comments"
                        placeholder="댓글을 입력하세요."
                        value={formData.comments}
                    />
                </div>
                <div className="d-flex justify-content-end">
                <button className="btn btn-primary" type="button" onClick={handleCommentSubmit}>입력</button>
                </div>
                {comments && comments.length > 0 && comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <div className="user-email">{comment.userEmail}</div>
                        <div className="comment-text">{comment.comments}</div>
                        <div className="create-date">{comment.createAt}</div>
                        <button onClick={() => handleReply(comment.id)}>↳ 대댓글 작성</button>
                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>

                        {selectedCommentId === comment.id && (
                            <div>
                                <input
                                    onChange={handleChange2}
                                    id="reply"
                                    name="comments"
                                    placeholder={"대댓글을 입력하세요"}
                                    value={formData2.comments}
                                />
                                <button className="btn btn-primary" type="button" onClick={handlePostReply}>확인</button>
                            </div>
                        )}

                        {replyText && replyText.length > 0 && (
                            <div className="reply-list">
                                {Array.isArray(replyText) && replyText.map(reply => (
                                    <div key={reply.id} className="reply">
                                        <div className="user-email">{reply.userEmail}</div>
                                        <div className="comment-text">{reply.comments}</div>
                                        <div className="create-date">{reply.createAt}</div>
                                        <button onClick={() => handleDeleteComment(reply.id)}>삭제</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default WatchNoticeDetails;

