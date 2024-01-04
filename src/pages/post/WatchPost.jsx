import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { useRecoilValue } from "recoil";
import {emailAtom, idAtom, nameAtom, roleAtom} from "../../atom/LoginAtom";
import {api, exceptionApi} from "../../api/Api";
import {Link} from "react-router-dom";
import {v4 as uuidv4} from "uuid";


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
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const email = useRecoilValue(emailAtom);
  const role = useRecoilValue(roleAtom);
  const id = useRecoilValue(idAtom);
  const name = useRecoilValue(nameAtom);
  const [lectures, setLectures] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      try {

        const customHeaders = {
          'member-id': id,
          'name': name,
          'role': role
        };
        const response = await api('api/v1/application/accept', 'GET', null, customHeaders);
        setLectures(response.data);
        console.log(response.data); // 최신 데이터를 출력

        const getRequest = {
          userEmail: email,
          lectureIds: '',
        };

        const response2 = await api("api/v1/post/getAll", "POST",getRequest);
        setPosts(response2.data);
      } catch (error) {
        alert("Error fetching user and posts:", error);
      }
    };

    fetchUser();
  }, []);

  const handleCheckboxChange = (event, post) => {
    if (event.target.checked) {
      setSelectedPosts((prevSelected) => [...prevSelected, post]);
    } else {
      setSelectedPosts((prevSelected) =>
        prevSelected.filter((selectedPost) => selectedPost.id !== post.id)
      );
    }
  };

  const handleDeleteSelectedPosts = async () => {
    try {
      const response = await api("api/v1/post/deletePosts", "POST", {
        postIds: selectedPosts.map((mail) => mail.id),
      });
      console.log(response.data);
      if (response.data.errorMsg === "") {
        alert("메일 삭제 성공!");
      } else {
        alert("메일 삭제 실패:", response.statusText);
      }
    } catch (error) {
      alert("Error deleting posts:", error);
    }
  };

  console.log(posts);

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
              {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.senderEmail}</td>
                    <td>{post.sendTime}</td>
                    <td>{post.title}</td>
                    <td>
                      <input
                          type="checkbox"
                          onChange={(event) => handleCheckboxChange(event, post)}
                          checked={selectedPosts.some(
                              (selectedPost) => selectedPost.id === post.id
                          )}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/admin/post/writePost">
                <button className="btn btn-primary" type="submit">
                  쪽지 쓰기
                </button>
              </Link>
              <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedPosts}>
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
                {posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.senderEmail}</td>
                      <td>{post.sendTime}</td>
                      <td>{post.title}</td>
                      <td>
                        <input
                            type="checkbox"
                            onChange={(event) => handleCheckboxChange(event, post)}
                            checked={selectedPosts.some(
                                (selectedPost) => selectedPost.id === post.id
                            )}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/professor/post/writePost">
                  <button className="btn btn-primary" type="submit">
                    쪽지 쓰기
                  </button>
                </Link>
                <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedPosts}>
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
              {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.senderEmail}</td>
                    <td>{post.sendTime}</td>
                    <td>{post.title}</td>
                    <td>{post.message}</td>
                    <td>
                      <input
                          type="checkbox"
                          onChange={(event) => handleCheckboxChange(event, post)}
                          checked={selectedPosts.some((selectedPost) => selectedPost.id === post.id)}
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
              <button className="btn btn-primary" type="submit" onClick={handleDeleteSelectedPosts}>
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
