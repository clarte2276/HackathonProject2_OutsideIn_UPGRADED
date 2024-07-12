import React from 'react';
import { Link } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  return (
    <div className="loginPage">
      <h1>로그인</h1>
      <div className="textBox">
        <input type="text" name="id" placeholder="아이디" />
        <input type="password" name="password" placeholder="비밀번호" />
      </div>
      <div className="btnContent">
        <button type="submit" className="loginpageBtn">
          로그인
        </button>
        <button className="signuppageBtn">
          <Link to="/Signup" className="signupLink">
            회원가입
          </Link>
        </button>
        <button className="kakaoBtn">
          <Link to="/logintoKakao" className="kakaoLink">
            카카오 계정으로 로그인
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Loginpage;
