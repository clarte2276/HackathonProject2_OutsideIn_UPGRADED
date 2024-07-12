import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = (initialData = {}) => {
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [usernickname, setUsernickname] = useState(initialData.usernickname || '');
  const [birth, setBirth] = useState(initialData.birth || '');
  const [gender, setGender] = useState(initialData.gender || '');
  const [userId, setUserId] = useState(initialData.userId || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [state, setState] = useState(initialData.state || '');

  const fetchUserData = async () => {
    try {
      // 사용자가 로그인한 후 호출 (유저정보 가져오기)
      const response = await axios.get('/loginpage/process/login');
      const userData = response.data;

      setFirstName(userData.Lastname || '');
      setLastName(userData.Firstname || '');
      setUsernickname(userData.nickname || '');
      setBirth(userData.birth || '');
      setGender(userData.gender || '');
      setUserId(userData.id || ''); // 아이디 값 변경 불가
      setPassword(userData.password || '');
      setState(userData.state || '');
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchUserData();
    }
  }, []);

  const handleSave = async () => {
    try {
      const updateData = {
        lastName,
        firstName,
        gender,
        birth,
        usernickname,
        id: userId,
        password,
        state,
      };

      // 정보 수정 시 데이터 전달 경로
      const response = await axios.post('/mypage/process/update', updateData);

      if (response.status === 200) {
        alert('변경사항이 저장되었습니다.');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('변경사항을 저장하는 데 오류가 발생했습니다:', error);
      alert('변경사항을 저장하는 데 오류가 발생했습니다.');
    }
  };

  return {
    firstName,
    lastName,
    usernickname,
    birth,
    gender,
    userId,
    password,
    state,
    setFirstName,
    setLastName,
    setUsernickname,
    setBirth,
    setGender,
    setUserId,
    setPassword,
    setState,
    handleSave,
  };
};

export default useUserData;
