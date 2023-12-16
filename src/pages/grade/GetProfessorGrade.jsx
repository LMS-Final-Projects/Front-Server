import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useParams} from "react-router";
import {api} from "../../api/Api";

const GradeReportContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
  text-align: center;
  border-bottom: 1px solid #ddd;

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

const Modal = styled.div`
  display: ${props => (props.$show ? 'block' : 'none')};
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 80%;
  background: #fff;
  border-radius: 10px;
  padding: 10px 50px 50px 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  text-align: center;
  overflow: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 30%;
  font-size: 16px;
  outline: none;
`;

const GetProfessorGrade = () => {
    const { type } = useParams();

    const [lectures, setLectures] = useState([]);
    const [grades, setGrades] = useState([]);
    const [requestGrades, setRequestGrades] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2023');
    const [selectedSemester, setSelectedSemester] = useState('first');
    const [showModal, setShowModal] = useState(false);
    const [lectureId, setLectureId] = useState();
    const [score, setScore] = useState();

    const getLecture = async () => {
        const request = {
            "year" : selectedYear,
            "semester" : selectedSemester
        };
        const response = await api("/api/v1/grade/professor","POST",request)
        setLectures(response.data);
        console.log(response);
        console.log(response.data);
    }
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
    };

    const setGradeList = async (id) => {
        setShowModal(true);
        const response = await api(`/api/v1/grade/professor/${id}`,"GET")
        console.log(response.data)
        setGrades(response.data)
        setLectureId(id)
    }

    const updateGradeList = async (id) => {
        setShowModal(true);
        const response = await api(`/api/v1/grade/${id}`,"GET")
        console.log('흠')
        console.log(response.data)
        setGrades(response.data)
        setLectureId(id)
    }
    const closeModal = () => {
        setShowModal(false);
    };

    const setGrade = async () => {
        const updatedGrades = requestGrades.map((grade) => {
            return {
                studentId: grade.studentId,
                score: grade.score
            };
        });

        const response = await api(`/api/v1/grade/${lectureId}`,'POST',updatedGrades)
    }

    const updateGrade = async (lectureId,studentId) => {
        const request = {
            studentId : studentId,
            score : score
        }
        console.log(request);
        const response = await api(`/api/v1/grade/${lectureId}`,'PUT',request)
    }
    const handleInputChange = (event, index, field) => {
        const updatedGradeList = [...grades]; // 상태 복제
        updatedGradeList[index][field] = event.target.value; // 변경된 값을 반영

        // 변경된 리스트를 상태로 업데이트
        setRequestGrades(updatedGradeList);
        console.log("----")
        console.log(requestGrades)
        console.log("----")
    };

    const onChangeHandler = (e) => {
        setScore(e.target.value);
    }

    useEffect(() => {
        // getLecture();
        console.log(selectedSemester)
        console.log(type)
    },[selectedYear,selectedSemester]);

    return (
        <div className={"_right-content"}>
            <GradeReportContainer>
                <div style={{ float: 'right', marginRight: '20px', marginTop: '20px' }}>
                    <label htmlFor="year">년도:</label>
                    <select id="year" value={selectedYear} onChange={handleYearChange}>
                        <option value="2023">2023년</option>
                        <option value="2022">2022년</option>
                    </select>
                    <label htmlFor="semester">학기:</label>
                    <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
                        <option value="first">1학기</option>
                        <option value="second">2학기</option>
                    </select>
                </div>
                <h2>강의 내역</h2>
                <Table>
                    <thead>
                    <TableRow>
                        <TableHeader>순번</TableHeader>
                        <TableHeader>강의명</TableHeader>
                        <TableHeader></TableHeader>
                        <TableHeader></TableHeader>
                        <TableHeader>성적입력</TableHeader>
                    </TableRow>
                    </thead>
                    <tbody>
                    {lectures.map((lecture) => (
                        <TableRow key={lecture.id}>
                            <TableCell>{lecture.id}</TableCell>
                            <TableCell>{lecture.lectureName}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {type === 'set' && (
                            <TableCell>
                                <Button onClick={() => setGradeList(lecture.id)}>성적입력</Button>
                            </TableCell>
                            )}
                            {type === 'update' && (
                                <TableCell>
                                    <Button onClick={() => updateGradeList(lecture.id)}>성적수정</Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    </tbody>
                </Table>
            </GradeReportContainer>
            <Modal $show={showModal}>
                <CloseButton onClick={closeModal}>X</CloseButton>
                <Table>
                    <thead>
                    <TableRow>
                        <TableHeader>순번</TableHeader>
                        <TableHeader>강의명</TableHeader>
                        <TableHeader>이름</TableHeader>
                        {type === 'update' && (
                            <>
                                <TableHeader>점수</TableHeader>
                                <TableHeader>학점</TableHeader>
                            </>
                        )}
                        <TableHeader>성적입력</TableHeader>
                        {type === 'update' && (
                            <TableHeader>수정</TableHeader>
                        )}
                    </TableRow>
                    </thead>
                    <tbody>
                    {grades.map((grade,index) => (
                        <TableRow key={index+1}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{grade.lectureName}</TableCell>
                            <TableCell>{grade.studentName}</TableCell>
                            {type === 'update' && (
                                <>
                                    <TableCell>{grade.score}</TableCell>
                                    <TableCell>{grade.credit}</TableCell>
                                </>
                            )}
                            {type === 'set' && (
                                <TableCell>
                                    <Input type="text" id="score" onChange={(event) => handleInputChange(event, index, 'score')}  />
                                </TableCell>
                            )}
                            {type === 'update' && (
                                <TableCell>
                                    <Input type="text" id="score" onChange={onChangeHandler}  />
                                </TableCell>
                            )}
                            {type === 'update' && (
                                <TableCell>
                                    <Button onClick={() => updateGrade(grade.lectureId,grade.studentId)}>성적수정</Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    </tbody>
                </Table>
                {type === 'set' && (
                    <Button onClick={() => setGrade()}>성적입력</Button>
                )}
            </Modal>
        </div>
    );
};

export default GetProfessorGrade;