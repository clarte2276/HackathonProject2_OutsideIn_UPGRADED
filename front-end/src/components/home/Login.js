import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import loginUser from '../images/loginuser.png';
import axios from 'axios';
import sadnessImg from '../images/sadness.png';
import anxietyImg from '../images/anxiety.png';
import fearImg from '../images/fear.png';

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(loginUser);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus(); // 초기 로그인 상태 체크
  }, []);

  const checkLoginStatus = async () => {
    try {
      // 사용자가 로그인한 상태인지 서버에 요청
      const response = await axios.get('/process/check-login', {
        withCredentials: true, // 쿠키를 서버로 전송
      });
      const { loggedIn, userData } = response.data;

      if (loggedIn) {
        setIsLoggedIn(true);
        setProfileImage(getProfileImage(userData.state)); // 상태에 따른 프로필 이미지 설정
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  const getProfileImage = (state) => {
    switch (state) {
      case '우울':
        return sadnessImg;
      case '불안':
        return anxietyImg;
      case '강박':
        return fearImg;
      default:
        return loginUser;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/process/logout', null, {
        withCredentials: true, // 쿠키를 서버로 전송
      });
      if (response.status === 200) {
        setIsLoggedIn(false); // 로그아웃 처리 후 로그인 상태 변경
        setProfileImage(loginUser); // 기본 로그인 사용자 이미지로 변경
        navigate('/');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className="loginPosition">
      {isLoggedIn ? (
        <>
          <img className="loginUserImg" src={profileImage} alt="프로필 이미지" />
          <p>환영합니다!</p>
          <button className="logoutBtn" onClick={handleLogout}>
            로그아웃
          </button>
        </>
      ) : (
        <div className="loginPositionBtn">
          <Link to="/Loginpage" className="loginLink">
            <button className="loginBtn">로그인</button>
          </Link>
          <br />
          <Link to="/Signuppage" className="signupLink">
            <button className="signupBtn">회원가입</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Login;
