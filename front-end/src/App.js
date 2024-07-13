import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar.js';
import Home from './components/home/Home.js';
import Information from './components/information/Information.js';
import Hospital from './components/hospital/Hospital.js';
import JoyCommunity from './components/community/JoyCommunity.js';
import SadnessCommunity from './components/community/SadnessCommunity.js';
import AnxietyCommunity from './components/community/AnxietyCommunity.js';
import FearCommunity from './components/community/FearCommunity.js';
import NoticeCommunity from './components/community/NoticeCommunity.js';
import Loginpage from './components/mypage/Loginpage.js';
import Signuppage from './components/mypage/Signuppage.js';
import Mypage from './components/mypage/Mypage.js';
import Footer from './components/Footer.js';
import CreateJoy from './components/community/CRUD/CreateJoy.js';
import ReadJoy from './components/community/CRUD/ReadJoy.js';
import UpdateJoy from './components/community/CRUD/UpdateJoy.js';
import CreateComment from './components/community/comments/CreateComment.js';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/information" element={<Information />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/joy" element={<JoyCommunity />} />
            <Route path="/sadness" element={<SadnessCommunity />} />
            <Route path="/anxiety" element={<AnxietyCommunity />} />
            <Route path="/fear" element={<FearCommunity />} />
            <Route path="/notice" element={<NoticeCommunity />} />
            <Route path="/Loginpage" element={<Loginpage />} />
            <Route path="/Signuppage" element={<Signuppage />} />
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/joy/process/new_Post" element={<CreateJoy />} />
            <Route path="/joy/PostView/:no" element={<ReadJoy />} />
            <Route path="/joy/Postview/:no/process/update" element={<UpdateJoy />} />
            <Route path="/joy/PostView/:postId/comments" element={<CreateComment />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
