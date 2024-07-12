import React from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import mypageUser from '../images/mypageUser';

function Mypage() {
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    usernickname,
    birth,
    gender,
    userId,
    password,
    state,
    setFirstName,
    setLastName,
    setUsernickname,
    setBirth,
    setGender,
    setUserId,
    setPassword,
    setState,
    handleSave,
  } = useUserData();

  const genderOptions = [
    { value: '남성', label: '남성' },
    { value: '여성', label: '여성' },
  ];

  const stateOptions = [
    { value: '우울', label: '저는 지금 우울해요' },
    { value: '불안', label: '저는 지금 불안해요' },
    { value: '강박', label: '저는 지금 강박이 있어요' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'usernickname':
        setUsernickname(value);
        break;
      case 'birth':
        setBirth(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption ? selectedOption.value : '');
  };

  const handleStateChange = (selectedOption) => {
    setState(selectedOption ? selectedOption.value : '');
  };

  const handleSaveWrapper = (e) => {
    e.preventDefault();
    handleSave();
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        '/process/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('로그아웃 되었습니다.');
        navigate('/'); // 로그아웃 후 메인 페이지로 이동하기
      } else {
        throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그아웃 도중 오류 발생:', error);
      alert('로그아웃 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="myPage">
      <form onSubmit={handleSaveWrapper} className="userProfileForm">
        {/* 첫 번째 컴포넌트*/}
        <div className="userProfileContainer">
          <div className="userProfile">
            <img className="mypageImg" src={mypageUser} alt=""></img>
            <div className="userProfileBtn">
              <button type="button" className="imgUplode">
                이미지 업로드
              </button>
              <button type="button" className="imgDelete">
                이미지 제거
              </button>
            </div>
          </div>
          {/* 두 번째 컴포넌트 */}
          <div className="userProfileInfo">
            <div className="userProfileName">
              <p>
                이름
                <input type="text" name="firstName" placeholder="이름" value={firstName} onChange={handleInputChange} />
              </p>
              <p>
                성 <input type="text" name="lastName" placeholder="성" value={lastName} onChange={handleInputChange} />
              </p>
            </div>
            <div className="userProfileNickname">
              <p>
                닉네임
                <input
                  type="text"
                  name="usernickname"
                  placeholder="닉네임"
                  value={usernickname}
                  onChange={handleInputChange}
                />
              </p>
            </div>
          </div>
        </div>
        {/* 세 번째 컴포넌트 */}
        <div className="userProfileAdditionalInfo centered">
          <div className="additional1">
            <p className="a_id">
              아이디 <input type="text" placeholder="아이디" value={userId} disabled />
            </p>
            {/* 아이디 수정 불가능 */}
            <p className="a_pw">
              비밀번호
              <input
                type="text"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
          </div>
          <div className="additional2">
            <p>
              생년월일
              <input type="text" name="birth" placeholder="생년월일" value={birth} onChange={handleInputChange} />
            </p>
            성별
            <Select
              className="genderAlt"
              options={genderOptions}
              value={genderOptions.find((option) => option.value === gender)}
              onChange={handleGenderChange}
              placeholder="성별"
              isClearable
            />
          </div>
          <div className="additional3">
            지금 상태는{' '}
            <Select
              className="stateAlt"
              options={stateOptions}
              value={stateOptions.find((option) => option.value === state)}
              onChange={handleStateChange}
              placeholder="상태"
              isClearable
            />
          </div>
        </div>
        {/* 네 번째 컴포넌트 */}
        <div className="centered">
          <button type="submit" className="saveBtn">
            저장
          </button>
          <button type="button" className="logoutBtn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </form>
    </div>
  );
}

export default Mypage;
