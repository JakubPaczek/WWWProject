import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import Header from '../components/Header';

export default function ChatRoomWrapper() {
    const { room } = useParams();
    const username = localStorage.getItem('username') || '';
    const token = localStorage.getItem('token') || '';

    if (!room || !token || !username) {
        return (
            <>
                <Header />
                <div className="pt-16 text-center">Brak dostępu – nie zalogowano lub brak pokoju.</div>
            </>
        );
    }

    return (
        <>
            <Header />
            <ChatRoom room={room} token={token} username={username} />
        </>
    );
}
