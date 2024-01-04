import { idAtom, roleAtom } from "../../atom/LoginAtom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { api } from "../../api/Api";

const Timetable = () => {
  const [schedule, setSchedule] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [lectureId, setLectureId] = useState([]);
  const id = useRecoilValue(idAtom);
  const role = useRecoilValue(roleAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        // id가 정의되어 있을 때에만 API 호출
        if (id !== undefined) {
          console.log(id);
          const response = await api(`api/v1/schedule/${id}`, "GET");
          setSchedule(response.data.weekday);
          setLectureId(response.data.weekday.lectureId);
          console.log(response.data);

          // 여기서 추가 비동기 호출 수행
          const lectureResponse = await api(
              `api/v1/schedule/lecture/${response.data.weekday.lectureId}`,
              "GET");
          console.log(lectureResponse.data);
          setLecture(lectureResponse.data);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        // Use console.error instead of alert for better debugging
      }
    };

    fetchTable();
  }, [id]); // id가 변경될 때마다 useEffect가 다시 실행되도록 의존성 배열에 추가

  const handleCourseClick = (id) => {
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
        <div className="bg-dark text-white p-2 mb-4">강의 시간표</div>
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
              {schedule &&
                  schedule.map((weekday) => (
                      <tr key={weekday.id}>
                        <td>
                          <div
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCourseClick(weekday.lectureId)}
                          >
                            {"강의 이름"}
                          </div>
                        </td>
                        {daysOfWeek.map((day, index) => (
                            <td key={index}>
                              {weekday.dayOfWeek &&
                                  weekday.dayOfWeek === day}
                            </td>
                        ))}
                        <td>{"교수 이름"}</td>
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
