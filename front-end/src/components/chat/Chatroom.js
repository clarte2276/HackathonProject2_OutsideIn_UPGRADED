import React, { useState } from 'react';
import './Chatroom.css';

function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // 여기서는 테스트용으로 메시지를 바로 추가합니다. 실제로는 백엔드와 통신하여 메시지를 전송해야 합니다.
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: newMessage,
        isMyMessage: true, // 사용자가 보낸 메시지를 구분하기 위한 플래그
      },
    ]);
    setNewMessage('');
  };

  const MessageList = ({ messages }) => (
    <div className="messages-list">
      {messages.map((message, index) => (
        <div key={index} className={message.isMyMessage ? 'my-message' : 'other-message'}>
          {message.content}
        </div>
      ))}
    </div>
  );

  const MessageForm = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();
      onSendMessage(message);
      setMessage('');
    };

    return (
      <form className="message-form" onSubmit={handleSubmit}>
        <input type="text" className="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    );
  };

  return (
    <div className="chatRoom">
      <h1>Chat App</h1>
      <div className="chat-box">
        <MessageList messages={messages} />
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chatroom;
