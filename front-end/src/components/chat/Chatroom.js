import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chatroom.css';

const Chatroom = () => {
  const { my_roomid, roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);

  // 주기적으로 메시지를 가져오는 함수
  const fetchMessages = async () => {
    try {
      console.log(`Fetching messages for roomId: ${roomId}`);
      const response = await axios.get(`/chatrooms/${my_roomid}/to/${roomId}/messages`);
      console.log('Fetched messages:', response.data);
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // 초기 메시지 로드
    fetchMessages();

    // 1초마다 fetchMessages 함수를 호출
    const interval = setInterval(fetchMessages, 100);

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(interval);
  }, [my_roomid, roomId]);

  useEffect(() => {
    if (Array.isArray(messages) && messages.length) {
      setRoomMessages(
        messages.filter(
          (msg) =>
            (msg.receiver_id === parseInt(roomId) && msg.sender_id === parseInt(my_roomid)) ||
            (msg.receiver_id === parseInt(my_roomid) && msg.sender_id === parseInt(roomId))
        )
      );
    }
  }, [messages, roomId, my_roomid]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const sender_id = parseInt(my_roomid);
      const receiver_id = parseInt(roomId); // 현재 대화 상대방의 roomId로 사용됩니다.

      console.log('Sending message:', {
        sender_id,
        receiver_id,
        content: newMessage,
      });

      // 백엔드에 새 메시지 보내기
      const response = await axios.post(`/chatrooms/${my_roomid}/to/${roomId}/messages`, {
        sender_id,
        receiver_id,
        content: newMessage,
      });

      console.log('Response:', response);

      // 메시지를 성공적으로 보낸 후 메시지 목록 업데이트
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender_id,
          receiver_id,
          content: newMessage,
          isMyMessage: true,
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chattingRoom">
      <h2>
        Chatroom {my_roomid} to {roomId}
      </h2>
      <div>
        {roomMessages.map((msg, index) => (
          <p key={index} className={msg.isMyMessage ? 'my-message' : 'other-message'}>
            {msg.content}
          </p>
        ))}
      </div>
      <div className="inputMessage">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
      </div>
      <button onClick={handleSendMessage} className="sendmessageBtn">
        전송
      </button>
    </div>
  );
};

export default Chatroom;
