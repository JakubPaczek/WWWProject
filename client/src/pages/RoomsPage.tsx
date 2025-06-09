import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

interface Room {
    id: number;
    name: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        axios
            .get('https://wwwproject.onrender.com/rooms', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setRooms(res.data))
            .catch((err) => {
                console.error('Nie udało się pobrać pokojów:', err);
            });
    }, [token]);

    const handleJoin = (roomName: string) => {
        navigate(`/chat/${encodeURIComponent(roomName)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
            <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-6">Wybierz pokój</h1>

                <div className="w-full max-w-md flex flex-col gap-3 mb-6">
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded text-center"
                            onClick={() => handleJoin(room.name)}
                        >
                            {room.name}
                        </button>
                    ))}
                </div>

                <button
                    className="text-sm text-red-600 underline"
                    onClick={handleLogout}
                >
                    Wyloguj
                </button>
            </div>
    );
}
