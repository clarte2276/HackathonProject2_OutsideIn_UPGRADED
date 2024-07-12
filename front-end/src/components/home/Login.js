import React from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import loginUser from '../images/loginuser.png';

function Login() {
  return (
    <div className="loginPosition">
      <img className="loginUserImg" src={loginUser} alt=""></img>
      <div className="loginPositionBtn">
        <Link to="/Loginpage" className="loginLink">
          <button className="loginBtn">로그인</button>
        </Link>
        <br />
        <Link to="/Signuppage" className="signupLink">
          <button className="signupBtn">회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
