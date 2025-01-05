import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 动态插入 Google AdSense 脚本
const loadAdSense = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2216607554928934';
    document.body.appendChild(script);
};
loadAdSense();

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();
