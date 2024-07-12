import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CRUD.css';
import axios from 'axios';

function ReadJoy() {
  const { no } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드에서 게시글 목록을 가져옴
    axios
      .get(`/joy/read/${no}`) // 추출한 매개변수를 사용하여 요청 URL 구성
      .then((response) => {
        console.log('응답 데이터:', response.data); // 응답 데이터 출력
        setPost(response.data); // 데이터를 상태에 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the post!', error);
        setError('There was an error fetching the post!');
        setLoading(false);
      });
  }, [no]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const { title, nickname, created_date, content } = post.post;

  return (
    <div className="post-container">
      <CRUDHeader title="기쁨이 게시판" />
      <div>{title}</div>
      <div>
        <div>
          <div>프사</div>
          <div>{nickname}</div>
          <div>{created_date}</div>
        </div>
        <div>
          <div>수정</div>
          <div>삭제</div>
        </div>
      </div>
      <div>
        <p>HOPINFO는 서로의 아픔을 공감하고 위로하는 커뮤니티입니다.</p>
        <p>회원들끼리 서로 존중하고, 응원과 조언을 아끼지 않는 자랑스러운 회원이 되도록 합시다.</p>
      </div>
      <div>{content}</div>
      <div>
        <div>로고</div>
        <div>댓글</div>
      </div>
      <div>댓글들</div>
      <div>댓글입력창</div>
    </div>
  );
}

export default ReadJoy;
