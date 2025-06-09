import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { connectSocket, disconnectSocket } from '../socket';
import { useNavigate } from 'react-router-dom';

type Message = {
    username: string;
    content: string;
    timestamp: number;
};

const BASE_URL = 'https://wwwproject.onrender.com';

export default function ChatRoom({
    username,
    room,
    token,
}: {
    username: string;
    room: string;
    token: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = connectSocket(token);

        socket.emit('join', room);

        socket.on('message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        axios
            .get(`${BASE_URL}/messages/${room}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => {
                console.error('Błąd pobierania wiadomości:', err);
            });

        return () => {
            socket.off('message');
            disconnectSocket();
        };
    }, [room, token]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > 500) return;

        const socket = connectSocket(token); // pewność, że istnieje połączenie
        socket.emit('message', { room, content: trimmed });
        setContent('');
    };

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleLeave = () => {
        disconnectSocket();
        navigate('/rooms');
    };

    return (
            <div className="max-w-xl mx-auto flex flex-col h-screen p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Pokój: {room}</h2>
                    <button
                        onClick={handleLeave}
                        className="text-sm text-red-600 underline"
                    >
                        Opuść pokój
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded shadow">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`mb-2 p-2 rounded ${m.username === username
                                    ? 'bg-blue-200 text-right'
                                    : 'bg-white text-left'
                                }`}
                        >
                            <div className="text-sm font-semibold">{m.username}</div>
                            <div>{m.content}</div>
                            <div className="text-xs text-gray-500">{formatTime(m.timestamp)}</div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="flex mt-4 gap-2">
                    <input
                        className="flex-1 p-2 border rounded shadow"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                        placeholder="Wpisz wiadomość..."
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        Wyślij
                    </button>
                </div>
            </div>
    );
}
