import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoomsPage from './pages/RoomsPage';
import ChatRoomWrapper from './pages/ChatRoomWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <div className="pt-16">
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
      </div>
    </>
  );
}
