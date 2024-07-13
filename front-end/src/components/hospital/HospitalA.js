import React, { useEffect } from 'react';
import { openChatroomPopup } from './Chatpopup';
import useUserData from '../useUserData';

function HospitalA() {
  const { userId, fetchUserData } = useUserData();
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleOnlineConsultation = () => {
    const roomId = userId === 'doctor1' ? 'doctor1' : 1; // userId가 'doctor1'이면 roomId를 'doctor1'로 설정, 그 외에는 숫자로 설정
    openChatroomPopup(roomId);
  };

  return (
    <div>
      <div>병원A</div>
      <div>김성현 원장</div>
      <div>사진</div>
      <div>약력</div>
      <div>지도</div>
      <div>
        <button type="submit" className="onlineBtn" onClick={handleOnlineConsultation}>
          1:1 온라인 상담 예약
        </button>
        <button type="submit" className="offlineBtn">
          대면 상담 예약
        </button>
      </div>
    </div>
  );
}

export default HospitalA;
