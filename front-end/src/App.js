import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.js';
import Header from './components/home/Header.js';
import Information from './components/information/Information.js';
import Hospital from './components/hospital/Hospital.js';
import JoyCommunity from './components/community/JoyCommunity.js';

const Home = () => {
  return (
    <div>
      <Header title1="모바일로 쉽고 간편하게!" title2="건강한 생활을" title3="즐겨봐요!"></Header>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<Information />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/process/community/joy" element={<JoyCommunity />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
