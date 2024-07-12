import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ElementCommunity.css';

function SelectButtonCommunity() {
  const location = useLocation();

  return (
    <div className="SelectButtonCommunity">
      <Link to="/community/joy" className={location.pathname === '/joy' ? 'active-button' : 'inactive-button'}>
        기쁨이
      </Link>
      <Link
        to="/community/sadness"
        className={location.pathname === '/community/sadness' ? 'active-button' : 'inactive-button'}
      >
        슬픔이
      </Link>
      <Link
        to="/community/anxiety"
        className={location.pathname === '/community/anxiety' ? 'active-button' : 'inactive-button'}
      >
        불안이
      </Link>
      <Link
        to="/community/fear"
        className={location.pathname === '/community/fear' ? 'active-button' : 'inactive-button'}
      >
        소심이
      </Link>
      <Link
        to="/community/notice"
        className={location.pathname === '/community/fear' ? 'active-button' : 'inactive-button'}
      >
        공지사항
      </Link>
    </div>
  );
}

export default SelectButtonCommunity;
