import React, { useState } from 'react';
import {api, exceptionApi} from "../../api/Api";
import {useRecoilValue} from "recoil";
import {emailAtom, idAtom, nameAtom} from "../../atom/LoginAtom";
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
    const id = useRecoilValue(idAtom);
    const [majors, setMajors] = useState([]);
    const name = useRecoilValue(nameAtom);
    const email = useRecoilValue(emailAtom);
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [professorName, setProfessorName] = useState('');
    const [majorName, setMajorName] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [lectureComment, setLectureComment] = useState('');
    const [maximumNumber, setMaximumNumber] = useState(10);
    const [startTime, setStartTime] = useState(1);
    const [score, setScore] = useState(0);
    const [semester, setSemester] = useState('');
    const currentDate = new Date();
    const [year, setYear] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');

    const [form, SetForm] = useState({

        upLoadTime: currentDate,
        majorList: []
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
            const response = await api(`api/v1/professor/${id}`,`GET`);
            const majors = await response.data;
            console.log(response.data);
            setMajors(majors); // 전공 데이터 설정
            setSelectedMajors([]); //빈 리스트로 초기화
        } catch (error) {
            console.error("Error fetching majors:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const LectureRequest = {
            professorId: id,
            lectureName: lectureName,
            professorName: name,
            lectureComment: lectureComment,
            maximumNumber: maximumNumber,
            score: score,
            semester: semester,
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            year: year,
            majorNames: form.majorList.map(major => major.majorName)
        };

        try {
            // 강의 등록 API 호출
            const response = await api(`/api/v1/lectures`, 'POST', LectureRequest);

            // API 응답 처리
            if (response.code === "OK") {
                alert('강의 등록 성공!');
            } else {
                alert('강의 등록 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error applying for lecture:', error);
        }
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
                        value={name}
                        onChange={(e) => setProfessorName(e.target.value)}
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
                    <label htmlFor="dayOfWeek">강의 요일</label>
                    <select
                        className="form-control"
                        id="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        required
                    >
                        <option value="">요일 선택</option>
                        <option value="MONDAY">월</option>
                        <option value="TUESDAY">화</option>
                        <option value="WEDNESDAY">수</option>
                        <option value="THURSDAY">목</option>
                        <option value="FRIDAY">금</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="startTime">강의 시작 교시</label>
                    <input
                        type="number"
                        className="form-control"
                        id="startTime"
                        placeholder="시작 시간"
                        value={startTime}
                        onChange={(e) => {
                            const enteredStartTime = parseFloat(e.target.value);
                            if (!isNaN(enteredStartTime) && enteredStartTime >= 0 && enteredStartTime <= 7) {
                                setStartTime(enteredStartTime);
                            }
                        }}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="maximumNumber">수강 정원</label>
                    <input
                        type="number"
                        className="form-control"
                        id="maximumNumber"
                        placeholder="수강 정원"
                        value={maximumNumber}
                        onChange={(e) => {
                            const enteredMaximumNumber = parseFloat(e.target.value);

                            if (!isNaN(enteredMaximumNumber) && enteredMaximumNumber >= 10 && enteredMaximumNumber <= 50) {

                                setMaximumNumber(enteredMaximumNumber);
                            }
                        }}
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
                        onChange={(e) => {

                            const enteredScore = parseFloat(e.target.value);

                            if (!isNaN(enteredScore) && enteredScore >= 0 && enteredScore <= 4) {

                                setScore(enteredScore);
                            }
                        }}
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
                <div className="form-group mb-3">
                    <label htmlFor="year">년도</label>
                    <select
                        className="form-control"
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">년도 선택</option>
                        <option value="2023">2023</option>
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
