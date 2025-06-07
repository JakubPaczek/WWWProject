import ChatRoom from './ChatRoom';
import './index.css';

function App() {
  // tymczasowe dane testowe
  const username = 'jakub';
  const room = 'Informatyka';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impha3ViIiwiaWF0IjoxNzQ5MTQwOTkxLCJleHAiOjE3NDkxNDQ1OTF9.Kfn6qNwRDtDyUcSPX6s_lOS_mGaMFARKH5F-AE2-kSs';

  return (
    <ChatRoom username={username} room={room} token={token} />
  );
}

export default App;
