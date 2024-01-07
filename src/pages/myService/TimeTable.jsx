import { idAtom, roleAtom } from "../../atom/LoginAtom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const Timetable = () => {
  const id = useRecoilValue(idAtom);
  const role = useRecoilValue(roleAtom);
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    memberId: id,
    weekdayList: [
      {
        id: 1,
        memberId: id,
        dayOfWeek: "MONDAY",
        lectureId: 1000,
        schedule: {
          memberId: id,
          semester: "FIRST",
          year: 2023,
        },
      },
      {
        id: 2,
        memberId: id,
        dayOfWeek: "WEDNESDAY",
        lectureId: 1001,
        schedule: {
          memberId: id,
          semester: "FIRST",
          year: 2023,
        },
      },
    ],
    semester: "FIRST",
    year: 2023,
  });

  const lectures = [
    {
      id: 1000,
      lectureName: "공업 수학1",
      professorName: "교수1",
      classTimes: [1, 2, 3,4],
    },
    {
      id: 1001,
      lectureName: "공업 수학2",
      professorName: "교수1",
      classTimes: [1,2,3,4,],
    },
    // Add more lectures as needed
  ];

  useEffect(() => {
    console.log("Schedule Data:", scheduleData);
  }, []);

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

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

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
              {Array.from({ length: 8 }).map((_, hourIndex) => (
                  <tr key={hourIndex}>
                    <td>
                      <div>{hourIndex + 1}</div>
                    </td>
                    {daysOfWeek.map((day, dayIndex) => {
                      const lecture = scheduleData.weekdayList.find(
                          (item) =>
                              item.dayOfWeek === day &&
                              lectures.some((lec) => lec.id === item.lectureId && lec.classTimes.includes(hourIndex + 1))
                      );

                      const lectureName = lecture ? lectures.find((lec) => lec.id === lecture.lectureId)?.lectureName : "";

                      return (
                          <td key={dayIndex}>
                            {lecture ? (
                                <div style={{ cursor: "pointer" }} onClick={() => handleCourseClick(lecture.lectureId)}>
                                  {lectureName}
                                </div>
                            ) : (
                                ""
                            )}
                          </td>
                      );
                    })}
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
