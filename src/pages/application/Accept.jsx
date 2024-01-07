import React, {useEffect, useState} from 'react';
import {api} from "../../api/Api";
import styled from "styled-components";
import {useRecoilValue} from "recoil";
import {idAtom} from "../../atom/LoginAtom";

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

const Accept = () => {
    const [applications, setApplications] = useState([]);
    const memberId = useRecoilValue(idAtom);
    const getApplication = async () => {
        const response = await api("/api/v1/manager/application","GET")
        setApplications(response.data);
        console.log(response);
        console.log(response.data);
    }

    const accept = async (id) => {
        const clickedItem = applications.find(item => item.id === id);
        console.log(clickedItem);

        const request = {
            "applicationId" : id,
            "lectureId" : clickedItem.lectureId,
            "memberId": clickedItem.memberId
        }
        // alert("승인완료")
        const response = await api("/api/v1/manager/application/accepted","POST",request)
        // window.location.reload();
    }

    const reject = async (id) => {
        const request = {
            "applicationId" : id
        }
        alert("거절완료")
        const response = await api("/api/v1/manager/application/rejected","POST",request)
        window.location.reload();
    }

    useEffect(() => {
        getApplication();
    },[]);

    return (
        <div className={"_right-content"}>
            <div className="bg-dark text-white p-2 mb-4">승인 서비스</div>
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
                                <Button onClick={() => accept(
                                    application.id,
                                )}>신청 승인</Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => reject(
                                    application.id,
                                )}>신청 거절</Button>
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

export default Accept;