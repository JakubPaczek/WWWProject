import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';

export default function ChatRoomWrapper() {
    const { room } = useParams();
    const username = localStorage.getItem('username') || '';
    const token = localStorage.getItem('token') || '';

    if (!room || !token || !username) {
        return (
                <div className="text-center">Brak dostępu – nie zalogowano lub brak pokoju.</div>
        );
    }

    return (
            <ChatRoom room={room} token={token} username={username} />
    );
}
