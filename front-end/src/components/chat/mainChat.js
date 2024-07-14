import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import ChatRoom from './Chatroom';
import './mainChat.css';
import useUserData from '../useUserData';

const MainChat = () => {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const { roomid } = useUserData();

  const handleSelectRoom = (roomid, selectedRoomId) => {
    setSelectedRoomId(roomid);
    // 채팅 목록을 클릭할 때마다 채팅 창의 src 업데이트
    navigate(`/Chatroom/${roomid}/to/${selectedRoomId}`);
  };

  return (
    <div className="chatmainpage">
      <div className="mainChatContainer">
        <div className="chatListContainer">
          <iframe
            title="Chat List"
            src={`/process/chat?roomid=${roomid}&selectedRoomId=${selectedRoomId}`}
            className="iframe-container"
          />
        </div>
        <div className="chatRoomContainer">
          {selectedRoomId ? (
            <iframe title="Chat Room" src={`/Chatroom/${roomid}/to/${selectedRoomId}`} className="iframe-container" />
          ) : (
            <div className="placeholder">채팅을 시작하려면 사용자를 선택하세요.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChat;
