import { useEffect, useRef, useState } from 'react';
import socket from './socket';
import axios from 'axios';

type Message = {
    username: string;
    content: string;
    timestamp: number;
};

export default function ChatRoom({ username, room, token }: { username: string; room: string; token: string; }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.emit('join', room);

        socket.on('message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        axios
            .get(`http://localhost:5000/messages/${room}`, {
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
        };
    }, [room]);

    // Autoscroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 500) return;

    socket.emit('message', { room, content: trimmed, username });
    setContent('');
    };


    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-xl mx-auto flex flex-col h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Pokój: {room}</h2>

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
