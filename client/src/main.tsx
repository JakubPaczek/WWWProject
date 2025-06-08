import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import LoginPage from './pages/LoginPage.tsx';
import RoomsPage from './pages/RoomsPage.tsx';
import ChatRoomWrapper from './pages/ChatRoomWrapper';
import ProtectedRoute from './components/ProtectedRoute';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter basename="/WWWProject">
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
    </HashRouter>
  </React.StrictMode>
);