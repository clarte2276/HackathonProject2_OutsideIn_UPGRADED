import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ElementCommunity.css';

function SelectButtonCommunity() {
  const location = useLocation();

  return (
    <div className="SelectButtonCommunity">
      <Link
        to="/process/community/joy"
        className={location.pathname === '/process/community/joy' ? 'active-button' : 'inactive-button'}
      >
        기쁨이
      </Link>
      <Link
        to="/process/community/sadness"
        className={location.pathname === '/process/community/sadness' ? 'active-button' : 'inactive-button'}
      >
        슬픔이
      </Link>
      <Link
        to="/process/community/anxiety"
        className={location.pathname === '/process/community/anxiety' ? 'active-button' : 'inactive-button'}
      >
        불안이
      </Link>
      <Link
        to="/process/community/fear"
        className={location.pathname === '/process/community/fear' ? 'active-button' : 'inactive-button'}
      >
        소심이
      </Link>
      <Link
        to="/process/community/notice"
        className={location.pathname === '/process/community/fear' ? 'active-button' : 'inactive-button'}
      >
        공지사항
      </Link>
    </div>
  );
}

export default SelectButtonCommunity;
