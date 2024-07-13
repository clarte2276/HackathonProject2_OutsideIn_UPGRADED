import React from 'react';
import { openChatroomPopup } from './Chatpopup';

function HospitalC() {
  const handleOnlineConsultation = () => {
    const roomId = 3;
    openChatroomPopup(roomId);
  };

  return (
    <div>
      <div>병원C</div>
      <div>이예령 원장</div>
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

export default HospitalC;
