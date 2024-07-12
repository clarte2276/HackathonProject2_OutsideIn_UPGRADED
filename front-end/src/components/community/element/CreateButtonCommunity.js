import React from 'react';
import { Link } from 'react-router-dom';

function CreateButtonCommunity({ emotion, nextNo }) {
  return (
    <div className="CreateButton">
      <Link className="CreateButtonCommunity" to={`/BoardWrite/${emotion}`} state={{ nextNo }}>
        새 글 작성
      </Link>
    </div>
  );
}

export default CreateButtonCommunity;
