import React, {useEffect, useState} from 'react';

import {useRecoilValue} from "recoil";
import {api} from "../../api/Api";
import {idAtom, roleAtom} from "../../atom/LoginAtom";


const ApplyLecture = () => {
    const [lectureName, setLectureName] = useState('');
    const [score, setScore] = useState('');
    const [semester, setSemester] = useState("FIRST");
    const [maximumNumber, setMaximumNumber] = useState('');
    const [lectureComment, setLectureComment] = useState('');
    const [selectedLectures, setSelectedLectures] = useState([]);
    const [lectures, setLectures] = useState([]);
    const role = useRecoilValue(roleAtom);
    const id = useRecoilValue(idAtom);

    const handleCallLecture = async  () => {

        const response = await api(`/api/v1/lecture/manager/${id}`, 'GET');

        try{
        if (response.data.errorMsg === '') {
            alert('강의 조회 성공!');
            setLectures(response.data.data);

        } else {
            alert('강의 조회 실패:', response.statusText);
        }
    } catch (error) {
        alert('Error applying for lecture:', error);
    }
    }

    const handleDeleteSelectedLectures = async () => {
        try {
            const response = await api('api/v1/lecture/cancelLecture', 'POST', { lectureIds: selectedLectures.map(lecture => lecture.id) });

            console.log(response.data)
            if (response.data.errorMsg === '') {
                alert('강의 요청 삭제 성공!');
            } else {
                alert('강의 요청 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting mails:', error);
        }
    };

    useEffect(() => {
        handleCallLecture();
    }, []);

    const handleCheckboxChange = (event, lecture) => {
        if (event.target.checked) {
            setSelectedLectures(prevSelected => [...prevSelected, lecture]);
        } else {
            setSelectedLectures(prevSelected => prevSelected.filter(selectedLecture => selectedLecture.id !== lecture.id));
        }
    }

    const handleApplyLecture = async (e) => {
        e.preventDefault();

        const LectureRequest = {
            lectureName: lectureName,
            professorId: id,
            majorId: "", //전체 전공 조회에서 이름으로 고르기.
            lectureComment: lectureComment,
            maximumNumber: maximumNumber,
            score: score,
            semester: semester
        };


        try {
            // 강의 등록 API 호출
            const response = await api(`/api/v1/lecture/requestLecture`, 'POST', LectureRequest);

            // API 응답 처리
            if (response.data.errorMsg === '') {
                alert('강의 등록 성공!');
            } else {
                alert('강의 등록 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error applying for lecture:', error);
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="lectureName">강의 이름:</label>
                <input
                    type="text"
                    id="lectureName"
                    value={lectureName}
                    onChange={(e) => setLectureName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="professorId">교수 ID:</label>
                <input
                    type="text"
                    id="professorId"
                    value={id}
                    readOnly={true}
                />
            </div>
            <div>
                <label htmlFor="majorId">전공 ID:</label>
                <input
                    type="text"
                    id="majorId"
                    value={""} //전체 전공에서 조회해오는 api로 요청할거임.
                />
            </div>
            <div>
                <label htmlFor="lectureComment">강의 설명:</label>
                <input
                    type="text"
                    id="lectureComment"
                    value={lectureComment}
                    onChange={(e) => setLectureComment(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="maximumNumber">최대 인원:</label>
                <input
                    type="number"
                    id="maximumNumber"
                    value={maximumNumber}
                    onChange={(e) => setMaximumNumber(parseInt(e.target.value, 10))}
                />
            </div>
            <div>
                <label htmlFor="score">학점:</label>
                <input
                    type="number"
                    id="score"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value, 10))}
                />
            </div>
            <label htmlFor="maximumNumber">최대 인원:</label>
            <select
                id="semester"
                value={semester}
                onChange={(e) => {
                    const selectedSemester = e.target.value;
                    if (selectedSemester === "FIRST" || selectedSemester === "SECOND") {
                        setSemester(selectedSemester);
                    }
                }}
            >
                <option value="FIRST">1학기</option>
                <option value="SECOND">2학기</option>
            </select>
            <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={handleApplyLecture}>강의 등록</button>
            </div>
            </div>

    );
};

export default ApplyLecture;
