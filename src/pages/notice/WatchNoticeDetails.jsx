import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Card, Badge, Button, Form } from 'react-bootstrap';
import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import {v4 as uuidv4} from "uuid";
import {useNavigate} from "react-router";
import ClassFileUpload from "../classBoard/ClassFileUpload";





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

    const [replyText, setReplyText] = useState([]);



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
            const CommentDeleteRequest = {
                commentId: comentId,
                memberId: memberId
            };

            // id로 유저 정보 찾아오기
            const response = await api(`/api/v1/comments/notices/delete`, 'POST', CommentDeleteRequest);

            if (response.code === 'OK') {
                alert('댓글 삭제 성공!');
            } else {
                alert('댓글 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting comment:', error);
        }
    };


    const handleDeleteReply = async (replyId) => {
        try {
            const ReplyCommentDeleteRequest = {
                replyCommentId: replyId,
                memberId: memberId
            };

            // id로 유저 정보 찾아오기
            const response = await api(`/api/v1/replies/notices/delete`, 'POST', ReplyCommentDeleteRequest);

            if (response.code === 'OK') {
                alert('대댓글 삭제 성공!');
            } else {
                alert('대댓글 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting comment:', error);
        }
    };

    const handlePostReply = async () => {
        try {
            const NoticeReplyCommentRequest = {
               memberId: memberId,
                boardId: noticeId,
               commentId: selectedCommentId,
               comment: formData2.comments
            };
            await api('/api/v1/replies/notices', 'POST', NoticeReplyCommentRequest);
            setResponse(response.data);
            console.log(response)
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleModifyClick = async () => {

        try {
            navigate(`/admin/notice/modifyNotice/${noticeId}`);
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };

    useEffect(() => {
        const fetchNoticeDetails = async () => {

            try {

                const NoticeFileRequest = {
                    memberId: memberId,
                   noticeId: noticeId,
                };
                const noticeResponse = await api(`api/v1/notices/${noticeId}`, 'GET');
                console.log(noticeResponse.data)
                setNoticeDetails(noticeResponse.data);
                console.log(noticeDetails);
                const commentResponse = await api(`api/v1/comments/notices/${noticeId}`, `GET`)
                console.log(commentResponse)
                setComments(commentResponse.data);
                const replyResponse = await api(`api/v1/replies/notices/${noticeId}`,`GET`)
                setReplyText(replyResponse.data)
                console.log(replyText)
                console.log(replyResponse);
                const fileResponse = await api(`api/v1/notices/getNoticeFile` ,`POST`, NoticeFileRequest )
                setFiles(fileResponse.data);

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
                <ClassFileUpload NoticeDetails={noticeDetails} files={files} setFiles={setFiles} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-primary" type="button" onClick={handleModifyClick}>
                        수정
                    </button>
                    <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedNotices}>
                        삭제
                    </button>
                </div>
            </div>
            <div noticeDetails={noticeDetails} files={files} setFiles={setFiles}/>
            <div className=  "bg-white rounded mt-4 p-4">
                <div  className="mb-3">댓글 목록: </div>
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
                    <Card key={comment.id} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>{comment.memberName}</Card.Title>
                                <Card.Text className="comment-text">{comment.comments}</Card.Text>
                                <div className="create-date" style={{ color: 'gray' }}>{comment.createAt}</div>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <Button variant="primary" onClick={() => handleDeleteComment(comment.id)}>삭제</Button>
                                <Button variant="primary" onClick={() => handleReply(comment.id)}>↳ 대댓글 작성</Button>
                            </div>

                            {selectedCommentId === comment.id && (
                                <div className="mt-3">
                                    <Form.Control
                                        onChange={handleChange2}
                                        id="reply"
                                        name="comments"
                                        placeholder={"대댓글을 입력하세요"}
                                        value={formData2.comments}
                                    />
                                    <Button className="mt-2" variant="primary" type="button" onClick={handlePostReply}>입력</Button>
                                </div>
                            )}

                            {replyText && replyText.length > 0 && (
                                <div className="mt-3">
                                    {Array.isArray(replyText) && replyText.map(reply => (
                                        <Card key={reply.id} className="mb-2">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between">
                                                <div className="user-email">{reply.memberName}</div>
                                                <Card.Text className="comment-text">{reply.comments}</Card.Text>
                                                <div className="create-date">{reply.createAt}</div>
                                                <Button variant="primary" onClick={() => handleDeleteReply(reply.id)}>삭제</Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default WatchNoticeDetails;

