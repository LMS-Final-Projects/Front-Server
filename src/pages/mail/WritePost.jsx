import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api, exceptionApi} from "../../api/Api";
import * as PropTypes from "prop-types";


const TableContent = styled.div`
  text-align: left;
`;

 const TableContentWrite = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const TableContentDivide = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 4fr;
  margin-bottom: 20px;
`;

const TableContentDivide2= styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

function Label(props) {
    return null;
}

Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node
};
const WritePost = () => {
    const role = useRecoilValue(roleAtom);
    const id = useRecoilValue(idAtom);
    const [formData, setFormData] = useState({
        title: '',
        senderEmail: '',
        receiverEmail: '',
        content: '',
        Type: ''
    });



    const [myEmail, setMyEmail] = useState();
    const [receiverEmail, setReceiverEmail] = useState();
    const [majors, setMajors] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [selectedMajors, setSelectedMajors] = useState([]);

    const handleMajorClick = (majorName) => {
        // 클릭한 majorName을 선택한 major로 설정
        setSelectedMajors(majorName);

        // majorList에서 클릭한 majorName을 제거
        const updatedMajorList = user.majorList.filter((major) => major.majorName !== majorName);
        setUser((prevUser) => ({
            ...prevUser,
            majorList: updatedMajorList,
        }));

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
        majorList: [],
    });

    const getMajors = async (e) => {
        e.preventDefault();
        try {
            const response = await exceptionApi("api/v1/major");
            const majors = await response.data;
            console.log(response.data);
            setMajors(majors); // 전공 데이터 설정
            setSelectedMajors([]); //빈 리스트로 초기화
        } catch (error) {
            console.error("Error fetching majors:", error);
        }
    };

    const handleMajorSelect = (e, major) => {
        const find = user.majorList.find((m) => m.id === major.id);
        if (find) {
            alert("이미 선택되었습니다.");
            return;
        }
        e.preventDefault();
        const majorList = [...user.majorList, major];
        setUser((prevUser) => {
            return {
                ...prevUser,
                majorList,
            };
        });
        setMajors([]);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
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
            lectureId: formData.receiverEmail
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
                Type: ''
            });
        } else {
            alert('쪽지 전송 실패');
            setFormData({
                title: '',
                senderEmail: myEmail,
                receiverEmail: '',
                content: '',
                Type: ''
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
                senderId: '',
                content: '',
                receiverId: ''
            });
        }
    }

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        const sendGroupRequest = {
            title: formData.title,
            senderId: id,
            message: formData.content,
            receiverId: formData.receiverId,
            Type: formData.type
        };


        const adminResponse = await api('/api/v1/post/sendGroup', 'POST', sendGroupRequest)

        if (adminResponse.data.errMsg === null) {
            alert('쪽지 전송 성공!');
            setFormData({
                title: '',
                email: '',
                content: '',
                majorId: ''
            });
        } else {
            alert('쪽지 전송 실패');
            setFormData({
                title: '',
                email: '',
                content: '',
                majorId: ''
            });
        }


    }

    return (<>
            {role === 'ADMIN' && (
                <div className="_right-content">
                    <TableContent>쪽지 쓰기</TableContent>
                    <form onSubmit={handleAdminSubmit}>
                        <TableContentDivide>
                            <label htmlFor="title">제목:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </TableContentDivide>
                        <TableContentDivide>
                            <label htmlFor="email">작성자 이메일:</label>
                            <input
                                id="email"
                                name="email"
                                value={myEmail}
                                readOnly={true}
                            />
                        </TableContentDivide>
                        <TableContentDivide>
                            <label htmlFor="content">내용:</label>
                            <TableContentWrite
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                            />
                        </TableContentDivide>
                        <button type="submit">보내기</button>
                    </form>
                </div>
            )}

            {role === 'STUDENT' && (
                <div className="_right-content">
                    <form onSubmit={handleStudentSubmit}>
                        <TableContent>
                            <TableContentDivide>
                                쪽지 쓰기
                            </TableContentDivide>
                            <TableContentDivide>
                                <label htmlFor="title">제목:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </TableContentDivide>
                            <TableContentDivide>
                                <label htmlFor="email">작성자 이메일:</label>
                                <input
                                    id="email"
                                    name="email"
                                    value={myEmail}
                                    readOnly={true}
                                />
                            </TableContentDivide>
                            <TableContentDivide>
                                <label htmlFor="targetEmail">대상 이메일:</label>
                                <input
                                    id="targetEmail"
                                    name="targetEmail"
                                    value={formData.receiverEmail}
                                    onChange={handleChange}
                                />
                            </TableContentDivide>
                            <TableContentDivide>
                                <label htmlFor="content">내용:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                />
                            </TableContentDivide>
                            <TableContentDivide>
                                <button type="submit">보내기</button>
                            </TableContentDivide>
                        </TableContent>
                    </form>
                </div>
            )}

            {role === 'PROFESSOR' && (
                <div className="_right-content">
                    <TableContentDivide>쪽지 쓰기</TableContentDivide>
                    <form onSubmit={handleProfessorSubmit}>
                        <TableContentDivide>
                            <label htmlFor="title">제목:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </TableContentDivide>
                        <TableContentDivide>
                            <label htmlFor="title">발신자 메일:</label>
                            <input
                                id="email"
                                name="email"
                                value={myEmail}
                                readOnly={true}
                            />
                        </TableContentDivide>
                        <TableContentDivide>
                            <Label htmlFor="majorName">전공</Label>
                            <div className="list-group">
                                {majors &&
                                    majors.map((major) => (
                                        <div className="list-group-item"
                                             type="button"
                                             key={major.id}
                                             onClick={(e) => handleMajorSelect(e, major)}
                                        >
                                            {major.majorName}
                                        </div>
                                    ))}
                            </div>
                            <Label htmlFor="majorName">선택 전공</Label>
                            <div className="list-group">
                                {user &&
                                    user.majorList.map((major, i) => (
                                        <div
                                            className={`list-group-item ${major.majorName === selectedMajors ? 'active' : ''}`}
                                            key={major.majorName + '_' + i}
                                            onClick={() => handleMajorClick(major.majorName)}
                                            role="button"
                                        >
                                            {major.majorName}
                                        </div>
                                    ))}
                            </div>
                            <label htmlFor="targetEmail">전공 이름:</label>
                            <input
                                    id="targetMajorId"
                                    name="targetMajorId"
                                    value={formData.targetMajorId}
                                    onChange={handleChange}
                            />
                        </TableContentDivide>

                        <TableContentDivide>
                            <label htmlFor="content">내용:</label>
                            <TableContentWrite
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                            />
                        </TableContentDivide>
                        <button class="btn btn-primary" type="submit">보내기</button>
                    </form>
                </div>
            )}
        </>

    );

}
    export default WritePost;
