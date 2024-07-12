import React from 'react';
import TitleBodyCommunity from './element/TitleBodyCommunity.js';
import SelectButtonCommunity from './element/SelectButtonCommunity.js';
import './Community.css';

function JoyCommunity() {
  return (
    <>
      <div className="BoardTop_layout">
        <TitleBodyCommunity title="기쁨이" body="본인의 챌린지 및 치료 후기를 적어주세요!" />
        <div className="SelectButtonCommunity_layout">
          <SelectButtonCommunity />
        </div>
      </div>
    </>
  );
}

export default JoyCommunity;
