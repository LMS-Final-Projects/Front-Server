import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {api} from "../../api/Api";


const GradeReportContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: center;
  background-color: #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  &:last-child {
    border-bottom: none;
  }
`;

const AverageRow = styled(TableRow)`
  background-color: #ddd;
`;

const AverageCell = styled(TableCell)`
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #008ecf;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
`;

const Application = () => {

    const [lectures, setLectures] = useState([]);
    const [applications, setApplications] = useState([]);

    const getLectures = async () => {
        const response = await api("/api/v1/lectures","GET")
        setLectures(response.data);
        // console.log(response);
        // console.log(response.data);
    }

    const getApplication = async () => {
        const response = await api("/api/v1/application","GET")
        setApplications(response.data);
        console.log(response);
        console.log(response.data);
    }

    const application = async (id,lectureName,professorName,score,maximumNumber) => {
        const request = {
            "lectureId" : id,
            "lectureName" : lectureName,
            "professorName" : professorName,
            "score" : score,
            "maximumNumber" : maximumNumber
        }
        alert("신청완료")
        await api("/api/v1/application","POST",request)
        window.location.reload();
    }

    const cancel = async (id) => {
        const request = {
            "lectureId" : id
        }
        alert("신청취소")
        await api("/api/v1/application","DELETE",request)
        window.location.reload();
    }

    useEffect(() => {
        getLectures();
        getApplication();
    },[]);


    return (
        <div className={"_right-content"}>
            <div className="bg-dark text-white p-2 mb-4">강의 신청</div>
            <GradeReportContainer>
                <h2>강의 목록</h2>
                <Table>
                    <thead>
                    <TableRow>
                        <TableHeader>순번</TableHeader>
                        <TableHeader>강의명</TableHeader>
                        <TableHeader>학점</TableHeader>
                        <TableHeader>인원 제한</TableHeader>
                        <TableHeader>담당 교수</TableHeader>
                        <TableHeader></TableHeader>
                    </TableRow>
                    </thead>
                    <tbody>
                    {lectures.length > 0 && lectures.map((lecture) => (
                        <TableRow key={lecture.id}>
                            <TableCell>{lecture.id}</TableCell>
                            <TableCell>{lecture.lectureName}</TableCell>
                            <TableCell>{lecture.score}</TableCell>
                            <TableCell>{lecture.maximumNumber}</TableCell>
                            <TableCell>{lecture.professorName}</TableCell>
                                <TableCell>
                                    <Button onClick={() => application(
                                        lecture.id,
                                        lecture.lectureName,
                                        lecture.professorName,
                                        lecture.score,
                                        lecture.maximumNumber
                                    )}>수강신청</Button>
                                </TableCell>
                        </TableRow>
                    ))}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </Table>
            </GradeReportContainer>
            <GradeReportContainer>
                <h2>신청 목록</h2>
                <Table>
                    <thead>
                    <TableRow>
                        <TableHeader>순번</TableHeader>
                        <TableHeader>강의명</TableHeader>
                        <TableHeader>학점</TableHeader>
                        <TableHeader>인원 제한</TableHeader>
                        <TableHeader>담당 교수</TableHeader>
                        <TableHeader></TableHeader>
                    </TableRow>
                    </thead>
                    <tbody>
                    {applications.length > 0 && applications.map((application) => (
                        <TableRow key={application.id}>
                            <TableCell>{application.id}</TableCell>
                            <TableCell>{application.lectureName}</TableCell>
                            <TableCell>{application.score}</TableCell>
                            <TableCell>{application.maximumNumber}</TableCell>
                            <TableCell>{application.professorName}</TableCell>
                            <TableCell>
                                <Button onClick={() => cancel(
                                    application.lectureId
                                )}>신청 취소</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </Table>
            </GradeReportContainer>
        </div>
    );
};

export default Application;