import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { useRecoilValue } from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";
import {Link} from "react-router-dom";


const StyledButton = styled.button`
    background-color: #3498db;
    color: #fff;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2980b9;
    }
  `;
const WatchPost = () => {
  const [mails, setMails] = useState([]);
  const [selectedMails, setSelectedMails] = useState([]);
  const role = useRecoilValue(roleAtom);
  const id = useRecoilValue(idAtom);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const majorName = await api(`api/v1/mail/majorName`, `GET`);

        const watchRequest = {
          receiverId: id,
          majorName: majorName,
        };

        const response = await api("api/v1/mail/getAll", "POST", watchRequest);
        setMails(response.data.data);
      } catch (error) {
        alert("Error fetching user and mails:", error);
      }
    };

    fetchUser();
  }, []);

  const handleCheckboxChange = (event, mail) => {
    if (event.target.checked) {
      setSelectedMails((prevSelected) => [...prevSelected, mail]);
    } else {
      setSelectedMails((prevSelected) =>
        prevSelected.filter((selectedMail) => selectedMail.id !== mail.id)
      );
    }
  };

  const handleDeleteSelectedMails = async () => {
    try {
      const response = await api("api/v1/mail/deleteMails", "POST", {
        mailIds: selectedMails.map((mail) => mail.id),
      });
      console.log(response.data);
      if (response.data.errorMsg === "") {
        alert("메일 삭제 성공!");
      } else {
        alert("메일 삭제 실패:", response.statusText);
      }
    } catch (error) {
      alert("Error deleting mails:", error);
    }
  };

  console.log(mails);

  return (
    <>
      <div className="bg-dark text-white p-2 mb-4">
        쪽지함
      </div>
      {role === "ADMIN" && (
          <div className="bg-white rounded mt-4 p-4">
            <table className="table">
              <thead className="thead-dark">
              <tr>
                <th scope="col">보낸 사람</th>
                <th scope="col">보낸 날짜</th>
                <th scope="col">제목</th>
                <th scope="col">선택</th>
              </tr>
              </thead>
              <tbody>
              {mails.map((mail) => (
                  <tr key={mail.id}>
                    <td>{mail.senderEmail}</td>
                    <td>{mail.sendTime}</td>
                    <td>{mail.title}</td>
                    <td>
                      <input
                          type="checkbox"
                          onChange={(event) => handleCheckboxChange(event, mail)}
                          checked={selectedMails.some(
                              (selectedMail) => selectedMail.id === mail.id
                          )}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/student/post/writePost">
                <button className="btn btn-primary" type="submit">
                  쪽지 쓰기
                </button>
              </Link>
              <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedMails}>
                삭제
              </button>
            </div>
          </div>
      )}
      {role === "PROFESSOR" && (
          <div className="bg-white rounded mt-4 p-4">
              <table className="table">
                <thead className="thead-dark">
                <tr>
                  <th scope="col">보낸 사람</th>
                  <th scope="col">보낸 날짜</th>
                  <th scope="col">제목</th>
                  <th scope="col">선택</th>
                </tr>
                </thead>
                <tbody>
                {mails.map((mail) => (
                    <tr key={mail.id}>
                      <td>{mail.senderEmail}</td>
                      <td>{mail.sendTime}</td>
                      <td>{mail.title}</td>
                      <td>
                        <input
                            type="checkbox"
                            onChange={(event) => handleCheckboxChange(event, mail)}
                            checked={selectedMails.some(
                                (selectedMail) => selectedMail.id === mail.id
                            )}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/student/post/writePost">
                  <button className="btn btn-primary" type="submit">
                    쪽지 쓰기
                  </button>
                </Link>
                <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedMails}>
                  삭제
                </button>
              </div>
          </div>
      )}

      {role === "STUDENT" && (
          <div className="bg-white rounded mt-4 p-4">
            <table className="table">
              <thead className="thead-dark">
              <tr>
                <th scope="col">보낸 사람</th>
                <th scope="col">보낸 날짜</th>
                <th scope="col">제목</th>
                <th scope="col">선택</th>
              </tr>
              </thead>
              <tbody>
              {mails.map((mail) => (
                  <tr key={mail.id}>
                    <td>{mail.senderEmail}</td>
                    <td>{mail.sendTime}</td>
                    <td>{mail.title}</td>
                    <td>{mail.message}</td>
                    <td>
                      <input
                          type="checkbox"
                          onChange={(event) => handleCheckboxChange(event, mail)}
                          checked={selectedMails.some((selectedMail) => selectedMail.id === mail.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/student/post/writePost">
                <button className="btn btn-primary" type="submit">
                  쪽지 쓰기
                </button>
              </Link>
              <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedMails}>
                삭제
              </button>
            </div>
          </div>
      )}

      {!role && <div>유저 정보를 불러오는 중입니다...</div>}
    </>
  );
};

export default WatchPost;
