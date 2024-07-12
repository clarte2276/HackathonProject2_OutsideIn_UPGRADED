import React from 'react';
import Header from './Header';
import Login from './Login';

function Home() {
  return (
    <div>
      <Header title1="모바일로 쉽고 간편하게!" title2="건강한 생활을" title3="즐겨봐요!"></Header>
      <div>
        <Login></Login>
      </div>
    </div>
  );
}

export default Home;
