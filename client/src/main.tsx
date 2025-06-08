import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import LoginPage from './pages/LoginPage.tsx';
import RoomsPage from './pages/RoomsPage.tsx';
import ChatRoom from './pages/ChatRoom.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    //<App />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/chat/:room" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);