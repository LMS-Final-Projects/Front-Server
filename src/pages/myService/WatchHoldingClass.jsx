import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useRecoilValue} from "recoil";
import {api} from "../../api/Api";
import {idAtom, nameAtom, roleAtom} from "../../atom/LoginAtom";

function WatchHoldingClass() {
    const id = useRecoilValue(idAtom);
    const role = useRecoilValue(roleAtom);
    const name = useRecoilValue(nameAtom);
    const [courses, setCourses] = useState([]);
    const [holdings, setHoldings] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedHoldings, setSelectedHoldings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (role === "STUDENT") {
                    const customHeaders = {
                        'member-id': id,
                        'name': name,
                        'role': role,
                    };


                    const response1 = await api('api/v1/manager/application', 'GET', null, customHeaders);
                    setCourses(response1.data);



                    console.log(response1.data);
                } else if (role === "PROFESSOR") {

                    const response2 = await api(`api/v1/lectures/${id}`, 'GET');

                    setHoldings(response2.data);

                    console.log(response2.data);
                }
            } catch (error) {

                alert('Error fetching courses:', error);
            }
        };

        fetchData();
    }, [role, id, name]);

    const handleCourseDetails = async (id) => {
        try {
            const response = await api(`api/v1/board/${id}`, 'GET');
            if (response.errorMsg === '') {
                alert('공지사항 호출 성공!');
            } else {
                alert('공지사항 호출 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error Watching WatchCourse:', error);
        }
    }

    const handleCheckboxChange2 = (event, holdingObj) => {
        if (event.target.checked) {
            setSelectedHoldings(prevSelected => [...prevSelected, holdingObj]);
            console.log(selectedCourses);
        } else {
            setSelectedHoldings(prevSelected => prevSelected.filter(selectedHolding => selectedHolding.id !== holdingObj.id));
            console.log(selectedCourses);
        }
    }

    const handleCheckboxChange = (event, courseObj) => {
        if (event.target.checked) {
            setSelectedCourses(prevSelected => [...prevSelected, courseObj]);
            console.log(selectedCourses);
        } else {
            setSelectedCourses(prevSelected => prevSelected.filter(selectedCourse => selectedCourse.id !== courseObj.id));
            console.log(selectedCourses);
        }
    }

    const handleDeleteSelectedCourses = async () => {
        try {
            const courseIds = selectedCourses.map(selectedCourse => selectedCourse.id);
            // 여기에서 선택된 클래스들을 삭제하는 로직을 수행해야 합니다.
            const response = await api('api/v1/application/delete', 'POST', { courseIds });
            if (response.errorMsg === '') {
                alert('강의 삭제 성공!');
            } else {
                alert('강의 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting courses:', error);
        }
    };

    const handleDeleteSelectedHoldings = async () => {
        try {
            const lectureIds = selectedHoldings.map(selectedHolding => selectedHolding.id);
            // 여기에서 선택된 클래스들을 삭제하는 로직을 수행해야 합니다.
            const response = await api('api/v1/lectures/delete', 'POST', { lectureIds });
            if (response.errorMsg === '') {
                alert('강의 삭제 성공!');
            } else {
                alert('강의 삭제 실패:', response.statusText);
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
                            {holdings && holdings.map((holding) => (
                                <tr key={holding.id}>
                                    <td>{holding.lectureName}</td>
                                    <td>{holding.professorName}</td>
                                    <td>{holding.score}</td>
                                    <td>대기중</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={(event) => handleCheckboxChange2(event, holding)}
                                            checked={selectedHoldings.some(selectedHolding => selectedHolding.id === holding.id)}
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
                            <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedHoldings}>
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
                            {courses && courses.map((course) => (
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

export default WatchHoldingClass;
