import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ onFunction1, onFunction2, onFunction3, onFunction4 }) => {
  return (
    <div className="sidebar">
      <img src="/s1.png" alt="Function 1" className="function-btn" onClick={onFunction1} />
      <img src="/s6.png" alt="Function 2" className="function-btn" onClick={onFunction2} />
      <img src="/s3.png" alt="Function 3" className="function-btn" onClick={onFunction3} />
      <img src="/s4.png" alt="Function 4" className="function-btn" onClick={onFunction4} />
    </div>
  );
};

export default Sidebar;
