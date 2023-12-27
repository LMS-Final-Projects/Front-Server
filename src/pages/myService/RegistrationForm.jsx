import React, { useState } from 'react';
import {exceptionApi} from "../../api/Api";
import {useRecoilValue} from "recoil";
import {emailAtom, nameAtom} from "../../atom/LoginAtom";
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
const Label = styled.label`
  font-size: 12px;
  color: #008ecf;
  text-align: left;
  margin-top: 10px;
`;

const AuthButton = styled.button`
  padding: 8px 15px; /* 적절한 패딩 값으로 조정 */
  margin: 0 5px; /* 적절한 마진 값으로 조정 */

  /* 나머지 스타일 유지 */
  background: #008ecf;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 30%;
`;



const RegistrationForm = () => {
    const [majors, setMajors] = useState([]);
    const name = useRecoilValue(nameAtom);
    const email = useRecoilValue(emailAtom);
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [professorName, setProfessorName] = useState('');
    const [majorName, setMajorName] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [lectureComment, setLectureComment] = useState('');
    const [maximumNumber, setMaximumNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [semester, setSemester] = useState('');
    const currentDate = new Date();
    const [selectedMajor, setSelectedMajor] = useState('');

    const [form, SetForm] = useState({
        name: name,
        senderEmail: email,
        receiverEmail: '',
        content: '',
        upLoadTime: currentDate,
    });

    const handleMajorSelect = (e, major) => {
        const find = form.majorList.find((m) => m.id === major.id);
        if (find) {
            alert("이미 선택되었습니다.");
            return;
        }
        e.preventDefault();
        const majorList = [...form.majorList, major];
        SetForm((prevForm) => {
            return {
                ...prevForm,
                majorList,
            };
        });
        setMajors([]);
    };





    const handleMajorClick = (majorName) => {
        // 클릭한 majorName을 선택한 major로 설정
        setSelectedMajor(majorName);

        // majorList에서 클릭한 majorName을 제거
        const updatedMajorList = form.majorList.filter((major) => major.majorName !== majorName);
        SetForm((prevForm) => ({
            ...prevForm,
            majorList: updatedMajorList,
        }));

    };

    const getMajors = async (e) => {
        e.preventDefault();
        try {
            const response = await exceptionApi("api/v1/professor/major");
            const majors = await response.data;
            console.log(response.data);
            setMajors(majors); // 전공 데이터 설정
            setSelectedMajors([]); //빈 리스트로 초기화
        } catch (error) {
            console.error("Error fetching majors:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 여기에 서버로 데이터를 전송하는 로직을 추가하세요.
        // axios 또는 fetch API를 사용하여 백엔드로 데이터를 전송할 수 있습니다.
    };

    return (
        <>
            <div className="bg-dark text-white p-2 mb-4">
                강의 등록
            </div>
            <form onSubmit={handleSubmit} className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                <div className="form-group mb-3">
                    <label htmlFor="professorName">교수명</label>
                    <input
                        type="text"
                        className="form-control"
                        id="professorName"
                        value={form.name}
                        readOnly={true}
                    />
                </div>
                <div className="form-group mb-3">
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
                        {form &&
                            form.majorList.map((major, i) => (
                                <div
                                    className={`list-group-item ${major.majorName === selectedMajor ? 'active' : ''}`}
                                    key={major.majorName + '_' + i}
                                    onClick={() => handleMajorClick(major.majorName)}
                                    role="button"
                                >
                                    {major.majorName}
                                </div>
                            ))}
                    </div>
                    <InputContainer>
                        <AuthButton onClick={getMajors}>전공 조회</AuthButton>
                    </InputContainer>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="lectureName">강의명</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lectureName"
                        placeholder="강의명"
                        value={lectureName}
                        onChange={(e) => setLectureName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="lectureComment">강의 설명</label>
                    <textarea
                        className="form-control"
                        id="lectureComment"
                        rows="3"
                        placeholder="강의 설명"
                        value={lectureComment}
                        onChange={(e) => setLectureComment(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="maximumNumber">수강 정원</label>
                    <input
                        type="number"
                        className="form-control"
                        id="maximumNumber"
                        placeholder="수강 정원"
                        value={maximumNumber}
                        onChange={(e) => setMaximumNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="score">학점</label>
                    <input
                        type="number"
                        className="form-control"
                        id="score"
                        placeholder="학점"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="semester">학기</label>
                    <select
                        className="form-control"
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        required
                    >
                        <option value="">학기 선택</option>
                        <option value="FIRST">1학기</option>
                        <option value="SECOND">2학기</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button type="submit" className="btn btn-primary mt-3">
                        등록
                    </button>
                </div>
            </form>

        </>
    );
};

export default RegistrationForm;
