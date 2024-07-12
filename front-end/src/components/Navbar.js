import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkLogin = async (e, targetPath) => {
    e.preventDefault(); // 링크 기본 동작을 막음
    console.log("checkLogin 호출됨");
    try {
      const response = await fetch("/process/check-login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });
      const result = await response.json();
      console.log("응답 받음:", result); // 디버깅용 로그
      if (result.loggedIn) {
        navigate(targetPath); // 로그인 상태라면 원래 가려던 경로로 이동
      } else {
        navigate("/Loginpage", { state: { from: targetPath } }); // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션, 원래 경로 저장
      }
    } catch (error) {
      console.error("세션 확인 중 오류 발생:", error);
      navigate("/Loginpage", { state: { from: targetPath } }); // 오류 발생 시 로그인 페이지로 리디렉션, 원래 경로 저장
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
        <Link
          className={`navbarMenu ${
            location.pathname === "/" ? "underline" : ""
          }`}
          to="/"
        >
          Home
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/information" ? "underline" : ""
          }`}
          to="/information"
        >
          Information
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/hospital" ? "underline" : ""
          }`}
          href="/hospital"
          onClick={(e) => checkLogin(e, "/hospital")}
        >
          Hospital
        </Link>
        <Link
          className={`navbarMenu ${
            location.pathname === "/community/joy" ? "underline" : ""
          }`}
          href="/community/joy"
          onClick={(e) => checkLogin(e, "/community/joy")}
        >
          Community
        </Link>
        <a
          className={`navbarMenu ${
            location.pathname === "/mypage" ? "underline" : ""
          }`}
          href="/mypage"
          onClick={(e) => checkLogin(e, "/mypage")}
        >
          MyPage
        </a>
      </div>
    </div>
  );
}

export default Navbar;
