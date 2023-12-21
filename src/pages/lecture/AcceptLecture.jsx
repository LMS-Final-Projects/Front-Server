import React, {useEffect, useState} from 'react';

import {useRecoilValue} from "recoil";
import {api} from "../../api/Api";
import {idAtom, roleAtom} from "../../atom/LoginAtom";



const AcceptLecture = () => {
    const [professorName, setProfessorName] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [score, setScore] = useState('');
    const [semester, setSemester] = useState("FIRST");
    const [maximumNumber, setMaximumNumber] = useState('');
    const [lectureComment, setLectureComment] = useState('');
    const [selectedLectures, setSelectedLectures] = useState([]);
    const [lectures, setLectures] = useState([]);
    const role = useRecoilValue(roleAtom);
    const id = useRecoilValue(idAtom);
    const lectureDate = new Date();

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

    const handleDenySelectedLectures = async () => {
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

        const AdminLectureRequest = {
            lectureName: lectureName,
            professorId: id,
            lectureComment: lectureComment,
            maximumNumber: maximumNumber,
            score: score,
            semester: semester,
            professorName: professorName,
            lectureDate: lectureDate
        };


        try {
            // 강의 등록 API 호출
            const response = await api(`/api/v1/lecture/registration`, 'POST', AdminLectureRequest);

            // API 응답 처리
            if (response.data.errorMsg === '') {
                alert('강의 승인 성공!');
            } else {
                alert('강의 승인 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error applying for lecture:', error);
        }
    };

    return (
        <div>
            <div className="bg-dark text-white p-2 mb-4">요청 강의</div>
            {role === 'ADMIN' && (
                <div className="bg-white rounded mt-4 p-4">
                    <table className="table">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">강의코드</th>
                            <th scope="col">학기</th>
                            <th scope="col">강의 이름</th>
                            <th scope="col">교수 이름</th>
                            <th scope="col">최대 인원</th>
                            <th scope="col">학점</th>
                            <th scope="col">강의 설명</th>
                            <th scope="col">상태</th>
                            <th scope="col">선택</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lectures.map((lecture) => (
                            <tr key={lecture.id}>
                                <td>{lecture.id}</td>
                                <td>{lecture.semester}</td>
                                <td>{lecture.lectureName}</td>
                                <td>{lecture.professorName}</td>
                                <td>{lecture.maximumNumber}</td>
                                <td>{lecture.score}</td>
                                <td>{lecture.lectureComment}</td>
                                <td>{lecture.status}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={(event) => handleCheckboxChange(event, lecture)}
                                        checked={selectedLectures.some(selectedLecture => selectedLecture.id === lecture.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary" type= "button" onClick={handleApplyLecture}>승인</button>
                        <button className="btn btn-primary" type= "button" onClick={handleDenySelectedLectures}>거부</button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AcceptLecture;
