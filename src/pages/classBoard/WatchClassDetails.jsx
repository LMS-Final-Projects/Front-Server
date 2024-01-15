import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';

import {useRecoilValue} from "recoil";
import {emailAtom, idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import ClassFileUpload from "./ClassFileUpload";
import {Button, Card, Form} from "react-bootstrap";





function WatchClassDetails () {
    const [files, setFiles] = useState([]);
    const memberId = useRecoilValue(idAtom);
    const role = useRecoilValue(roleAtom);
    const email = useRecoilValue(emailAtom);
    const { classId } = useParams();
    const [classDetails, setClassDetails] = useState('');
    const [comments, setComments] = useState([]);
    const [boardId,setBoardId] = useState();
    const [commentList,setCommentListsetCommentList] = useState([]);

    const [formData, setFormData] = useState({
        comments: '',
        boardId: '',
        userEmail: ''
    });

    const [formData2, setFormData2] = useState({
        comments: '',
        commentId: '',
        userEmail: '',
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

            const CommentSaveRequest = {
               memberId: memberId,
               boardId: boardId,
               comment: formData.comments
            };
            console.log(CommentSaveRequest);
            await api('/api/v1/comments/classes', 'POST', CommentSaveRequest);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const CommentDeleteRequest = {
                userEmail: "111@1111",
                commentId: commentId,
            };

            // id로 유저 정보 찾아오기
            const response = await api(`api/v1/classs/delete`, 'POST', CommentDeleteRequest);


            if (response.code === 'OK') {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
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
            const ReplyCommentSaveRequest = {
                boardId: boardId,
                memberId: memberId,
                comment: formData2.comments,
                commentId: selectedCommentId
            };
            await api('/api/v1/replies/classes', 'POST', ReplyCommentSaveRequest);
            setResponse(response.data);
            console.log(response)
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleDeleteReplyComment = async (replyCommentId) => {
        try {
            const ReplyCommentDeleteRequest = {
                userEmail: "111@1111",
                replyCommentId: replyCommentId,
            };

            // id로 유저 정보 찾아오기
            const response = await api(`api/v1/replies/classes/delete`, 'POST', ReplyCommentDeleteRequest);


            if (response.code === 'OK') {
                setComments(prevComments => prevComments.filter(comment => comment.id !== replyCommentId));
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

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const ReplyCommentSaveRequest = {
                    userEmail: "111@1111",
                    commentId: selectedCommentId,
                    comments: comments
                };

                const ClassFileRequest = {
                    memberId: userId,
                    adminClassId: classId,
                };

                const classResponse = await api(`api/v1/classes/${classId}`, 'GET');
                console.log(classResponse.data)
                setClassDetails(classResponse.data);
                console.log(classDetails);

                // boardId를 설정
                const boardIdValue = classResponse.data.id;
                setBoardId(boardIdValue);

                console.log(classDetails);
                console.log(boardIdValue);

                // boardId가 존재할 때만 API 호출
                const commentResponse = await api(`api/v1/comments/${boardIdValue}`, `GET`)
                console.log(commentResponse)
                setComments(commentResponse.data);

                const replyResponse = await api(`api/v1/replies/classes/${boardIdValue}`, `GET`)
                setReplyText(replyResponse.data)
                console.log(replyText);

                const fileResponse = await api(`api/v1/classes/getClassFile`, `POST`, ClassFileRequest)
                setFiles(fileResponse.data);

            } catch (error) {
                alert('Error fetching class details:', error);
            }
        };

        if (!classDetails) {
            fetchClassDetails();
        }
    }, []);




    // if (!classDetails) {
    //     return <div>Loading...</div>;
    // }

    return (
        <>
        <div className="bg-dark text-white p-2 mb-4">
                강의 게시판
            </div>
            <form className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                <div className="form-group mb-3">
                    <label htmlFor="lectureName">강의명</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lectureName"
                        placeholder="강의명"
                        value={classDetails.title}
                        readOnly={true}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="professorName">교수명</label>
                    <input
                        type="text"
                        className="form-control"
                        id="professorName"
                        value={classDetails.professorName}
                        readOnly={true}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="lectureComment">강의 설명</label>
                    <textarea
                        className="form-control"
                        id="lectureComment"
                        rows="3"
                        placeholder="강의 설명"
                        value={classDetails.contents}
                        required
                    ></textarea>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="dayOfWeek">강의 요일</label>
                    <input
                        type="text"
                        className="form-control"
                        id="dayOfWeek"
                        value={classDetails.dayOfWeek}
                        readOnly={true}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="startTime">강의 시작 교시</label>
                    <input
                        type="text"
                        className="form-control"
                        id="startTime"
                        value={classDetails.startTime}
                        readOnly={true}
                    />
                </div>
                <ClassFileUpload NoticeDetails={classDetails} files={files} setFiles={setFiles} />
            </form>

            <div className=  "bg-white rounded mt-4 p-4">
                <div  className="mb-3">댓글 목록: </div>
                <div classDetails={classDetails} files={files} setFiles={setFiles}/>
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

export default WatchClassDetails;

