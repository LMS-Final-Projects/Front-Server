import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';

import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import ClassFileUpload from "./ClassFileUpload";





function WatchClassDetails () {
    const [files, setFiles] = useState([]);
    const role = useRecoilValue(roleAtom);
    const { id } = useParams();
    const [classDetails, setClassDetails] = useState('');
    const [comments, setComments] = useState([]);

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
                userEmail: "111@1111",
                boardId: formData.boardId,
                comments: formData.comments,
            };
            await api('/api/v1/classs', 'POST', CommentSaveRequest);
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


            if (response.data.errorMsg === '') {
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
                userEmail: "111@1111",
                comments: formData2.comments,
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


            if (response.data.errorMsg === '') {
                setComments(prevComments => prevComments.filter(comment => comment.id !== replyCommentId));
                alert('댓글 삭제 성공!');
            } else {
                alert('댓글 삭제 실패:', response.statusText);
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
                   adminClassId: id,
                };

                const classResponse = await api(`api/v1/classes/${id}`, 'GET');
                console.log(classResponse.data)
                setClassDetails(classResponse.data);
                console.log(classDetails);
                const commentResponse = await api(`api/v1/comments/${id}`, `GET`)
                console.log(commentResponse)
                setComments(commentResponse.data);
                const fileResponse = await api(`api/v1/classes/getClassFile` ,`POST`, ClassFileRequest )
                setFiles(fileResponse.data);
                const replyResponse = await api(`api/v1/classes/getClassReplyComments`,`POST`, ReplyCommentSaveRequest)
                setReplyText(replyResponse.data)
                console.log(replyText)
            } catch (error) {
                alert('Error fetching class details:', error);
            }
        };

        if (!classDetails) {
            fetchClassDetails();
        }
    }, [id]);



    if (!classDetails) {

        return <div>Loading...</div>;
    }

    return (
        <>
            <div className= "bg-dark text-white p-2 mb-4">제목: {classDetails.title}</div>
            <div className= "bg-dark text-white p-2 mb-4">내용: {classDetails.content}</div>
            <div className=  "bg-white rounded mt-4 p-4">
                <ClassFileUpload classDetails={classDetails} files={files} setFiles={setFiles}/>
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
                                    <button onClick={() => handleDeleteReplyComment(reply.id)}>삭제</button>
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

export default WatchClassDetails;

