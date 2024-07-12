import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkLogin = async (e) => {
    e.preventDefult();
    console.log('checkLogin 호출됨');
    try {
      const response = await fetch('/check-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함하여 요청
      });
      const result = await response.json();
      console.log('응답 받음:', result); // 디버깅용 로그
      if (result.loggedIn) {
        navigate('/MyPage'); // 로그인 상태라면 마이페이지로 리디렉션
      } else {
        navigate('/LoginTap'); // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션
      }
    } catch (error) {
      console.error('세션 확인 중 오류 발생:', error);
      navigate('/LoginTap'); // 오류 발생 시 로그인 페이지로 리디렉션
    }
  };

  return (
    <div className="navbar_all">
      <div className="OutsideIn">
        <Link className="navbarMenu_logo" to="/">
          <div>
            HOPINFO
            <i className="icon-users" />
          </div>
        </Link>
      </div>
      <div className="navbar">
        <Link className={`navbarMenu ${location.pathname === '/' ? 'underline' : ''}`} to="/">
          Home
        </Link>
        <Link className={`navbarMenu ${location.pathname === '/information' ? 'underline' : ''}`} to="/information">
          Information
        </Link>
        <Link className={`navbarMenu ${location.pathname === '/hospital' ? 'underline' : ''}`} to="/hospital">
          Hospital
        </Link>
        <Link
          className={`navbarMenu ${location.pathname === '/process/community/joy' ? 'underline' : ''}`}
          to="/process/community/joy"
        >
          Community
        </Link>
        <form onSubmit={checkLogin} className={`navbarMenu ${location.pathname === '/MyPage' ? 'underline' : ''}`}>
          <button type="submit" className="mypage-button">
            MyPage
          </button>
        </form>
      </div>
      <form onSubmit={checkLogin} className="icon-link-form">
        <button type="submit" className="icon-link-button">
          <i className="icon-user-circle-o" style={{ fontSize: '50px' }} />
        </button>
      </form>
    </div>
  );
}

export default Navbar;
