import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";


const Timetable = () => {

  const [weeklyData,setWeeklyData] = useState();
  const memberId = useRecoilValue(idAtom);
  const role = useRecoilValue(roleAtom);
  const [timeTables, setNotices] = useState();

  const navigate = useNavigate();


  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await api(`api/v1/schedule/${memberId}`, 'GET');
        setWeeklyData(response.data);
        console.log(response.data);
      } catch (error) {
        alert('Error fetching notices:', error);
      }
    };

    fetchTable();
  }, []);

  const handleCourseClick = async (id) => {
    try {
      if (role === "PROFESSOR") {
        navigate(`/professor/myService/myLecture/watchClass/${id}`);
      } else if (role === "STUDENT") {
        navigate(`/student/myService/myLecture/watchClass/${id}`);
      }
    } catch (error) {
      console.error("Error handling title click:", error);
    }
  };


  const daysOfWeek = ["월요일", "화요일", "수요일", "목요일", "금요일"];

  return (
    <>
      <div className="bg-dark text-white p-2 mb-4">
        강의 시간표
      </div>
      <div className="container">
        <div className="timetable-img text-center"></div>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
            <tr className="bg-light-gray">
              <th className="text-uppercase">교시</th>
              {daysOfWeek.map((day, index) => (
                  <th key={index} className="text-uppercase">
                    {day}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {weeklyData && weeklyData.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div style={{ cursor: 'pointer' }} onClick={() => handleCourseClick(course.lectureId)}>
                      {course.lectureName}
                    </div>
                  </td>
                  {daysOfWeek.map((day, index) => (
                      <td key={index}>
                        {/*
                  여기에 강의가 해당 요일, 해당 교시에 있는지 여부에 따라 내용을 표시
                  예: {course[day] && course[day].includes(course.lectureName) ? "강의 있음" : "강의 없음"}
                */}
                      </td>
                  ))}
                  <td>{course.professorName}</td>
                  <td>{course.score}</td>
                  <td>{course.maximumNumber}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default Timetable;
