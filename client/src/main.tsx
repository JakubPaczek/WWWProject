import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import LoginPage from './pages/LoginPage.tsx';
import RoomsPage from './pages/RoomsPage.tsx';
import ChatRoomWrapper from './pages/ChatRoomWrapper';
import ProtectedRoute from './components/ProtectedRoute';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:room"
          element={
            <ProtectedRoute>
              <ChatRoomWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);