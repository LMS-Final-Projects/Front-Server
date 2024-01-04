import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { api } from "../../api/Api";
import {idAtom, nameAtom, roleAtom} from "../../atom/LoginAtom";

function WatchClass() {
    const id = useRecoilValue(idAtom);
    const role = useRecoilValue(roleAtom);
    const name = useRecoilValue(nameAtom);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {

            try {

                const customHeaders = {
                    "member-id" : id,
                    "role" : role,
                    "name" : name
                };
                console.log(id)
                console.log(role)
                console.log(name)
                const response = await api('api/v1/application/accept', 'GET', null, customHeaders);
                setCourses(response.data);
                console.log(response.data);
            } catch (error) {
                alert('Error fetching courses:', error);
            }
        };

        if (id && role && name) {
            fetchCourse();
        }
    }, [id,role,name]);

    const handleCourseDetails = async (lectureId) => {
        try {
            const response = await api(`api/v1/classes/${lectureId}`, 'GET');
            if (response.errorMsg === '') {
                alert('강의 호출 성공!');
            } else {
                alert('강의 호출 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error Watching WatchCourse:', error);
        }
    }


    const handleTitleClick = async (lectureId) => {
        try {
            navigate(`/student/myService/myLecture/watchClass/${lectureId}`);
            await handleCourseDetails(lectureId);
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };

    return (
        <>
            <div>
                <div className="bg-dark text-white p-2 mb-4">
                    강의 목록
                </div>
                {role ===  'PROFESSOR' && (
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">강의 이름</th>
                                <th scope="col">강의 요일</th>
                                <th scope="col">강의 시간</th>
                                <th scope="col">교수 이름</th>
                                <th scope="col">학점</th>
                                <th scope="col">정원</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <div style={{ cursor: 'pointer' }} onClick={() => handleTitleClick(course.lectureId)}>
                                            {course.lectureName}
                                        </div>
                                    </td>
                                    <td>수요일</td>
                                    <td>1</td>
                                    <td>{course.professorName}</td>
                                    <td>{course.score}</td>
                                    <td>{course.maximumNumber}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {role === 'STUDENT' && (
                    <div className="bg-white rounded mt-4 p-4">
                        <table className="table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">강의 이름</th>
                                <th scope="col">강의 요일</th>
                                <th scope="col">강의 시간</th>
                                <th scope="col">교수 이름</th>
                                <th scope="col">학점</th>
                                <th scope="col">정원</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <div style={{ cursor: 'pointer' }} onClick={() => handleTitleClick(course.lectureId)}>
                                            {course.lectureName}
                                            </div>
                                    </td>
                                    <td>수요일</td>
                                    <td>1</td>
                                    <td>{course.professorName}</td>
                                    <td>{course.score}</td>
                                    <td>{course.maximumNumber}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!role && (
                    <div>유저 정보를 불러오는 중입니다...</div>
                )}
            </div>
        </>
    )
}

export default WatchClass;
