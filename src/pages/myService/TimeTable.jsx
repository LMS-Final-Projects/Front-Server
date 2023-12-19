import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { useRecoilValue } from "recoil";
import {roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";

const Title = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
`;


const ExampleTimetable = () => {
  const weeklyData = [
    {
      time: "1",
      monday: "Math",
      tuesday: "",
      wednesday: "English",
      thursday: "Science",
      friday: "Gym",
    },
    {
      time: "2",
      monday: "Math",
      tuesday: "Chemistry",
      wednesday: "English",
      thursday: "Science",
      friday: "Gym",
    },
    {
      time: "3",
      monday: "Math",
      tuesday: "Chemistry",
      wednesday: "English",
      thursday: "Science",
      friday: "",
    },
    {
      time: "4",
      monday: "Math",
      tuesday: "Chemistry",
      wednesday: "English",
      thursday: "",
      friday: "Music",
    },
    {
      time: "5",
      monday: "Physics",
      tuesday: "Chemistry",
      wednesday: "Biology",
      thursday: "",
      friday: "Music",
    },
    {
      time: "6",
      monday: "Physics",
      tuesday: "",
      wednesday: "Biology",
      thursday: "Geography",
      friday: "Music",
    },
    {
      time: "7",
      monday: "Physics",
      tuesday: "",
      wednesday: "Biology",
      thursday: "Geography",
      friday: "",
    },
    {
      time: "8",
      monday: "Physics",
      tuesday: "",
      wednesday: "Biology",
      thursday: "Geography",
      friday: "",
    },
  ];

  return <Timetable weeklyData={weeklyData} />;
};

const Timetable = ({ weeklyData }) => {
  const [user, setUser] = useState();
  const [timeTables, setNotices] = useState();
  const userRole = useRecoilValue(roleAtom);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = { role: "ADMIN", epost: "john.doe@example.com" };
        setUser(token);

        const response = await api("api/v1/board/getAllNotices", "GET");
        console.log(response.data.data);
        setNotices(response.data.data);
      } catch (error) {
        alert("Error fetching user and timeTables:", error);
      }
    };

    fetchUser();
  }, []);

  const navigate = useNavigate();
  const handleSubjectClick = async (id) => {
    try {
      if (userRole === "PROFESSOR") {
        navigate(`/professor/timeTable/watchNotice/details/${id}`);
      } else if (userRole === "STUDENT") {
        navigate(`/student/timeTable/watchNotice/details/${id}`);
      }
    } catch (error) {
      console.error("Error handling title click:", error);
    }
  };

  if (!weeklyData || !Array.isArray(weeklyData)) {
    return <div>No timetable data available</div>;
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
              <th className="text-uppercase">Time</th>
              {daysOfWeek.map((day, index) => (
                  <th key={index} className="text-uppercase">
                    {day}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {weeklyData.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="align-middle">{rowData.time}</td>
                  {daysOfWeek.map((day, dayIndex) => (
                      <td key={dayIndex}>
                    <span
                        className={`bg-${rowData[day.toLowerCase()].color} padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16 xs-font-size13`}
                    >
                      {rowData[day.toLowerCase()].subject}
                    </span>
                        <div className="margin-10px-top font-size14">{rowData[day.toLowerCase()].time}</div>
                        <div className="font-size13 text-light-gray">{rowData[day.toLowerCase()].instructor}</div>
                      </td>
                  ))}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
};

export default ExampleTimetable;
