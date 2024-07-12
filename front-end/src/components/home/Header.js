import React from 'react';
import './Header.css';
import HeaderImg from '../images/header.png';

function Header(props) {
  return (
    <div className="header">
      <header>
        <h1>
          <div className="line1">
            <p>{props.title1}</p>
          </div>
          <div className="line2">
            <p>{props.title2}</p>
            <p>{props.title3}</p>
          </div>
        </h1>
        <div className="headerImg">
          <img src={HeaderImg} alt=""></img>
        </div>
      </header>
    </div>
  );
}

export default Header;
