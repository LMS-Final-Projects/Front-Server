import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../assets/image/img.png";
import { useNavigate } from "react-router";
import {api, exceptionApi} from "../api/Api";

const Logo = styled.img`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #1e90ff, #0073e6);
`;


const FormContainer = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 80px;
  width: 40%;
  height: 60%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 20px; /* 적절한 패딩 값으로 조정 */
  margin: 10px 0;
  width: ${({ $emailInput }) => ($emailInput ? "80%" : "100%")};
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  outline: none;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
const Label = styled.label`
  font-size: 12px;
  color: #008ecf;
  text-align: left;
  margin-top: 10px;
`;

const SmallText = styled.span`
  font-size: 10px;
  color: #555;
`;

const Divider = styled.div`
  height: 10px;
  width: 2px;
  background: #ccc;
  margin: 0 10px;
`;

const TextForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 25px;
`;

const LeftAligned = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const RightAligned = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
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
  display: ${(props) => (props.$show ? "block" : "none")};
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

const ModalButton = styled(Button)`
  background: ${({ selected }) => (selected ? "#008ecf" : "#ccc")};
  margin-right: 30px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 20px 0;
  padding: 10px;
`;

const AuthButton = styled.button`
  padding: 8px 15px; /* 적절한 패딩 값으로 조정 */
  margin: 0 5px; /* 적절한 마진 값으로 조정 */

  /* 나머지 스타일 유지 */
  background: #008ecf;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 30%;
`;

const MajorListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin: 20px;
`;

const MajorItem = styled.div`
  padding: 12px; /* 패딩 값을 늘려 더 크고 균일하게 만들어보겠습니다. */
  cursor: pointer;
  transition: background-color 0.3s; /* 부드러운 배경색 전환을 위한 transition 효과 */

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Login() {
  const [majors, setMajors] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [switchButton, setSwitchButton] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const navigate = useNavigate();
  const [selectedMajor, setSelectedMajor] = useState('');

  const handleMajorClick = (majorName) => {
    // 클릭한 majorName을 선택한 major로 설정
    setSelectedMajor(majorName);

    // majorList에서 클릭한 majorName을 제거
    const updatedMajorList = user.majorList.filter((major) => major.majorName !== majorName);
    setUser((prevUser) => ({
      ...prevUser,
      majorList: updatedMajorList,
    }));

  };

  const [user, setUser] = useState({
    userId: "",
    password: "",
    name: "",
    status: "NORMAL",
    role: "STUDENT",
    email: "",
    phNumber: "",
    verificationNumber: "",
    majorList: [],
  });

  const getMajors = async (e) => {
    e.preventDefault();
    try {
      const response = await exceptionApi("api/v1/major");
      const majors = await response.data;
      console.log(response.data);
      setMajors(majors); // 전공 데이터 설정
      setSelectedMajors([]); //빈 리스트로 초기화
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const handleMajorSelect = (e, major) => {
    const find = user.majorList.find((m) => m.id === major.id);
    if (find) {
      alert("이미 선택되었습니다.");
      return;
    }
    e.preventDefault();
    const majorList = [...user.majorList, major];
    setUser((prevUser) => {
      return {
        ...prevUser,
        majorList,
      };
    });
    setMajors([]);
  };

  const onChangeHandler = (e) => {
    const { value, id } = e.target;
    setUser({ ...user, [id]: value });
  };

  const openModal = (type) => {
    setShowSignUpModal(type);
    setShowFindModal(!type);
  };
  const closeModal = () => {
    setShowSignUpModal(false);
    setShowFindModal(false);
    setIsVerification(false);
  };

  const modalSwitch = (change) => {
    setSwitchButton(change);
    if (change) {
      setUser({ ...user, role: "STUDENT" });
    } else {
      setUser({ ...user, role: "PROFESSOR" });
    }
  };
  const login = async (e) => {
    e.preventDefault();
    const request = {
      email: user.email,
      password: user.password,
    };
    try {
      const response = await exceptionApi(
        "/api/v1/member/login",
        "POST",
        request
      );
      if (response) navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...user,
        majorNames: user.majorList.map((major) => major.majorName),
      };
      if (isVerification) {
        await exceptionApi("/api/v1/member/signup", "POST", data);
        window.location.reload();
        console.log(data);
      } else {
        alert("이메일 인증 해주세요.");
      }
    } catch (error) {}
  };

  const getVerificationNumber = async (e) => {
    e.preventDefault();
    const request = {
      email: user.email,
    };
    try {
      await api("/api/v1/member/send", "POST", request);
    } catch (error) {
      console.log(error);
    }
  };

  const postVerificationNumber = async (e) => {
    e.preventDefault();
    const request = {
      email: user.email,
      verificationNumber: user.verificationNumber,
    };
    try {
      const response = await exceptionApi(
        "/api/v1/member/check",
        "POST",
        request
      );
      if (response.data) {
        setIsVerification(true);
      } else {
        setIsVerification(false);
      }
    } catch (error) {}
  };
  console.log(user);
  return (
    <>
      <Container>
        <FormContainer>
          <Logo src={logo} alt="Logo" />
          <Form>
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              minLength={4}
              onChange={onChangeHandler}
            />
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              required
              minLength={4}
              onChange={onChangeHandler}
            />
            <TextForm>
              <LeftAligned>
                <SmallText onClick={() => openModal(true)}>회원가입</SmallText>
              </LeftAligned>
              <RightAligned>
                <SmallText onClick={() => openModal(false)}>
                  이메일 찾기
                </SmallText>
                <Divider />
                <SmallText onClick={() => openModal(false)}>
                  비밀번호 찾기
                </SmallText>
              </RightAligned>
            </TextForm>
            <Button onClick={login}>Login</Button>
          </Form>
        </FormContainer>
      </Container>
      <Modal $show={showSignUpModal}>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <ButtonsContainer>
          <ModalButton
            selected={switchButton}
            onClick={() => modalSwitch(true)}
          >
            학생 회원가입
          </ModalButton>
          <ModalButton
            selected={!switchButton}
            onClick={() => modalSwitch(false)}
          >
            교직원 회원가입
          </ModalButton>
        </ButtonsContainer>
        <Form>
          <Label htmlFor="email">이메일</Label>
          <TextContainer>
            <Input
                type="email"
                id="email"
                $emailInput="true"
                required
                minLength={4}
                onChange={onChangeHandler}
            />
            <AuthButton onClick={getVerificationNumber}>인증 요청</AuthButton>
          </TextContainer>
          <Label htmlFor="verificationNumber">인증번호</Label>
          <TextContainer>
            <Input
                type="text"
                id="verificationNumber"
                $emailInput="true"
                required
                minLength={4}
                onChange={onChangeHandler}
            />
            <AuthButton onClick={postVerificationNumber}>인증 하기</AuthButton>
          </TextContainer>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            required
            minLength={4}
            onChange={onChangeHandler}
          />
          <Label htmlFor="name">이름</Label>
          <Input
            type="text"
            id="name"
            required
            minLength={4}
            onChange={onChangeHandler}
          />
          <Label htmlFor="majorName">전공</Label>
          <div className="list-group">
            {majors &&
              majors.map((major) => (
                <div className="list-group-item"
                  type="button"
                  key={major.id}
                  onClick={(e) => handleMajorSelect(e, major)}
                >
                  {major.majorName}
                </div>
              ))}
          </div>
          <Label htmlFor="majorName">선택 전공</Label>
          <div className="list-group">
            {user &&
              user.majorList.map((major, i) => (
                  <div
                      className={`list-group-item ${major.majorName === selectedMajor ? 'active' : ''}`}
                      key={major.majorName + '_' + i}
                      onClick={() => handleMajorClick(major.majorName)}
                      role="button"
                  >
                    {major.majorName}
                  </div>
              ))}
          </div>
          <InputContainer>
            <AuthButton onClick={getMajors}>전공 조회</AuthButton>
          </InputContainer>
          <Label htmlFor="phNumber">전화번호</Label>
          <Input type="text" id="phNumber" onChange={onChangeHandler} />
          <Button onClick={signUp}>가입하기</Button>
        </Form>
      </Modal>
      <Modal $show={showFindModal}>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <ButtonsContainer>
          <ModalButton
            selected={switchButton}
            onClick={() => modalSwitch(true)}
          >
            이메일 찾기
          </ModalButton>
          <ModalButton
            selected={!switchButton}
            onClick={() => modalSwitch(false)}
          >
            비밀번호 찾기
          </ModalButton>
        </ButtonsContainer>
        <Form>
          <Label htmlFor="name">이름</Label>
          <Input type="text" id="name" />
          <Label htmlFor="phNumber">전화번호</Label>
          <Input type="text" id="phNumber" />
          {switchButton ? (
            <Button>이메일 찾기</Button>
          ) : (
            <>
              <Label htmlFor="email">이메일</Label>
              <TextContainer>
              <Input type="text" id="email" $emailInput="true" />
              <AuthButton>인증하기</AuthButton>
              </TextContainer>
              <Button>비밀번호 재설정</Button>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default Login;
