import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Flow from './App';
import EasyConnectExample from './easyconnect/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Flow/> */}
    <EasyConnectExample/>
  </React.StrictMode>
);

