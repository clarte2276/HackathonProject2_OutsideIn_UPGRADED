import React, { useState, useEffect } from 'react';
import CommonTable2 from './chatList/CommonTable2';
import CommonTableColumn2 from './chatList/CommonTableColumn2';
import CommonTableRow2 from './chatList/CommonTableRow2';
import './Chat.css';
import Chatroom from './Chatroom.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Chat = ({ roomid, selectedRoomId, handleSelectRoom }) => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    axios
      .post('/process/chat')
      .then((response) => {
        console.log(response.data);
        setDataList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the posts!', error);
      });
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Array.isArray(dataList) ? dataList.slice(indexOfFirstPost, indexOfLastPost) : [];

  const getShadowClass = (state) => {
    switch (state) {
      case '우울':
        return 'state_color sadness';
      case '불안':
        return 'state_color anxiety';
      case '강박':
        return 'state_color fear';
      default:
        return 'state_color';
    }
  };

  return (
    <>
      <div className="chatTop">
        <h1>Chat List</h1>
        <div className="chatMain_body">이곳은 1:1 채팅 대기실입니다.</div>
      </div>
      <div className="chat-container">
        <CommonTable2 headersName={['닉네임', '상태']}>
          {currentPosts.map((item, index) => (
            <CommonTableRow2 key={index}>
              <CommonTableColumn2>
                <div className="img_name">
                  <div className="user_nickname" onClick={() => handleSelectRoom(roomid, item.roomId)}>
                    {item.nickname}
                  </div>
                </div>
              </CommonTableColumn2>
              <CommonTableColumn2>
                <div className={getShadowClass(item.state)}>{item.state}</div>
              </CommonTableColumn2>
            </CommonTableRow2>
          ))}
        </CommonTable2>
        {/* 채팅방 */}
        {selectedRoomId && (
          <div className="chatroom-container">
            <Chatroom my_roomid={roomid} roomId={selectedRoomId} />
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
