import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ElementCommunity.css';

function SelectButtonCommunity() {
  const location = useLocation();

  return (
    <div className="SelectButtonCommunity">
      <Link
        to="/process/Community/joy"
        className={location.pathname === '/process/Community/joy' ? 'active-button' : 'inactive-button'}
      >
        기쁨이
      </Link>
      <Link
        to="/process/Community/sadness"
        className={location.pathname === '/process/Community/sadness' ? 'active-button' : 'inactive-button'}
      >
        슬픔이
      </Link>
      <Link
        to="/process/Community/anxiety"
        className={location.pathname === '/process/Community/anxiety' ? 'active-button' : 'inactive-button'}
      >
        불안이
      </Link>
      <Link
        to="/process/Community/fear"
        className={location.pathname === '/process/Community/fear' ? 'active-button' : 'inactive-button'}
      >
        소심이
      </Link>
      <Link
        to="/process/Community/notice"
        className={location.pathname === '/process/Community/fear' ? 'active-button' : 'inactive-button'}
      >
        공지사항
      </Link>
    </div>
  );
}

export default SelectButtonCommunity;
