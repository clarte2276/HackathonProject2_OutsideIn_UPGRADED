import React from 'react';
import './Signuppage.css';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import useUserData from '../useUserData';

function Signuppage() {
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    gender,
    birthdate,
    usernickname,
    userId,
    password,
    state,
    setFirstName,
    setLastName,
    setGender,
    setBirthdate,
    setUsernickname,
    setUserId,
    setPassword,
    setState,
  } = useUserData();

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption ? selectedOption.value : '');
  };

  const handleStateChange = (selectedOption) => {
    setState(selectedOption ? selectedOption.value : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (lastName && firstName && usernickname && birthdate && gender && userId && password && state) {
      const signupData = {
        lastName,
        firstName,
        usernickname,
        birth: birthdate,
        gender,
        userId,
        password,
        state,
      };

      try {
        // 회원가입 시 이용 경로
        const response = await fetch('/loginpage/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });
        const result = await response.json();

        if (result.success) {
          navigate('/Loginpage');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('회원가입 요청 중 오류 발생:', error);
        alert('회원가입 요청 중 오류가 발생했습니다.');
      }
    } else {
      alert('모든 정보를 입력해주세요.');
    }
  };

  const genderOptions = [
    { value: '남성', label: '남성' },
    { value: '여성', label: '여성' },
  ];

  const stateOptions = [
    { value: '우울', label: '저는 지금 우울해요' },
    { value: '불안', label: '저는 지금 불안해요' },
    { value: '강박', label: '저는 지금 강박이 있어요' },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      width: '492px',
      height: '48px',
      marginBottom: '15px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      fontSize: '15px',
      fontWeight: '700',
      color: '#787878',
      paddingLeft: '3%',
      paddingBottom: '55px',
    }),
    menu: (provided) => ({
      ...provided,
      width: '464px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
  };

  return (
    <div className="SignupPage">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputUsername">
          <div className="firstnameInput">
            <input
              type="text"
              placeholder="이름"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="lastnameInput">
            <input
              type="text"
              placeholder="성"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="inputUserInfo">
          <input
            type="text"
            placeholder="닉네임"
            value={usernickname}
            onChange={(e) => setUsernickname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="생년월일"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
          <Select
            className="genderLabel"
            options={genderOptions}
            onChange={handleGenderChange}
            placeholder="성별"
            styles={customSelectStyles}
            isClearable
            required
          />
          <input type="text" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          <input
            type="text"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p>지금 나의 상태는?</p>
          <Select
            className="stateLabel"
            options={stateOptions}
            onChange={handleStateChange}
            placeholder="나의 상태는 ~입니다."
            styles={customSelectStyles}
            isClearable
            required
          />
        </div>
        <button type="submit" className="SignupBtn">
          <Link to="/loginpage" className="loginLink">
            회원가입
          </Link>
        </button>
      </form>
    </div>
  );
}

export default Signuppage;
