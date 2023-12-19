import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';

import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import NoticeFileUpload from "./NoticeFileUpload";





function WatchNoticeDetails () {
    const [files, setFiles] = useState([]);
    const role = useRecoilValue(roleAtom);
    const { id } = useParams();
    const [noticeDetails, setNoticeDetails] = useState('');
    const [comments, setComments] = useState([]);

    const [formData, setFormData] = useState({
        comments: '',
        adminBoardId: '',
        email: ''
    });

    const [formData2, setFormData2] = useState({
        comments: '',
        adminBoardId: '',
        userEmail: '',
        commentId: ''
    });

    const [replyText, setReplyText] = useState();



    const [selectedCommentId, setSelectedCommentId] = useState();
    const userId = useRecoilValue(idAtom);

    const [response, setResponse] = useState();

    const handleReply = (commentId) => {
        setSelectedCommentId(commentId);
    };

    const handleCancelReply = () => {
        setFormData2(prevent =>({...prevent, comments: ""} ))
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
            const NoticeCommentRequest = {
                userId: userId,
                email: "111@1111",
                commentId: formData2.commentId,
                comments: formData.comments,
                adminBoardId: id
            };
            await api('/api/v1/board/writeNoticeComments', 'POST', NoticeCommentRequest);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (comentId) => {
        try {
            const NoticeCommentDeleteRequest = {
                commentId: comentId,
                userId: id
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
                userId: userId,
                email: "111@1111",
                comments: formData2.comments,
                adminBoardId: id,
                commentId: selectedCommentId
            };
            await api('/api/v1/board/writeNoticeReplyComments', 'POST', NoticeReplyCommentRequest);
            setResponse(response.data);
            console.log(response)
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    useEffect(() => {
        const fetchNoticeDetails = async () => {

            try {
                const NoticeReplyCommentRequest = {
                    userId: userId,
                    userEmail: "111@1111",
                    comments: formData2.comment ,
                    adminBoardId: id,
                    commentId: selectedCommentId
                };

                const NoticeFileRequest = {
                    adminId: userId,
                   adminBoardId: id,
                };

                const noticeResponse = await api(`api/v1/notices/getNotice/${id}`, 'GET');
                console.log(noticeResponse.data)
                setNoticeDetails(noticeResponse.data);
                console.log(noticeDetails);
                const commentResponse = await api(`api/v1/comments/${id}`, `GET`)
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
    }, [id]);







    if (!noticeDetails) {

        return <div>Loading...</div>;
    }

    return (
        <>
            <div className= "bg-dark text-white p-2 mb-4">제목: {noticeDetails.title}</div>
            <div className= "bg-dark text-white p-2 mb-4">내용: {noticeDetails.content}</div>
            <div className=  "bg-white rounded mt-4 p-4">
                <NoticeFileUpload noticeDetails={noticeDetails} files={files} setFiles={setFiles}/>
            <input
                onChange={handleChange}
                id="comments"
                name="comments"
                placeholder={"댓글을 입력 하세요."}
                value={formData.comments}
            />
            <button onClick={handleCommentSubmit}>입력</button>
            <div>댓글</div>
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
                            <button onClick={handlePostReply}>확인</button>
                            <button onClick={handleCancelReply}>취소</button>
                        </div>
                    )}

                    {/* 대댓글 목록 */}
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

