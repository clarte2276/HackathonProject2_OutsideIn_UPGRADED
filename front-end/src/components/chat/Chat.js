import React, { useEffect, useState } from 'react';
import CommonTable2 from './chatList/CommonTable2';
import CommonTableColumn2 from './chatList/CommonTableColumn2';
import CommonTableRow2 from './chatList/CommonTableRow2';
import CustomPagination from '../board/Pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chatroom from './Chatroom';

const Chat = () => {
  const navigate = useNavigate();
  const { roomid, fetchUserData } = useUserData();

  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openPopup = (my_roomid, roomId) => {
    if (!my_roomid) {
      console.error('My Room ID is not defined');
      return;
    }

    // 팝업 url 여기서 설정 후 불러와야함
    const url = `/Chatroom/${my_roomid}/to/${roomId}`;
    const title = 'popup';
    const options = 'toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=400,height=500,top=100,left=200';
    window.open(url, title, options);

    // console.log(my_roomid);
    // openChatroomPopup(my_roomid, roomId);
  };

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
        <h1>채팅 대기실</h1>
        <div className="chatMain_body">이곳은 1:1 채팅 대기실입니다.</div>
        <div>대화에 참여해 새로운 만남을 경험해 보세요!</div>
      </div>
      <CommonTable2 headersName={['닉네임', '상태', '대화하기']}>
        {currentPosts.map((item, index) => (
          <CommonTableRow2 key={index}>
            <CommonTableColumn2>
              <div className="img_name">
                <img className="userImg" src={userImg} alt=""></img>
                <div>{item.nickname}</div>
              </div>
            </CommonTableColumn2>
            <CommonTableColumn2>
              <div className={getShadowClass(item.state)}>{item.state}</div>
            </CommonTableColumn2>
            <CommonTableColumn2>
              <button className="ChatIn" onClick={() => openPopup(roomid, item.roomId)}>
                <div>참여</div>
              </button>
            </CommonTableColumn2>
          </CommonTableRow2>
        ))}
      </CommonTable2>
      <div className="pagination">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(dataList.length / postsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Chat;
