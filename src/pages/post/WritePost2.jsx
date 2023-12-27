import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {emailAtom, idAtom, roleAtom} from "../../atom/LoginAtom";
import {api, exceptionApi} from "../../api/Api";


const WritePost2 = () => {
    const currentDate = new Date();
    const [memberName,setMemberName] =useState();
    const role = useRecoilValue(roleAtom);
    const id = useRecoilValue(idAtom);
    const email = useRecoilValue(emailAtom);
    const [formData, setFormData] = useState({
        title: '',
        senderEmail: '',
        receiverEmail: '',
        content: '',
        Type: '',
        upLoadTime: currentDate,
    });

    
    const [myEmail, setMyEmail] = useState();
    const [receiverEmail, setReceiverEmail] = useState();
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState([]);

    const get = async () => {
        try {
            const response = await exceptionApi("/api/v1/member/info", "POST");
            console.log(response);
            console.log(response.data.id);
            console.log(response.data.role);
            setMemberName(response.data.name)
        } catch (error) {
        }
    };

    const handleLectureClick = (lectureName) => {
        // 클릭한 lecture를 lectures 배열에서 찾기
        const selectedLecture = lectures.find((lecture) => lecture.lectureName === lectureName);

        // 선택한 강의가 있을 경우 표시
        if (selectedLecture) {
            setSelectedLecture(selectedLecture);
        }
    };

    const [user, setUser] = useState({
        userId: "",
        password: "",
        name: "",
        status: "NORMAL",
        role: "STUDENT",
        email: "",
        phNumber: "",
        verificationNumber: "",
        lecture: "",
    });

    const getLectures = async (e) => {
        e.preventDefault();
        try {
            const professorId = id;
            const response = await api(`api/v1/Lectures/all/${professorId}`,professorId);
            const lectures = await response.data;
            console.log(response.data);
            setLectures(lectures); // 전공 데이터 설정
            setSelectedLecture();
        } catch (error) {
            console.error("Error fetching lectures:", error);
        }
    };

    const handleLectureSelect = (e, lecture) => {
        const find = user.lecture.find((m) => m.id === lecture.id);
        if (find) {
            alert("이미 선택되었습니다.");
            return;
        }
        e.preventDefault();
        const sendLecture = [...user.lecture, lecture];
        setUser((prevUser) => {
            return {
                ...prevUser,
                sendLecture,
            };
        });
        setLectures([]);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                get();
                const userEmail = await api(`/api/v1/member/${id}`,`GET`);
                setMyEmail(userEmail.email);
                const userLectures = await api(`/api/v1/application`, `GET`)
                setLectures(userLectures.lectures);
                //여기에 등록서버에서 내 강의 목록 가져와야함.
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };
        fetchData();
    }, []);



    const findMemberId = async () => {
        try {
            const userData = await api(`/api/v1/member/${id}`,`GET`);
            setReceiverEmail(userData.email);
        } catch (error) {
            console.error('Error fetching email:', error);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProfessorSubmit = async (e) => {
        e.preventDefault();

        const sendGroupRequest = {
            title: formData.title,
            message: formData.content,
            senderEmail: myEmail,
            receiverEmail: formData.lectureId
        };


        const professorResponse = await api('/api/v1/post/sendGroup', 'POST', sendGroupRequest)
        console.log(professorResponse.data)
        if (professorResponse.data.errorMsg  === "") {
            alert('쪽지 전송 성공!');
            setFormData({
                title: '',
                senderEmail: myEmail,
                receiverEmail: '',
                content: '',
            });
        } else {
            alert('쪽지 전송 실패');
            setFormData({
                title: '',
                senderEmail: myEmail,
                receiverEmail: '',
                content: '',
            });
        }


    }

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        const sendRequest = {
            title: formData.title,
            senderId: id,
            receiverId: formData.receiverId,
            message: formData.content,
        };


        const studentResponse = await api('/api/v1/post/sendPost', 'POST', sendRequest)


        if (studentResponse.data.errorMsg === "") {
            alert('쪽지 전송 성공!');
            setFormData({
                title: '',
                senderId: '',
                content: '',
                receiverId: ''
            });
        } else {
            alert('쪽지 전송 실패');
            setFormData({
                title: '',
                senderEmail: '',
                content: '',
            });
        }
    }

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        const sendGroupRequest = {
            title: formData.title,
            senderId: id,
            message: formData.content,
        };


        const adminResponse = await api('/api/v1/post/sendAll', 'POST', sendGroupRequest)

        if (adminResponse.code === "OK") {
            alert('쪽지 전송 성공!');
            setFormData({
                title: '',
                email: '',
                content: '',
                lectureId: ''
            });
        } else {
            alert('쪽지 전송 실패');
            setFormData({
                title: '',
                email: '',
                content: '',
                lectureId: ''
            });
        }


    }

    return (<>
            {role === 'ADMIN' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">쪽지 쓰기</div>
                    <form onSubmit={handleAdminSubmit} className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                제목:
                            </label>
                            <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="upLoadTime" className="form-label">
                                작성시간:
                            </label>
                            <input type="text" id="createTime" name="createTime" className="form-control" value={formData.upLoadTime} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                email:
                            </label>
                            <input id="email" name="eamil" className="form-control" value={"admin@google.com"} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                작성자:
                            </label>
                            <input id="memberName" name="memberName" className="form-control" value={"관리자"} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">
                                내용:
                            </label>
                            <textarea id="content" name="content" className="form-control" value={formData.content} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                보내기
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {role === 'STUDENT' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">쪽지 쓰기</div>
                    <form onSubmit={handleAdminSubmit} className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                제목:
                            </label>
                            <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="upLoadTime" className="form-label">
                                작성시간:
                            </label>
                            <input type="text" id="createTime" name="createTime" className="form-control" value={formData.upLoadTime} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                email:
                            </label>
                            <input id="email" name="eamil" className="form-control" value={email} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                작성자:
                            </label>
                            <input id="memberName" name="memberName" className="form-control" value={memberName} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">
                                내용:
                            </label>
                            <textarea id="content" name="content" className="form-control" value={formData.content} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                보내기
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {role === 'PROFESSOR' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">쪽지 쓰기</div>
                    <form onSubmit={handleProfessorSubmit} className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                제목:
                            </label>
                            <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="createTime" className="form-label">
                                작성시간:
                            </label>
                            <input type="text" id="createTime" name="createTime" className="form-control" value={formData.upLoadTime} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                email:
                            </label>
                            <input type="text" id="receiverEmail" name="receiverEmail" className="form-control" value={formData.receiverEmail} onChange={handleChange} />
                            <div htmlFor="lectureName">강의</div>
                            <div className="list-group">
                                {lectures &&
                                    lectures.map((lecture) => (
                                        <div className="list-group-item"
                                             type="button"
                                             key={lecture.id}
                                             onClick={(e) => handleLectureSelect(e, lecture)}
                                        >
                                            {lecture.lectureName}
                                        </div>
                                    ))}
                            </div>
                            {selectedLecture && (
                                <div>
                                    <div>
                                        <div>선택한 강의:</div>
                                        {selectedLecture.lectureName}
                                    </div>
                                </div>
                            )}<div className="d-flex justify-content-center">
                                <button type = "button" className="btn btn-primary" onClick={getLectures}>강의 조회</button>
                        </div>
                            <input type ="text" id="email" name="eamil" className="form-control" value={formData.senderEmail} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                작성자:
                            </label>
                            <input type="text" id="userName" name="userName" className="form-control" value={memberName} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">
                                내용:
                            </label>
                            <textarea id="content" name="content" className="form-control" value={formData.content} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                보내기
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>

    );

}
    export default WritePost2;
