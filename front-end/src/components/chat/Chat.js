import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chatroom from './Chatroom';

const Chat = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchChatList();
  }, []);

  const fetchChatList = async () => {
    try {
      const response = await axios.post('/process/chat');
      setDataList(response.data);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Array.isArray(dataList) ? dataList.slice(indexOfFirstPost, indexOfLastPost) : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        <h1>채팅 대기실</h1>
        <div className="chatMain_body">이곳은 1:1 채팅 대기실입니다.</div>
        <div>대화에 참여해 새로운 만남을 경험해 보세요!</div>
        {/* 채팅 목록 컴포넌트를 여기에 넣으세요 */}
      </div>
      <div className="chat-room">
        {currentPosts.map((item, index) => (
          <Chatroom key={index} roomId={item.roomId} />
        ))}
      </div>
    </div>
  );
};

export default Chat;
