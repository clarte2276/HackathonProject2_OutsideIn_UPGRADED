import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import ChatRoom from './Chatroom';
import './mainChat.css';
import useUserData from '../useUserData';

const MainChat = () => {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleSelectRoom = (my_roomid, roomId) => {
    setSelectedRoomId(roomId);
    navigate(`/Chatroom/${my_roomid}/to/${roomId}`);
  };

  const { roomid, fetchUserData } = useUserData();

  return (
    <div className="chatmainpage">
      <div className="mainChatContainer">
        <div className="chatListContainer">
          <Chat roomid={roomid} selectedRoomId={selectedRoomId} handleSelectRoom={handleSelectRoom} />
        </div>
        <div className="chatRoomContainer">
          {selectedRoomId ? (
            <ChatRoom roomId={selectedRoomId} />
          ) : (
            <div className="placeholder">채팅을 시작하려면 사용자를 선택하세요.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChat;
