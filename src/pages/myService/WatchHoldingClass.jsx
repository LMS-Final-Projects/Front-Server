import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useRecoilValue} from "recoil";
import {api} from "../../api/Api";
import {idAtom, roleAtom} from "../../atom/LoginAtom";

function WatchHoldingCourse() {
    const id = useRecoilValue(idAtom);
    const role = useRecoilValue(roleAtom);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            const customHeaders = {
                'member-id': id
            };
            try {
                const response = await api('api/v1/manager/application', 'GET',null,customHeaders);
                setCourses(response.data);
                console.log(response.data); // 최신 데이터를 출력
            } catch (error) {
                alert('Error fetching courses:', error);
            }
        };

        fetchCourse();
    }, []);

    const handleCourseDetails = async (id) => {
        try {
            const response = await api(`api/v1/courses/${id}`, 'GET');
            if (response.errorMsg === '') {
                alert('공지사항 호출 성공!');
            } else {
                alert('공지사항 호출 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error Watching WatchCourse:', error);
        }
    }

    const handleCheckboxChange = (event, coureseObj) => {
        if (event.target.checked) {
            setSelectedCourses(prevSelected => [...prevSelected, coureseObj]);
            console.log(selectedCourses);
        } else {
            setSelectedCourses(prevSelected => prevSelected.filter(selectedCourse => selectedCourse.id !== coureseObj.id));
            console.log(selectedCourses);
        }
    }

    const handleDeleteSelectedCourses = async () => {
        try {
            const courseIds = selectedCourses.map(selectedCourse => selectedCourse.id);
            // 여기에서 선택된 클래스들을 삭제하는 로직을 수행해야 합니다.
            const response = await api('api/v1/application/delete', 'POST', { courseIds });
            if (response.errorMsg === '') {
                alert('공지 삭제 성공!');
            } else {
                alert('공지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting courses:', error);
        }
    };

    const handleDeleteSelectedCourses2 = async () => {
        try {
            const lectureIds = selectedCourses.map(selectedCourse => selectedCourse.id);
            // 여기에서 선택된 클래스들을 삭제하는 로직을 수행해야 합니다.
            const response = await api('api/v1/lectures/delete', 'POST', { lectureIds });
            if (response.errorMsg === '') {
                alert('공지 삭제 성공!');
            } else {
                alert('공지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting courses:', error);
        }
    };

    const handleTitleClick = async (id) => {
        try {
            navigate(`/courese/watchCourse/details/${id}`);
            await handleCourseDetails(id);
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };



    return (
        <div>
            {role === 'PROFESSOR' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">
                        강의 요청 목록
                    </div>
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">강의 이름</th>
                                <th scope="col">교수 이름</th>
                                <th scope="col">학점</th>
                                <th scope="col">상태</th>
                                <th scope="col">선택</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.lectureName}</td>
                                    <td>{course.professorName}</td>
                                    <td>{course.score}</td>
                                    <td>대기중</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(event) => handleCheckboxChange(event, course)}
                                            checked={selectedCourses.some(selectedCourse => selectedCourse.id === course.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link to="/admin/notice/writeNotice">
                                <button className="btn btn-primary" type="submit">
                                    강의 등록
                                </button>
                            </Link>
                            <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedCourses2}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {role === 'STUDENT' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">
                        강의 요청 목록
                    </div>
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">강의 이름</th>
                                <th scope="col">교수 이름</th>
                                <th scope="col">학점</th>
                                <th scope="col">상태</th>
                                <th scope="col">선택</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.lectureName}</td>
                                    <td>{course.professorName}</td>
                                    <td>{course.score}</td>
                                    <td>대기중</td>
                                    <td>
                                        <div style={{ cursor: 'pointer' }} onClick={() => handleTitleClick(course.id)}>
                                            {/* Content to be displayed inside the div */}
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(event) => handleCheckboxChange(event, course)}
                                            checked={selectedCourses.some(selectedCourse => selectedCourse.id === course.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedCourses}>
                               취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!role && (
                <div>유저 정보를 불러오는 중입니다...</div>
            )}
        </div>
    )
}

export default WatchHoldingCourse;
